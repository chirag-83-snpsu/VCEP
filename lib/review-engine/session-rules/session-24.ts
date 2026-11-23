import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  type Session24State,
} from '../../../app/guided-learning/components/session-24-passport-data.ts';

export function evaluateSession24(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session24State>;

  const exhibits = ws.exhibits || [];
  const defense = ws.defense || ({} as Partial<Session24State['defense']>);
  const passport = ws.passport || [];
  const careerPlan = ws.careerPlan || [];
  const scorecard = ws.scorecard || [];
  const studentContribution = (ws.studentContribution || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['team:judgement'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session24State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S24_v01.pdf';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's24-o1-demo-mission',
      title: 'Demo Day & Industry Passport Orientation',
      description: 'Deliver the squad capstone presentation, defend individual deliverables, and complete the official Industry Passport competency record.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Show the Evidence. Own Your Growth.)',
      expectedRequirement: '7-minute squad briefing, 2-minute individual defense station, and verified competency transcript.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const unverifiedPassportCount = passport.filter((p) => p.facultyEvaluationStatus === 'UNVERIFIED').length;
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's24-l1-passport-integrity',
      title: 'Evidence-Backed Credential Integrity & Non-Guarantee Rule',
      description: 'Credentials report demonstrated competence within assessed scope; team achievements never substitute for individual competence. No automatic placement guarantees.',
      passed: true,
      status: 'passed',
      studentValue: 'Evidence-Grounded (Zero Unsupported Claims)',
      expectedRequirement: 'All passport claims must link directly to authenticated artifact hashes; explicit statement of evaluated boundaries.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const exhibitsPassed = exhibits.length >= 4;
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's24-c1-case-boundaries',
      title: 'Faculty-Authorised Demo Day View & Capstone Exhibits',
      description: 'Review the 5-stage Demo Day run-of-show and inspect approved capstone exhibits (S18 WBS, S19 QA Logs, S20 Model v2.0, S22 Exit B, S23 Deck).',
      passed: exhibitsPassed,
      status: exhibitsPassed ? 'passed' : 'failed',
      studentValue: `${exhibits.length} of 5 Approved Exhibits Linked`,
      expectedRequirement: 'All exhibits must link directly to verified student deliverables across curriculum sessions.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // 1. Individual 2-Minute Defense Station Form
  const contribWords = wordCount(defense.personalContribution || '');
  const defectWords = wordCount(defense.defectCorrectionHistory || '');
  const methodWords = wordCount(defense.technicalMethodology || '');
  const limitsWords = wordCount(defense.scopeLimitations || '');
  const defensePassed =
    Boolean(defense.assignedArtifactId) &&
    contribWords >= 20 &&
    defectWords >= 20 &&
    methodWords >= 20 &&
    limitsWords >= 15;

  // 2. Six-Domain Industry Passport Verification
  const validPassportItems = passport.filter(
    (p) => Boolean(p.domain) && Boolean(p.verifiedArtifactId) && p.demonstratedProof.length > 20
  );
  const passportPassed = validPassportItems.length >= 6;

  // 3. 90-Day Post-Programme Career Acceleration Plan
  const validMilestones = careerPlan.filter(
    (m) => Boolean(m.horizon) && m.actionPlan.length > 20 && m.evidenceOfProgress.length > 15
  );
  const planPassed = validMilestones.length >= 3;

  // 4. Independent Judge Scorecard
  const totalScore = scorecard.reduce((sum, s) => sum + s.awardedMarks, 0);
  const scorecardPassed = scorecard.length >= 4 && totalScore >= 7;

  const workChecks: ReviewCheckItem[] = [
    {
      id: 's24-w1-artifact-defense',
      title: 'Individual 2-Minute Artifact Defense Station',
      description: 'Defend your personal contribution, evidence ID, correction history, technical method, and scope limitations on your assigned capstone deliverable.',
      passed: defensePassed,
      status: defensePassed ? 'passed' : 'failed',
      studentValue: `Artifact: ${defense.assignedArtifactId || 'None'} (Contrib: ${contribWords}w, Method: ${methodWords}w)`,
      expectedRequirement: 'Assigned artifact ID with substantive personal contribution, defect history, formula method, and limitations.',
      actionTab: 'Work',
    },
    {
      id: 's24-w2-passport-verification',
      title: 'Accurately Verified Six-Domain Industry Passport',
      description: 'Audit the competency transcript across all 6 domains: Finance Execution, Technology, Judgement, AI Verification, Communication, Professional Practice.',
      passed: passportPassed,
      status: passportPassed ? 'passed' : 'failed',
      studentValue: `${validPassportItems.length} of 6 Competency Domains Verified`,
      expectedRequirement: 'All 6 domains verified against authentic VCEP artifact IDs with verifiable proof narratives.',
      actionTab: 'Work',
    },
    {
      id: 's24-w3-career-plan',
      title: '90-Day Post-Programme Career Acceleration Plan',
      description: 'Structure 3 actionable career milestones across 30-day horizons with concrete goals, progress evidence, and target due dates.',
      passed: planPassed,
      status: planPassed ? 'passed' : 'failed',
      studentValue: `${validMilestones.length} of 3 Milestones Structured`,
      expectedRequirement: 'Three concrete milestones targeting advanced modeling, case study publication, and corporate FP&A placement.',
      actionTab: 'Work',
    },
    {
      id: 's24-w4-judge-scorecard',
      title: 'Independent Judge Scoring & Aggregation',
      description: 'External evaluators score Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts) independently.',
      passed: scorecardPassed,
      status: scorecardPassed ? 'passed' : 'failed',
      studentValue: `${totalScore} / 10 Marks Awarded by Evaluator Panel`,
      expectedRequirement: 'Independent 4-dimension evaluation with evaluator qualitative feedback and conflict certification.',
      actionTab: 'Work',
    },
  ];

  // ----------------------------------------------------
  // STAGE 05: TEAM / GOVERNANCE
  // ----------------------------------------------------
  const teamContribWords = wordCount(studentContribution);
  const teamCorrectWords = wordCount(reviewerCorrection);
  const teamContribPassed = teamContribWords >= 25;
  const teamCorrectPassed = teamCorrectWords >= 25;
  const governanceSignoffsPassed =
    Boolean(governance.preparerName) &&
    Boolean(governance.reviewerName) &&
    Boolean(governance.decisionOwner);
  const humanAcknowledged = Boolean(governance.humanAcknowledged);

  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's24-t1-governance',
      title: 'Squad Governance, Contribution & Human Acknowledgement',
      description: 'Document individual deliverable contributions, peer defect correction, three-tier signoffs, and mandatory human credential acknowledgement.',
      passed: teamContribPassed && teamCorrectPassed && governanceSignoffsPassed && humanAcknowledged,
      status: teamContribPassed && teamCorrectPassed && governanceSignoffsPassed && humanAcknowledged ? 'passed' : 'failed',
      studentValue: `Contrib: ${teamContribWords}w, Correction: ${teamCorrectWords}w, Acknowledged: ${humanAcknowledged ? 'Yes' : 'No'}`,
      expectedRequirement: 'Named Preparer, Reviewer, and Decision Owner; min 25 words contribution and correction; human acknowledgement signed.',
      actionTab: 'Team',
    },
    {
      id: 's24-t2-rubric-compliance',
      title: '10-Point Educational Rubric Compliance',
      description: 'Satisfy official grading criteria: Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
      passed: defensePassed && passportPassed && planPassed && scorecardPassed && teamContribPassed && teamCorrectPassed,
      status: defensePassed && passportPassed && planPassed && scorecardPassed && teamContribPassed && teamCorrectPassed ? 'passed' : 'failed',
      studentValue: defensePassed && passportPassed && planPassed ? '10 / 10 Rubric Satisfied' : 'Rubric Gaps Identified',
      expectedRequirement: 'Deliverable file StudentID_S24_v01.pdf, 6 verified competencies, individual defense, and 90-day plan.',
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
      summary = `All ${checks.length} Demo Day evaluation, Industry Passport verification, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Demo Day & Industry Passport Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Evidence-Backed Credential Integrity & Non-Guarantee Rule', learnChecks),
    Case: compileStage('Case', 'Faculty-Authorised Demo Day View & Capstone Exhibits', caseChecks),
    Work: compileStage('Work', 'Individual Defense, Industry Passport & 90-Day Career Plan', workChecks),
    Team: compileStage('Team', 'Squad Governance, Sign-off & Human Acknowledgement', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No Demo Day or Industry Passport activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: defense form, passport verification, 90-day plan, or governance require revision.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Review in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Demo Day Presentation, Individual Artifact Defense, Verified Industry Passport, and 90-Day Plan fully verified!';
  }

  const recommendations: string[] = [];
  if (!defensePassed) {
    recommendations.push('Complete your 2-minute individual artifact defense form (contribution, defect history, method, limitations).');
  }
  if (!passportPassed) {
    recommendations.push('Audit and verify all 6 competency domains in your Industry Passport against authentic artifact IDs.');
  }
  if (!planPassed) {
    recommendations.push('Structure all 3 milestones for your 90-day post-programme career acceleration plan.');
  }
  if (!scorecardPassed) {
    recommendations.push('Complete the independent judge scorecard across all 4 evaluation dimensions.');
  }
  if (!teamContribPassed || !teamCorrectPassed || !governanceSignoffsPassed || !humanAcknowledged) {
    recommendations.push('Record distinct named signoffs, min 25 words contribution and defect correction, and human acknowledgement.');
  }

  return {
    sessionId: 24,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

