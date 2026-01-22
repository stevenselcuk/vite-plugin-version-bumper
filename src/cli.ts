#!/usr/bin/env node
import { runBump } from './index';

const args = process.argv.slice(2);
const bump = args.includes('--bump');
const fresh = args.includes('--fresh');


let files = 'src/**/*.{ts,tsx,js,jsx}';
const filesIndex = args.indexOf('--files');
if (filesIndex !== -1 && args[filesIndex + 1]) {
  files = args[filesIndex + 1];
}



let pattern: RegExp | undefined = undefined;
const patternIndex = args.indexOf('--pattern');

if (patternIndex !== -1 && args[patternIndex + 1]) {
  try {
    const patternStr = args[patternIndex + 1];
    
    pattern = new RegExp(patternStr, 'g');
    console.log(`🔧 Custom Pattern Detected: ${pattern}`);
  } catch (e) {
    console.error('❌ Invalid Regex Pattern provided via CLI.');
    process.exit(1);
  }
}

console.log('🔧 Running Standalone Bumper...');

runBump(
  { 
    files, 
    pattern 
  }, 
  { bump, fresh }
);