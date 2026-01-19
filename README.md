# Vite Plugin Version Bumper

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/vite-plugin-version-bumper?color=blue&style=flat-square)](https://www.npmjs.com/package/vite-plugin-version-bumper)
[![License](https://img.shields.io/npm/l/vite-plugin-version-bumper?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/npm/dt/vite-plugin-version-bumper?style=flat-square)](https://www.npmjs.com/package/vite-plugin-version-bumper)
[![TypeScript](https://img.shields.io/badge/Written%20in-TypeScript-3178C6?style=flat-square)](https://www.typescriptlang.org/)

**Automate your cache busting strategy with zero config.**
Updates version suffixes in your code (e.g., `_v1` → `_v2`) physically during the build.

[Installation](#-installation) • [Usage](#-usage) • [Configuration](#-configuration)

</div>

A Vite plugin that automatically bumps version numbers in your source code files during the build process. Perfect for **cache busting**, managing **localStorage keys**, or updating **display versions**.

## 🚀 Features

- **Automated Bumping:** Increments version suffixes (e.g., `_v1` -> `_v2`) automatically.
- **Fresh Start:** Capable of resetting all versions back to `_v1`.
- **Smart CLI Wrapper:** Includes a built-in CLI tool (`vite-bumper`) to handle flags easily without config hassles.
- **Physical Update:** Updates the actual source code files, ensuring changes are committed.
- **Regex Powered:** Flexible pattern matching.

## 📦 Installation

```bash
npm install -D vite-plugin-version-bumper
# or
yarn add -D vite-plugin-version-bumper
```

## ⚙️ Configuration

Add it to your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import versionBumper from "vite-plugin-version-bumper";

export default defineConfig({
  plugins: [
    versionBumper({
      // 1. Define files to scan (glob pattern)
      files: "src/**/*.{ts,tsx,js,jsx}",

      // 2. (Optional) Custom pattern.
      // Default is /(_v)(\d+)/g which matches "_v1", "_v10", etc.
      // Group 1 must be the prefix, Group 2 must be the number.
      pattern: /(_v)(\d+)/g,
    }),
  ],
});
```

## 🕹 Usage

This plugin modifies your files _before_ the build completes.

### 1. In your code

Write your variable with a version suffix:

```typescript
// src/config.ts
export const CACHE_KEY = "user_settings_v1";
```

### 2. Setup Build Commands (Recommended)

The easiest way to use this plugin is by adding the included CLI tool to your `package.json` scripts. This wrapper handles the build process for you.

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "bump": "vite-bumper --bump",
    "fresh": "vite-bumper --fresh"
  }
}
```

### 3. Run It

Now you can use standard NPM commands:

#### Option A: Bump Version

Increases version numbers (e.g., `_v1` -> `_v2`) and runs the build.

```bash
npm run bump
```

#### Option B: Fresh Start

Resets all versions back to `_v1` and runs the build.

```bash
npm run fresh
```

#### Option C: Normal Build

Just runs the standard Vite build without changing any versions.

```bash
npm run build
```

---

### Alternative: CI/CD & Environment Variables

If you prefer using Environment Variables (e.g., in GitHub Actions or Jenkins), the plugin still supports them:

```bash
# MacOS / Linux
BUMP=true npm run build

# Windows (PowerShell)
$env:BUMP="true"; npm run build
```

## 💡 Example Scenario: Cache Busting

You use `localStorage` to save user preferences. You change the data structure and need to invalidate old data.

1.  **Code:** `const STORAGE_KEY = "app_data_v1";`
2.  **Command:** Run `npm run bump`.
3.  **Result:** Code becomes `const STORAGE_KEY = "app_data_v2";`.
4.  **Effect:** Your app now looks for the `_v2` key. The old `_v1` data is ignored, effectively resetting the state for the user.

## 📄 License

MIT
