import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession04(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const wordCount = (str: string) => (str || '').trim().split(/\s+/).filter(Boolean).length;

  const agenda = ws.agenda || [];
  const actions = ws.actions || [];
  const options = ws.deliveryOptions || [];
  const dnb = ws.dnbState || {};
  const governance = ws.governance || {};

  const conceptExplain = (draft['concept:explain'] || '').trim();
  const explainWords = wordCount(conceptExplain);

  const dnbDone = (dnb.done || draft['work-prompt:2'] || '').trim();
  const dnbNext = (dnb.next || '').trim();
  const dnbBlocker = (dnb.blocker || '').trim();
  const dnbTotalWords = wordCount(`${dnbDone} ${dnbNext} ${dnbBlocker}`);

  const teamContribution = (draft['team:contribution'] || governance.contributionSummary || '').trim();
  const contribWords = wordCount(teamContribution);

  const teamJudgement = (draft['team:judgement'] || governance.professionalBoundary || '').trim();
  const judgeWords = wordCount(teamJudgement);

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's04-o1-readiness',
      title: 'Delivery Crisis & Meeting Governance Orientation',
      description: 'Review the 17:00 client delivery commitment, 1-day supplier delay, ₹4,000 substitute fee, and 15:00 manager availability.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Understand crisis urgency, authority boundaries, and structured meeting expectations.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const explainLower = conceptExplain.toLowerCase();
  const hasDecisionOrAction = explainLower.includes('decision') || explainLower.includes('action') || explainLower.includes('minutes') || explainLower.includes('transcript');
  const hasAuthorityOrEscalation = explainLower.includes('authorit') || explainLower.includes('approv') || explainLower.includes('escalat') || explainLower.includes('manager') || explainLower.includes('limit') || explainLower.includes('sign-off');
  const learnPassed = explainWords >= 20 && hasDecisionOrAction && hasAuthorityOrEscalation;

  learnChecks.push({
    id: 's04-l1-explain',
    title: 'Meeting Minutes & Authority Governance Principle',
    description: 'Explain why minutes record binding decisions and unresolved risks rather than transcripts, and why options require formal approval authority.',
    passed: learnPassed,
    status: learnPassed ? 'passed' : explainWords > 0 ? 'warning' : 'pending',
    studentValue: explainWords > 0 ? `${explainWords} words entered` : 'Unanswered',
    expectedRequirement: 'Substantive explanation (>= 20 words) detailing decision recording and that an option is not approved until authorized by the budget owner.',
    whyIncorrect: 'Meeting minutes must capture decisions, accountable owners, and deadlines. An option is not approved merely because team members prefer it.',
    conceptToRevisit: 'Heading 1 · Minutes & Authority Principle',
    actionTab: 'Learn',
    actionLabel: 'Explain Governance Principle',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [];
  const caseText = `${conceptExplain} ${dnbDone} ${dnbBlocker}`.toLowerCase();
  const recognizesLimits = caseText.includes('2,000') || caseText.includes('2000') || caseText.includes('4,000') || caseText.includes('4000') || caseText.includes('limit') || caseText.includes('manager') || caseText.includes('15:00');

  caseChecks.push({
    id: 's04-c1-authority',
    title: 'Commercial Authority & Escalation Limit Identification',
    description: 'Recognize that Operations Lead authority is capped at ₹2,000, requiring General Manager sign-off at 15:00 for the ₹4,000 substitute fee.',
    passed: recognizesLimits,
    status: recognizesLimits ? 'passed' : 'warning',
    studentValue: recognizesLimits ? '₹2,000 lead limit & 15:00 GM sign-off identified' : 'Pending authority verification',
    expectedRequirement: 'Explicitly identify that the ₹4,000 fee exceeds the Operations Lead limit and requires escalation to 15:00 GM review.',
    whyIncorrect: 'The Operations Lead cannot approve ₹4,000 independently. The ₹2,000 ceiling requires formal escalation to the manager.',
    conceptToRevisit: 'Heading 1 · Crisis Briefing & Authority Limits',
    actionTab: 'Case',
    actionLabel: 'Review Authority Limits',
  });

  // ----------------------------------------------------
  // STAGE 04: WORK (DELIVERABLES)
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Four-Item Agenda
  const hasFourItems = Array.isArray(agenda) && agenda.length >= 4;
  workChecks.push({
    id: 's04-w1-agenda',
    title: 'Structured 4-Item Meeting Agenda (12 Minutes)',
    description: 'Configure a timeboxed 4-item meeting agenda with objectives and assigned squad leads totaling 12 minutes.',
    passed: hasFourItems,
    status: hasFourItems ? 'passed' : 'warning',
    studentValue: hasFourItems ? `${agenda.length} agenda items structured` : 'Incomplete agenda',
    expectedRequirement: '4 timeboxed agenda items covering context, options evaluation, authority escalation, and action allocation.',
    whyIncorrect: 'Meeting must follow a disciplined 4-item agenda timeboxed to 12 minutes.',
    conceptToRevisit: 'Heading 1 · Timed 4-Item Agenda Studio',
    actionTab: 'Work',
    actionLabel: 'Structure Agenda',
  });

  // Check 2: Decision Board & Authority Separation
  const substituteOpt = options.find((o: any) => o.id === 'opt-substitute' || (o.costINR && o.costINR === 4000));
  // An option cannot be marked AUTHORISED by operations lead without manager sign-off
  const authoritySafeguarded = !substituteOpt || substituteOpt.status === 'PENDING_APPROVAL' || (substituteOpt.approvalRequiredBy && substituteOpt.approvalRequiredBy.toLowerCase().includes('manager'));

  workChecks.push({
    id: 's04-w2-decision-board',
    title: 'Decision Board: Proposed Options vs Authorised Decisions',
    description: 'Ensure proposed solutions are separated from authorised decisions, and the ₹4,000 fee is logged as pending GM approval.',
    passed: authoritySafeguarded,
    status: authoritySafeguarded ? 'passed' : 'failed',
    studentValue: authoritySafeguarded ? 'Authority boundaries verified' : 'Unauthorized approval detected',
    expectedRequirement: 'The ₹4,000 substitute cannot be marked authorised until formal General Manager review at 15:00.',
    whyIncorrect: 'Operations Lead cannot approve expenditures above ₹2,000. Option must remain pending GM authorization.',
    conceptToRevisit: 'Heading 2 · Decision Board',
    actionTab: 'Work',
    actionLabel: 'Audit Decision Authority',
  });

  // Check 3: RACI Action Tracker
  const validActions = Array.isArray(actions) ? actions.filter((a: any) => a.task && a.owner && a.deadline) : [];
  const actionCountPassed = validActions.length >= 3;

  workChecks.push({
    id: 's04-w3-action-tracker',
    title: 'RACI Action Tracker with Deadlines & Owners',
    description: 'Document at least 3 time-bound actions specifying single individual owners, exact clock deadlines, and verification evidence.',
    passed: actionCountPassed,
    status: actionCountPassed ? 'passed' : validActions.length > 0 ? 'warning' : 'pending',
    studentValue: validActions.length > 0 ? `${validActions.length} owned actions tracked` : 'Unanswered',
    expectedRequirement: 'At least 3 actions with single individual owners, specific deadlines (e.g. 14:30, 15:00, 15:30), and proof evidence.',
    whyIncorrect: 'Every action item must have exactly 1 individual owner and a specific clock deadline, not vague dates.',
    conceptToRevisit: 'Heading 2 · RACI Action Tracker',
    actionTab: 'Work',
    actionLabel: 'Complete Action Tracker',
  });

  // Check 4: 90-Second Done-Next-Blocker Flash Report
  const dnbPassed = wordCount(dnbDone) >= 10 && wordCount(dnbNext) >= 8 && wordCount(dnbBlocker) >= 6;

  workChecks.push({
    id: 's04-w4-dnb',
    title: 'Executive Done-Next-Blocker (DNB) Status Report',
    description: 'Formulate a crisp 90-second executive flash report articulating Done, Next, and Blocker for senior management.',
    passed: dnbPassed,
    status: dnbPassed ? 'passed' : dnbTotalWords > 0 ? 'warning' : 'pending',
    studentValue: dnbPassed ? `${dnbTotalWords} words across Done/Next/Blocker` : 'Incomplete DNB report',
    expectedRequirement: 'Structured status update detailing what is completed, next touchpoint, and the ₹4,000 manager approval blocker.',
    whyIncorrect: 'DNB update must cover all three fields: completed meeting actions, next milestone, and active blockers.',
    conceptToRevisit: 'Heading 2 · 90-Second DNB Status Report',
    actionTab: 'Work',
    actionLabel: 'Draft DNB Flash Update',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];

  teamChecks.push({
    id: 's04-t1-contribution',
    title: 'Attributable Meeting Contribution & Peer Review',
    description: 'Record your specific role contribution in the meeting and at least one correction made following peer review.',
    passed: contribWords >= 15,
    status: contribWords >= 15 ? 'passed' : contribWords > 0 ? 'warning' : 'pending',
    studentValue: contribWords > 0 ? `${contribWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document individual role contribution and specific peer review corrections (>= 15 words).',
    whyIncorrect: 'Attributable squad accountability and peer audit record required for corporate certification.',
    conceptToRevisit: 'Heading 2 · Attributable Contribution',
    actionTab: 'Team',
    actionLabel: 'Record Contribution',
  });

  teamChecks.push({
    id: 's04-t2-judgement',
    title: 'Autonomous Quality Boundary (Quality Stance)',
    description: 'Document an independent professional judgment (e.g. refusing to guarantee client delivery before GM budget authorization).',
    passed: judgeWords >= 10,
    status: judgeWords >= 10 ? 'passed' : judgeWords > 0 ? 'warning' : 'pending',
    studentValue: judgeWords > 0 ? `${judgeWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document an independent commercial boundary (>= 10 words).',
    whyIncorrect: 'Commercial professionals must formulate an independent stance when asked to make unauthorized commitments.',
    conceptToRevisit: 'Heading 2 · Professional Boundary',
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
      summary = `${failedCount} requirement${failedCount > 1 ? 's' : ''} not met. Review authority limits and action ownership.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified. Complete remaining required items.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against Session 04 meetings and reporting standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Crisis Briefing & Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Meeting Minutes & Authority Principle', learnChecks),
    Case: compileStage('Case', 'Commercial Authority & Escalation Limit', caseChecks),
    Work: compileStage('Work', 'Meeting Minutes & Action Deliverables', workChecks),
    Team: compileStage('Team', 'Squad Accountability & Professional Judgment', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No meeting minutes or action items attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Unauthorized expenditure or missing action ownership detected.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified. Complete remaining sections.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Session 04 Meeting Minutes & RACI Action Tracker verified against Drive Edition 3.0 corporate standards!';
  }

  return {
    sessionId: 4,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: hasErrors ? ['Review decision authority and ensure all action items have single accountable owners.'] : [],
  };
}
