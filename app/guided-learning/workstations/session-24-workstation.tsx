'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceHandoverCard } from './components/evidence-handover-card';
import { Award, ShieldCheck, CheckCircle2, UserCheck, Calendar, FileText, ExternalLink, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'vcep:s24:drive-v3:student-workstation';

export type CompetencyBadge = {
  id: string;
  domain: string;
  level: string;
  verifiedArtifact: string;
  certifiedDate: string;
  status: 'CERTIFIED & VERIFIED';
};

export type ScorecardItem = {
  dimension: string;
  maxPoints: number;
  awardedPoints: number;
  evaluatorNote: string;
};

export type CareerMilestone = {
  timeframe: string;
  targetDomain: string;
  actionPlan: string;
  evidenceOutcome: string;
};

export type Session24State = {
  badges: CompetencyBadge[];
  scorecard: ScorecardItem[];
  careerMilestones: CareerMilestone[];
  checkedIndices: number[];
  timestamp?: string;
};

const initialBadges: CompetencyBadge[] = [
  {
    id: 'VCEP-COMP-01',
    domain: 'Financial Modeling & Receivables Reconciliation',
    level: 'Mastery (Level 4)',
    verifiedArtifact: 'VCEP-ART-S07 & VCEP-ART-S19 (Zero Variance Reconciliations)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
  {
    id: 'VCEP-COMP-02',
    domain: 'Bank Reconciliation & Cash Flow Management',
    level: 'Advanced (Level 4)',
    verifiedArtifact: 'VCEP-ART-S08 & VCEP-ART-S20 (BRS Timing Bridge & Deficit Model)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
  {
    id: 'VCEP-COMP-03',
    domain: 'Statutory GST Compliance & Tax Invoicing',
    level: 'Proficient (Level 3)',
    verifiedArtifact: 'VCEP-ART-S11 (GSTR-2B Matching Register & Non-Compliant Flags)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
  {
    id: 'VCEP-COMP-04',
    domain: 'Enterprise AI Auditing & DPDP Governance',
    level: 'Advanced (Level 4)',
    verifiedArtifact: 'VCEP-ART-S13 & VCEP-ART-S14 (DPDP Sanitization & Fail-Closed Tests)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
  {
    id: 'VCEP-COMP-05',
    domain: 'Commercial Decision Modeling & Break-Even Analysis',
    level: 'Mastery (Level 4)',
    verifiedArtifact: 'VCEP-ART-S16 (Break-Even Simulation & 0-Gain Trap Analysis)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
  {
    id: 'VCEP-COMP-06',
    domain: 'Project Governance, WBS & Change Control',
    level: 'Mastery (Level 4)',
    verifiedArtifact: 'VCEP-ART-S18 & VCEP-ART-S20 (WBS RACI & Change Control Board Log)',
    certifiedDate: 'October 2026',
    status: 'CERTIFIED & VERIFIED',
  },
];

const initialScorecard: ScorecardItem[] = [
  {
    dimension: 'Execution',
    maxPoints: 4,
    awardedPoints: 4,
    evaluatorNote: 'Flawless 3-minute live demonstration; Model v2.0 recalculated dynamically with zero variance.',
  },
  {
    dimension: 'Reasoning',
    maxPoints: 2,
    awardedPoints: 2,
    evaluatorNote: 'Exceptional defense of commercial trade-offs and mathematical rejection of the 10% discount trap.',
  },
  {
    dimension: 'Communication',
    maxPoints: 2,
    awardedPoints: 2,
    evaluatorNote: 'Clear executive briefing, crisp slide design, and highly professional verbal articulation.',
  },
  {
    dimension: 'Professional Process',
    maxPoints: 2,
    awardedPoints: 2,
    evaluatorNote: 'Complete audit trail, verified CCB log, and strict adherence to 6.0-hour individual effort cap.',
  },
];

const initialMilestones: CareerMilestone[] = [
  {
    timeframe: 'Day 1–30',
    targetDomain: 'Technical Advanced Modeling',
    actionPlan: 'Translate VCEP spreadsheet models into dynamic Power BI dashboards and automate daily cash scraping.',
    evidenceOutcome: 'Published interactive Power BI portfolio dashboard.',
  },
  {
    timeframe: 'Day 31–60',
    targetDomain: 'Professional Brand & Case Studies',
    actionPlan: 'Write two technical case study articles on LinkedIn detailing the BRS timing bridge and the discount trap.',
    evidenceOutcome: 'Two published case studies linking to verified VCEP artifact IDs.',
  },
  {
    timeframe: 'Day 61–90',
    targetDomain: 'Corporate Placement & Transition',
    actionPlan: 'Target 5 corporate finance and FP&A analyst roles, utilizing the verified Industry Passport transcript.',
    evidenceOutcome: 'Full-time corporate placement with verified competency record.',
  },
];

export function Session24Workstation() {
  const [state, setState] = useState<Session24State>({
    badges: initialBadges,
    scorecard: initialScorecard,
    careerMilestones: initialMilestones,
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

  const saveState = (updated: Session24State) => {
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
      badges: initialBadges,
      scorecard: initialScorecard,
      careerMilestones: initialMilestones,
      checkedIndices: [],
    });
    setDraftTimestamp('');
  };

  const totalScore = state.scorecard.reduce((sum, s) => sum + s.awardedPoints, 0);

  const rubric = [
    { name: 'Execution', points: 4, evidence: 'Demo Day briefing delivered; Industry Passport verified across all 6 core competencies.' },
    { name: 'Reasoning', points: 2, evidence: 'Articulates technical rationale for model assumptions during individual viva station.' },
    { name: 'Communication', points: 2, evidence: 'Professional boardroom presence, active listening, and concise answers to evaluator inquiries.' },
    { name: 'Professional Process', points: 2, evidence: 'Audited competency transcript and formulated structured 90-day post-programme career plan.' },
  ];

  const checklist = [
    'I delivered the final 7-minute executive presentation on Demo Day.',
    'I defended my individual project contribution before external industry evaluators.',
    'I verified all 6 competency badges on my official VCEP Industry Passport.',
    'I checked that each competency links to verified artifact IDs with zero discrepancies.',
    'I reviewed my 10/10 Demo Day evaluation scorecard and faculty feedback.',
    'I formulated an actionable 90-day post-graduation professional career plan.',
  ];

  return (
    <div className="vcep-workstation-root">
      {/* 1. Official Industry Passport Header */}
      <div className="vcep-workstation-section">
        <div style={{ background: 'linear-gradient(135deg, #17245C 0%, #0F766E 100%)', borderRadius: '10px', padding: '20px', color: '#fff', marginBottom: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={32} style={{ color: '#E5AF2E' }} />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E5AF2E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  OFFICIAL COMPETENCY TRANSCRIPT · VCEP 2026
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#fff', fontSize: '1.4rem' }}>
                  Vayentra Industry Passport & Competency Record
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '6px' }}>
              <ShieldCheck size={18} style={{ color: '#E5AF2E' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>FACULTY & JURY VERIFIED</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
            The VCEP Industry Passport validates verified workplace execution. Unlike certificates of mere attendance, this document certifies demonstrated competency across financial modeling, statutory compliance, AI auditing, and project governance.
          </p>
        </div>

        <div className="vcep-data-principles-banner">
          <div className="principle-item">
            <span className="principle-num">1</span>
            <strong>Competence Over Attendance:</strong> True professional value is demonstrated through verified deliverables, not passive classroom hours.
          </div>
          <div className="principle-item">
            <span className="principle-num">2</span>
            <strong>Verifiable Credentials:</strong> Every badge in this transcript references an authentic simulation artifact that recruiters can inspect and audit.
          </div>
          <div className="principle-item">
            <span className="principle-num">3</span>
            <strong>Continuous Career Trajectory:</strong> Completion of VCEP is not the end of learning; it is the foundation for an accelerated 90-day corporate career transition.
          </div>
        </div>
      </div>

      {/* 2. Six Core Competency Badges Matrix */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Sparkles size={18} /> Six Certified Professional Competency Transcripts
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {state.badges.map((b) => (
              <div
                key={b.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#0F766E', fontSize: '0.75rem' }}>{b.id}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px' }}>
                    {b.status}
                  </span>
                </div>

                <div style={{ fontWeight: 700, color: '#17245C', fontSize: '0.9rem', marginBottom: '4px' }}>
                  {b.domain}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginBottom: '6px' }}>
                  Proficiency: {b.level}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4 }}>
                  <strong>Verified Artifact:</strong> {b.verifiedArtifact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Demo Day Evaluation Scorecard */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: 0 }}>
              <UserCheck size={18} /> External Jury Evaluation Scorecard
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17245C' }}>
                Total Honors Score:
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, background: '#15803d', color: '#fff', padding: '2px 10px', borderRadius: '4px' }}>
                {totalScore} / 10 Points (Grade A+)
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="vcep-comparison-table" style={{ width: '100%', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Evaluation Pillar</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Score</th>
                  <th>Industry Jury Feedback & Commendation</th>
                </tr>
              </thead>
              <tbody>
                {state.scorecard.map((sc) => (
                  <tr key={sc.dimension}>
                    <td style={{ fontWeight: 700, color: '#17245C' }}>{sc.dimension}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#0F766E' }}>
                      {sc.awardedPoints} / {sc.maxPoints} pts
                    </td>
                    <td style={{ color: '#374151' }}>{sc.evaluatorNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. 90-Day Post-Programme Career Action Plan */}
      <div className="vcep-workstation-section">
        <div className="v3-panel" style={{ margin: 0, padding: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#17245C', margin: '0 0 12px' }}>
            <Calendar size={18} /> 90-Day Post-Programme Career Acceleration Plan
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.careerMilestones.map((m) => (
              <div key={m.timeframe} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#0F766E', fontSize: '0.8rem' }}>{m.timeframe}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Focus: {m.targetDomain}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#17245C', fontWeight: 500, marginBottom: '4px' }}>
                  <strong>Action Plan: </strong>{m.actionPlan}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                  <strong>Deliverable Milestone: </strong>{m.evidenceOutcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Evidence Handover & Checklist */}
      <div className="vcep-workstation-section">
        <EvidenceHandoverCard
          sessionId={24}
          sessionTitle="Corporate Demo Day and Industry Passport"
          deliverableName="Verified Industry Passport & 90-Day Career Plan"
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
