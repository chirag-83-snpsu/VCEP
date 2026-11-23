import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  type Session21State,
} from '../../../app/guided-learning/components/session-21-portfolio-data.ts';

export function evaluateSession21(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session21State>;

  const bullets = ws.bullets || [];
  const portfolio = ws.portfolio || [];
  const summaryText = (ws.summaryText || draft['work-prompt:1'] || draft['professional:summary'] || '').trim();
  const recruiterChallenge = ws.recruiterChallenge || ({} as Partial<Session21State['recruiterChallenge']>);
  const studentContribution = (ws.studentContribution || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['team:judgement'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session21State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S21_v01.docx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's21-o1-portfolio-mission',
      title: 'Resume & Portfolio Mission Orientation',
      description: 'Translate authentic VCEP assessed work into credible achievements and assemble an evidence-linked portfolio.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Turn Real Work into a Credible Resume.)',
      expectedRequirement: 'Grounded in authentic simulation artifacts without fraudulent live corporate impact claims.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const summaryLower = summaryText.toLowerCase();
  const hasAntiInflationConcept =
    !summaryLower.includes('improved profit 40%') &&
    !summaryLower.includes('boosted profit 40%');

  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's21-l1-anti-inflation',
      title: 'Anti-Inflation & Google XYZ Principles',
      description: 'Reject unverified claims (e.g. boosting live profit 40%); frame authentic capabilities with Google XYZ and simulated project disclosure.',
      passed: hasAntiInflationConcept,
      status: hasAntiInflationConcept ? 'passed' : 'failed',
      studentValue: hasAntiInflationConcept ? 'Anti-Inflation Verified' : 'Inflated Claim Detected',
      expectedRequirement: 'Google XYZ formula (Accomplished [X] measured by [Y] by doing [Z]) with honest [Simulated Project] framing.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const hasAuthorizedArtifacts = portfolio.length >= 6;
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's21-c1-case-boundaries',
      title: 'Authorized Student Deliverables & Cohort Privacy',
      description: 'Showcase only the student’s own verified VCEP project artifacts across the six required curriculum categories.',
      passed: hasAuthorizedArtifacts,
      status: hasAuthorizedArtifacts ? 'passed' : 'failed',
      studentValue: `${portfolio.length} of 6 Categories Linked`,
      expectedRequirement: 'Accounting, Reconciliation, MIS, Invoice review, AI verification, and Capstone deliverables.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // 1. Three XYZ bullets check
  const authenticBullets = bullets.filter((b) => b.status === 'AUTHENTIC' && b.isSimulatedFlagged);
  const bulletsPassed = authenticBullets.length >= 3;

  // 2. Six-item portfolio index check
  const portfolioWithHashes = portfolio.filter((p) => p.verificationHash && p.deliverableFile);
  const portfolioPassed = portfolioWithHashes.length >= 6;

  // 3. 90-word summary check (75 - 100 words)
  const summaryWords = wordCount(summaryText);
  const summaryPassed = summaryWords >= 75 && summaryWords <= 100;

  // 4. Recruiter challenge proof check
  const calcProof = recruiterChallenge.calculationProof || '';
  const challengePassed =
    (recruiterChallenge.challengeCompleted || calcProof.length > 50) &&
    (recruiterChallenge.skillGapIdentified || '').length > 10;

  const workChecks: ReviewCheckItem[] = [
    {
      id: 's21-w1-xyz-bullets',
      title: 'Three Evidence-Backed Google XYZ Resume Bullets',
      description: 'Draft 3 technical resume bullets specifying task, measured scale, technical method, and simulated context tag.',
      passed: bulletsPassed,
      status: bulletsPassed ? 'passed' : 'failed',
      studentValue: `${authenticBullets.length} of 3 Authentic Bullets`,
      expectedRequirement: '3 authentic bullets covering Financial Modeling, Statutory Accounting, and AI Governance with [Simulated Project] tag.',
      actionTab: 'Work',
    },
    {
      id: 's21-w2-portfolio-index',
      title: 'Six-Item Verifiable Portfolio Index',
      description: 'Assemble a six-item portfolio index with deliverable filenames, metrics, and cryptographic verification hashes.',
      passed: portfolioPassed,
      status: portfolioPassed ? 'passed' : 'failed',
      studentValue: `${portfolioWithHashes.length} of 6 Artifacts Indexed`,
      expectedRequirement: 'Six authentic deliverables with valid SHA verification hashes and student contribution notes.',
      actionTab: 'Work',
    },
    {
      id: 's21-w3-summary-words',
      title: '90-Word Professional Career Summary',
      description: 'Draft a concise executive career summary for resume header / LinkedIn About targeting 75–100 words (~90 words).',
      passed: summaryPassed,
      status: summaryPassed ? 'passed' : 'failed',
      studentValue: `${summaryWords} words`,
      expectedRequirement: '75 to 100 words highlighting verified simulation capabilities without live corporate impact claims.',
      actionTab: 'Work',
    },
    {
      id: 's21-w4-recruiter-challenge',
      title: '45-Second Recruiter Challenge & Skill Gap Defense',
      description: 'Provide immediate mathematical calculation proof and work log reference for selected claim; identify 1 skill gap and practice task.',
      passed: challengePassed,
      status: challengePassed ? 'passed' : 'failed',
      studentValue: challengePassed ? 'Recruiter Audit Defended' : 'Incomplete Recruiter Defense',
      expectedRequirement: 'Formula proof, work log reference, target role, technical skill gap, and actionable practice task.',
      actionTab: 'Work',
    },
  ];

  // ----------------------------------------------------
  // STAGE 05: TEAM / GOVERNANCE
  // ----------------------------------------------------
  const contribWords = wordCount(studentContribution);
  const correctWords = wordCount(reviewerCorrection);
  const contribPassed = contribWords >= 35;
  const correctPassed = correctWords >= 35;
  const governanceSignoffsPassed =
    Boolean(governance.preparerName) &&
    Boolean(governance.reviewerName) &&
    Boolean(governance.decisionOwner);

  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's21-t1-governance',
      title: 'Portfolio Governance & Peer Review Defect Correction',
      description: 'Document individual deliverable contributions and authentic peer defect correction addressing inflated claims.',
      passed: contribPassed && correctPassed && governanceSignoffsPassed,
      status: contribPassed && correctPassed && governanceSignoffsPassed ? 'passed' : 'failed',
      studentValue: `Contrib: ${contribWords}w, Correction: ${correctWords}w, Signoffs: ${governanceSignoffsPassed ? 'Complete' : 'Incomplete'}`,
      expectedRequirement: 'Named Preparer, Reviewer, Decision Owner; min 35 words contribution and peer defect correction of 40% profit claim.',
      actionTab: 'Team',
    },
    {
      id: 's21-t2-rubric-compliance',
      title: '10-Point Educational Rubric Compliance',
      description: 'Satisfy official grading criteria: Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
      passed: bulletsPassed && portfolioPassed && summaryPassed && contribPassed && correctPassed,
      status: bulletsPassed && portfolioPassed && summaryPassed && contribPassed && correctPassed ? 'passed' : 'failed',
      studentValue: bulletsPassed && portfolioPassed && summaryPassed ? '10 / 10 Rubric Satisfied' : 'Rubric Gaps Identified',
      expectedRequirement: 'Deliverable file StudentID_S21_v01.docx, 3 XYZ bullets, 6 portfolio items, and recruiter audit defense.',
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
      summary = `All ${checks.length} portfolio, resume bullet, and governance checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Resume & Portfolio Mission Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Anti-Inflation & Google XYZ Principles', learnChecks),
    Case: compileStage('Case', 'Authorized Student Deliverables & Cohort Privacy', caseChecks),
    Work: compileStage('Work', 'XYZ Bullets, Portfolio Index, 90-Word Profile & Recruiter Defense', workChecks),
    Team: compileStage('Team', 'Portfolio Governance, Sign-off & Peer Defect Correction', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No resume or portfolio activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: XYZ bullets, portfolio index, or summary require revision.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Portfolio development in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Authentic Google XYZ Bullets, Six-Item Portfolio Index, 90-Word Summary, and Recruiter Defense fully verified!';
  }

  const recommendations: string[] = [];
  if (!bulletsPassed) {
    recommendations.push('Draft 3 authentic Google XYZ bullets with [Simulated Project] tags and no inflated claims.');
  }
  if (!portfolioPassed) {
    recommendations.push('Compile a 6-item portfolio index linking genuine VCEP deliverables with SHA verification hashes.');
  }
  if (!summaryPassed) {
    recommendations.push('Adjust professional executive summary to fall within the 75–100 word target (~90 words).');
  }
  if (!challengePassed) {
    recommendations.push('Complete the 45-second recruiter defense showing formula proofs, target role, and practice tasks.');
  }
  if (!contribPassed || !correctPassed || !governanceSignoffsPassed) {
    recommendations.push('Record distinct named signoffs and min 35 words for contribution and peer defect correction.');
  }

  return {
    sessionId: 21,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
