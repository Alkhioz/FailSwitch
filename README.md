# FailSwitch

**FailSwitch** is a Chrome extension that allows developers and QA teams to simulate network failures by selectively blocking requests based on URL patterns. It's useful for testing error handling, loading states, and offline scenarios — all without modifying server code.

## 🚀 Features

- 🔌 Enable/disable network interception via popup
- 🎯 Block requests based on URL patterns
- 🧰 Manage rules through an options page
- 🧠 DeclarativeNetRequest-based (Manifest V3)
- 💾 Fully local — no data leaves your browser

## 📦 Installation

1. Clone this repo or download it as a ZIP.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select the `extension/` folder.
5. Click the FailSwitch icon to enable/disable blocking.