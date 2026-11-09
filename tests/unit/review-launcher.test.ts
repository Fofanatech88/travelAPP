import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

it.each(['startup-error', 'source-write'])(
  'launcher preserves %s probe evidence and never starts a reviewer',
  (failure) => {
    const directory = mkdtempSync(join(tmpdir(), 'review-launcher-test-'));
    const repo = join(directory, 'repo');
    const bin = join(directory, 'bin');
    const marker = join(directory, 'reviewer-started');
    const launcher = resolve('scripts/review/start.mjs');
    mkdirSync(repo);
    mkdirSync(bin);
    const git = (...args: string[]) => {
      const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8' });
      if (result.status !== 0) throw Error(result.stderr);
      return result.stdout.trim();
    };
    try {
      git('init', '-b', 'main');
      writeFileSync(
        join(repo, 'requirements.md'),
        'Approved acceptance fixture.',
      );
      git('add', 'requirements.md');
      git(
        '-c',
        'user.name=Review test',
        '-c',
        'user.email=review@example.invalid',
        '-c',
        'commit.gpgsign=false',
        'commit',
        '-m',
        'Fixture',
      );
      const target = git('rev-parse', 'HEAD');
      // This fake CLI checks compatibility and failure handling only. It does
      // not establish OS sandbox isolation or execute a model session.
      writeFileSync(
        join(bin, 'codex'),
        `#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
if (args[0] !== 'sandbox') {
  fs.writeFileSync(${JSON.stringify(marker)}, 'unexpected reviewer');
  process.exit(90);
}
if (args[args.indexOf('--permission-profile') + 1] !== ':read-only' ||
    !args.includes('--include-managed-config') || !args.includes('--')) {
  process.stderr.write('required --permission-profile missing');
  process.exit(2);
}
if (${JSON.stringify(failure)} === 'source-write') {
  fs.writeFileSync(path.join(args[args.indexOf('-C') + 1], '.review-permission-probe'), 'changed');
  process.stdout.write('READ_OK_WRITE_DENIED');
} else {
  process.stdout.write('probe diagnostic stdout');
  process.stderr.write('synthetic sandbox startup failure');
  process.exit(7);
}
`,
        { mode: 0o755 },
      );
      const result = spawnSync(
        process.execPath,
        [
          launcher,
          'REV-FIXTURE',
          target,
          target,
          'requirements.md',
          'developer',
        ],
        {
          cwd: repo,
          encoding: 'utf8',
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            TMPDIR: directory,
          },
        },
      );
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        'Read-only sandbox probe unavailable/failed',
      );
      expect(existsSync(marker)).toBe(false);
      const evidenceFolder = readdirSync(directory).find((name) =>
        name.startsWith('together-review-'),
      );
      expect(evidenceFolder).toBeDefined();
      const evidence = JSON.parse(
        readFileSync(
          join(directory, evidenceFolder!, 'probe-evidence.json'),
          'utf8',
        ),
      );
      expect(evidence.permissionProfile).toBe(':read-only');
      expect(evidence.includeManagedConfig).toBe(true);
      expect(evidence.target).toBe(target);
      if (failure === 'startup-error') {
        expect(evidence.exitCode).toBe(7);
        expect(evidence.stdout).toBe('probe diagnostic stdout');
        expect(evidence.stderr).toBe('synthetic sandbox startup failure');
      } else {
        expect(evidence.exitCode).toBe(0);
        expect(evidence.stdout).toBe('READ_OK_WRITE_DENIED');
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  },
);
