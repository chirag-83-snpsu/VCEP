// ============================================================================
// VCEP SESSION 02: PROFESSIONAL IDENTITY AND TEAMWORK DATA & CONTRACTS
// GROUND TRUTH: curriculum/archive/downloads/S02_Professional_Identity_and_Teamwork.docx
// AND app/guided-learning/drive-edition-3.json (Session 02)
// ============================================================================

export const S02_STORAGE_KEY = 'vcep:s02:drive-v3:student-workstation';

export type SquadRoleType =
  | 'Coordinator'
  | 'Finance Lead'
  | 'Data Lead'
  | 'Client Communications Lead'
  | 'Quality Reviewer'
  | 'Owner'
  | 'Reviewer'
  | 'Backup'
  | 'Support';

export interface SquadMember {
  id: string;
  name: string;
  title: string;
  role: SquadRoleType;
  backupRoleId?: SquadRoleType;
  sharesLaptop: boolean;
  travelsLongDistance: boolean;
  commuteMinutes?: number;
  assignedResponsibility: string;
}

export interface LaptopSlot {
  time: string;
  assignedMemberId: string;
  activity: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  actionSummary: string;
  governanceVerdict: 'Recommended' | 'High Risk' | 'Unacceptable';
  governanceAnalysis: string;
  auditTrailConsequence: string;
  isOptimal: boolean;
  feedback: string;
}

export interface RoleRotationSession {
  sessionNum: number;
  sessionTitle: string;
  myRole: SquadRoleType;
  reviewerId: string;
  deliverable: string;
}

export interface CharterCommitment {
  id: string;
  category: 'File naming' | 'Review' | 'Availability' | 'Device rotation' | 'Escalation';
  ownerAndBackup: string;
  agreedCommitment: string;
  standardClause: string;
}

export interface Session02WorkstationState {
  version: '3.0';
  introText: string;
  introSkill: string;
  introRole: string;
  members: SquadMember[];
  slots: LaptopSlot[];
  selectedOptionId: string;
  justification: string;
  charterCommitments: CharterCommitment[];
  rotations: RoleRotationSession[];
  peerFeedback: {
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  timestamp?: string;
}

export const INITIAL_SQUAD_MEMBERS: SquadMember[] = [
  {
    id: 'm1',
    name: 'Student 1 (You)',
    title: 'Finance & Reconciliations',
    role: 'Finance Lead',
    backupRoleId: 'Quality Reviewer',
    sharesLaptop: true,
    travelsLongDistance: false,
    assignedResponsibility: 'Draft financial schedules, revenue matching, and variance check.',
  },
  {
    id: 'm2',
    name: 'Student 2',
    title: 'Quality & Compliance',
    role: 'Quality Reviewer',
    backupRoleId: 'Finance Lead',
    sharesLaptop: true,
    travelsLongDistance: false,
    assignedResponsibility: 'Independent formula verification and cross-foot reconciliation before submission.',
  },
  {
    id: 'm3',
    name: 'Student 3',
    title: 'Operations & Backup',
    role: 'Coordinator',
    backupRoleId: 'Quality Reviewer',
    sharesLaptop: false,
    travelsLongDistance: true,
    commuteMinutes: 90,
    assignedResponsibility: 'Backlog coordination, management escalation, and acting reviewer standby.',
  },
  {
    id: 'm4',
    name: 'Student 4',
    title: 'Spreadsheet & Data',
    role: 'Data Lead',
    backupRoleId: 'Coordinator',
    sharesLaptop: false,
    travelsLongDistance: false,
    assignedResponsibility: 'Spreadsheet normalization, formula hygiene, and data appendix rows.',
  },
  {
    id: 'm5',
    name: 'Student 5',
    title: 'Client Stakeholder Updates',
    role: 'Client Communications Lead',
    backupRoleId: 'Data Lead',
    sharesLaptop: false,
    travelsLongDistance: false,
    assignedResponsibility: 'Outbound stakeholder log, email briefing, and submission package packaging.',
  },
];

export const INITIAL_LAPTOP_SLOTS: LaptopSlot[] = [
  { time: '13:00–13:20', assignedMemberId: 'm1', activity: 'Draft financial schedules & revenue matching' },
  { time: '13:20–13:40', assignedMemberId: 'm2', activity: 'Audit formulas offline & review source invoices' },
  { time: '13:40–14:00', assignedMemberId: 'm1', activity: 'Enter data appendix rows & schedule balances' },
  { time: '14:00–14:20', assignedMemberId: 'm2', activity: 'Draft customer communication log & variance table' },
  { time: '14:20–14:40', assignedMemberId: 'm3', activity: 'Commuter arrival: Compile shared exception notes' },
  { time: '14:40–15:00', assignedMemberId: 'm4', activity: 'Cross-check source invoices & reconcile totals' },
  { time: '15:00–15:20', assignedMemberId: 'm5', activity: 'Consolidate working tables into final delivery format' },
  { time: '15:20–15:40', assignedMemberId: 'm2', activity: 'Final independent quad-eye formula audit' },
];

export const S02_DECISION_OPTIONS: DecisionOption[] = [
  {
    id: 'opt-backup',
    title: 'Option A: Engage Designated Backup at 16:30 per Charter Clause 4 (Recommended)',
    actionSummary: 'Formally activate Student 3 (Designated Backup) to acting reviewer at 16:30. Notify trainer/manager via email immediately, conduct audit from 16:45 to 17:30, and deliver on time by 18:00.',
    governanceVerdict: 'Recommended',
    governanceAnalysis: 'Demonstrates robust professional governance. Activating the prepared backup ensures full independent verification before the 18:00 cutoff without missing deadlines.',
    auditTrailConsequence: 'Full documented audit trail: logs why backup was triggered, who performed the review, and preserves team delivery reliability.',
    isOptimal: true,
    feedback: 'Approved governance path! Early notification at 16:30 and engaging a pre-briefed backup prevents unreviewed submissions and protects client trust.',
  },
  {
    id: 'opt-skip',
    title: 'Option B: Skip Review and Submit Unchecked at 16:30 with an Apology',
    actionSummary: 'Owner submits the file directly at 16:30 with an apology note explaining that the reviewer was absent in transit.',
    governanceVerdict: 'High Risk',
    governanceAnalysis: 'Self-review is a catastrophic accounting risk. Submitting unverified financial schedules breaches company quality control and risks material misstatement.',
    auditTrailConsequence: 'Governance Failure: Submitting unreviewed work violates four-eye principles and exposes the team to audit penalties.',
    isOptimal: false,
    feedback: 'Governance failure! Never submit unreviewed calculations. In corporate practice, unverified deliverables cause severe financial errors.',
  },
  {
    id: 'opt-extend',
    title: 'Option C: Unilaterally Postpone Submission to the Next Morning',
    actionSummary: 'Decide internally to wait for the delayed reviewer and submit the file tomorrow morning without client or manager pre-authorization.',
    governanceVerdict: 'Unacceptable',
    governanceAnalysis: 'Unauthorized deadline extension breaches commercial contracts. In enterprise service delivery, arbitrary delays destroy client credibility.',
    auditTrailConsequence: 'Contract Breach: Resulting deliverable marked as late and non-compliant in cohort records.',
    isOptimal: false,
    feedback: 'Contract breach! Unilaterally extending deadlines without manager approval violates delivery commitments.',
  },
  {
    id: 'opt-wait',
    title: 'Option D: Wait until 17:50 and Rush Unreviewed at the Last Minute',
    actionSummary: 'Wait passively hoping the commuter arrives before 18:00, then scramble to upload whatever is ready without independent checks.',
    governanceVerdict: 'Unacceptable',
    governanceAnalysis: 'Leaves zero margin for remediation. Scrambled uploads guarantee formula corruption and incomplete submissions.',
    auditTrailConsequence: 'Audit Failure: Demonstrates lack of operational planning and emergency readiness.',
    isOptimal: false,
    feedback: 'Passive delay trap! Waiting until 10 minutes before the deadline creates panic and eliminates all review safeguards.',
  },
];

export const INITIAL_CHARTER_COMMITMENTS: CharterCommitment[] = [
  {
    id: 'c1-file',
    category: 'File naming',
    ownerAndBackup: 'Coordinator (Student 3) / Backup: Finance Lead (Student 1)',
    agreedCommitment: 'StudentID_S02_v01 format strictly enforced. Every saved draft increments version (e.g. v02) before final handover.',
    standardClause: 'All team outputs must follow standardized naming: [StudentID]_[SessionID]_v[Version]. Unversioned files are rejected by reviewers.',
  },
  {
    id: 'c2-review',
    category: 'Review',
    ownerAndBackup: 'Quality Reviewer (Student 2) / Backup: Student 3',
    agreedCommitment: 'Mandatory four-eye review on all formula cells and cross-foots. No file submitted without an independent audit sign-off.',
    standardClause: 'Accountability means one person owns the deliverable and confirms quality. A reviewer checks accuracy but does not erase ownership.',
  },
  {
    id: 'c3-availability',
    category: 'Availability',
    ownerAndBackup: 'All Squad Members (Student 3: 90-min commute buffer)',
    agreedCommitment: 'Team responds to blocker messages within 30 minutes during work hours. Student 3 assigned non-device prep until 14:20 arrival.',
    standardClause: 'Response turnaround SLA is 30 minutes during lab sprints. Commuter travel schedules are pre-accommodated in task assignments.',
  },
  {
    id: 'c4-device',
    category: 'Device rotation',
    ownerAndBackup: 'Student 1 & Student 2 (Sharing 1 Laptop)',
    agreedCommitment: 'Strict 20-minute keyboard slots. Off-device partner conducts manual document review, source verification, or communication logs.',
    standardClause: 'Hardware-constrained squads rotate keyboard access in 20-minute blocks ensuring equitable hands-on time for every learner.',
  },
  {
    id: 'c5-escalation',
    category: 'Escalation',
    ownerAndBackup: 'Coordinator (Student 3) / Lead',
    agreedCommitment: 'If a blocker or absence occurs, escalate at least 90 minutes before deadline (by 16:30 for an 18:00 cutoff) with designated backup activation.',
    standardClause: 'When an operational bottleneck threatens delivery, the designated backup is formally activated and faculty is notified before deadlines expire.',
  },
];

export const INITIAL_ROTATIONS: RoleRotationSession[] = [
  {
    sessionNum: 2,
    sessionTitle: 'Professional Identity and Teamwork',
    myRole: 'Finance Lead',
    reviewerId: 'Student 2 (Quality Reviewer)',
    deliverable: 'Professional Profile & Squad Charter',
  },
  {
    sessionNum: 3,
    sessionTitle: 'Workplace Communication',
    myRole: 'Client Communications Lead',
    reviewerId: 'Student 1 (Coordinator)',
    deliverable: 'Client Briefing & Email Thread Log',
  },
  {
    sessionNum: 4,
    sessionTitle: 'Meetings and Reporting',
    myRole: 'Coordinator',
    reviewerId: 'Student 4 (Data Lead)',
    deliverable: 'Action Tracker & Sprint Minute Notes',
  },
  {
    sessionNum: 5,
    sessionTitle: 'Accounting Transactions',
    myRole: 'Quality Reviewer',
    reviewerId: 'Student 3 (Finance Lead)',
    deliverable: 'Transaction Journal & Audit Verification',
  },
];

export const S02_TRAINER_GUIDELINES = {
  suggestedMinutes: 135,
  pacing: [
    { time: '00–05m', phase: 'Team Mission Orientation', description: 'Brief students on the 5-person squad constraints, 18:00 delivery deadline, and corporate accountability rules.' },
    { time: '05–40m', phase: 'Professional Introduction Practice', description: 'Students draft their 90-second intro linking technical skills to entry-level jobs, then rehearse speaking aloud using the interactive practice timer.' },
    { time: '40–75m', phase: 'Role Allocation & Charter Studio', description: 'Squads assign 5 core roles, negotiate 20-minute shared laptop slots, and formalize binding commitments for file naming and response SLAs.' },
    { time: '75–115m', phase: 'Escalation Simulator & Recovery Plan', description: 'Introduce the 16:30 absent reviewer crisis. Squads evaluate Option A (Backup) vs. failure paths, recording formal audit justifications.' },
    { time: '115–135m', phase: 'Peer Review & Quality Boundary Record', description: 'Students record individual contributions, peer review corrections, and independent professional boundaries before final submission.' },
  ],
  openingPrompt: 'If your colleague is delayed in traffic at 16:30 and your client file is due at 18:00, do you skip review or activate a pre-agreed backup?',
  observableOutcome: 'Every student delivers a crisp 90-second pitch, participates in laptop rotation, and defends an audit-compliant escalation.',
  commonErrors: [
    'Skipping quad-eye review to meet the deadline (catastrophic quality breach).',
    'Unilaterally pushing the deadline to tomorrow without authorization (contract breach).',
    'Allowing one student to monopolize the shared laptop (violates equitable 20-minute hands-on practice).',
  ],
  offlineFallback: 'If network is unavailable, squads draft charter tables on paper worksheet pack and verbally present their 90-second elevator pitch to adjacent squads.',
};

export function loadSession02State(): Session02WorkstationState {
  const defaultState: Session02WorkstationState = {
    version: '3.0',
    introText:
      'I am an entry-level commerce professional specializing in financial schedule preparation, bank statement reconciliation, and accounts receivable tracking. I ensure that financial deliverables maintain zero reconciliation variance and follow strict four-eye quality review standards.',
    introSkill: 'Reconciliation & Accounts Receivable Analysis',
    introRole: 'Finance Lead & Reconciler',
    members: INITIAL_SQUAD_MEMBERS,
    slots: INITIAL_LAPTOP_SLOTS,
    selectedOptionId: 'opt-backup',
    justification:
      'At 16:30, with Reviewer delayed in transit and delivery due at 18:00, we formally engage Backup (Student 3) per Clause 4 of our Squad Charter. Trainer notified via email; acting reviewer conducts independent cross-foot check from 16:45 to 17:30.',
    charterCommitments: INITIAL_CHARTER_COMMITMENTS,
    rotations: INITIAL_ROTATIONS,
    peerFeedback: {
      contributionSummary: 'I drafted the laptop rotation schedule and verified commute travel time buffers for team members.',
      peerCorrection: 'Peer pointed out that the file naming needed the exact v01 suffix to comply with audit requirements.',
      professionalBoundary: 'I will refuse to sign off on an unverified reconciliation balance even if the submission deadline is imminent.',
    },
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(S02_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      members: parsed.members && parsed.members.length >= 4 ? parsed.members : defaultState.members,
      slots: parsed.slots && parsed.slots.length > 0 ? parsed.slots : defaultState.slots,
      charterCommitments: parsed.charterCommitments && parsed.charterCommitments.length > 0 ? parsed.charterCommitments : defaultState.charterCommitments,
      rotations: parsed.rotations && parsed.rotations.length > 0 ? parsed.rotations : defaultState.rotations,
      peerFeedback: { ...defaultState.peerFeedback, ...(parsed.peerFeedback || {}) },
    };
  } catch {
    return defaultState;
  }
}

