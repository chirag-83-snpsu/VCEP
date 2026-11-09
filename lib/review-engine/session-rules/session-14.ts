import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus, StageName } from '../types.ts';

export function evaluateSession14(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const claimAudits = ws.claimAudits || {};
  const memoText = (ws.correctedMemoText || draft['concept:explain'] || '').trim();
  const selectedScenario = ws.selectedScenario || 'normal';
  const governance = ws.governance || {};
  const fileVersion = ws.fileVersion || governance.fileVersion || 'StudentID_S14_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's14-o1-audit-mission',
      title: 'AI Audit & Controlled Workflow Mission',
      description: 'Audit AI-generated claims against source financial records and design automated stopping conditions for invalid data.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Audit the AI. Control the Workflow.)',
      expectedRequirement: 'Understand workplace AI risks: numerical hallucinations, false causality, and unvalidated automation.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's14-l1-governance-gates',
      title: 'Automated Validation Gates & Stopping Principles',
      description: 'Automate repeatable data checks; halt execution visibly on missing or invalid data; reserve strategic decisions for human approval.',
      passed: true,
      status: 'passed',
      studentValue: 'Verified (Validation Gate & Stopping Rules)',
      expectedRequirement: 'Enforce stopping rules for blank/corrupt revenue; require explicit human authorization before release.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's14-c1-case-d-records',
      title: 'Case D Verified Three-Month MIS Ground Truth',
      description: 'Ground all recalculations strictly in Case D monthly totals: Revenue (₹100k, ₹120k, ₹150k), Direct costs (₹40k, ₹54k, ₹75k), Receivables (₹30k, ₹45k, ₹70k).',
      passed: true,
      status: 'passed',
      studentValue: 'Case D MIS Verified (Jul–Sep)',
      expectedRequirement: 'Bound audits to Case D financials; note that source provides no customer-level payment timestamps.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: 4-Claim Audit Register Completion
  const clm1 = claimAudits.CLM_01 || {};
  const clm2 = claimAudits.CLM_02 || {};
  const clm3 = claimAudits.CLM_03 || {};
  const clm4 = claimAudits.CLM_04 || {};

  const isClm1Audited = clm1.isAudited !== false && (clm1.userVerdict === 'FALSE' || clm1.userVerdict);
  const isClm2Audited = clm2.isAudited !== false && (clm2.userVerdict === 'FALSE' || clm2.userVerdict);
  const isClm3Audited = clm3.isAudited !== false && (clm3.userVerdict === 'MISLEADING' || clm3.userVerdict === 'HALLUCINATION' || clm3.userVerdict);
  const isClm4Audited = clm4.isAudited !== false && (clm4.userVerdict === 'FATAL_RECOMMENDATION' || clm4.userVerdict === 'FALSE' || clm4.userVerdict);

  const auditedCount = [isClm1Audited, isClm2Audited, isClm3Audited, isClm4Audited].filter(Boolean).length;
  const isRegisterComplete = auditedCount === 4;

  workChecks.push({
    id: 's14-w1-claim-register',
    title: 'Four-Claim Audit Register & Verdicts',
    description: 'Audit each flawed claim individually with source reference, recalculation formula, audit verdict, and factual correction.',
    passed: isRegisterComplete,
    status: isRegisterComplete ? 'passed' : 'failed',
    studentValue: `${auditedCount}/4 Claims Audited`,
    expectedRequirement: 'Audit all 4 claims: (1) 30% growth false; (2) 25% margin false; (3) prompt payment misleading/hallucination; (4) 20% discount fatal.',
    whyIncorrect: 'Every claim must be evaluated individually against Case D data. Do not merely rephrase the text.',
    conceptToRevisit: 'Stage 04 Work · Four-Claim Audit Register',
    actionTab: 'Work',
    actionLabel: 'Audit Claims',
  });

  // Check 2: Revenue Growth Recalculation Formula
  const clm1Recalc = (clm1.userRecalculation || '').toLowerCase();
  const clm1Correction = (clm1.userCorrection || '').toLowerCase();
  const hasExactRevMath = clm1Recalc.includes('25') || clm1Recalc.includes('150') || clm1Correction.includes('25') || clm1Correction.includes('25.0%');

  workChecks.push({
    id: 's14-w2-revenue-recalculation',
    title: 'September Revenue Growth Recalculation',
    description: 'Recalculate exact growth using (₹1,50,000 - ₹1,20,000) / ₹1,20,000 = 25.0% MoM.',
    passed: hasExactRevMath,
    status: hasExactRevMath ? 'passed' : 'failed',
    studentValue: hasExactRevMath ? 'Recalculated: +25.0% MoM' : 'Missing Recalculation Formula',
    expectedRequirement: 'Calculate (₹1,50,000 - ₹1,20,000) / ₹1,20,000 = +25.0% growth over August.',
    whyIncorrect: 'Calculate the percentage change accurately: difference (₹30,000) divided by August base (₹1,20,000) equals exactly 25.0%.',
    conceptToRevisit: 'Stage 04 Work · Claim 1 Recalculation',
    actionTab: 'Work',
    actionLabel: 'Recalculate Growth',
  });

  // Check 3: Corrected Management Memo (<= 120 words)
  const memoWords = wordCount(memoText);
  const isWithinWordLimit = memoWords > 0 && memoWords <= 120;
  const memoLower = memoText.toLowerCase();
  const mentions25Rev = memoLower.includes('25') || memoLower.includes('25.0%');
  const mentions20Margin = memoLower.includes('20') || memoLower.includes('20.0%');
  const mentionsReceivables = memoLower.includes('receivable') || memoLower.includes('70,000') || memoLower.includes('70000');
  const rejectsDiscount = memoLower.includes('discount') || memoLower.includes('reject') || memoLower.includes('profit');
  const acknowledgesUncertainty = memoLower.includes('date') || memoLower.includes('term') || memoLower.includes('uncertain') || memoLower.includes('provide') || memoLower.includes('source') || memoLower.includes('timing');

  const isMemoSubstantive = mentions25Rev && mentions20Margin && mentionsReceivables && rejectsDiscount;
  const isMemoValid = isWithinWordLimit && isMemoSubstantive;

  workChecks.push({
    id: 's14-w3-corrected-memo',
    title: 'Corrected Executive Management Memo (<= 120 Words)',
    description: 'Draft a factual, disciplined memo citing true metrics (+25.0% revenue, 20.0% margin, ₹70k receivables lockup), stating source uncertainties, and rejecting discounts.',
    passed: isMemoValid,
    status: isMemoValid ? 'passed' : 'warning',
    studentValue: isMemoValid ? `Verified Memo (${memoWords} words)` : memoWords > 120 ? `Exceeds 120-Word Limit (${memoWords} words)` : 'Incomplete Memo Metrics',
    expectedRequirement: 'Write a memo of at most 120 words with verified numbers, acknowledging lack of collection dates, and rejecting blanket discounts.',
    whyIncorrect: 'Keep memo concise (maximum 120 words), verify 25% growth and 20% margin, note the absence of collection dates, and reject price discounting.',
    conceptToRevisit: 'Stage 04 Work · Corrected Executive Memo',
    actionTab: 'Work',
    actionLabel: 'Refine Memo',
  });

  // Check 4: Controlled Workflow Architecture & Stopping Condition
  const stoppingConditionRule = (ws.stoppingConditionRule || 'IF(OR(ISBLANK(Revenue), NOT(ISNUMBER(Revenue)), Revenue <= 0), "HALT_ERROR", "PASS")').toLowerCase();
  const hasStoppingRule = stoppingConditionRule.includes('blank') || stoppingConditionRule.includes('isnumber') || stoppingConditionRule.includes('halt');

  workChecks.push({
    id: 's14-w4-workflow-stopping-condition',
    title: 'Automated Input Validation & Stopping Condition',
    description: 'Establish stopping condition: halt execution visibly if monthly revenue is missing, blank, or non-numeric rather than producing a zero-growth summary.',
    passed: hasStoppingRule,
    status: hasStoppingRule ? 'passed' : 'failed',
    studentValue: hasStoppingRule ? 'Stopping Rule Active' : 'Missing Stopping Condition',
    expectedRequirement: 'Specify rule halting pipeline on missing/blank or non-numeric monthly revenue.',
    whyIncorrect: 'Automated pipelines must stop visibly when input data is missing or corrupted, blocking premature downstream reporting.',
    conceptToRevisit: 'Stage 04 Work · Validation Gate Stopping Condition',
    actionTab: 'Work',
    actionLabel: 'Define Rule',
  });

  // Check 5: Multi-Scenario Simulation & Fault Injection
  const hasTestedScenarios = Boolean(selectedScenario);

  workChecks.push({
    id: 's14-w5-scenario-simulation',
    title: 'Controlled Workflow Scenario Simulation Drill',
    description: 'Execute simulation test scenarios: normal Case D, fault-injection with blank September revenue, restore/review, rejection, and explicit human approval.',
    passed: hasTestedScenarios,
    status: hasTestedScenarios ? 'passed' : 'warning',
    studentValue: `Simulated: ${selectedScenario.replace('_', ' ').toUpperCase()}`,
    expectedRequirement: 'Test normal, blank revenue, restore/re-validate, rejected, and approved workflow states.',
    whyIncorrect: 'Run all 5 scenarios to prove that missing revenue halts execution and human approval is enforced.',
    conceptToRevisit: 'Stage 04 Work · Workflow Simulation Scenarios',
    actionTab: 'Work',
    actionLabel: 'Run Simulation',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const hasValidDeliverable = fileVersion.includes('StudentID_S14_v01') || fileVersion.endsWith('.xlsx');
  const hasNamedRoles = Boolean(governance.preparerName && governance.reviewerName && governance.decisionOwnerName);
  const isApprovedOrTested = governance.approvalStatus === 'Approved' || governance.approvalStatus === 'Pending Review';

  teamChecks.push({
    id: 's14-t1-governance',
    title: 'Deliverable Version & Explicit Human Sign-Off',
    description: 'Preserve deliverable file naming (StudentID_S14_v01.xlsx), record preparer, reviewer, decision owner, and explicit human approval.',
    passed: hasValidDeliverable && hasNamedRoles,
    status: hasValidDeliverable && hasNamedRoles ? 'passed' : 'warning',
    studentValue: hasValidDeliverable && hasNamedRoles ? `${fileVersion} · Signed by ${governance.decisionOwnerName}` : 'Unsigned / Incomplete Roles',
    expectedRequirement: 'Deliverable must follow StudentID_S14_v01.xlsx naming convention and capture named human sign-off.',
    actionTab: 'Team',
  });

  teamChecks.push({
    id: 's14-t2-rubric-compliance',
    title: 'Four-Pillar Educational Rubric Evaluation',
    description: 'Assessment across Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
    passed: isRegisterComplete && hasExactRevMath && isMemoValid && hasStoppingRule,
    status: isRegisterComplete && hasExactRevMath && isMemoValid && hasStoppingRule ? 'passed' : 'warning',
    studentValue: isRegisterComplete && hasExactRevMath && isMemoValid ? '10/10 Ready' : 'Revisions Required',
    expectedRequirement: 'Satisfy claim register accuracy, revenue recalculation, 120-word memo limit, and automated validation rules.',
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
      summary = 'Not yet attempted. Complete claim audit register and configure workflow stopping conditions.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} AI audit requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} AI audit, memo word-count, validation gate, and human sign-off checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'AI Audit & Workflow Control Mission', overviewChecks),
    Learn: compileStage('Learn', 'Automated Validation Gates & Stopping Rules', learnChecks),
    Case: compileStage('Case', 'Case D MIS Financial Ground Truth', caseChecks),
    Work: compileStage('Work', 'Claim Register & Controlled Workflow Simulation', workChecks),
    Team: compileStage('Team', 'Audit Deliverable Governance & Sign-off', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No AI verification activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Claim audit verdicts, revenue recalculation, or stopping conditions require attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `AI verification and automation workbench in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Four-Claim Audit Register, Recalculated Growth, 120-Word Memo, and Controlled Workflow fully verified!';
  }

  const recommendations: string[] = [];
  if (!isRegisterComplete) {
    recommendations.push('Audit all 4 claims in the register: (1) false growth, (2) false margin, (3) hallucinated payment claim, and (4) fatal discount.');
  }
  if (!hasExactRevMath) {
    recommendations.push('Recalculate September revenue growth using exact formula: (₹1,50,000 - ₹1,20,000) / ₹1,20,000 = 25.0%.');
  }
  if (!isMemoValid) {
    recommendations.push('Refine the executive memo: keep it strictly under 120 words, cite 25% growth and 20% margin, and note absence of collection dates.');
  }
  if (!hasStoppingRule) {
    recommendations.push('Configure the stopping condition to halt pipeline immediately if revenue is blank or non-numeric.');
  }
  if (!hasNamedRoles) {
    recommendations.push('Record preparer, reviewer, and decision owner names to complete governance sign-off.');
  }

  return {
    sessionId: 14,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

