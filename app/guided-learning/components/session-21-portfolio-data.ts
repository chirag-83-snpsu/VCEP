'use client';

export const SESSION_21_STORAGE_KEY = 'vcep:s21:portfolio-studio:state';

export type PortfolioCategory =
  | 'Accounting'
  | 'Reconciliation'
  | 'MIS'
  | 'Invoice review'
  | 'AI verification'
  | 'Capstone';

export interface PortfolioArtifact {
  id: string; // e.g. 'VCEP-ART-S06'
  session: string; // 'Session 06'
  category: PortfolioCategory;
  title: string;
  deliverableFile: string;
  evidenceMetric: string;
  verificationHash: string;
  studentContribution: string;
  status: 'Verified Authorized';
  visibility: 'Public Portfolio' | 'Restricted / Faculty Only';
  ownership: string; // 'Current Student (Verified ID)'
}

export interface ResumeBullet {
  id: string; // 'B1', 'B2', 'B3'
  domain: string;
  contextTag: string; // '[Simulated Project]'
  xAccomplished: string;
  yMeasured: string;
  zMethod: string;
  fullText: string;
  evidenceRef: string; // e.g. 'VCEP-ART-S20'
  isSimulatedFlagged: boolean;
  status: 'AUTHENTIC' | 'INFLATED';
  inflationReason?: string;
}

export interface RecruiterChallenge {
  selectedClaimId: string;
  claimTitle: string;
  calculationProof: string;
  workLogEvidence: string;
  targetRole: string;
  skillGapIdentified: string;
  nextPracticeTask: string;
  timeRemainingSeconds: number;
  challengeCompleted: boolean;
}

export interface Session21State {
  bullets: ResumeBullet[];
  portfolio: PortfolioArtifact[];
  summaryText: string;
  targetRole: string;
  selectedCategory: PortfolioCategory | 'All';
  recruiterChallenge: RecruiterChallenge;
  studentContribution: string;
  reviewerCorrection: string;
  governance: {
    preparerName: string;
    reviewerName: string;
    decisionOwner: string;
    auditStatus: string;
    fileVersion: string;
  };
  checklist: boolean[];
  timestamp?: string;
}

export const AUTHORIZED_STUDENT_ARTIFACTS: PortfolioArtifact[] = [
  {
    id: 'VCEP-ART-S06',
    session: 'Session 06',
    category: 'Accounting',
    title: 'Month-End Close & Corrected Trial Balance',
    deliverableFile: 'StudentID_S06_v01.xlsx',
    evidenceMetric: '₹2,18,000 balanced trial balance; ₹53,500 net profit; 4-entry correction journal',
    verificationHash: 'SHA-S06-TB-218K-BALANCED',
    studentContribution: 'Authored double-entry adjusting journals for unrecorded depreciation and accrued utility liabilities; eliminated suspense account with zero cross-foot variance.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
  {
    id: 'VCEP-ART-S08',
    session: 'Session 08',
    category: 'Reconciliation',
    title: 'Three-Column Bank Reconciliation Statement (BRS)',
    deliverableFile: 'StudentID_S08_v01.xlsx',
    evidenceMetric: '₹87,200 Bank Statement ↔ ₹83,200 Adjusted Cash; ₹0.00 unexplained difference',
    verificationHash: 'SHA-S08-BRS-83.2K-VERIFIED',
    studentContribution: 'Constructed three-column reconciliation bridge isolating ₹6,000 uncredited deposits and ₹10,000 unpresented cheques; updated cash book with direct debits.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
  {
    id: 'VCEP-ART-S10',
    session: 'Session 10',
    category: 'MIS',
    title: 'Executive MIS Financial Performance Dashboard',
    deliverableFile: 'StudentID_S10_v01.xlsx',
    evidenceMetric: '₹1,50,000 quarterly revenue; 20.0% operating margin; 4 KPIs with 1-page memo',
    verificationHash: 'SHA-S10-MIS-DASH-150K',
    studentContribution: 'Engineered dynamic KPI summary matrix with automated sensitivity test and drafted 140-word board memo identifying gross margin compression.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
  {
    id: 'VCEP-ART-S11',
    session: 'Session 11',
    category: 'Invoice review',
    title: 'GST Tax Invoice & GSTR-2B Matching Register',
    deliverableFile: 'StudentID_S11_v01.xlsx',
    evidenceMetric: '₹20,000 matched eligible ITC; ₹5,000 ineligible tax quarantined; 3 invoices matched',
    verificationHash: 'SHA-S11-GST-ITC-MATCHED',
    studentContribution: 'Audited tax invoice compliance across 16 statutory fields; matched purchase register against GSTR-2B and segregated non-compliant supplier claims into quarantine.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
  {
    id: 'VCEP-ART-S14',
    session: 'Session 14',
    category: 'AI verification',
    title: 'AI Verification Register & Fail-Closed Fault Checkpoint',
    deliverableFile: 'StudentID_S14_v01.docx',
    evidenceMetric: 'Disproved 4 hallucinated commercial claims; built automated halt spreadsheet formula',
    verificationHash: 'SHA-S14-AIV-FAIL-CLOSED',
    studentContribution: 'Constructed 4-claim audit matrix against raw trial balance; caught 5% margin discrepancy in AI draft and coded fail-closed `=IF(ISERROR(...))` spreadsheet guards.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
  {
    id: 'VCEP-ART-S20',
    session: 'Session 20',
    category: 'Capstone',
    title: 'Management Review & Change Control Model v2.0',
    deliverableFile: 'StudentID_S20_v01.xlsx',
    evidenceMetric: '₹95,000 receivables; ₹5,000 credit note (₹0 cash); 7-day deficit cut from ₹20k to ₹12k',
    verificationHash: 'SHA-S20-CCB-MODEL-V2',
    studentContribution: 'Branched Model v2.0 from frozen v1.0 baseline; implemented ₹5,000 credit note dispute release with invariant ₹25k bank cash and rescheduled ₹8k supplier outflows.',
    status: 'Verified Authorized',
    visibility: 'Public Portfolio',
    ownership: 'Current Student (Verified ID)',
  },
];

export const INITIAL_RESUME_BULLETS: ResumeBullet[] = [
  {
    id: 'B1',
    domain: 'Financial Modeling & Working Capital',
    contextTag: '[Simulated Project]',
    xAccomplished: 'Engineered a 4-account receivables ageing model and 7-day liquidity forecast',
    yMeasured: 'reconciling ₹1,00,000 in overdue invoices and contracting a ₹20,000 cash deficit to ₹12,000',
    zMethod: 'by applying ISO date boundary rules, credit note adjustments, and vendor payment rescheduling',
    fullText:
      '[Simulated Project] Engineered a 4-account receivables ageing model reconciling ₹1,00,000 in overdue invoices with zero variance, and structured a 7-day liquidity forecast contracting a ₹20,000 deficit to ₹12,000 via vendor payment rescheduling.',
    evidenceRef: 'VCEP-ART-S20',
    isSimulatedFlagged: true,
    status: 'AUTHENTIC',
  },
  {
    id: 'B2',
    domain: 'Statutory Accounting & Forensic Audit',
    contextTag: '[Simulated Project]',
    xAccomplished: 'Structured multi-source accounting reconciliations across general ledger, bank, and GST returns',
    yMeasured: 'reconciling ₹44,000 in transactions, ₹83,200 adjusted cash, and ₹20,000 in eligible input tax credit',
    zMethod: 'by building three-column BRS bridges, statutory 16-point invoice checklists, and GSTR-2B quarantine schedules',
    fullText:
      '[Simulated Project] Structured multi-source accounting reconciliations across general ledger, bank, and GST returns, verifying ₹83,200 adjusted bank cash with zero variance and quarantining ₹5,000 in ineligible input tax credit.',
    evidenceRef: 'VCEP-ART-S08',
    isSimulatedFlagged: true,
    status: 'AUTHENTIC',
  },
  {
    id: 'B3',
    domain: 'Responsible AI Auditing & Quality Assurance',
    contextTag: '[Simulated Project]',
    xAccomplished: 'Audited enterprise AI financial summaries and commercial models under DPDP standards',
    yMeasured: 'disproving 4 hallucinated numerical claims including a 5% margin discrepancy across 100% of test cases',
    zMethod: 'by designing structured 6-part prompts, fail-closed formula halt rules, and 5 automated regression tests',
    fullText:
      '[Simulated Project] Audited generative AI commercial models under DPDP standards, catching 4 numerical hallucinations including a 5% margin discrepancy and engineering automated fail-closed spreadsheet controls.',
    evidenceRef: 'VCEP-ART-S14',
    isSimulatedFlagged: true,
    status: 'AUTHENTIC',
  },
];

export const DEFAULT_PROFESSIONAL_SUMMARY =
  'Commerce and finance professional specializing in financial modeling, statutory accounting compliance, and enterprise AI auditing through rigorous simulation projects. Independently reconciled ₹1,00,000 in receivables schedules with zero variance, structured three-column bank reconciliations with timing bridges, and governed project scope within disciplined deadlines. Adept at auditing generative AI outputs under DPDP standards, constructing fail-closed spreadsheet controls, and translating complex financial data into executive management updates. Seeking a Junior Financial Analyst or Compliance Associate role to deploy verified analytical rigor in corporate operations.';

export const INITIAL_RECRUITER_CHALLENGE: RecruiterChallenge = {
  selectedClaimId: 'B1',
  claimTitle: 'Case F Receivables Ageing & 7-Day Liquidity Model (Session 20)',
  calculationProof:
    'Mathematical Proof: Total Receivables = =SUM(D2:D5) = ₹95,000 across 4 accounts after ₹5,000 credit note. Cash Deficit: ₹25,000 opening cash - ₹37,000 7-day outflows (after ₹8,000 supplier deferral) = -₹12,000 deficit (shrunk by ₹8,000). Non-Cash Invariance: Bank cash remains strictly invariant at ₹25,000 because credit notes extinguish debt without generating bank cash.',
  workLogEvidence:
    'Workbook Evidence: StudentID_S20_v01.xlsx sheet "Model v2.0", cells D2:D5 and cash waterfall rows 18-24. Hash SHA-S20-CCB-MODEL-V2 verified by QA Lead on 31 Oct 2026.',
  targetRole: 'Junior Financial Analyst / Credit & Working Capital Specialist',
  skillGapIdentified:
    'Advanced three-statement DCF financial modeling and automated PowerQuery ETL pipeline integration for multi-currency group consolidations.',
  nextPracticeTask:
    'Construct a dynamic three-statement corporate forecasting model linking income statement, balance sheet, and debt sweep cash waterfall in Excel.',
  timeRemainingSeconds: 45,
  challengeCompleted: true,
};

export const DEFAULT_STUDENT_CONTRIBUTION =
  'Curated and indexed 6 authentic VCEP project artifacts covering accounting, reconciliation, MIS, GST audit, AI governance, and capstone change control. Authored 3 high-impact Google XYZ resume bullets explicitly identifying the simulated project context to prevent misrepresentation. Completed the 45-second recruiter calculation audit and drafted a 90-word professional profile.';

export const DEFAULT_REVIEWER_CORRECTION =
  'Before Review Defect: Preliminary draft initially claimed "Improved company profit by 40% and managed corporate client accounts", which misrepresented academic simulation as live employment and lacked verification evidence. Peer Reviewer Correction: Flagged as severe resume inflation; restructured into an authentic Google XYZ bullet highlighting the ₹1,00,000 receivables reconciliation model, clearly prefaced with [Simulated Project] and verified by artifact VCEP-ART-S20.';

export const INITIAL_CHECKLIST_LABELS = [
  'I avoided inflated or unverified claims such as "boosted company profit 40%".',
  'I formatted all 3 resume bullets using the Google XYZ formula (Accomplished [X] measured by [Y] by doing [Z]).',
  'I explicitly identified the simulated / academic project context in every resume bullet.',
  'I compiled a six-artifact verifiable portfolio index linking authentic VCEP project outputs with hashes.',
  'I restricted my portfolio index strictly to my own verified artifacts and never linked another student’s work.',
  'I maintained my professional executive summary within the 75–100 word target (~90 words).',
  'I completed the 45-second recruiter defense challenge, presenting the exact mathematical proof and work log.',
  'I identified one clear technical skill gap for my target role and defined a concrete next practice task.',
];

export const S21_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate required output: 3 XYZ bullets, 6-item portfolio index, 90-word summary, and recruiter proof.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Applies Google XYZ framework without inflation; identifies simulated context; articulates skill gap and next practice task.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'High-impact professional action verbs, quantitative metrics, precise financial terminology, and concise 90-word profile.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Every resume bullet links to an authorized student artifact hash; 3-tier governance signoff and peer defect correction.',
  },
];

export const DEFAULT_SESSION_21_STATE: Session21State = {
  bullets: INITIAL_RESUME_BULLETS,
  portfolio: AUTHORIZED_STUDENT_ARTIFACTS,
  summaryText: DEFAULT_PROFESSIONAL_SUMMARY,
  targetRole: 'Junior Financial Analyst / Commercial Operations Associate',
  selectedCategory: 'All',
  recruiterChallenge: INITIAL_RECRUITER_CHALLENGE,
  studentContribution: DEFAULT_STUDENT_CONTRIBUTION,
  reviewerCorrection: DEFAULT_REVIEWER_CORRECTION,
  governance: {
    preparerName: 'Candidate (Financial Analyst Trainee)',
    reviewerName: 'Peer Recruiter (QA Lead)',
    decisionOwner: 'Hiring Manager (Placement Director)',
    auditStatus: 'Verified PASS (Ready for Corporate Portfolio Handover)',
    fileVersion: 'StudentID_S21_v01.docx',
  },
  checklist: [true, true, true, true, true, true, true, true],
};

