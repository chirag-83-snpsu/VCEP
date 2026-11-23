import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession03(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const wordCount = (str: string) => (str || '').trim().split(/\s+/).filter(Boolean).length;

  // Extract fields from workstation data or draft keys
  const clarifyDraft = ws.clarificationEmail || {};
  const progressDraft = ws.progressUpdate || {};
  const escalateDraft = ws.escalationMessage || {};
  const diagnostic = ws.diagnostic || {};
  const governance = ws.governance || {};

  const clarifySubject = (clarifyDraft.subject || '').trim();
  const clarifyBody = (clarifyDraft.body || draft['work-prompt:0'] || '').trim();
  const clarifyWords = wordCount(clarifyBody);

  const progressBody = (progressDraft.body || draft['work-prompt:1'] || '').trim();
  const progressWords = wordCount(progressBody);

  const escalateBody = (escalateDraft.body || draft['work-prompt:2'] || '').trim();
  const escalateWords = wordCount(escalateBody);

  const conceptExplain = (draft['concept:explain'] || diagnostic.creditRiskExplanation || '').trim();
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
      id: 's03-o1-readiness',
      title: 'Workplace Communication Protocol & Decision Orientation',
      description: 'Review the 11:00 AM ambiguous manager request, 14:00 payment roadblock, and 16:00 credit-limit decision deadline.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Understand corporate deadline constraints and executive communication standards.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const explainLower = conceptExplain.toLowerCase();
  const hasRevenueConcept = explainLower.includes('revenue') || explainLower.includes('sales') || explainLower.includes('bill') || explainLower.includes('invoice');
  const hasCollectionConcept = explainLower.includes('collect') || explainLower.includes('payment') || explainLower.includes('cash') || explainLower.includes('reliab') || explainLower.includes('credit') || explainLower.includes('bad debt');
  const learnPassed = explainWords >= 20 && hasRevenueConcept && hasCollectionConcept;

  learnChecks.push({
    id: 's03-l1-explain',
    title: 'Revenue Recognition vs Payment Reliability Principle',
    description: 'Explain why ranking customers by sales invoice volume alone creates critical bad debt risk for credit-limit decisions.',
    passed: learnPassed,
    status: learnPassed ? 'passed' : explainWords > 0 ? 'warning' : 'pending',
    studentValue: explainWords > 0 ? `${explainWords} words entered` : 'Unanswered',
    expectedRequirement: 'Substantive explanation (>= 20 words) distinguishing billed revenue from cash collection and payment reliability.',
    whyIncorrect: 'High sales volume does not guarantee cash collection. Granting higher credit limits to slow payers creates severe liquidity risk.',
    conceptToRevisit: 'Stage 02 Learn · Revenue vs Cash Reliability',
    actionTab: 'Learn',
    actionLabel: 'Explain Financial Principle',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [];
  const missingAnalysis = (diagnostic.missingDataExplanation || draft['missing:analysis'] || '').trim();
  const missingWords = wordCount(missingAnalysis);
  const casePassed = missingWords >= 15 || (clarifyWords > 0 && clarifyBody.toLowerCase().includes('collection'));

  caseChecks.push({
    id: 's03-c1-diagnostic',
    title: 'Data Asymmetry & Missing Information Identification',
    description: 'Identify that total invoice values are available, but payment records, collection dates, and aging are completely missing.',
    passed: casePassed,
    status: casePassed ? 'passed' : missingWords > 0 ? 'warning' : 'pending',
    studentValue: casePassed ? 'Missing collection data identified' : 'Pending identification',
    expectedRequirement: 'Recognize that payment history is missing before generating any credit decision report.',
    whyIncorrect: 'You must explicitly state that collection records are unavailable before answering the manager.',
    conceptToRevisit: 'Stage 03 Case · Available vs Missing Data',
    actionTab: 'Case',
    actionLabel: 'Audit Case Data',
  });

  // ----------------------------------------------------
  // STAGE 04: WORK (DELIVERABLES)
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Clarification Email (Max 120 words)
  const clarifyLower = clarifyBody.toLowerCase();
  const clarifyHasDeadline = clarifyLower.includes('16:00') || clarifyLower.includes('4:00') || clarifyLower.includes('today') || clarifyLower.includes('meeting') || clarifyLower.includes('credit');
  const clarifyHasDistinction = clarifyLower.includes('bill') || clarifyLower.includes('sales') || clarifyLower.includes('invoice') || clarifyLower.includes('collect') || clarifyLower.includes('payment');
  const clarifyPassed = clarifyWords > 0 && clarifyWords <= 120 && clarifySubject.length > 5 && clarifyHasDistinction;

  workChecks.push({
    id: 's03-w1-clarify',
    title: 'Clarification Email (Max 120 Words)',
    description: 'Draft a professional clarification email defining criteria, distinguishing sales from collections, and requesting data.',
    passed: clarifyPassed,
    status: clarifyPassed ? 'passed' : clarifyWords > 120 ? 'failed' : clarifyWords > 0 ? 'warning' : 'pending',
    studentValue: clarifyWords > 0 ? `${clarifyWords} words ${clarifyWords > 120 ? '(EXCEEDS 120 LIMIT)' : '(within budget)'}` : 'Unanswered',
    expectedRequirement: 'Professional email (<= 120 words) with subject line, distinguishing sales from collections and noting credit risk.',
    whyIncorrect: clarifyWords > 120 
      ? `Email exceeds corporate budget of 120 words (${clarifyWords} words). Edit for executive brevity.`
      : 'Email is missing key elements: subject line, distinction between billed sales and cash collections, or cutoff time.',
    conceptToRevisit: 'Heading 2 Compose · Clarification Email',
    actionTab: 'Work',
    actionLabel: 'Revise Clarification Email',
  });

  // Check 2: Progress Update (Max 40 words)
  const progressLower = progressBody.toLowerCase();
  const progressHasStatus = progressLower.includes('ranking') || progressLower.includes('invoice') || progressLower.includes('complete') || progressLower.includes('progress') || progressLower.includes('awaiting') || progressLower.includes('accounts');
  const progressPassed = progressWords > 0 && progressWords <= 40 && progressHasStatus;

  workChecks.push({
    id: 's03-w2-progress',
    title: 'Mid-Day Progress Update (Max 40 Words)',
    description: 'Send a concise status check reporting invoiced sales progress and pending collection data from Accounts.',
    passed: progressPassed,
    status: progressPassed ? 'passed' : progressWords > 40 ? 'failed' : progressWords > 0 ? 'warning' : 'pending',
    studentValue: progressWords > 0 ? `${progressWords} words ${progressWords > 40 ? '(EXCEEDS 40 LIMIT)' : '(within budget)'}` : 'Unanswered',
    expectedRequirement: 'Brief executive update (<= 40 words) stating completed tasks, dependencies, and next touchpoint time.',
    whyIncorrect: progressWords > 40 
      ? `Progress update exceeds 40-word limit (${progressWords} words). Tighten the message.`
      : 'Progress update must state completed invoiced work and pending accounts ledger dependency.',
    conceptToRevisit: 'Heading 2 Compose · Progress Update',
    actionTab: 'Work',
    actionLabel: 'Revise Progress Update',
  });

  // Check 3: Escalation Message (Max 70 words)
  const escalateLower = escalateBody.toLowerCase();
  const escalateHasRisk = escalateLower.includes('risk') || escalateLower.includes('debt') || escalateLower.includes('unverified') || escalateLower.includes('unavailable') || escalateLower.includes('default');
  const escalateHasFallback = escalateLower.includes('draft') || escalateLower.includes('caveat') || escalateLower.includes('invoiced') || escalateLower.includes('interim') || escalateLower.includes('proposal');
  const escalatePassed = escalateWords > 0 && escalateWords <= 70 && escalateHasRisk;

  workChecks.push({
    id: 's03-w3-escalation',
    title: '14:00 Escalation Message (Max 70 Words)',
    description: 'Escalate the missing payment data roadblock at 14:00, flagging credit risk and proposing an actionable interim fallback.',
    passed: escalatePassed,
    status: escalatePassed ? 'passed' : escalateWords > 70 ? 'failed' : escalateWords > 0 ? 'warning' : 'pending',
    studentValue: escalateWords > 0 ? `${escalateWords} words ${escalateWords > 70 ? '(EXCEEDS 70 LIMIT)' : '(within budget)'}` : 'Unanswered',
    expectedRequirement: 'Formal escalation (<= 70 words) articulating bad debt risk, proposing a constructive fallback, and setting next cutoff.',
    whyIncorrect: escalateWords > 70
      ? `Escalation exceeds 70-word limit (${escalateWords} words). Keep the alert actionable and concise.`
      : 'Escalation must state commercial risk of proceeding without payment data and propose a constructive next step.',
    conceptToRevisit: 'Heading 2 Compose · 14:00 Escalation',
    actionTab: 'Work',
    actionLabel: 'Revise Escalation',
  });

  // Check 4: Tone and Non-Speculative Language
  const speculativeWords = ['hopefully', 'maybe', 'sorry', 'apologies', 'guess', 'assume', 'probably'];
  const allText = `${clarifyBody} ${progressBody} ${escalateBody}`.toLowerCase();
  const detectedSpeculative = speculativeWords.filter(w => allText.includes(w));
  const tonePassed = detectedSpeculative.length === 0 && (clarifyWords > 0 || progressWords > 0 || escalateWords > 0);

  workChecks.push({
    id: 's03-w4-tone',
    title: 'Executive Tone & Elimination of Speculative Language',
    description: 'Ensure all workplace messages maintain objective commercial tone without weak speculative words (e.g. "hopefully", "maybe").',
    passed: tonePassed,
    status: tonePassed ? 'passed' : detectedSpeculative.length > 0 ? 'warning' : 'pending',
    studentValue: detectedSpeculative.length === 0 ? 'Professional & objective' : `Detected: "${detectedSpeculative.join('", "')}"`,
    expectedRequirement: 'Objective, evidence-based tone without speculation or apologetic filler phrases.',
    whyIncorrect: `Replace speculative phrasing (${detectedSpeculative.join(', ')}) with precise deadlines and verified evidence.`,
    conceptToRevisit: 'Heading 2 Compose · Tone Audit',
    actionTab: 'Work',
    actionLabel: 'Refine Tone',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];

  teamChecks.push({
    id: 's03-t1-contribution',
    title: 'Attributable Portfolio Contribution & Peer Review',
    description: 'Record your specific contribution and at least one correction made following peer review.',
    passed: contribWords >= 15,
    status: contribWords >= 15 ? 'passed' : contribWords > 0 ? 'warning' : 'pending',
    studentValue: contribWords > 0 ? `${contribWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document individual work and specific peer review corrections (>= 15 words).',
    whyIncorrect: 'Individual accountability and peer review audit trail required for professional certification.',
    conceptToRevisit: 'Heading 2 Compose · Attributable Contribution',
    actionTab: 'Team',
    actionLabel: 'Record Contribution',
  });

  teamChecks.push({
    id: 's03-t2-judgement',
    title: 'Autonomous Commercial Boundary (Quality Stance)',
    description: 'Document an independent professional judgment on customer credit risk (e.g. refusing to rank creditworthiness on sales alone).',
    passed: judgeWords >= 10,
    status: judgeWords >= 10 ? 'passed' : judgeWords > 0 ? 'warning' : 'pending',
    studentValue: judgeWords > 0 ? `${judgeWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document an independent professional judgment boundary (>= 10 words).',
    whyIncorrect: 'Commercial professionals must formulate an independent stance when incomplete data creates corporate risk.',
    conceptToRevisit: 'Heading 2 Compose · Professional Boundary',
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
      summary = `${failedCount} requirement${failedCount > 1 ? 's' : ''} not met. Review word limits and required criteria.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified. Complete remaining required items.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against Session 03 professional communication standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Mission & Decision Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Core Financial Principle Understanding', learnChecks),
    Case: compileStage('Case', 'Data Asymmetry & Missing Information', caseChecks),
    Work: compileStage('Work', 'Workplace Message Portfolio Deliverables', workChecks),
    Team: compileStage('Team', 'Squad Accountability & Professional Judgment', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No communication portfolio drafts attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: One or more messages exceed corporate word limits or omit required disclosures.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Portfolio in progress: ${totalPassed} of ${allChecks.length} checks verified. Complete remaining sections.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Session 03 Workplace Communication Portfolio verified against Drive Edition 3.0 corporate standards!';
  }

  return {
    sessionId: 3,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: hasErrors ? ['Review word count limits in your clarification, progress, and escalation drafts.'] : [],
  };
}

