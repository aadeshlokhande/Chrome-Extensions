(() => {
    "use strict";

    let shortcuts = {};

    // Default shortcuts
    const defaultShortcuts = {
        "brb": "Be right back",
        "ty": "Thank you",
        "omw": "On my way"
    };

    // Load shortcuts from Chrome Storage
    async function loadShortcuts() {
        const result = await chrome.storage.local.get("shortcuts");

        if (result.shortcuts) {
            shortcuts = result.shortcuts;
        } else {
            shortcuts = defaultShortcuts;
            await chrome.storage.local.set({
                shortcuts: defaultShortcuts
            });
        }
    }

    // Listen for changes made through CRUD
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes.shortcuts) {
            shortcuts = changes.shortcuts.newValue || {};
        }
    });

    // Check if element supports text input
    function isTextInput(element) {
        if (!element) return false;

        if (
            element.tagName === "TEXTAREA" ||
            element.tagName === "INPUT"
        ) {
            return !["button", "checkbox", "file", "image", "radio", "range", "reset", "submit"].includes(
                element.type
            );
        }

        return element.isContentEditable;
    }

    // Expand text inside input / textarea
    function expandInput(element, key) {
        const fullText = shortcuts[key];

        if (!fullText) return false;

        const start = element.selectionStart;
        const end = element.selectionEnd;

        if (start === null || end === null) return false;

        const textBeforeCursor = element.value.substring(0, start);

        if (!textBeforeCursor.endsWith(key)) {
            return false;
        }

        const newValue =
            element.value.substring(0, start - key.length) +
            fullText +
            element.value.substring(end);

        element.value = newValue;

        const newCursorPosition =
            start - key.length + fullText.length;

        element.setSelectionRange(
            newCursorPosition,
            newCursorPosition
        );

        // Notify frameworks like React/Vue
        element.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        return true;
    }

    // Expand text inside contenteditable
    function expandContentEditable(element, key) {
        const fullText = shortcuts[key];

        if (!fullText) return false;

        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return false;
        }

        const range = selection.getRangeAt(0);

        if (!range.collapsed) return false;

        const node = range.startContainer;

        if (node.nodeType !== Node.TEXT_NODE) {
            return false;
        }

        const text = node.textContent;
        const cursorPosition = range.startOffset;

        const textBeforeCursor = text.substring(0, cursorPosition);

        if (!textBeforeCursor.endsWith(key)) {
            return false;
        }

        const startPosition = cursorPosition - key.length;

        range.setStart(node, startPosition);
        range.setEnd(node, cursorPosition);

        range.deleteContents();
        range.insertNode(document.createTextNode(fullText));

        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);

        return true;
    }

    // Handle keyboard input
    function handleKeyDown(event) {
        if (event.key !== " " && event.key !== "Enter") {
            return;
        }

        const element = event.target;

        if (!isTextInput(element)) {
            return;
        }

        let textBeforeCursor = "";

        // Input / textarea
        if (
            element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA"
        ) {
            const cursorPosition = element.selectionStart;

            if (cursorPosition === null) return;

            textBeforeCursor = element.value.substring(
                0,
                cursorPosition
            );
        }

        // Contenteditable
        else if (element.isContentEditable) {
            const selection = window.getSelection();

            if (!selection || selection.rangeCount === 0) {
                return;
            }

            const range = selection.getRangeAt(0);
            const node = range.startContainer;

            if (node.nodeType !== Node.TEXT_NODE) {
                return;
            }

            textBeforeCursor = node.textContent.substring(
                0,
                range.startOffset
            );
        }

        // Get last typed word
        const words = textBeforeCursor.split(/\s/);
        const lastWord = words[words.length - 1];

        if (!lastWord) return;

        // Check shortcut
        if (!shortcuts[lastWord]) {
            return;
        }

        // Prevent normal Space / Enter temporarily
        event.preventDefault();

        let expanded = false;

        if (
            element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA"
        ) {
            expanded = expandInput(element, lastWord);
        } else if (element.isContentEditable) {
            expanded = expandContentEditable(
                element,
                lastWord
            );
        }

        // Add original Space / Enter after expansion
        if (expanded) {
            setTimeout(() => {
                const keyboardEvent = new KeyboardEvent("keydown", {
                    key: event.key,
                    code: event.code,
                    keyCode: event.keyCode,
                    which: event.which,
                    bubbles: true
                });

                element.dispatchEvent(keyboardEvent);
            }, 0);
        }
    }

    // Initialize
    loadShortcuts();

    // Global keyboard listener
    document.addEventListener(
        "keydown",
        handleKeyDown,
        true
    );
})();