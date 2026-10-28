'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  S01_STAGES,
  COLLEGE_PROBLEM_OPTIONS,
  STARTUP_STORIES,
  VENTURE_CASES,
  BOARDROOM_ROLES,
  CRISIS_SCENARIO,
  StageNumber,
  PitchSlide,
  StartupLabState,
  loadStartupLabState,
  saveStartupLabState,
  buildDefaultPitchDeck,
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
  ArrowLeft,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Presentation,
  Maximize2,
  Minimize2,
  Edit3,
  Layers,
  FileCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

interface Session01StartupJourneyProps {
  initialStage?: number;
  initialSection?: string;
  onNavigateSection?: (section: any) => void;
  onUpdateDraft?: (key: string, value: string) => void;
}

export function Session01StartupJourney({
  initialStage,
  initialSection,
  onNavigateSection,
  onUpdateDraft,
}: Session01StartupJourneyProps) {
  const [labState, setLabState] = useState<StartupLabState>(loadStartupLabState);
  const [shieldConfirmed, setShieldConfirmed] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Full-screen presentation mode
  const [isFullScreenPitch, setIsFullScreenPitch] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  // Boardroom timer state (180s = 3 minutes)
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

  // Determine active stage from props or URL
  const [currentStage, setCurrentStage] = useState<StageNumber>(() => {
    if (initialStage && initialStage >= 1 && initialStage <= 6) {
      return initialStage as StageNumber;
    }
    if (initialSection) {
      const map: Record<string, StageNumber> = {
        Overview: 1,
        Learn: 2,
        Case: 3,
        Work: 4,
        Team: 5,
        Review: 6,
      };
      if (map[initialSection]) return map[initialSection];
    }
    return 1;
  });

  // Sync with URL query parameter changes
  useEffect(() => {
    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const stageParam = Number(params.get('stage'));
      const secParam = params.get('section');
      if (Number.isInteger(stageParam) && stageParam >= 1 && stageParam <= 6) {
        setCurrentStage(stageParam as StageNumber);
      } else if (secParam) {
        const map: Record<string, StageNumber> = {
          Overview: 1,
          Learn: 2,
          Case: 3,
          Work: 4,
          Team: 5,
          Review: 6,
        };
        if (map[secParam]) setCurrentStage(map[secParam]);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Hydrate from localStorage and check Baseline A shield
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

  // Countdown timer for Boardroom
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Navigate to stage with URL update & scroll
  const goToStage = useCallback((stage: StageNumber, pushHistory = true) => {
    setCurrentStage(stage);
    if (pushHistory && typeof window !== 'undefined') {
      const u = new URL(window.location.href);
      u.searchParams.set('session', '1');
      u.searchParams.set('stage', String(stage));
      // Map to section for compatibility with legacy routers
      const sectionNames: Record<StageNumber, string> = {
        1: 'Overview',
        2: 'Learn',
        3: 'Case',
        4: 'Work',
        5: 'Team',
        6: 'Review',
      };
      u.searchParams.set('section', sectionNames[stage]);
      window.history.pushState({ session: 1, stage }, '', u.toString());
      if (onNavigateSection) {
        onNavigateSection(sectionNames[stage]);
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [onNavigateSection]);

  // State updater helper
  const updateState = (updater: (prev: StartupLabState) => StartupLabState) => {
    setLabState((prev) => {
      const next = updater(prev);
      saveStartupLabState(next);
      syncToSessionStorage(next);
      return next;
    });
  };

  // Sync to legacy sessionStorage so review engine & other components receive data
  const syncToSessionStorage = (state: StartupLabState) => {
    try {
      const raw = sessionStorage.getItem('vcep-drive-edition3:session:1:preview');
      const draft = raw ? JSON.parse(raw) : {};

      // Stage 1 Concept Explanation
      if (state.stage1?.opportunityStatement) {
        draft['concept:explain'] = `Opportunity Spotting: ${state.stage1.opportunityStatement}. Target: ${state.stage1.targetCampusPersona}. Why it matters: ${state.stage1.whyItMatters}`;
        onUpdateDraft?.('concept:explain', draft['concept:explain']);
      }

      // Stage 3 & 4 Work Analysis
      const activeCase = VENTURE_CASES.find((c) => c.id === state.selectedCaseId) || VENTURE_CASES[0];
      const prob = activeCase.decisions.decisionA.options.find((o) => o.id === state.decisions.decisionA)?.text || '';
      const persona = activeCase.decisions.decisionB.options.find((o) => o.id === state.decisions.decisionB)?.text || '';
      const mvp = activeCase.decisions.decisionC.options.find((o) => o.id === state.decisions.decisionC)?.text || '';
      const first10 = activeCase.decisions.decisionD.options.find((o) => o.id === state.decisions.decisionD)?.text || '';
      const delivery = activeCase.decisions.decisionE.options.find((o) => o.id === state.decisions.decisionE)?.text || '';

      draft['work:analysis'] = `Selected Venture: ${activeCase.name}. Problem: ${prob}. Persona: ${persona}. MVP: ${mvp}. First 10 Users: ${first10}. Delivery Plan: ${delivery}.`;
      onUpdateDraft?.('work:analysis', draft['work:analysis']);

      // Stage 5 Team
      const roleObj = BOARDROOM_ROLES.find((r) => r.id === state.boardroom.roleId) || BOARDROOM_ROLES[0];
      draft['team:contribution'] = `Executive Role: ${roleObj.title}. Focus: ${roleObj.focus}. Mandate: ${roleObj.mandate}`;
      onUpdateDraft?.('team:contribution', draft['team:contribution']);

      if (state.boardroom.crisisRationale) {
        draft['team:judgement'] = `Crisis Strategy: ${state.boardroom.crisisChoice}. Rationale: ${state.boardroom.crisisRationale}`;
        onUpdateDraft?.('team:judgement', draft['team:judgement']);
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
      onUpdateDraft?.('check:0', 'yes');
    } catch {}
  };

  const activeCase = useMemo(() => {
    return VENTURE_CASES.find((c) => c.id === labState.selectedCaseId) || VENTURE_CASES[0];
  }, [labState.selectedCaseId]);

  const activeRole = useMemo(() => {
    return BOARDROOM_ROLES.find((r) => r.id === labState.boardroom.roleId) || BOARDROOM_ROLES[0];
  }, [labState.boardroom.roleId]);

  // Stage completion flags
  const stageCompletion = useMemo(() => {
    const s1Complete = shieldConfirmed && Boolean(labState.stage1?.opportunityStatement);
    const s2Complete = Object.keys(labState.storyDecisions).length === 3;
    const s3Complete = Boolean(labState.selectedCaseId && labState.opportunityBrief?.customerProblem);
    const s4Complete = Boolean(
      labState.decisions.decisionA &&
      labState.decisions.decisionB &&
      labState.decisions.decisionC &&
      labState.decisions.decisionD &&
      labState.decisions.decisionE
    );
    const s5Complete = Boolean(labState.boardroom?.crisisChoice && labState.boardroom?.crisisRationale);
    const s6Complete = Boolean(labState.pitchDeck?.slides?.length === 8);

    return {
      1: s1Complete,
      2: s2Complete,
      3: s3Complete,
      4: s4Complete,
      5: s5Complete,
      6: s6Complete,
    };
  }, [shieldConfirmed, labState]);

  // Slide helpers for Stage 6
  const activeSlideIndex = labState.pitchDeck?.activeSlideIndex || 0;
  const slides = labState.pitchDeck?.slides || [];
  const currentSlide: PitchSlide | undefined = slides[activeSlideIndex] || slides[0];

  const handleSlideFieldChange = (slideId: number, fieldKey: string, newValue: string) => {
    updateState((prev) => {
      const updatedSlides = (prev.pitchDeck?.slides || []).map((slide) => {
        if (slide.id !== slideId) return slide;
        return {
          ...slide,
          fields: slide.fields.map((f) => (f.key === fieldKey ? { ...f, value: newValue } : f)),
        };
      });
      return {
        ...prev,
        pitchDeck: {
          ...prev.pitchDeck,
          slides: updatedSlides,
          lastSaved: new Date().toLocaleTimeString(),
        },
      };
    });
  };

  const handleSpeakerNotesChange = (slideId: number, notes: string) => {
    updateState((prev) => {
      const updatedSlides = (prev.pitchDeck?.slides || []).map((slide) => {
        if (slide.id !== slideId) return slide;
        return { ...slide, speakerNotes: notes };
      });
      return {
        ...prev,
        pitchDeck: {
          ...prev.pitchDeck,
          slides: updatedSlides,
        },
      };
    });
  };

  const handleSyncPitchFromStages = () => {
    const fresh = buildDefaultPitchDeck(activeCase, labState.decisions, labState.stage1, labState.boardroom);
    updateState((prev) => ({
      ...prev,
      pitchDeck: {
        ...prev.pitchDeck,
        slides: fresh,
        lastSaved: new Date().toLocaleTimeString(),
      },
    }));
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      updateState((prev) => ({
        ...prev,
        pitchDeck: {
          ...prev.pitchDeck,
          activeSlideIndex: activeSlideIndex + 1,
        },
      }));
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      updateState((prev) => ({
        ...prev,
        pitchDeck: {
          ...prev.pitchDeck,
          activeSlideIndex: activeSlideIndex - 1,
        },
      }));
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isFullScreenPitch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        setIsFullScreenPitch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenPitch, activeSlideIndex, slides.length]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="vcep-startup-journey-container">
      {/* =========================================================================
          STAGE NAVIGATION BAR (Shared Header)
          ========================================================================= */}
      <div className="vcep-journey-nav-header">
        <div className="vcep-journey-progress-track">
          {S01_STAGES.map((stg) => {
            const isActive = currentStage === stg.number;
            const isCompleted = stageCompletion[stg.number];
            return (
              <button
                key={stg.number}
                type="button"
                className={`vcep-journey-step-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                onClick={() => goToStage(stg.number)}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="vcep-journey-step-badge">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : `0${stg.number}`}
                </div>
                <div className="vcep-journey-step-info">
                  <span className="vcep-journey-step-num">Stage 0{stg.number}</span>
                  <span className="vcep-journey-step-title">{stg.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Stage Selector Dropdown */}
        <div className="vcep-journey-mobile-selector">
          <label htmlFor="stage-mobile-select">Select Active Stage</label>
          <select
            id="stage-mobile-select"
            value={currentStage}
            onChange={(e) => goToStage(Number(e.target.value) as StageNumber)}
          >
            {S01_STAGES.map((stg) => (
              <option key={stg.number} value={stg.number}>
                Stage 0{stg.number}: {stg.title} {stageCompletion[stg.number] ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================================================================
          STAGE 1: DISCOVER THE FOUNDER MINDSET
          ========================================================================= */}
      {currentStage === 1 && (
        <section className="vcep-stage-view" aria-labelledby="stage-1-heading">
          {/* Stage Hero */}
          <div className="vcep-startup-overview-hero">
            <span className="v3-eyebrow">STAGE 1 · FOUNDER FOUNDATIONS</span>
            <h2 id="stage-1-heading">Every Business Begins With a Problem.</h2>
            <p className="vcep-hero-lead">
              Look around you. Every service, product, and app exists because somebody identified an acute problem worth
              solving and built something people genuinely value.
            </p>

            <div className="vcep-founder-challenge-box">
              <strong>The Founder Challenge:</strong>
              <p>
                “You have a business idea. Can you turn it into something customers genuinely want, trust, and will pay for?”
              </p>
            </div>

            {/* Everyday Examples Students Recognise */}
            <div className="vcep-realworld-examples-grid">
              <div className="vcep-example-pill">
                <strong>Zomato & Swiggy:</strong> Solved late-night hostel hunger and unpalatable PG messes.
              </div>
              <div className="vcep-example-pill">
                <strong>UPI & PhonePe:</strong> Eliminated the daily frustration of finding exact ₹5 coin change.
              </div>
              <div className="vcep-example-pill">
                <strong>Zerodha:</strong> Abolished opaque 1% broker fees so regular Indians could invest freely.
              </div>
              <div className="vcep-example-pill">
                <strong>Ola & Uber:</strong> Replaced auto-rickshaw fare haggling with one-tap transparent rides.
              </div>
            </div>
          </div>

          {/* Controlled Assessment Boundary Notice (Protected Baseline A) */}
          {!shieldConfirmed ? (
            <ControlledAssessmentShield
              assessmentName="Baseline Diagnostic A (Trainer-Controlled)"
              sessionMinutes={60}
              instructions="Complete your 60-minute diagnostic baseline independently on paper/faculty sheet before starting the founder workshop. Baseline results diagnose authentic prior competence."
              isConfirmed={shieldConfirmed}
              onConfirmChange={(c) => {
                if (c) handleConfirmShield();
              }}
            />
          ) : (
            <div className="vcep-shield-confirmed-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                <ShieldCheck size={18} color="#0f766e" />
                <span>Baseline Diagnostic A Completed Independently · Founder Workstation Active</span>
              </div>
              <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>Ready for Startup Lab</span>
            </div>
          )}

          {/* Core Interactive Activity: Spot an Opportunity */}
          <div className="v3-panel">
            <div className="v3-panel-head-flex">
              <div>
                <span className="v3-eyebrow">PRACTICAL ACTIVITY · PROBLEM DISCOVERY</span>
                <h3>Spot a Real Business Opportunity Around Your College</h3>
                <p>
                  Founders don’t start with grand calculations—they notice everyday friction. Select a campus problem
                  you have personally witnessed or experienced.
                </p>
              </div>
            </div>

            <div className="vcep-problem-options-stack">
              {COLLEGE_PROBLEM_OPTIONS.map((opt) => {
                const isSelected = labState.stage1?.selectedProblemId === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`vcep-problem-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      updateState((prev) => ({
                        ...prev,
                        stage1: {
                          ...prev.stage1,
                          selectedProblemId: opt.id,
                          opportunityStatement: opt.opportunityHint,
                          targetCampusPersona: opt.description.slice(0, 100),
                        },
                      }));
                    }}
                  >
                    <div className="vcep-problem-card-top">
                      <span className="vcep-category-badge">{opt.category}</span>
                      <h4>{opt.title}</h4>
                    </div>
                    <p className="vcep-problem-desc">{opt.description}</p>
                    <div className="vcep-problem-friction">
                      <strong>Daily Friction: </strong>
                      <span>{opt.friction}</span>
                    </div>
                    <div className="vcep-problem-hint">
                      <strong>Founder Opportunity Hint: </strong>
                      <span>{opt.opportunityHint}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Student Output: One-Sentence Opportunity Brief */}
            <div className="vcep-opportunity-brief-box">
              <h4>Your Stage 1 Deliverable: One-Sentence Opportunity Brief</h4>
              <p>State the problem, who suffers from it, and what simple value your venture could create.</p>

              <div style={{ marginTop: '12px' }}>
                <label className="v3-field">
                  <span>One-Sentence Business Opportunity:</span>
                  <input
                    type="text"
                    value={labState.stage1?.opportunityStatement || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateState((prev) => ({
                        ...prev,
                        stage1: { ...prev.stage1, opportunityStatement: val },
                      }));
                    }}
                    placeholder="e.g., Deliver hot, healthy homestyle lunches directly to campus hostel gates at 1:15 PM sharp for ₹90."
                  />
                </label>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label className="v3-field">
                  <span>Why This Problem Matters (Why will customers pay for a solution?):</span>
                  <textarea
                    rows={2}
                    value={labState.stage1?.whyItMatters || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateState((prev) => ({
                        ...prev,
                        stage1: { ...prev.stage1, whyItMatters: val },
                      }));
                    }}
                    placeholder="e.g., Hostellers face oily mess food and expensive food delivery apps; saving 45 minutes of daily stress is worth ₹90."
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <span className="vcep-stage-action-hint">Stage 01 of 06 · Founder Foundations</span>
            <button type="button" className="v3-primary" onClick={() => goToStage(2)}>
              Proceed to Stage 2: Inside Real Startups <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 2: INSIDE REAL STARTUPS
          ========================================================================= */}
      {currentStage === 2 && (
        <section className="vcep-stage-view" aria-labelledby="stage-2-heading">
          <div className="v3-section-intro">
            <span className="v3-eyebrow">STAGE 2 · REAL INDIAN VENTURES</span>
            <h2 id="stage-2-heading">Three Inspiring Indian Startup Stories</h2>
            <p>
              Discover how three transformative Indian companies began. Learn how real founders solved customer trust,
              brand authenticity, and unit economics.
            </p>
          </div>

          <div className="vcep-unit-economics-callout">
            <Info size={18} color="#0f766e" style={{ flexShrink: 0 }} />
            <div>
              <strong>A Critical Founder Lesson: Revenue vs GMV vs Profitability</strong>
              <p>
                Gross Merchandise Value (GMV) is the total transaction volume passing through a platform. Revenue is
                what the company actually earns. Profit is what remains after all delivery, marketing, and operational
                costs are paid. A startup with ₹10,000 Cr in GMV can quickly go bankrupt if each delivery loses money!
              </p>
            </div>
          </div>

          {/* 3 Interactive Startup Story Cards */}
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
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0f766e',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          cursor: 'pointer',
                        }}
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
                      <div className="vcep-story-expanded-body">
                        <strong style={{ display: 'block', marginBottom: '4px', color: '#17245c' }}>
                          Business Approach:
                        </strong>
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
                            onClick={() => {
                              updateState((prev) => ({
                                ...prev,
                                storyDecisions: {
                                  ...prev.storyDecisions,
                                  [story.id]: opt.id,
                                },
                              }));
                            }}
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

          {/* Student Model Selection & Rationale */}
          <div className="v3-panel" style={{ marginTop: '24px' }}>
            <span className="v3-eyebrow">SYNTHESIS & INSPIRATION</span>
            <h3>Which Startup Model Inspires Your Venture?</h3>
            <p>Connect what you learned to your own venture thinking.</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '14px 0' }}>
              {(['zerodha', 'nykaa', 'meesho'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`vcep-model-choice-btn ${labState.storyInspiration?.chosenModel === m ? 'is-selected' : ''}`}
                  onClick={() => {
                    updateState((prev) => ({
                      ...prev,
                      storyInspiration: {
                        ...prev.storyInspiration,
                        chosenModel: m,
                      },
                    }));
                  }}
                >
                  <strong style={{ textTransform: 'capitalize' }}>{m}</strong>
                  <span>
                    {m === 'zerodha'
                      ? 'Bootstrapping & Radical Pricing Transparency'
                      : m === 'nykaa'
                      ? 'Curated Authenticity & Omnichannel Trust'
                      : 'Zero Commission & Ruthless Unit-Cost Logistics'}
                  </span>
                </button>
              ))}
            </div>

            <label className="v3-field">
              <span>Why does this model inspire your venture?</span>
              <textarea
                rows={2}
                value={labState.storyInspiration?.inspirationReason || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateState((prev) => ({
                    ...prev,
                    storyInspiration: {
                      ...prev.storyInspiration,
                      inspirationReason: val,
                    },
                  }));
                }}
                placeholder="e.g., Zerodha shows that transparent pricing and customer education build more viral trust than paying social media influencers."
              />
            </label>
          </div>

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <button type="button" className="v3-outline" onClick={() => goToStage(1)}>
              <ArrowLeft size={15} /> Previous: Founder Mindset
            </button>
            <button type="button" className="v3-primary" onClick={() => goToStage(3)}>
              Proceed to Stage 3: Business Opportunity <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 3: FIND YOUR BUSINESS OPPORTUNITY
          ========================================================================= */}
      {currentStage === 3 && (
        <section className="vcep-stage-view" aria-labelledby="stage-3-heading">
          <div className="v3-section-intro">
            <span className="v3-eyebrow">STAGE 3 · VENTURE SELECTION</span>
            <h2 id="stage-3-heading">Select Your Collegiate Venture Simulation</h2>
            <p>
              Pick one of four realistic startup opportunities. You will formulate your value proposition and take this
              concept through the Founder Lab, Boardroom crisis, and Investor Pitch Deck.
            </p>
          </div>

          {/* 4 Venture Cases Grid */}
          <div className="vcep-case-grid">
            {VENTURE_CASES.map((c) => {
              const isSelected = c.id === activeCase.id;
              return (
                <div
                  key={c.id}
                  className={`vcep-case-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    updateState((prev) => ({
                      ...prev,
                      selectedCaseId: c.id,
                      opportunityBrief: {
                        customerProblem: c.inconvenience,
                        targetPersona: c.persona,
                        existingAlternatives: 'Expensive traditional alternatives or unpalatable hostel mess.',
                        whyItMatters: 'Daily friction that disrupts study time and student peace of mind.',
                        validationEvidence: '15 preliminary interviews in Block A confirmed acute daily pain.',
                      },
                    }));
                  }}
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

          {/* Active Case Factsheet */}
          <div className="vcep-case-active-brief">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#17245c', margin: 0 }}>
                Active Venture Profile · {activeCase.name}
              </h4>
              <span className="vcep-simulation-badge">Simulated Venture Opportunity</span>
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

          {/* Startup Opportunity Brief Output */}
          <div className="v3-panel" style={{ marginTop: '24px' }}>
            <span className="v3-eyebrow">YOUR DELIVERABLE</span>
            <h3>Startup Opportunity Brief</h3>
            <p>Define the opportunity clearly before building your service in the Founder Lab.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '14px' }}>
              <label className="v3-field">
                <span>Core Customer Pain Point:</span>
                <textarea
                  rows={3}
                  value={labState.opportunityBrief?.customerProblem || activeCase.inconvenience}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({
                      ...prev,
                      opportunityBrief: { ...prev.opportunityBrief, customerProblem: val },
                    }));
                  }}
                />
              </label>

              <label className="v3-field">
                <span>Beachhead Customer Persona:</span>
                <textarea
                  rows={3}
                  value={labState.opportunityBrief?.targetPersona || activeCase.persona}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({
                      ...prev,
                      opportunityBrief: { ...prev.opportunityBrief, targetPersona: val },
                    }));
                  }}
                />
              </label>

              <label className="v3-field">
                <span>Existing Inadequate Alternatives:</span>
                <textarea
                  rows={3}
                  value={labState.opportunityBrief?.existingAlternatives || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({
                      ...prev,
                      opportunityBrief: { ...prev.opportunityBrief, existingAlternatives: val },
                    }));
                  }}
                  placeholder="What are customers forced to use right now?"
                />
              </label>

              <label className="v3-field">
                <span>Field Evidence to Validate Demand:</span>
                <textarea
                  rows={3}
                  value={labState.opportunityBrief?.validationEvidence || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateState((prev) => ({
                      ...prev,
                      opportunityBrief: { ...prev.opportunityBrief, validationEvidence: val },
                    }));
                  }}
                  placeholder="How will you prove customers genuinely care before building?"
                />
              </label>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <button type="button" className="v3-outline" onClick={() => goToStage(2)}>
              <ArrowLeft size={15} /> Previous: Inside Real Startups
            </button>
            <button type="button" className="v3-primary" onClick={() => goToStage(4)}>
              Proceed to Stage 4: Build Your Startup <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 4: BUILD YOUR STARTUP (FOUNDER LAB & LAUNCH CANVAS)
          ========================================================================= */}
      {currentStage === 4 && (
        <section className="vcep-stage-view" aria-labelledby="stage-4-heading">
          <div className="v3-section-intro">
            <span className="v3-eyebrow">STAGE 4 · INTERACTIVE FOUNDER LAB</span>
            <h2 id="stage-4-heading">Build Your Startup: The 5 Connected Decisions</h2>
            <p>
              A business is an interconnected operating system. Make five critical choices for {activeCase.name} to
              define your problem, audience, MVP scope, customer acquisition, and fulfilment controls.
            </p>
          </div>

          {/* Stepper with the 5 Decisions */}
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          decisions: { ...prev.decisions, decisionA: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
                      <div>
                        <span className="vcep-choice-tag">{opt.label}</span>
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          decisions: { ...prev.decisions, decisionB: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
                      <div>
                        <span className="vcep-choice-tag">{opt.label}</span>
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          decisions: { ...prev.decisions, decisionC: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
                      <div>
                        <span className="vcep-choice-tag">{opt.label}</span>
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          decisions: { ...prev.decisions, decisionD: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
                      <div>
                        <span className="vcep-choice-tag">{opt.label}</span>
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          decisions: { ...prev.decisions, decisionE: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
                      <div>
                        <span className="vcep-choice-tag">{opt.label}</span>
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

          {/* Compiled Live Startup Launch Canvas */}
          <div className="vcep-startup-canvas-container">
            <div className="vcep-canvas-head">
              <div>
                <span className="v3-eyebrow" style={{ color: '#0f766e' }}>STAGE 4 DELIVERABLE</span>
                <h3>Startup Launch Canvas · {activeCase.name}</h3>
              </div>
              <span className="vcep-status-pill">
                {stageCompletion[4] ? '✓ Ready for Classroom Defence' : 'Complete All 5 Decisions'}
              </span>
            </div>

            <div className="vcep-canvas-grid">
              <div className="vcep-canvas-cell cell-highlight">
                <span className="vcep-canvas-cell-title">1. Startup Concept</span>
                <div className="vcep-canvas-cell-body">
                  <strong>{activeCase.name}</strong>
                  <p>{activeCase.summary}</p>
                </div>
              </div>

              <div className="vcep-canvas-cell">
                <span className="vcep-canvas-cell-title">2. Customer Problem</span>
                <div className="vcep-canvas-cell-body">
                  {activeCase.decisions.decisionA.options.find((o) => o.id === labState.decisions.decisionA)?.text || (
                    <span className="vcep-canvas-empty">Pending Decision A</span>
                  )}
                </div>
              </div>

              <div className="vcep-canvas-cell">
                <span className="vcep-canvas-cell-title">3. Target Persona</span>
                <div className="vcep-canvas-cell-body">
                  {activeCase.decisions.decisionB.options.find((o) => o.id === labState.decisions.decisionB)?.text || (
                    <span className="vcep-canvas-empty">Pending Decision B</span>
                  )}
                </div>
              </div>

              <div className="vcep-canvas-cell cell-highlight">
                <span className="vcep-canvas-cell-title">4. Minimum Viable Product (MVP)</span>
                <div className="vcep-canvas-cell-body">
                  {activeCase.decisions.decisionC.options.find((o) => o.id === labState.decisions.decisionC)?.text || (
                    <span className="vcep-canvas-empty">Pending Decision C</span>
                  )}
                </div>
              </div>

              <div className="vcep-canvas-cell">
                <span className="vcep-canvas-cell-title">5. First 10 Customers</span>
                <div className="vcep-canvas-cell-body">
                  {activeCase.decisions.decisionD.options.find((o) => o.id === labState.decisions.decisionD)?.text || (
                    <span className="vcep-canvas-empty">Pending Decision D</span>
                  )}
                </div>
              </div>

              <div className="vcep-canvas-cell">
                <span className="vcep-canvas-cell-title">6. Fulfilment & Controls</span>
                <div className="vcep-canvas-cell-body">
                  {activeCase.decisions.decisionE.options.find((o) => o.id === labState.decisions.decisionE)?.text || (
                    <span className="vcep-canvas-empty">Pending Decision E</span>
                  )}
                </div>
              </div>

              <div className="vcep-canvas-cell">
                <span className="vcep-canvas-cell-title">7. Core Vulnerability</span>
                <div className="vcep-canvas-cell-body">
                  <span>{activeCase.friction}</span>
                </div>
              </div>

              <div className="vcep-canvas-cell cell-highlight">
                <span className="vcep-canvas-cell-title">8. Immediate Next Experiment</span>
                <div className="vcep-canvas-cell-body">
                  <span>Conduct 10 in-person customer interviews on campus to validate price willingness.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <button type="button" className="v3-outline" onClick={() => goToStage(3)}>
              <ArrowLeft size={15} /> Previous: Opportunity Selection
            </button>
            <button type="button" className="v3-primary" onClick={() => goToStage(5)}>
              Proceed to Stage 5: Run the Business <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 5: RUN THE BUSINESS (STARTUP BOARDROOM)
          ========================================================================= */}
      {currentStage === 5 && (
        <section className="vcep-stage-view" aria-labelledby="stage-5-heading">
          <div className="vcep-boardroom-card">
            <div className="v3-panel-head-flex">
              <div>
                <span className="v3-eyebrow">STAGE 5 · STARTUP BOARDROOM SIMULATION</span>
                <h2 id="stage-5-heading">Executive Boardroom: Handling an Operational Crisis</h2>
                <p>
                  Form a 5-person executive team. Navigate an unexpected delivery breakdown at 8:00 PM before tomorrow’s
                  orders dispatch.
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
                  {timerRunning ? 'Pause' : 'Start Timer'}
                </button>
                <button
                  type="button"
                  className="v3-action-mini-btn"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(180);
                  }}
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div style={{ marginTop: '18px' }}>
              <label className="vcep-section-label">Select Your Executive Position (5 Classroom Roles):</label>
              <div className="vcep-role-selector-grid">
                {BOARDROOM_ROLES.map((r) => {
                  const isSelected = r.id === activeRole.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`vcep-role-btn ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          boardroom: { ...prev.boardroom, roleId: r.id },
                        }));
                      }}
                    >
                      {r.title}
                    </button>
                  );
                })}
              </div>

              <div className="vcep-role-duty-box">
                <strong>{activeRole.title} Duty: </strong>
                <span>
                  {activeRole.mandate} — <em>Key Priority: {activeRole.focus}</em>
                </span>
              </div>
            </div>

            {/* Fictional Crisis Scenario */}
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
                      onClick={() => {
                        updateState((prev) => ({
                          ...prev,
                          boardroom: { ...prev.boardroom, crisisChoice: opt.id },
                        }));
                      }}
                    >
                      <div className="vcep-choice-radio">{isSelected && <div className="vcep-choice-radio-inner" />}</div>
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

            {/* Boardroom Decision Record */}
            <div className="v3-panel" style={{ marginTop: '20px' }}>
              <span className="v3-eyebrow">STAGE 5 DELIVERABLE</span>
              <h3>Startup Boardroom Decision Record</h3>
              <p>Document the rationale, consequences, and recovery plan agreed upon by the team.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginTop: '12px' }}>
                <label className="v3-field">
                  <span>Executive Justification for Strategy:</span>
                  <textarea
                    rows={2}
                    value={labState.boardroom.crisisRationale || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateState((prev) => ({
                        ...prev,
                        boardroom: { ...prev.boardroom, crisisRationale: val },
                      }));
                    }}
                    placeholder="Why does this choice protect customer trust and enterprise solvency?"
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <label className="v3-field">
                    <span>Identified Operational Consequence:</span>
                    <input
                      type="text"
                      value={labState.boardroom.consequencesAnalysis || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateState((prev) => ({
                          ...prev,
                          boardroom: { ...prev.boardroom, consequencesAnalysis: val },
                        }));
                      }}
                      placeholder="e.g. 25 orders rescheduled with discount vouchers; 15 delivered manually."
                    />
                  </label>

                  <label className="v3-field">
                    <span>Designated Operational Risk Owner:</span>
                    <input
                      type="text"
                      value={labState.boardroom.assignedOwner || activeRole.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateState((prev) => ({
                          ...prev,
                          boardroom: { ...prev.boardroom, assignedOwner: val },
                        }));
                      }}
                      placeholder="e.g. Operations Lead and Founder & Strategy Lead"
                    />
                  </label>
                </div>

                <label className="v3-field">
                  <span>Recovery Plan & Future Preventative Control:</span>
                  <textarea
                    rows={2}
                    value={labState.boardroom.recoveryPlan || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateState((prev) => ({
                        ...prev,
                        boardroom: { ...prev.boardroom, recoveryPlan: val },
                      }));
                    }}
                    placeholder="What standby backup arrangements prevent this breakdown from repeating next week?"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <button type="button" className="v3-outline" onClick={() => goToStage(4)}>
              <ArrowLeft size={15} /> Previous: Build Your Startup
            </button>
            <button type="button" className="v3-primary" onClick={() => goToStage(6)}>
              Proceed to Stage 6: Investor Pitch Deck <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          STAGE 6: CREATE YOUR INVESTOR PITCH DECK
          ========================================================================= */}
      {currentStage === 6 && (
        <section className="vcep-stage-view" aria-labelledby="stage-6-heading">
          <div className="vcep-pitch-deck-header-bar">
            <div>
              <span className="v3-eyebrow">STAGE 6 · EXECUTIVE PRESENTATION BUILDER</span>
              <h2 id="stage-6-heading">Investor Pitch Deck: {activeCase.name}</h2>
              <p>
                Synthesize your venture into an 8-slide executive pitch. Fields are pre-filled from your work in Stages
                1–5 and remain fully editable.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="v3-outline"
                style={{ fontSize: '12px', padding: '7px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleSyncPitchFromStages}
                title="Pull latest answers from Stages 1-5"
              >
                <RefreshCw size={13} /> Refresh From Stages 1–5
              </button>

              <button
                type="button"
                className="vcep-btn-primary"
                style={{ fontSize: '12px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setIsFullScreenPitch(true)}
              >
                <Presentation size={14} /> Launch Presentation Mode
              </button>
            </div>
          </div>

          {/* Unverified Assumptions Notice */}
          <div className="vcep-pitch-assumptions-notice">
            <Info size={16} color="#0f766e" style={{ flexShrink: 0 }} />
            <span>
              <strong>Professional Academic Integrity:</strong> All market figures, traction projections, and unit
              economics represent <em>Proposed Hypotheses</em>. Never fabricate sales, traction, or revenue.
            </span>
          </div>

          {/* Interactive 8-Slide Pitch Studio */}
          <div className="vcep-pitch-studio-layout">
            {/* Left Rail: 8 Slide Thumbnails */}
            <div className="vcep-pitch-thumbnails-rail">
              <span className="vcep-rail-title">PITCH SLIDES (8)</span>
              {slides.map((s, idx) => {
                const isCurrent = idx === activeSlideIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`vcep-slide-thumbnail-btn ${isCurrent ? 'is-current' : ''}`}
                    onClick={() => {
                      updateState((prev) => ({
                        ...prev,
                        pitchDeck: { ...prev.pitchDeck, activeSlideIndex: idx },
                      }));
                    }}
                  >
                    <div className="vcep-slide-thumb-num">{s.number}</div>
                    <div className="vcep-slide-thumb-meta">
                      <strong className="vcep-slide-thumb-title">{s.title}</strong>
                      <span className="vcep-slide-thumb-sub">{s.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Workstation: Current Slide Editor & Live In-Platform Preview */}
            {currentSlide && (
              <div className="vcep-pitch-slide-editor-card">
                {/* Slide Card Header */}
                <div className="vcep-slide-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="vcep-slide-hero-num">{currentSlide.number}</span>
                    <div>
                      <h3 className="vcep-slide-hero-title">{currentSlide.title}</h3>
                      <span className="vcep-slide-hero-subtitle">{currentSlide.subtitle}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="vcep-slide-counter">
                      Slide {activeSlideIndex + 1} of {slides.length}
                    </span>
                    <button
                      type="button"
                      className="v3-action-mini-btn"
                      onClick={handlePrevSlide}
                      disabled={activeSlideIndex === 0}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      className="v3-action-mini-btn"
                      onClick={handleNextSlide}
                      disabled={activeSlideIndex === slides.length - 1}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Slide Fields Editor */}
                <div className="vcep-slide-fields-grid">
                  {currentSlide.fields.map((field) => (
                    <div key={field.key} className="vcep-slide-field-block">
                      <div className="vcep-field-head">
                        <label>{field.label}</label>
                        {field.isAssumption && (
                          <span className="vcep-assumption-tag">Proposed Plan / Hypothesis</span>
                        )}
                      </div>
                      {field.isTextArea ? (
                        <textarea
                          rows={3}
                          value={field.value}
                          onChange={(e) => handleSlideFieldChange(currentSlide.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleSlideFieldChange(currentSlide.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Speaker Notes */}
                <div className="vcep-slide-notes-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong>Speaker Presentation Notes:</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>What to say during your classroom pitch</span>
                  </div>
                  <textarea
                    rows={2}
                    value={currentSlide.speakerNotes || ''}
                    onChange={(e) => handleSpeakerNotesChange(currentSlide.id, e.target.value)}
                    placeholder="Key talking points for this slide..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Full-Screen Presentation Mode Modal */}
          {isFullScreenPitch && currentSlide && (
            <div className="vcep-presentation-fullscreen-overlay">
              <div className="vcep-fullscreen-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="vcep-fs-brand">VAYENTRA VCEP FOUNDER ACCELERATOR</span>
                  <span className="vcep-fs-dot">·</span>
                  <span className="vcep-fs-session">Session 01 Pitch Deck</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    className="vcep-fs-btn"
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                  >
                    {showSpeakerNotes ? 'Hide Notes' : 'Show Speaker Notes'}
                  </button>
                  <span className="vcep-fs-slide-tracker">
                    Slide {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    type="button"
                    className="vcep-fs-exit-btn"
                    onClick={() => setIsFullScreenPitch(false)}
                  >
                    Exit Full-Screen (Esc)
                  </button>
                </div>
              </div>

              {/* Live Fullscreen Slide Canvas */}
              <div className="vcep-fs-slide-canvas">
                <div className="vcep-fs-slide-inner">
                  <div className="vcep-fs-slide-head">
                    <span className="vcep-fs-num">{currentSlide.number}</span>
                    <div>
                      <h2>{currentSlide.title}</h2>
                      <p>{currentSlide.subtitle}</p>
                    </div>
                  </div>

                  <div className="vcep-fs-slide-content-grid">
                    {currentSlide.fields.map((f) => (
                      <div key={f.key} className="vcep-fs-content-item">
                        <span className="vcep-fs-label">{f.label}</span>
                        <div className="vcep-fs-value">{f.value || <em style={{ opacity: 0.6 }}>Unspecified</em>}</div>
                      </div>
                    ))}
                  </div>

                  {showSpeakerNotes && currentSlide.speakerNotes && (
                    <div className="vcep-fs-notes-drawer">
                      <strong>Speaker Notes:</strong> {currentSlide.speakerNotes}
                    </div>
                  )}
                </div>

                {/* Left & Right Controls */}
                <button
                  type="button"
                  className="vcep-fs-nav-arrow arrow-left"
                  onClick={handlePrevSlide}
                  disabled={activeSlideIndex === 0}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  type="button"
                  className="vcep-fs-nav-arrow arrow-right"
                  onClick={handleNextSlide}
                  disabled={activeSlideIndex === slides.length - 1}
                  aria-label="Next slide"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="vcep-stage-actions-bar">
            <button type="button" className="v3-outline" onClick={() => goToStage(5)}>
              <ArrowLeft size={15} /> Previous: Run the Business
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                ✓ Complete Startup Journey Finished
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}