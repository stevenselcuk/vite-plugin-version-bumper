# Vite Plugin Version Bumper

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/vite-plugin-version-bumper?color=blue&style=flat-square)](https://www.npmjs.com/package/vite-plugin-version-bumper)
[![License](https://img.shields.io/npm/l/vite-plugin-version-bumper?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/npm/dt/vite-plugin-version-bumper?style=flat-square)](https://www.npmjs.com/package/vite-plugin-version-bumper)
[![TypeScript](https://img.shields.io/badge/Written%20in-TypeScript-3178C6?style=flat-square)](https://www.typescriptlang.org/)

**Automate your cache busting strategy.**
Updates version suffixes in your code (e.g., `_v1` → `_v2`) physically.
Designed to work flawlessly with **Git Hooks** and **Vite**.

[Installation](#-installation) • [Usage](#-usage) • [Best Practices](#-best-practices-husky--git-hooks)

</div>

A Vite plugin and CLI tool that automatically bumps version numbers in your source code files. Perfect for **cache busting**, managing **localStorage keys**, or updating **display versions**.

## 🚀 Features

- **Standalone CLI:** Fast "bump only" mode. Doesn't trigger a heavy Vite build.
- **Git Hooks Ready:** Perfect for `pre-commit` hooks (Husky).
- **Automated Bumping:** Increments version suffixes (e.g., `_v1` -> `_v2`) automatically.
- **Fresh Start:** Capable of resetting all versions back to `_v1`.
- **Physical Update:** Updates the actual source code files.
- **Regex Powered:** Flexible pattern matching via CLI flags.

## 📦 Installation

```bash
npm install -D vite-plugin-version-bumper
# or
yarn add -D vite-plugin-version-bumper
```

## 🕹 Usage

### 1. In your code

Write your variable with a version suffix:

```typescript
// src/config.ts
export const CACHE_KEY = "user_settings_v1";
```

### 2. NPM Scripts (CLI)

The CLI tool (`vite-bumper`) is the recommended way to use this package. It modifies files without running a full build.

**Note:** The CLI does **not** read `vite.config.ts`. You must pass configuration via flags.

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",

    // Default usage (Matches "_v1", "_v2" in src folder)
    "bump": "vite-bumper --bump",

    // Custom Pattern Usage (e.g. for "build_123")
    // Note: You must escape backslashes (\\d+) in JSON strings!
    "bump:custom": "vite-bumper --bump --pattern \"_build_(\\d+)\"",

    // Resets files back to 1
    "fresh": "vite-bumper --fresh"
  }
}
```

### 3. CLI Options Reference

| Flag        | Description                                                           | Default                      |
| :---------- | :-------------------------------------------------------------------- | :--------------------------- |
| `--bump`    | Increments found versions by 1.                                       | `false`                      |
| `--fresh`   | Resets found versions to 1.                                           | `false`                      |
| `--files`   | Glob pattern for files to scan.                                       | `"src/**/*.{ts,tsx,js,jsx}"` |
| `--pattern` | Regex string to match versions. Group 1 is prefix, Group 2 is number. | `"(_v)(\d+)"`                |

---

## ⚙️ Configuration (Vite Plugin Mode)

_Optional: Only required if you want the plugin to run inside `vite build` process automatically (not recommended if using Husky)._

Add it to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import versionBumper from "vite-plugin-version-bumper";

export default defineConfig({
  plugins: [
    versionBumper({
      files: "src/**/*.{ts,tsx,js,jsx}",
      pattern: /(_v)(\d+)/g,
    }),
  ],
});
```

---

## 💎 Best Practices: Husky & Git Hooks

The most professional way to use this plugin is to bump versions automatically **before** every commit. This ensures your production server never has to modify source code (avoiding dirty git state on CI/CD).

### 1. Install Husky

```bash
npm install -D husky
npx husky init
```

### 2. Configure Pre-commit Hook

Edit `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🚀 Bumping version..."

# 1. Increment the version in source files
# (Ensure this script exists in your package.json)
npm run bump

# 2. Add the modified files back to the staging area
# (Crucial: otherwise the bump happens but isn't included in the commit)
git add .

# 3. (Optional) Run linting
# npx lint-staged
```

**Now, every time you commit:**

1.  Versions are bumped (`_v1` -> `_v2`).
2.  The change is added to the commit.
3.  You push a clean, updated state to GitHub.
4.  Your VPS/Vercel pulls and builds without errors.

---

## 💡 Example Scenario: Cache Busting

You use `localStorage` to save user preferences. You need to invalidate old data after a deployment.

1.  **Code:** `const STORAGE_KEY = "app_data_v1";`
2.  **Action:** You commit your changes.
3.  **Husky:** Runs `vite-bumper --bump`.
4.  **Result:** Code becomes `const STORAGE_KEY = "app_data_v2";`.
5.  **Effect:** On production, the app looks for `_v2`. The old `_v1` data is ignored, effectively resetting the state.

## 📄 License

MIT
