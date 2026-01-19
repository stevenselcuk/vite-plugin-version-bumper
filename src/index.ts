import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

interface BumperOptions {
  files: string | string[];

  pattern?: RegExp;
}

export default function versionBumper(options: BumperOptions): Plugin {
  const { files, pattern = /(_v)(\d+)/g } = options;

  return {
    name: "vite-plugin-version-bumper",
    apply: "build",

    buildStart() {
      const args = process.argv;
      const env = process.env;

      const shouldIncrease =
        args.includes("--increase") ||
        args.includes("--bump") ||
        env.BUMP === "true";

      const shouldFresh = args.includes("--fresh") || env.FRESH === "true";

      if (!shouldIncrease && !shouldFresh) {
        return;
      }

      console.log("\n🚀 [Version Bumper] Tarama başlatılıyor...");

      const filePaths = globSync(files, { absolute: true });
      let totalChanges = 0;

      for (const filePath of filePaths) {
        try {
          const content = fs.readFileSync(filePath, "utf-8");
          let hasChange = false;

          const newContent = content.replace(
            pattern,
            (match, prefix, versionStr) => {
              const currentVer = parseInt(versionStr, 10);
              let newVer = currentVer;

              if (shouldFresh) {
                newVer = 1;
              } else if (shouldIncrease) {
                newVer = currentVer + 1;
              }

              if (newVer !== currentVer) {
                hasChange = true;

                const fileName = path.basename(filePath);
                console.log(
                  `   Update ${fileName}: ${match} -> ${prefix}${newVer}`,
                );
                return `${prefix}${newVer}`;
              }

              return match;
            },
          );

          if (hasChange) {
            fs.writeFileSync(filePath, newContent, "utf-8");
            totalChanges++;
          }
        } catch (error) {
          console.error(`Error reading/writing file: ${filePath}`, error);
        }
      }

      if (totalChanges > 0) {
        console.log(
          `✅ [Version Bumper] Toplam ${totalChanges} dosya güncellendi.\n`,
        );
      } else {
        console.log(`⚠️ [Version Bumper] Değiştirilecek pattern bulunamadı.\n`);
      }
    },
  };
}
