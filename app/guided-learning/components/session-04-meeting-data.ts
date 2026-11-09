/**
 * VCEP Session 04: Meetings and Reporting — Canonical Data & State Model
 * Mission: Run the Meeting. Capture the Decision.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S04_Meetings_and_Reporting.docx
 * - Schema: app/guided-learning/drive-edition-3.json (Session 4)
 */

export const S04_STORAGE_KEY = 'vcep:s04:drive-v3:student-workstation';
export const S04_PREVIEW_KEY = 'vcep-drive-edition3:session:4:preview';

export const OPERATIONS_LEAD_LIMIT_INR = 2000;
export const SUBSTITUTE_FEE_INR = 4000;
export const MANAGER_SYNC_TIME = '15:00';
export const CLIENT_DELIVERY_TIME = '17:00';

export interface SquadMeetingRole {
  id: string;
  roleName: string;
  assignedStudent: string;
  mandate: string;
  authorityBoundary: string;
}

export const INITIAL_MEETING_ROLES: SquadMeetingRole[] = [
  {
    id: 'role-ops',
    roleName: 'Operations Lead',
    assignedStudent: 'Rohan Sharma',
    mandate: 'Explains supplier 1-day delay notification and operational manufacturing impact.',
    authorityBoundary: 'Can authorize up to ₹2,000 only. Cannot approve ₹4,000 without Manager.',
  },
  {
    id: 'role-procure',
    roleName: 'Procurement Lead',
    assignedStudent: 'Priya Nair',
    mandate: 'Presents the alternative substitute supplier option delivering today for ₹4,000 rush fee.',
    authorityBoundary: 'Secures 14:30 inventory hold; cannot execute PO without approved budget.',
  },
  {
    id: 'role-client',
    roleName: 'Client Communications Lead',
    assignedStudent: 'Karthik Rao',
    mandate: 'Protects the agreed 17:00 client delivery commitment against contractual penalties.',
    authorityBoundary: 'Must not make unverified delivery promises before 15:00 budget sign-off.',
  },
  {
    id: 'role-gm',
    roleName: 'General Manager (Approver)',
    assignedStudent: 'Ananya Deshmukh',
    mandate: 'Evaluates commercial cost-benefit and holds sole authority to approve the ₹4,000 fee.',
    authorityBoundary: 'Available for emergency budget decision at 15:00 today.',
  },
  {
    id: 'role-minute',
    roleName: 'Minute-Taker & RACI Owner',
    assignedStudent: 'Student Workstation (You)',
    mandate: 'Captures formal decisions, action owners, strict deadlines, and unresolved blockers.',
    authorityBoundary: 'Records binding decisions, not conversation transcripts. Flags unapproved items.',
  },
];

export interface AgendaItem {
  id: string;
  timebox: string;
  title: string;
  objective: string;
  leadRole: string;
}

export const INITIAL_AGENDA_ITEMS: AgendaItem[] = [
  {
    id: 'ag-1',
    timebox: '00–02 min',
    title: 'Context & Delivery Cutoff',
    objective: 'Reiterate 17:00 client delivery commitment and review primary supplier delay notification.',
    leadRole: 'Operations Lead',
  },
  {
    id: 'ag-2',
    timebox: '02–06 min',
    title: 'Option Evaluation & Commercial Tradeoff',
    objective: 'Compare Option A (1-day delay, ₹0 extra, breaches 17:00 SLA) vs Option B (Substitute vendor, +₹4,000, meets 17:00).',
    leadRole: 'Procurement Lead',
  },
  {
    id: 'ag-3',
    timebox: '06–09 min',
    title: 'Decision Authority & Escalation Path',
    objective: 'Acknowledge ₹2,000 Operations Lead ceiling and establish formal escalation to General Manager at 15:00.',
    leadRole: 'Minute-Taker & Approver',
  },
  {
    id: 'ag-4',
    timebox: '09–12 min',
    title: 'Action Allocation & RACI Deadlines',
    objective: 'Assign single accountable owners, intermediate deadlines (14:30, 15:00, 15:30), and verification evidence.',
    leadRole: 'All Squad Members',
  },
];

export interface DeliveryOption {
  id: string;
  title: string;
  costINR: number;
  deliveryTime: string;
  slaImpact: string;
  status: 'PROPOSED' | 'REJECTED' | 'PENDING_APPROVAL' | 'AUTHORISED';
  approvalRequiredBy: string;
  rationale: string;
}

export const INITIAL_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'opt-delay',
    title: 'Option A: Wait for Primary Supplier',
    costINR: 0,
    deliveryTime: 'Tomorrow 12:00 PM',
    slaImpact: 'Breaches client 17:00 contract; causes client dissatisfaction and penalty.',
    status: 'REJECTED',
    approvalRequiredBy: 'Client Acceptance (Not Granted)',
    rationale: 'Rejected: Client has not accepted a changed delivery deadline.',
  },
  {
    id: 'opt-substitute',
    title: 'Option B: Emergency Substitute Vendor',
    costINR: 4000,
    deliveryTime: 'Today 17:00 PM',
    slaImpact: 'Meets promised 17:00 client delivery on time.',
    status: 'PENDING_APPROVAL',
    approvalRequiredBy: 'General Manager (at 15:00)',
    rationale: 'Proposed & Recommended: Protects client relationship, but exceeds Operations Lead ₹2,000 limit.',
  },
];

export interface RACIActionItem {
  id: string;
  task: string;
  owner: string;
  authority: string;
  deadline: string;
  blocker: string;
  evidence: string;
  status: 'Open' | 'In Progress' | 'Complete';
}

export const INITIAL_RACI_ACTIONS: RACIActionItem[] = [
  {
    id: 'act-1',
    task: 'Confirm substitute supplier inventory reservation & hold stock until 16:00',
    owner: 'Priya Nair (Procurement)',
    authority: 'Operations Lead',
    deadline: '14:30 Today',
    blocker: 'Awaiting formal vendor quote confirmation',
    evidence: 'Vendor Stock Reservation Email #809',
    status: 'Complete',
  },
  {
    id: 'act-2',
    task: 'Submit emergency ₹4,000 budget variance request to General Manager at 15:00 sync',
    owner: 'Rohan Sharma (Operations Lead)',
    authority: 'General Manager',
    deadline: '15:00 Today',
    blocker: 'Exceeds ₹2,000 lead authority; requires GM sign-off',
    evidence: 'Signed Purchase Order / Approval Slack #809',
    status: 'In Progress',
  },
  {
    id: 'act-3',
    task: 'Communicate confirmed dispatch timeline to client following GM budget sign-off',
    owner: 'Karthik Rao (Client Lead)',
    authority: 'Account Manager',
    deadline: '15:30 Today',
    blocker: 'Cannot promise 17:00 delivery until GM approves ₹4,000 at 15:00',
    evidence: 'Client Milestone Status Email',
    status: 'Open',
  },
  {
    id: 'act-4',
    task: 'Receive substitute parts, conduct incoming QC inspection, and prepare client package',
    owner: 'Student Workstation (QA Lead)',
    authority: 'Quality Reviewer',
    deadline: '16:15 Today',
    blocker: 'Parts arrival at dispatch dock by 16:00',
    evidence: 'Signed QC Inspection Checklist Slip',
    status: 'Open',
  },
];

export interface Session04WorkstationState {
  agenda: AgendaItem[];
  roles: SquadMeetingRole[];
  deliveryOptions: DeliveryOption[];
  actions: RACIActionItem[];
  dnbState: {
    done: string;
    next: string;
    blocker: string;
  };
  minutes: {
    meetingTitle: string;
    meetingTime: string;
    attendees: string;
    keyDecisions: string;
    unresolvedItems: string;
    nextMeeting: string;
  };
  rehearsalSeconds: number;
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  lastSaved?: string;
}

export const INITIAL_S04_STATE: Session04WorkstationState = {
  agenda: INITIAL_AGENDA_ITEMS,
  roles: INITIAL_MEETING_ROLES,
  deliveryOptions: INITIAL_DELIVERY_OPTIONS,
  actions: INITIAL_RACI_ACTIONS,
  dnbState: {
    done: 'Conducted 12-minute squad review on supplier delay. Evaluated ₹4,000 substitute cost versus contractual breach; pre-aligned emergency PO documentation for 15:00 GM review.',
    next: 'Procurement confirming substitute stock hold by 14:30; Operations Lead presenting ₹4,000 variance to General Manager at 15:00 sharp.',
    blocker: 'Awaiting General Manager sign-off at 15:00 because the ₹4,000 rush fee exceeds the Operations Lead’s ₹2,000 discretionary limit.',
  },
  minutes: {
    meetingTitle: 'Client Delivery Emergency Meeting · 17:00 SLA Protection',
    meetingTime: '13:00 – 13:12 (12 Minutes Timeboxed)',
    attendees: 'Operations Lead, Procurement Lead, Client Lead, Minute-Taker, GM Representative',
    keyDecisions: 'Option A (delay) rejected to prevent client SLA breach. Option B (substitute at ₹4,000) selected as the recommended path, pending General Manager approval.',
    unresolvedItems: '₹4,000 expenditure approval remains unresolved until General Manager review at 15:00. No delivery guarantee to be issued to client prior to 15:00 sign-off.',
    nextMeeting: '15:00 Emergency GM Budget Review & 15:30 Client Dispatch Sync',
  },
  rehearsalSeconds: 90,
  governance: {
    studentId: 'STU-2026-MEET',
    fileVersion: 'StudentID_S04_v01',
    contributionSummary: '',
    peerCorrection: '',
    professionalBoundary: '',
  },
};

export const S04_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate 4-item agenda, structured meeting minutes, and RACI action tracker with 1 owner per task.',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Enforces authority limits (₹2,000 lead vs ₹4,000 GM); separates proposed options from authorised decisions.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Crisp 90-second Done-Next-Blocker flash report and clear, unambiguous action deadlines (e.g. 14:30, 15:00).',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Identifies unresolved risks, records peer review corrections, maintains file versioning StudentID_S04_v01.',
  },
];

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function loadSession04State(): Session04WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S04_STATE;
  try {
    const raw = localStorage.getItem(S04_STORAGE_KEY);
    if (!raw) return INITIAL_S04_STATE;
    const parsed = JSON.parse(raw);
    return {
      agenda: parsed.agenda || INITIAL_AGENDA_ITEMS,
      roles: parsed.roles || INITIAL_MEETING_ROLES,
      deliveryOptions: parsed.deliveryOptions || INITIAL_DELIVERY_OPTIONS,
      actions: parsed.actions || INITIAL_RACI_ACTIONS,
      dnbState: parsed.dnbState || INITIAL_S04_STATE.dnbState,
      minutes: parsed.minutes || INITIAL_S04_STATE.minutes,
      rehearsalSeconds: parsed.rehearsalSeconds ?? 90,
      governance: {
        studentId: parsed.governance?.studentId || 'STU-2026-MEET',
        fileVersion: parsed.governance?.fileVersion || 'StudentID_S04_v01',
        contributionSummary: parsed.governance?.contributionSummary || '',
        peerCorrection: parsed.governance?.peerCorrection || '',
        professionalBoundary: parsed.governance?.professionalBoundary || '',
      },
      lastSaved: parsed.lastSaved || parsed.timestamp,
    };
  } catch (err) {
    console.warn('[Session04] Error loading persisted state:', err);
    return INITIAL_S04_STATE;
  }
}

export function saveSession04State(state: Session04WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...state,
      lastSaved: time,
      timestamp: time,
    };
    localStorage.setItem(S04_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(S04_PREVIEW_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Session04] Error saving state:', err);
  }
}

