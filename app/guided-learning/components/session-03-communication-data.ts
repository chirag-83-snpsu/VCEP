/**
 * VCEP Session 03: Workplace Communication — Canonical Data & State Model
 * Mission: Write Like a Professional.
 * 
 * Source Grounding:
 * - Approved Drive Workbook: curriculum/archive/downloads/S03_Workplace_Communication.docx
 * - Schema: app/guided-learning/drive-edition-3.json (Session 3)
 */

export const S03_STORAGE_KEY = 'vcep:s03:drive-v3:student-workstation';
export const S03_PREVIEW_KEY = 'vcep-drive-edition3:session:3:preview';

export const MAX_CLARIFY_WORDS = 120;
export const MAX_PROGRESS_WORDS = 40;
export const MAX_ESCALATION_WORDS = 70;

export interface CustomerBillingRecord {
  id: string;
  name: string;
  billedRevenueINR: number;
  paymentLedgerStatus: 'UNAVAILABLE' | 'VERIFIED';
  paymentHistoryNotes: string;
  creditRiskLevel: 'HIGH_RISK_UNKNOWN' | 'MODERATE' | 'LOW';
}

export const SAMPLE_CUSTOMER_BILLINGS: CustomerBillingRecord[] = [
  {
    id: 'CUST-001',
    name: 'Apex Retail Distributors Ltd',
    billedRevenueINR: 4850000,
    paymentLedgerStatus: 'UNAVAILABLE',
    paymentHistoryNotes: 'Invoice values available. Payment receipts & aging locked in Accounts.',
    creditRiskLevel: 'HIGH_RISK_UNKNOWN',
  },
  {
    id: 'CUST-002',
    name: 'Bharat Logix Infra Pvt',
    billedRevenueINR: 3920000,
    paymentLedgerStatus: 'UNAVAILABLE',
    paymentHistoryNotes: 'Invoice values available. Collection dates missing; unverified credit risk.',
    creditRiskLevel: 'HIGH_RISK_UNKNOWN',
  },
  {
    id: 'CUST-003',
    name: 'Zenith Pharma Chem',
    billedRevenueINR: 2410000,
    paymentLedgerStatus: 'UNAVAILABLE',
    paymentHistoryNotes: 'Invoice values available. Prior dispute or payment speed unverified.',
    creditRiskLevel: 'HIGH_RISK_UNKNOWN',
  },
  {
    id: 'CUST-004',
    name: 'Delta Industrial Systems',
    billedRevenueINR: 1980000,
    paymentLedgerStatus: 'UNAVAILABLE',
    paymentHistoryNotes: 'Invoice values available. Bank reconciliation records required to verify reliability.',
    creditRiskLevel: 'HIGH_RISK_UNKNOWN',
  },
  {
    id: 'CUST-005',
    name: 'Horizon Consumer FMCG',
    billedRevenueINR: 1450000,
    paymentLedgerStatus: 'UNAVAILABLE',
    paymentHistoryNotes: 'Invoice values available. No verified payment data.',
    creditRiskLevel: 'HIGH_RISK_UNKNOWN',
  },
];

export interface MessageDraft {
  recipient: string;
  subject: string;
  body: string;
}

export interface Session03WorkstationState {
  // Pre-draft diagnostic responses
  diagnostic: {
    missingDataExplanation: string;
    creditRiskExplanation: string;
    proposedCriteria: string;
  };
  // The three deliverables
  clarificationEmail: MessageDraft;
  progressUpdate: MessageDraft;
  escalationMessage: MessageDraft;
  // Roadblock simulation flag
  roadblockSimulated: boolean;
  // Squad review & governance
  governance: {
    studentId: string;
    fileVersion: string;
    contributionSummary: string;
    peerCorrection: string;
    professionalBoundary: string;
  };
  lastSaved?: string;
}

export const INITIAL_S03_STATE: Session03WorkstationState = {
  diagnostic: {
    missingDataExplanation: '',
    creditRiskExplanation: '',
    proposedCriteria: '',
  },
  clarificationEmail: {
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Clarification: Criteria & Data for Best Customers Report',
    body: '',
  },
  progressUpdate: {
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Update: Best Customers Report Progress',
    body: '',
  },
  escalationMessage: {
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Escalation: Unavailability of Customer Payment Data',
    body: '',
  },
  roadblockSimulated: false,
  governance: {
    studentId: 'STU-2026-COMM',
    fileVersion: 'StudentID_S03_v01',
    contributionSummary: '',
    peerCorrection: '',
    professionalBoundary: '',
  },
};

export const S03_RUBRIC = [
  {
    name: 'Execution',
    points: 4,
    evidence: 'Complete and accurate required output: clarification email (<=120 words), progress message (<=40 words), and escalation (<=70 words).',
  },
  {
    name: 'Reasoning',
    points: 2,
    evidence: 'Distinguishes gross sales from collection speed; clearly explains bad-debt risk to 16:00 credit decisions.',
  },
  {
    name: 'Communication',
    points: 2,
    evidence: 'Objective, executive professional tone; eliminates speculative phrases; includes explicit timestamps.',
  },
  {
    name: 'Professional Process',
    points: 2,
    evidence: 'Timely 14:00 escalation with constructive workaround before 16:00 decision, file versioning, and attributable review.',
  },
];

export const SPECULATIVE_WORDS = [
  'hopefully',
  'maybe',
  'sorry',
  'apologies',
  'guess',
  'assume',
  'probably',
  'unfortunate',
  'i think',
  'might be',
  'fingers crossed',
];

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function detectSpeculativeWords(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const detected: string[] = [];
  for (const word of SPECULATIVE_WORDS) {
    if (lower.includes(word)) {
      detected.push(word);
    }
  }
  return detected;
}

export function loadSession03State(): Session03WorkstationState {
  if (typeof window === 'undefined') return INITIAL_S03_STATE;
  try {
    const raw = localStorage.getItem(S03_STORAGE_KEY);
    if (!raw) return INITIAL_S03_STATE;
    const parsed = JSON.parse(raw);
    return {
      diagnostic: {
        missingDataExplanation: parsed.diagnostic?.missingDataExplanation || parsed.criteriaNotes || '',
        creditRiskExplanation: parsed.diagnostic?.creditRiskExplanation || '',
        proposedCriteria: parsed.diagnostic?.proposedCriteria || '',
      },
      clarificationEmail: parsed.clarificationEmail || {
        recipient: parsed.messages?.find((m: any) => m.id === 'msg-clarify')?.recipient || INITIAL_S03_STATE.clarificationEmail.recipient,
        subject: parsed.messages?.find((m: any) => m.id === 'msg-clarify')?.subject || INITIAL_S03_STATE.clarificationEmail.subject,
        body: parsed.messages?.find((m: any) => m.id === 'msg-clarify')?.body || '',
      },
      progressUpdate: parsed.progressUpdate || {
        recipient: parsed.messages?.find((m: any) => m.id === 'msg-progress')?.recipient || INITIAL_S03_STATE.progressUpdate.recipient,
        subject: parsed.messages?.find((m: any) => m.id === 'msg-progress')?.subject || INITIAL_S03_STATE.progressUpdate.subject,
        body: parsed.messages?.find((m: any) => m.id === 'msg-progress')?.body || '',
      },
      escalationMessage: parsed.escalationMessage || {
        recipient: parsed.messages?.find((m: any) => m.id === 'msg-escalation')?.recipient || INITIAL_S03_STATE.escalationMessage.recipient,
        subject: parsed.messages?.find((m: any) => m.id === 'msg-escalation')?.subject || INITIAL_S03_STATE.escalationMessage.subject,
        body: parsed.messages?.find((m: any) => m.id === 'msg-escalation')?.body || '',
      },
      roadblockSimulated: parsed.roadblockSimulated ?? false,
      governance: {
        studentId: parsed.governance?.studentId || 'STU-2026-COMM',
        fileVersion: parsed.governance?.fileVersion || 'StudentID_S03_v01',
        contributionSummary: parsed.governance?.contributionSummary || '',
        peerCorrection: parsed.governance?.peerCorrection || '',
        professionalBoundary: parsed.governance?.professionalBoundary || '',
      },
      lastSaved: parsed.lastSaved || parsed.timestamp,
    };
  } catch (err) {
    console.warn('[Session03] Error loading persisted state:', err);
    return INITIAL_S03_STATE;
  }
}

export function saveSession03State(state: Session03WorkstationState): void {
  if (typeof window === 'undefined') return;
  try {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const payload = {
      ...state,
      lastSaved: time,
      // Backward-compatible structure for older workstation readers
      messages: [
        {
          id: 'msg-clarify',
          recipient: state.clarificationEmail.recipient,
          subject: state.clarificationEmail.subject,
          body: state.clarificationEmail.body,
        },
        {
          id: 'msg-progress',
          recipient: state.progressUpdate.recipient,
          subject: state.progressUpdate.subject,
          body: state.progressUpdate.body,
        },
        {
          id: 'msg-escalation',
          recipient: state.escalationMessage.recipient,
          subject: state.escalationMessage.subject,
          body: state.escalationMessage.body,
        },
      ],
      criteriaNotes: state.diagnostic.missingDataExplanation,
      timestamp: time,
    };
    localStorage.setItem(S03_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(S03_PREVIEW_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Session03] Error saving state:', err);
  }
}

