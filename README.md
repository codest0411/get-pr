# get-PR ✨

> **Stop writing PR descriptions manually.** Let AI do it in one click.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Free to Use](https://img.shields.io/badge/Free-No_API_Key-22c55e)
![AI Powered](https://img.shields.io/badge/AI-Claude_Sonnet_4.6-7c3aed)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

---

## What is get-PR?

**get-PR** is a Chrome Extension that auto-generates professional GitHub Pull Request descriptions using free Claude AI. No API key. No backend. No cost.

Just open any GitHub PR page, click **"✨ Draft with AI"**, and get a complete PR description in seconds.

---

## ✨ Features

- 🔍 **Smart Diff Analysis** — Reads files changed, commits, additions/deletions, and actual diff lines directly from the GitHub DOM
- 🤖 **Free AI Generation** — Uses Claude Sonnet 4.6 via Puter.js (zero API key needed)
- ✍️ **Auto-Fill** — Fills the PR title and description textarea automatically
- 📋 **Side Panel** — Beautiful slide-in panel showing title, summary, changes, breaking changes, labels, and checklist
- 🎨 **Dark Mode** — Auto-matches GitHub's light/dark theme
- 🎯 **Tone Selector** — Choose Professional, Concise, or Detailed output
- 📎 **Copy & Apply** — One-click copy to clipboard or apply to PR form
- 🔄 **SPA-Aware** — Works with GitHub's single-page navigation

---

## 📸 Demo

> **GIF placeholder:** The demo GIF should show:
> 1. Opening a GitHub PR creation page
> 2. The "✨ Draft with AI" floating button appearing above the textarea
> 3. Selecting a tone (Professional/Concise/Detailed)
> 4. Clicking the button → loading spinner → textarea auto-fills
> 5. The side panel sliding in with formatted output
> 6. Clicking "Copy All" or "Apply to PR"

---

## 🚀 Installation

1. **Download** this repository (or clone it):
   ```bash
   git clone https://github.com/your-username/get-PR.git
   ```

2. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions`
   - Enable **Developer Mode** (toggle in top-right)

3. **Load the extension**:
   - Click **"Load unpacked"**
   - Select the `get-PR` folder

4. **Done!** Navigate to any GitHub PR page and see the magic.

---

## 🎯 How It Works

### 3 Simple Steps

| Step | What happens |
|------|-------------|
| **1. Extract** | Reads the diff, files, commits, and branch info from the GitHub page DOM |
| **2. Generate** | Sends the data to Claude Sonnet 4.6 (free via Puter.js) to generate a structured PR description |
| **3. Fill** | Auto-fills the PR title + description and shows a detailed side panel |

### What You Get

The AI generates a structured JSON that includes:

- **Title** — Clean, conventional-commit-style PR title
- **Summary** — 2-3 sentence explanation of what changed and why
- **Changes** — Bullet list of specific changes with function/component names
- **Breaking Changes** — Highlighted if any
- **Testing Notes** — How to verify the PR
- **Review Focus** — Areas reviewers should pay attention to
- **Suggested Labels** — e.g., `bug`, `enhancement`, `documentation`
- **Checklist** — Standard PR checklist items
- **Estimated Review Time** — 5 mins / 15 mins / 30 mins / 1 hour

---

## 💰 Free to Use

get-PR uses **[Puter.js](https://puter.com)** to access Claude Sonnet 4.6 for free:

- ✅ **No API key required**
- ✅ **No backend or server**
- ✅ **No account needed**
- ✅ **No usage limits** (fair use)
- ✅ **No data stored externally**

---

## 🔒 Privacy

- **No data is stored** — Everything happens in your browser
- **No backend** — Direct API call to Puter.js from the extension
- **No tracking** — Zero analytics, zero telemetry
- **No accounts** — No sign-up, no login
- **Open source** — Inspect the code yourself

The extension only reads the GitHub DOM on PR pages and sends the diff data to Puter's free AI API for generation. Nothing is persisted.

---

## 📁 Project Structure

```
get-PR/
├── manifest.json          ← Extension config (Manifest V3)
├── background.js          ← Service worker (minimal)
├── content.js             ← Main orchestrator
├── puter.js               ← Free AI wrapper (Puter.js Claude API)
├── prompt.js              ← Builds AI prompt from diff data
├── extractor.js           ← Extracts diff data from GitHub DOM
├── ui/
│   ├── button.js          ← Injects the "Draft with AI" button
│   ├── panel.js           ← Side panel to show AI output
│   └── styles.css         ← Dark/light themed styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Test on a real GitHub PR page
5. Submit a Pull Request (and use get-PR to write the description 😄)

### Ideas for Contribution

- [ ] Add support for GitLab / Bitbucket
- [ ] Keyboard shortcut to trigger generation
- [ ] Template customization in extension options
- [ ] History of generated descriptions
- [ ] Support for PR comments / review comments

---

## 📄 License

MIT — use it however you want.

---

<p align="center">
  <strong>get-PR</strong> — AI-powered PR descriptions, zero cost.<br/>
  Built with ✨ and free Claude AI via Puter.js
</p>
