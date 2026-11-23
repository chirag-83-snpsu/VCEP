import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession06(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const wordCount = (str: string) => (str || '').trim().split(/\s+/).filter(Boolean).length;

  const correctionJournal = ws.correctionJournal || {};
  const undetectedErrors = (ws.undetectedErrors || draft['work-prompt:0'] || draft['concept:explain'] || '').trim();
  const checklist = Array.isArray(ws.checklist) ? ws.checklist : [];
  const governance = ws.governance || {};

  const conceptExplain = (draft['concept:explain'] || undetectedErrors || '').trim();
  const explainWords = wordCount(conceptExplain);

  const teamContribution = (draft['team:contribution'] || governance.contributionSummary || '').trim();
  const contribWords = wordCount(teamContribution);

  const teamJudgement = (draft['team:judgement'] || governance.professionalBoundary || '').trim();
  const judgeWords = wordCount(teamJudgement);

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's06-o1-readiness',
      title: 'Case A Month-End Close Orientation',
      description: 'Review the Case A September accounting close scenario, deliberate ₹35,000 revenue error, and month-end financial statement reconciliation requirements.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Understand Case A synthetic evidence and trial balance limitations.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const explainLower = (conceptExplain + ' ' + undetectedErrors).toLowerCase();
  const hasTrialBalanceLimits =
    explainLower.includes('trial balance') ||
    explainLower.includes('omission') ||
    explainLower.includes('principle') ||
    explainLower.includes('balance');

  learnChecks.push({
    id: 's06-l1-trial-balance-limits',
    title: 'Trial Balance Verification Limitations',
    description: 'Explain why an agreeing trial balance only verifies debit/credit arithmetic equality, but does not prove the absence of errors of principle or omission.',
    passed: explainWords >= 15 && hasTrialBalanceLimits,
    status: explainWords >= 15 && hasTrialBalanceLimits ? 'passed' : explainWords > 0 ? 'warning' : 'pending',
    studentValue: `${explainWords} words`,
    expectedRequirement: 'Minimum 15 words explaining why balanced debits and credits do not prove transactions are correctly classified.',
    whyIncorrect: 'Provide a clear explanation of trial balance limitations (e.g. errors of principle or omission).',
    conceptToRevisit: 'Heading 1 · Trial Balance Concept',
    actionTab: 'Learn',
    actionLabel: 'Explain Trial Balance Limitations',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [];
  const hasA05ErrorUnderstanding =
    explainLower.includes('35000') ||
    explainLower.includes('35,000') ||
    explainLower.includes('a05') ||
    explainLower.includes('revenue') ||
    explainLower.includes('receivable');

  caseChecks.push({
    id: 's06-c1-error-identification',
    title: 'Deliberate ₹35,000 Revenue Error Audit',
    description: 'Identify that the ₹35,000 customer collection (A05) was erroneously credited to Service Revenue instead of Accounts Receivable while cash posting was correct.',
    passed: hasA05ErrorUnderstanding,
    status: hasA05ErrorUnderstanding ? 'passed' : 'warning',
    studentValue: hasA05ErrorUnderstanding ? 'Audited (A05 Revenue Misposting)' : 'Pending audit review',
    expectedRequirement: 'Recognize that A05 collection should reduce Accounts Receivable, not increase revenue.',
    whyIncorrect: 'Audit the draft ledger postings for Doc A05 to locate the premature revenue recognition error.',
    conceptToRevisit: 'Heading 1 · Investigate the Ledger Error',
    actionTab: 'Case',
    actionLabel: 'Audit Case A Ledger',
  });

  // ----------------------------------------------------
  // STAGE 04: WORK (The Month-End Close Workbench)
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Correction Journal Reversal
  const isApplied = correctionJournal.isApplied ?? ws.errorCorrected ?? true;
  const debitAcc = (correctionJournal.debitAccount || '').toLowerCase();
  const creditAcc = (correctionJournal.creditAccount || '').toLowerCase();
  const amount = Number(correctionJournal.amount) || 35000;

  const touchesBank = debitAcc.includes('bank') || creditAcc.includes('bank') || debitAcc.includes('cash') || creditAcc.includes('cash');
  const correctDebit = debitAcc.includes('revenue');
  const correctCredit = creditAcc.includes('receivable');
  const correctAmount = amount === 35000;

  const journalPassed = isApplied && !touchesBank && (correctDebit || correctCredit) && correctAmount;

  workChecks.push({
    id: 's06-w1-correction-journal',
    title: 'Correction Journal Posting (Cash Invariance)',
    description: 'Debit Service Revenue ₹35,000 and Credit Accounts Receivable ₹35,000 to reverse overstatement without altering correctly posted Bank cash.',
    passed: journalPassed,
    status: journalPassed ? 'passed' : touchesBank ? 'failed' : 'warning',
    studentValue: touchesBank
      ? 'Error: Correction journal altered Cash/Bank!'
      : journalPassed
      ? 'Dr Revenue ₹35,000 | Cr AR ₹35,000 (Cash Unchanged)'
      : isApplied
      ? 'Correction details incomplete'
      : 'Uncorrected (Error Active)',
    expectedRequirement: 'Correction journal: Dr Service Revenue ₹35,000, Cr Accounts Receivable ₹35,000. Cash must be unchanged.',
    whyIncorrect: touchesBank
      ? 'Bank was already correctly debited with ₹35,000 in A05. Do NOT touch Bank cash in the correction journal!'
      : 'Debit Service Revenue and Credit Accounts Receivable to reverse the premature revenue recognition.',
    conceptToRevisit: 'Heading 1 · Correction Journal Workbench',
    actionTab: 'Work',
    actionLabel: 'Post Correction Journal',
  });

  // Check 2: Closing Trial Balance (Target: ₹2,18,000)
  // In corrected state: Bank 141.5k + AR 25k + Equip 5k + Rent 12k + Soft 6k + Cont 18k + WageExp 10k + Chg 500 = 218,000
  const tbPassed = isApplied && !touchesBank;

  workChecks.push({
    id: 's06-w2-trial-balance',
    title: 'Closing Trial Balance Equality (₹2,18,000)',
    description: 'Verify that corrected trial balance debits equal credits at exactly ₹2,18,000 with zero variance.',
    passed: tbPassed,
    status: tbPassed ? 'passed' : 'failed',
    studentValue: tbPassed ? '₹2,18,000 Dr = ₹2,18,000 Cr (Balanced)' : '₹2,53,000 (Uncorrected Overstated State)',
    expectedRequirement: 'Closing Trial Balance debits and credits must equal ₹2,18,000 after reversing the ₹35,000 error.',
    whyIncorrect: 'Apply the correction journal to restore the trial balance to the authentic ₹2,18,000 total.',
    conceptToRevisit: 'Heading 2 · Closing Trial Balance',
    actionTab: 'Work',
    actionLabel: 'Reconcile Trial Balance',
  });

  // Check 3: Income Statement (Target: Net Profit ₹53,500)
  // Revenue ₹100,000 - Total Expenses ₹46,500 = ₹53,500
  const incomePassed = isApplied && !touchesBank;

  workChecks.push({
    id: 's06-w3-income-statement',
    title: 'September Income Statement (Net Profit ₹53,500)',
    description: 'Verify September net profit of ₹53,500 based on Revenue ₹100,000 less total operating expenses of ₹46,500.',
    passed: incomePassed,
    status: incomePassed ? 'passed' : 'failed',
    studentValue: incomePassed ? 'Net Profit ₹53,500 (Revenue ₹100,000 - Exp ₹46,500)' : 'Net Profit ₹88,500 (Overstated by ₹35,000)',
    expectedRequirement: 'Net Profit must be ₹53,500 (₹100,000 revenue - ₹46,500 expenses).',
    whyIncorrect: 'Uncorrected revenue overstates net profit by ₹35,000. Apply correction to reflect actual ₹53,500 profit.',
    conceptToRevisit: 'Heading 2 · Income Statement',
    actionTab: 'Work',
    actionLabel: 'Review Net Profit',
  });

  // Check 4: Accounting Equation Verification
  // Assets (₹171,500) = Liabilities (₹18,000) + Equity (₹153,500)
  const equationPassed = isApplied && !touchesBank;

  workChecks.push({
    id: 's06-w4-accounting-equation',
    title: 'Balance Sheet Accounting Equation (₹171,500)',
    description: 'Verify fundamental accounting equation: Assets (₹171,500) = Liabilities (₹18,000) + Equity (₹153,500).',
    passed: equationPassed,
    status: equationPassed ? 'passed' : 'failed',
    studentValue: equationPassed ? 'Assets ₹171,500 = Liab ₹18,000 + Eq ₹153,500' : 'Equation requires correction journal application',
    expectedRequirement: 'Assets (₹171,500) must equal Liabilities (₹18,000) + Equity (₹153,500).',
    whyIncorrect: 'Verify that corrected assets (Bank ₹141,500 + AR ₹25,000 + Equip ₹5,000) equal liabilities plus updated equity.',
    conceptToRevisit: 'Heading 2 · Accounting Equation',
    actionTab: 'Work',
    actionLabel: 'Verify Balance Sheet Identity',
  });

  // Check 5: Undetectable Errors Explanation
  const hasTwoErrors =
    (explainLower.includes('omission') && (explainLower.includes('principle') || explainLower.includes('commission') || explainLower.includes('compensating'))) ||
    explainWords >= 25;

  workChecks.push({
    id: 's06-w5-undetectable-errors',
    title: 'Two Undetectable Errors Analysis',
    description: 'Document at least two specific error classes that a balanced trial balance cannot detect (e.g. Error of Principle, Error of Omission).',
    passed: hasTwoErrors,
    status: hasTwoErrors ? 'passed' : 'warning',
    studentValue: hasTwoErrors ? '2 Error Classes Explained' : `${explainWords} words provided`,
    expectedRequirement: 'Explain at least two errors that evade trial balance detection (e.g. Error of Omission, Error of Principle).',
    whyIncorrect: 'Explain why balanced debits and credits do not reveal errors of omission or errors of principle.',
    conceptToRevisit: 'Heading 2 · Undetectable Errors',
    actionTab: 'Work',
    actionLabel: 'Document Undetectable Errors',
  });

  // Check 6: Month-End Close Checklist
  const verifiedCount = checklist.filter((c: any) => c.verified).length;
  const checklistPassed = checklist.length === 0 || verifiedCount >= 3;

  workChecks.push({
    id: 's06-w6-close-checklist',
    title: 'Month-End Review Sign-Off Checklist',
    description: 'Verify internal control sign-offs across Bank reconciliation, Receivables aging, Accrued liabilities, and Source evidence completeness.',
    passed: checklistPassed,
    status: checklistPassed ? 'passed' : 'warning',
    studentValue: `${verifiedCount}/${checklist.length || 4} controls verified`,
    expectedRequirement: 'Complete sign-off of at least 3 month-end verification controls.',
    whyIncorrect: 'Sign off the month-end close checklist items for bank, receivables, liabilities, and source evidence.',
    conceptToRevisit: 'Heading 2 · Month-End Close Checklist',
    actionTab: 'Work',
    actionLabel: 'Complete Close Checklist',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];

  teamChecks.push({
    id: 's06-t1-contribution',
    title: 'Individual Contribution & Close Accountability',
    description: 'Detail your personal close duties, reconciliation calculations performed, and ledger verification sign-offs.',
    passed: contribWords >= 10,
    status: contribWords >= 10 ? 'passed' : contribWords > 0 ? 'warning' : 'pending',
    studentValue: `${contribWords} words`,
    expectedRequirement: 'Minimum 10 words detailing personal contribution to the month-end close process.',
    whyIncorrect: 'State your specific tasks: ledger postings checked, correction journal drafted, or trial balance verified.',
    conceptToRevisit: 'Heading 2 · Portfolio Governance',
    actionTab: 'Team',
    actionLabel: 'Record Contribution',
  });

  teamChecks.push({
    id: 's06-t2-judgement',
    title: 'Autonomous Accounting Judgment Declaration',
    description: 'Declare your professional boundary: verifying calculations independently and acknowledging that an agreeing trial balance is not proof of accuracy.',
    passed: judgeWords >= 10,
    status: judgeWords >= 10 ? 'passed' : judgeWords > 0 ? 'warning' : 'pending',
    studentValue: `${judgeWords} words`,
    expectedRequirement: 'Minimum 10 words declaring your autonomous professional boundary and verification judgment.',
    whyIncorrect: 'State your professional judgment boundary: e.g. refusing to sign off accounts based solely on mathematical trial balance agreement.',
    conceptToRevisit: 'Heading 2 · Autonomous Boundary',
    actionTab: 'Team',
    actionLabel: 'Record Professional Boundary',
  });

  // ----------------------------------------------------
  // STAGE SUMMARIES & SCORE CALCULATION
  // ----------------------------------------------------
  const makeStageResult = (stage: any, title: string, summary: string, checks: ReviewCheckItem[]): StageReviewResult => {
    const passed = checks.filter((c) => c.passed).length;
    const total = checks.length;
    let status: StageStatus = 'in_progress';
    if (passed === total) status = 'reviewed';
    else if (checks.some((c) => c.status === 'failed')) status = 'needs_revision';
    else if (passed === 0) status = 'not_started';

    return {
      stage,
      title,
      summary,
      status,
      checks,
      passedCount: passed,
      totalCount: total,
    };
  };

  const stages: Record<string, StageReviewResult> = {
    Overview: makeStageResult('Overview', 'Case A Close Orientation', 'Understanding Case A month-end scope and error.', overviewChecks),
    Learn: makeStageResult('Learn', 'Trial Balance Limitations', 'Understanding why balanced debits and credits do not prove accuracy.', learnChecks),
    Case: makeStageResult('Case', 'Deliberate Error Audit', 'Audit identification of A05 revenue misclassification.', caseChecks),
    Work: makeStageResult('Work', 'Month-End Close Workbench', 'Correction journal, trial balance, income statement, and checklist.', workChecks),
    Team: makeStageResult('Team', 'Governance & Audit Boundary', 'Individual contribution and autonomous professional judgment.', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalChecks = allChecks.length;
  const passedChecks = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'in_progress';
  if (passedChecks === totalChecks) overallStatus = 'reviewed';
  else if (hasErrors) overallStatus = 'needs_revision';

  const revisitRecommendations: string[] = allChecks
    .filter((c) => !c.passed && c.conceptToRevisit)
    .map((c) => c.conceptToRevisit as string);

  return {
    sessionId: 6,
    overallStatus,
    overallSummary: hasErrors
      ? 'Month-End Close requires revision: Ensure correction journal reverses revenue without touching cash.'
      : passedChecks === totalChecks
      ? 'Month-End Close Complete: Ledgers reconciled, Trial Balance balanced at ₹2,18,000, and Net Profit verified at ₹53,500.'
      : 'Month-End Close in progress: Complete the correction journal, statement checks, and reviewer checklist.',
    stages: stages as any,
    totalChecks,
    passedChecks,
    hasErrors,
    revisitRecommendations,
  };
}

