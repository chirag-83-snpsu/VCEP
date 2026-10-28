'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Presentation, Clock, Play, HelpCircle, Layers, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

const STORAGE_KEY = 'vcep:s23:drive-v3:student-workstation';

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
};

export type DefenseChallenge = {
  id: string;
  reviewerQuestion: string;
  squadDefenseStrategy: string;
};

export type Session23State = {
  agenda: AgendaSection[];
  slides: PresentationSlide[];
  challenges: DefenseChallenge[];
  demoScript: string;
  checkedIndices: number[];
  timestamp?: string;
};

const initialAgenda: AgendaSection[] = [
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

const initialSlides: PresentationSlide[] = [
  {
    slideNum: 1,
    title: 'Executive Overview & Squad Roles',
    keyPoints: ['Vayentra Labs Capstone Project', 'Squad member roles and RACI assignments', 'Executive briefing agenda and time budget'],
    evidenceReference: 'Session 18 Project Charter',
  },
  {
    slideNum: 2,
    title: 'The Liquidity Challenge: ₹20,000 Deficit',
    keyPoints: ['₹1,00,000 in receivables locked across 4 invoices', '₹25,000 opening bank cash vs ₹45,000 mandatory payroll outflows', 'Urgent need for targeted collections without high-interest debt'],
    evidenceReference: 'Case F Baseline Ledger',
  },
  {
    slideNum: 3,
    title: 'Model v2.0 Architecture & Ledger Adjustments',
    keyPoints: ['₹5,000 approved credit note on Beacon F02 (₹95,000 total)', '₹8,000 vendor outflow deferred past 7 days', 'Immediate payroll deficit compressed from ₹20,000 to ₹12,000'],
    evidenceReference: 'Change Control Log (CR-01 & CR-02)',
  },
  {
    slideNum: 4,
    title: 'Live Working Demonstration (3 Minutes)',
    keyPoints: ['Dynamic As-Of Date sensitivity (31 Oct vs 01 Nov)', 'Suspense account quarantine of disputed sums', '7-day cash forecast showing positive closing liquidity'],
    evidenceReference: 'Live Excel Model v2.0',
  },
  {
    slideNum: 5,
    title: 'Commercial Analysis: The 10% Discount Trap',
    keyPoints: ['Baseline 25 seats @ ₹10k generates ₹30,000 profit (83.3% capacity)', 'Proposed 30 seats @ ₹9k generates ₹30,000 profit (100% capacity)', 'Counter-proposal: Discount only incremental seats 26–30'],
    evidenceReference: 'Session 16 Break-Even Simulator',
  },
  {
    slideNum: 6,
    title: 'Governance, Scope Boundaries & Q&A',
    keyPoints: ['Explicit data exclusion: Case F and Case G remain strictly separate', 'Max 6.0 hours individual student effort cap respected', 'Open for 8 minutes of Board questions'],
    evidenceReference: 'Quality Assurance Test Register',
  },
];

const initialChallenges: DefenseChallenge[] = [
  {
    id: 'CH-01',
    reviewerQuestion: 'Why did your squad recommend against offering a 10% discount on all 30 seats?',
    squadDefenseStrategy:
      'We proved mathematically that selling 30 seats at ₹9,000 generates exactly ₹30,000 profit—identical to our 25-seat baseline. The company would take on 5 additional client accounts and operate at 100% capacity with zero reserve buffer for ₹0 incremental profit.',
  },
  {
    id: 'CH-02',
    reviewerQuestion: 'What contingency exists if Beacon Logistics refuses to pay the remaining ₹15,000?',
    squadDefenseStrategy:
      'Model v2.0 already isolated Beacon in suspense. Our ₹12,000 deficit is resolved by collecting Asha Technologies (₹10,000) and drawing ₹2,000 from working capital reserves, leaving operational payroll safe even in a total Beacon default.',
  },
  {
    id: 'CH-03',
    reviewerQuestion: 'Why did you not combine the CRM sales pipeline with your receivables workbook?',
    squadDefenseStrategy:
      'As confirmed in our discovery phase (Session 17), Case F accounting invoices and Case G CRM inquiries share no primary key or foreign identifier. Merging them would create false relational links and violate data boundary integrity.',
  },
];

const defaultDemoScript =
  '1. Navigate to "Control Total" sheet: Point to cell E6 showing ₹95,000 reconciled to source records.\n2. In cell B2, toggle As-Of Date from 2026-10-31 to 2026-11-01: Show the audience how invoice F01 shifts automatically from Current into 1–30 Days Overdue while the total remains ₹95,000.\n3. Navigate to "Cash Forecast" sheet: Highlight line 14 showing mandatory outflows reduced to ₹37,000 following the ₹8,000 deferral, leaving our deficit at ₹12,000.\n4. Show the collections recovery scenario: Adding Asha Technologies (₹10,000) produces a viable closing bank balance of ₹3,000 by Friday.';

export function Session23Workstation() {
  const [state, setState] = useState<Session23State>({
    agenda: initialAgenda,
    slides: initialSlides,
    challenges: initialChallenges,
    demoScript: defaultDemoScript,
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

  const saveState = (updated: Session23State) => {
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
      agenda: initialAgenda,
      slides: initialSlides,
      challenges: initialChallenges,
      demoScript: defaultDemoScript,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const totalTime = state.agenda.reduce((sum, a) => sum + a.durationMinutes, 0);

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Structured 6-slide deck, 7-minute agenda with 3-minute demo, and 3 defense challenge strategies.' },
    { name: 'Reasoning', points: 2, evidence: 'Defends commercial trade-offs (discount trap) and explains operational risk management.' },
    { name: 'Communication', points: 2, evidence: 'Clear time management, professional slide structure, and polished live demonstration script.' },
    { name: 'Professional Process', points: 2, evidence: 'Strict adherence to 7-minute budget and explicit allocation of speaking roles across all squad members.' },
  ];

  const checklist = [
    'I structured the executive presentation strictly within the 7-minute time limit.',
    'I allocated exactly 3 minutes of the presentation for a live working model demo.',
    'I designed a 6-slide executive deck following the standard VCEP corporate structure.',
    'I assigned specific speaking roles and time budgets to every squad member.',
    'I scripted the step-by-step live demonstration for Model v2.0.',
    'I formulated defense responses to 3 challenging reviewer questions.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Header & Principles */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="vcep-eyebrow">STAGE 04 · EXECUTIVE PRESENTATION & LIVE DEMO STUDIO</span>
          <h3>Structure 6-Slide Executive Deck & Rehearse 7-Minute Briefing</h3>
          <p>
            Corporate Presentation Preparation for Vayentra Labs: Structure a high-impact 6-slide executive presentation, budget a strict 7-minute briefing with a 3-minute live model demonstration, and rehearse defense strategies.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>The 7-Minute Rule:</strong> Corporate leadership demands brevity. You have exactly 7 minutes to present, followed by 8 minutes of cross-examination.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Show the Living Model:</strong> 3 minutes of your briefing must demonstrate live calculations. Static screenshots are unconvincing; dynamic models prove competence.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Shared Squad Defense:</strong> Every member must own and defend their specific contribution. No member can remain a passive observer.
          </div>
        </div>
      </div>

      {/* 2. 7-Minute Timed Presentation Agenda */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <Clock size={18} /> 7-Minute Squad Briefing Agenda & Speaker Time Budget
            </h4>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: totalTime === 7 ? '#ecfdf5' : '#fee2e2',
                color: totalTime === 7 ? '#047857' : '#b91c1c',
              }}
            >
              Total Budget: {totalTime} Minutes {totalTime === 7 ? '✓' : '(Must be 7 Min!)'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Time</th>
                  <th style={{ width: '60px' }}>Budget</th>
                  <th>Presentation Section</th>
                  <th style={{ width: '190px' }}>Assigned Speaker</th>
                  <th>Core Strategic Message</th>
                </tr>
              </thead>
              <tbody>
                {state.agenda.map((a) => (
                  <tr key={a.id} style={{ background: a.id === 'A3' ? '#f0fdfa' : 'transparent' }}>
                    <td style={{ fontWeight: 700, color: '#0F766E' }}>{a.minuteRange}</td>
                    <td style={{ color: '#4b5563' }}>{a.durationMinutes} min</td>
                    <td style={{ fontWeight: 600, color: '#17245C' }}>
                      {a.sectionName} {a.id === 'A3' && <span style={{ color: '#0F766E', fontSize: '0.7rem' }}>[LIVE DEMO]</span>}
                    </td>
                    <td style={{ color: '#17245C', fontWeight: 500 }}>{a.assignedSpeaker}</td>
                    <td style={{ color: '#4b5563', fontSize: '0.75rem' }}>{a.coreObjective}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. 6-Slide Executive Pitch Deck */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Presentation size={18} /> Six-Slide Executive Presentation Deck Outline
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {state.slides.map((s) => (
              <div
                key={s.slideNum}
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#0F766E', fontSize: '0.8rem' }}>
                    SLIDE {s.slideNum} OF 6
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Ref: {s.evidenceReference}</span>
                </div>

                <div style={{ fontWeight: 700, color: '#17245C', fontSize: '0.85rem', marginBottom: '6px' }}>
                  {s.title}
                </div>

                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4 }}>
                  {s.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Model Demonstration Script */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 8px' }}>
            <Play size={18} /> Three-Minute Live Model Demonstration Script
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 10px' }}>
            Step-by-step navigation cues to execute live on Model v2.0 during the demonstration window:
          </p>
          <textarea
            rows={5}
            value={state.demoScript}
            onChange={(e) => saveState({ ...state, demoScript: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.8rem', fontFamily: 'monospace', lineHeight: 1.4 }}
          />
        </div>
      </div>

      {/* 5. Reviewer Challenge Defense Register */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <HelpCircle size={18} /> Board Challenge Questions Defense Rehearsal
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.challenges.map((c) => (
              <div key={c.id} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#17245C', fontSize: '0.85rem', marginBottom: '4px' }}>
                  Board Question: "{c.reviewerQuestion}"
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  <strong style={{ color: '#0F766E' }}>Squad Defense: </strong>
                  {c.squadDefenseStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={23}
          sessionTitle="Corporate Presentation Preparation"
          deliverableName="6-Slide Executive Deck & 7-Minute Pitch Plan"
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
