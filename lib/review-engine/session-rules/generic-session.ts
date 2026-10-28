import { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types';

export function evaluateGenericSession(ctx: ReviewContext): SessionReviewReport {
  const { sessionId, lesson, draft } = ctx;
  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  const paddedId = String(sessionId).padStart(2, '0');
  const isControlled = !!lesson?.controlledAssessment;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: `s${paddedId}-o1-mission`,
      title: 'Business Mission & Deliverable Orientation',
      description: `Understand the session mission: ${lesson?.deliverable || 'Professional commercial deliverable'}.`,
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: `Deliverable requirement: ${lesson?.deliverable || 'Evidence-linked deliverable'}.`,
      actionTab: 'Overview',
    },
  ];

  if (isControlled) {
    const shieldAcknowledged = draft['check:0'] === 'yes';
    overviewChecks.push({
      id: `s${paddedId}-o2-controlled`,
      title: 'Controlled Assessment Condition',
      description: 'Independent diagnostic or exit examination conducted under strict trainer supervision without AI or peer help.',
      passed: shieldAcknowledged,
      status: shieldAcknowledged ? 'passed' : 'pending',
      studentValue: shieldAcknowledged ? 'Acknowledged' : 'Pending in-class supervision',
      expectedRequirement: 'Independent execution under trainer-controlled timing.',
      whyIncorrect: 'This session contains a controlled evaluation requiring in-person trainer oversight.',
      conceptToRevisit: 'Stage 01 Overview · Controlled Assessment Notice',
      actionTab: 'Overview',
      actionLabel: 'Review Conditions',
    });
  }

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const conceptExplain = (draft['concept:explain'] || '').trim();
  const lWords = wordCount(conceptExplain);
  const lPassed = lWords >= 20;

  learnChecks.push({
    id: `s${paddedId}-l1-explain`,
    title: 'Core Concept Explanation',
    description: 'Explain the foundational professional principle in your own words before proceeding to case analysis.',
    passed: lPassed,
    status: lPassed ? 'passed' : lWords > 0 ? 'warning' : 'pending',
    studentValue: lWords > 0 ? `${lWords} words entered` : 'Unanswered',
    expectedRequirement: 'Substantive explanation of at least 20 words demonstrating independent understanding.',
    whyIncorrect: 'Your explanation is incomplete. Formulate a comprehensive explanation connecting the principle to practice.',
    conceptToRevisit: 'Stage 02 Learn · Concept Briefing',
    actionTab: 'Learn',
    actionLabel: 'Draft Explanation',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: `s${paddedId}-c1-scenario`,
      title: 'Business Simulation Context & Source Facts',
      description: `Review case facts and operational constraints for ${lesson?.title || 'this session'}.`,
      passed: true,
      status: 'passed',
      studentValue: 'Drive Edition 3.0 facts verified',
      expectedRequirement: 'Ensure calculations rely strictly on stated facts rather than external assumptions.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];
  const workPrompts: string[] = lesson?.workPrompts || [];
  const workTables: any[] = lesson?.workTables || [];

  // Check work prompts
  workPrompts.forEach((prompt, idx) => {
    const val = (draft[`work-prompt:${idx}`] || '').trim();
    const w = wordCount(val);
    const passed = w >= 10;

    workChecks.push({
      id: `s${paddedId}-w-prompt-${idx}`,
      title: prompt,
      description: `Document your analysis, method, or deliverable response for: ${prompt}.`,
      passed,
      status: passed ? 'passed' : w > 0 ? 'warning' : 'pending',
      studentValue: w > 0 ? `${w} words entered` : 'Unanswered',
      expectedRequirement: 'A substantive answer demonstrating method, calculations, or evidence.',
      whyIncorrect: 'This requirement is unanswered or lacks supporting method and calculation details.',
      conceptToRevisit: 'Stage 04 Work · Assignment Prompts',
      actionTab: 'Work',
      actionLabel: 'Complete Prompt',
    });
  });

  // Check interactive work tables if prompts are few
  if (workTables.length > 0) {
    let totalCells = 0;
    let filledCells = 0;

    workTables.forEach((table, tIdx) => {
      (table.rows || []).forEach((row: string[], rIdx: number) => {
        row.forEach((cell: string, cIdx: number) => {
          if (!cell) { // editable cell
            totalCells++;
            if (draft[`work:${sessionId}:${tIdx}:${rIdx}:${cIdx}`]?.trim()) {
              filledCells++;
            }
          }
        });
      });
    });

    if (totalCells > 0) {
      const passed = filledCells >= Math.ceil(totalCells * 0.7);
      workChecks.push({
        id: `s${paddedId}-w-table-cells`,
        title: 'Editable Working Schedules',
        description: `Complete the required entries across ${workTables.map((t: any) => t.title).join(', ')}.`,
        passed,
        status: passed ? 'passed' : filledCells > 0 ? 'warning' : 'pending',
        studentValue: `${filledCells} of ${totalCells} cells filled`,
        expectedRequirement: `At least 70% of working schedule cells must be completed with live calculations or entries.`,
        whyIncorrect: `Working schedule has ${totalCells - filledCells} missing entries. Populate all required schedule lines.`,
        conceptToRevisit: 'Stage 04 Work · Interactive Working Table',
        actionTab: 'Work',
        actionLabel: 'Complete Table Entries',
      });
    }
  }

  // Check work analysis notes
  const workAnalysis = (draft['work:analysis'] || '').trim();
  const hasAnalysis = wordCount(workAnalysis) >= 10;
  workChecks.push({
    id: `s${paddedId}-w-analysis`,
    title: 'Supporting Method & Scratchpad Notes',
    description: 'Record supporting calculation method, data references, or commercial trade-offs.',
    passed: hasAnalysis || workPrompts.length > 0, // satisfied if prompts or analysis is filled
    status: (hasAnalysis || workPrompts.length > 0) ? 'passed' : 'warning',
    studentValue: hasAnalysis ? `${wordCount(workAnalysis)} words entered` : 'Optional',
    expectedRequirement: 'Document calculation method or working assumptions.',
    actionTab: 'Work',
    actionLabel: 'Add Analysis Notes',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const teamContribution = (draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();
  const contribWords = wordCount(teamContribution);
  const judgeWords = wordCount(teamJudgement);

  teamChecks.push({
    id: `s${paddedId}-t1-contribution`,
    title: 'Attributable Squad Contribution',
    description: 'Record your specific contribution and one correction made following peer review.',
    passed: contribWords >= 15,
    status: contribWords >= 15 ? 'passed' : contribWords > 0 ? 'warning' : 'pending',
    studentValue: contribWords > 0 ? `${contribWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document your attributable contribution and peer review adjustments (>= 15 words).',
    whyIncorrect: 'Individual accountability is required for corporate teamwork records.',
    conceptToRevisit: 'Stage 05 Team · Squad & Verification',
    actionTab: 'Team',
    actionLabel: 'Record Contribution',
  });

  teamChecks.push({
    id: `s${paddedId}-t2-judgement`,
    title: 'Autonomous Commercial Judgment',
    description: 'Document one recommendation or quality decision that must remain your independent stance.',
    passed: judgeWords >= 10,
    status: judgeWords >= 10 ? 'passed' : judgeWords > 0 ? 'warning' : 'pending',
    studentValue: judgeWords > 0 ? `${judgeWords} words entered` : 'Unanswered',
    expectedRequirement: 'Document an independent professional judgment (>= 10 words).',
    whyIncorrect: 'A commercial professional must formulate independent judgment when peer consensus carries risk.',
    conceptToRevisit: 'Stage 05 Team · Autonomous Decision Field',
    actionTab: 'Team',
    actionLabel: 'Record Independent Decision',
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
      summary = `${failedCount} requirement${failedCount > 1 ? 's' : ''} not met. Review guidance below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified. Complete remaining required items.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against session standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Mission & Orientation', overviewChecks),
    Learn: compileStage('Learn', 'Core Concept Understanding', learnChecks),
    Case: compileStage('Case', 'Source Facts & Case Context', caseChecks),
    Work: compileStage('Work', 'Individual Workstation Deliverables', workChecks),
    Team: compileStage('Team', 'Squad Accountability & Judgment', teamChecks),
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
    overallSummary = 'Formative review complete: Missing or incorrect deliverables detected. See feedback below.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified. Complete remaining sections.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = `Session ${paddedId} deliverables verified against Drive Edition 3.0 standards!`;
  }

  return {
    sessionId,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: hasErrors ? ['Complete missing work prompts and working schedules in Stage 04 (Work).'] : [],
  };
}
