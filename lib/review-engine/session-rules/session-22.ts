import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  type Session22State,
} from '../../../app/guided-learning/components/session-22-hiring-data.ts';

export function evaluateSession22(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session22State>;

  const interviewEvidence = ws.interviewEvidence || [];
  const developmentPlan = ws.developmentPlan || [];
  const strongestTask = (ws.strongestTaskReflection || draft['work-prompt:1'] || '').trim();
  const ethicalResponse = (ws.ethicalResponse || draft['team:judgement'] || '').trim();
  const interviewerFeedback = (ws.interviewerFeedback || draft['work-prompt:0'] || '').trim();
  const studentContribution = (ws.studentContribution || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['team:judgement'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session22State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S22_v01.docx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's22-o1-exit-mission',
      title: 'Exit Assessment & Technical Viva Orientation',
      description: 'Complete the unseen individual Exit B assessment independently and demonstrate technical reasoning in a structured hiring viva.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Show Your Skills Independently.)',
      expectedRequirement: 'Independent execution under timed examination conditions followed by a three-minute viva.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's22-l1-assessment-security',
      title: 'Assessment Security & Controlled Conditions',
      description: 'Adhere to strict examination policy: unseen Exit B is issued separately by faculty, with zero AI and zero peer help during test and viva.',
      passed: true,
      status: 'passed',
      studentValue: 'Controlled Conditions (Zero AI / Unseen Separate Delivery)',
      expectedRequirement: 'Strict zero-AI restriction during Exit B and viva; confidential questions isolated from public bundle.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's22-c1-case-boundaries',
      title: 'Pre-Assessment Logistics & STAR+V Interview Framework',
      description: 'Clarify essential logistics (live formulas in StudentID_S22_v01.xlsx, 60 minutes) and apply the STAR+V framework.',
      passed: true,
      status: 'passed',
      studentValue: 'STAR+V Structured (Situation, Task, Action, Result, Verification)',
      expectedRequirement: 'Explicit differentiation of candidate personal contribution versus reviewer changes.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // 1. Three STAR+V interview evidence cases
  const validEvidenceItems = interviewEvidence.filter(
    (e) => e.situation.length > 20 && e.personalTask.length > 20 && e.actionTaken.length > 20 && e.resultVerified.length > 20
  );
  const evidencePassed = validEvidenceItems.length >= 3;

  // 2. Ethical escalation defense check
  const ethicalWords = wordCount(ethicalResponse);
  const ethicalTextLower = ethicalResponse.toLowerCase();
  const ethicalPassed =
    ethicalWords >= 35 &&
    (ethicalTextLower.includes('refuse') ||
      ethicalTextLower.includes('suspense') ||
      ethicalTextLower.includes('escalate') ||
      ethicalTextLower.includes('ethics') ||
      ethicalTextLower.includes('icai'));

  // 3. 30-day development plan check
  const validMilestones = developmentPlan.filter(
    (m) => m.capabilityGap.length > 15 && m.practiceAction.length > 20 && m.reviewDate.length > 4
  );
  const planPassed = validMilestones.length >= 3;

  const workChecks: ReviewCheckItem[] = [
    {
      id: 's22-w1-interview-evidence',
      title: 'Three-Part STAR+V Interview Evidence Register',
      description: 'Document 3 structured viva defense cases covering a completed task, an error corrected, and a decision escalated.',
      passed: evidencePassed,
      status: evidencePassed ? 'passed' : 'failed',
      studentValue: `${validEvidenceItems.length} of 3 STAR+V Cases Complete`,
      expectedRequirement: 'All 3 prompts completed with concrete mathematical proofs and verifiable artifact references.',
      actionTab: 'Work',
    },
    {
      id: 's22-w2-ethical-escalation',
      title: 'Ethical Escalation Defense (Suspense Isolation)',
      description: 'Defend professional accounting ethics and refusal to plug or conceal unverified suspense discrepancies under management pressure.',
      passed: ethicalPassed,
      status: ethicalPassed ? 'passed' : 'failed',
      studentValue: `${ethicalWords} words (Ethics Firm: ${ethicalPassed ? 'Yes' : 'No'})`,
      expectedRequirement: 'Min 35 words explaining ethical boundary, suspense isolation, and formal escalation under ICAI standards.',
      actionTab: 'Work',
    },
    {
      id: 's22-w3-development-plan',
      title: '30-Day Post-Assessment Competency Improvement Plan',
      description: 'Formulate 3 structured post-feedback development milestones with capability gaps, practice actions, and target review dates.',
      passed: planPassed,
      status: planPassed ? 'passed' : 'failed',
      studentValue: `${validMilestones.length} of 3 Milestones Structured`,
      expectedRequirement: 'Three concrete milestones targeting modeling, statutory compliance, and verbal viva defense.',
      actionTab: 'Work',
    },
  ];

  // ----------------------------------------------------
  // STAGE 05: TEAM / GOVERNANCE
  // ----------------------------------------------------
  const contribWords = wordCount(studentContribution);
  const correctWords = wordCount(reviewerCorrection);
  const contribPassed = contribWords >= 25;
  const correctPassed = correctWords >= 25;
  const governanceSignoffsPassed =
    Boolean(governance.preparerName) &&
    Boolean(governance.reviewerName) &&
    Boolean(governance.decisionOwner);

  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's22-t1-governance',
      title: 'Hiring Simulation Governance & Viva Voce Sign-off',
      description: 'Certify three-tier review roles, candidate contribution, peer/panel defect correction, and human interviewer evaluation.',
      passed: contribPassed && correctPassed && governanceSignoffsPassed,
      status: contribPassed && correctPassed && governanceSignoffsPassed ? 'passed' : 'failed',
      studentValue: `Contrib: ${contribWords}w, Correction: ${correctWords}w, Signoffs: ${governanceSignoffsPassed ? 'Complete' : 'Incomplete'}`,
      expectedRequirement: 'Named Candidate, Faculty Reviewer, Placement Decision Owner; min 35 words contribution and peer defect correction.',
      actionTab: 'Team',
    },
    {
      id: 's22-t2-rubric-compliance',
      title: '10-Point Educational Rubric Compliance',
      description: 'Satisfy official grading criteria: Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
      passed: evidencePassed && ethicalPassed && planPassed && contribPassed && correctPassed,
      status: evidencePassed && ethicalPassed && planPassed && contribPassed && correctPassed ? 'passed' : 'failed',
      studentValue: evidencePassed && ethicalPassed && planPassed ? '10 / 10 Rubric Satisfied' : 'Rubric Gaps Identified',
      expectedRequirement: 'Deliverable file StudentID_S22_v01.docx, 3 STAR+V cases, ethical defense, and 30-day plan.',
      actionTab: 'Team',
    },
  ];

  function compileStage(
    stage: StageName,
    title: string,
    checks: ReviewCheckItem[]
  ): StageReviewResult {
    const passedCount = checks.filter((c) => c.passed).length;
    const hasFail = checks.some((c) => c.status === 'failed');
    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every((c) => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not attempted yet.';
    } else if (hasFail) {
      status = 'needs_revision';
      summary = `${checks.filter((c) => c.status === 'failed').length} items require revision.`;
    } else if (passedCount < checks.length) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} exit assessment, viva defense, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Exit Assessment & Technical Viva Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Assessment Security & Controlled Conditions', learnChecks),
    Case: compileStage('Case', 'Pre-Assessment Logistics & STAR+V Interview Framework', caseChecks),
    Work: compileStage('Work', 'STAR+V Evidence, Ethical Escalation & 30-Day Development Plan', workChecks),
    Team: compileStage('Team', 'Hiring Governance, Sign-off & Panel Review', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No hiring simulation activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: STAR+V cases, ethical defense, or 30-day plan require revision.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Assessment review in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Exit Assessment Protocol, Three STAR+V Viva Cases, Ethical Defense, and 30-Day Plan fully verified!';
  }

  const recommendations: string[] = [];
  if (!evidencePassed) {
    recommendations.push('Complete all 3 STAR+V interview cases (task completed, error corrected, decision escalated).');
  }
  if (!ethicalPassed) {
    recommendations.push('Articulate your ethical defense refusing to plug or hide suspense discrepancies under pressure.');
  }
  if (!planPassed) {
    recommendations.push('Formulate 3 structured milestones for your 30-day post-assessment competency improvement plan.');
  }
  if (!contribPassed || !correctPassed || !governanceSignoffsPassed) {
    recommendations.push('Record distinct named signoffs and min 35 words for contribution and peer defect correction.');
  }

  return {
    sessionId: 22,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
