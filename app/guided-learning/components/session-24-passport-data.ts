// Session 24 Data Layer — Corporate Demo Day and Industry Passport
// Authorised VCEP Curriculum: S24_Corporate_Demo_Day_and_Industry_Passport.docx & drive-edition-3.json

export type RunOfShowItem = {
  id: string;
  timeRange: string;
  activityName: string;
  participants: string;
  formatNotes: string;
};

export type ApprovedExhibit = {
  id: string;
  artifactId: string;
  title: string;
  curriculumSession: string;
  keyMetric: string;
  fileLink: string;
};

export type ArtifactDefense = {
  assignedArtifactId: string;
  artifactTitle: string;
  personalContribution: string;
  defectCorrectionHistory: string;
  technicalMethodology: string;
  scopeLimitations: string;
};

export type PassportCompetency = {
  id: string;
  domain: string;
  title: string;
  verifiedArtifactId: string;
  demonstratedProof: string;
  facultyEvaluationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  certifiedDate: string;
};

export type CareerMilestone90Day = {
  id: string;
  horizon: string;
  actionTitle: string;
  actionPlan: string;
  evidenceOfProgress: string;
  targetDueDate: string;
};

export type JudgeScorecardDimension = {
  id: string;
  dimension: 'Execution' | 'Reasoning' | 'Communication' | 'Professional Process';
  maxMarks: number;
  awardedMarks: number;
  judgeComment: string;
};

export type Session24Governance = {
  preparerName: string;
  reviewerName: string;
  decisionOwner: string;
  fileVersion: string;
  humanAcknowledged: boolean;
};

export type Session24State = {
  runOfShow: RunOfShowItem[];
  exhibits: ApprovedExhibit[];
  defense: ArtifactDefense;
  passport: PassportCompetency[];
  careerPlan: CareerMilestone90Day[];
  scorecard: JudgeScorecardDimension[];
  conflictCheckCertified: boolean;
  studentContribution: string;
  reviewerCorrection: string;
  governance: Session24Governance;
  checklistIndices: number[];
  timestamp?: string;
};

export const INITIAL_RUN_OF_SHOW: RunOfShowItem[] = [
  {
    id: 'ROS-01',
    timeRange: '09:00 – 09:15',
    activityName: 'Panel Briefing & Conflict-of-Interest Sign-off',
    participants: 'External Industry Evaluators & Faculty QA Leads',
    formatNotes: 'Briefing on 10-point rubric; judges certify absence of bias or reporting conflicts.',
  },
  {
    id: 'ROS-02',
    timeRange: '09:15 – 10:30',
    activityName: 'Squad Capstone Executive Briefings',
    participants: 'Corporate Squads & Executive Board Panel',
    formatNotes: 'Strict 7-minute squad presentation with 3-minute live working demonstration inside.',
  },
  {
    id: 'ROS-03',
    timeRange: '10:30 – 11:30',
    activityName: 'Individual 2-Minute Artifact-Defense Stations',
    participants: 'Individual Candidates & Industry Evaluators',
    formatNotes: 'Each candidate defends personal contributions, formula mechanics, and limitations on assigned artifact.',
  },
  {
    id: 'ROS-04',
    timeRange: '11:30 – 12:00',
    activityName: 'Independent Scoring & Official Score Aggregation',
    participants: 'External Judges & Faculty Coordinator',
    formatNotes: 'Judges score independently before panel discussion; scores aggregated against 10-point rubric.',
  },
  {
    id: 'ROS-05',
    timeRange: '12:00 – 12:15',
    activityName: 'Industry Passport Verification & Credential Sign-off',
    participants: 'Candidate, Faculty Lead & Managing Director',
    formatNotes: 'Reviewer verifies artifact links and 90-day plan; candidate signs credential acknowledgement.',
  },
];

export const INITIAL_EXHIBITS: ApprovedExhibit[] = [
  {
    id: 'EX-01',
    artifactId: 'VCEP-ART-S18',
    title: 'Capstone Project Charter & Scope Work Breakdown (WBS)',
    curriculumSession: 'Session 18: Solution Design and Project Planning',
    keyMetric: '10-Day Delivery Schedule / 6.0h Extra Student Work Cap',
    fileLink: 'StudentID_S18_v01.xlsx',
  },
  {
    id: 'EX-02',
    artifactId: 'VCEP-ART-S19',
    title: 'Model v1.0 Prototype & 5 Executed QA Test Logs',
    curriculumSession: 'Session 19: Project Execution and Quality Assurance',
    keyMetric: '5 Verified Regression Tests / Zero Exception Leakage',
    fileLink: 'StudentID_S19_v01.xlsx',
  },
  {
    id: 'EX-03',
    artifactId: 'VCEP-ART-S20',
    title: 'Model v2.0 Change Control Board Log & Liquidity Bridge',
    curriculumSession: 'Session 20: Management Review and Change Control',
    keyMetric: '₹95,000 Receivables / -₹12,000 Deficit / ₹25k Invariant Cash',
    fileLink: 'StudentID_S20_v01.xlsx',
  },
  {
    id: 'EX-04',
    artifactId: 'VCEP-ART-S22',
    title: 'Exit B Controlled Assessment & Viva Voce Defense Dossier',
    curriculumSession: 'Session 22: Hiring Simulation and Exit Assessment',
    keyMetric: '60m Timed Independent Execution / ICAI Suspense Defense',
    fileLink: 'StudentID_S22_v01.docx',
  },
  {
    id: 'EX-05',
    artifactId: 'VCEP-ART-S23',
    title: 'Six-Slide Executive Deck & One-Page Briefing Summary',
    curriculumSession: 'Session 23: Corporate Presentation Preparation',
    keyMetric: '7m Pitch / 3m Live Demo / 10% Discount Trap Counter-Proposal',
    fileLink: 'StudentID_S23_v01.pptx',
  },
];

export const INITIAL_DEFENSE: ArtifactDefense = {
  assignedArtifactId: 'VCEP-ART-S20',
  artifactTitle: 'Case F Model v2.0 Change Control Board Log & Dynamic Liquidity Forecast',
  personalContribution:
    'Independently engineered the dynamic receivables aging schedule and 7-day liquidity forecast in Model v2.0. Implemented Change Order CR-01 (₹5,000 credit note on Beacon F02) and Change Order CR-02 (₹8,000 supplier deferral), verifying zero unexplained variance.',
  defectCorrectionHistory:
    'Before Defense Defect: Preliminary draft improperly credited bank cash for the ₹5,000 credit note, inflating opening cash to ₹30,000. Peer Reviewer Correction: Interviewer challenged non-cash debt accounting; I corrected double-entry journals to debit Sales Returns and credit Accounts Receivable without touching cash ledger account 1010.',
  technicalMethodology:
    'Applied ISO date boundary formulas (=MAX(0, AsOfDate - DueDate)) across four accounts to dynamically categorize receivables into Current, 1–30, 31–60, and 61–90+ days overdue. Modeled weekly cash waterfall showing mandatory outflows compressed to ₹37,000, deficit narrowed to -₹12,000, and opening bank cash strictly invariant at ₹25,000.',
  scopeLimitations:
    'Case F receivables invoices and Case G CRM marketing inquiries share no relational foreign key; combining them violates audit integrity. The model does not auto-execute banking sweeps and requires supervised human oversight under the approved 6.0-hour individual work cap.',
};

export const INITIAL_PASSPORT_COMPETENCIES: PassportCompetency[] = [
  {
    id: 'PASSPORT-01',
    domain: 'Finance execution',
    title: 'Working Capital Modeling & Receivables Reconciliation',
    verifiedArtifactId: 'VCEP-ART-S07 & VCEP-ART-S20',
    demonstratedProof:
      'Reconciled ₹1,00,000 baseline receivables to ₹95,000 post-credit note with zero variance; proved mathematical invariance of ₹25,000 opening bank cash.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
  {
    id: 'PASSPORT-02',
    domain: 'Business technology',
    title: 'Dynamic Spreadsheet Engineering & Financial Automation',
    verifiedArtifactId: 'VCEP-ART-S10 & VCEP-ART-S19',
    demonstratedProof:
      'Constructed dynamic date sensitivity formulas (=MAX(0, AsOfDate-DueDate)) refreshing aging schedules automatically; executed 5 QA regression test suites.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
  {
    id: 'PASSPORT-03',
    domain: 'Business judgement',
    title: 'Commercial Break-Even & Unit Economics Analysis',
    verifiedArtifactId: 'VCEP-ART-S16 & VCEP-ART-S23',
    demonstratedProof:
      'Proved mathematically that granting a 10% discount on 30 seats generates ₹0 incremental profit while exhausting 100% capacity; structured tiered counter-proposal.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
  {
    id: 'PASSPORT-04',
    domain: 'AI verification',
    title: 'Responsible AI Auditing & Data Minimization (DPDP Act)',
    verifiedArtifactId: 'VCEP-ART-S13 & VCEP-ART-S14',
    demonstratedProof:
      'Executed four-point data minimization sanitization under DPDP Act; established fail-closed stopping conditions preventing unverified AI hallucination propagation.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
  {
    id: 'PASSPORT-05',
    domain: 'Communication',
    title: 'Executive Presentation & Cross-Examination Defense',
    verifiedArtifactId: 'VCEP-ART-S03 & VCEP-ART-S23',
    demonstratedProof:
      'Delivered 7-minute executive briefing with 3-minute live working demonstration; successfully defended 3 hostile panel questions during 8-minute Q&A.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
  {
    id: 'PASSPORT-06',
    domain: 'Professional practice',
    title: 'Change Control Governance & Audit Trail Integrity',
    verifiedArtifactId: 'VCEP-ART-S18 & VCEP-ART-S20',
    demonstratedProof:
      'Maintained formal Change Control Board register (CR-01 & CR-02); upheld ICAI Code of Ethics by refusing to conceal disputed suspense balances to balance books.',
    facultyEvaluationStatus: 'VERIFIED',
    certifiedDate: '2026-10-31',
  },
];

export const INITIAL_CAREER_PLAN_90_DAY: CareerMilestone90Day[] = [
  {
    id: 'CP-01',
    horizon: 'Day 1–30 (Foundation & Advanced Modeling)',
    actionTitle: 'Advanced Corporate Financial Modeling & PowerQuery ETL',
    actionPlan:
      'Construct a dynamic three-statement corporate forecasting model linking income statement, balance sheet, and debt sweep cash waterfall in Excel with automated PowerQuery data pipelines.',
    evidenceOfProgress: 'Completed 3-statement financial model workbook with sensitivity toggles and verified zero balance sheet variance.',
    targetDueDate: 'Day 30 Post-Graduation',
  },
  {
    id: 'CP-02',
    horizon: 'Day 31–60 (Technical Brand & Thought Leadership)',
    actionTitle: 'Technical Case Study Publication & Industry Recruiter Defense',
    actionPlan:
      'Author and publish two technical case study articles on professional networks documenting the BRS timing bridge and the mathematical proof of the commercial discount trap.',
    evidenceOfProgress: 'Two published technical articles linking directly to verified VCEP artifact SHA hashes and work logs.',
    targetDueDate: 'Day 60 Post-Graduation',
  },
  {
    id: 'CP-03',
    horizon: 'Day 61–90 (Placement Acceleration & Transition)',
    actionTitle: 'Targeted Corporate FP&A Placement & Interview Defense',
    actionPlan:
      'Apply to 5 corporate financial planning and analysis (FP&A) roles, defending the verified Industry Passport competency transcript and live Model v2.0 during technical hiring interviews.',
    evidenceOfProgress: 'Completed 3 technical hiring interviews supported by authenticated Industry Passport credential and faculty references.',
    targetDueDate: 'Day 90 Post-Graduation',
  },
];

export const INITIAL_SCORECARD: JudgeScorecardDimension[] = [
  {
    id: 'SC-01',
    dimension: 'Execution',
    maxMarks: 4,
    awardedMarks: 4,
    judgeComment: 'Flawless 3-minute live demonstration; Model v2.0 recalculated dynamically with zero variance across all aging buckets.',
  },
  {
    id: 'SC-02',
    dimension: 'Reasoning',
    maxMarks: 2,
    awardedMarks: 2,
    judgeComment: 'Exceptional defense of commercial trade-offs and rigorous mathematical proof rejecting the 10% discount trap.',
  },
  {
    id: 'SC-03',
    dimension: 'Communication',
    maxMarks: 2,
    awardedMarks: 2,
    judgeComment: 'Crisp executive slide deck, strict adherence to 7-minute timing, and highly articulate verbal defense.',
  },
  {
    id: 'SC-04',
    dimension: 'Professional Process',
    maxMarks: 2,
    awardedMarks: 2,
    judgeComment: 'Complete audit trail, verified CCB register, and transparent acknowledgment of scope boundaries and 6.0h cap.',
  },
];

export const DEFAULT_STUDENT_CONTRIBUTION =
  'Delivered the 7-minute squad capstone briefing and independently defended Exhibit EX-03 (Model v2.0 Change Control Board Log) during the 2-minute individual defense station. Verified all six Industry Passport competency domains against authenticated VCEP artifact hashes.';

export const DEFAULT_REVIEWER_CORRECTION =
  'Before Defense Defect: Preliminary defense claimed that deferring an ₹8,000 supplier payment decreased balance sheet accounts payable. Peer Reviewer Correction: Faculty lead challenged candidate on liability timing; candidate corrected the defense to articulate that total vendor liabilities remain unchanged while 7-day liquidity contracts by ₹8,000.';

export const INITIAL_CHECKLIST_LABELS = [
  'I presented the reviewed squad capstone project during Demo Day following the official 7-minute run-of-show.',
  'I independently defended my assigned authentic artifact (VCEP-ART-S20) during the 2-minute individual defense station.',
  'I verified that judge scoring was conducted independently before official aggregation against the 10-point rubric.',
  'I audited the Industry Passport transcript ensuring all 6 competencies link strictly to authentic VCEP artifact IDs.',
  'I verified that unverified skills are clearly labeled as unverified with zero inflated or unsupported claims.',
  'I structured a concrete 90-day post-programme career acceleration plan across three structured 30-day milestones.',
  'I completed my individual attributable contribution log and recorded authentic peer reviewer defect corrections.',
  'I signed the mandatory human credential acknowledgement and tracked deliverable file StudentID_S24_v01.pdf.',
];

export const S24_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate Demo Day presentation, working demo, and individual artifact defense.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Explain technical methodology, calculation proofs, scope boundaries, and model limitations.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Clear presentation timing (7m pitch, 2m individual defense), professional verbal clarity, and traceable exhibits.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Verified Industry Passport links, 90-day career plan, human credential sign-off, and StudentID_S24_v01 tracking.',
  },
];

export const DEFAULT_SESSION_24_STATE: Session24State = {
  runOfShow: INITIAL_RUN_OF_SHOW,
  exhibits: INITIAL_EXHIBITS,
  defense: INITIAL_DEFENSE,
  passport: INITIAL_PASSPORT_COMPETENCIES,
  careerPlan: INITIAL_CAREER_PLAN_90_DAY,
  scorecard: INITIAL_SCORECARD,
  conflictCheckCertified: true,
  studentContribution: DEFAULT_STUDENT_CONTRIBUTION,
  reviewerCorrection: DEFAULT_REVIEWER_CORRECTION,
  governance: {
    preparerName: 'Candidate Student (Lead Presenter)',
    reviewerName: 'Dr. Anita Roy (Faculty QA / External Judge Panel)',
    decisionOwner: 'Prof. Rajesh Menon (Academic Dean / Placement Director)',
    fileVersion: 'StudentID_S24_v01.pdf',
    humanAcknowledged: true,
  },
  checklistIndices: [0, 1, 2, 3, 4, 5, 6, 7],
};

