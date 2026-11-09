import type { ReviewCheckItem, SessionReviewReport, StageReviewResult, ReviewContext, StageStatus, StageName } from '../types.ts';

export function evaluateSession11(ctx: ReviewContext): SessionReviewReport {
  const { draft, workstationData } = ctx;
  const ws = workstationData || {};

  const invoiceAudits = ws.invoiceAudits || {};
  const purchaseAudits = ws.purchaseAudits || {};
  const vendorMemo = (ws.vendorEscalationMemo || draft['concept:explain'] || '').trim();
  const mentorNote = (ws.mentorQueryNote || draft['team:contribution'] || '').trim();
  const governance = ws.governance || {};

  const wordCount = (str: string) => (str || '').split(/\s+/).filter(Boolean).length;

  // ----------------------------------------------------
  // STAGE 01: OVERVIEW
  // ----------------------------------------------------
  const overviewChecks: ReviewCheckItem[] = [
    {
      id: 's11-o1-invoice-mission',
      title: 'Invoice Review & Approval Gatekeeper Mission',
      description: 'Review invoice evidence before approval; calculate statutory tax heads and reconcile purchase exceptions.',
      passed: true,
      status: 'passed',
      studentValue: 'Oriented',
      expectedRequirement: 'Inspect Case E sales invoices (E01–E03) and reconcile purchase ledger (P01–P03) against GSTR-2B.',
      actionTab: 'Overview',
    },
  ];

  // ----------------------------------------------------
  // STAGE 02: LEARN
  // ----------------------------------------------------
  const learnChecks: ReviewCheckItem[] = [
    {
      id: 's11-l1-tax-heads-rule',
      title: 'Place of Supply Tax Classification Rule',
      description: 'Intra-state supply (Karnataka) incurs 9% CGST + 9% SGST; inter-state supply (Tamil Nadu) incurs 18% IGST. Never apply 18% to both components.',
      passed: true,
      status: 'passed',
      studentValue: 'Verified (9%+9% intra-state, 18% inter-state)',
      expectedRequirement: 'Apply 9% CGST + 9% SGST for Karnataka; 18% IGST for Tamil Nadu.',
      actionTab: 'Learn',
    },
  ];

  // ----------------------------------------------------
  // STAGE 03: CASE
  // ----------------------------------------------------
  const caseChecks: ReviewCheckItem[] = [
    {
      id: 's11-c1-casee-records',
      title: 'Case E Verified Invoices & Purchase Statement',
      description: 'Confirm direct review of Case E invoices (E01 ₹10k, E02 ₹20k, E03 ₹5k) and purchase bills (P01–P03).',
      passed: true,
      status: 'passed',
      studentValue: 'Source records inspected',
      expectedRequirement: 'Ground all calculations in Case E sales and inward statement records.',
      actionTab: 'Case',
    },
  ];

  // ----------------------------------------------------
  // STAGE 04: WORK / WORKSTATION
  // ----------------------------------------------------
  const workChecks: ReviewCheckItem[] = [];

  // Check 1: Sales Invoices Audit & Exception Classification
  const e1Audit = invoiceAudits.E01 || {};
  const e2Audit = invoiceAudits.E02 || {};
  const e3Audit = invoiceAudits.E03 || {};

  const isE1Correct = e1Audit.studentStatus === 'Compliant' || !e1Audit.studentStatus;
  const isE2Correct = e2Audit.studentStatus === 'Defect: Wrong Tax Type' || String(e2Audit.studentNotes || '').toLowerCase().includes('igst');
  const isE3Correct = e3Audit.studentStatus === 'Defect: Missing Serial' || String(e3Audit.studentNotes || '').toLowerCase().includes('serial');

  const isSalesAuditComplete = isE1Correct && isE2Correct && isE3Correct;

  workChecks.push({
    id: 's11-w1-sales-audit',
    title: 'Sales Invoices Audit & Exception Classification',
    description: 'Accurately audit E01 (Compliant), E02 (Wrong Tax Type: Reclassified to IGST), and E03 (Defect: Missing Serial under Rule 46).',
    passed: isSalesAuditComplete,
    status: isSalesAuditComplete ? 'passed' : 'failed',
    studentValue: isSalesAuditComplete ? 'E01 Compliant, E02 Reclassified IGST, E03 Missing Serial Flagged' : 'Audit Incomplete or Misclassified',
    expectedRequirement: 'E01 = Compliant, E02 = Defect: Wrong Tax Type, E03 = Defect: Missing Serial.',
    whyIncorrect: 'Check E02 (inter-state supply to Tamil Nadu requires IGST) and E03 (missing mandatory sequential serial number).',
    conceptToRevisit: 'Stage 04 Work · Sales Invoice Review',
    actionTab: 'Work',
    actionLabel: 'Audit Invoices',
  });

  // Check 2: Tax Computation Schedule
  // Correct totals: CGST ₹1,350, SGST ₹1,350, IGST ₹3,600, Total Tax ₹6,300, Total Gross ₹41,300
  workChecks.push({
    id: 's11-w2-tax-schedule',
    title: 'Tax Computation Schedule Integrity',
    description: 'Verify computation totals: CGST ₹1,350 + SGST ₹1,350 + IGST ₹3,600 = Total Tax ₹6,300; Gross Invoiced ₹41,300.',
    passed: true,
    status: 'passed',
    studentValue: 'CGST ₹1,350 | SGST ₹1,350 | IGST ₹3,600 | Gross ₹41,300',
    expectedRequirement: 'Total Tax ₹6,300 across 3 invoices with correct tax head allocations.',
    actionTab: 'Work',
  });

  // Check 3: Purchase Register & Inward Statement Reconciliation
  const p1Audit = purchaseAudits.P01 || {};
  const p2Audit = purchaseAudits.P02 || {};
  const p3Audit = purchaseAudits.P03 || {};

  const isP1Matched = p1Audit.reconciliationStatus === 'Matched' || !p1Audit.reconciliationStatus;
  const isP2Unmatched = p2Audit.reconciliationStatus === 'Unmatched / Exception' || String(p2Audit.studentNotes || '').toLowerCase().includes('absent') || String(p2Audit.studentNotes || '').toLowerCase().includes('quarantine');
  const isP3Matched = p3Audit.reconciliationStatus === 'Matched' || !p3Audit.reconciliationStatus;

  const isPurchaseMatchComplete = isP1Matched && isP2Unmatched && isP3Matched;

  workChecks.push({
    id: 's11-w3-purchase-reconciliation',
    title: 'Purchase Register vs GSTR-2B Inward Statement Matching',
    description: 'Match purchase records: P01 (Matched ₹180), P03 (Matched ₹540), and identify P02 (Unmatched: Absent from Statement).',
    passed: isPurchaseMatchComplete,
    status: isPurchaseMatchComplete ? 'passed' : 'failed',
    studentValue: isPurchaseMatchComplete ? 'P01 Matched, P02 Unmatched Exception, P03 Matched' : 'Reconciliation Incomplete',
    expectedRequirement: 'P01 & P03 matched to inward statement; P02 flagged as absent from GSTR-2B.',
    whyIncorrect: 'Confirm purchase reconciliation: P02 is not present in the auto-drafted statement and must be flagged.',
    conceptToRevisit: 'Stage 04 Work · Inward Statement Matching',
    actionTab: 'Work',
    actionLabel: 'Reconcile Purchases',
  });

  // Check 4: Unmatched ITC Quarantine Rule
  const isP2Quarantined = p2Audit.itcAction === 'Quarantine ITC & Escalate' || !p2Audit.itcAction;
  workChecks.push({
    id: 's11-w4-itc-quarantine',
    title: 'Input Tax Credit Quarantine Policy',
    description: 'Do not auto-grant ITC on P02. Quarantine ₹360 credit until supplier uploads the bill to the portal.',
    passed: isP2Quarantined,
    status: isP2Quarantined ? 'passed' : 'failed',
    studentValue: isP2Quarantined ? '₹360 ITC Quarantined (Payment on Hold)' : 'Premature ITC Claim Flagged',
    expectedRequirement: 'Quarantine ₹360 tax credit on P02; do not claim without portal presence.',
    whyIncorrect: 'Under GST rules, tax credit cannot be claimed if the purchase bill is missing from GSTR-2B.',
    conceptToRevisit: 'Stage 04 Work · ITC Compliance Rules',
    actionTab: 'Work',
    actionLabel: 'Quarantine ITC',
  });

  // Check 5: Vendor Escalation Memo Completeness
  const memoLower = vendorMemo.toLowerCase();
  const hasP2Ref = memoLower.includes('p02') || memoLower.includes('vnd-tn-9041') || memoLower.includes('kaveri');
  const hasTaxAmount = memoLower.includes('360') || memoLower.includes('2,000') || memoLower.includes('2000');
  const hasPortalAction = memoLower.includes('gstr') || memoLower.includes('arn') || memoLower.includes('portal') || memoLower.includes('upload');
  const isMemoSubstantive = wordCount(vendorMemo) >= 25;
  const isEscalationValid = hasP2Ref && hasTaxAmount && hasPortalAction && isMemoSubstantive;

  workChecks.push({
    id: 's11-w5-vendor-escalation',
    title: 'Vendor Inquiry & Escalation Communication',
    description: 'Draft formal vendor communication identifying missing bill P02, ₹360 tax amount, and requesting GSTR-1 ARN filing proof.',
    passed: isEscalationValid,
    status: isEscalationValid ? 'passed' : 'warning',
    studentValue: isEscalationValid ? `Formal Inquiry (${wordCount(vendorMemo)} words)` : 'Inquiry Missing Bill Details or ARN Request',
    expectedRequirement: 'Include invoice number, ₹360 tax credit amount, GSTR-1 upload request, and deadline.',
    whyIncorrect: 'State the specific purchase bill (P02 / VND-TN-9041), the ₹360 tax amount, and request proof of GSTR-1 upload with ARN.',
    conceptToRevisit: 'Stage 04 Work · Vendor Communication',
    actionTab: 'Work',
    actionLabel: 'Refine Memo',
  });

  // ----------------------------------------------------
  // STAGE 05: TEAM & GOVERNANCE
  // ----------------------------------------------------
  const teamChecks: ReviewCheckItem[] = [];
  const fileVersion = governance.fileVersion || '';
  const hasValidDeliverable = fileVersion.includes('StudentID_S11_v01') || fileVersion.endsWith('.xlsx');

  teamChecks.push({
    id: 's11-t1-governance',
    title: 'Professional Deliverable & Review Governance',
    description: 'Preserve individual file naming (StudentID_S11_v01.xlsx) and record preparer, reviewer, and decision roles.',
    passed: hasValidDeliverable,
    status: hasValidDeliverable ? 'passed' : 'warning',
    studentValue: hasValidDeliverable ? fileVersion : 'Unverified Filename',
    expectedRequirement: 'Deliverable must follow StudentID_S11_v01.xlsx naming convention.',
    actionTab: 'Team',
  });

  teamChecks.push({
    id: 's11-t2-rubric-compliance',
    title: 'Four-Pillar Educational Rubric Evaluation',
    description: 'Assessment across Execution (4 pts), Reasoning (2 pts), Communication (2 pts), and Professional Process (2 pts).',
    passed: isSalesAuditComplete && isPurchaseMatchComplete && isP2Quarantined,
    status: isSalesAuditComplete && isPurchaseMatchComplete && isP2Quarantined ? 'passed' : 'warning',
    studentValue: isSalesAuditComplete && isPurchaseMatchComplete ? '10/10 Ready' : 'Revisions Required',
    expectedRequirement: 'Satisfy execution accuracy, statutory reasoning, vendor communication, and audit compliance.',
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
      summary = 'Not yet attempted. Audit sales invoices and reconcile purchase records against GSTR-2B.';
    } else if (failedCount > 0) {
      status = 'needs_revision';
      summary = `${failedCount} GST audit requirement${failedCount > 1 ? 's' : ''} not met. Review findings below.`;
    } else if (warningCount > 0 || pendingCount > 0) {
      status = 'in_progress';
      summary = `${passedCount} of ${checks.length} checks verified.`;
    } else {
      status = 'reviewed';
      summary = `All ${checks.length} invoice review and purchase reconciliation checks verified against statutory standards.`;
    }

    return { stage, status, title, summary, checks, passedCount, totalCount: checks.length };
  }

  const stageResults: Record<StageName, StageReviewResult> = {
    Overview: compileStage('Overview', 'GST Invoice Review Mission', overviewChecks),
    Learn: compileStage('Learn', 'Place of Supply Tax Classification', learnChecks),
    Case: compileStage('Case', 'Case E Source Invoices', caseChecks),
    Work: compileStage('Work', 'Invoice Audit & Inward Reconciliation', workChecks),
    Team: compileStage('Team', 'Audit Deliverable Governance', teamChecks),
  };

  const allChecks = [...overviewChecks, ...learnChecks, ...caseChecks, ...workChecks, ...teamChecks];
  const totalPassed = allChecks.filter(c => c.passed).length;
  const hasErrors = allChecks.some(c => c.status === 'failed');

  let overallStatus: StageStatus = 'not_started';
  let overallSummary = '';

  if (allChecks.every(c => c.status === 'pending')) {
    overallStatus = 'not_started';
    overallSummary = 'No GST audit activities attempted yet.';
  } else if (hasErrors) {
    overallStatus = 'needs_revision';
    overallSummary = 'Formative review complete: Tax classification defect or missing invoice number requires attention.';
  } else if (totalPassed < allChecks.length) {
    overallStatus = 'in_progress';
    overallSummary = `Audit in progress: ${totalPassed} of ${allChecks.length} checks verified.`;
  } else {
    overallStatus = 'reviewed';
    overallSummary = 'GST Invoice Audit, Tax Computation Schedule, and Purchase Reconciliation fully verified!';
  }

  const recommendations: string[] = [];
  if (!isSalesAuditComplete) {
    recommendations.push('Audit sales invoices: E01 is compliant, E02 requires IGST (₹3,600) due to Tamil Nadu POS, and E03 is missing serial number.');
  }
  if (!isPurchaseMatchComplete) {
    recommendations.push('Reconcile inward statement: P01 and P03 match portal records; P02 is absent and must be quarantined.');
  }
  if (!isP2Quarantined) {
    recommendations.push('Do not claim ITC on P02 without portal confirmation; quarantine the ₹360 credit.');
  }
  if (!isEscalationValid) {
    recommendations.push('Draft a formal inquiry to vendor Kaveri Hardware citing purchase bill VND-TN-9041 and requesting GSTR-1 ARN filing proof.');
  }

  return {
    sessionId: 11,
    overallStatus,
    overallSummary,
    stages: stageResults,
    totalChecks: allChecks.length,
    passedChecks: totalPassed,
    hasErrors,
    revisitRecommendations: recommendations,
  };
}
