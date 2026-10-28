import { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types';

export function evaluateSession08(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const unadjustedBook = ws.unadjustedBook ?? 87500;
  const bankCharges = ws.bankCharges ?? 500;
  const interestEarned = ws.interestEarned ?? 200;
  const unpresentedCheque = ws.unpresentedCheque ?? 6000;
  const depositInTransit = ws.depositInTransit ?? 10000;
  const actualStatement = ws.actualStatement ?? 83200;

  const conceptExplain = (draft['concept:explain'] || '').trim();
  const teamContribution = (draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's08-o1-brs-mission',
      title: 'BRS Architecture & Separation Objective',
      description: 'Understand the three-column BRS method separating permanent cash book adjustments from temporary timing differences.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Apply three-column reconciliation bridge: Adjusted Cash Book + Unpresented Cheques - Deposits in Transit = Bank Statement.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const lWords = wordCount(conceptExplain);
  const lLower = conceptExplain.toLowerCase();
  const hasTiming = lLower.includes('timing') || lLower.includes('transit') || lLower.includes('unpresented') || lLower.includes('difference');
  const hasAdjust = lLower.includes('adjust') || lLower.includes('charge') || lLower.includes('interest') || lLower.includes('permanent');
  const lPassed = lWords >= 20 && (hasTiming || hasAdjust);

  learnChecks.push({
    id: 's08-l1-timing-principle',
    title: 'Timing Differences vs Ledger Adjustments',
    description: 'Explain why bank charges and interest require cash book journal entries while unpresented cheques remain on the BRS schedule only.',
    passed: lPassed,
    status: lPassed ? 'passed' : lWords > 0 ? 'warning' : 'pending',
    studentValue: lWords > 0 ? `${lWords} words entered` : 'Unanswered',
    expectedRequirement: 'A substantive explanation (>= 20 words) explaining that timing differences clear naturally and must never be posted twice to ledger accounts.',
    whyIncorrect: 'Clarify the distinction: permanent items change the cash book; timing differences only reconcile the BRS schedule.',
    conceptToRevisit: 'Stage 02 Learn · Bank Reconciliation Concepts',
    actionTab: 'Learn',
    actionLabel: 'Explain Principle',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's08-c1-casec',
      title: 'Case C October Financial Balances',
      description: 'Confirm baseline figures: Unadjusted Cash Book (₹87,500 Dr) and Bank Statement (₹83,200 Cr).',
      passed: true,
      status: 'passed',
      studentValue: 'Case C figures verified',
      expectedRequirement: 'Unadjusted Book ₹87,500; Statement ₹83,200; Charges ₹500; Interest ₹200; In Transit ₹10,000; Unpresented ₹6,000.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Adjusted Cash Book Calculation
  const calculatedAdjustedBook = unadjustedBook - bankCharges + interestEarned;
  const isAdjustedBookCorrect = calculatedAdjustedBook === 87200;

  workChecks.push({
    id: 's08-w1-adjusted-cashbook',
    title: 'Adjusted Cash Book Balance (INR 87,200)',
    description: 'Post permanent adjustments: Unadjusted (₹87,500) - Bank Charges (₹500) + Interest Earned (₹200) = ₹87,200.',
    passed: isAdjustedBookCorrect,
    status: isAdjustedBookCorrect ? 'passed' : 'failed',
    studentValue: `₹${calculatedAdjustedBook.toLocaleString('en-IN')}`,
    expectedRequirement: 'Adjusted Cash Book must equal exactly INR 87,200.',
    whyIncorrect: `Your adjusted cash book balance is ₹${calculatedAdjustedBook.toLocaleString('en-IN')}. Verify that ₹500 is deducted and ₹200 is added.`,
    conceptToRevisit: 'Stage 04 Work · Cash Book Adjustments',
    actionTab: 'Work',
    actionLabel: 'Check Adjustments',
  });

  // Check 2: Bank Statement Reconciled Bridge
  const calculatedStatement = calculatedAdjustedBook + unpresentedCheque - depositInTransit;
  const isStatementBridgeCorrect = calculatedStatement === 83200;

  workChecks.push({
    id: 's08-w2-statement-bridge',
    title: 'BRS Statement Bridge Calculation (INR 83,200)',
    description: 'Adjusted Book (₹87,200) + Unpresented Cheques (₹6,000) - Deposits in Transit (₹10,000) = Calculated Statement (₹83,200).',
    passed: isStatementBridgeCorrect,
    status: isStatementBridgeCorrect ? 'passed' : 'failed',
    studentValue: `₹${calculatedStatement.toLocaleString('en-IN')}`,
    expectedRequirement: 'Calculated statement balance must equal exactly INR 83,200.',
    whyIncorrect: `Your calculated statement balance is ₹${calculatedStatement.toLocaleString('en-IN')}. Verify that unpresented cheques are added and in-transit deposits are deducted.`,
    conceptToRevisit: 'Stage 04 Work · BRS Schedule',
    actionTab: 'Work',
    actionLabel: 'Recalculate Bridge',
  });

  // Check 3: Zero-Variance Proof
  const variance = actualStatement - calculatedStatement;
  const isZeroVariance = variance === 0 && isStatementBridgeCorrect;

  workChecks.push({
    id: 's08-w3-zero-variance',
    title: 'Zero Unexplained Variance Proof',
    description: 'Confirm that Calculated Statement (₹83,200) - Actual Bank Statement (₹83,200) = INR 0.',
    passed: isZeroVariance,
    status: isZeroVariance ? 'passed' : 'failed',
    studentValue: `Variance: ₹${variance.toLocaleString('en-IN')}`,
    expectedRequirement: 'Variance must equal exactly INR 0 without forcing unexplained plugs.',
    whyIncorrect: `Reconciliation variance of ₹${Math.abs(variance).toLocaleString('en-IN')} detected. Never force plugs to match statement balances.`,
    conceptToRevisit: 'Stage 04 Work · Variance Check',
    actionTab: 'Work',
    actionLabel: 'Verify Zero Variance',
  });

  // Check 4: Timing Exception Register
  const exceptions = ws.exceptionLog || [];
  const hasExceptions = exceptions.length >= 2;

  workChecks.push({
    id: 's08-w4-timing-log',
    title: 'Timing Exception Register & Action Owners',
    description: 'Document both timing differences (₹10,000 deposit in transit and ₹6,000 unpresented cheque) with assigned follow-up owners.',
    passed: hasExceptions,
    status: hasExceptions ? 'passed' : 'pending',
    studentValue: hasExceptions ? `${exceptions.length} items logged` : 'Unanswered',
    expectedRequirement: 'Log deposit in transit and unpresented cheque with source evidence and target clearance dates.',
    whyIncorrect: 'Document both timing items in the exception register with assigned action owners.',
    conceptToRevisit: 'Stage 04 Work · Timing Exception Log',
    actionTab: 'Work',
    actionLabel: 'Log Timing Items',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's08-t1-peer-challenge',
      title: 'Peer Ledger Posting Challenge',
      description: 'Document your explanation to the controller on why posting a timing difference twice into ledgers creates false revenue.',
      passed: wordCount(teamContribution) >= 15,
      status: wordCount(teamContribution) >= 15 ? 'passed' : wordCount(teamContribution) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamContribution) > 0 ? `${wordCount(teamContribution)} words` : 'Unanswered',
      expectedRequirement: 'Explain why unpresented cheques and deposits in transit clear naturally through the banking system.',
      actionTab: 'Team',
      actionLabel: 'Record Contribution',
    },
    {
      id: 's08-t2-anti-plug-stand',
      title: 'Autonomous Anti-Plug Standard',
      description: 'Commit to never using unexplained plug balances to balance financial reconciliations.',
      passed: wordCount(teamJudgement) >= 10,
      status: wordCount(teamJudgement) >= 10 ? 'passed' : wordCount(teamJudgement) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamJudgement) > 0 ? `${wordCount(teamJudgement)} words` : 'Unanswered',
      expectedRequirement: 'State that an unexplained plug violates internal controls and damages professional audit credibility.',
      actionTab: 'Team',
      actionLabel: 'Record Principle',
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
      summary = 'Not yet attempted. Complete reconciliation schedule and journal adjustments.';
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
    Overview: compileStage('Overview', 'BRS Mission & Separation Rule', overviewChecks),
    Learn: compileStage('Learn', 'Timing vs Permanent Principle', learnChecks),
    Case: compileStage('Case', 'Case C October Snapshot Facts', caseChecks),
    Work: compileStage('Work', 'Three-Column BRS Bridge & Journals', workChecks),
    Team: compileStage('Team', 'Peer Challenge & Anti-Plug Standard', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No BRS activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: BRS bridge variance or adjustment calculation errors detected.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Bank Reconciliation Statement, Adjustment Journals, and Timing Exception Register fully verified!';
  }

  const recommendations: string[] = [];
  if (!isAdjustedBookCorrect) {
    recommendations.push('Recheck adjusted cash book balance: Unadjusted (₹87,500) - Bank Charges (₹500) + Interest (₹200) = ₹87,200.');
  }
  if (!isZeroVariance) {
    recommendations.push('Reconcile statement bridge: Adjusted Cash Book (₹87,200) + Unpresented Cheques (₹6,000) - Deposit in Transit (₹10,000) must equal ₹83,200.');
  }

  return {
    sessionId: 8,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
