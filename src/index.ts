import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

export interface BumperOptions {
  files: string | string[];
  pattern?: RegExp;
}


export function runBump(options: BumperOptions, flags: { bump?: boolean; fresh?: boolean }) {
  const { files, pattern = /(_v)(\d+)/g } = options;
  const { bump, fresh } = flags;

  if (!bump && !fresh) return; 

  console.log('\n🚀 [Version Bumper] Scanning files...');

  const filePaths = globSync(files, { absolute: true });
  let totalChanges = 0;

  for (const filePath of filePaths) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let hasChange = false;

      const newContent = content.replace(pattern, (match, prefix, versionStr) => {
        const currentVer = parseInt(versionStr, 10);
        let newVer = currentVer;

        if (fresh) newVer = 1;
        else if (bump) newVer = currentVer + 1;

        if (newVer !== currentVer) {
          hasChange = true;
          console.log(`   Update ${path.basename(filePath)}: ${match} -> ${prefix}${newVer}`);
          return `${prefix}${newVer}`;
        }
        return match;
      });

      if (hasChange) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        totalChanges++;
      }
    } catch (error) {
      console.error(`Error processing file: ${filePath}`, error);
    }
  }

  if (totalChanges > 0) {
    console.log(`✅ [Version Bumper] Updated ${totalChanges} files.\n`);
  } else {
    console.log(`⚠️ [Version Bumper] No matching patterns found.\n`);
  }
}


export default function versionBumper(options: BumperOptions): Plugin {
  return {
    name: 'vite-plugin-version-bumper',
    apply: 'build',
    buildStart() {
      
      const args = process.argv;
      const bump = args.includes('--bump') || process.env.BUMP === 'true';
      const fresh = args.includes('--fresh') || process.env.FRESH === 'true';
      
      runBump(options, { bump, fresh });
    }
  };
}