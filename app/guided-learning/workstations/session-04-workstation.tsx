'use client';

import React, { useState, useEffect } from 'react';
import { ActionTrackerGrid, ActionItem } from './components/action-tracker-grid';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { CheckSquare, Clock, Users, FileText, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s04:drive-v3:student-workstation';

type AgendaItem = {
  id: string;
  time: string;
  title: string;
  objective: string;
  lead: string;
};

const initialAgenda: AgendaItem[] = [
  { id: 'a1', time: '00–02 min', title: 'Context & Delivery Cutoff', objective: 'Reiterate 17:00 client delivery commitment and review supplier delay notification.', lead: 'Project Coordinator' },
  { id: 'a2', time: '02–06 min', title: 'Option Evaluation & Commercial Tradeoff', objective: 'Compare Option A (1-day delay, zero cost) vs Option B (Substitute vendor, +₹4,000, meets 17:00).', lead: 'Commercial Analyst' },
  { id: 'a3', time: '06–09 min', title: 'Decision Authority Sign-off', objective: 'Confirm expenditure authorization from Commercial Manager for the ₹4,000 substitute PO.', lead: 'Commercial Manager' },
  { id: 'a4', time: '09–12 min', title: 'Action Allocation & RACI Ownership', objective: 'Assign single accountable owners, verification evidence, and intermediate cutoffs.', lead: 'Operations Lead' },
];

const initialActions: ActionItem[] = [
  { id: 'act-1', task: 'Issue substitute purchase order for ₹4,000', owner: 'Rohan Sharma', authority: 'Commercial Manager', deadline: '13:00 Today', status: 'Complete', evidence: 'PO PDF #809 signed' },
  { id: 'act-2', task: 'Inspect substitute vendor raw materials at arrival', owner: 'Priya Nair', authority: 'QA Lead', deadline: '14:30 Today', status: 'In Progress', evidence: 'Goods Receipt Note & QC Tag' },
  { id: 'act-3', task: 'Consolidate client deliverable file and run cross-checks', owner: 'Student 1 (You)', authority: 'Project Coordinator', deadline: '16:00 Today', status: 'In Progress', evidence: 'Signed QC Checklist' },
  { id: 'act-4', task: 'Issue client dispatch notice and tracking receipt', owner: 'Karthik Rao', authority: 'Account Manager', deadline: '16:45 Today', status: 'Open', evidence: 'Client Dispatch Email' },
];

export function Session04Workstation() {
  const [agenda, setAgenda] = useState<AgendaItem[]>(initialAgenda);
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [dnbState, setDnbState] = useState({
    done: 'Conducted 12-minute squad review on supplier delay. Evaluated ₹4,000 substitute vendor cost versus contractual penalty; Commercial Manager approved emergency PO #809.',
    next: 'Supervising material delivery at 14:30 and completing final quality inspection before packaging client deliverable at 16:00.',
    blocker: 'None currently; substitute vendor tracking confirms on-route status with courier ETA at 14:15.',
  });
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agenda) setAgenda(parsed.agenda);
        if (parsed.actions) setActions(parsed.actions);
        if (parsed.dnbState) setDnbState(parsed.dnbState);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    updatedActions: ActionItem[],
    updatedDnb: typeof dnbState,
    updatedChecks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          agenda,
          actions: updatedActions,
          dnbState: updatedDnb,
          checkedIndices: updatedChecks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleActionChange = (id: string, field: keyof ActionItem, value: string) => {
    const updated = actions.map((a) => (a.id === id ? { ...a, [field]: value } : a));
    setActions(updated);
    saveState(updated, dnbState, checkedIndices);
  };

  const handleDnbChange = (field: 'done' | 'next' | 'blocker', value: string) => {
    const updated = { ...dnbState, [field]: value };
    setDnbState(updated);
    saveState(actions, updated, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(actions, dnbState, next);
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setActions(initialActions);
    setDnbState({ done: '', next: '', blocker: '' });
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Structured 4-item agenda, complete minutes, and RACI action tracker.' },
    { name: 'Reasoning', points: 2, evidence: 'Evaluated commercial tradeoff between ₹4,000 substitute and missed client deadline.' },
    { name: 'Communication', points: 2, evidence: 'Crisp 90-second Done-Next-Blocker flash report delivered within time limit.' },
    { name: 'Professional Process', points: 2, evidence: 'Named individual owners, specific time cutoffs, and required evidence links.' },
  ];

  const checklist = [
    'Our agenda allocated realistic timeboxes totaling exactly 12 minutes.',
    'Every action item has exactly 1 named owner and 1 designated approval authority.',
    'Deadlines are specific timestamps (e.g. 13:00, 14:30), not vague dates like "EOD".',
    'The 90-second DNB update articulates Done, Next, and Blocker without rambling.',
    'The commercial decision balances cost impact (+₹4,000) against client trust.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Timed 4-Item Meeting Agenda */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · STRUCTURED 12-MINUTE MEETING AGENDA</span>
          <h3>Client Delivery Emergency Meeting</h3>
          <p>
            Delivery is due today at 17:00. The primary supplier notified a 1-day delay. A substitute vendor can deliver on time for ₹4,000 extra. Run a focused 12-minute meeting to resolve.
          </p>
        </div>

        <div className="vcep-agenda-timeline">
          {agenda.map((item, idx) => (
            <div key={item.id} className="vcep-agenda-card">
              <div className="agenda-time">
                <Clock size={12} aria-hidden="true" />
                <span>{item.time}</span>
              </div>
              <div className="agenda-main">
                <h5>{item.title}</h5>
                <p>{item.objective}</p>
                <span className="agenda-lead">Session Lead: {item.lead}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RACI Action Item Tracker & DNB Flash Update */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · ACTION TRACKER & EXECUTIVE FLASH</span>
          <h3>Decisions, Owners & 90-Second DNB Status Report</h3>
          <p>
            Capture accountable owners, approval authorities, and proof artifacts. Update the 90-second Done-Next-Blocker flash update for senior management.
          </p>
        </div>

        <ActionTrackerGrid
          actions={actions}
          onActionChange={handleActionChange}
          dnbState={dnbState}
          onDnbChange={handleDnbChange}
        />
      </div>

      {/* 3. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={4}
        sessionTitle="Meetings and Reporting"
        deliverableName="Meeting Minutes & RACI Action Tracker"
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
