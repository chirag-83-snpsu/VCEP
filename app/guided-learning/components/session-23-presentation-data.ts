// Session 23 Data Layer — Corporate Presentation Preparation
// Authorised VCEP Curriculum: S23_Corporate_Presentation_Preparation.docx & drive-edition-3.json

export type AgendaSection = {
  id: string;
  minuteRange: string;
  durationMinutes: number;
  sectionName: string;
  assignedSpeaker: string;
  coreObjective: string;
};

export type PresentationSlide = {
  slideNum: number;
  title: string;
  keyPoints: string[];
  evidenceReference: string;
  speakerNotes: string;
};

export type ExecutiveSummary = {
  problemContext: string;
  sourceEvidence: string;
  workingDemoMethod: string;
  commercialDecision: string;
  scopeLimitations: string;
  nextStepsHandover: string;
};

export type DefenseChallenge = {
  id: string;
  reviewerQuestion: string;
  keyVulnerability: string;
  squadDefenseStrategy: string;
  studentDefenseAnswer?: string;
};

export type PermissionCheckItem = {
  id: string;
  label: string;
  detail: string;
};

export type Session23Governance = {
  preparerName: string;
  reviewerName: string;
  decisionOwner: string;
  fileVersion: string;
};

export type Session23State = {
  agenda: AgendaSection[];
  slides: PresentationSlide[];
  execSummary: ExecutiveSummary;
  challenges: DefenseChallenge[];
  demoScript: string;
  demoRehearsal: {
    asOfDate: string;
    creditNoteApplied: boolean;
    supplierDeferralApplied: boolean;
  };
  checkedPermissions: string[];
  studentContribution: string;
  reviewerCorrection: string;
  governance: Session23Governance;
  checklistIndices: number[];
  timestamp?: string;
};

export const INITIAL_AGENDA: AgendaSection[] = [
  {
    id: 'A1',
    minuteRange: '0:00 – 1:00',
    durationMinutes: 1,
    sectionName: 'Problem Statement & Liquidity Context',
    assignedSpeaker: 'Rahul D. (Engagement Lead)',
    coreObjective: 'Introduce Vayentra Labs context and highlight the ₹20,000 Friday payroll deficit.',
  },
  {
    id: 'A2',
    minuteRange: '1:00 – 2:00',
    durationMinutes: 1,
    sectionName: 'Financial Baseline & Case F Evidence',
    assignedSpeaker: 'Priya S. (Financial Modeler)',
    coreObjective: 'Present the ₹1,00,000 receivables ledger and the ₹25,000 opening bank balance.',
  },
  {
    id: 'A3',
    minuteRange: '2:00 – 5:00',
    durationMinutes: 3,
    sectionName: 'Live Working Demonstration (Model v2.0)',
    assignedSpeaker: 'Priya S. & Arjun K. (Modeler & Analyst)',
    coreObjective: 'Show live dynamic aging shift (+1 day) and demonstrate deficit reduction to ₹12,000.',
  },
  {
    id: 'A4',
    minuteRange: '5:00 – 6:00',
    durationMinutes: 1,
    sectionName: 'Commercial Decision & Counter-Proposal',
    assignedSpeaker: 'Meera N. (Commercial Strategist)',
    coreObjective: 'Prove why the 10% discount yields ₹0 incremental gain and propose tiered pricing.',
  },
  {
    id: 'A5',
    minuteRange: '6:00 – 7:00',
    durationMinutes: 1,
    sectionName: 'Governance, Limitations & Handover',
    assignedSpeaker: 'Rahul D. (Engagement Lead)',
    coreObjective: 'State explicit scope exclusions (no CRM join key) and invite panel questions.',
  },
];

export const INITIAL_SLIDES: PresentationSlide[] = [
  {
    slideNum: 1,
    title: 'Executive Overview & Squad Roles',
    keyPoints: [
      'Vayentra Labs Capstone Project: Working Capital & Liquidity Advisory',
      'Squad Roles: Rahul D. (Lead), Priya S. (Modeler), Arjun K. (Analyst), Meera N. (Commercial)',
      'Strict 7-Minute Briefing Agenda with 3-Minute Live System Demonstration',
    ],
    evidenceReference: 'Session 18 Project Charter / RACI Matrix',
    speakerNotes: 'Welcome Board members. Our squad was commissioned to resolve Vayentra Labs acute liquidity crisis using audited financial models and strict scope boundaries.',
  },
  {
    slideNum: 2,
    title: 'The Liquidity Challenge: ₹20,000 Deficit',
    keyPoints: [
      'Baseline Cash Position: ₹25,000 opening bank cash vs ₹45,000 unavoidable 7-day payroll outflows',
      'Immediate Net Liquidity Deficit: -₹20,000 due by Friday close',
      'Receivables Inactivity: ₹1,00,000 locked across 4 unstratified invoices (F01–F04)',
    ],
    evidenceReference: 'Case F Baseline Ledger / Session 12 Working Capital Schedule',
    speakerNotes: 'Without rapid operational intervention, the company faces immediate payroll default on Friday. Unstratified collections and lack of aging visibility paralyze cash flows.',
  },
  {
    slideNum: 3,
    title: 'Model v2.0 Architecture & Approved Changes',
    keyPoints: [
      'Change Order CR-01: Approved ₹5,000 non-cash credit note on Beacon F02 (contracts receivables to ₹95,000)',
      'Change Order CR-02: Approved ₹8,000 supplier payment deferral beyond Day 7 (reduces outflows to ₹37,000)',
      'Mathematical Verification: Deficit contracts from -₹20,000 to -₹12,000 while opening cash remains strictly invariant at ₹25,000',
    ],
    evidenceReference: 'Change Control Log (CR-01 & CR-02) / Session 20 Model v2.0',
    speakerNotes: 'Through formal CCB governance, we executed two approved changes. Crucially, the ₹5,000 credit note did not inject bank cash, and total liabilities were not written off—only cash flow timing was optimized.',
  },
  {
    slideNum: 4,
    title: 'Live Working Demonstration (3 Minutes)',
    keyPoints: [
      'Dynamic As-Of Date Sensitivity: Toggling 31-Oct to 01-Nov automatically shifts Asha F01 from Current to 1–30 Days Overdue',
      'Reconciliation Invariance: Total receivables control total remains strictly balanced at ₹95,000',
      'Deficit Resolution Pathway: Asha collection (₹10,000) leaves only ₹2,000 reserve draw needed to cover payroll safely',
    ],
    evidenceReference: 'Live Excel Model v2.0 / Sheet "Receivables Ageing"',
    speakerNotes: 'Watch as we toggle cell B2. Notice how the formulas instantaneously update aging buckets without manual tampering. The control balance of ₹95,000 remains rock solid.',
  },
  {
    slideNum: 5,
    title: 'Commercial Decision: The 10% Discount Trap',
    keyPoints: [
      'Baseline Analysis: 25 seats @ ₹10,000 standard price yields ₹1,50,000 contribution and ₹30,000 net profit (83.3% capacity)',
      'Discount Proposal Trap: 30 seats @ ₹9,000 discounted price yields identical ₹30,000 profit (₹0 incremental gain) at 100% capacity exhaustion',
      'Actionable Counter-Proposal: Tiered pricing (Seats 1–25 @ ₹10,000, Seats 26–30 @ ₹9,000) capturing ₹25,000 incremental contribution and ₹5,000 extra profit',
    ],
    evidenceReference: 'Session 16 Break-Even Simulator / Commercial Decision Memo',
    speakerNotes: 'Management was tempted to grant a blanket 10% discount to win 30 seats. Our financial sensitivity model proved this was a trap: 100% operational risk for zero profit improvement.',
  },
  {
    slideNum: 6,
    title: 'Governance, Scope Boundaries & Reviewer Handover',
    keyPoints: [
      'Data Isolation Safeguard: Invoices (Case F) and CRM leads (Case G) share no foreign key; relational merge strictly rejected',
      'Effort Discipline: Model engineered strictly within the approved 6.0-hour individual work cap',
      'Handover Protocol: Password-protected, read-only distribution ready for Finance Department daily operation',
    ],
    evidenceReference: 'Quality Assurance Test Register / Session 18 Handover Notes',
    speakerNotes: 'We maintained strict internal controls and did not contaminate verified accounting records with unverified CRM leads. Model v2.0 is packaged for supervised deployment. We now invite your questions.',
  },
];

export const INITIAL_EXEC_SUMMARY: ExecutiveSummary = {
  problemContext:
    'Vayentra Labs faced an acute Friday payroll crisis with a -₹20,000 cash deficit. Opening bank cash was ₹25,000 against unavoidable seven-day operating outflows of ₹45,000, while ₹1,00,000 in customer receivables remained unstratified and overdue.',
  sourceEvidence:
    'Case F baseline records established four unpaid invoices totaling ₹1,00,000: Asha Technologies (F01: ₹10,000), Beacon Logistics (F02: ₹20,000), Cedar Enterprises (F03: ₹30,000), and Delta Systems (F04: ₹40,000). Beacon disputed ₹5,000 within F02.',
  workingDemoMethod:
    'Model v2.0 applies dynamic ISO date formulas (=MAX(0, AsOfDate - DueDate)) and formal CCB changes: a ₹5,000 credit note on F02 contracted receivables to ₹95,000, and an ₹8,000 vendor deferral compressed 7-day outflows to ₹37,000, narrowing the deficit to -₹12,000 while opening cash remained invariant at ₹25,000.',
  commercialDecision:
    'Rejected a blanket 10% discount on 30 seats, which mathematically generates ₹0 incremental profit (₹30,000 vs baseline ₹30,000) while exhausting 100% capacity. Recommended tiered pricing for seats 26–30 to secure ₹5,000 in incremental operating profit.',
  scopeLimitations:
    'Case F receivables invoices and Case G CRM sales inquiries share no common identifier or primary key; combining them violates audit integrity. Student effort was strictly disciplined under the approved 6.0-hour cap.',
  nextStepsHandover:
    'Deliver the password-protected, read-only Model v2.0 workbook to the Head of Finance, establish a daily 9:00 AM as-of date refresh routine, and isolate disputed balances in suspense until physical credit notes are executed.',
};

export const INITIAL_CHALLENGES: DefenseChallenge[] = [
  {
    id: 'CH-01',
    reviewerQuestion: 'Why did your squad recommend against offering a 10% discount on all 30 seats?',
    keyVulnerability: 'Pressure to show sales revenue growth at the expense of unit economics and operational capacity.',
    squadDefenseStrategy:
      'We proved mathematically that selling 30 seats at ₹9,000 generates exactly ₹30,000 profit—identical to our 25-seat baseline. The company would take on 5 additional client accounts and operate at 100% capacity with zero reserve buffer for ₹0 incremental profit. Our tiered counter-proposal protects core margins while capturing ₹5,000 incremental gain.',
    studentDefenseAnswer:
      'Selling 30 seats at ₹9,000 generates ₹2,70,000 revenue. With ₹4,000 variable costs per seat (₹1,20,000 total) and ₹1,20,000 fixed overheads, net profit is ₹30,000—exactly equal to 25 seats at standard price. The company takes on 20% more customer operational risk for ₹0 extra profit.',
  },
  {
    id: 'CH-02',
    reviewerQuestion: 'What contingency exists if Beacon Logistics refuses to pay the remaining ₹15,000?',
    keyVulnerability: 'Concentration risk on disputed receivable balance during immediate cash crunch.',
    squadDefenseStrategy:
      'Model v2.0 already isolated Beacon in suspense. Our ₹12,000 deficit is resolved by collecting Asha Technologies (₹10,000) and drawing ₹2,000 from working capital reserves, leaving operational payroll safe even in a total Beacon default.',
    studentDefenseAnswer:
      'Our liquidity forecast does not rely on Beacon F02 for Friday payroll. By collecting Asha F01 (₹10,000, due 31 Oct), our remaining gap is just ₹2,000, which is comfortably absorbed by available bank reserves without high-interest short-term borrowing.',
  },
  {
    id: 'CH-03',
    reviewerQuestion: 'Why did you not combine the CRM sales pipeline with your receivables workbook?',
    keyVulnerability: 'Desire by non-technical management to merge sales leads into accounting spreadsheets.',
    squadDefenseStrategy:
      'As confirmed in our discovery phase (Session 17), Case F accounting invoices and Case G CRM inquiries share no primary key or foreign identifier. Merging them would create false relational links and violate data boundary integrity.',
    studentDefenseAnswer:
      'Case F invoices have statutory tax voucher IDs, whereas Case G leads are top-of-funnel marketing inquiries. There is no unique join key between them. Merging unearned pipeline leads into general ledger receivables would violate Ind AS 115 and corrupt audit trails.',
  },
];

export const INITIAL_PERMISSIONS: PermissionCheckItem[] = [
  {
    id: 'P1',
    label: 'Case F Receivables Release Integrity',
    detail: 'Verified that all 4 invoices (F01–F04) total ₹1,00,000 in baseline and ₹95,000 post-credit note. No external invoices added.',
  },
  {
    id: 'P2',
    label: 'Case G CRM Data Boundary Isolation',
    detail: 'Enforced strict isolation between Case F invoices and Case G sales inquiries. No invalid relational merge performed.',
  },
  {
    id: 'P3',
    label: '6.0-Hour Student Effort Cap Compliance',
    detail: 'Project execution and model building completed within the approved 6.0 individual extra hours limit.',
  },
  {
    id: 'P4',
    label: 'Live Formula Audit Requirement',
    detail: 'All calculations in Model v2.0 utilize dynamic live formulas (=SUM, =MAX, =IF); zero hardcoded calculated totals.',
  },
  {
    id: 'P5',
    label: 'Three-Minute Live Demonstration Window',
    detail: 'Live working demonstration rehearsed to fit strictly inside the 3-minute window of the 7-minute total squad presentation.',
  },
];

export const DEFAULT_DEMO_SCRIPT =
  '1. Navigate to "Control Total" sheet: Point to cell E6 showing ₹95,000 reconciled to source records.\n2. In cell B2, toggle As-Of Date from 2026-10-31 to 2026-11-01: Show the audience how invoice F01 shifts automatically from Current into 1–30 Days Overdue while the total remains ₹95,000.\n3. Navigate to "Cash Forecast" sheet: Highlight line 14 showing mandatory outflows reduced to ₹37,000 following the ₹8,000 deferral, leaving our deficit at ₹12,000.\n4. Show the collections recovery scenario: Adding Asha Technologies (₹10,000) produces a viable closing bank balance of ₹3,000 by Friday.';

export const DEFAULT_STUDENT_CONTRIBUTION =
  'Designed and formatted Slides 3 and 4 covering Model v2.0 change orders and the live demonstration protocol. Rehearsed the 3-minute dynamic aging demonstration in Excel and formulated the mathematical defense for the 10% commercial discount challenge.';

export const DEFAULT_REVIEWER_CORRECTION =
  'Before Rehearsal Defect: Preliminary script stated that deferring an ₹8,000 supplier payment decreased company liabilities by ₹8,000. Peer Reviewer Correction: Interviewer challenged candidate to clarify that total balance sheet accounts payable remains unchanged; candidate corrected the script to explain that deferral solely shifts 7-day cash flow timing.';

export const INITIAL_CHECKLIST_LABELS = [
  'I verified the presentation deck contains no more than 6 slides and covers all capstone evidence.',
  'I completed the 1-page executive summary with problem, evidence, demo, decision, limits, and next action.',
  'I rehearsed the 7-minute presentation outline with exactly 3 minutes allocated for the live working demonstration.',
  'I tested the dynamic As-Of Date refresh in Model v2.0 showing aging shifts with zero variance in control totals.',
  'I practiced the mathematical defense for all three tough reviewer challenge questions.',
  'I verified that Case F receivables and Case G CRM records remain strictly isolated with no invalid join keys.',
  'I recorded my individual attributable contribution and authentic peer defect correction.',
  'I certified three-tier governance signoffs and tracked deliverable file StudentID_S23_v01.pptx.',
];

export const S23_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate 6-slide deck and 1-page executive summary covering Model v2.0 proofs.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Explain live demo method, formula mechanics, scope boundaries, and commercial discount proof.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Clear presentation timing (7m total, 3m demo), professional slide design, and traceable figures.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Source and version record (StudentID_S23_v01), peer defect correction, and 3-tier governance signoffs.',
  },
];

export const DEFAULT_SESSION_23_STATE: Session23State = {
  agenda: INITIAL_AGENDA,
  slides: INITIAL_SLIDES,
  execSummary: INITIAL_EXEC_SUMMARY,
  challenges: INITIAL_CHALLENGES,
  demoScript: DEFAULT_DEMO_SCRIPT,
  demoRehearsal: {
    asOfDate: '2026-10-31',
    creditNoteApplied: true,
    supplierDeferralApplied: true,
  },
  checkedPermissions: ['P1', 'P2', 'P3', 'P4', 'P5'],
  studentContribution: DEFAULT_STUDENT_CONTRIBUTION,
  reviewerCorrection: DEFAULT_REVIEWER_CORRECTION,
  governance: {
    preparerName: 'Candidate Student (Squad Lead)',
    reviewerName: 'Dr. Anita Roy (Faculty QA / Peer Reviewer)',
    decisionOwner: 'Prof. Rajesh Menon (Managing Director / Board Chair)',
    fileVersion: 'StudentID_S23_v01.pptx',
  },
  checklistIndices: [0, 1, 2, 3, 4, 5, 6, 7],
};

