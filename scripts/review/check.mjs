import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { validateReport } from './report.mjs';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
try {
  const [file, baseCommit, headCommit] = process.argv.slice(2);
  if (!file || !baseCommit || !headCommit)
    throw Error('Usage: review:check REPORT.json BASE-SHA HEAD-SHA');
  validateReport(JSON.parse(readFileSync(file, 'utf8')), {
    baseCommit,
    headCommit,
    isAncestor: (a, b) => {
      try {
        git('merge-base', '--is-ancestor', a, b);
        return true;
      } catch {
        return false;
      }
    },
    changedSince: (a, b) =>
      git('log', '--format=', '--name-only', `${a}..${b}`)
        .split('\n')
        .filter(Boolean),
  });
  console.log(
    'Structural review gate passed. Coordinator must authenticate session/isolation/approval evidence.',
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
