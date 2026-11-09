import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus } from '../types.ts';

export function evaluateSession09(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};
  const kpis = ws.userKpis || ws;

  const julyGP = kpis.julyGrossProfit ?? 60000;
  const augGP = kpis.augustGrossProfit ?? 66000;
  const sepGP = kpis.septemberGrossProfit ?? 75000;

  const julyOP = kpis.julyOperatingProfit ?? 25000;
  const augOP = kpis.augustOperatingProfit ?? 27000;
  const sepOP = kpis.septemberOperatingProfit ?? 30000;

  const julyGM = kpis.julyGrossMargin ?? 60.0;
  const augGM = kpis.augustGrossMargin ?? 55.0;
  const sepGM = kpis.septemberGrossMargin ?? 50.0;

  const julyOM = kpis.julyOperatingMargin ?? 25.0;
  const augOM = kpis.augustOperatingMargin ?? 22.5;
  const sepOM = kpis.septemberOperatingMargin ?? 20.0;

  const revGrowth = kpis.revenueGrowthMoM ?? 25.0;
  const opGrowth = kpis.profitGrowthMoM ?? 11.1;
  const ppChange = kpis.marginPpChangeMoM ?? -5.0;

  const findings = ws.findings || [];
  const uncertainty = (ws.uncertainty || draft['concept:explain'] || '').trim();
  const investigation = (ws.investigation || '').trim();
  const executiveBriefing = (ws.executiveBriefing || '').trim();
  const teamContribution = (ws.peerDefenseNote || draft['team:contribution'] || '').trim();
  const teamJudgement = (draft['team:judgement'] || '').trim();

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's09-o1-finance-mission',
      title: 'Business Finance & MIS Performance Objective',
      description: 'Evaluate revenue growth versus profitability, margins, and accounts receivable in Case D three-month MIS.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Calculate 3-month GP, OP, GM%, OM%, analyze growth rates, and write 3 evidenced findings, 1 uncertainty, and 1 investigation.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [];
  const isPpDistinguished = Math.abs(ppChange) === 5.0;

  learnChecks.push({
    id: 's09-l1-pp-vs-percent',
    title: 'Percentage Points vs. Percentage Growth Distinction',
    description: 'Distinguish between a percentage point change in margin (-5.0 pp) and relative percentage growth.',
    passed: isPpDistinguished,
    status: isPpDistinguished ? 'passed' : 'warning',
    studentValue: `${ppChange} percentage points`,
    expectedRequirement: 'Gross margin fell from 55.0% to 50.0%, representing exactly -5.0 percentage points.',
    whyIncorrect: 'Verify the difference: 50% - 55% = -5.0 percentage points, not a -5% relative drop.',
    conceptToRevisit: 'Stage 02 Learn · Ratio Analysis Concepts',
    actionTab: 'Learn',
    actionLabel: 'Verify PP Distinction',
  });

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's09-c1-cased-facts',
      title: 'Case D Three-Month Financial Inputs',
      description: 'Confirm baseline figures: Revenue (₹100k, ₹120k, ₹150k), Direct Costs (₹40k, ₹54k, ₹75k), Overhead (₹35k, ₹39k, ₹45k), and AR (₹30k, ₹45k, ₹70k).',
      passed: true,
      status: 'passed',
      studentValue: 'Case D inputs verified',
      expectedRequirement: 'Source records must match Case D MIS release net of tax.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Gross Profit Calculations
  const isGPCorrect = julyGP === 60000 && augGP === 66000 && sepGP === 75000;
  workChecks.push({
    id: 's09-w1-gross-profit',
    title: 'Gross Profit Calculations (₹60k, ₹66k, ₹75k)',
    description: 'Calculate Gross Profit = Revenue - Direct Costs for July (₹60,000), August (₹66,000), and September (₹75,000).',
    passed: isGPCorrect,
    status: isGPCorrect ? 'passed' : 'failed',
    studentValue: `Jul: ₹${julyGP.toLocaleString()}, Aug: ₹${augGP.toLocaleString()}, Sep: ₹${sepGP.toLocaleString()}`,
    expectedRequirement: 'July ₹60,000; August ₹66,000; September ₹75,000.',
    whyIncorrect: 'Deduct direct delivery costs from billed revenue for each month.',
    conceptToRevisit: 'Stage 04 Work · KPI Calculations',
    actionTab: 'Work',
    actionLabel: 'Check Gross Profit',
  });

  // Check 2: Operating Profit Calculations
  const isOPCorrect = julyOP === 25000 && augOP === 27000 && sepOP === 30000;
  workChecks.push({
    id: 's09-w2-operating-profit',
    title: 'Operating Profit Calculations (₹25k, ₹27k, ₹30k)',
    description: 'Calculate Operating Profit = Gross Profit - Overhead for July (₹25,000), August (₹27,000), and September (₹30,000).',
    passed: isOPCorrect,
    status: isOPCorrect ? 'passed' : 'failed',
    studentValue: `Jul: ₹${julyOP.toLocaleString()}, Aug: ₹${augOP.toLocaleString()}, Sep: ₹${sepOP.toLocaleString()}`,
    expectedRequirement: 'July ₹25,000; August ₹27,000; September ₹30,000.',
    whyIncorrect: 'Deduct operating overhead from gross profit for each month.',
    conceptToRevisit: 'Stage 04 Work · KPI Calculations',
    actionTab: 'Work',
    actionLabel: 'Check Operating Profit',
  });

  // Check 3: Margins (Gross 60%, 55%, 50% | Operating 25%, 22.5%, 20%)
  const isMarginsCorrect =
    julyGM === 60.0 &&
    augGM === 55.0 &&
    sepGM === 50.0 &&
    julyOM === 25.0 &&
    augOM === 22.5 &&
    sepOM === 20.0;

  workChecks.push({
    id: 's09-w3-margins',
    title: 'Gross & Operating Margin Ratios (GM 60→50% | OM 25→20%)',
    description: 'Compute Gross Margin % (60.0%, 55.0%, 50.0%) and Operating Margin % (25.0%, 22.5%, 20.0%).',
    passed: isMarginsCorrect,
    status: isMarginsCorrect ? 'passed' : 'failed',
    studentValue: `GM: ${julyGM}%→${augGM}%→${sepGM}% | OM: ${julyOM}%→${augOM}%→${sepOM}%`,
    expectedRequirement: 'GM: July 60.0%, August 55.0%, September 50.0%; OM: July 25.0%, August 22.5%, September 20.0%.',
    whyIncorrect: 'Verify percentage ratios: (Profit / Revenue) * 100.',
    conceptToRevisit: 'Stage 04 Work · Margin Trends',
    actionTab: 'Work',
    actionLabel: 'Check Margin Ratios',
  });

  // Check 4: September vs August Growth Ratios
  const isGrowthCorrect = revGrowth === 25.0 && (opGrowth === 11.1 || Math.round(opGrowth) === 11);
  workChecks.push({
    id: 's09-w4-growth-rates',
    title: 'MoM Growth Rates: Revenue (+25.0%) vs. Operating Profit (+11.1%)',
    description: 'Calculate MoM expansion: Revenue grew +25.0% ((150k-120k)/120k), but Operating Profit grew only +11.1% ((30k-27k)/27k).',
    passed: isGrowthCorrect,
    status: isGrowthCorrect ? 'passed' : 'failed',
    studentValue: `Rev: +${revGrowth}%, OP: +${opGrowth}%`,
    expectedRequirement: 'Revenue growth must equal +25.0%; Operating profit growth must equal +11.1%.',
    whyIncorrect: 'Verify MoM growth: (Sep - Aug) / Aug * 100.',
    conceptToRevisit: 'Stage 04 Work · MoM Growth Rates',
    actionTab: 'Work',
    actionLabel: 'Check Growth Rates',
  });

  // Check 5: Three Evidenced Findings
  const hasThreeFindings =
    findings.length >= 3 &&
    findings.every((f: string) => wordCount(f) >= 15);

  workChecks.push({
    id: 's09-w5-three-findings',
    title: 'Three Evidenced Management Observations',
    description: 'Document 3 findings analyzing Gross Margin compression, profit decoupling, and accounts receivable surge.',
    passed: hasThreeFindings,
    status: hasThreeFindings ? 'passed' : 'pending',
    studentValue: hasThreeFindings ? `${findings.length} findings recorded` : 'Incomplete findings',
    expectedRequirement: 'At least 3 substantive findings (>= 15 words each) citing specific Case D figures.',
    whyIncorrect: 'Ensure all 3 findings contain concrete numerical evidence from Case D.',
    conceptToRevisit: 'Stage 04 Work · Findings Analysis',
    actionTab: 'Work',
    actionLabel: 'Complete Findings',
  });

  // Check 6: Uncertainty & Operational Investigation
  const hasUncertainty = wordCount(uncertainty) >= 12;
  const hasInvestigation = wordCount(investigation) >= 12;
  const isReasoningPassed = hasUncertainty && hasInvestigation;

  workChecks.push({
    id: 's09-w6-uncertainty-investigation',
    title: 'Critical Uncertainty & Audit Investigation Plan',
    description: 'Identify 1 unsupplied data point in Case D (e.g., collection dates, cost driver reasons) and propose a concrete investigation.',
    passed: isReasoningPassed,
    status: isReasoningPassed ? 'passed' : 'pending',
    studentValue: isReasoningPassed ? 'Documented' : 'Missing uncertainty or investigation',
    expectedRequirement: 'Specify an unverified data gap and an actionable investigation (e.g. debtor aging analysis or vendor audit).',
    whyIncorrect: 'Complete both the uncertainty field and the operational investigation plan.',
    conceptToRevisit: 'Stage 04 Work · Professional Judgment',
    actionTab: 'Work',
    actionLabel: 'State Investigation',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [
    {
      id: 's09-t1-peer-defense',
      title: 'Peer Defense: Challenging the Sales Growth Narrative',
      description: 'Articulate why top-line sales growth alone cannot justify higher bonuses when gross margin fell by 10 percentage points and receivables rose 133%.',
      passed: wordCount(teamContribution) >= 15,
      status: wordCount(teamContribution) >= 15 ? 'passed' : wordCount(teamContribution) > 0 ? 'warning' : 'pending',
      studentValue: wordCount(teamContribution) > 0 ? `${wordCount(teamContribution)} words` : 'Unanswered',
      expectedRequirement: 'Explain the working capital and unit profitability risk behind uncollected revenue expansion.',
      actionTab: 'Team',
      actionLabel: 'Record Defense',
    },
    {
      id: 's09-t2-anti-speculation-standard',
      title: 'Fact vs. Assumption Integrity Standard',
      description: 'Commit to never inferring unproven cost causes (e.g. discounting) without audit evidence.',
      passed: wordCount(teamJudgement) >= 10 || wordCount(executiveBriefing) >= 15,
      status: (wordCount(teamJudgement) >= 10 || wordCount(executiveBriefing) >= 15) ? 'passed' : 'pending',
      studentValue: 'Documented',
      expectedRequirement: 'State that financial professionals separate observed ratios from unproven causal speculations.',
      actionTab: 'Team',
      actionLabel: 'Record Standard',
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
      summary = 'Not yet attempted. Calculate KPIs and document management findings.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} calculation variance${failedCount > 1 ? 's' : ''} detected. Review feedback below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} checks verified against Case D performance benchmarks.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults = {
    Overview: compileStage('Overview', 'Finance Mission & Outcome', overviewChecks),
    Learn: compileStage('Learn', 'Ratio Analysis & Margin Principles', learnChecks),
    Case: compileStage('Case', 'Case D Three-Month MIS Facts', caseChecks),
    Work: compileStage('Work', 'Performance Matrix & Management Findings', workChecks),
    Team: compileStage('Team', 'Squad Defense & Fact vs. Assumption Standard', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No finance activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: KPI calculation errors or missing findings detected.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Practice in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'Financial Performance Analysis Schedule and Management Findings Report fully verified!';
  }

  const recommendations: string[] = [];
  if (!isGPCorrect) {
    recommendations.push('Recheck Gross Profit: July ₹60,000; August ₹66,000; September ₹75,000.');
  }
  if (!isMarginsCorrect) {
    recommendations.push('Recheck Margins: Gross Margins are 60.0%, 55.0%, 50.0%; Operating Margins are 25.0%, 22.5%, 20.0%.');
  }
  if (!isGrowthCorrect) {
    recommendations.push('Recheck MoM Growth: Revenue grew +25.0% and Operating Profit grew +11.1%.');
  }

  return {
    sessionId: 9,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}

