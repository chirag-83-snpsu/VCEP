import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession02(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const introText = (ws.introText || draft['work-prompt:0'] || '').trim();
  const members = ws.members || [];
  const slots = ws.slots || [];
  const selectedOptionId = ws.selectedOptionId || '';
  const justification = (ws.justification || draft['work-prompt:1'] || '').trim();
  const conceptExplain = (draft['concept:explain'] || '').trim();
  const teamContribution = (draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const wordCount = (str: string) => str.split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's02-o1-readiness',
      title: 'Squad Formation & Work Standard Briefing',
      description: 'Review squad structure, professional identity principles, and peer accountability expectations.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Understand squad governance and professional introduction requirements.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const lWords = wordCount(conceptExplain);
  const lPassed = lWords >= 20;
  const explainLower = conceptExplain.toLowerCase();
  const hasAccountability = explainLower.includes('accountab') || explainLower.includes('owner') || explainLower.includes('role');
  const hasReviewer = explainLower.includes('review') || explainLower.includes('criteria') || explainLower.includes('standard');

  learnChecks.push({
    id: 's02-l1-explain',
    title: 'Accountability vs Reviewer Role Definition',
    description: 'Explain how individual deliverable ownership differs from reviewer oversight in professional teams.',
    passed: lPassed && hasAccountability,
    status: (lPassed && hasAccountability) ? 'passed' : lWords > 0 ? 'warning' : 'pending',
    studentValue: lWords > 0 ? `${lWords} words entered` : 'Unanswered',
    expectedRequirement: 'Substantive explanation of at least 20 words detailing that reviewer oversight does not erase single-point deliverable ownership.',
    whyIncorrect: 'Accountability means exactly one person owns acceptance criteria. A reviewer audits quality but does not assume primary liability.',
    conceptToRevisit: 'Stage 02 Learn · Accountability Principle',
    actionTab: 'Learn',
    actionLabel: 'Explain Accountability',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's03-c1-constraints',
      title: 'Real-World Team Operational Constraints',
      description: 'Identify squad hardware constraints (2 students sharing 1 laptop, 90-min commuter, 18:00 delivery deadline).',
      passed: true,
      status: 'passed',
      studentValue: 'Drive Edition 3.0 Case constraints verified',
      expectedRequirement: 'Design rota and backup rules that accommodate real student constraints without missing the 18:00 cutoff.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // W1: 90-Second Introduction Pitch
  const introWords = wordCount(introText);
  const introPassed = introWords >= 25 && introWords <= 180;
  workChecks.push({
    id: 's02-w1-intro',
    title: '90-Second Professional Elevator Introduction',
    description: 'Concise, evidence-based self-introduction connecting current competency to an entry-level corporate deliverable.',
    passed: introPassed,
    status: introPassed ? 'passed' : introWords > 0 ? 'warning' : 'pending',
    studentValue: introWords > 0 ? `${introWords} words` : 'Unanswered',
    expectedRequirement: 'Structured introduction (approx 25–180 words) linking your background to a specific accounting or operational responsibility.',
    whyIncorrect: introWords > 180
      ? 'Your intro is too long for a crisp 90-second executive introduction. Condense to core skills and deliverables.'
      : 'Write an actionable pitch connecting your capability to an entry-level corporate task.',
    conceptToRevisit: 'Stage 04 Work · Professional Introduction Builder',
    actionTab: 'Work',
    actionLabel: 'Refine Introduction',
  });

  // W2: Squad Roles & Hardware Rota
  const allRolesAssigned = members.length >= 4 && members.every((m: any) => m.role && m.role !== 'Unassigned');
  workChecks.push({
    id: 's02-w2-charter',
    title: 'Squad Role & Accountability Matrix',
    description: 'Ensure each squad member has a distinct primary role and hardware constraint mapped.',
    passed: allRolesAssigned,
    status: allRolesAssigned ? 'passed' : members.length > 0 ? 'warning' : 'pending',
    studentValue: allRolesAssigned ? `${members.length} members assigned` : 'Roles incomplete',
    expectedRequirement: 'All squad members must be allocated distinct roles (e.g. Lead, Data Modeler, Reconciler, Reviewer, Backup).',
    whyIncorrect: 'Ambiguous role assignment creates unassigned work and delivery bottlenecks.',
    conceptToRevisit: 'Stage 04 Work · Squad Accountability Charter',
    actionTab: 'Work',
    actionLabel: 'Complete Squad Roles',
  });

  // W3: Absent Reviewer Escalation Decision (opt-backup is correct)
  const isBackupChosen = selectedOptionId === 'opt-backup';
  const isSkipChosen = selectedOptionId === 'opt-skip';
  const isExtendChosen = selectedOptionId === 'opt-extend';
  const hasDecision = !!selectedOptionId;

  workChecks.push({
    id: 's02-w3-escalation',
    title: 'Absent Reviewer Governance & Escalation Decision',
    description: 'Select the compliant commercial recovery path when a reviewer is delayed in transit at 16:30 before an 18:00 deadline.',
    passed: isBackupChosen,
    status: isBackupChosen ? 'passed' : hasDecision ? 'failed' : 'pending',
    studentValue: isBackupChosen ? 'Option A: Engage Designated Backup per Charter Clause 4' :
      isSkipChosen ? 'Option B: Skip Review (Non-compliant)' :
      isExtendChosen ? 'Option C: Unilateral Deadline Extension (Contract breach)' : 'No decision selected',
    expectedRequirement: 'Option A: Formally engage designated Backup per Squad Charter Clause 4, notify Trainer via email at 16:30, and audit from 16:45 to 17:30.',
    whyIncorrect: isSkipChosen
      ? 'Governance Failure: Skipping review submits unchecked calculations. In corporate practice, unverified deliverables cause material financial misstatements.'
      : isExtendChosen
      ? 'Contract Breach: Unilaterally extending deadlines without client/manager authorization violates delivery commitments and damages institutional trust.'
      : 'Select the audit-compliant recovery path from the escalation simulator.',
    conceptToRevisit: 'Stage 04 Work · Escalation Decision Simulator',
    actionTab: 'Work',
    actionLabel: 'Revisit Escalation Path',
  });

  // W4: Governance Justification Text
  const justWords = wordCount(justification);
  const justPassed = justWords >= 15;
  workChecks.push({
    id: 's02-w4-justification',
    title: 'Audit Trail & Escalation Justification',
    description: 'Document the written rationale and audit trail explaining why the backup was activated.',
    passed: justPassed,
    status: justPassed ? 'passed' : justWords > 0 ? 'warning' : 'pending',
    studentValue: justWords > 0 ? `${justWords} words entered` : 'Unanswered',
    expectedRequirement: 'Written governance justification of at least 15 words referencing the 16:30 notification timestamp and 18:00 deadline.',
    whyIncorrect: 'Corporate decisions affecting delivery must maintain a documented audit trail.',
    conceptToRevisit: 'Stage 04 Work · Governance Justification Field',
    actionTab: 'Work',
    actionLabel: 'Provide Justification',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's02-t1-contribution',
      title: 'Attributable Squad Commitment',
      description: 'Document personal charter commitment and communication escalation agreement.',
      passed: wordCount(teamContribution) >= 15,
      status: wordCount(teamContribution) >= 15 ? 'passed' : wordCount(teamContribution) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamContribution) > 0 ? `${wordCount(teamContribution)} words` : 'Unanswered',
      expectedRequirement: 'Personal commitment recorded in team section.',
      actionTab: 'Team',
      actionLabel: 'Record Commitment',
    },
    {
      id: 's02-t2-judgement',
      title: 'Autonomous Quality Stand',
      description: 'State one professional boundary where you will decline to sign off on unverified work.',
      passed: wordCount(teamJudgement) >= 10,
      status: wordCount(teamJudgement) >= 10 ? 'passed' : wordCount(teamJudgement) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamJudgement) > 0 ? `${wordCount(teamJudgement)} words` : 'Unanswered',
      expectedRequirement: 'Independent boundary recorded.',
      actionTab: 'Team',
      actionLabel: 'Record Boundary',
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
      summary = 'Not yet attempted. Complete the activities in this section.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} governance or structural issue${failedCount > 1 ? 's' : ''} detected. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against professional charter standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Mission & Team Mindset', overviewChecks),
    Learn: compileStage('Learn', 'Accountability vs Reviewer Principle', learnChecks),
    Case: compileStage('Case', 'Real-World Team Operational Constraints', caseChecks),
    Work: compileStage('Work', 'Charter, Intro & Escalation Simulator', workChecks),
    Team: compileStage('Team', 'Personal Boundaries & Squad Agreement', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No practice activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Non-compliant governance or escalation decision detected. See recommendations below.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Squad Charter, Professional Intro, and Escalation Governance fully verified!';
  }

  const recommendations: string[] = [];
  if (!isBackupChosen && hasDecision) {
    recommendations.push('Revisit absent reviewer escalation: Skipping reviews submits unverified numbers; unauthorized extensions breach client contracts. Choose Option A (Backup engagement per Charter).');
  }
  if (!introPassed) {
    recommendations.push('Refine professional introduction to 25–180 words linking your skill directly to an entry-level task.');
  }

  return {
    sessionId: 2,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
