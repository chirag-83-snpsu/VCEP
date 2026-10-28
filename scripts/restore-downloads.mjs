/**
 * Recovery script to restore public/downloads from curriculum/archive/downloads
 * Usage: node scripts/restore-downloads.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('curriculum/archive/downloads');
const destDir = path.resolve('public/downloads');

if (!fs.existsSync(srcDir)) {
  console.error('Source archive directory does not exist:', srcDir);
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
const files = fs.readdirSync(srcDir).filter(f => f !== 'SHA256SUMS.txt');

for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

console.log(`Successfully restored ${files.length} download files to ${destDir}`);
