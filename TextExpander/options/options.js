"use strict";

// ================================
// DOM ELEMENTS
// ================================

const searchInput = document.getElementById("searchInput");

const addShortcutButton =
    document.getElementById("addShortcutButton");

const emptyAddButton =
    document.getElementById("emptyAddButton");

const shortcutTableBody =
    document.getElementById("shortcutTableBody");

const emptyState =
    document.getElementById("emptyState");

const totalShortcuts =
    document.getElementById("totalShortcuts");

const activeShortcuts =
    document.getElementById("activeShortcuts");


// Add/Edit Modal
const shortcutModal =
    document.getElementById("shortcutModal");

const shortcutForm =
    document.getElementById("shortcutForm");

const shortcutInput =
    document.getElementById("shortcutInput");

const phraseInput =
    document.getElementById("phraseInput");

const modalTitle =
    document.getElementById("modalTitle");

const closeModalButton =
    document.getElementById("closeModalButton");

const cancelButton =
    document.getElementById("cancelButton");

const formError =
    document.getElementById("formError");


// Delete Modal
const deleteModal =
    document.getElementById("deleteModal");

const deleteShortcutName =
    document.getElementById("deleteShortcutName");

const cancelDeleteButton =
    document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");


// Toast
const toast =
    document.getElementById("toast");


// ================================
// VARIABLES
// ================================

let shortcuts = {};
let editingShortcut = null;
let deletingShortcut = null;


// ================================
// LOAD SHORTCUTS
// ================================

async function loadShortcuts() {
    try {
        const result =
            await chrome.storage.local.get("shortcuts");

        shortcuts = result.shortcuts || {};

        renderShortcuts();
    } catch (error) {
        console.error(
            "Failed to load shortcuts:",
            error
        );

        showToast("Failed to load shortcuts.");
    }
}


// ================================
// SAVE SHORTCUTS
// ================================

async function saveShortcuts() {
    try {
        await chrome.storage.local.set({
            shortcuts: shortcuts
        });

        return true;
    } catch (error) {
        console.error(
            "Failed to save shortcuts:",
            error
        );

        showToast("Failed to save shortcuts.");

        return false;
    }
}


// ================================
// RENDER SHORTCUTS
// ================================

function renderShortcuts() {

    shortcutTableBody.innerHTML = "";

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const entries = Object.entries(shortcuts);

    const filteredEntries = entries.filter(
        ([key, value]) => {

            return (
                key.toLowerCase().includes(searchTerm) ||
                value.toLowerCase().includes(searchTerm)
            );
        }
    );


    // Update statistics
    totalShortcuts.textContent = entries.length;
    activeShortcuts.textContent = entries.length;


    // No results
    if (filteredEntries.length === 0) {

        emptyState.style.display = "block";

        if (entries.length > 0) {
            emptyState.querySelector("h2").textContent =
                "No matching shortcuts";

            emptyState.querySelector("p").textContent =
                "Try searching with another keyword.";
        } else {
            emptyState.querySelector("h2").textContent =
                "No shortcuts found";

            emptyState.querySelector("p").textContent =
                "Create your first shortcut to start expanding text automatically.";
        }

        return;
    }


    emptyState.style.display = "none";


    // Create rows
    filteredEntries.forEach(
        ([key, value]) => {

            const row =
                document.createElement("div");

            row.className = "shortcut-row";


            // Shortcut
            const shortcutCell =
                document.createElement("div");

            const shortcutBadge =
                document.createElement("span");

            shortcutBadge.className =
                "shortcut-key";

            shortcutBadge.textContent = key;

            shortcutCell.appendChild(
                shortcutBadge
            );


            // Phrase
            const phraseCell =
                document.createElement("div");

            phraseCell.className =
                "shortcut-phrase";

            phraseCell.textContent = value;


            // Actions
            const actionCell =
                document.createElement("div");

            actionCell.className = "actions";


            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.className = "edit-button";
            editButton.textContent = "Edit";

            editButton.addEventListener(
                "click",
                () => openEditModal(key)
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener(
                "click",
                () => openDeleteModal(key)
            );


            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);


            row.appendChild(shortcutCell);
            row.appendChild(phraseCell);
            row.appendChild(actionCell);


            shortcutTableBody.appendChild(row);
        }
    );
}


// ================================
// OPEN ADD MODAL
// ================================

function openAddModal() {

    editingShortcut = null;

    modalTitle.textContent =
        "Add Shortcut";

    shortcutForm.reset();

    clearFormError();

    shortcutModal.classList.add("show");

    shortcutModal.setAttribute(
        "aria-hidden",
        "false"
    );

    shortcutInput.focus();
}


// ================================
// OPEN EDIT MODAL
// ================================

function openEditModal(key) {

    editingShortcut = key;

    modalTitle.textContent =
        "Edit Shortcut";

    shortcutInput.value = key;

    phraseInput.value = shortcuts[key];

    clearFormError();

    shortcutModal.classList.add("show");

    shortcutModal.setAttribute(
        "aria-hidden",
        "false"
    );

    shortcutInput.focus();
}


// ================================
// CLOSE ADD/EDIT MODAL
// ================================

function closeModal() {

    shortcutModal.classList.remove("show");

    shortcutModal.setAttribute(
        "aria-hidden",
        "true"
    );

    editingShortcut = null;

    shortcutForm.reset();

    clearFormError();
}


// ================================
// CREATE / UPDATE
// ================================

shortcutForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const key =
            shortcutInput.value.trim();

        const phrase =
            phraseInput.value.trim();


        // Validation
        if (!key) {
            showFormError(
                "Please enter a shortcut."
            );

            shortcutInput.focus();

            return;
        }


        if (!phrase) {
            showFormError(
                "Please enter an expanded phrase."
            );

            phraseInput.focus();

            return;
        }


        // Shortcut cannot contain spaces
        if (/\s/.test(key)) {
            showFormError(
                "Shortcut cannot contain spaces."
            );

            shortcutInput.focus();

            return;
        }


        // Shortcut and phrase cannot be same
        if (
            key.toLowerCase() ===
            phrase.toLowerCase()
        ) {
            showFormError(
                "Shortcut and phrase cannot be the same."
            );

            return;
        }


        const normalizedKey =
            key.toLowerCase();


        // CREATE
        if (editingShortcut === null) {

            if (
                Object.keys(shortcuts).some(
                    existingKey =>
                        existingKey.toLowerCase() ===
                        normalizedKey
                )
            ) {

                showFormError(
                    "This shortcut already exists."
                );

                shortcutInput.focus();

                return;
            }


            shortcuts[key] = phrase;

            const saved =
                await saveShortcuts();

            if (!saved) return;

            closeModal();

            renderShortcuts();

            showToast(
                "Shortcut added successfully."
            );

            return;
        }


        // UPDATE
        const oldKey =
            editingShortcut;


        // Check if key changed
        if (
            key.toLowerCase() !==
            oldKey.toLowerCase()
        ) {

            const duplicate =
                Object.keys(shortcuts).some(
                    existingKey =>
                        existingKey.toLowerCase() ===
                        normalizedKey
                );

            if (duplicate) {

                showFormError(
                    "This shortcut already exists."
                );

                shortcutInput.focus();

                return;
            }


            delete shortcuts[oldKey];
        }


        shortcuts[key] = phrase;


        const saved =
            await saveShortcuts();

        if (!saved) return;


        closeModal();

        renderShortcuts();

        showToast(
            "Shortcut updated successfully."
        );
    }
);


// ================================
// OPEN DELETE MODAL
// ================================

function openDeleteModal(key) {

    deletingShortcut = key;

    deleteShortcutName.textContent =
        key;

    deleteModal.classList.add("show");

    deleteModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


// ================================
// CLOSE DELETE MODAL
// ================================

function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    deletingShortcut = null;
}


// ================================
// DELETE SHORTCUT
// ================================

confirmDeleteButton.addEventListener(
    "click",
    async () => {

        if (!deletingShortcut) return;


        delete shortcuts[deletingShortcut];


        const saved =
            await saveShortcuts();

        if (!saved) return;


        closeDeleteModal();

        renderShortcuts();

        showToast(
            "Shortcut deleted successfully."
        );
    }
);


// ================================
// SEARCH
// ================================

searchInput.addEventListener(
    "input",
    () => {
        renderShortcuts();
    }
);


// ================================
// BUTTON EVENTS
// ================================

addShortcutButton.addEventListener(
    "click",
    openAddModal
);

emptyAddButton.addEventListener(
    "click",
    openAddModal
);

closeModalButton.addEventListener(
    "click",
    closeModal
);

cancelButton.addEventListener(
    "click",
    closeModal
);

cancelDeleteButton.addEventListener(
    "click",
    closeDeleteModal
);


// ================================
// CLOSE MODAL ON BACKDROP CLICK
// ================================

shortcutModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            shortcutModal
        ) {
            closeModal();
        }
    }
);


deleteModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deleteModal
        ) {
            closeDeleteModal();
        }
    }
);


// ================================
// ESCAPE KEY
// ================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeModal();
        closeDeleteModal();
    }
);


// ================================
// FORM ERROR
// ================================

function showFormError(message) {

    formError.textContent = message;

    formError.classList.add("show");
}


function clearFormError() {

    formError.textContent = "";

    formError.classList.remove("show");
}


// ================================
// TOAST
// ================================

let toastTimer;

function showToast(message) {

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");


    toastTimer = setTimeout(
        () => {
            toast.classList.remove("show");
        },
        2500
    );
}


// ================================
// STORAGE CHANGE LISTENER
// ================================

chrome.storage.onChanged.addListener(
    (changes, areaName) => {

        if (
            areaName === "local" &&
            changes.shortcuts
        ) {

            shortcuts =
                changes.shortcuts.newValue || {};

            renderShortcuts();
        }
    }
);


// ================================
// INITIALIZE
// ================================

loadShortcuts();