'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  VENTURE_CASES,
  VentureCase,
  loadStartupLabState,
  saveStartupLabState,
  StartupLabState,
} from '../components/session-01-startup-data';
import { ControlledAssessmentShield } from './components/controlled-assessment-shield';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Rocket,
  Users,
  Target,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Layers,
  RotateCcw,
} from 'lucide-react';

export function Session01Workstation() {
  const [labState, setLabState] = useState<StartupLabState>(loadStartupLabState);
  const [shieldConfirmed, setShieldConfirmed] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved in this browser');

  useEffect(() => {
    const loaded = loadStartupLabState();
    setLabState(loaded);
    try {
      const draft = JSON.parse(sessionStorage.getItem('vcep-drive-edition3:session:1:preview') || '{}');
      if (draft['check:0'] === 'yes') {
        setShieldConfirmed(true);
      }
    } catch {}
  }, []);

  const activeCase: VentureCase = useMemo(() => {
    return VENTURE_CASES.find((c) => c.id === labState.selectedCaseId) || VENTURE_CASES[0];
  }, [labState.selectedCaseId]);

  const updateState = (updater: (prev: StartupLabState) => StartupLabState) => {
    setLabState((prev) => {
      const next = updater(prev);
      saveStartupLabState(next);
      setSaveStatus(`Saved at ${new Date().toLocaleTimeString()}`);
      syncToSessionStorage(next);
      return next;
    });
  };

  const syncToSessionStorage = (state: StartupLabState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};
      const c = VENTURE_CASES.find((item) => item.id === state.selectedCaseId) || VENTURE_CASES[0];
      const prob = c.decisions.decisionA.options.find((o) => o.id === state.decisions.decisionA)?.text || '';
      const persona = c.decisions.decisionB.options.find((o) => o.id === state.decisions.decisionB)?.text || '';
      const mvp = c.decisions.decisionC.options.find((o) => o.id === state.decisions.decisionC)?.text || '';
      const first10 = c.decisions.decisionD.options.find((o) => o.id === state.decisions.decisionD)?.text || '';
      const delivery = c.decisions.decisionE.options.find((o) => o.id === state.decisions.decisionE)?.text || '';

      draft['work:analysis'] = `Selected Venture: ${c.name}. Problem: ${prob}. Persona: ${persona}. MVP: ${mvp}. First 10 Users: ${first10}. Delivery Plan: ${delivery}.`;
      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
    } catch {}
  };

  const handleSelectCase = (caseId: string) => {
    updateState((prev) => ({
      ...prev,
      selectedCaseId: caseId,
      decisions: {}, // Reset decisions when switching case
    }));
  };

  const handleSelectDecision = (step: 'decisionA' | 'decisionB' | 'decisionC' | 'decisionD' | 'decisionE', optId: string) => {
    updateState((prev) => ({
      ...prev,
      decisions: {
        ...prev.decisions,
        [step]: optId,
      },
    }));
  };

  const handleConfirmShield = () => {
    setShieldConfirmed(true);
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};
      draft['check:0'] = 'yes';
      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
    } catch {}
  };

  const completedDecisionsCount = [
    labState.decisions.decisionA,
    labState.decisions.decisionB,
    labState.decisions.decisionC,
    labState.decisions.decisionD,
    labState.decisions.decisionE,
  ].filter(Boolean).length;

  const getDecisionText = (step: 'decisionA' | 'decisionB' | 'decisionC' | 'decisionD' | 'decisionE') => {
    const optId = labState.decisions[step];
    if (!optId) return '';
    const opt = activeCase.decisions[step].options.find((o) => o.id === optId);
    return opt?.text || '';
  };

  return (
    <div className="vcep-workstation-root">
      {/* 1. Controlled Assessment Notice Banner */}
      {!shieldConfirmed ? (
        <ControlledAssessmentShield
          assessmentName="Baseline Diagnostic A (Trainer-Controlled)"
          sessionMinutes={60}
          instructions="Complete your 60-minute diagnostic baseline independently on paper/faculty sheet before starting the founder workshop. Baseline results diagnose authentic prior competence."
          isConfirmed={shieldConfirmed}
          onConfirmChange={(c) => { if (c) handleConfirmShield(); }}
        />
      ) : (
        <div className="vcep-shield-confirmed-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: '#f0fdf9', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#166534' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <ShieldCheck size={18} color="#0f766e" />
            <span>Baseline Diagnostic A Completed Independently · Founder Workstation Active</span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#047857' }}>{saveStatus}</span>
        </div>
      )}

      {/* 2. Workstation Introduction */}
      <div className="vcep-workstation-section">
        <div className="vcep-section-title-wrap">
          <span className="v3-eyebrow" style={{ color: '#0f766e' }}>STAGE 04 · FOUNDER WORKSTATION</span>
          <h3>Founder Lab: Build Your Startup Venture</h3>
          <p>
            Make five connected strategic decisions for your selected business. As you test alternative choices, your live
            <strong> Startup Launch Canvas</strong> will assemble in real time.
          </p>
        </div>

        {/* 3. Venture Case Selector */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', display: 'block', marginBottom: '8px' }}>
            Select Your Venture Simulation:
          </label>
          <div className="vcep-case-grid">
            {VENTURE_CASES.map((c) => {
              const isSelected = c.id === activeCase.id;
              return (
                <div
                  key={c.id}
                  className={`vcep-case-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectCase(c.id)}
                >
                  <div className="vcep-case-card-head">
                    <h4>{c.name}</h4>
                    <span className="vcep-case-tag">{c.tag}</span>
                  </div>
                  <p className="vcep-case-desc">{c.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Venture Case Brief */}
        <div className="vcep-case-active-brief">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#17245c', margin: 0 }}>
              Active Case Brief · {activeCase.name}
            </h4>
            <span style={{ fontSize: '11px', fontWeight: 700, background: '#f0fdf9', color: '#0f766e', padding: '3px 8px', borderRadius: '4px' }}>
              Simulated Venture
            </span>
          </div>

          <div className="vcep-case-brief-grid">
            <div className="vcep-case-brief-item">
              <strong>Target Customer Persona</strong>
              <span>{activeCase.persona}</span>
            </div>
            <div className="vcep-case-brief-item">
              <strong>Daily Inconvenience & Friction</strong>
              <span>{activeCase.inconvenience}</span>
            </div>
            <div className="vcep-case-brief-item">
              <strong>Available Seed Resources</strong>
              <span>{activeCase.resources}</span>
            </div>
            <div className="vcep-case-brief-item">
              <strong>Operational Hurdle to Overcome</strong>
              <span>{activeCase.friction}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. The 5 Connected Decisions (Founder Lab Stepper) */}
      <div className="vcep-workstation-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#17245c', margin: '0 0 4px 0' }}>
              The 5 Founder Decisions
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Choose the sharpest, most viable alternative for each stage of your venture.
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, background: completedDecisionsCount === 5 ? '#dcfce7' : '#f1f5f9', color: completedDecisionsCount === 5 ? '#15803d' : '#475569', padding: '4px 10px', borderRadius: '9999px' }}>
            {completedDecisionsCount} of 5 Completed
          </span>
        </div>

        <div className="vcep-founder-lab-stepper">
          {/* Decision A */}
          <div className={`vcep-decision-card ${labState.decisions.decisionA ? 'is-active' : ''}`}>
            <div className="vcep-decision-header">
              <span className={`vcep-decision-badge ${labState.decisions.decisionA ? 'is-completed' : ''}`}>A</span>
              <h4>{activeCase.decisions.decisionA.question}</h4>
            </div>
            <div className="vcep-decision-options-stack">
              {activeCase.decisions.decisionA.options.map((opt) => {
                const isSelected = labState.decisions.decisionA === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectDecision('decisionA', opt.id)}
                  >
                    <div className="vcep-choice-radio">
                      {isSelected && <div className="vcep-choice-radio-inner" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {labState.decisions.decisionA && (
              <div className="vcep-decision-feedback">
                <strong>Founder Logic: </strong>
                {activeCase.decisions.decisionA.options.find((o) => o.id === labState.decisions.decisionA)?.feedback}
              </div>
            )}
          </div>

          {/* Decision B */}
          <div className={`vcep-decision-card ${labState.decisions.decisionB ? 'is-active' : ''}`}>
            <div className="vcep-decision-header">
              <span className={`vcep-decision-badge ${labState.decisions.decisionB ? 'is-completed' : ''}`}>B</span>
              <h4>{activeCase.decisions.decisionB.question}</h4>
            </div>
            <div className="vcep-decision-options-stack">
              {activeCase.decisions.decisionB.options.map((opt) => {
                const isSelected = labState.decisions.decisionB === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectDecision('decisionB', opt.id)}
                  >
                    <div className="vcep-choice-radio">
                      {isSelected && <div className="vcep-choice-radio-inner" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {labState.decisions.decisionB && (
              <div className="vcep-decision-feedback">
                <strong>Founder Logic: </strong>
                {activeCase.decisions.decisionB.options.find((o) => o.id === labState.decisions.decisionB)?.feedback}
              </div>
            )}
          </div>

          {/* Decision C */}
          <div className={`vcep-decision-card ${labState.decisions.decisionC ? 'is-active' : ''}`}>
            <div className="vcep-decision-header">
              <span className={`vcep-decision-badge ${labState.decisions.decisionC ? 'is-completed' : ''}`}>C</span>
              <h4>{activeCase.decisions.decisionC.question}</h4>
            </div>
            <div className="vcep-decision-options-stack">
              {activeCase.decisions.decisionC.options.map((opt) => {
                const isSelected = labState.decisions.decisionC === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectDecision('decisionC', opt.id)}
                  >
                    <div className="vcep-choice-radio">
                      {isSelected && <div className="vcep-choice-radio-inner" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {labState.decisions.decisionC && (
              <div className="vcep-decision-feedback">
                <strong>Founder Logic: </strong>
                {activeCase.decisions.decisionC.options.find((o) => o.id === labState.decisions.decisionC)?.feedback}
              </div>
            )}
          </div>

          {/* Decision D */}
          <div className={`vcep-decision-card ${labState.decisions.decisionD ? 'is-active' : ''}`}>
            <div className="vcep-decision-header">
              <span className={`vcep-decision-badge ${labState.decisions.decisionD ? 'is-completed' : ''}`}>D</span>
              <h4>{activeCase.decisions.decisionD.question}</h4>
            </div>
            <div className="vcep-decision-options-stack">
              {activeCase.decisions.decisionD.options.map((opt) => {
                const isSelected = labState.decisions.decisionD === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectDecision('decisionD', opt.id)}
                  >
                    <div className="vcep-choice-radio">
                      {isSelected && <div className="vcep-choice-radio-inner" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {labState.decisions.decisionD && (
              <div className="vcep-decision-feedback">
                <strong>Founder Logic: </strong>
                {activeCase.decisions.decisionD.options.find((o) => o.id === labState.decisions.decisionD)?.feedback}
              </div>
            )}
          </div>

          {/* Decision E */}
          <div className={`vcep-decision-card ${labState.decisions.decisionE ? 'is-active' : ''}`}>
            <div className="vcep-decision-header">
              <span className={`vcep-decision-badge ${labState.decisions.decisionE ? 'is-completed' : ''}`}>E</span>
              <h4>{activeCase.decisions.decisionE.question}</h4>
            </div>
            <div className="vcep-decision-options-stack">
              {activeCase.decisions.decisionE.options.map((opt) => {
                const isSelected = labState.decisions.decisionE === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectDecision('decisionE', opt.id)}
                  >
                    <div className="vcep-choice-radio">
                      {isSelected && <div className="vcep-choice-radio-inner" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {labState.decisions.decisionE && (
              <div className="vcep-decision-feedback">
                <strong>Founder Logic: </strong>
                {activeCase.decisions.decisionE.options.find((o) => o.id === labState.decisions.decisionE)?.feedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Live Compiled Startup Launch Canvas */}
      <div className="vcep-startup-canvas-container">
        <div className="vcep-canvas-head">
          <div>
            <span className="v3-eyebrow" style={{ color: '#0f766e' }}>IN-PLATFORM FOUNDER ARTIFACT</span>
            <h3 style={{ fontSize: '20px', fontWeight: 850, color: '#17245c', margin: '4px 0 0 0' }}>
              Startup Launch Canvas · {activeCase.name}
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            {completedDecisionsCount === 5 ? '✓ Ready for Classroom Defence' : `${completedDecisionsCount}/5 Decisions Completed`}
          </span>
        </div>

        <div className="vcep-canvas-grid">
          {/* Card 1: Venture Concept */}
          <div className="vcep-canvas-cell cell-highlight">
            <span className="vcep-canvas-cell-title">1. Startup Concept</span>
            <div className="vcep-canvas-cell-body">
              <strong>{activeCase.name}</strong>
              <p style={{ marginTop: '4px', fontSize: '11.5px', color: '#475569' }}>{activeCase.summary}</p>
            </div>
          </div>

          {/* Card 2: Core Problem */}
          <div className="vcep-canvas-cell">
            <span className="vcep-canvas-cell-title">2. Customer Problem</span>
            <div className="vcep-canvas-cell-body">
              {getDecisionText('decisionA') || <span className="vcep-canvas-empty">Pending Decision A</span>}
            </div>
          </div>

          {/* Card 3: Target Customer */}
          <div className="vcep-canvas-cell">
            <span className="vcep-canvas-cell-title">3. Target Persona</span>
            <div className="vcep-canvas-cell-body">
              {getDecisionText('decisionB') || <span className="vcep-canvas-empty">Pending Decision B</span>}
            </div>
          </div>

          {/* Card 4: Value Proposition / MVP */}
          <div className="vcep-canvas-cell cell-highlight">
            <span className="vcep-canvas-cell-title">4. Minimum Viable Service</span>
            <div className="vcep-canvas-cell-body">
              {getDecisionText('decisionC') || <span className="vcep-canvas-empty">Pending Decision C</span>}
            </div>
          </div>

          {/* Card 5: First 10 Customers */}
          <div className="vcep-canvas-cell">
            <span className="vcep-canvas-cell-title">5. First 10 Customers</span>
            <div className="vcep-canvas-cell-body">
              {getDecisionText('decisionD') || <span className="vcep-canvas-empty">Pending Decision D</span>}
            </div>
          </div>

          {/* Card 6: Delivery & Controls */}
          <div className="vcep-canvas-cell">
            <span className="vcep-canvas-cell-title">6. Fulfilment & Controls</span>
            <div className="vcep-canvas-cell-body">
              {getDecisionText('decisionE') || <span className="vcep-canvas-empty">Pending Decision E</span>}
            </div>
          </div>

          {/* Card 7: Operational Hurdle */}
          <div className="vcep-canvas-cell">
            <span className="vcep-canvas-cell-title">7. Core Vulnerability</span>
            <div className="vcep-canvas-cell-body">
              <span>{activeCase.friction}</span>
            </div>
          </div>

          {/* Card 8: Immediate Next Experiment */}
          <div className="vcep-canvas-cell cell-highlight">
            <span className="vcep-canvas-cell-title">8. Immediate Next Step</span>
            <div className="vcep-canvas-cell-body">
              <span>Conduct 10 in-person customer interviews on campus to validate price willingness.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
