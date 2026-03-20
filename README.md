<div align="center">

<br/>
<pre align="center">
```
        ██████╗ ███████╗████████╗      ██████╗ ██████╗ 
       ██╔════╝ ██╔════╝╚══██╔══╝     ██╔══██╗██╔══██╗
       ██║  ███╗█████╗     ██║        ██████╔╝██████╔╝
       ██║   ██║██╔══╝     ██║        ██╔═══╝ ██╔══██╗
       ╚██████╔╝███████╗   ██║   ██╗  ██║     ██║  ██║
        ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝     ╚═╝  ╚═╝
```
</pre>
### Stop writing PR descriptions manually. One click. Done.

<br/>

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Free Forever](https://img.shields.io/badge/Free-No_API_Key_Ever-22c55e?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://puter.com)
[![Claude Sonnet](https://img.shields.io/badge/AI-Claude_Sonnet_4.6-7c3aed?style=for-the-badge&logo=anthropic&logoColor=white)](https://puter.com)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-1e40af?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![License MIT](https://img.shields.io/badge/License-MIT-e53e3e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-38a169?style=for-the-badge)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/codest0411/get-PR?style=for-the-badge&color=f59e0b)](https://github.com/codest0411/get-PR/stargazers)

<br/>

> **Open any GitHub PR → Click one button → Get a perfect, production-ready PR description.**
>
> Reads your diff · Understands your code · Writes like a senior engineer

<br/>

---

</div>

<br/>

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [What Gets Generated](#-what-gets-generated)
- [Installation](#-installation)
- [Tech Stack](#-tech-stack)
- [File Structure](#-file-structure)
- [Privacy & Security](#-privacy--security)
- [Why Free Forever](#-why-free-forever)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

---

<br/>

## 🔥 The Problem

Every developer has written this PR description at least once:

```
fix stuff
```

Or the slightly better but still useless:

```
Updated the login page and fixed some bugs
```

Writing a proper PR description takes 10–15 minutes. You have to:
- Remember every change you made across 20 files
- Figure out which changes are breaking vs non-breaking
- Write clear testing instructions for reviewers
- Think about which teammates should review which parts

**That's 10–15 minutes of context-switching, every single PR, forever.**

Multiply by 5 PRs a week × 50 engineers = **250+ hours/month** of your team wasted writing descriptions nobody reads anyway.

<br/>

---

<br/>

## ✨ The Solution

```
                    ╔═══════════════════════════════════════════╗
                    ║            get-PR in action               ║
                    ╠═══════════════════════════════════════════╣
                    ║                                           ║
                    ║  You open:  github.com/org/repo/pull/42  ║
                    ║                                           ║
                    ║  You see:   [ ✨ Draft with AI ]          ║
                    ║                                           ║
                    ║  You click: ████████████ 4 seconds        ║
                    ║                                           ║
                    ║  You get:   ✅ Perfect PR description     ║
                    ║             ✅ Conventional commit title  ║
                    ║             ✅ Breaking changes flagged   ║
                    ║             ✅ Testing notes written      ║
                    ║             ✅ Review checklist ready     ║
                    ║                                           ║
                    ╚═══════════════════════════════════════════╝
```

get-PR reads your entire diff directly from the GitHub page, sends it to **Claude Sonnet 4.6** (the most capable Claude model) via **Puter.js** (100% free, no API key), and fills your PR form with a detailed, accurate description — in under 5 seconds.

<br/>

---

<br/>

## 📸 Live Demo

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│  github.com/your-org/your-repo/compare/main...feat/auth │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Pull Request Title                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ feat: Add JWT-based user authentication          │   │  ← AI filled ✓
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [ Professional ▾ ]        [ ✨ Draft with AI ]         │  ← our button
│                                                         │
│  Leave a comment                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ## Summary                                       │   │
│  │ This PR introduces JWT-based authentication to  │   │  ← AI filled ✓
│  │ the API layer, replacing the legacy session      │   │
│  │ approach. Adds login, logout, and token refresh. │   │
│  │                                                  │   │
│  │ ## Changes                                       │   │
│  │ - Added `AuthController.ts` with login/logout    │   │
│  │ - Added `JWTMiddleware.ts` for route protection  │   │
│  │ - Updated `UserModel` to store refresh tokens    │   │
│  │ - Added `authRoutes.ts` with 4 new endpoints     │   │
│  │                                                  │   │
│  │ ## Breaking Changes                              │   │
│  │ - `GET /api/users` now requires Bearer token     │   │
│  │ - Session cookies no longer accepted             │   │
│  │                                                  │   │
│  │ ## Testing                                       │   │
│  │ 1. POST /api/auth/login with valid credentials  │   │
│  │ 2. Use returned token on protected endpoints    │   │
│  │ 3. Verify token expiry after 15 minutes         │   │
│  │                                                  │   │
│  │ ## Checklist                                     │   │
│  │ - [x] Tests added                               │   │
│  │ - [ ] Documentation updated                     │   │
│  │ - [x] No console.log remaining                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │  get-PR ✨   [× close]│  ← side panel
                    ├──────────────────────┤
                    │ feat: Add JWT auth   │
                    │ [feat] [30 min review]│
                    ├──────────────────────┤
                    │ SUMMARY              │
                    │ This PR introduces..│
                    ├──────────────────────┤
                    │ BREAKING  ⚠️          │
                    │ • /api/users needs  │
                    │   Bearer token      │
                    ├──────────────────────┤
                    │ LABELS               │
                    │ [auth] [breaking]   │
                    ├──────────────────────┤
                    │ [Copy All] [Apply]  │
                    └──────────────────────┘
```

</div>

<br/>

---

<br/>

## ⚡ Features

<br/>

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                            FEATURE MATRIX                                    ║
╠══════════════════╦═══════════════════════════════════════════════════════════╣
║  ✨ One-click    ║  Single button → complete PR description. No forms.       ║
║  🔍 Diff reader  ║  Parses files, commits, branch, line stats from DOM      ║
║  🤖 Claude AI    ║  Powered by Claude Sonnet 4.6 — best-in-class writing    ║
║  💸 Free forever ║  Puter.js API — zero cost, zero API key, zero limits     ║
║  🎨 Dark mode    ║  Auto-detects GitHub's light/dark theme                  ║
║  🎯 Tone picker  ║  Professional / Concise / Detailed — you choose          ║
║  📋 Side panel   ║  Slide-in panel with full output + copy + apply          ║
║  ⚡ SPA-aware    ║  Works with GitHub's client-side navigation              ║
║  🏷️  Labels       ║  Suggests appropriate PR labels automatically           ║
║  ⏱️  Review time  ║  Estimates review time (5m / 15m / 30m / 1hr)          ║
║  🚨 Breaking ⚠️  ║  Detects and highlights breaking changes in red         ║
║  ✅ Checklist    ║  Generates a pre-filled review checklist                 ║
╚══════════════════╩═══════════════════════════════════════════════════════════╝
```

<br/>

---

<br/>

## 🧠 How It Works

<br/>

### The 3-step pipeline

```
  STEP 1 — EXTRACT                STEP 2 — GENERATE              STEP 3 — FILL
  ─────────────────               ──────────────────             ─────────────

  GitHub PR Page                  Puter.js Free API              PR Form
  ┌─────────────┐                 ┌──────────────┐               ┌──────────┐
  │ DOM reading │                 │ Claude        │               │ title    │
  │             │                 │ Sonnet 4.6    │               │ body     │
  │ • files[]   │ ─── JSON ────► │               │ ─── JSON ──► │          │
  │ • commits[] │                 │ System prompt │               │ Side     │
  │ • diff lines│                 │ + diff data   │               │ Panel    │
  │ • branch    │                 │               │               │          │
  │ • stats     │                 │ Returns:      │               │ ✅ Done  │
  └─────────────┘                 │ title         │               └──────────┘
                                  │ summary       │
  No GitHub API.                  │ changes[]     │               Zero reload.
  No auth needed.                 │ breaking[]    │               Just filled.
  Just DOM reads.                 │ checklist[]   │
                                  └──────────────┘
                                  Free. Always.
```

<br/>

### What the extractor reads from GitHub DOM

```
  SOURCE                          SELECTOR                         DATA EXTRACTED
  ──────────────────────────────────────────────────────────────────────────────
  PR branch name                  .head-ref                        "feat/auth"
  Base branch                     .base-ref                        "main"
  Repository name                 From window.location             "org/repo"
  Changed files                   .file-header[data-path]          ["auth.ts", ...]
  File extensions                 Parsed from file paths           [".ts", ".json"]
  Commit messages                 .commit-title                    ["feat: add.."]
  Additions count                 .diffstat-summary                "+342"
  Deletions count                 .diffstat-summary                "-18"
  Actual diff lines               .blob-code-inner (first 300)     "+ const jwt..."
  Detected PR type                Branch name heuristics           "feature"
  ──────────────────────────────────────────────────────────────────────────────
  All read locally from the DOM. Zero network requests during extraction.
```

<br/>

---

<br/>

## 🏗️ Architecture

```
  ┌────────────────────────────────────────────────────────────────────┐
  │                        Chrome Browser                              │
  │                                                                    │
  │  ┌──────────────────────────────────────────────────────────────┐ │
  │  │                   get-PR Extension                           │ │
  │  │                                                              │ │
  │  │  manifest.json          background.js                        │ │
  │  │  (MV3 config)           (service worker)                     │ │
  │  │       │                      │                               │ │
  │  │       │ inject on            │ (minimal — no API calls here) │ │
  │  │       ▼ github.com/*/pull/*  │                               │ │
  │  │  ┌────────────────────────────────────────────────────────┐ │ │
  │  │  │                 content scripts                        │ │ │
  │  │  │                                                        │ │ │
  │  │  │  extractor.js    ──►  Reads GitHub DOM                 │ │ │
  │  │  │       │                Returns extractedData {}        │ │ │
  │  │  │       ▼                                                │ │ │
  │  │  │  prompt.js       ──►  Builds AI prompt string          │ │ │
  │  │  │       │                                                │ │ │
  │  │  │       ▼                                                │ │ │
  │  │  │  puter.js        ──►  fetch(api.puter.com/drivers/call)│ │ │
  │  │  │       │                Claude Sonnet 4.6, FREE         │ │ │
  │  │  │       │                Returns JSON result             │ │ │
  │  │  │       ▼                                                │ │ │
  │  │  │  content.js      ──►  Orchestrates everything          │ │ │
  │  │  │       │                                                │ │ │
  │  │  │       ├──►  ui/button.js   Injects "Draft with AI" btn │ │ │
  │  │  │       ├──►  ui/panel.js    Renders slide-in panel      │ │ │
  │  │  │       └──►  ui/styles.css  Dark/light theme styles     │ │ │
  │  │  └────────────────────────────────────────────────────────┘ │ │
  │  └──────────────────────────────────────────────────────────────┘ │
  │                                                                    │
  └────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ ONE fetch call
                                    │ (only when user clicks)
                                    ▼
                      ┌─────────────────────────┐
                      │   api.puter.com          │
                      │   /drivers/call          │
                      │                         │
                      │   Claude Sonnet 4.6      │
                      │   FREE · No key needed   │
                      │   test_mode: true        │
                      └─────────────────────────┘
```

<br/>

---

<br/>

## 📦 What Gets Generated

Every time you click "Draft with AI", Claude returns a structured object that fills your entire PR:

```jsonc
{
  "title":     "feat: Add JWT-based user authentication system",

  "type":      "feat",

  "summary":   "This PR introduces JWT-based authentication to replace
                the legacy session approach. Adds login, logout, and
                token refresh endpoints with middleware for route protection.",

  "changes": [
    "Added AuthController.ts with login/logout/refresh handlers",
    "Added JWTMiddleware.ts for protecting private routes",
    "Updated UserModel to store hashed refresh tokens",
    "Added authRoutes.ts registering 4 new API endpoints",
    "Added auth.test.ts with 12 unit + 4 integration tests"
  ],

  "breaking": [
    "GET /api/users now requires Authorization: Bearer <token>",
    "POST /api/session/* endpoints removed — use /api/auth/* instead"
  ],

  "testingNotes": "1. POST /api/auth/login with { email, password }
                   2. Copy the returned accessToken
                   3. Use it as Bearer on GET /api/users
                   4. Verify 401 on protected routes without token
                   5. Test refresh flow after 15min expiry",

  "reviewFocus": [
    "Token expiry and refresh logic in AuthService.ts",
    "SQL injection safety in UserModel.findByEmail()"
  ],

  "suggestedLabels": ["feature", "auth", "breaking-change", "backend"],

  "checklist": [
    "Tests added and passing",
    "No console.log statements remaining",
    "Environment variables documented in .env.example",
    "Breaking change noted in CHANGELOG.md"
  ],

  "estimatedReviewTime": "30 mins"
}
```

This is then formatted into clean Markdown and injected directly into the GitHub PR textarea. ✅

<br/>

---

<br/>

## 🚀 Installation

<br/>

### Option 1 — Load from source (recommended for now)

```bash
# Step 1 — Clone the repository
git clone https://github.com/codest0411/get-PR.git
cd get-PR

# Step 2 — Open Chrome Extensions page
# → Navigate to: chrome://extensions
# → Enable "Developer Mode" (toggle, top-right corner)

# Step 3 — Load the extension
# → Click "Load unpacked"
# → Select the get-PR/ folder

# Step 4 — Pin it to toolbar (optional but recommended)
# → Click the puzzle icon in Chrome toolbar
# → Click the pin next to "get-PR"

# Step 5 — Test it!
# → Go to any GitHub PR page
# → Look for the "✨ Draft with AI" button above the textarea
# → Click it
```

<br/>

### Option 2 — Chrome Web Store *(coming soon)*

```
[Install from Chrome Web Store] ← button coming when published
```

<br/>

---

<br/>

## 🛠️ Tech Stack

```
  LAYER               TECHNOLOGY              WHY WE CHOSE IT
  ────────────────────────────────────────────────────────────────────
  Extension           Chrome Manifest V3      Latest standard, CSP-safe
  Language            Vanilla JS (ES2022)     Zero build step, instant load
  AI Model            Claude Sonnet 4.6       Best writing quality available
  AI Access           Puter.js REST API       100% free, no auth required
  Styling             Pure CSS Variables      Auto dark/light, no framework
  Storage             chrome.storage.local    Persist last result, zero config
  DOM Manipulation    Native browser APIs     No jQuery, no overhead
  Content Script      Injected on PR pages    Invisible until needed
  ────────────────────────────────────────────────────────────────────

  DELIBERATE CHOICES:
  ✅  Zero npm dependencies        Build works by just loading the folder
  ✅  No transpilation needed      No webpack, no babel, no build script
  ✅  No backend                   No server to maintain, no downtime
  ✅  No auth flow                 No OAuth dance, no tokens to manage
  ✅  Puter.js for AI              Free forever, Claude-quality output
```

<br/>

---

<br/>

## 📁 File Structure

```
get-PR/
│
├── 📄 manifest.json          MV3 config — permissions, host_permissions,
│                             content_script matchers, action
│
├── 📄 background.js          Service worker — minimal, handles SPA
│                             navigation messages from content script
│
├── 📄 content.js             Main orchestrator — waits for GitHub DOM,
│                             injects button, runs the full pipeline,
│                             handles MutationObserver for SPA routing
│
├── 📄 extractor.js           GitHub DOM reader — extracts all diff data
│                             without any GitHub API calls or auth
│
├── 📄 puter.js               Free Claude AI wrapper — single fetch to
│                             api.puter.com, handles retries + JSON parse
│
├── 📄 prompt.js              Prompt builder — constructs the system +
│                             user prompt from extractedData object
│
├── 📁 ui/
│   ├── 📄 button.js          Injects "✨ Draft with AI" button +
│   │                         tone selector into GitHub PR form
│   │
│   ├── 📄 panel.js           Slide-in side panel — renders title,
│   │                         summary, changes, breaking, labels,
│   │                         checklist, copy and apply actions
│   │
│   └── 📄 styles.css         All styles — GitHub theme matching,
│                             dark/light mode, button, panel, spinner
│
└── 📁 icons/
    ├── 🖼️  icon16.png         Toolbar icon (16×16)
    ├── 🖼️  icon48.png         Extensions page icon (48×48)
    └── 🖼️  icon128.png        Chrome Web Store icon (128×128)
```

<br/>

---

<br/>

## 🔐 Privacy & Security

```
  WHAT WE READ          WHERE IT GOES              STORED?
  ─────────────────────────────────────────────────────────────────
  PR diff lines         Puter.js API (AI only)     ❌ Never
  File names            Puter.js API (AI only)     ❌ Never
  Commit messages       Puter.js API (AI only)     ❌ Never
  Branch name           Puter.js API (AI only)     ❌ Never
  Last AI result        chrome.storage.local       ✅ Local only
                        (cleared on page reload)
  ─────────────────────────────────────────────────────────────────

  ✅  No data ever sent to our servers  (we have none)
  ✅  No analytics or telemetry         (zero)
  ✅  No user accounts                  (none required)
  ✅  No cookies                        (none set)
  ✅  Content script is read-only       (never modifies code)
  ✅  Only activates on github.com/*/pull/* and /compare/*
  ✅  Network requests only to api.puter.com (visible in manifest)
  ✅  Fully open source                 (audit every line)
```

<br/>

---

<br/>

## 💸 Why Free Forever

get-PR uses **[Puter.js](https://puter.com)** — an open source cloud platform that provides free access to AI models including Claude Sonnet 4.6.

```
  Traditional approach (expensive):             get-PR approach (free):
  ───────────────────────────────               ──────────────────────
  Developer pays $20/mo for API key             Developer pays $0
  Ships API key in extension code  ←BAD         No API key in code ✅
  Key gets scraped from Chrome store            Nothing to scrape
  Users get billed                              Users pay nothing
  Extension breaks when $ runs out             Always works
```

Puter uses a **"User-Pays" model** — each user's requests are covered by their own Puter account (free tier). You get AI quality without any billing.

<br/>

---

<br/>

## 🗺️ Roadmap

```
  VERSION    FEATURE                                        STATUS
  ──────────────────────────────────────────────────────────────────
  v1.0.0     Core diff extraction + Puter AI                ✅  Done
  v1.0.0     Auto-fill PR title + description               ✅  Done
  v1.0.0     Slide-in side panel                            ✅  Done
  v1.0.0     Dark / light theme matching GitHub             ✅  Done
  v1.0.0     Tone selector (Professional/Concise/Detailed)  ✅  Done
  v1.0.0     SPA-aware navigation handling                  ✅  Done
  ──────────────────────────────────────────────────────────────────
  v1.1.0     Keyboard shortcut (Ctrl+Shift+D)               🔨  Building
  v1.1.0     Description history (last 5 generated)         🔨  Building
  v1.1.0     Custom prompt templates in options page        📋  Planned
  v1.1.0     Regenerate individual sections only            📋  Planned
  ──────────────────────────────────────────────────────────────────
  v1.2.0     GitLab support                                 📋  Planned
  v1.2.0     Bitbucket support                              📋  Planned
  v1.2.0     Jira ticket auto-linker from branch name       📋  Planned
  v1.2.0     Chrome Web Store public listing                📋  Planned
  ──────────────────────────────────────────────────────────────────
  v2.0.0     Review comment generation                      💡  Idea
  v2.0.0     PR template detector + respect format          💡  Idea
  v2.0.0     Team-level style learning                      💡  Idea
  v2.0.0     VS Code extension port                         💡  Idea
  ──────────────────────────────────────────────────────────────────
```

<br/>

---

<br/>

## 🤝 Contributing

Contributions are what make open source worth building. Here's how to jump in:

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/get-PR.git
cd get-PR

# 2. Load in Chrome for live testing
# chrome://extensions → Developer Mode → Load unpacked → select folder
# Changes to JS/CSS files → just reload the extension (no build needed)

# 3. Create your branch
git checkout -b feat/gitlab-support

# 4. Make changes, test on real GitHub PRs

# 5. Commit with conventional commits
git commit -m "feat: add GitLab diff extraction support"

# 6. Push + open PR
git push origin feat/gitlab-support
# (and use get-PR to write the PR description 😄)
```

<br/>

### Good first issues

```
  🟢  Easy      Improve branch name → PR type detection heuristics
  🟢  Easy      Add keyboard shortcut Ctrl+Shift+D to trigger generation
  🟡  Medium    Build an options/settings page for custom prompt templates
  🟡  Medium    Add GitLab.com support (similar DOM structure)
  🟡  Medium    Store last 5 generated descriptions in chrome.storage
  🔴  Hard      Detect PR template files in repo and respect their format
  🔴  Hard      Add VS Code extension that does the same thing
```

<br/>

---

<br/>

## 🐛 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Button doesn't appear | GitHub updated their DOM | Reload extension + GitHub page |
| "Could not read diff" | PR has no commits yet | Push at least one commit first |
| AI response is empty | Puter rate limit hit | Wait 30s and try again |
| Panel doesn't slide in | CSS conflict with GitHub | Report as issue with screenshot |
| Works on `/compare/` but not `/pull/` | Timing issue | Hard refresh the PR page |
| Button appears twice | SPA navigation race | Reload extension from `chrome://extensions` |

<br/>

---

<br/>

## 📜 License & Copyright

```
MIT License

Copyright (c) 2026 codest0411. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

<br/>

---

<br/>

<div align="center">

**[⭐ Star this repo](https://github.com/codest0411/get-PR) if get-PR saved you time today!**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-your--username-181717?style=for-the-badge&logo=github)](https://github.com/codest0411)
[![Puter.js](https://img.shields.io/badge/Powered_by-Puter.js-7c3aed?style=for-the-badge)](https://puter.com)
[![Claude](https://img.shields.io/badge/AI-Claude_Sonnet_4.6-d97706?style=for-the-badge&logo=anthropic)](https://anthropic.com)

<br/>

```
  "Your PR description should explain the why, not the what.
   get-PR writes both."
```

<br/>

*Built for developers who'd rather ship code than describe it.*

</div>