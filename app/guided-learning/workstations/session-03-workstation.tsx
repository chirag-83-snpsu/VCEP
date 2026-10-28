'use client';

import React, { useState, useEffect } from 'react';
import { EmailStudio, EmailMessage } from './components/email-studio';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Mail, Clock, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'vcep:s03:drive-v3:student-workstation';

const initialMessages: EmailMessage[] = [
  {
    id: 'msg-clarify',
    stageName: 'Stage 1: Clarification Email',
    timeContext: '11:00 AM Prompt',
    maxWords: 120,
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Clarification: Criteria & Data for Best Customers Report',
    body: 'Dear Operations Manager,\n\nRegarding your request for the "best customers" report today: to ensure this supports upcoming credit-limit decisions accurately, could you clarify whether "best" should be measured by invoiced sales volume or prompt cash collection history?\n\nCurrently, our working file contains sales invoice totals, but not customer collection logs. Basing credit limits solely on uncollected billings creates credit risk. If the accounts department can provide the payment ledger by 12:30, I will compile the ranking by 14:00. If collection data is unavailable, I propose ranking by invoiced revenue with an explicit "uncollected" caveat.\n\nPlease confirm your preferred approach by 12:00.\n\nBest regards,\n[Your Name] · Commercial Analyst',
    guidance: 'Clarify the ambiguous request ("best customers"), distinguish invoice billings from cash receipts, state why credit decisions need payment history, propose a realistic timeline, and ask for confirmation by a specific cutoff.',
    requiredElements: [
      'Maximum 120 words',
      'Distinguishes sales volume from cash collection',
      'Explains risk to credit limit decisions',
      'Specifies exact cutoffs (e.g. 12:00 confirmation, 14:00 delivery)',
    ],
  },
  {
    id: 'msg-progress',
    stageName: 'Stage 2: Progress Message',
    timeContext: '13:00 Checkpoint',
    maxWords: 40,
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Update: Best Customers Report Progress',
    body: 'Invoiced sales rankings are complete for all 15 key accounts. Awaiting the collection ledger from Accounts to verify payment history. I will review incoming ledger data and provide our next milestone update at 14:00.',
    guidance: 'Brief executive update: state what is completed, state what is pending/dependency, and specify the next touchpoint.',
    requiredElements: [
      'Maximum 40 words',
      'Reports completed work (invoiced sales)',
      'Identifies pending dependency (collection ledger)',
      'Commits to 14:00 touchpoint',
    ],
  },
  {
    id: 'msg-escalation',
    stageName: 'Stage 3: Escalation Message',
    timeContext: '14:00 Escalation',
    maxWords: 70,
    recipient: 'Operations Manager <ops.manager@company.internal>',
    subject: 'Escalation: Unavailability of Customer Payment Data',
    body: 'The collection ledger remains unavailable from Accounts. Proceeding with credit limit increases without collection history exposes us to bad debt. I have prepared the report ranked by invoiced sales, explicitly flagging unverified payment risk. I will deliver this draft by 14:30 and provide a final update before our 17:00 client meeting at 15:00.',
    guidance: 'Professional escalation: explain the commercial risk of proceeding without data, present a constructive alternative, and give a realistic next update time.',
    requiredElements: [
      'Maximum 70 words',
      'Identifies specific commercial risk (bad debt / credit default)',
      'Offers constructive workaround (invoice ranking with caveat)',
      'Achievable next update cutoff (15:00)',
    ],
  },
];

export function Session03Workstation() {
  const [messages, setMessages] = useState<EmailMessage[]>(initialMessages);
  const [activeMessageId, setActiveMessageId] = useState('msg-clarify');
  const [criteriaNotes, setCriteriaNotes] = useState(
    '1. Invoiced Volume: Total billing value (commercial scale).\n2. Collection Speed: Days Sales Outstanding (cash conversion).\n3. Default History: Disputed invoices or overdue aging.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.activeMessageId) setActiveMessageId(parsed.activeMessageId);
        if (parsed.criteriaNotes) setCriteriaNotes(parsed.criteriaNotes);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    updatedMessages: EmailMessage[],
    updatedActive: string,
    updatedNotes: string,
    updatedChecks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: updatedMessages,
          activeMessageId: updatedActive,
          criteriaNotes: updatedNotes,
          checkedIndices: updatedChecks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleMessageChange = (id: string, field: 'recipient' | 'subject' | 'body', val: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, [field]: val } : m));
    setMessages(updated);
    saveState(updated, activeMessageId, criteriaNotes, checkedIndices);
  };

  const handleSelectMessage = (id: string) => {
    setActiveMessageId(id);
    saveState(messages, id, criteriaNotes, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(messages, activeMessageId, criteriaNotes, next);
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setMessages(initialMessages);
    setActiveMessageId('msg-clarify');
    setCriteriaNotes('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All three messages written to exact word limits with required components.' },
    { name: 'Reasoning', points: 2, evidence: 'Distinguishes sales from collections; explains credit-risk implications.' },
    { name: 'Communication', points: 2, evidence: 'Professional, objective tone; unambiguous timestamps and cutoffs.' },
    { name: 'Professional Process', points: 2, evidence: 'Timely escalation at 14:00 with constructive alternative before 17:00 meeting.' },
  ];

  const checklist = [
    'My clarification email is strictly under 120 words and requests payment data.',
    'My progress message is strictly under 40 words and states dependencies clearly.',
    'My escalation message is strictly under 70 words and proposes a constructive fallback.',
    'I eliminated speculative or emotional language ("hopefully", "sorry", "maybe").',
    'I set unambiguous touchpoints (12:00 cutoff, 13:00 progress, 14:00 escalation, 15:00 update).',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Context & Business Case Briefing */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · CASE BRIEF & COMMUNICATION PROTOCOL</span>
          <h3>The "Best Customers" Dilemma</h3>
          <p>
            At 11:00 the Operations Manager writes: <em>"Send the best customers report today."</em> You possess invoice billings, but zero cash collection logs. Credit limits will be decided based on this report. You also have a mandatory 17:00 client meeting.
          </p>
        </div>

        <div className="vcep-comm-rules-banner">
          <div className="rule-box">
            <span className="rule-title">1. Professional Precision</span>
            <span className="rule-desc">Never guess or speculate. Define measurable criteria before executing unverified reports.</span>
          </div>
          <div className="rule-box">
            <span className="rule-title">2. Proactive Timing</span>
            <span className="rule-desc">Give managers advance notice of bottlenecks, not a surprise excuse 5 minutes before the cutoff.</span>
          </div>
          <div className="rule-box">
            <span className="rule-title">3. Constructive Alternatives</span>
            <span className="rule-desc">When blocked, always present an interim solution with explicit risk disclosures.</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Email Studio */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · EMAIL COMPOSITION & TONE AUDIT</span>
          <h3>Three-Stage Workplace Message Portfolio</h3>
          <p>
            Switch between the three message stages below. Keep your writing within strict word budgets and eliminate speculative phrases.
          </p>
        </div>

        <EmailStudio
          messages={messages}
          activeMessageId={activeMessageId}
          onSelectMessage={handleSelectMessage}
          onMessageChange={handleMessageChange}
        />
      </div>

      {/* 3. Objective Criteria Definition */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 03 · COMMERCIAL CRITERIA FORMULATION</span>
          <h3>Customer Qualification Criteria Definition</h3>
          <p>
            Document the three objective metrics you proposed to the manager to evaluate customer quality:
          </p>
        </div>

        <div className="vcep-field-group">
          <textarea
            rows={4}
            value={criteriaNotes}
            onChange={(e) => {
              setCriteriaNotes(e.target.value);
              saveState(messages, activeMessageId, e.target.value, checkedIndices);
            }}
            placeholder="Metric 1: Gross Invoiced Volume (commercial scale)&#10;Metric 2: Cash Collection Cycle / Days Sales Outstanding (liquidity)&#10;Metric 3: Disputed Invoice Ratio (operational risk)..."
            className="vcep-textarea-input"
          />
        </div>
      </div>

      {/* 4. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={3}
        sessionTitle="Workplace Communication"
        deliverableName="Workplace Communication Portfolio (3 Structured Emails)"
        rubric={rubric}
        checklistItems={checklist}
        checkedIndices={checkedIndices}
        onToggleChecklist={handleToggleCheck}
        draftTimestamp={draftTimestamp}
        onClearDraft={handleClear}
      />
    </div>
  );
}
