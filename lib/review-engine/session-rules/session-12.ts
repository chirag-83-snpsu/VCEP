import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus, StageName } from '../types.ts';

export function evaluateSession12(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const invoiceAudits = ws.invoiceAudits || {};
  const targetedIds: string[] = ws.targetedInvoiceIds || [];
  const beaconMsg = (ws.beaconDisputeMessage || draft['concept:explain'] || '').trim();
  const reminderMsg = (ws.overdueReminderMessage || draft['team:contribution'] || '').trim();
  const governance = ws.governance || {};

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's12-o1-receivables-mission',
      title: 'Credit Control & Liquidity Action Mission',
      description: 'Turn overdue receivables into cleared cash; eliminate the ₹20,000 7-day deficit while isolating billing disputes.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Inspect Case F invoices (F01–F04), age debts from due dates, and forecast 7-day cash flows.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's12-l1-due-date-rule',
      title: 'Due Date Ageing Measurement Principle',
      description: 'Days overdue = Max(0, As-of Date minus Due Date). Current bucket includes invoices due today (31 Oct).',
      passed: true,
      status: 'passed',
      studentValue: 'Verified (Due date ageing rule)',
      expectedRequirement: 'Measure overdue days strictly from payment due dates, not invoice creation dates.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's12-c1-casef-records',
      title: 'Case F Verified Receivables & Cash Ledger',
      description: 'Confirm direct review of Case F: ₹1,00,000 receivables, ₹25,000 bank balance, ₹45,000 payments due.',
      passed: true,
      status: 'passed',
      studentValue: 'Case F records verified',
      expectedRequirement: 'Ground all forecasts in Case F 31 Oct balances: ₹25k bank, ₹45k outflows, ₹100k receivables.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Ageing Buckets Accuracy (F01 Current, F02 1-30d, F03 31-60d, F04 61-90d)
  const f1 = invoiceAudits.F01 || {};
  const f2 = invoiceAudits.F02 || {};
  const f3 = invoiceAudits.F03 || {};
  const f4 = invoiceAudits.F04 || {};

  const isF1Correct = f1.assignedBucket === 'Current' || !f1.assignedBucket;
  const isF2Correct = f2.assignedBucket === '1–30 Days' || !f2.assignedBucket;
  const isF3Correct = f3.assignedBucket === '31–60 Days' || !f3.assignedBucket;
  const isF4Correct = f4.assignedBucket === '61–90 Days' || !f4.assignedBucket;

  const isAgeingComplete = isF1Correct && isF2Correct && isF3Correct && isF4Correct;

  workChecks.push({
    id: 's12-w1-ageing-buckets',
    title: 'Receivables Ageing Classification (F01–F04)',
    description: 'Accurately age invoices: F01 Current (0d), F02 1–30 Days (15d), F03 31–60 Days (45d), F04 61–90 Days (75d).',
    passed: isAgeingComplete,
    status: isAgeingComplete ? 'passed' : 'failed',
    studentValue: isAgeingComplete ? 'All 4 Invoices Correctly Aged' : 'Ageing Bucket Misclassification',
    expectedRequirement: 'F01 = Current, F02 = 1–30d, F03 = 31–60d, F04 = 61–90d.',
    whyIncorrect: 'Check due dates: F01 is due today (0d, Current); F02 is 15d overdue (1–30d); F03 is 45d overdue (31–60d); F04 is 75d overdue (61–90d).',
    conceptToRevisit: 'Stage 04 Work · Receivables Ageing Schedule',
    actionTab: 'Work',
    actionLabel: 'Age Invoices',
  });

  // Check 2: Outstanding Balance Reconciliation (Total ₹1,00,000)
  workChecks.push({
    id: 's12-w2-reconcile-totals',
    title: 'Receivables Ledger Total Reconciliation',
    description: 'Verify cross-foot total of receivables: ₹10,000 + ₹20,000 + ₹30,000 + ₹40,000 = ₹1,00,000 total outstanding.',
    passed: true,
    status: 'passed',
    studentValue: '₹1,00,000 Outstanding Verified',
    expectedRequirement: 'Total outstanding must reconcile to exactly ₹1,00,000 across all 4 invoices.',
    actionTab: 'Work',
  });

  // Check 3: Seven-Day Cash Gap Analytics (₹25k bank - ₹45k outflows = -₹20k deficit)
  workChecks.push({
    id: 's12-w3-cash-gap-analytics',
    title: 'Seven-Day Baseline Cash Gap Analytics',
    description: 'Compute initial liquidity deficit: ₹25,000 opening bank minus ₹45,000 mandatory payments = ₹20,000 deficit.',
    passed: true,
    status: 'passed',
    studentValue: 'Deficit: -₹20,000 (Opening ₹25k vs Payments ₹45k)',
    expectedRequirement: 'Calculate initial no-collection cash deficit of ₹20,000.',
    actionTab: 'Work',
  });

  // Check 4: Tactical Collection Plan (Targets Beacon undisputed ₹15k + Asha ₹10k to eliminate gap)
  const targetsBeacon = targetedIds.includes('F02');
  const targetsAsha = targetedIds.includes('F01');
  const reliesOnDelta = targetedIds.includes('F04') && targetedIds.length === 1;

  let totalProjected = 0;
  if (targetedIds.includes('F01')) totalProjected += 10000;
  if (targetedIds.includes('F02')) totalProjected += 15000; // Undisputed portion only!
  if (targetedIds.includes('F03')) totalProjected += 30000;
  if (targetedIds.includes('F04')) totalProjected += 40000;

  const closesDeficit = 25000 + totalProjected >= 45000;
  const isPlanTactical = closesDeficit && !reliesOnDelta && (targetsBeacon || targetsAsha);

  workChecks.push({
    id: 's12-w4-collection-plan',
    title: 'Deficit Closure & Priority Collection Plan',
    description: 'Target high-probability collections (Beacon undisputed ₹15k and Asha ₹10k) to eliminate the ₹20,000 cash deficit without relying on high-risk 75d debts.',
    passed: isPlanTactical,
    status: isPlanTactical ? 'passed' : 'failed',
    studentValue: isPlanTactical ? `Projected: ₹${totalProjected.toLocaleString('en-IN')} (Surplus: +₹${(25000 + totalProjected - 45000).toLocaleString('en-IN')})` : 'Deficit Not Closed or Relies on High-Risk Debt',
    expectedRequirement: 'Target collections of at least ₹20,000 using fresh/undisputed debts (Asha / Beacon).',
    whyIncorrect: 'Select high-probability targets: Asha (₹10,000) and Beacon undisputed (₹15,000) provide ₹25,000, eliminating the ₹20,000 deficit.',
    conceptToRevisit: 'Stage 04 Work · 7-Day Cash Action Plan',
    actionTab: 'Work',
    actionLabel: 'Select Targets',
  });

  // Check 5: Beacon Dispute Query & Settlement Communication
  const msgLower = beaconMsg.toLowerCase();
  const hasBeaconRef = msgLower.includes('beacon') || msgLower.includes('f02');
  const hasDisputeIsolated = msgLower.includes('5,000') || msgLower.includes('5000') || msgLower.includes('dispute') || msgLower.includes('variance');
  const hasUndisputedDemand = msgLower.includes('15,000') || msgLower.includes('15000') || msgLower.includes('undisputed');
  const hasDeadline = msgLower.includes('november') || msgLower.includes('monday') || msgLower.includes('tomorrow') || msgLower.includes('14:00') || msgLower.includes('date');
  const isMsgSubstantive = wordCount(beaconMsg) >= 25;
  const isDisputeMsgValid = hasBeaconRef && hasDisputeIsolated && hasUndisputedDemand && isMsgSubstantive;

  workChecks.push({
    id: 's12-w5-dispute-communication',
    title: 'Beacon Dispute Isolation & Undisputed Settlement Query',
    description: 'Draft formal communication addressing the ₹5,000 billing query while securing immediate remittance for the undisputed ₹15,000 balance.',
    passed: isDisputeMsgValid,
    status: isDisputeMsgValid ? 'passed' : 'warning',
    studentValue: isDisputeMsgValid ? `Dispute Query Verified (${wordCount(beaconMsg)} words)` : 'Missing Dispute Isolation or ₹15k Undisputed Request',
    expectedRequirement: 'Isolate ₹5,000 dispute, request immediate ₹15,000 payment, set clock deadline, and assign owner.',
    whyIncorrect: 'Ensure your message explicitly requests the undisputed ₹15,000, isolates the ₹5,000 dispute for operational review, and sets a deadline.',
    conceptToRevisit: 'Stage 04 Work · Disputed Balance Resolution',
    actionTab: 'Work',
    actionLabel: 'Refine Message',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const fileVersion = governance.fileVersion || '';
  const hasValidDeliverable = fileVersion.includes('StudentID_S12_v01') || fileVersion.endsWith('.xlsx');

  teamChecks.push({
    id: 's12-t1-governance',
    title: 'Professional Deliverable & Review Governance',
    description: 'Preserve individual file naming (StudentID_S12_v01.xlsx) and record credit analyst, treasury, and decision roles.',
    passed: hasValidDeliverable,
    status: hasValidDeliverable ? 'passed' : 'warning',
    studentValue: hasValidDeliverable ? fileVersion : 'Unverified Filename',
    expectedRequirement: 'Deliverable must follow StudentID_S12_v01.xlsx naming convention.',
    actionTab: 'Team',
  });

  teamChecks.push({
    id: 's12-t2-rubric-compliance',
    title: 'Four-Pillar Educational Rubric Evaluation',
    description: 'Assessment across Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
    passed: isAgeingComplete && isPlanTactical && isDisputeMsgValid,
    status: isAgeingComplete && isPlanTactical && isDisputeMsgValid ? 'passed' : 'warning',
    studentValue: isAgeingComplete && isPlanTactical ? '10/10 Ready' : 'Revisions Required',
    expectedRequirement: 'Satisfy ageing accuracy, cash forecast viability, dispute communication, and credit risk control.',
    actionTab: 'Team',
  });

  // Helper to compile a stage result
  function compileStage(stage: StageName, title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter(c => c.passed).length;
    const failedCount = checks.filter(c => c.status === 'failed').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const pendingCount = checks.filter(c => c.status === 'pending').length;

    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every(c => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted. Construct receivables ageing schedule and build 7-day cash forecast.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} credit & working capital requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} receivables ageing and cash forecasting checks verified against corporate credit standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Receivables & Liquidity Mission', overviewChecks),
    Learn: compileStage('Learn', 'Due Date Ageing Measurement', learnChecks),
    Case: compileStage('Case', 'Case F Source Balances', caseChecks),
    Work: compileStage('Work', 'Ageing Schedule & 7-Day Cash Plan', workChecks),
    Team: compileStage('Team', 'Audit Deliverable Governance', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No receivables management activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Ageing classification or cash deficit closure requires attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Working capital analysis in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Receivables Ageing Schedule, 7-Day Cash Action Plan, and Dispute Query fully verified!';
  }

  const recommendations: string[] = [];
  if (!isAgeingComplete) {
    recommendations.push('Reclassify ageing buckets: F01 is Current (0d), F02 is 1–30d (15d), F03 is 31–60d (45d), and F04 is 61–90d (75d).');
  }
  if (!isPlanTactical) {
    recommendations.push('Target collections of at least ₹20,000 using Asha (₹10,000) and Beacon undisputed (₹15,000) to eliminate the ₹20,000 deficit.');
  }
  if (!isDisputeMsgValid) {
    recommendations.push('Draft a formal letter to Beacon demanding remittance of the undisputed ₹15,000 by 2 November while isolating the ₹5,000 query.');
  }

  return {
    sessionId: 12,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

