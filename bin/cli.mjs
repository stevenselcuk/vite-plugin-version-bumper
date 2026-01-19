#!/usr/bin/env node
import { spawn } from "node:child_process";

const args = process.argv.slice(2);

if (args.includes("--bump") || args.includes("--increase")) {
  process.env.BUMP = "true";
}

if (args.includes("--fresh") || args.includes("--reset")) {
  process.env.FRESH = "true";
}

console.log("🚀 Version Bumper Wrapper başlatılıyor...");

const command = process.platform === "win32" ? "npx.cmd" : "npx";

const buildProcess = spawn(command, ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
});

buildProcess.on("close", (code) => {
  process.exit(code);
});
