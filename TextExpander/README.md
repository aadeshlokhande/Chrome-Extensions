# TextExpander

A simple, fast, and lightweight Chrome extension that automatically
expands short forms into full phrases.

## 🚀 Overview

TextExpander helps you save time by replacing frequently used short
forms with their corresponding full phrases.

Simply type a saved shortcut and press **Space** or **Enter**.
TextExpander automatically replaces the shortcut with the full phrase.

### Example

``` text
brb + Space → Be right back

gm + Space → Good morning

tysm + Enter → Thank you so much
```

## ✨ Features

-   ⚡ Instant text expansion
-   ⌨️ Expand shortcuts using Space or Enter
-   🔄 Always active while browsing
-   ➕ Create new shortcuts
-   👀 View saved shortcuts
-   ✏️ Edit existing shortcuts
-   🗑️ Delete shortcuts
-   🔍 Search shortcuts
-   💾 Store shortcuts locally using Chrome Storage
-   🎨 Clean and simple user interface
-   🔒 No account or sign-up required
-   🚫 No external server required for shortcut storage

## 🛠️ How It Works

TextExpander runs automatically on supported webpage text fields.

When you type a shortcut followed by Space or Enter:

1.  The extension detects the last typed word.
2.  It checks whether the word matches a saved shortcut.
3.  If a match is found, the shortcut is replaced with the saved phrase.
4.  The user can continue typing normally.

## 📋 Shortcut Management

The management dashboard provides complete CRUD functionality:

  Operation   Description
  ----------- -------------------------------------
  Create      Add a new shortcut and full phrase
  Read        View all saved shortcuts
  Update      Edit an existing shortcut or phrase
  Delete      Remove a saved shortcut

You can also search shortcuts by either the short form or the expanded
phrase.

## 💾 Data Storage

TextExpander uses Chrome's local storage to save shortcut information.

Example:

``` json
{
  "shortcuts": {
    "brb": "Be right back",
    "gm": "Good morning",
    "tysm": "Thank you so much"
  }
}
```

Shortcut data is stored locally in the user's browser.

## 🔒 Privacy

TextExpander does not require an account and does not send shortcut data
to an external server.

The extension processes text locally in the browser to provide its text
expansion functionality.

For complete details, please refer to the project's Privacy Policy.

## 🎯 Use Cases

TextExpander can be useful for:

-   Email responses
-   Customer support
-   Frequently used messages
-   Professional communication
-   Coding snippets
-   Repetitive text
-   Common greetings
-   Daily phrases
-   Templates and responses

## 🧩 Technology

-   JavaScript
-   HTML
-   CSS
-   Chrome Extension Manifest V3
-   Chrome Storage API

## 📁 Project Structure

``` text
TextExpander/
│
├── manifest.json
├── background.js
├── content.js
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🔮 Future Plans

Future versions may introduce advanced productivity features while
keeping the extension lightweight and easy to use.

Possible improvements include:

-   Import and export shortcuts
-   Shortcut categories
-   Backup and restore
-   Keyboard shortcuts
-   Advanced expansion options
-   Enable/disable individual shortcuts
-   Better organization of large shortcut collections

## 📄 License

This project is intended for personal and productivity use. Add your
preferred license here if the project is distributed as open source.

------------------------------------------------------------------------

**TextExpander --- Type less. Save time. Get more done. 🚀**
