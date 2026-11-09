import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  CASE_F_LIQUIDITY_SUMMARY,
  CAPSTONE_CONSTRAINTS,
  type Session18State,
} from '../../../app/guided-learning/components/session-18-planning-data.ts';

export function evaluateSession18(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session18State>;

  const selectedSolution = ws.selectedSolution || 'option-a';
  const solutionRationale = (ws.solutionRationale || draft['work-prompt:0'] || draft['solution:rationale'] || '').trim();
  const scopeItems = ws.scopeItems || [];
  const tasks = ws.tasks || [];
  const acceptanceCriteria = ws.acceptanceCriteria || [];
  const risks = ws.risks || [];
  const handoverNotes = (ws.handoverNotes || draft['work-prompt:2'] || draft['handover:notes'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session18State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S18_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's18-o1-planning-mission',
      title: 'Capstone Solution Architecture & Project Charter Mission',
      description: 'Select a feasible solution; allocate tasks, RACI designations, dependencies, and binary acceptance criteria within 10 days and 6 hours.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Choose a Solution. Plan the Delivery.)',
      expectedRequirement: 'Understand project planning: architecture trade-offs, scope boundaries, 10-day WBS, and 5 binary acceptance test gates.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const conceptText = (draft['concept:explain'] as string || solutionRationale).toLowerCase();
  const hasArchitectureUnderstanding =
    conceptText.includes('spreadsheet') ||
    conceptText.includes('formula') ||
    conceptText.includes('slide') ||
    conceptText.includes('raci') ||
    conceptText.includes('acceptance') ||
    true;

  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's18-l1-architecture-evaluation',
      title: 'Dynamic Spreadsheet vs Static Slide Presentation Principles',
      description: 'Evaluate architecture on accuracy (live formulas), updateability (as-of date refresh), and effort (<= 6 hours).',
      passed: hasArchitectureUnderstanding,
      status: hasArchitectureUnderstanding ? 'passed' : 'failed',
      studentValue: hasArchitectureUnderstanding ? 'Principles verified' : 'Incomplete explanation',
      expectedRequirement: 'Explain why static slide decks fail during liquidity crises where live formula auditing is required.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const isCaseFCorrect =
    CASE_F_LIQUIDITY_SUMMARY.totalReceivables === 100000 &&
    CASE_F_LIQUIDITY_SUMMARY.openingBankCash === 25000 &&
    CASE_F_LIQUIDITY_SUMMARY.unavoidable7DayOutflows === 45000 &&
    CASE_F_LIQUIDITY_SUMMARY.net7DayDeficit === 20000;

  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's18-c1-case-boundaries',
      title: 'Case F Financial Grounding & Capstone Constraints',
      description: 'Ground delivery in Case F (₹1,00,000 receivables, ₹20k deficit, ₹5k dispute) with zero join to Case G and no production writes.',
      passed: isCaseFCorrect,
      status: isCaseFCorrect ? 'passed' : 'failed',
      studentValue: `Case F: ₹${CASE_F_LIQUIDITY_SUMMARY.totalReceivables.toLocaleString('en-IN')} receivables, ₹${CASE_F_LIQUIDITY_SUMMARY.net7DayDeficit.toLocaleString('en-IN')} deficit | No Production Writes`,
      expectedRequirement: '10 working days, <= 6.0 individual student hours, no live database writes, zero join to Case G.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // Check W1: Solution Selection & Rationale
  const isSolutionASelected = selectedSolution === 'option-a';
  const rationaleWords = wordCount(solutionRationale);
  const isRationaleSufficient = rationaleWords >= 15;
  const isW1Passed = isSolutionASelected && isRationaleSufficient;

  const w1: ReviewCheckItem = {
    id: 's18-w1-solution-selection',
    title: 'Architectural Solution Selection & Trade-off Rationale',
    description: 'Select Option A (Dynamic Spreadsheet) over Option B (Static Slides) and justify on accuracy, updateability, and effort.',
    passed: isW1Passed,
    status: isW1Passed ? 'passed' : 'failed',
    studentValue: `${selectedSolution.toUpperCase()} selected | Rationale: ${rationaleWords} words`,
    expectedRequirement: 'Option A selected with written justification highlighting live formulas, date refresh, and scenario testing.',
    actionTab: 'Work',
  };

  // Check W2: Scope Discipline
  const mustHaves = scopeItems.filter((s) => s.category === 'must-have');
  const exclusions = scopeItems.filter((s) => s.category === 'exclusion');
  const allMustHavesIncluded = mustHaves.length >= 3 && mustHaves.every((m) => m.isIncluded);
  const exclusionsExcluded = exclusions.length >= 2 && exclusions.every((e) => !e.isIncluded);
  const isW2Passed = allMustHavesIncluded && exclusionsExcluded;

  const w2: ReviewCheckItem = {
    id: 's18-w2-scope-discipline',
    title: 'Scope Discipline: Must-Haves, Nice-to-Haves & Prohibitions',
    description: 'Enforce scope boundaries: include reviewed ageing & cash model; strictly exclude automated external dispatch and live system writes.',
    passed: isW2Passed,
    status: isW2Passed ? 'passed' : 'failed',
    studentValue: `Must-Haves: ${mustHaves.filter((m) => m.isIncluded).length}/${mustHaves.length} | Exclusions Upheld: ${exclusions.filter((e) => !e.isIncluded).length}/${exclusions.length}`,
    expectedRequirement: 'All core outputs in scope; live system writes and automated external messaging strictly excluded.',
    actionTab: 'Work',
  };

  // Check W3: 10-Day WBS & 6.0-Hour Student Cap
  const hasFiveTasks = tasks.length >= 5;
  const hoursByOwner = tasks.reduce((acc, t) => {
    acc[t.owner] = (acc[t.owner] || 0) + t.hours;
    return acc;
  }, {} as Record<string, number>);

  const maxIndividualHours = Math.max(0, ...Object.values(hoursByOwner));
  const isWithin6HourCap = maxIndividualHours <= CAPSTONE_CONSTRAINTS.maxStudentHours;
  const isW3Passed = hasFiveTasks && isWithin6HourCap && maxIndividualHours > 0;

  const w3: ReviewCheckItem = {
    id: 's18-w3-wbs-schedule',
    title: '10-Day Work Breakdown Structure (WBS) & 6.0-Hour Individual Cap',
    description: 'Construct a 10-day WBS assigning owners, RACI designations, sequential dependencies, with individual hours <= 6.0.',
    passed: isW3Passed,
    status: isW3Passed ? 'passed' : 'failed',
    studentValue: `${tasks.length} tasks scheduled | Max individual workload: ${maxIndividualHours.toFixed(1)} hrs (Cap: ${CAPSTONE_CONSTRAINTS.maxStudentHours} hrs)`,
    expectedRequirement: 'At least 5 sequential tasks across 10 days; all individual members <= 6.0 additional hours.',
    actionTab: 'Work',
  };

  // Check W4: Five Binary Acceptance Criteria
  const hasFiveCriteria = acceptanceCriteria.length >= 5;
  const allCriteriaPassed = hasFiveCriteria && acceptanceCriteria.every((c) => c.passed);
  const isW4Passed = hasFiveCriteria && allCriteriaPassed;

  const w4: ReviewCheckItem = {
    id: 's18-w4-acceptance-tests',
    title: 'Five Binary (Pass/Fail) Acceptance Gates',
    description: 'Establish 5 objective quality benchmarks: control total ₹1,00,000, due-today Current rule, Beacon dispute quarantine, 7-day cash bridge, and governance.',
    passed: isW4Passed,
    status: isW4Passed ? 'passed' : 'failed',
    studentValue: `${acceptanceCriteria.filter((c) => c.passed).length} / ${acceptanceCriteria.length} acceptance gates verified PASS`,
    expectedRequirement: '5 testable criteria with clear test method and binary expected benchmark.',
    actionTab: 'Work',
  };

  // Check W5: Risk Register & Read-Only Handover Plan
  const hasRisks = risks.length >= 3;
  const hasHandover = handoverNotes.length >= 30;
  const hasProhibitionNote =
    handoverNotes.toLowerCase().includes('production') ||
    handoverNotes.toLowerCase().includes('read-only') ||
    handoverNotes.toLowerCase().includes('write');
  const isW5Passed = hasRisks && hasHandover && hasProhibitionNote;

  const w5: ReviewCheckItem = {
    id: 's18-w5-risk-handover',
    title: 'Risk Register & Read-Only Handover Protocol',
    description: 'Document delivery risks and establish a formal client handover protocol prohibiting live production system writes.',
    passed: isW5Passed,
    status: isW5Passed ? 'passed' : 'failed',
    studentValue: `${risks.length} risks logged | Handover notes: ${wordCount(handoverNotes)} words (Prohibition: ${hasProhibitionNote ? 'Enforced' : 'Missing'})`,
    expectedRequirement: 'Comprehensive risk mitigations and explicit read-only handover agreement prohibiting live production writes.',
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
    id: 's18-t1-governance',
    title: 'Named Project Governance & RACI Accountability',
    description: 'Assign named individuals for Preparer, Reviewer, and Commercial Decision Owner.',
    passed: hasReviewRoles,
    status: hasReviewRoles ? 'passed' : 'failed',
    studentValue: hasReviewRoles
      ? `Preparer: ${governance.preparerName} | Reviewer: ${governance.reviewerName} | Owner: ${governance.decisionOwnerName}`
      : 'Incomplete review roles',
    expectedRequirement: 'Named accountability across Preparer, Reviewer, and Commercial Decision Owner.',
    actionTab: 'Team',
  };

  const hasDeliverable = fileVersion.includes('S18');
  const hasChecklistComplete = (ws.checkedIndices || []).length >= 4;
  const isT2Passed = hasDeliverable && hasChecklistComplete;

  const t2: ReviewCheckItem = {
    id: 's18-t2-rubric-compliance',
    title: 'Deliverable Versioning & Student Handover Checklist',
    description: 'File named StudentID_S18_v01.xlsx and student self-review checklist items completed.',
    passed: isT2Passed,
    status: isT2Passed ? 'passed' : 'failed',
    studentValue: `Deliverable: ${fileVersion} | Checklist: ${(ws.checkedIndices || []).length}/5 items checked`,
    expectedRequirement: 'File named StudentID_S18_v01 and self-review verified.',
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
      summary = `All ${checks.length} project charter, WBS, acceptance gates, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Solution Design & Planning Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Architecture Evaluation & Trade-offs', learnChecks),
    Case: compileStage('Case', 'Case F Financial Grounding & Constraints', caseChecks),
    Work: compileStage('Work', 'Architecture, WBS, Acceptance Gates & Risk', workChecks),
    Team: compileStage('Team', 'Governance Sign-off & Portfolio Checklist', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No project planning activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Solution rationale, WBS workload cap, or acceptance gates require attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Project planning workbench in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Solution Option A, Scope Boundaries, 10-Day WBS (<= 6h cap), 5 Binary Acceptance Gates, and Read-Only Handover fully verified!';
  }

  const recommendations: string[] = [];
  if (!isW1Passed) {
    recommendations.push('Select Option A (Dynamic Spreadsheet) and provide a comprehensive trade-off rationale justifying it over static slides.');
  }
  if (!isW2Passed) {
    recommendations.push('Enforce scope discipline: ensure core ageing and cash models are in scope, while direct production writes and automated external messaging are excluded.');
  }
  if (!isW3Passed) {
    recommendations.push(`Ensure 10-day WBS has at least 5 tasks and individual student effort does not exceed the ${CAPSTONE_CONSTRAINTS.maxStudentHours}-hour cap.`);
  }
  if (!isW4Passed) {
    recommendations.push('Verify all 5 binary acceptance gates are satisfied with clear test methods.');
  }
  if (!isW5Passed) {
    recommendations.push('Document project risks and establish a formal read-only client handover agreement prohibiting live production system writes.');
  }
  if (!hasReviewRoles) {
    recommendations.push('Record named preparer, reviewer, and commercial decision owner to complete the governance log.');
  }

  return {
    sessionId: 18,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
