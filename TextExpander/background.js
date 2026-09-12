"use strict";

// Extension installation / update
chrome.runtime.onInstalled.addListener(async () => {
    const result = await chrome.storage.local.get("shortcuts");

    // Create empty shortcut storage only if it doesn't exist
    if (!result.shortcuts) {
        await chrome.storage.local.set({
            shortcuts: {}
        });
    }

    console.log("TextExpander installed successfully.");
});