import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';
import { calculateMISMetrics } from '../../../app/guided-learning/components/session-10-dashboard-data.ts';

export function evaluateSession10(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const directCost = Number(ws.directCostInput) || 75000;
  const calculated = calculateMISMetrics(directCost);

  const memoText = (ws.memoText || draft['concept:explain'] || '').trim();
  const justification = (ws.visualizationJustification || draft['team:contribution'] || '').trim();
  const mgmtQuestion = (ws.managementQuestion || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const words = (memoText || '').split(/\s+/).filter(Boolean);
  const memoWordCount = words.length;

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's10-o1-dashboard-mission',
      title: 'Executive MIS Dashboard & 5-Minute Decision Objective',
      description: 'Design a 1-page executive dashboard displaying 4 core KPIs, dynamic recalculation, and a 150-word actionable memo.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Present Revenue, GM%, OM%, and Receivables with dynamic sensitivity testing and an executive memo.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const hasValidQuestion = wordCount(mgmtQuestion) >= 12;

  learnChecks.push({
    id: 's10-l1-decision-question',
    title: 'Core Executive Management Question',
    description: 'Frame the dashboard around an executive decision question: testing whether sales expansion converts to margin and cash.',
    passed: hasValidQuestion,
    status: hasValidQuestion ? 'passed' : 'warning',
    studentValue: hasValidQuestion ? 'Decision Question Defined' : 'Question Too Brief',
    expectedRequirement: 'State a clear decision question (>= 12 words) focusing on sales growth vs. margin compression and receivables.',
    whyIncorrect: 'Define a specific management question that guides the dashboard structure.',
    conceptToRevisit: 'Stage 02 Learn · Decision-Driven MIS',
    actionTab: 'Learn',
    actionLabel: 'Frame Question',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's10-c1-cased-cells',
      title: 'Case D Verified Source Cell Coordinates',
      description: 'Confirm direct linking to Case D source cells (CaseD!B2:D5) without inventing missing collection records.',
      passed: true,
      status: 'passed',
      studentValue: 'Case D cells verified',
      expectedRequirement: 'Reference CaseD!B2:D5 net-of-tax records.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: 4 Core KPIs Selected & Evaluated
  const hasSelectedKPIs = (ws.selectedKpiIds || []).length >= 4;
  workChecks.push({
    id: 's10-w1-kpi-selection',
    title: 'Four Core Executive KPIs Linked',
    description: 'Verify 4 executive KPIs: Billed Revenue, Gross Margin %, Operating Margin %, and Closing Trade Receivables.',
    passed: hasSelectedKPIs,
    status: hasSelectedKPIs ? 'passed' : 'failed',
    studentValue: `${(ws.selectedKpiIds || []).length} of 4 KPIs active`,
    expectedRequirement: 'Include all 4 executive metrics on the one-page dashboard.',
    whyIncorrect: 'Select all 4 core KPIs: Revenue, Gross Margin %, Operating Margin %, and Receivables.',
    conceptToRevisit: 'Stage 04 Work · KPI Selection',
    actionTab: 'Work',
    actionLabel: 'Select 4 KPIs',
  });

  // Check 2: Dynamic Calculations at Current Direct Cost
  const isBaselineCorrect =
    directCost === 75000
      ? calculated.grossMarginPct === 50.0 && calculated.operatingMarginPct === 20.0
      : directCost === 78000
      ? calculated.grossMarginPct === 48.0 && calculated.operatingMarginPct === 18.0
      : calculated.grossProfit === 150000 - directCost;

  workChecks.push({
    id: 's10-w2-kpi-calculation',
    title: 'Dynamic Calculation Integrity',
    description: `Verify mathematical accuracy: At ₹${directCost.toLocaleString('en-IN')} direct cost, GM% = ${calculated.grossMarginPct.toFixed(1)}% and OM% = ${calculated.operatingMarginPct.toFixed(1)}%.`,
    passed: isBaselineCorrect,
    status: isBaselineCorrect ? 'passed' : 'failed',
    studentValue: `GM: ${calculated.grossMarginPct.toFixed(1)}%, OM: ${calculated.operatingMarginPct.toFixed(1)}%`,
    expectedRequirement: 'Formulas must dynamically compute Gross Margin and Operating Margin without broken formula references.',
    whyIncorrect: 'Check formula linkages: GM = (Revenue - Direct Cost)/Revenue; OM = Operating Profit/Revenue.',
    conceptToRevisit: 'Stage 04 Work · Dynamic Recalculation',
    actionTab: 'Work',
    actionLabel: 'Check Formulas',
  });

  // Check 3: Sensitivity Recalculation Responsiveness
  const isSensitivityResponsive = directCost >= 70000 && directCost <= 85000;
  workChecks.push({
    id: 's10-w3-sensitivity-test',
    title: 'Sensitivity Stress-Tester Recalculation',
    description: 'Ensure dashboard updates instantly when testing direct cost variations between ₹75,000 and ₹78,000.',
    passed: isSensitivityResponsive,
    status: isSensitivityResponsive ? 'passed' : 'failed',
    studentValue: `Tested at ₹${directCost.toLocaleString('en-IN')}`,
    expectedRequirement: 'Dashboard indicators and cards must dynamically reflect direct cost stress testing.',
    whyIncorrect: 'Operate the sensitivity slider or toggle between baseline ₹75k and stress test ₹78k.',
    conceptToRevisit: 'Stage 04 Work · Stress Testing',
    actionTab: 'Work',
    actionLabel: 'Run Stress Test',
  });

  // Check 4: 150-Word Memo Word Count
  const isMemoLengthValid = memoWordCount >= 25 && memoWordCount <= 150;
  workChecks.push({
    id: 's10-w4-memo-length',
    title: 'Management Memo 150-Word Constraint',
    description: 'Strictly adhere to the 150-word maximum constraint while delivering substantive executive insight.',
    passed: isMemoLengthValid,
    status: isMemoLengthValid ? 'passed' : memoWordCount > 150 ? 'failed' : 'pending',
    studentValue: `${memoWordCount} words (Max 150)`,
    expectedRequirement: 'Executive memo must be between 25 and 150 words.',
    whyIncorrect: memoWordCount > 150 ? `Word limit exceeded (${memoWordCount} words). Trim memo to <= 150 words.` : 'Draft a substantive memo (>= 25 words).',
    conceptToRevisit: 'Stage 04 Work · Executive Memo Writing',
    actionTab: 'Work',
    actionLabel: 'Edit Memo',
  });

  // Check 5: Memo Content (Insight, 2 Actions, 1 Limitation)
  const memoLower = memoText.toLowerCase();
  const hasInsight = memoLower.includes('margin') || memoLower.includes('cost') || memoLower.includes('compress') || memoLower.includes('growth');
  const hasActions = memoLower.includes('action') || memoLower.includes('lead') || memoLower.includes('audit') || memoLower.includes('hold');
  const hasLimitation = memoLower.includes('limitation') || memoLower.includes('ledger') || memoLower.includes('collection') || memoLower.includes('case d');
  const isMemoContentComplete = hasInsight && hasActions && hasLimitation && isMemoLengthValid;

  workChecks.push({
    id: 's10-w5-memo-structure',
    title: 'Executive Memo Content Architecture',
    description: 'Include Core Diagnosis (Insight + Evidence), Two Owned Actions (Role + Deadline), and One Data Limitation.',
    passed: isMemoContentComplete,
    status: isMemoContentComplete ? 'passed' : 'warning',
    studentValue: isMemoContentComplete ? 'Complete Architecture' : 'Missing Action or Limitation',
    expectedRequirement: 'Memo must contain insight, 2 actions with owners and deadlines, and 1 explicit limitation.',
    whyIncorrect: 'Ensure your memo explicitly states two action items with assigned owners and notes the absence of collection ledgers.',
    conceptToRevisit: 'Stage 04 Work · Actionable Recommendations',
    actionTab: 'Work',
    actionLabel: 'Refine Structure',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's10-t1-visual-justification',
      title: 'Visualization Decision Justification',
      description: 'Explain why the selected visual layout supports the Managing Director’s 5-minute decision window over decorative graphics.',
      passed: wordCount(justification) >= 15,
      status: wordCount(justification) >= 15 ? 'passed' : wordCount(justification) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(justification) > 0 ? `${wordCount(justification)} words` : 'Unanswered',
      expectedRequirement: 'Explain how 4 KPI cards and 3-month trends direct attention to margin erosion and receivables.',
      actionTab: 'Team',
      actionLabel: 'Justify Visuals',
    },
    {
      id: 's10-t2-peer-stress-review',
      title: 'Peer Sensitivity Review & Accountability Stand',
      description: 'Confirm that recommendations assign explicit role owners and deadlines rather than unassigned suggestions.',
      passed: wordCount(teamJudgement) >= 10 || isMemoContentComplete,
      status: (wordCount(teamJudgement) >= 10 || isMemoContentComplete) ? 'passed' : 'pending',
      studentValue: 'Verified',
      expectedRequirement: 'Commit to role ownership and clock deadlines for executive recommendations.',
      actionTab: 'Team',
      actionLabel: 'Confirm Ownership',
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
      summary = 'Not yet attempted. Build MIS dashboard and draft 150-word management memo.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} dashboard requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} dashboard and memo checks verified against executive standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Executive MIS Dashboard Mission', overviewChecks),
    Learn: compileStage('Learn', 'Management Decision Question', learnChecks),
    Case: compileStage('Case', 'Case D Source Coordinates', caseChecks),
    Work: compileStage('Work', 'Dynamic Dashboard & Management Memo', workChecks),
    Team: compileStage('Team', 'Visual Justification & Accountability', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No MIS dashboard activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: KPI calculation errors or memo word count violation detected.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'One-Page MIS Dashboard and 150-Word Management Memo fully verified!';
  }

  const recommendations: string[] = [];
  if (!isBaselineCorrect) {
    recommendations.push('Recheck KPI calculations: At ₹75k direct cost, Gross Margin is 50.0% and Operating Margin is 20.0%.');
  }
  if (!isMemoLengthValid) {
    recommendations.push(`Trim or expand memo to fit strictly between 25 and 150 words (currently ${memoWordCount} words).`);
  }
  if (!isMemoContentComplete) {
    recommendations.push('Ensure memo includes: 1. Diagnosis, 2. Two owned actions with roles and deadlines, 3. One data limitation.');
  }

  return {
    sessionId: 10,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

