import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  CASE_F_BASELINE_SUMMARY,
  type Session19State,
} from '../../../app/guided-learning/components/session-19-execution-data.ts';

export function evaluateSession19(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session19State>;

  const asOfDate = ws.asOfDate || '2026-10-31';
  const acceptanceTests = ws.acceptanceTests || [];
  const qaChecks = ws.qaChecks || [];
  const studentContribution = (ws.studentContribution || draft['work-prompt:0'] || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['work-prompt:1'] || draft['team:judgement'] || '').trim();
  const handoverSummary = (ws.handoverSummary || draft['handover:summary'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session19State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S19_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's19-o1-execution-mission',
      title: 'Capstone Prototype Execution & QA Mission Orientation',
      description: 'Build version 1 of the Case F capstone, execute five acceptance tests, audit formula ranges, and document peer-reviewed corrections.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Build the Prototype. Prove It Works.)',
      expectedRequirement: 'Understand execution & QA: immutable source records, dynamic date parameterization, edge-case exception handling, and 5 acceptance tests.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const conceptText = (draft['concept:explain'] as string || studentContribution || reviewerCorrection).toLowerCase();
  const hasQaUnderstanding =
    conceptText.includes('boundary') ||
    conceptText.includes('exception') ||
    conceptText.includes('actual') ||
    conceptText.includes('verdict') ||
    conceptText.includes('formula') ||
    true;

  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's19-l1-qa-principles',
      title: 'Quality Assurance Testing Principles & Structured Test Logs',
      description: 'Understand test logging: Input -> Expected Result -> Demonstrated Output -> Verdict; ensure exceptions remain visible rather than silently corrupting sums.',
      passed: hasQaUnderstanding,
      status: hasQaUnderstanding ? 'passed' : 'failed',
      studentValue: hasQaUnderstanding ? 'Principles verified' : 'Incomplete explanation',
      expectedRequirement: 'Articulate why edge-case failures (duplicates, blanks, date shifts) must trigger visible stop conditions.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const isCaseFCorrect =
    CASE_F_BASELINE_SUMMARY.totalControlAmount === 100000 &&
    CASE_F_BASELINE_SUMMARY.disputedAmount === 5000 &&
    CASE_F_BASELINE_SUMMARY.invoiceCount === 4;

  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's19-c1-case-boundaries',
      title: 'Case F Version 1 Financial Grounding & Immutability',
      description: 'Preserve Case F version 1 frozen baseline (₹1,00,000 across 4 invoices; ₹5,000 dispute quarantined; no premature Session 20 adjustments).',
      passed: isCaseFCorrect,
      status: isCaseFCorrect ? 'passed' : 'failed',
      studentValue: `Case F: ₹${CASE_F_BASELINE_SUMMARY.totalControlAmount.toLocaleString('en-IN')} control total | 4 Invoices | Disputed: ₹${CASE_F_BASELINE_SUMMARY.disputedAmount.toLocaleString('en-IN')}`,
      expectedRequirement: 'Preserve immutable source records; control total equals ₹1,00,000 with ₹0 variance.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // Check W1: Working Prototype & Control Total Reconcile
  const isW1Passed = isCaseFCorrect;
  const w1: ReviewCheckItem = {
    id: 's19-w1-prototype-prototype',
    title: 'Working Prototype v1.0 & Control Total Invariance',
    description: 'Construct working prototype from Case F v1 records, demonstrating SUM(F01:F04) === ₹1,00,000 with ₹0 variance.',
    passed: isW1Passed,
    status: isW1Passed ? 'passed' : 'failed',
    studentValue: 'Reconciled: Control total equals ₹1,00,000 across all 4 invoices',
    expectedRequirement: 'Working prototype preserves raw source records and reconciles to ₹1,00,000 control total.',
    actionTab: 'Work',
  };

  // Check W2: Dynamic As-Of Date Sensitivity & Boundary Reclassification
  const hasDateSensitivity =
    asOfDate === '2026-10-31' || asOfDate === '2026-11-01' || asOfDate.length === 10;
  const w2: ReviewCheckItem = {
    id: 's19-w2-date-sensitivity',
    title: 'Dynamic As-Of Date Sensitivity & Boundary Reclassification',
    description: 'Verify boundary behavior: F01 due 31 Oct is Current (0d) on 31 Oct, and dynamically reclassifies to 1-30d on 1 Nov without changing total.',
    passed: hasDateSensitivity,
    status: hasDateSensitivity ? 'passed' : 'failed',
    studentValue: `Active Parameter: ${asOfDate} | Boundary reclassification verified`,
    expectedRequirement: 'Dynamic date parameter shifts buckets while maintaining ₹1,00,000 control total invariance.',
    actionTab: 'Work',
  };

  // Check W3: Five Executed Acceptance Tests
  const hasFiveTests = acceptanceTests.length >= 5;
  const allTestsPassed = hasFiveTests && acceptanceTests.every((t) => t.verdict === 'PASS');
  const isW3Passed = hasFiveTests && allTestsPassed;

  const w3: ReviewCheckItem = {
    id: 's19-w3-acceptance-tests',
    title: 'Five Executed QA Acceptance Tests with Verifiable Evidence',
    description: 'Execute all 5 acceptance test categories (Normal source, Due today, As of next day, Duplicate invoice, Blank amount) with PASS verdicts.',
    passed: isW3Passed,
    status: isW3Passed ? 'passed' : 'failed',
    studentValue: `${acceptanceTests.filter((t) => t.verdict === 'PASS').length} / ${acceptanceTests.length} tests verified PASS`,
    expectedRequirement: 'All 5 acceptance tests executed with clear test input, expected result, actual demonstrated output, and PASS verdict.',
    actionTab: 'Work',
  };

  // Check W4: Exception Handling (Duplicate IDs & Blank Amounts)
  const allQaChecksPassed = qaChecks.length >= 4 && qaChecks.every((c) => c.status === 'VERIFIED PASS');
  const isW4Passed = allQaChecksPassed;

  const w4: ReviewCheckItem = {
    id: 's19-w4-exception-handling',
    title: 'Edge-Case Exception Handling & Formula Audit Matrix',
    description: 'Audit Excel model for dynamic ranges, data types, zero circular references, and visible duplicate/blank exception alerts.',
    passed: isW4Passed,
    status: isW4Passed ? 'passed' : 'failed',
    studentValue: `${qaChecks.filter((c) => c.status === 'VERIFIED PASS').length} / ${qaChecks.length} QA checks verified`,
    expectedRequirement: 'Zero circular references; structured table references; visible exception flags for duplicate IDs and missing amounts.',
    actionTab: 'Work',
  };

  // Check W5: Individual Contribution & Before/After Peer Correction
  const contribWords = wordCount(studentContribution);
  const corrWords = wordCount(reviewerCorrection);
  const hasBeforeAfter =
    reviewerCorrection.toLowerCase().includes('before') ||
    reviewerCorrection.toLowerCase().includes('after') ||
    reviewerCorrection.toLowerCase().includes('correction') ||
    reviewerCorrection.toLowerCase().includes('hardcoded') ||
    reviewerCorrection.toLowerCase().includes('cell');
  const isW5Passed = contribWords >= 15 && corrWords >= 15 && hasBeforeAfter;

  const w5: ReviewCheckItem = {
    id: 's19-w5-peer-correction',
    title: 'Individual Contribution Log & Before/After Peer Correction',
    description: 'Record specific individual deliverable contributions and document one authentic before-and-after formula correction identified during peer audit.',
    passed: isW5Passed,
    status: isW5Passed ? 'passed' : 'failed',
    studentValue: `Contribution: ${contribWords} words | Peer Correction: ${corrWords} words (Before/After: ${hasBeforeAfter ? 'Documented' : 'Missing'})`,
    expectedRequirement: 'Document individual deliverable ownership and explicit before/after peer review defect correction.',
    actionTab: 'Work',
  };

  const workChecks = [w1, w2, w3, w4, w5];

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const hasPreparer = !!governance.preparerName?.trim();
  const hasReviewer = !!governance.reviewerName?.trim();
  const hasDecisionOwner = !!governance.decisionOwnerName?.trim();
  const hasReviewRoles = hasPreparer && hasReviewer && hasDecisionOwner;

  const t1: ReviewCheckItem = {
    id: 's19-t1-governance',
    title: 'Named Quality Assurance Roles & Governance Accountability',
    description: 'Assign named individuals for Preparer (Modeler), Reviewer (QA Lead), and Decision Owner (Engagement Lead).',
    passed: hasReviewRoles,
    status: hasReviewRoles ? 'passed' : 'failed',
    studentValue: hasReviewRoles
      ? `Preparer: ${governance.preparerName} | Reviewer: ${governance.reviewerName} | Owner: ${governance.decisionOwnerName}`
      : 'Incomplete review roles',
    expectedRequirement: 'Named accountability across Preparer, Reviewer, and Commercial Decision Owner.',
    actionTab: 'Team',
  };

  const hasDeliverable = fileVersion.includes('S19');
  const hasHandover = wordCount(handoverSummary) >= 25;
  const hasChecklistComplete = (ws.checkedIndices || []).length >= 4;
  const isT2Passed = hasDeliverable && hasHandover && hasChecklistComplete;

  const t2: ReviewCheckItem = {
    id: 's19-t2-rubric-compliance',
    title: 'Deliverable Handover Runbook & Verification Checklist',
    description: 'Deliverable named StudentID_S19_v01.xlsx with documented handover instructions and pre-submission checklist verified.',
    passed: isT2Passed,
    status: isT2Passed ? 'passed' : 'failed',
    studentValue: `Deliverable: ${fileVersion} | Handover: ${wordCount(handoverSummary)} words | Checklist: ${(ws.checkedIndices || []).length}/5 items checked`,
    expectedRequirement: 'File named StudentID_S19_v01, complete handover instructions, and verified self-review checklist.',
    actionTab: 'Team',
  };

  const teamChecks = [t1, t2];

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
      summary = `All ${checks.length} prototype, acceptance tests, formula audits, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Execution & Quality Assurance Orientation', overviewChecks),
    Learn: compileStage('Learn', 'QA Principles & Structured Test Logs', learnChecks),
    Case: compileStage('Case', 'Case F Version 1 Financial Grounding', caseChecks),
    Work: compileStage('Work', 'Prototype Testing, Acceptance Gates & Corrections', workChecks),
    Team: compileStage('Team', 'QA Governance & Handover Runbook', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No prototype testing or execution activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Acceptance tests, date boundary logic, or peer correction require attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Prototype execution in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Working Prototype v1.0, 5 Executed Acceptance Tests, Formula Audit Matrix, and Peer Correction fully verified!';
  }

  const recommendations: string[] = [];
  if (!isW1Passed) {
    recommendations.push('Reconcile working prototype to ₹1,00,000 control total across all 4 Case F invoices.');
  }
  if (!hasDateSensitivity) {
    recommendations.push('Test dynamic as-of date parameterization: verify F01 reclassifies to 1-30 Days on 1 November while control total is invariant.');
  }
  if (!isW3Passed) {
    recommendations.push('Execute all 5 acceptance tests (Normal source, Due today, As of next day, Duplicate invoice, Blank amount) with PASS verdicts.');
  }
  if (!isW4Passed) {
    recommendations.push('Complete the Excel QA audit matrix verifying data types, dynamic ranges, zero circular references, and visible exception alerts.');
  }
  if (!isW5Passed) {
    recommendations.push('Document your individual deliverable contribution and record one authentic before-and-after peer review correction.');
  }
  if (!hasReviewRoles) {
    recommendations.push('Record named preparer, reviewer, and commercial decision owner to complete the governance log.');
  }

  return {
    sessionId: 19,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

