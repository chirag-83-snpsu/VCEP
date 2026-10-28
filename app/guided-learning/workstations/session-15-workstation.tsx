'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Users, Filter, CheckCircle2, Clock, AlertTriangle, Send, Mail } from 'lucide-react';

const STORAGE_KEY = 'vcep:s15:drive-v3:student-workstation';

export type CRMLeadItem = {
  id: string;
  stage: 'Won' | 'Lost' | 'Open';
  owner: string;
  nextAction: string;
  dueDate: string;
  statusText: 'Closed' | 'Overdue' | 'On Track';
};

export type Session15State = {
  leads: CRMLeadItem[];
  outreachMessage: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialLeads: CRMLeadItem[] = [
  { id: 'L01', stage: 'Won', owner: 'Owner A', nextAction: 'Archive handover', dueDate: '-', statusText: 'Closed' },
  { id: 'L02', stage: 'Won', owner: 'Owner B', nextAction: 'Archive handover', dueDate: '-', statusText: 'Closed' },
  { id: 'L03', stage: 'Won', owner: 'Owner A', nextAction: 'Archive handover', dueDate: '-', statusText: 'Closed' },
  { id: 'L04', stage: 'Lost', owner: 'Owner C', nextAction: 'Record reason', dueDate: '-', statusText: 'Closed' },
  { id: 'L05', stage: 'Lost', owner: 'Owner B', nextAction: 'Record reason', dueDate: '-', statusText: 'Closed' },
  { id: 'L06', stage: 'Open', owner: 'Owner A', nextAction: 'Confirm requirements', dueDate: '2026-10-28', statusText: 'Overdue' },
  { id: 'L07', stage: 'Open', owner: 'Owner C', nextAction: 'Review proposal', dueDate: '2026-10-30', statusText: 'Overdue' },
  { id: 'L08', stage: 'Open', owner: 'Owner B', nextAction: 'Schedule call', dueDate: '2026-11-03', statusText: 'On Track' },
];

const defaultMessage =
  'Subject: Following up on Vayentra Labs Commercial Proposal — Lead L06\n\nDear Client Leadership,\n\nI am writing to follow up on our discussion regarding your enterprise analytics requirements. Our team has finalized the proposed service scope and delivery milestones. Could we schedule a 15-minute briefing tomorrow at 11:30 to confirm your key requirements and address any questions?';

export function Session15Workstation() {
  const [state, setState] = useState<Session15State>({
    leads: initialLeads,
    outreachMessage: defaultMessage,
    checkedIndices: [],
  });
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (updated: Session15State) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    const withTime = { ...updated, timestamp };
    setState(withTime);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withTime));
    } catch {}
  };

  const handleToggleCheck = (index: number) => {
    const next = state.checkedIndices.includes(index)
      ? state.checkedIndices.filter((i) => i !== index)
      : [...state.checkedIndices, index];
    saveState({ ...state, checkedIndices: next });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({
      leads: initialLeads,
      outreachMessage: defaultMessage,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  // Funnel calculations
  const totalLeads = state.leads.length; // 8
  const wonLeads = state.leads.filter((l) => l.stage === 'Won').length; // 3
  const lostLeads = state.leads.filter((l) => l.stage === 'Lost').length; // 2
  const openLeads = state.leads.filter((l) => l.stage === 'Open').length; // 3
  const closedLeads = wonLeads + lostLeads; // 5

  const allLeadWinRate = (wonLeads / totalLeads) * 100; // 37.5%
  const closedLeadWinRate = (wonLeads / closedLeads) * 100; // 60.0%

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'All-lead win rate (37.5%) and closed-lead win rate (60.0%) calculated with explicit denominators.' },
    { name: 'Reasoning', points: 2, evidence: 'Explains why reporting closed-lead rate alone overstates pipeline velocity and hides open lead bottlenecks.' },
    { name: 'Communication', points: 2, evidence: 'Professional client re-engagement message customized to express customer requirements.' },
    { name: 'Professional Process', points: 2, evidence: 'Flags both overdue leads (L06 and L07) against the 31 October baseline with action owners.' },
  ];

  const checklist = [
    'I identified the 8 unique inquiries in Case G: 3 Won, 2 Lost, 3 Open.',
    'I calculated the All-Lead Win Rate: 3 Won ÷ 8 Total = 37.5%.',
    'I calculated the Closed-Lead Win Rate: 3 Won ÷ 5 Closed = 60.0%.',
    'I explained why both metrics are necessary to prevent deceptive pipeline reporting.',
    'I flagged L06 (due 28 Oct) and L07 (due 30 Oct) as overdue against the 31 October cut-off.',
    'I drafted an action-oriented client outreach email to re-activate the overdue lead.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · SALES OPERATIONS & CRM STUDIO</span>
          <h3>CRM Pipeline Tracking & Conversion Funnel Analysis</h3>
          <p>
            Case G CRM release as of 31 October 2026: Analyze conversion velocity across 8 sales leads. Learn why all-lead win rate and closed-lead win rate tell different business stories, and prioritize overdue follow-ups.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Transparent Denominators:</strong> Always state your denominator. All-Lead Win Rate (3 ÷ 8 = 37.5%) measures overall marketing reach; Closed-Lead Win Rate (3 ÷ 5 = 60.0%) measures sales closing power.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Pipeline Discipline:</strong> Leaving undecided leads open indefinitely conceals stalled deals and inflates projected revenues.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Timely SLA Follow-Up:</strong> A lead past its due date has high attrition risk; overdue leads must be escalated immediately.
          </div>
        </div>
      </div>

      {/* 2. Funnel Conversion Metrics Cards */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Total Pipeline Volume
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
              {totalLeads} Leads
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              {wonLeads} Won · {lostLeads} Lost · {openLeads} Open
            </div>
          </div>

          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              All-Lead Win Rate
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F766E', margin: '4px 0' }}>
              {allLeadWinRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0F766E', fontWeight: 600 }}>
              Formula: 3 Won ÷ 8 Total Leads
            </div>
          </div>

          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Closed-Lead Win Rate
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17245C', margin: '4px 0' }}>
              {closedLeadWinRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#17245C', fontWeight: 600 }}>
              Formula: 3 Won ÷ 5 Closed Deals
            </div>
          </div>

          <div className="v3-panel" style={{ margin: 0, padding: '16px', background: '#fff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>
              Overdue Follow-Ups
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b91c1c', margin: '4px 0' }}>
              2 Leads
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
              L06 (28 Oct) & L07 (30 Oct)
            </div>
          </div>
        </div>
      </div>

      {/* 3. CRM Lead Pipeline Schedule */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Users size={18} /> Case G Active CRM Schedule (As of 31 October 2026)
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(23, 36, 92, 0.15)', textAlign: 'left', color: '#17245C' }}>
                  <th style={{ padding: '8px 10px' }}>Lead ID</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Stage</th>
                  <th style={{ padding: '8px 10px' }}>Assigned Owner</th>
                  <th style={{ padding: '8px 10px' }}>Next Commercial Action</th>
                  <th style={{ padding: '8px 10px' }}>Due Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>SLA Status</th>
                </tr>
              </thead>
              <tbody>
                {state.leads.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#17245C' }}>{l.id}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: l.stage === 'Won' ? '#dcfce7' : l.stage === 'Lost' ? '#f3f4f6' : '#e0f2fe',
                          color: l.stage === 'Won' ? '#15803d' : l.stage === 'Lost' ? '#6b7280' : '#0369a1',
                        }}
                      >
                        {l.stage}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>{l.owner}</td>
                    <td style={{ padding: '8px 10px' }}>{l.nextAction}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{l.dueDate}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: l.statusText === 'Overdue' ? '#fee2e2' : l.statusText === 'On Track' ? '#fef3c7' : '#f3f4f6',
                          color: l.statusText === 'Overdue' ? '#b91c1c' : l.statusText === 'On Track' ? '#92400e' : '#6b7280',
                        }}
                      >
                        {l.statusText}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Client Re-engagement Message Drafter */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
            <Mail size={18} /> Overdue Lead Re-engagement Email (Lead L06)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Draft a professional follow-up message to customer L06 (requirements confirmation overdue since 28 Oct) proposing an immediate meeting.
          </p>
          <textarea
            rows={6}
            value={state.outreachMessage}
            onChange={(e) => saveState({ ...state, outreachMessage: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              lineHeight: 1.4,
            }}
          />
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={15}
          sessionTitle="Customer and Sales Operations"
          deliverableName="Sales Pipeline Funnel & Prioritized Lead Action Queue"
          rubric={rubric}
          checklistItems={checklist}
          checkedIndices={state.checkedIndices}
          onToggleChecklist={handleToggleCheck}
          draftTimestamp={draftTimestamp}
          onClearDraft={handleReset}
        />
      </div>
    </div>
  );
}
