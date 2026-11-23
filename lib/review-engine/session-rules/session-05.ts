import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession05(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const wordCount = (str: string) => (str || '').trim().split(/\s+/).filter(Boolean).length;

  const rows: any[] = ws.rows || [];
  const exceptionsNotes = (ws.exceptionsNotes || draft['concept:explain'] || '').trim();
  const governance = ws.governance || {};

  const conceptExplain = (draft['concept:explain'] || exceptionsNotes || '').trim();
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
      id: 's05-o1-readiness',
      title: 'Case A September Accounting Release Orientation',
      description: 'Review the 12 commercial events from Case A. Opening balances on 1 September: Bank Dr ₹100,000; Capital Cr ₹100,000. Indirect tax and depreciation excluded.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Understand Case A synthetic evidence and fundamental accounting equation.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const explainLower = conceptExplain.toLowerCase();
  const hasDebitCredit = explainLower.includes('debit') || explainLower.includes('credit') || explainLower.includes('asset') || explainLower.includes('liability');
  const hasAccrualPrinciple = explainLower.includes('revenue') || explainLower.includes('advance') || explainLower.includes('receivable') || explainLower.includes('capital') || explainLower.includes('expense');
  const learnPassed = explainWords >= 20 && hasDebitCredit && hasAccrualPrinciple;

  learnChecks.push({
    id: 's05-l1-explain',
    title: 'Debit/Credit Rules & Accrual Accounting Principle',
    description: 'Explain the fundamental double-entry rule (debits increase assets/expenses; credits increase liabilities/equity/revenue) and why advances are liabilities.',
    passed: learnPassed,
    status: learnPassed ? 'passed' : explainWords > 0 ? 'warning' : 'pending',
    studentValue: explainWords > 0 ? `${explainWords} words entered` : 'Unanswered',
    expectedRequirement: 'Substantive explanation (>= 20 words) detailing double-entry classifications and revenue recognition timing.',
    whyIncorrect: 'Debits increase assets and expenses; credits increase liabilities, equity, and revenue. Customer advances remain liabilities until services are earned.',
    conceptToRevisit: 'Heading 1 · Accounting Principles',
    actionTab: 'Learn',
    actionLabel: 'Explain Double-Entry Rules',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's05-c1-case-a',
      title: 'Case A Source Evidence Isolation',
      description: 'Ensure only approved Case A transactions are journalized without introducing external GST or depreciation rules.',
      passed: true,
      status: 'passed',
      studentValue: 'Case A 12 events isolated',
      expectedRequirement: 'Direct entry from the 12 approved Case A source vouchers.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK (DELIVERABLES)
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: 12-Event Journal Completeness
  const hasAll12 = Array.isArray(rows) && rows.length === 12;
  const allAccountsAssigned = hasAll12 && rows.every((r: any) => r.debitAccount && r.creditAccount && r.amount > 0);

  workChecks.push({
    id: 's05-w1-register',
    title: 'Twelve-Event Transaction Journal Completeness',
    description: 'Complete the double-entry journal classification for all 12 September events in Case A.',
    passed: allAccountsAssigned,
    status: allAccountsAssigned ? 'passed' : rows.length > 0 ? 'warning' : 'pending',
    studentValue: allAccountsAssigned ? 'All 12 events journalized' : `${rows.length}/12 events recorded`,
    expectedRequirement: '12 complete journal rows with valid debit accounts, credit accounts, and amounts.',
    whyIncorrect: 'All 12 events from Case A must be fully classified with debit and credit accounts.',
    conceptToRevisit: 'Heading 2 · Prepare the Journal',
    actionTab: 'Work',
    actionLabel: 'Complete Journal Entries',
  });

  // Check 2: Balance Check (₹208,500 Dr = ₹208,500 Cr)
  const totalDebits = rows.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
  const isBalanced = totalDebits === 208500;

  workChecks.push({
    id: 's05-w2-balance',
    title: 'Double-Entry Balancing & Cross-Foot Verification',
    description: 'Verify that total journal debits equal total credits of ₹208,500 with zero reconciliation variance.',
    passed: isBalanced,
    status: isBalanced ? 'passed' : totalDebits > 0 ? 'failed' : 'pending',
    studentValue: isBalanced ? '₹208,500 (Balanced · Zero Variance)' : `₹${totalDebits.toLocaleString('en-IN')} (Target: ₹208,500)`,
    expectedRequirement: 'Total journal debits and credits must equal exactly ₹208,500 across the 12 transactions.',
    whyIncorrect: `Total debits must equal ₹208,500. Currently calculated: ₹${totalDebits.toLocaleString('en-IN')}. Check amounts on each entry.`,
    conceptToRevisit: 'Heading 2 · Balance Gauge',
    actionTab: 'Work',
    actionLabel: 'Rebalance Journal',
  });

  // Check 3: Customer Advance (A09) Logic
  const rowA09 = rows.find((r: any) => r.docId === 'A09');
  const a09Correct = rowA09 && (rowA09.creditAccount.toLowerCase().includes('unearned') || rowA09.creditAccount.toLowerCase().includes('advance') || rowA09.creditAccount.toLowerCase().includes('liability'));

  workChecks.push({
    id: 's05-w3-advance-logic',
    title: 'Customer Advance Liability Accounting (Doc A09)',
    description: 'Verify that the ₹15,000 customer advance (A09) is credited to a Liability account (Unearned Revenue), NOT Service Revenue.',
    passed: !!a09Correct,
    status: a09Correct ? 'passed' : 'failed',
    studentValue: a09Correct ? 'Credited to Liability (Unearned Revenue)' : rowA09 ? `Credited to ${rowA09.creditAccount}` : 'Unanswered',
    expectedRequirement: 'A09 customer advance must be credited to Unearned Revenue / Customer Advance (Liability).',
    whyIncorrect: 'Customer advances received before service delivery represent an obligation/liability. Crediting revenue prematurely violates GAAP.',
    conceptToRevisit: 'Heading 2 · Advance Logic (A09)',
    actionTab: 'Work',
    actionLabel: 'Correct A09 Entry',
  });

  // Check 4: Accounts Receivable Collection (A05) Logic
  const rowA05 = rows.find((r: any) => r.docId === 'A05');
  const a05Correct = rowA05 && (rowA05.creditAccount.toLowerCase().includes('receivable') || rowA05.creditAccount.toLowerCase().includes('debtor'));

  workChecks.push({
    id: 's05-w4-receivable-logic',
    title: 'Receivable Collection vs Revenue (Doc A05)',
    description: 'Verify that the ₹35,000 collection against invoice A01 is credited to Accounts Receivable, not recognized as revenue again.',
    passed: !!a05Correct,
    status: a05Correct ? 'passed' : 'failed',
    studentValue: a05Correct ? 'Credited to Accounts Receivable' : rowA05 ? `Credited to ${rowA05.creditAccount}` : 'Unanswered',
    expectedRequirement: 'A05 must credit Accounts Receivable. Revenue was already recognized on A01.',
    whyIncorrect: 'Collecting cash against an invoice reduces the customer receivable asset. Crediting revenue again duplicates sales.',
    conceptToRevisit: 'Heading 2 · Receivable Logic (A05)',
    actionTab: 'Work',
    actionLabel: 'Correct A05 Entry',
  });

  // Check 5: Equipment Capitalization (A12) Logic
  const rowA12 = rows.find((r: any) => r.docId === 'A12');
  const a12Correct =
    rowA12 &&
    !rowA12.debitAccount.toLowerCase().includes('expense') &&
    (rowA12.debitAccount.toLowerCase().includes('equipment') ||
      rowA12.debitAccount.toLowerCase().includes('asset') ||
      rowA12.debitAccount.toLowerCase().includes('fixed'));

  workChecks.push({
    id: 's05-w5-equipment-logic',
    title: 'Equipment Capitalization vs Operating Expense (Doc A12)',
    description: 'Verify that the ₹5,000 equipment acquisition (A12) is debited to Equipment Asset, rather than expensed as an operating cost.',
    passed: !!a12Correct,
    status: a12Correct ? 'passed' : 'failed',
    studentValue: a12Correct ? 'Debited to Equipment Asset' : rowA12 ? `Debited to ${rowA12.debitAccount}` : 'Unanswered',
    expectedRequirement: 'A12 equipment purchase must be capitalized as an asset on the balance sheet.',
    whyIncorrect: 'Long-term productive assets must be capitalized. Immediate expensing understates net assets.',
    conceptToRevisit: 'Heading 2 · Equipment Logic (A12)',
    actionTab: 'Work',
    actionLabel: 'Correct A12 Entry',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];

  teamChecks.push({
    id: 's05-t1-contribution',
    title: 'Attributable Journal Contribution & Peer Review',
    description: 'Record your attributable contribution and at least one entry correction caught by peer review.',
    passed: contribWords >= 15,
    status: contribWords >= 15 ? 'passed' : contribWords > 0 ? 'warning' : 'pending',
    studentValue: contribWords > 0 ? `${contribWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document individual work and specific peer review corrections (>= 15 words).',
    whyIncorrect: 'Individual accountability and peer review audit trail required for professional certification.',
    conceptToRevisit: 'Heading 2 · Attributable Contribution',
    actionTab: 'Team',
    actionLabel: 'Record Contribution',
  });

  teamChecks.push({
    id: 's05-t2-judgement',
    title: 'Autonomous Commercial Quality Boundary (Quality Stance)',
    description: 'Document an independent professional judgment (e.g. refusing to book unearned customer advances as revenue).',
    passed: judgeWords >= 10,
    status: judgeWords >= 10 ? 'passed' : judgeWords > 0 ? 'warning' : 'pending',
    studentValue: judgeWords > 0 ? `${judgeWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document an independent commercial boundary (>= 10 words).',
    whyIncorrect: 'Accounts executives must formulate an independent quality stance against aggressive revenue recognition.',
    conceptToRevisit: 'Heading 2 · Professional Boundary',
    actionTab: 'Team',
    actionLabel: 'Record Independent Boundary',
  });

  // ----------------------------------------------------
  // AGGREGATE
  // ----------------------------------------------------
  function compileStage(stage: 'Overview' | 'Learn' | 'Case' | 'Work' | 'Team', title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter(c => c.passed).length;
    const failedCount = checks.filter(c => c.status === 'failed').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const pendingCount = checks.filter(c => c.status === 'pending').length;

    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every(c => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted. Complete the activities in this section.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} requirement${failedCount > 1 ? 's' : ''} not met. Review journal balancing and account classifications.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified. Complete remaining required items.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against Session 05 double-entry standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Case A Release Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Debit/Credit & Accrual Rules', learnChecks),
    Case: compileStage('Case', 'Source Evidence Isolation', caseChecks),
    Work: compileStage('Work', 'Journal Register & Balancing Deliverables', workChecks),
    Team: compileStage('Team', 'Squad Accountability & Professional Judgment', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No journal entries attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Journal is out of balance or has incorrect account classifications.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified. Complete remaining entries.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Session 05 Case A General Journal verified against Drive Edition 3.0 double-entry standards!';
  }

  return {
    sessionId: 5,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: hasErrors ? ['Review journal entries A05, A09, and A12, and ensure total debits equal ₹208,500.'] : [],
  };
}
