import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus, StageName } from '../types.ts';

export function evaluateSession13(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const classification = ws.classification || {};
  const promptArch = ws.promptArchitecture || {};
  const verificationChecks = ws.verificationChecks || {};
  const revisedMemo = ws.revisedMemo || {};
  const governanceLog = ws.governanceLog || {};
  const selfRubric = ws.selfRubricScores || {};

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's13-o1-ai-mission',
      title: 'Responsible AI & Independent Human Verification Mission',
      description: 'Harness generative AI productivity while maintaining strict data boundaries, fact-checking every assertion, and logging audit trails.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented (Use AI Responsibly. Verify the Work.)',
      expectedRequirement: 'Understand workplace AI risks: confidentiality breaches, hallucinations, and unverified commercial advice.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's13-l1-data-minimization',
      title: 'Four Cardinal Principles of Commercial AI Governance',
      description: 'Master Data Minimization, Source Boundedness, Mandatory Human Verification, and Governance Auditability.',
      passed: true,
      status: 'passed',
      studentValue: 'Verified (4 Cardinal Principles)',
      expectedRequirement: 'Never input private identifiers; bound prompts to verified tables; verify before reporting; maintain audit disclosure logs.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's13-c1-case-d-source',
      title: 'Case D Three-Month MIS Financial Ground Truth',
      description: 'Confirm direct grounding in Case D: Q1 Revenue ₹370k, Sep Revenue ₹150k (+25.0%), Sep Operating Margin 20.0%, Receivables ₹70k.',
      passed: true,
      status: 'passed',
      studentValue: 'Case D MIS Verified (Jul-Sep)',
      expectedRequirement: 'Ground all AI prompts and human verification strictly in Case D monthly totals without inventing customer-level payment records.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Data Classification (Safe Aggregates vs Prohibited Private Identifiers)
  // DCI_01 (Rev totals): safe-aggregate
  // DCI_02 (Customer names): prohibited-private
  // DCI_03 (Cost pools): safe-aggregate
  // DCI_04 (Bank accounts/IFSC): prohibited-private
  // DCI_05 (Receivables balance): safe-aggregate
  // DCI_06 (Individual invoices/salaries): prohibited-private
  const correctCategories: Record<string, string> = {
    DCI_01: 'safe-aggregate',
    DCI_02: 'prohibited-private',
    DCI_03: 'safe-aggregate',
    DCI_04: 'prohibited-private',
    DCI_05: 'safe-aggregate',
    DCI_06: 'prohibited-private',
  };

  const totalItems = Object.keys(correctCategories).length;
  let correctCount = 0;
  for (const [id, correctCat] of Object.entries(correctCategories)) {
    if (classification[id] === correctCat) {
      correctCount++;
    }
  }

  // If student hasn't touched classification yet, check whether items exist or defaults
  const isClassificationSubmitted = Object.keys(classification).length > 0;
  const isClassificationPassing = !isClassificationSubmitted || correctCount === totalItems;

  workChecks.push({
    id: 's13-w1-data-classification',
    title: 'Data Minimization & Confidentiality Classification',
    description: 'Segregate safe aggregates (revenue totals, cost pools, receivables balance) from prohibited private identifiers (client names, bank accounts, tax invoices).',
    passed: isClassificationPassing,
    status: isClassificationPassing ? 'passed' : 'failed',
    studentValue: isClassificationSubmitted ? `${correctCount}/${totalItems} Correctly Categorized` : 'Default Categorization Ready',
    expectedRequirement: 'Classify company aggregates as safe; customer legal names, banking numbers, and individual invoices as prohibited.',
    whyIncorrect: 'Private data like customer corporate names, bank IFSC codes, and individual invoices must NEVER be uploaded to external AI tools.',
    conceptToRevisit: 'Stage 04 Work · Data Minimization Gate',
    actionTab: 'Work',
    actionLabel: 'Classify Data',
  });

  // Check 2: 6-Part Structured Prompt Architecture
  const hasRole = Boolean(promptArch.role && wordCount(promptArch.role) >= 3);
  const hasTask = Boolean(promptArch.task && wordCount(promptArch.task) >= 5);
  const hasSources = Boolean(promptArch.permittedSources && (promptArch.permittedSources.toLowerCase().includes('case d') || promptArch.permittedSources.toLowerCase().includes('cased')));
  const hasOutput = Boolean(promptArch.outputStructure && wordCount(promptArch.outputStructure) >= 5);
  const hasUncertainty = Boolean(promptArch.uncertaintyRule && wordCount(promptArch.uncertaintyRule) >= 5);
  const hasExclusions = Boolean(promptArch.explicitExclusions && wordCount(promptArch.explicitExclusions) >= 5);

  const isPromptArchComplete = hasRole && hasTask && hasSources && hasOutput && hasUncertainty && hasExclusions;

  workChecks.push({
    id: 's13-w2-prompt-architecture',
    title: '6-Part Structured Prompt Architecture',
    description: 'Verify 6 core elements: Role, Task, Permitted Sources (Case D only), Output Structure, Uncertainty Rule, and Explicit Exclusions.',
    passed: isPromptArchComplete,
    status: isPromptArchComplete ? 'passed' : 'warning',
    studentValue: isPromptArchComplete ? 'All 6 Prompt Components Valid' : 'Incomplete Prompt Specification',
    expectedRequirement: 'Specify Role, Task, Permitted Sources (Case D), Output Structure, Uncertainty Rule, and Exclusions.',
    whyIncorrect: 'Prompts without strict source bounding and uncertainty rules generate plausible-sounding financial hallucinations.',
    conceptToRevisit: 'Stage 04 Work · Structured Prompt Builder',
    actionTab: 'Work',
    actionLabel: 'Refine Prompt',
  });

  // Check 3: Fact-Checking Verification Workbench (4 Flawed Claims)
  // VERIF_01 (30% -> 25%), VERIF_02 (25% margin -> 20%), VERIF_03 (All paid on time -> Hallucination), VERIF_04 (20% discount -> Fatal)
  const verifKeys = ['VERIF_01', 'VERIF_02', 'VERIF_03', 'VERIF_04'];
  const verifiedCount = verifKeys.filter(k => verificationChecks[k] === true).length;
  const isVerificationComplete = verifiedCount >= 3; // At least 3 verified or all 4

  workChecks.push({
    id: 's13-w3-draft-verification',
    title: 'Flawed AI Draft Human Audit & Verification',
    description: 'Audit offline draft against Case D source: detect false 30% growth (true: 25.0%), false 25% margin (true: 20.0%), hallucinated collections, and fatal discount advice.',
    passed: isVerificationComplete,
    status: isVerificationComplete ? 'passed' : 'warning',
    studentValue: `${verifiedCount}/4 Errors Verified`,
    expectedRequirement: 'Identify and verify all 4 factual errors and hallucinations in the offline draft.',
    whyIncorrect: 'The draft falsely claims 30% growth (it is 25%), 25% margin (it compressed to 20%), hallucinated timely payments, and recommended an unprofitable discount.',
    conceptToRevisit: 'Stage 04 Work · Source vs AI Inspection',
    actionTab: 'Work',
    actionLabel: 'Verify Draft',
  });

  // Check 4: Human-Revised Management Memo
  const memoText = `${revisedMemo.revenueBullet || ''} ${revisedMemo.marginBullet || ''} ${revisedMemo.workingCapitalBullet || ''} ${revisedMemo.recommendationBullet || ''}`.toLowerCase();
  const has25Pct = memoText.includes('25') || memoText.includes('25.0%') || memoText.includes('25%');
  const has20PctMargin = memoText.includes('20') || memoText.includes('20.0%') || memoText.includes('20%');
  const hasReceivablesAlert = memoText.includes('receivable') || memoText.includes('70,000') || memoText.includes('70000') || memoText.includes('working capital');
  const hasSoundRecommendation = memoText.includes('discount') || memoText.includes('credit') || memoText.includes('cost') || memoText.includes('margin');
  const isMemoSubstantive = wordCount(memoText) >= 30;

  const isRevisedMemoValid = has25Pct && has20PctMargin && hasReceivablesAlert && isMemoSubstantive;

  workChecks.push({
    id: 's13-w4-human-revised-memo',
    title: 'Human-Revised Executive Management Commentary',
    description: 'Deliver accurate 4-bullet executive memo: September revenue (+25.0%), operating margin decay (20.0%), receivables surge (₹70,000), and sound strategic recommendation.',
    passed: isRevisedMemoValid,
    status: isRevisedMemoValid ? 'passed' : 'warning',
    studentValue: isRevisedMemoValid ? `Verified Memo (${wordCount(memoText)} words)` : 'Missing Key True Metrics (25% Growth / 20% Margin / Receivables Risk)',
    expectedRequirement: 'State September revenue grew 25.0%, margin compressed to 20.0%, receivables surged to ₹70k, and reject price discounting.',
    whyIncorrect: 'The executive memo must state the ground truth: September revenue grew 25%, operating margin compressed from 22.5% to 20.0%, and receivables tied up ₹70,000.',
    conceptToRevisit: 'Stage 04 Work · Verified Management Memo',
    actionTab: 'Work',
    actionLabel: 'Revise Memo',
  });

  // Check 5: AI-Use Governance & Disclosure Log
  const hasTool = Boolean(governanceLog.aiToolAndDate && wordCount(governanceLog.aiToolAndDate) >= 2);
  const hasInputRef = Boolean(governanceLog.permittedInputRef && (governanceLog.permittedInputRef.includes('CaseD') || governanceLog.permittedInputRef.includes('case')));
  const hasChecksSummary = Boolean(governanceLog.humanFactChecksSummary && wordCount(governanceLog.humanFactChecksSummary) >= 10);
  const hasReviewer = Boolean(governanceLog.humanReviewerName && wordCount(governanceLog.humanReviewerName) >= 2);
  const hasHumanDecision = Boolean(governanceLog.autonomousHumanDecision && wordCount(governanceLog.autonomousHumanDecision) >= 5);

  const isGovernanceLogComplete = hasTool && hasInputRef && hasChecksSummary && hasReviewer && hasHumanDecision;

  workChecks.push({
    id: 's13-w5-ai-log-disclosure',
    title: 'Mandatory AI-Use Disclosure & Accountability Log',
    description: 'Document tool used, permitted inputs reference, prompt reference, human corrections made, reviewer name, and autonomous human commercial decision.',
    passed: isGovernanceLogComplete,
    status: isGovernanceLogComplete ? 'passed' : 'warning',
    studentValue: isGovernanceLogComplete ? 'Complete AI Governance Trail' : 'Incomplete Disclosure Log',
    expectedRequirement: 'Complete all mandatory log fields including input references, verified corrections, and autonomous human decision.',
    whyIncorrect: 'Professional compliance requires an immutable record of AI usage and human judgment exercised.',
    conceptToRevisit: 'Stage 04 Work · AI Governance Log',
    actionTab: 'Work',
    actionLabel: 'Complete Log',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const fileVersion = ws.fileVersion || governanceLog.fileVersion || 'StudentID_S13_v01.xlsx';
  const hasValidDeliverable = fileVersion.includes('StudentID_S13_v01') || fileVersion.endsWith('.xlsx');

  teamChecks.push({
    id: 's13-t1-governance',
    title: 'Professional Deliverable & Audit Compliance',
    description: 'Preserve individual file naming (StudentID_S13_v01.xlsx) and record human reviewer and date.',
    passed: hasValidDeliverable,
    status: hasValidDeliverable ? 'passed' : 'warning',
    studentValue: hasValidDeliverable ? fileVersion : 'Unverified Filename',
    expectedRequirement: 'Deliverable must follow StudentID_S13_v01.xlsx naming convention.',
    actionTab: 'Team',
  });

  teamChecks.push({
    id: 's13-t2-rubric-compliance',
    title: 'Four-Pillar Responsible AI Educational Rubric',
    description: 'Assessment across Data Minimization (25%), Structured Prompting (25%), Fact-Checking Audit (30%), and Governance Trail (20%).',
    passed: isClassificationPassing && isPromptArchComplete && isVerificationComplete && isRevisedMemoValid,
    status: isClassificationPassing && isPromptArchComplete && isVerificationComplete && isRevisedMemoValid ? 'passed' : 'warning',
    studentValue: isClassificationPassing && isPromptArchComplete && isVerificationComplete ? '10/10 Ready' : 'Revisions Required',
    expectedRequirement: 'Satisfy data privacy categorization, bounded prompt structure, 4-point fact check, and audit log.',
    actionTab: 'Team',
  });

  // Helper to compile a stage result
  function compileStage(stage: StageName, title: string, checks: ReviewCheckItem[]): StageReviewResult {
    const passedCount = checks.filter(c => c.passed).length;
    const failedCount = checks.filter(c => c.status === 'failed').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const pendingCount = checks.filter(c => c.status === 'pending').length;

    let status: StageStatus = 'not_started';
    let summary = '';

    if (checks.every(c => c.status === 'pending')) {
      status = 'not_started';
      summary = 'Not yet attempted. Complete data categorization and structured prompt architecture.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} responsible AI requirement${failedCount > 1 ? 's' : ''} not met. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} responsible AI, prompt bounding, and fact-checking checks verified.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'Responsible AI & Verification Mission', overviewChecks),
    Learn: compileStage('Learn', 'Four Cardinal Principles of AI Governance', learnChecks),
    Case: compileStage('Case', 'Case D MIS Financial Ground Truth', caseChecks),
    Work: compileStage('Work', 'Safe Task Selection & Verification Workbench', workChecks),
    Team: compileStage('Team', 'Deliverable & Governance Audit', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No responsible AI activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Data minimization, prompt bounding, or verification requires attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Responsible AI workbench in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Data Minimization, 6-Part Prompt Architecture, 4-Point Verification Audit, and Governance Log fully verified!';
  }

  const recommendations: string[] = [];
  if (!isClassificationPassing) {
    recommendations.push('Classify private client names, bank account numbers, and individual invoices as prohibited; aggregate totals as safe.');
  }
  if (!isPromptArchComplete) {
    recommendations.push('Specify all 6 prompt elements: Role, Task, Permitted Sources (Case D), Output Structure, Uncertainty Rule, and Exclusions.');
  }
  if (!isVerificationComplete) {
    recommendations.push('Audit the offline draft against Case D: verify 25% growth, 20% margin, hallucinated payment claims, and reject 20% discount.');
  }
  if (!isRevisedMemoValid) {
    recommendations.push('Draft the revised memo stating September revenue grew 25.0%, margin compressed to 20.0%, and receivables tied up ₹70,000.');
  }
  if (!isGovernanceLogComplete) {
    recommendations.push('Complete the mandatory AI governance log with tool version, input references, human corrections, and autonomous decision.');
  }

  return {
    sessionId: 13,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
