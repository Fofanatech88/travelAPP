import { describe, it, expect } from 'vitest';
// The validator is also run directly by Node in CI.
import { validateReport } from '../../scripts/review/report.mjs';
const base = 'a'.repeat(40),
  target = 'b'.repeat(40),
  head = 'c'.repeat(40);
const context = {
  baseCommit: base,
  headCommit: head,
  isAncestor: () => true,
  changedSince: () => ['reports/reviews/task.json'],
};
const fresh = () => ({
  schemaVersion: 1,
  taskId: 'REV-01',
  baseCommit: base,
  reviewedCommit: target,
  implementerSessionIds: ['developer'],
  highRiskAreas: [] as string[],
  specialistReviews: [] as {
    kind: string;
    sessionId: string;
    reference: string;
  }[],
  reviewer: {
    sessionId: 'new-review-session',
    launchId: 'unique-launch',
    freshContext: true,
    isolation: {
      mode: 'read-only',
      verified: true,
      evidence: 'denied write probe and launch log',
    },
  },
  scope: 'Approved task diff',
  acceptanceCriteria: [
    {
      criterion: 'Gate rejects missing reports',
      satisfied: true,
      evidence: 'negative fixture',
    },
  ],
  tests: [{ command: 'npm test', outcome: 'passed', evidence: 'exit 0' }],
  findings: [] as {
    id: string;
    severity: string;
    file: string;
    line: number;
    evidence: string;
    missingTests: string[];
    disposition: string;
    founderAcceptance?: { by: string; reference: string };
  }[],
  missingTestScenarios: [] as string[],
  unverified: [] as string[],
  recommendation: 'PASS',
  coordinator: {
    verified: true,
    by: 'coordinator',
    evidence: 'Verified independent session provenance',
  },
});
const finding = (severity: string) => ({
  id: 'R1',
  severity,
  file: 'example.ts',
  line: 12,
  evidence: 'reproducible failure',
  missingTests: ['regression'],
  disposition: 'open',
});
describe('mandatory review structural gate', () => {
  it('accepts a complete report and report-only followup', () =>
    expect(() => validateReport(fresh(), context)).not.toThrow());
  it('rejects missing report', () =>
    expect(() => validateReport(undefined, context)).toThrow());
  it('rejects missing report fields', () => {
    const r = fresh();
    expect(() =>
      validateReport({ ...r, reviewer: undefined }, context),
    ).toThrow();
  });
  it('rejects self review', () => {
    const r = fresh();
    r.reviewer.sessionId = 'developer';
    expect(() => validateReport(r, context)).toThrow(/own work/);
  });
  it('rejects unverified permissions and reused context', () => {
    for (const patch of [
      { freshContext: false },
      {
        isolation: {
          mode: 'read-only',
          verified: false,
          evidence: 'unsupported',
        },
      },
    ])
      expect(() =>
        validateReport(
          { ...fresh(), reviewer: { ...fresh().reviewer, ...patch } },
          context,
        ),
      ).toThrow();
  });
  it('rejects FAIL', () =>
    expect(() =>
      validateReport({ ...fresh(), recommendation: 'FAIL' }, context),
    ).toThrow(/FAIL/));
  it('rejects stale base and unrelated revisions', () => {
    expect(() =>
      validateReport(fresh(), { ...context, baseCommit: head }),
    ).toThrow(/base/);
    expect(() =>
      validateReport(fresh(), { ...context, isAncestor: () => false }),
    ).toThrow(/history/);
  });
  it('rejects code and policy changes after review', () => {
    for (const path of [
      'src/app/index.tsx',
      'AGENTS.md',
      'scripts/review/check.mjs',
    ])
      expect(() =>
        validateReport(fresh(), { ...context, changedSince: () => [path] }),
      ).toThrow(/changed/);
  });
  it('rejects unresolved P0/P1 even if marked accepted', () => {
    for (const severity of ['P0', 'P1'])
      for (const disposition of ['open', 'accepted'])
        expect(() =>
          validateReport(
            { ...fresh(), findings: [{ ...finding(severity), disposition }] },
            context,
          ),
        ).toThrow(/P0\/P1/);
  });
  it('requires founder evidence for P2', () => {
    expect(() =>
      validateReport(
        {
          ...fresh(),
          recommendation: 'PASS WITH DOCUMENTED RISKS',
          findings: [finding('P2')],
        },
        context,
      ),
    ).toThrow(/P2/);
  });
  it('accepts explicit founder-accepted P2 risks', () => {
    expect(() =>
      validateReport(
        {
          ...fresh(),
          recommendation: 'PASS WITH DOCUMENTED RISKS',
          findings: [
            {
              ...finding('P2'),
              disposition: 'accepted',
              founderAcceptance: {
                by: 'Founder',
                reference: 'approved issue comment',
              },
            },
          ],
        },
        context,
      ),
    ).not.toThrow();
  });
  it('requires satisfied acceptance, passing tests and coordinator verification', () => {
    for (const patch of [
      {
        acceptanceCriteria: [
          { criterion: 'works', satisfied: false, evidence: 'unverified' },
        ],
      },
      {
        tests: [{ command: 'npm test', outcome: 'failed', evidence: 'exit1' }],
      },
      { coordinator: { verified: false, by: 'pending', evidence: 'pending' } },
    ])
      expect(() => validateReport({ ...fresh(), ...patch }, context)).toThrow();
  });
  it('does not let clean PASS conceal unverified risks', () =>
    expect(() =>
      validateReport({ ...fresh(), unverified: ['iOS not run'] }, context),
    ).toThrow(/risks/));
  it('allows documented non-required verification gaps', () =>
    expect(() =>
      validateReport(
        {
          ...fresh(),
          recommendation: 'PASS WITH DOCUMENTED RISKS',
          unverified: ['Android deferred'],
        },
        context,
      ),
    ).not.toThrow());
  it('requires independent extra domain/security specialists for high-risk work', () => {
    for (const [area, kind] of [
      ['optimization', 'domain'],
      ['private-data', 'security'],
    ]) {
      const r = { ...fresh(), highRiskAreas: [area!] };
      expect(() => validateReport(r, context)).toThrow(/specialist/);
      r.specialistReviews = [
        {
          kind: kind!,
          sessionId: 'specialist',
          reference: 'preserved additional review',
        },
      ];
      expect(() => validateReport(r, context)).not.toThrow();
    }
  });
});

it('launcher fails closed without a versioned target and never starts Codex', async () => {
  const { spawnSync } = await import('node:child_process');
  const { mkdtempSync, readdirSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join, resolve } = await import('node:path');
  const directory = mkdtempSync(join(tmpdir(), 'review-preflight-test-'));
  try {
    const result = spawnSync(
      process.execPath,
      [
        resolve('scripts/review/start.mjs'),
        'REV-TEST',
        base,
        target,
        'requirements.md',
        'developer-session',
      ],
      {
        cwd: directory,
        encoding: 'utf8',
        env: { ...process.env, GIT_CEILING_DIRECTORIES: directory },
      },
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Review Blocked');
    expect(readdirSync(directory)).toEqual([]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
