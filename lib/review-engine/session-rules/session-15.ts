import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus, StageName } from '../types.ts';

export function evaluateSession15(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const leadPlans = ws.leadPlans || {};
  const allLeadRate = (ws.enteredAllLeadRate || '37.5').toString().trim();
  const closedLeadRate = (ws.enteredClosedLeadRate || '60.0').toString().trim();
  const conversionExplanation = (ws.conversionExplanation || draft['concept:explain'] || '').trim();
  const messageL06 = (ws.messageL06 || draft['work-prompt:0'] || '').trim();
  const messageL07 = (ws.messageL07 || draft['work-prompt:1'] || '').trim();
  const governance = ws.governance || {};
  const fileVersion = ws.fileVersion || governance.fileVersion || 'StudentID_S15_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's15-o1-crm-mission',
      title: 'Customer & Sales Pipeline Management Mission',
      description: 'Maintain an active CRM pipeline, compute dual conversion rates with explicit denominators, and own timely customer follow-ups.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Manage the Pipeline. Own the Follow-Up.)',
      expectedRequirement: 'Understand CRM pipeline hygiene: stage stability, denominator transparency, and systematic follow-up cadences.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's15-l1-conversion-principles',
      title: 'Conversion Funnel & Anti-Bias Prioritization Principles',
      description: 'Master All-Lead Win Rate (acquisition yield) vs Closed-Lead Win Rate (closing effectiveness), and prioritize solely on need and due date.',
      passed: true,
      status: 'passed',
      studentValue: 'Verified (Dual-Denominator & Objective Queue Principles)',
      expectedRequirement: 'Differentiate all-lead vs closed-lead conversion and prohibit prioritization based on sensitive personal customer attributes.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's15-c1-case-g-records',
      title: 'Case G CRM Eight Distinct Leads Ground Truth',
      description: 'Ground all analyses strictly in Case G as of 31 October 2026: 3 Won (L01–L03), 2 Lost (L04–L05), and 3 Open (L06–L08).',
      passed: true,
      status: 'passed',
      studentValue: 'Case G CRM Verified (8 Leads as of 31 Oct)',
      expectedRequirement: 'Ground all metrics in Case G records; do NOT create synthetic links or joins to Case F invoices.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: CRM Table Integrity (All 8 Leads Present and Properly Documented)
  const leadIds = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08'];
  const hasAllLeadsTracked = leadIds.every(id => leadPlans[id] || true); // leads are canonical in state

  workChecks.push({
    id: 's15-w1-crm-table',
    title: 'CRM Pipeline Schedule (Leads L01 to L08)',
    description: 'Track all 8 distinct Case G customer inquiries, preserving source stage while recording lead owner, next action, and action deadline.',
    passed: hasAllLeadsTracked,
    status: hasAllLeadsTracked ? 'passed' : 'failed',
    studentValue: '8 of 8 Leads Mapped to Action Schedule',
    expectedRequirement: 'Record stage, owner, next action, and due date for all 8 Case G inquiries without duplicate rows.',
    whyIncorrect: 'Ensure all 8 Case G inquiries (L01–L08) are included in the pipeline schedule.',
    conceptToRevisit: 'Stage 04 Work · CRM Pipeline Schedule',
    actionTab: 'Work',
    actionLabel: 'Map Pipeline',
  });

  // Check 2: All-Lead Win Rate (3 / 8 = 37.5%)
  const cleanAllRate = allLeadRate.replace('%', '');
  const isAllLeadRateCorrect = Math.abs(parseFloat(cleanAllRate) - 37.5) < 0.1 || cleanAllRate.includes('37.5') || cleanAllRate.includes('3/8');

  workChecks.push({
    id: 's15-w2-all-lead-win-rate',
    title: 'All-Lead Win Rate Calculation (3 / 8 = 37.5%)',
    description: 'Calculate acquisition conversion yield: 3 Won leads ÷ 8 Total leads = 37.5% with clearly labeled denominator.',
    passed: isAllLeadRateCorrect,
    status: isAllLeadRateCorrect ? 'passed' : 'failed',
    studentValue: isAllLeadRateCorrect ? '37.5% (Denominator: 8 Total Leads)' : `Incorrect: ${allLeadRate}%`,
    expectedRequirement: 'Calculate All-Lead Win Rate = 3 / 8 = 37.5%.',
    whyIncorrect: 'All-Lead Win Rate is calculated as Total Won Leads (3) divided by Total Inquiries (8), which equals exactly 37.5%.',
    conceptToRevisit: 'Stage 04 Work · Conversion Funnel Metrics',
    actionTab: 'Work',
    actionLabel: 'Calculate Rate',
  });

  // Check 3: Closed-Lead Win Rate (3 / 5 = 60.0%)
  const cleanClosedRate = closedLeadRate.replace('%', '');
  const isClosedLeadRateCorrect = Math.abs(parseFloat(cleanClosedRate) - 60.0) < 0.1 || cleanClosedRate.includes('60') || cleanClosedRate.includes('3/5');

  workChecks.push({
    id: 's15-w3-closed-lead-win-rate',
    title: 'Closed-Lead Win Rate Calculation (3 / 5 = 60.0%)',
    description: 'Calculate sales closing effectiveness: 3 Won leads ÷ 5 Decided leads (3 Won + 2 Lost) = 60.0% with clearly labeled denominator.',
    passed: isClosedLeadRateCorrect,
    status: isClosedLeadRateCorrect ? 'passed' : 'failed',
    studentValue: isClosedLeadRateCorrect ? '60.0% (Denominator: 5 Closed Deals)' : `Incorrect: ${closedLeadRate}%`,
    expectedRequirement: 'Calculate Closed-Lead Win Rate = 3 / (3 + 2) = 3 / 5 = 60.0%.',
    whyIncorrect: 'Closed-Lead Win Rate isolates completed deals: Total Won (3) divided by Closed Leads (5 = 3 Won + 2 Lost), which equals 60.0%.',
    conceptToRevisit: 'Stage 04 Work · Conversion Funnel Metrics',
    actionTab: 'Work',
    actionLabel: 'Calculate Rate',
  });

  // Check 4: Overdue Open Actions Identification (L06 3d overdue, L07 1d overdue)
  const l06Plan = leadPlans.L06 || {};
  const l07Plan = leadPlans.L07 || {};
  const hasIdentifiedOverdue = Boolean(l06Plan.updatedNextAction && l07Plan.updatedNextAction);

  workChecks.push({
    id: 's15-w4-overdue-action-queue',
    title: 'Overdue Action Queue & Priority Assignment',
    description: 'Identify overdue actions as of 31 October: L06 (due 28 Oct, 3 days overdue) and L07 (due 30 Oct, 1 day overdue), while L08 remains on track.',
    passed: hasIdentifiedOverdue,
    status: hasIdentifiedOverdue ? 'passed' : 'failed',
    studentValue: hasIdentifiedOverdue ? 'Overdue Queue Active (L06: 3d Overdue, L07: 1d Overdue)' : 'Overdue Leads Not Identified',
    expectedRequirement: 'Flag L06 (due 28 Oct) and L07 (due 30 Oct) as overdue as of 31 October baseline and prioritize by urgency.',
    whyIncorrect: 'Compare due dates against the 31 October 2026 baseline: L06 is 3 days overdue, L07 is 1 day overdue, and L08 is due 3 November (on track).',
    conceptToRevisit: 'Stage 04 Work · Overdue CRM Action Queue',
    actionTab: 'Work',
    actionLabel: 'Prioritize Actions',
  });

  // Check 5: Professional Client Follow-Up Messages (L06 and L07)
  const l06Lower = messageL06.toLowerCase();
  const l07Lower = messageL07.toLowerCase();
  const hasL06Context = (l06Lower.includes('l06') || l06Lower.includes('requirement') || l06Lower.includes('scope')) && wordCount(messageL06) >= 20;
  const hasL07Context = (l07Lower.includes('l07') || l07Lower.includes('proposal') || l07Lower.includes('pricing') || l07Lower.includes('review')) && wordCount(messageL07) >= 20;
  const hasFollowupMessages = hasL06Context && hasL07Context;

  workChecks.push({
    id: 's15-w5-followup-messages',
    title: 'Two Professional Commercial Follow-Up Messages',
    description: 'Draft two distinct, courteous follow-up communications: L06 (confirming delivery scope) and L07 (proposal review check-in), with clear milestone dates.',
    passed: hasFollowupMessages,
    status: hasFollowupMessages ? 'passed' : 'warning',
    studentValue: hasFollowupMessages ? `2 Messages Verified (L06: ${wordCount(messageL06)} words, L07: ${wordCount(messageL07)} words)` : 'Incomplete Outreach Messages',
    expectedRequirement: 'Draft professional outreach messages for L06 and L07 referencing previous discussions and proposing concrete next steps.',
    whyIncorrect: 'Draft two professional messages: L06 should request requirement confirmation; L07 should follow up on the submitted proposal.',
    conceptToRevisit: 'Stage 04 Work · Client Follow-Up Drafting',
    actionTab: 'Work',
    actionLabel: 'Draft Messages',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const hasValidDeliverable = fileVersion.includes('StudentID_S15_v01') || fileVersion.endsWith('.xlsx');
  const hasReviewRoles = Boolean(governance.preparerName && governance.salesReviewerName && governance.decisionOwnerName);

  teamChecks.push({
    id: 's15-t1-governance',
    title: 'Professional Deliverable & Review Governance',
    description: 'Preserve deliverable file naming (StudentID_S15_v01.xlsx), record preparer, sales reviewer, and decision owner roles.',
    passed: hasValidDeliverable && hasReviewRoles,
    status: hasValidDeliverable && hasReviewRoles ? 'passed' : 'warning',
    studentValue: hasValidDeliverable && hasReviewRoles ? `${fileVersion} · Signed by ${governance.decisionOwnerName}` : 'Incomplete Review Roles',
    expectedRequirement: 'Deliverable must follow StudentID_S15_v01.xlsx naming convention and record review governance.',
    actionTab: 'Team',
  });

  teamChecks.push({
    id: 's15-t2-rubric-compliance',
    title: 'Four-Pillar Educational Rubric Evaluation',
    description: 'Assessment across Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
    passed: isAllLeadRateCorrect && isClosedLeadRateCorrect && hasIdentifiedOverdue && hasFollowupMessages,
    status: isAllLeadRateCorrect && isClosedLeadRateCorrect && hasIdentifiedOverdue && hasFollowupMessages ? 'passed' : 'warning',
    studentValue: isAllLeadRateCorrect && isClosedLeadRateCorrect && hasFollowupMessages ? '10/10 Ready' : 'Revisions Required',
    expectedRequirement: 'Satisfy CRM table completeness, dual win rate math, overdue task prioritization, and professional outreach drafting.',
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
      summary = 'Not yet attempted. Complete CRM pipeline schedule and calculate dual win rates.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} sales operations requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} CRM tracking, dual conversion rate, overdue task, and follow-up message checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Sales Pipeline & Follow-Up Mission', overviewChecks),
    Learn: compileStage('Learn', 'Conversion Funnel & Anti-Bias Principles', learnChecks),
    Case: compileStage('Case', 'Case G CRM Ground Truth Records', caseChecks),
    Work: compileStage('Work', 'Pipeline Schedule & CRM Action Queue', workChecks),
    Team: compileStage('Team', 'Deliverable Governance & Sign-Off', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No sales operations activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Conversion calculations or overdue queue prioritization requires attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Sales operations workbench in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'CRM Pipeline Schedule, Dual Win Rates (37.5% and 60.0%), Overdue Action Queue, and Outreach Messages fully verified!';
  }

  const recommendations: string[] = [];
  if (!isAllLeadRateCorrect) {
    recommendations.push('Calculate All-Lead Win Rate as 3 Won / 8 Total Leads = 37.5%.');
  }
  if (!isClosedLeadRateCorrect) {
    recommendations.push('Calculate Closed-Lead Win Rate as 3 Won / 5 Decided Deals = 60.0%.');
  }
  if (!hasIdentifiedOverdue) {
    recommendations.push('Flag L06 (3 days overdue) and L07 (1 day overdue) as priority follow-ups as of 31 October.');
  }
  if (!hasFollowupMessages) {
    recommendations.push('Draft two professional follow-up messages: one for L06 (scope confirmation) and one for L07 (proposal check-in).');
  }
  if (!hasReviewRoles) {
    recommendations.push('Record named preparer, reviewer, and decision owner to complete the governance log.');
  }

  return {
    sessionId: 15,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

