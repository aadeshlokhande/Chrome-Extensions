"use strict";

const shortcutCount = document.getElementById("shortcutCount");
const shortcutList = document.getElementById("shortcutList");
const emptyState = document.getElementById("emptyState");
const manageButton = document.getElementById("manageButton");

// Load shortcuts from Chrome Storage
async function loadShortcuts() {
    try {
        const result = await chrome.storage.local.get("shortcuts");

        const shortcuts = result.shortcuts || {};

        displayShortcuts(shortcuts);
    } catch (error) {
        console.error("Failed to load shortcuts:", error);
    }
}

// Display shortcuts
function displayShortcuts(shortcuts) {
    const entries = Object.entries(shortcuts);

    // Update count
    shortcutCount.textContent = entries.length;

    // Clear previous list
    shortcutList.innerHTML = "";

    // Empty state
    if (entries.length === 0) {
        shortcutList.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    shortcutList.style.display = "flex";
    emptyState.style.display = "none";

    // Show maximum 5 recent shortcuts
    const recentShortcuts = entries.slice(0, 5);

    recentShortcuts.forEach(([key, value]) => {
        const item = document.createElement("div");

        item.className = "shortcut-item";

        item.innerHTML = `
            <span class="shortcut-key">${escapeHTML(key)}</span>
            <span class="shortcut-arrow">→</span>
            <span class="shortcut-value">${escapeHTML(value)}</span>
        `;

        shortcutList.appendChild(item);
    });
}

// Prevent HTML injection
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Open options page
manageButton.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});

// Initial load
loadShortcuts();