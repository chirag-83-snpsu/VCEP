'use client';

import React, { useState, useEffect } from 'react';
import { TeamCharterBuilder, SquadMember, LaptopSlot } from './components/team-charter-builder';
import { DecisionScenario, DecisionOption } from './components/decision-scenario';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { UserCheck, Clock, FileText, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'vcep:s02:drive-v3:student-workstation';

const initialMembers: SquadMember[] = [
  { id: 'm1', name: 'Student 1 (You)', role: 'Owner', sharesLaptop: true, travelsLongDistance: false },
  { id: 'm2', name: 'Student 2', role: 'Reviewer', sharesLaptop: true, travelsLongDistance: false },
  { id: 'm3', name: 'Student 3', role: 'Backup', sharesLaptop: false, travelsLongDistance: true },
  { id: 'm4', name: 'Student 4', role: 'Support', sharesLaptop: false, travelsLongDistance: false },
  { id: 'm5', name: 'Student 5', role: 'Support', sharesLaptop: false, travelsLongDistance: false },
];

const initialSlots: LaptopSlot[] = [
  { time: '13:00–13:20', assignedMemberId: 'm1', activity: 'Draft financial schedules' },
  { time: '13:20–13:40', assignedMemberId: 'm2', activity: 'Audit calculations offline; paper review' },
  { time: '13:40–14:00', assignedMemberId: 'm1', activity: 'Enter data appendix rows' },
  { time: '14:00–14:20', assignedMemberId: 'm2', activity: 'Draft customer communication log' },
  { time: '14:20–14:40', assignedMemberId: 'm3', activity: 'Compile shared exception notes' },
  { time: '14:40–15:00', assignedMemberId: 'm4', activity: 'Cross-check source invoices' },
  { time: '15:00–15:20', assignedMemberId: 'm1', activity: 'Consolidate working tables' },
  { time: '15:20–15:40', assignedMemberId: 'm2', activity: 'Independent formula audit' },
];

const decisionOptions: DecisionOption[] = [
  {
    id: 'opt-wait',
    title: 'Option A: Wait Until 17:50 and Rush Unreviewed',
    actionSummary: 'Wait in hope that the delayed reviewer arrives before 18:00, then submit whatever is drafted without independent audit.',
    governanceVerdict: 'Unacceptable',
    governanceAnalysis: 'Violates delivery commitments and submits unverified calculations. Creates extreme risk of formula errors reaching stakeholders.',
    auditTrailConsequence: 'Leaves no documented escalation; team is held accountable for late or inaccurate delivery.',
  },
  {
    id: 'opt-skip',
    title: 'Option B: Skip Review and Submit Unchecked',
    actionSummary: 'Owner submits the file directly at 16:30 with an apology email stating the reviewer was absent.',
    governanceVerdict: 'High Risk',
    governanceAnalysis: 'Self-review is a major accounting risk. Defeats the purpose of the quad-eye principle in financial reporting.',
    auditTrailConsequence: 'Breaches company quality control protocols; reflects poor teamwork and lack of escalation planning.',
  },
  {
    id: 'opt-backup',
    title: 'Option C: Trigger Backup Protocol at 16:30 with Audit Note (Recommended)',
    actionSummary: 'Formally promote Student 3 (Designated Backup) to acting reviewer at 16:30. Notify trainer/faculty immediately with a timestamped escalation note.',
    governanceVerdict: 'Recommended',
    governanceAnalysis: 'Demonstrates robust professional governance. The backup was already briefed, allowing audit completion by 17:30 before the 18:00 cutoff.',
    auditTrailConsequence: 'Full audit trail: Documents why backup was triggered, logs who performed the review, and protects team delivery credibility.',
  },
  {
    id: 'opt-delay',
    title: 'Option D: Unilaterally Delay Submission to Next Morning',
    actionSummary: 'Decide as a squad to postpone the deadline to tomorrow without client or manager pre-authorization.',
    governanceVerdict: 'Unacceptable',
    governanceAnalysis: 'Unauthorized deadline extension breaches commercial contracts. In business, missed deadlines damage client trust.',
    auditTrailConsequence: 'Audit failure: Resulting deliverable marked as non-compliant / late.',
  },
];

export function Session02Workstation() {
  const [introText, setIntroText] = useState('');
  const [members, setMembers] = useState<SquadMember[]>(initialMembers);
  const [slots, setSlots] = useState<LaptopSlot[]>(initialSlots);
  const [selectedOptionId, setSelectedOptionId] = useState('opt-backup');
  const [justification, setJustification] = useState(
    'At 16:30, with Reviewer delayed in transit and delivery due at 18:00, we formally engage Backup (Student 3) per Clause 4 of our Squad Charter. Trainer notified via email; acting reviewer conducts independent cross-foot check from 16:45 to 17:30.'
  );
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [draftTimestamp, setDraftTimestamp] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.introText) setIntroText(parsed.introText);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.slots) setSlots(parsed.slots);
        if (parsed.selectedOptionId) setSelectedOptionId(parsed.selectedOptionId);
        if (parsed.justification) setJustification(parsed.justification);
        if (parsed.checkedIndices) setCheckedIndices(parsed.checkedIndices);
        if (parsed.timestamp) setDraftTimestamp(parsed.timestamp);
      }
    } catch {}
  }, []);

  const saveState = (
    updatedIntro: string,
    updatedMembers: SquadMember[],
    updatedSlots: LaptopSlot[],
    updatedOpt: string,
    updatedJust: string,
    updatedChecks: number[]
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setDraftTimestamp(timestamp);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          introText: updatedIntro,
          members: updatedMembers,
          slots: updatedSlots,
          selectedOptionId: updatedOpt,
          justification: updatedJust,
          checkedIndices: updatedChecks,
          timestamp,
        })
      );
    } catch {}
  };

  const handleIntroChange = (text: string) => {
    setIntroText(text);
    saveState(text, members, slots, selectedOptionId, justification, checkedIndices);
  };

  const handleMembersChange = (updated: SquadMember[]) => {
    setMembers(updated);
    saveState(introText, updated, slots, selectedOptionId, justification, checkedIndices);
  };

  const handleSlotsChange = (updated: LaptopSlot[]) => {
    setSlots(updated);
    saveState(introText, members, updated, selectedOptionId, justification, checkedIndices);
  };

  const handleOptionChange = (optId: string) => {
    setSelectedOptionId(optId);
    saveState(introText, members, slots, optId, justification, checkedIndices);
  };

  const handleJustificationChange = (text: string) => {
    setJustification(text);
    saveState(introText, members, slots, selectedOptionId, text, checkedIndices);
  };

  const handleToggleCheck = (index: number) => {
    const next = checkedIndices.includes(index)
      ? checkedIndices.filter((i) => i !== index)
      : [...checkedIndices, index];
    setCheckedIndices(next);
    saveState(introText, members, slots, selectedOptionId, justification, next);
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIntroText('');
    setMembers(initialMembers);
    setSlots(initialSlots);
    setSelectedOptionId('opt-backup');
    setJustification('');
    setCheckedIndices([]);
    setDraftTimestamp('');
  };

  // Word count & pacing for 90s pitch (90s = approx 130-160 words speaking at normal speed)
  const wordCount = introText.trim() ? introText.trim().split(/\s+/).length : 0;
  const isOptimalLength = wordCount >= 110 && wordCount <= 170;

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Complete charter with output, owner, reviewer, backup, and shared-laptop rota.' },
    { name: 'Reasoning', points: 2, evidence: 'Distinguishes accountability from task execution; conflict-free laptop rota.' },
    { name: 'Communication', points: 2, evidence: '90-second intro based on actual skills; transparent escalation clause.' },
    { name: 'Professional Process', points: 2, evidence: 'Verbal check defended; feedback correction recorded; backup protocol justified.' },
  ];

  const checklist = [
    'My 90-second introduction describes a real, current skill without exaggeration (110–170 words).',
    'Our charter names 1 accountable owner, 1 independent reviewer, and 1 designated backup.',
    'We scheduled realistic shared-laptop timeboxes with zero keyboard overlap for sharing members.',
    'I can verbally defend my output, reviewer, and escalation threshold in my own words.',
    'Our escalation note specifies the exact audit trail logged at 16:30.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. 90-Second Professional Elevator Pitch Builder */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 01 · PROFESSIONAL IDENTITY</span>
          <h3>90-Second Professional Introduction Builder</h3>
          <p>
            Structure an authentic, evidence-backed introduction linking your actual commerce skills to an entry-level professional responsibility. Avoid exaggerated claims or buzzwords.
          </p>
        </div>

        <div className="vcep-pitch-guidance">
          <div className="pitch-col">
            <strong>Hook & Background (0–25s):</strong> Your academic discipline and primary technical focus area.
          </div>
          <div className="pitch-col">
            <strong>Demonstrated Capability (25–65s):</strong> 1 concrete entry-level task you can execute reliably (e.g. data cleaning, journalizing).
          </div>
          <div className="pitch-col">
            <strong>Corporate Value & Standards (65–90s):</strong> Your commitment to verifiable evidence, attention to detail, and squad communication.
          </div>
        </div>

        <div className="vcep-field-group" style={{ marginTop: '1rem' }}>
          <label className="vcep-field-label">
            <span>Draft Your 90-Second Verbal Introduction</span>
            <span className="field-hint">Aim for 120–150 spoken words (~90 seconds at normal executive tempo):</span>
          </label>
          <textarea
            rows={5}
            value={introText}
            onChange={(e) => handleIntroChange(e.target.value)}
            placeholder="Hello, I am [Name], a commerce student specializing in corporate financial analysis. Over the past months, I have built practical competency in cleaning messy transactional datasets, maintaining double-entry trial balances, and cross-reconciling bank and book ledgers..."
            className="vcep-textarea-input"
          />
          <div className="vcep-pacing-indicator">
            <span className={`pacing-badge ${isOptimalLength ? 'is-good' : 'is-warning'}`}>
              <Clock size={12} aria-hidden="true" />
              <span>{wordCount} Words ({Math.round((wordCount / 135) * 90)}s spoken estimate)</span>
            </span>
            <span className="pacing-text">
              {wordCount < 110
                ? 'A bit brief. Add detail on 1 specific tool or method you use to verify accuracy.'
                : wordCount > 170
                ? 'A bit long for 90 seconds. Trim fluff to stay within the executive time limit.'
                : 'Optimal executive pitch pacing (approx 90 seconds).'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Team Charter & Shared-Laptop Timeline Rota */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 02 · TEAM CHARTER & HARDWARE ROTA</span>
          <h3>Squad Accountability Matrix & Shared-Laptop Scheduler</h3>
          <p>
            Five-person squad: Student 1 & 2 share 1 laptop. Student 3 has a 90-minute commute. Reviewer is absent on submission day. Delivery deadline is 18:00.
          </p>
        </div>

        <TeamCharterBuilder
          members={members}
          slots={slots}
          onMembersChange={handleMembersChange}
          onSlotsChange={handleSlotsChange}
        />
      </div>

      {/* 3. Urgent Decision Scenario: Absent Reviewer at 16:30 */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 03 · CRISIS GOVERNANCE SIMULATION</span>
          <h3>Absent Reviewer Escalation Decision (16:30 Checkpoint)</h3>
          <p>
            Submission is due at 18:00. The designated reviewer is stuck in transit and out of communication. The draft model is 80% finished. What does a professional team do?
          </p>
        </div>

        <DecisionScenario
          title="The Absent Reviewer Dilemma"
          scenarioTime="16:30 Submission Day"
          deadlineTime="18:00 Sharp"
          contextNarrative="Your squad is scheduled to deliver the reconciled commercial schedule by 18:00. At 16:30, your designated Reviewer (Student 2) remains unreachable due to an unexpected transit delay. The final model is 80% drafted by Owner (Student 1). Skipping review violates quality protocols; delaying submission breaks client commitments."
          options={decisionOptions}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleOptionChange}
          justificationNotes={justification}
          onJustificationChange={handleJustificationChange}
        />
      </div>

      {/* 4. Evidence Handover & Pre-Submission Review */}
      <EvidenceHandoverCard
        sessionId={2}
        sessionTitle="Professional Identity and Teamwork"
        deliverableName="Squad Charter & Professional Profile Deliverable"
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
