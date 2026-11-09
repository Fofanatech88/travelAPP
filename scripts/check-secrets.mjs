import { readdir, readFile } from 'node:fs/promises';
const skip = new Set([
  'node_modules',
  '.git',
  '.expo',
  'dist',
  'dist-ios',
  'playwright-report',
  'test-results',
]);
let failed = false;
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = dir + '/' + entry.name;
    if (entry.isDirectory()) {
      await scan(path);
      continue;
    }
    if (
      /\.(png|jpg|ttf|lock)$/.test(path) ||
      entry.name === 'package-lock.json'
    )
      continue;
    const value = await readFile(path, 'utf8');
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(value) ||
      /sb_secret_[A-Za-z0-9]{20,}/.test(value) ||
      /AKIA[A-Z0-9]{16}/.test(value) ||
      /gh[pousr]_[A-Za-z0-9]{30,}/.test(value) ||
      /github_pat_[A-Za-z0-9_]{30,}/.test(value) ||
      /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(value)
    ) {
      console.error('Potential secret in ' + path);
      failed = true;
    }
    if (/^\.env(?:\.|$)/.test(entry.name) && entry.name !== '.env.example') {
      console.error('Private environment file present: ' + path);
      failed = true;
    }
  }
}
await scan('.');
if (failed) process.exitCode = 1;
else console.log('Basic secret patterns and environment-file check passed.');
