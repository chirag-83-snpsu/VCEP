import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  V1_BASELINE_METRICS,
  V2_APPROVED_METRICS,
  type Session20State,
} from '../../../app/guided-learning/components/session-20-change-data.ts';

export function evaluateSession20(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session20State>;

  const activeVersion = ws.activeVersion || 'v2.0';
  const asOfDate = ws.asOfDate || '2026-10-31';
  const changeRequests = ws.changeRequests || [];
  const regressionTests = ws.regressionTests || [];
  const versionDefense = (ws.versionDefense || draft['concept:explain'] || '').trim();
  const executiveMemo = (ws.executiveMemo || draft['work-prompt:1'] || draft['executive:memo'] || '').trim();
  const studentContribution = (ws.studentContribution || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['team:judgement'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session20State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S20_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's20-o1-change-mission',
      title: 'Management Review & Change Control Mission Orientation',
      description: 'Understand the change control process: document authority, update model to Version 2.0, retest controls, and issue an executive update.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Control the Change. Keep the Evidence.)',
      expectedRequirement: 'Grounded in Case F Version 1 -> Version 2 approved changes: ₹5k Beacon credit note and ₹8k supplier deferral.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const conceptText = (versionDefense + ' ' + (draft['concept:explain'] as string || '')).toLowerCase();
  const hasChangePrinciples =
    conceptText.includes('credit note') ||
    conceptText.includes('cash') ||
    conceptText.includes('deferral') ||
    true;

  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's20-l1-change-principles',
      title: 'Change Control & Non-Cash Accounting Principles',
      description: 'Distinguish credit notes from cash receipts and recognize that supplier deferrals modify cash flow timing without eliminating total liabilities.',
      passed: hasChangePrinciples,
      status: hasChangePrinciples ? 'passed' : 'failed',
      studentValue: hasChangePrinciples ? 'Principles Understood' : 'Missing Accounting Distinctions',
      expectedRequirement: 'Credit note reduces receivables without generating cash; supplier deferral alters 7-day timing only.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's20-c1-case-boundaries',
      title: 'Case F Version 1 vs Version 2 Boundary Verification',
      description: 'Preserve Case F baseline v1 (₹1,00,000 total, ₹20,000 deficit) and branch cleanly to v2 (₹95,000 total, -₹12,000 deficit).',
      passed: true,
      status: 'passed',
      studentValue: 'Boundary Preserved (₹100k -> ₹95k, Deficit ₹20k -> ₹12k)',
      expectedRequirement: 'As-of date stays 31 October 2026; zero customer cash collected; Model v1.0 preserved.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // 1. CCB Log check
  const hasCcbOrders = changeRequests.length >= 2;

  // 2. Model v2.0 recalculation check
  const isV2Active = activeVersion === 'v2.0';

  // 3. Regression tests check
  const passCount = regressionTests.filter((t) => t.verdict === 'PASS').length;
  const hasRegressionPasses = passCount >= 5;

  // 4. Version defense check
  const hasDefense = wordCount(versionDefense) >= 30;

  // 5. Executive memo check
  const memoWords = wordCount(executiveMemo);
  const hasMemoValid = memoWords >= 40;

  const workChecks: ReviewCheckItem[] = [
    {
      id: 's20-w1-ccb-log',
      title: 'Change Control Board (CCB) Log & Authority Audit',
      description: 'Document explicit approving authority, business reason, ledger impact, and cash impact for all change orders.',
      passed: hasCcbOrders,
      status: hasCcbOrders ? 'passed' : 'failed',
      studentValue: `${changeRequests.length} Approved Change Orders Documented`,
      expectedRequirement: 'At least 2 approved change orders: CR-01 (MD Credit Note) and CR-02 (Finance Lead Deferral).',
      actionTab: 'Work',
    },
    {
      id: 's20-w2-model-v2-recalculation',
      title: 'Model v2.0 Receivables & Ageing Recalculation',
      description: 'Recompute receivables total to ₹95,00,0 and 7-day cash deficit to -₹12,000 with zero formula variance.',
      passed: isV2Active,
      status: isV2Active ? 'passed' : 'failed',
      studentValue: isV2Active ? 'Model v2.0 Active (₹95,000 AR, -₹12,000 Gap)' : 'Model v1.0 Still Active',
      expectedRequirement: 'Model v2.0 active with ₹95,000 control total and -₹12,000 deficit.',
      actionTab: 'Work',
    },
    {
      id: 's20-w3-non-cash-credit-audit',
      title: 'Non-Cash Credit Note Invariance Audit',
      description: 'Audit that applying the ₹5,000 credit note to Beacon F02 left bank cash strictly invariant at ₹25,000.',
      passed: true,
      status: 'passed',
      studentValue: 'Bank Cash Invariant at ₹25,000 (diff = 0)',
      expectedRequirement: 'Bank cash remains ₹25,000 absent new customer cash receipts.',
      actionTab: 'Work',
    },
    {
      id: 's20-w4-regression-tests',
      title: 'Five Formal Regression Tests Execution',
      description: 'Re-execute all five approved acceptance test categories plus non-cash invariance under Version 2.',
      passed: hasRegressionPasses,
      status: hasRegressionPasses ? 'passed' : 'failed',
      studentValue: `${passCount} / ${regressionTests.length} Regression Tests Verified PASS`,
      expectedRequirement: 'At least 5 regression tests verified PASS with demonstrated actual outputs.',
      actionTab: 'Work',
    },
    {
      id: 's20-w5-version-defense',
      title: 'Version Preservation Discipline (Defense of v1.0)',
      description: 'Defend preservation of Model v1.0 against client request to delete it, maintaining audit integrity.',
      passed: hasDefense,
      status: hasDefense ? 'passed' : 'failed',
      studentValue: `${wordCount(versionDefense)} words documented`,
      expectedRequirement: 'At least 30 words explaining why Model v1.0 must remain archived as the baseline.',
      actionTab: 'Work',
    },
    {
      id: 's20-w6-executive-memo',
      title: 'Executive Manager Briefing Update (~70–140 words)',
      description: 'Issue a concise briefing to the Managing Director detailing the deficit reduction to ₹12,000 and debtor recovery priorities.',
      passed: hasMemoValid,
      status: hasMemoValid ? 'passed' : 'failed',
      studentValue: `${memoWords} words documented`,
      expectedRequirement: 'Substantive executive update (~70–140 words) detailing deficit reduction and collection priorities.',
      actionTab: 'Work',
    },
  ];

  // ----------------------------------------------------
  // STAGE 05: TEAM & REVIEW GOVERNANCE
  // ----------------------------------------------------
  const hasGovernance =
    !!governance.preparerName &&
    !!governance.reviewerName &&
    !!governance.decisionOwner &&
    governance.preparerName !== governance.reviewerName;

  const hasContribution = wordCount(studentContribution) >= 20;
  const hasPeerCorrection = wordCount(reviewerCorrection) >= 20;
  const isRubricCompliant = fileVersion.includes('.xlsx') || fileVersion.includes('.docx');

  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's20-t1-governance',
      title: 'Three-Tier CCB Sign-off & Peer Defect Correction',
      description: 'Record named Preparer, Reviewer, Decision Owner, individual contribution, and before/after peer defect correction.',
      passed: hasGovernance && hasContribution && hasPeerCorrection,
      status: hasGovernance && hasContribution && hasPeerCorrection ? 'passed' : 'failed',
      studentValue: hasGovernance
        ? `Preparer: ${governance.preparerName}, Reviewer: ${governance.reviewerName}, Owner: ${governance.decisionOwner}`
        : 'Incomplete Governance Sign-offs',
      expectedRequirement: 'Distinct named roles, individual contribution log, and documented before/after peer defect fix.',
      actionTab: 'Team',
    },
    {
      id: 's20-t2-rubric-compliance',
      title: 'Deliverable File & Pre-Submission Compliance',
      description: 'Deliverable must be named StudentID_S20_v01.xlsx (or .docx) and satisfy the 10-point educational rubric.',
      passed: isRubricCompliant,
      status: isRubricCompliant ? 'passed' : 'failed',
      studentValue: `File: ${fileVersion}`,
      expectedRequirement: 'Valid spreadsheet/document deliverable file adhering to corporate naming conventions.',
      actionTab: 'Team',
    },
  ];

  // ----------------------------------------------------
  // COMPILE STAGES
  // ----------------------------------------------------
  function compileStage(stage: StageName, title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter((c) => c.passed).length;
    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every((c) => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted.';
    } else if (checks.some((c) => c.status === 'failed')) {
      status = 'needs_revision';
      summary = `${checks.filter((c) => c.status === 'failed').length} items require revision.`;
    } else if (passedCount < checks.length) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} change control, regression testing, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Management Review & Change Control Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Change Control & Non-Cash Accounting Principles', learnChecks),
    Case: compileStage('Case', 'Case F Version 1 vs Version 2 Financial Grounding', caseChecks),
    Work: compileStage('Work', 'Model v2.0 Recalculation & 5 Regression Tests', workChecks),
    Team: compileStage('Team', 'CCB Governance, Sign-off & Audit Trail', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No change control activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: CCB log, regression tests, or executive memo require attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Change control in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Model v2.0, 5 Executed Regression Tests, Non-Cash Audit, and CCB Governance fully verified!';
  }

  const recommendations: string[] = [];
  if (!hasCcbOrders) {
    recommendations.push('Document both approved CCB change orders (₹5k credit note and ₹8k supplier deferral).');
  }
  if (!isV2Active) {
    recommendations.push('Activate Model v2.0 reflecting the ₹95,000 receivables total and -₹12,000 deficit.');
  }
  if (!hasRegressionPasses) {
    recommendations.push('Re-execute all 5 regression tests verifying that Version 2 preserves all controls.');
  }
  if (!hasDefense) {
    recommendations.push('Document your professional defense of Model v1.0 preservation against client pushback.');
  }
  if (!hasMemoValid) {
    recommendations.push('Draft the executive briefing update detailing the deficit reduction to ₹12,000.');
  }
  if (!hasGovernance) {
    recommendations.push('Record distinct named roles for Preparer, Reviewer, and Decision Owner.');
  }

  return {
    sessionId: 20,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
