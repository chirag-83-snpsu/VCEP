import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession07(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const cleanRows = ws.cleanRows || [];
  const exceptions = ws.exceptions || [];
  const formulaNotes = (ws.formulaNotes || draft['work:analysis'] || '').trim();
  const conceptExplain = (draft['concept:explain'] || '').trim();
  const teamContribution = (draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const wordCount = (str: string) => str.split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's07-o1-data-integrity',
      title: 'Data Integrity & Raw Preservation Objective',
      description: 'Understand that raw data must never be overwritten, mutated in-place, or deleted without audit tracking.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Apply three-tier data separation: Raw Inflow -> Clean Approved -> Quarantined Suspense.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const lWords = wordCount(conceptExplain);
  const lPassed = lWords >= 20;
  const lLower = conceptExplain.toLowerCase();
  const hasQuarantine = lLower.includes('quarantin') || lLower.includes('suspense') || lLower.includes('separat');
  const hasFormulas = lLower.includes('sumif') || lLower.includes('countif') || lLower.includes('formula') || lLower.includes('rule');

  learnChecks.push({
    id: 's07-l1-quarantine-principle',
    title: 'Quarantine vs In-Place Deletion Rule',
    description: 'Explain why suspect records (duplicates, invalid dates, missing values) must be segregated into a quarantine register rather than silently deleted.',
    passed: lPassed && (hasQuarantine || hasFormulas),
    status: (lPassed && (hasQuarantine || hasFormulas)) ? 'passed' : lWords > 0 ? 'warning' : 'pending',
    studentValue: lWords > 0 ? `${lWords} words entered` : 'Unanswered',
    expectedRequirement: 'A substantive explanation (>= 20 words) explaining that deleting or zeroing records destroys auditability and causes bank reconciliation variances.',
    whyIncorrect: 'Silently deleting rows in Excel destroys the audit trail. Always quarantine exceptions with documented reason codes.',
    conceptToRevisit: 'Stage 02 Learn · Excel Data Cleaning Concepts',
    actionTab: 'Learn',
    actionLabel: 'Explain Quarantine Rule',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's07-c1-caseb',
      title: 'Case B Raw Inflow Verification (7 Records / INR 44,000)',
      description: 'Confirm all 7 raw receipt records imported faithfully without modification.',
      passed: true,
      status: 'passed',
      studentValue: '7 raw records verified',
      expectedRequirement: 'Case B raw dataset imported: R01 (₹12k), R02 (₹8k), R02 (₹8k), R03 (₹5k), R04 (₹7k), R05 (blank), R06 (₹4k). Total volume = ₹44,000.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // 1. Clean approved rows total
  const approvedCount = cleanRows.length;
  const approvedTotal = cleanRows.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  // Case B requires the correct SOURCE records, not just any three values summing to ₹25,000.
  const expectedCleanById: Record<string, { amount: number; customer: string; date: string }> = {
    R01: { amount: 12000, customer: 'asha', date: '2026-10-01' },
    R02: { amount: 8000, customer: 'beacon', date: '2026-10-02' },
    R03: { amount: 5000, customer: 'asha', date: '2026-10-03' },
  };
  const cleanSourceIds = cleanRows.map((r: any) => String(r.sourceId || ''));
  const correctCleanSources = cleanSourceIds.length === 3
    && new Set(cleanSourceIds).size === 3
    && cleanRows.every((r: any) => {
      const expected = expectedCleanById[String(r.sourceId || '')];
      return !!expected && Number(r.amount) === expected.amount
        && String(r.customerStandard || '').trim().toLowerCase() === expected.customer
        && String(r.isoDate || '') === expected.date;
    });
  const isApprovedCorrect = approvedCount === 3 && approvedTotal === 25000 && correctCleanSources;

  workChecks.push({
    id: 's07-w1-approved-clean',
    title: 'Approved Clean Dataset Calculation',
    description: 'Filter exactly the 3 valid, unambiguous records (R01, R02 first instance, R03) totaling INR 25,000.',
    passed: isApprovedCorrect,
    status: isApprovedCorrect ? 'passed' : approvedCount > 0 ? 'failed' : 'pending',
    studentValue: approvedCount > 0 ? `${approvedCount} rows (₹${approvedTotal.toLocaleString('en-IN')})` : 'Unanswered',
    expectedRequirement: 'Exactly 3 approved clean records totaling INR 25,000: R01 (₹12,000 Asha), R02 (₹8,000 Beacon), R03 (₹5,000 Asha).',
    whyIncorrect: approvedTotal > 25000
      ? 'Your clean total exceeds INR 25,000. You likely included suspect records (R04, R05, R06, or duplicate R02) that must be quarantined.'
      : 'Review clean dataset filtering: Only R01, one R02, and R03 are certified valid.',
    conceptToRevisit: 'Stage 04 Work · Clean Working Table',
    actionTab: 'Work',
    actionLabel: 'Filter Clean Data',
  });

  // 2. Quarantined exceptions total
  const quarantineCount = exceptions.length;
  const quarantineTotal = exceptions.reduce((sum: number, e: any) => {
    const v = Number(e.rawAmount);
    return isNaN(v) ? sum : sum + v;
  }, 0);
  // ₹19,000 is the sum of THREE KNOWN exception amounts, not a value for all four rows.
  // R05 has no amount in the source workbook: it must remain explicitly unknown.
  const expectedExceptions: Record<string, number | 'blank'> = {
    'R02 (Row 3)': 8000,
    R04: 7000,
    R05: 'blank',
    R06: 4000,
  };
  const exceptionIds = exceptions.map((e: any) => String(e.sourceId || ''));
  const correctExceptionSources = exceptionIds.length === 4
    && new Set(exceptionIds).size === 4
    && exceptions.every((e: any) => {
      const source = String(e.sourceId || '');
      if (!Object.prototype.hasOwnProperty.call(expectedExceptions, source)) return false;
      const expected = expectedExceptions[source];
      return expected === 'blank'
        ? e.rawAmount === 'blank'
        : typeof e.rawAmount === 'number' && e.rawAmount === expected;
    });
  const isQuarantineCorrect = quarantineCount === 4
    && quarantineTotal === 19000 && correctExceptionSources;

  workChecks.push({
    id: 's07-w2-quarantine-register',
    title: 'Quarantine Exception Register (4 Items / INR 19,000)',
    description: 'Record all 4 exceptions: duplicate R02 (₹8k), invalid-date R04 (₹7k), missing-amount R05 (unknown, NOT ₹0), and ambiguous-date R06 (₹4k).',
    passed: isQuarantineCorrect,
    status: isQuarantineCorrect ? 'passed' : quarantineCount > 0 ? 'failed' : 'pending',
    studentValue: quarantineCount > 0 ? `${quarantineCount} exceptions (₹${quarantineTotal.toLocaleString('en-IN')})` : 'Unanswered',
    expectedRequirement: 'Exactly 4 exception records: R02 duplicate, R04 ₹7k invalid date, R05 amount unknown, R06 ₹4k ambiguous date. Only the 3 known exception amounts total ₹19,000.',
    whyIncorrect: quarantineCount < 4
      ? `Only ${quarantineCount} of 4 exceptions identified. Did you catch both date errors (invalid day 32 and format 10/11/26)?`
      : 'Verify source IDs and exception amounts: ₹8,000 + ₹7,000 + ₹4,000 = ₹19,000 in known-value exceptions. R05 remains unknown; do not replace it with ₹0.',
    conceptToRevisit: 'Stage 04 Work · Exception Register',
    actionTab: 'Work',
    actionLabel: 'Review Exceptions',
  });

  // 3. Mathematical Reconciliation Equation
  const rawTotal = 44000;
  const isBalanced = approvedTotal + quarantineTotal === rawTotal
    && isApprovedCorrect && isQuarantineCorrect;
  workChecks.push({
    id: 's07-w3-reconciliation-proof',
    title: 'Mathematical Reconciliation Proof',
    description: 'Verify the zero-variance proof: Raw Inflow (INR 44,000) == Clean Approved (INR 25,000) + Quarantined (INR 19,000).',
    passed: isBalanced && approvedCount > 0,
    status: (isBalanced && approvedCount > 0) ? 'passed' : (approvedCount > 0 || quarantineCount > 0) ? 'failed' : 'pending',
    studentValue: (approvedCount > 0 || quarantineCount > 0)
      ? `₹${approvedTotal.toLocaleString('en-IN')} + ₹${quarantineTotal.toLocaleString('en-IN')} = ₹${(approvedTotal + quarantineTotal).toLocaleString('en-IN')}`
      : 'Pending reconciliation',
    expectedRequirement: 'Known numeric amounts: ₹44,000 raw = ₹25,000 approved + ₹19,000 excluded/held. R05 is an additional unresolved blank, not ₹0. Confirm record identities as well as totals.',
    whyIncorrect: `Reconciliation variance of ₹${Math.abs(rawTotal - (approvedTotal + quarantineTotal)).toLocaleString('en-IN')} detected. In corporate audit, unexplained variance indicates lost or double-counted cash.`,
    conceptToRevisit: 'Stage 04 Work · Reconciliation Card',
    actionTab: 'Work',
    actionLabel: 'Balance Reconciliation',
  });

  // 4. Customer SUMIFS Verification
  const ashaClean = cleanRows
    .filter((r: any) => (r.customerStandard || r.customer || '').toLowerCase() === 'asha')
    .reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  const beaconClean = cleanRows
    .filter((r: any) => (r.customerStandard || r.customer || '').toLowerCase() === 'beacon')
    .reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);

  const isAshaCorrect = ashaClean === 17000;
  const isBeaconCorrect = beaconClean === 8000;
  const isSumifsCorrect = isAshaCorrect && isBeaconCorrect;

  workChecks.push({
    id: 's07-w4-sumifs',
    title: 'Customer Subtotals via =SUMIFS',
    description: 'Asha Approved Total = INR 17,000 (2 receipts); Beacon Approved Total = INR 8,000 (1 receipt).',
    passed: isSumifsCorrect,
    status: isSumifsCorrect ? 'passed' : approvedCount > 0 ? 'failed' : 'pending',
    studentValue: approvedCount > 0 ? `Asha: ₹${ashaClean.toLocaleString('en-IN')} | Beacon: ₹${beaconClean.toLocaleString('en-IN')}` : 'Unanswered',
    expectedRequirement: 'Asha: INR 17,000 (R01 ₹12k + R03 ₹5k); Beacon: INR 8,000 (R02 ₹8k).',
    whyIncorrect: !isAshaCorrect
      ? `Asha total is ₹${ashaClean.toLocaleString('en-IN')}, expected ₹17,000. Verify customer name standardization ('ASHA' and 'asha' consolidated to 'Asha').`
      : `Beacon total is ₹${beaconClean.toLocaleString('en-IN')}, expected ₹8,000. Check whether you double-counted the duplicate R02 receipt.`,
    conceptToRevisit: 'Stage 04 Work · Formula Log & Customer Subtotals',
    actionTab: 'Work',
    actionLabel: 'Verify SUMIFS Formula',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's07-t1-peer-audit',
      title: 'Peer Cross-Footing Audit',
      description: 'Document peer verification of Excel formulas and confirmation of customer master conventions.',
      passed: wordCount(teamContribution) >= 15,
      status: wordCount(teamContribution) >= 15 ? 'passed' : wordCount(teamContribution) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamContribution) > 0 ? `${wordCount(teamContribution)} words` : 'Unanswered',
      expectedRequirement: 'Record peer audit findings on formulas and date conventions.',
      actionTab: 'Team',
      actionLabel: 'Record Peer Audit',
    },
    {
      id: 's07-t2-zeroing-stand',
      title: 'Autonomous Anti-Zeroing Stand',
      description: 'Commit to never replacing blank amounts with ₹0 without bank verification.',
      passed: wordCount(teamJudgement) >= 10,
      status: wordCount(teamJudgement) >= 10 ? 'passed' : wordCount(teamJudgement) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamJudgement) > 0 ? `${wordCount(teamJudgement)} words` : 'Unanswered',
      expectedRequirement: 'Record refusal to artificially zero out R05.',
      actionTab: 'Team',
      actionLabel: 'Record Rule',
    },
  ];

  function compileStage(stage: 'Overview' | 'Learn' | 'Case' | 'Work' | 'Team', title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter(c => c.passed).length;
    const failedCount = checks.filter(c => c.status === 'failed').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const pendingCount = checks.filter(c => c.status === 'pending').length;

    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every(c => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted. Complete data cleaning and reconciliation activities.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} reconciliation variance${failedCount > 1 ? 's' : ''} detected. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks reconciled with exact zero-variance proof.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Mission & Raw Preservation', overviewChecks),
    Learn: compileStage('Learn', 'Quarantine vs Deletion Principle', learnChecks),
    Case: compileStage('Case', 'Case B Raw Inflow Records', caseChecks),
    Work: compileStage('Work', 'Clean Data, Exceptions & SUMIFS Model', workChecks),
    Team: compileStage('Team', 'Peer Audit & Anti-Zeroing Standard', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No data cleaning activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Data cleaning variances or duplicate errors detected. See reconciliation report below.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Excel Data Cleaning, Exception Register, and Reconciliation Proof fully verified!';
  }

  const recommendations: string[] = [];
  if (!isBalanced && (approvedCount > 0 || quarantineCount > 0)) {
    recommendations.push('Reconcile known-value records: ₹44,000 raw = ₹25,000 clean + ₹19,000 excluded/held. Verify row IDs and keep R05 unknown, not zero.');
  }
  if (!isQuarantineCorrect && quarantineCount > 0) {
    recommendations.push('Check each exception source ID and amount. R05 is blank/unknown and must never be entered as zero.');
  }
  if (!isApprovedCorrect && approvedCount > 0) {
    recommendations.push('Verify that approved rows are exactly R01, the first R02, and R03, with the original dates and approved customer names.');
  }
  if (!isSumifsCorrect && approvedCount > 0) {
    recommendations.push('Verify customer SUMIFS totals: Asha must equal INR 17,000 and Beacon must equal INR 8,000.');
  }

  return {
    sessionId: 7,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
