import type {
  ReviewCheckItem,
  SessionReviewReport,
  StageReviewResult,
  ReviewContext,
  StageStatus,
  StageName,
} from '../types.ts';
import {
  type Session23State,
} from '../../../app/guided-learning/components/session-23-presentation-data.ts';

export function evaluateSession23(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = (workstationData || {}) as Partial<Session23State>;

  const slides = ws.slides || [];
  const execSummary = ws.execSummary || ({} as Partial<Session23State['execSummary']>);
  const challenges = ws.challenges || [];
  const agenda = ws.agenda || [];
  const demoScript = (ws.demoScript || draft['work-prompt:1'] || '').trim();
  const studentContribution = (ws.studentContribution || draft['team:contribution'] || '').trim();
  const reviewerCorrection = (ws.reviewerCorrection || draft['team:judgement'] || '').trim();
  const governance = ws.governance || ({} as Partial<Session23State['governance']>);
  const fileVersion = governance.fileVersion || 'StudentID_S23_v01.pptx';

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's23-o1-presentation-mission',
      title: 'Corporate Presentation & Board Review Orientation',
      description: 'Prepare a 6-slide executive deck, rehearse a 7-minute squad presentation with a 3-minute live demonstration, and defend decisions in an 8-minute Q&A.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Present the Work. Defend the Decision.)',
      expectedRequirement: '7-minute briefing with 3-minute live working demonstration followed by 8 minutes of panel questions.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's23-l1-executive-needs',
      title: 'Executive Deck Structure & Slide Count Discipline',
      description: 'Senior management briefings demand brevity and proof: maximum 6 slides covering problem, evidence, working model, decision, limits, and next steps.',
      passed: slides.length > 0 && slides.length <= 6,
      status: slides.length > 0 && slides.length <= 6 ? 'passed' : 'failed',
      studentValue: `${slides.length} of max 6 slides structured`,
      expectedRequirement: 'Up to six slides total; no superfluous feature lists or unverified claims.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const checkedPermissions = ws.checkedPermissions || [];
  const permissionsPassed = checkedPermissions.length >= 4;

  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's23-c1-case-boundaries',
      title: 'Case F Release Integrity & Scope Permissions',
      description: 'Enforce Case F receivables isolation, reject invalid CRM relational joins, uphold 6.0h student effort cap, and mandate live formulas.',
      passed: permissionsPassed,
      status: permissionsPassed ? 'passed' : 'failed',
      studentValue: `${checkedPermissions.length} of 5 permissions verified`,
      expectedRequirement: 'Audit integrity verified: Case F isolated, live formulas enforced, 3-minute demo timing respected.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK
  // ----------------------------------------------------
  // 1. Slide Deck Completeness (all 6 slides populated)
  const validSlides = slides.filter(
    (s) => s.title?.trim().length > 5 && (s.keyPoints || []).length >= 2 && s.evidenceReference?.trim().length > 5
  );
  const slidesPassed = validSlides.length >= 6;

  // 2. One-Page Executive Summary (all 6 sections populated)
  const pWords = wordCount(execSummary.problemContext || '');
  const eWords = wordCount(execSummary.sourceEvidence || '');
  const mWords = wordCount(execSummary.workingDemoMethod || '');
  const dWords = wordCount(execSummary.commercialDecision || '');
  const lWords = wordCount(execSummary.scopeLimitations || '');
  const nWords = wordCount(execSummary.nextStepsHandover || '');
  const execSummaryPassed =
    pWords >= 15 && eWords >= 15 && mWords >= 20 && dWords >= 15 && lWords >= 15 && nWords >= 15;

  // 3. Rehearsal Timing & Demo Script
  const demoScriptWords = wordCount(demoScript);
  const agendaPassed = agenda.length >= 5 && demoScriptWords >= 25;

  // 4. Three Reviewer Challenge Defenses
  const validChallenges = challenges.filter(
    (c) =>
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').trim().length > 30 &&
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').toLowerCase().includes('profit') ||
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').toLowerCase().includes('deficit') ||
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').toLowerCase().includes('key') ||
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').toLowerCase().includes('crm') ||
      (c.studentDefenseAnswer || c.squadDefenseStrategy || '').toLowerCase().includes('asha')
  );
  const challengesPassed = validChallenges.length >= 3;

  const workChecks: ReviewCheckItem[] = [
    {
      id: 's23-w1-slide-deck',
      title: 'Six-Slide Corporate Presentation Deck Builder',
      description: 'Construct 6 executive presentation slides linking directly to approved VCEP capstone evidence records.',
      passed: slidesPassed,
      status: slidesPassed ? 'passed' : 'failed',
      studentValue: `${validSlides.length} of 6 slides verified`,
      expectedRequirement: 'All 6 slides complete with title, >= 2 key points, and verified evidence reference.',
      actionTab: 'Work',
    },
    {
      id: 's23-w2-exec-summary',
      title: 'One-Page Executive Summary Briefing Document',
      description: 'Draft the 6-component executive summary: Problem, Evidence, Working Demo, Decision, Limits, and Next Action.',
      passed: execSummaryPassed,
      status: execSummaryPassed ? 'passed' : 'failed',
      studentValue: `P:${pWords}w, E:${eWords}w, D:${mWords}w, C:${dWords}w, L:${lWords}w, N:${nWords}w`,
      expectedRequirement: 'All 6 sections completed with substantive analytical reasoning and case numbers.',
      actionTab: 'Work',
    },
    {
      id: 's23-w3-rehearsal-timer',
      title: '7-Minute Rehearsal Outline & 3-Minute Demo Script',
      description: 'Plan the 7-minute squad agenda allocating exactly 3 minutes to the live working demonstration with a detailed click script.',
      passed: agendaPassed,
      status: agendaPassed ? 'passed' : 'failed',
      studentValue: `${agenda.length} agenda segments, Demo script: ${demoScriptWords}w`,
      expectedRequirement: '5 structured agenda blocks, and min 25-word live demonstration click script.',
      actionTab: 'Work',
    },
    {
      id: 's23-w4-reviewer-defense',
      title: 'Three Reviewer Challenge Defense Drills',
      description: 'Formulate rigorous mathematical and governance defenses for 3 tough panel questions (10% discount trap, Beacon default, CRM isolation).',
      passed: challengesPassed,
      status: challengesPassed ? 'passed' : 'failed',
      studentValue: `${validChallenges.length} of 3 challenges defended`,
      expectedRequirement: 'All 3 defense responses defended with unit economics, suspense isolation, and data integrity.',
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
      id: 's23-t1-governance',
      title: 'Squad Governance, Contribution & Peer Defect Correction',
      description: 'Document individual slide/rehearsal contributions, authentic peer defect correction, and three-tier governance signoffs.',
      passed: contribPassed && correctPassed && governanceSignoffsPassed,
      status: contribPassed && correctPassed && governanceSignoffsPassed ? 'passed' : 'failed',
      studentValue: `Contrib: ${contribWords}w, Correction: ${correctWords}w, Signoffs: ${governanceSignoffsPassed ? 'Complete' : 'Incomplete'}`,
      expectedRequirement: 'Named Preparer, Reviewer, and Decision Owner; min 25 words individual contribution and peer defect correction.',
      actionTab: 'Team',
    },
    {
      id: 's23-t2-rubric-compliance',
      title: '10-Point Educational Rubric Compliance',
      description: 'Satisfy official grading criteria: Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
      passed: slidesPassed && execSummaryPassed && agendaPassed && challengesPassed && contribPassed && correctPassed,
      status: slidesPassed && execSummaryPassed && agendaPassed && challengesPassed && contribPassed && correctPassed ? 'passed' : 'failed',
      studentValue: slidesPassed && execSummaryPassed && challengesPassed ? '10 / 10 Rubric Satisfied' : 'Rubric Gaps Identified',
      expectedRequirement: 'Deliverable file StudentID_S23_v01.pptx, 6 complete slides, 1-page summary, and 3 challenge defenses.',
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
      summary = `All ${checks.length} presentation preparation, executive briefing, and rehearsal checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Corporate Presentation & Board Review Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Executive Deck Structure & Slide Count Discipline', learnChecks),
    Case: compileStage('Case', 'Case F Release Integrity & Scope Permissions', caseChecks),
    Work: compileStage('Work', 'Slide Deck, Executive Summary & Rehearsal Simulator', workChecks),
    Team: compileStage('Team', 'Squad Governance, Sign-off & Peer Defect Correction', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter((c) => c.passed).length;
  const hasErrors = allChecks.some((c) => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every((c) => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No corporate presentation activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: slides, executive summary, demo script, or challenge defenses require revision.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Review in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Corporate Presentation Deck, Executive Summary, 7-Minute Rehearsal Script, and Reviewer Defenses fully verified!';
  }

  const recommendations: string[] = [];
  if (!slidesPassed) {
    recommendations.push('Complete all 6 slides with title, key points, and capstone evidence references.');
  }
  if (!execSummaryPassed) {
    recommendations.push('Complete all 6 sections of the executive summary with case evidence and calculations.');
  }
  if (!agendaPassed) {
    recommendations.push('Complete the 7-minute agenda and min 25-word live demonstration script.');
  }
  if (!challengesPassed) {
    recommendations.push('Formulate defenses for all 3 tough reviewer challenge questions.');
  }
  if (!contribPassed || !correctPassed || !governanceSignoffsPassed) {
    recommendations.push('Record distinct named signoffs and min 25 words for contribution and peer defect correction.');
  }

  return {
    sessionId: 23,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

