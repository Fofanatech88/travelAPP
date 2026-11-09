import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const [base, head] = process.argv.slice(2);
const files = (() => {
  try {
    return readdirSync('reports/reviews').filter((file) =>
      file.endsWith('.json'),
    );
  } catch {
    return [];
  }
})();
let passed = false;
for (const file of files) {
  try {
    execFileSync(
      process.execPath,
      ['scripts/review/check.mjs', `reports/reviews/${file}`, base, head],
      { stdio: 'pipe' },
    );
    console.log(`Matching report: ${file}`);
    passed = true;
    break;
  } catch {
    /* Historical reports do not approve current code. */
  }
}
if (!passed) {
  console.error('Review Blocked: no valid current review report.');
  process.exitCode = 1;
}
