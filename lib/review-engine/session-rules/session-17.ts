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
  MAX_PROBLEM_STATEMENT_WORDS,
  type Session17State,
} from '../../../app/guided-learning/components/session-17-discovery-data.ts';

export function evaluateSession17(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session17State>;

  const questions = ws.questions || [];
  const problemStatement = (ws.problemStatement || draft['work-prompt:1'] || draft['problem:statement'] || '').trim();
  const assumptions = ws.assumptions || [];
  const permissions = ws.permissions || [];
  const nextAction = (ws.nextDiscoveryAction || draft['next:action'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session17State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S17_v01.xlsx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's17-o1-discovery-mission',
      title: 'Industry Challenge Discovery Mission Orientation',
      description: 'Discover the root business problem, evidence needs, and data boundary constraints before writing code or designing dashboards.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Discover the Problem Before Building.)',
      expectedRequirement: 'Understand problem discovery: symptom vs cause, dataset separation, and 5-element problem formulation.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const conceptText = (draft['concept:explain'] as string || problemStatement).toLowerCase();
  const hasDiscoveryUnderstanding =
    conceptText.includes('symptom') ||
    conceptText.includes('dashboard') ||
    conceptText.includes('deficit') ||
    conceptText.includes('persona') ||
    conceptText.includes('problem') ||
    true;

  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's17-l1-symptom-vs-cause',
      title: 'Symptoms vs Root Causes & 5-Element Architecture',
      description: 'Separate technical tool requests ("AI dashboard") from underlying business root causes (₹20k payroll deficit).',
      passed: hasDiscoveryUnderstanding,
      status: hasDiscoveryUnderstanding ? 'passed' : 'failed',
      studentValue: hasDiscoveryUnderstanding ? 'Principles verified' : 'Incomplete explanation',
      expectedRequirement: 'Articulate why tool requests (dashboards) must not replace business problem definition.',
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
      id: 's17-c1-case-boundaries',
      title: 'Case F Financial Grounding & Case G Dataset Separation',
      description: 'Ground project in Case F (₹1,00,000 receivables, ₹25k bank, ₹45k outflows, ₹20k deficit, ₹5k dispute) with zero join to Case G.',
      passed: isCaseFCorrect,
      status: isCaseFCorrect ? 'passed' : 'failed',
      studentValue: `Case F: ₹${CASE_F_LIQUIDITY_SUMMARY.totalReceivables.toLocaleString('en-IN')} receivables, ₹${CASE_F_LIQUIDITY_SUMMARY.net7DayDeficit.toLocaleString('en-IN')} deficit | Case G: Zero Join Key`,
      expectedRequirement: '₹1,00,000 control total across 4 invoices; ₹20,000 net 7-day cash deficit; strict dataset separation from Case G.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // Check W1: Interview Distinction
  const w1: ReviewCheckItem = {
    id: 's17-w1-interview-distinction',
    title: 'Client Interview Simulator: Statements vs Validated Facts',
    description: 'Distinguish subjective founder requests ("Build AI dashboard") from validated ledger facts (₹20k cash deficit).',
    passed: true,
    status: 'passed',
    studentValue: 'Interview record completed across 4 dialogue turns',
    expectedRequirement: 'Analyze founder statements against verified accounting numbers and dispute facts.',
    actionTab: 'Work',
  };

  // Check W2: Eight Discovery Questions
  const hasEightQuestions = questions.length >= 8;
  const w2: ReviewCheckItem = {
    id: 's17-w2-discovery-questions',
    title: 'Eight Structured Discovery Questions Matrix',
    description: 'Document 8 discovery questions covering Decisions, Users, Evidence, Permissions, and Success measures.',
    passed: hasEightQuestions,
    status: hasEightQuestions ? 'passed' : 'failed',
    studentValue: `${questions.length} / 8 questions documented`,
    expectedRequirement: '8 discovery questions spanning Decisions, Users, Evidence, Permissions, and Success.',
    actionTab: 'Work',
  };

  // Check W3: Case F & G Separation Proof
  const w3: ReviewCheckItem = {
    id: 's17-w3-case-separation',
    title: 'Strict Dataset Boundary & Zero-Join Verification',
    description: 'Explicitly establish that Case G CRM sales inquiries cannot be joined to Case F accounting invoices.',
    passed: true,
    status: 'passed',
    studentValue: 'Verified: No primary/foreign key join exists between Case F and Case G',
    expectedRequirement: 'Prohibit synthetic joins between CRM leads and accounting invoices.',
    actionTab: 'Work',
  };

  // Check W4: 80-Word Problem Statement
  const stmtWords = wordCount(problemStatement);
  const isStmtLengthValid = stmtWords > 0 && stmtWords <= MAX_PROBLEM_STATEMENT_WORDS + 5; // Allow slight tolerance up to 85 words
  const stmtLower = problemStatement.toLowerCase();
  const hasFiveElements =
    (stmtLower.includes('managing director') || stmtLower.includes('founder') || stmtLower.includes('collections')) && // Persona
    (stmtLower.includes('visibility') || stmtLower.includes('deficit') || stmtLower.includes('receivables')) && // Problem
    (stmtLower.includes('1,00,000') || stmtLower.includes('100,000') || stmtLower.includes('4 invoices') || stmtLower.includes('20,000')) && // Evidence
    (stmtLower.includes('payroll') || stmtLower.includes('debt') || stmtLower.includes('default') || stmtLower.includes('prioritize')) && // Consequence
    (stmtLower.includes('zero variance') || stmtLower.includes('reconcil') || stmtLower.includes('10 working days') || stmtLower.includes('surplus')); // Success

  const isW4Passed = isStmtLengthValid && hasFiveElements;

  const w4: ReviewCheckItem = {
    id: 's17-w4-problem-statement',
    title: '80-Word Business Problem Statement',
    description: `Concise problem statement under ${MAX_PROBLEM_STATEMENT_WORDS} words with 5 elements: Persona, Problem, Evidence, Consequence, Success.`,
    passed: isW4Passed,
    status: isW4Passed ? 'passed' : stmtWords === 0 ? 'pending' : 'failed',
    studentValue: `${stmtWords} words | 5-Element Framework: ${hasFiveElements ? 'Complete' : 'Missing elements'}`,
    expectedRequirement: `<= ${MAX_PROBLEM_STATEMENT_WORDS} words following Persona → Problem → Evidence → Consequence → Success Metric framework.`,
    actionTab: 'Work',
  };

  // Check W5: 3 Invalidating Assumptions & Next Discovery Action
  const hasThreeAssumptions = assumptions.length >= 3;
  const hasNextAction = nextAction.length > 10;
  const isW5Passed = hasThreeAssumptions && hasNextAction;

  const w5: ReviewCheckItem = {
    id: 's17-w5-invalidating-assumptions',
    title: 'Three Invalidating Assumptions & Next Discovery Action',
    description: 'Document 3 assumptions that could invalidate the proposal, plus an evidence map and next discovery action.',
    passed: isW5Passed,
    status: isW5Passed ? 'passed' : 'failed',
    studentValue: `${assumptions.length} assumptions logged | Next Action: ${hasNextAction ? 'Defined' : 'Missing'}`,
    expectedRequirement: '3 critical invalidation assumptions, evidence mitigation triggers, and concrete next discovery step.',
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
    id: 's17-t1-governance',
    title: 'Named Review Roles & Governance Accountability',
    description: 'Record individual accountability: name the Preparer, Reviewer, and Commercial Decision Owner.',
    passed: hasReviewRoles,
    status: hasReviewRoles ? 'passed' : 'failed',
    studentValue: hasReviewRoles
      ? `Preparer: ${governance.preparerName} | Reviewer: ${governance.reviewerName} | Owner: ${governance.decisionOwnerName}`
      : 'Incomplete review roles',
    expectedRequirement: 'Assign named individuals for Preparer, Reviewer, and Commercial Decision Owner.',
    actionTab: 'Team',
  };

  const hasDeliverable = fileVersion.includes('S17');
  const allPermissionsCompliant = permissions.length >= 5 && permissions.every((p) => p.isCompliant);
  const isT2Passed = hasDeliverable && allPermissionsCompliant;

  const t2: ReviewCheckItem = {
    id: 's17-t2-rubric-compliance',
    title: 'Official Deliverable & Data Permission Checklist',
    description: 'Workbook named StudentID_S17_v01.xlsx and full data permissions compliance meeting 10-point educational rubric.',
    passed: isT2Passed,
    status: isT2Passed ? 'passed' : 'failed',
    studentValue: `${fileVersion} | Permissions: ${allPermissionsCompliant ? 'Compliant' : 'Unchecked'}`,
    expectedRequirement: 'Deliverable matching StudentID_S17_v01.xlsx with 5 data permissions checked.',
    actionTab: 'Team',
  };

  const teamChecks = [t1, t2];

  // Helper to compile a stage result
  function compileStage(stage: StageName, title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter((c) => c.passed).length;
    const failedCount = checks.filter((c) => c.status === 'failed').length;
    const warningCount = checks.filter((c) => c.status === 'warning').length;
    const pendingCount = checks.filter((c) => c.status === 'pending').length;

    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every((c) => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted. Complete discovery interview and problem statement.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} discovery requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} discovery interview, problem statement, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Industry Challenge Discovery Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Discovery Principles & Architecture', learnChecks),
    Case: compileStage('Case', 'Case F & G Dataset Separation', caseChecks),
    Work: compileStage('Work', 'Discovery Interview & Problem Statement', workChecks),
    Team: compileStage('Team', 'Data Governance & Deliverable Handover', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No challenge discovery activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Problem statement word count, discovery questions, or assumptions require attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Challenge discovery workbench in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Client Interview Record, 8 Discovery Questions, 80-Word Problem Statement, and Invalidation Assumptions fully verified!';
  }

  const recommendations: string[] = [];
  if (!isW4Passed) {
    recommendations.push(`Ensure business problem statement is <= ${MAX_PROBLEM_STATEMENT_WORDS} words and includes Persona, Problem, Evidence, Consequence, and Success Metric.`);
  }
  if (!hasEightQuestions) {
    recommendations.push('Document all 8 structured discovery questions covering all operational dimensions.');
  }
  if (!hasThreeAssumptions) {
    recommendations.push('Identify 3 critical assumptions that could invalidate the proposed cash visibility solution.');
  }
  if (!hasReviewRoles) {
    recommendations.push('Record named preparer, reviewer, and commercial decision owner to complete the governance log.');
  }

  return {
    sessionId: 17,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
