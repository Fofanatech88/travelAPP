import { z } from 'zod';
const text = z.string().trim().min(1);
const sha = z.string().regex(/^[a-f0-9]{40}$/);
const evidence = z.object({ by: text, reference: text });
export const reportSchema = z.object({
  schemaVersion: z.literal(1),
  taskId: text,
  baseCommit: sha,
  reviewedCommit: sha,
  implementerSessionIds: z.array(text).min(1),
  highRiskAreas: z.array(
    z.enum([
      'authentication',
      'private-data',
      'payments',
      'migrations',
      'optimization',
    ]),
  ),
  specialistReviews: z.array(
    z.object({
      kind: z.enum(['security', 'domain']),
      sessionId: text,
      reference: text,
    }),
  ),
  reviewer: z.object({
    sessionId: text,
    launchId: text,
    freshContext: z.literal(true),
    isolation: z.object({
      mode: z.literal('read-only'),
      verified: z.literal(true),
      evidence: text,
    }),
  }),
  scope: text,
  acceptanceCriteria: z
    .array(
      z.object({ criterion: text, satisfied: z.boolean(), evidence: text }),
    )
    .min(1),
  tests: z.array(
    z.object({
      command: text,
      outcome: z.enum(['passed', 'failed', 'blocked']),
      evidence: text,
    }),
  ),
  findings: z.array(
    z.object({
      id: text,
      severity: z.enum(['P0', 'P1', 'P2', 'P3']),
      file: text,
      line: z.number().int().positive(),
      evidence: text,
      missingTests: z.array(text),
      disposition: z.enum(['open', 'resolved', 'accepted']),
      founderAcceptance: evidence.optional(),
    }),
  ),
  missingTestScenarios: z.array(text),
  unverified: z.array(text),
  recommendation: z.enum(['PASS', 'PASS WITH DOCUMENTED RISKS', 'FAIL']),
  coordinator: z.object({ verified: z.boolean(), by: text, evidence: text }),
});
export function validateReport(
  value,
  { baseCommit, headCommit, isAncestor, changedSince },
) {
  const report = reportSchema.parse(value);
  if (report.implementerSessionIds.includes(report.reviewer.sessionId))
    throw Error('Implementer cannot approve own work.');
  const needed = new Set(
    report.highRiskAreas.map((area) =>
      area === 'optimization' ? 'domain' : 'security',
    ),
  );
  for (const kind of needed)
    if (
      !report.specialistReviews.some(
        (review) =>
          review.kind === kind &&
          review.sessionId !== report.reviewer.sessionId &&
          !report.implementerSessionIds.includes(review.sessionId),
      )
    )
      throw Error('Additional independent specialist review missing.');
  if (report.baseCommit !== baseCommit)
    throw Error('Review base does not match current PR base.');
  if (
    !isAncestor(baseCommit, report.reviewedCommit) ||
    !isAncestor(report.reviewedCommit, headCommit)
  )
    throw Error('Reviewed revision is outside the current change history.');
  if (
    changedSince(report.reviewedCommit, headCommit).some(
      (path) => !/^reports\/reviews\/[^/]+\.json$/.test(path),
    )
  )
    throw Error(
      'Implementation changed after review; a new session is required.',
    );
  if (report.recommendation === 'FAIL')
    throw Error('Reviewer recommendation is FAIL.');
  if (!report.acceptanceCriteria.every((item) => item.satisfied))
    throw Error('Unmet acceptance criteria.');
  if (report.tests.some((item) => item.outcome === 'failed'))
    throw Error('Independent tests failed.');
  if (!report.coordinator.verified)
    throw Error('Coordinator verification missing.');
  for (const finding of report.findings) {
    if (
      ['P0', 'P1'].includes(finding.severity) &&
      finding.disposition !== 'resolved'
    )
      throw Error('Unresolved P0/P1 finding.');
    if (
      finding.severity === 'P2' &&
      finding.disposition !== 'resolved' &&
      (finding.disposition !== 'accepted' || !finding.founderAcceptance)
    )
      throw Error('P2 needs founder acceptance evidence.');
  }
  if (
    report.recommendation === 'PASS' &&
    (report.unverified.length ||
      report.missingTestScenarios.length ||
      report.tests.some((item) => item.outcome === 'blocked') ||
      report.findings.some((item) => item.disposition !== 'resolved'))
  )
    throw Error('PASS cannot hide documented risks.');
  return report;
}
