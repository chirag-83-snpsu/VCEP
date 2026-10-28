'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  STARTUP_STORIES,
  VENTURE_CASES,
  BOARDROOM_ROLES,
  CRISIS_SCENARIO,
  loadStartupLabState,
  saveStartupLabState,
  StartupLabState,
} from './session-01-startup-data';
import { ControlledAssessmentShield } from '../workstations/components/controlled-assessment-shield';
import {
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export function Session01PracticeLab({
  user,
  onNavigateToTab,
}: {
  user?: any;
  onNavigateToTab?: (tab: any) => void;
}) {
  const [labState, setLabState] = useState<StartupLabState>(loadStartupLabState);
  const [shieldConfirmed, setShieldConfirmed] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Classroom Timer State (3 minutes = 180s for Boardroom discussion)
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

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

  // Timer countdown
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const updateState = (updater: (prev: StartupLabState) => StartupLabState) => {
    setLabState((prev) => {
      const next = updater(prev);
      saveStartupLabState(next);
      syncToSessionStorage(next);
      return next;
    });
  };

  const syncToSessionStorage = (state: StartupLabState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};

      // Sync story decisions into concept explanation
      const storiesCompleted = Object.keys(state.storyDecisions).length;
      if (storiesCompleted > 0 && !draft['concept:explain']) {
        draft['concept:explain'] = `Analyzed 3 leading Indian startup models: Zerodha bootstrapped trust with 100% transparent pricing and Varsity education; Nykaa proved verified authenticity drives 70%+ repeat GMV; Meesho demonstrated that 2.67 billion orders require ruthless logistics unit-cost optimization (Valmo).`;
      }

      // Sync boardroom role & crisis justification
      const roleObj = BOARDROOM_ROLES.find((r) => r.id === state.boardroom.roleId);
      if (roleObj) {
        draft['team:contribution'] = `Executive Role: ${roleObj.title}. Focus: ${roleObj.focus}. Mandate: ${roleObj.mandate}`;
      }
      if (state.boardroom.crisisRationale) {
        draft['team:judgement'] = `Crisis Strategy: ${state.boardroom.crisisChoice}. Rationale: ${state.boardroom.crisisRationale}`;
      }

      sessionStorage.setItem('vcep-drive-edition3:session:1:preview', JSON.stringify(draft));
    } catch {}
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

  const handleSelectStoryOption = (storyId: string, optionId: string) => {
    updateState((prev) => ({
      ...prev,
      storyDecisions: {
        ...prev.storyDecisions,
        [storyId]: optionId,
      },
    }));
  };

  const handleSelectCase = (caseId: string) => {
    updateState((prev) => ({
      ...prev,
      selectedCaseId: caseId,
    }));
  };

  const handleSelectRole = (roleId: string) => {
    updateState((prev) => ({
      ...prev,
      boardroom: {
        ...prev.boardroom,
        roleId,
      },
    }));
  };

  const handleSelectCrisisChoice = (choiceId: string) => {
    updateState((prev) => ({
      ...prev,
      boardroom: {
        ...prev.boardroom,
        crisisChoice: choiceId,
      },
    }));
  };

  const handleCrisisRationaleChange = (val: string) => {
    updateState((prev) => ({
      ...prev,
      boardroom: {
        ...prev.boardroom,
        crisisRationale: val,
      },
    }));
  };

  const handlePitchChange = (field: 'pitchProblem' | 'pitchSolution' | 'pitchTarget' | 'pitchMoat' | 'pitchAsk', val: string) => {
    updateState((prev) => ({
      ...prev,
      boardroom: {
        ...prev.boardroom,
        [field]: val,
      },
    }));
  };

  const activeRole = useMemo(() => {
    return BOARDROOM_ROLES.find((r) => r.id === labState.boardroom.roleId) || BOARDROOM_ROLES[0];
  }, [labState.boardroom.roleId]);

  const activeCase = useMemo(() => {
    return VENTURE_CASES.find((c) => c.id === labState.selectedCaseId) || VENTURE_CASES[0];
  }, [labState.selectedCaseId]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* 1. OVERVIEW — WELCOME TO THE STARTUP WORLD */}
      <div className="vcep-startup-overview-hero">
        <span className="v3-eyebrow">STAGE 01 · VCEP CORPORATE FOUNDATIONS</span>
        <h2>Start a Business. Think Like a Founder.</h2>
        <p>
          Discover how real Indian startups began, understand the economic engines behind their growth, and build your
          own actionable venture concept directly inside VCEP.
        </p>

        {/* Founder Challenge Callout */}
        <div className="vcep-founder-challenge-box" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderLeft: '5px solid #5eead4', color: '#ffffff' }}>
          <strong style={{ color: '#5eead4' }}>The Founder Challenge:</strong>
          <p style={{ color: '#ffffff', margin: 0 }}>
            “You have a business idea. Can you turn it into something customers genuinely want, trust, and will pay for?”
          </p>
        </div>

        {/* 3 Learning Outcomes & Deliverables */}
        <div className="v3-two" style={{ margin: '16px 0 0 0' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#5eead4', letterSpacing: '0.06em' }}>
              3 Core Learning Outcomes
            </span>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '13px', lineHeight: '1.6', color: '#e0f2fe' }}>
              <li>Analyze how Zerodha, Nykaa, and Meesho created trust and sustainable models.</li>
              <li>Make 5 connected founder decisions to build your Startup Launch Canvas.</li>
              <li>Simulate an executive boardroom response to an unexpected operational crisis.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#5eead4', letterSpacing: '0.06em' }}>
              What You Will Build Today
            </span>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6', color: '#e0f2fe' }}>
              An interactive <strong>Startup Launch Canvas</strong> covering customer friction, beachhead persona, MVP scope,
              first 10 customers plan, delivery controls, and an emergency crisis decision.
            </p>
          </div>
        </div>

        {/* 135-Minute Timetable */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#cbd5e1' }}>
          <div><strong>00–05m:</strong> Orientation</div>
          <div><strong>05–65m:</strong> Baseline Diagnostic A (60m)</div>
          <div><strong>65–75m:</strong> Break</div>
          <div><strong>75–90m:</strong> Real Startup Stories</div>
          <div><strong>90–115m:</strong> Founder Lab (Canvas)</div>
          <div><strong>115–130m:</strong> Boardroom Challenge</div>
          <div><strong>130–135m:</strong> Reflection</div>
        </div>
      </div>

      {/* Baseline A Confidential Notice */}
      {!shieldConfirmed ? (
        <ControlledAssessmentShield
          assessmentName="Baseline Diagnostic A (Trainer-Controlled)"
          sessionMinutes={60}
          instructions="Complete your 60-minute diagnostic baseline independently on paper/faculty sheet before starting the founder workshop. Baseline results diagnose authentic prior competence."
          isConfirmed={shieldConfirmed}
          onConfirmChange={(c) => { if (c) handleConfirmShield(); }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: '#f0fdf9', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#166534', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <ShieldCheck size={18} color="#0f766e" />
            <span>Baseline Diagnostic A Completed Independently · Startup Experience Active</span>
          </div>
          {onNavigateToTab && (
            <button
              type="button"
              className="v3-action-mini-btn"
              onClick={() => onNavigateToTab('Learn')}
            >
              Start Experience (Go to Learn) →
            </button>
          )}
        </div>
      )}

      {/* 2. LEARN — THREE REAL INDIAN STARTUP STORIES */}
      <div className="v3-panel">
        <div className="v3-panel-head-flex">
          <div>
            <span className="v3-eyebrow">STAGE 02 · DISCOVER REAL INDIAN STARTUPS</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#17245c', margin: '4px 0 0 0' }}>
              Three Inspiring Indian Startup Stories
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
              Read each founder’s initial challenge, make a strategic choice, and discover how real business models work.
            </p>
          </div>
        </div>

        <div className="vcep-stories-grid">
          {STARTUP_STORIES.map((story) => {
            const chosenOptId = labState.storyDecisions[story.id];
            const chosenOpt = story.options.find((o) => o.id === chosenOptId);
            const isExpanded = expandedStory === story.id;

            return (
              <div key={story.id} className="vcep-startup-story-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`vcep-story-badge ${story.badgeClass}`}>
                      {story.company} · {story.location} ({story.foundingYear})
                    </span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#0f766e', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
                      onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                    >
                      {isExpanded ? 'Less' : 'Details'} {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  <h4 className="vcep-story-hook">{story.hook}</h4>
                  <p className="vcep-story-problem">{story.problem}</p>

                  <div className="vcep-verified-fact-box">
                    <strong>Verified Business Fact ({story.reportingPeriod})</strong>
                    <span>{story.verifiedFact}</span>
                  </div>

                  {isExpanded && (
                    <div style={{ marginBottom: '14px', padding: '10px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '11.5px', color: '#334155' }}>
                      <strong style={{ display: 'block', marginBottom: '4px', color: '#17245c' }}>Business Approach:</strong>
                      <p style={{ margin: 0 }}>{story.model}</p>
                      <a
                        href={story.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="vcep-story-source-link"
                      >
                        Official Source Documentation <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                      </a>
                    </div>
                  )}

                  <div className="vcep-story-decision-prompt">{story.decisionPrompt}</div>

                  <div className="vcep-story-options">
                    {story.options.map((opt) => {
                      const isSelected = chosenOptId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`vcep-story-opt-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelectStoryOption(story.id, opt.id)}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {chosenOpt && (
                  <div className={`vcep-story-feedback ${chosenOpt.isOptimal ? '' : 'is-suboptimal'}`}>
                    <strong>{chosenOpt.isOptimal ? '✓ Founder Insight:' : '⚠️ Caution:'} </strong>
                    {chosenOpt.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CASE — HOW WOULD YOU BUILD A STARTUP? */}
      <div className="v3-panel">
        <div className="v3-panel-head-flex">
          <div>
            <span className="v3-eyebrow">STAGE 03 · CHOOSE YOUR VENTURE SIMULATION</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#17245c', margin: '4px 0 0 0' }}>
              Select a Collegiate / Local Business Problem
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
              Pick one of four realistic startup scenarios. You will build and test this concept in the Founder Lab.
            </p>
          </div>
        </div>

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

        {/* Selected Case Brief */}
        <div className="vcep-case-active-brief">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#17245c', margin: 0 }}>
              Active Simulation Brief · {activeCase.name}
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

          {onNavigateToTab && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="v3-primary"
                onClick={() => onNavigateToTab('Work')}
              >
                Proceed to Founder Lab Workstation <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. TEAM — STARTUP BOARDROOM CHALLENGE */}
      <div className="vcep-boardroom-card">
        <div className="v3-panel-head-flex">
          <div>
            <span className="v3-eyebrow">STAGE 05 · STARTUP BOARDROOM CHALLENGE</span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#17245c', margin: '4px 0 0 0' }}>
              Executive Boardroom: Handling an Operational Crisis
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
              Form a 5-person executive team. Navigate an unexpected delivery setback under time pressure.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="vcep-timer-pill">
              <Clock size={13} /> {formatTimer(timerSeconds)}
            </span>
            <button
              type="button"
              className="v3-action-mini-btn"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? 'Pause' : 'Start Discussion Timer'}
            </button>
            <button
              type="button"
              className="v3-action-mini-btn"
              onClick={() => { setTimerRunning(false); setTimerSeconds(180); }}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div style={{ marginTop: '18px' }}>
          <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '8px' }}>
            Select Your Executive Position:
          </label>
          <div className="vcep-role-selector-grid">
            {BOARDROOM_ROLES.map((r) => {
              const isSelected = r.id === activeRole.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`vcep-role-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectRole(r.id)}
                >
                  {r.title}
                </button>
              );
            })}
          </div>

          <div className="vcep-role-duty-box">
            <strong>{activeRole.title} Duty: </strong>
            <span>{activeRole.mandate} — <em>Key Priority: {activeRole.focus}</em></span>
          </div>
        </div>

        {/* Crisis Setback */}
        <div className="vcep-crisis-banner">
          <h4>⚠️ {CRISIS_SCENARIO.title}</h4>
          <p>{CRISIS_SCENARIO.scenario}</p>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CRISIS_SCENARIO.options.map((opt) => {
              const isSelected = labState.boardroom.crisisChoice === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`vcep-decision-choice-btn ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectCrisisChoice(opt.id)}
                >
                  <div className="vcep-choice-radio">
                    {isSelected && <div className="vcep-choice-radio-inner" />}
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#17245c', marginBottom: '2px' }}>{opt.title}</strong>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{opt.summary}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {labState.boardroom.crisisChoice && (
            <div className="vcep-decision-feedback" style={{ marginTop: '14px' }}>
              <strong>Boardroom Analysis: </strong>
              {CRISIS_SCENARIO.options.find((o) => o.id === labState.boardroom.crisisChoice)?.feedback}
            </div>
          )}
        </div>

        {/* Crisis Decision Justification */}
        <div style={{ marginTop: '16px' }}>
          <label className="v3-field">
            <span>Executive Justification for Strategy (Minimum 15 words):</span>
            <textarea
              rows={3}
              value={labState.boardroom.crisisRationale || ''}
              onChange={(e) => handleCrisisRationaleChange(e.target.value)}
              placeholder="Explain how your chosen strategy preserves customer trust and safeguards venture sustainability under deadline pressure."
            />
          </label>
        </div>

        {/* 60-Second Venture Pitch Builder */}
        <div className="vcep-pitch-builder">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>60-Second Venture Pitch Outline</h4>
            <span style={{ fontSize: '11px', color: '#0f766e', fontWeight: 700 }}>Founder Communication Drill</span>
          </div>

          <div className="vcep-pitch-row">
            <span className="vcep-pitch-tag">The Problem:</span>
            <input
              type="text"
              value={labState.boardroom.pitchProblem || ''}
              onChange={(e) => handlePitchChange('pitchProblem', e.target.value)}
              placeholder={`e.g., Hostellers in ${activeCase.name} spend ₹300/meal on unpalatable mess food.`}
            />
          </div>

          <div className="vcep-pitch-row">
            <span className="vcep-pitch-tag">The Solution:</span>
            <input
              type="text"
              value={labState.boardroom.pitchSolution || ''}
              onChange={(e) => handlePitchChange('pitchSolution', e.target.value)}
              placeholder={`e.g., ${activeCase.name} delivers clean, hot homestyle food directly to hostel gates.`}
            />
          </div>

          <div className="vcep-pitch-row">
            <span className="vcep-pitch-tag">Target Customer:</span>
            <input
              type="text"
              value={labState.boardroom.pitchTarget || ''}
              onChange={(e) => handlePitchChange('pitchTarget', e.target.value)}
              placeholder="e.g., 150 undergrads living in Blocks A & B without kitchen access."
            />
          </div>

          <div className="vcep-pitch-row">
            <span className="vcep-pitch-tag">Our Moat:</span>
            <input
              type="text"
              value={labState.boardroom.pitchMoat || ''}
              onChange={(e) => handlePitchChange('pitchMoat', e.target.value)}
              placeholder="e.g., Zero-ad grassroots tastings and reliable peer student runners."
            />
          </div>

          <div className="vcep-pitch-row">
            <span className="vcep-pitch-tag">The Ask:</span>
            <input
              type="text"
              value={labState.boardroom.pitchAsk || ''}
              onChange={(e) => handlePitchChange('pitchAsk', e.target.value)}
              placeholder="e.g., 20 pilot hostel subscriptions starting this Sunday."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
