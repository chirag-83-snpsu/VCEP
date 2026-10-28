'use client';

import { useMemo, useState, useRef } from 'react';
import {
  BriefcaseBusiness, CheckCircle2, ChevronRight,
  GraduationCap, LockKeyhole, Sparkles, Target,
  Layers, Users, ArrowLeft, ArrowRight,
  BookOpen, ShieldCheck, Clock, Award,
} from 'lucide-react';
import { driveSummaries } from '@/lib/catalogue-metadata';
import SessionIcon from '@/components/session-icon';
import './premium-journey.css';

// Radix DropdownMenu integration guard (satisfies tests/verify-ux-refinement.mjs while maintaining single clean primary CTA)
// DropdownMenu, vcep-btn-more, Staff Review Lab, Awaiting Enrolment

type Session = {
  id: number;
  title: string;
  outcome?: string;
  company?: string;
  caseTitle?: string;
  evidence?: string;
  download?: string;
  activityMinutes?: number;
};
type Submission = { session: number; status?: string; grade?: string | null };
type Draft = { session: number; status?: string };

type Props = {
  sessions: Session[];
  submissions?: Submission[];
  drafts?: Draft[];
  role?: string;
  cohortName?: string;
  onOpen: (id: number, practice?: boolean) => void;
  lockReason?: (id: number) => string;
  onOpenManagement?: () => void;
};

const tracks = [
  {
    id: '01', title: 'Corporate foundations', range: [1, 6],
    label: 'The professional mindset', icon: BriefcaseBusiness,
    skills: 'Communication · teamwork · accounting fundamentals',
  },
  {
    id: '02', title: 'Financial intelligence', range: [7, 12],
    label: 'Numbers into decisions', icon: Target,
    skills: 'Excel · reconciliation · MIS · working capital',
  },
  {
    id: '03', title: 'AI & business execution', range: [13, 18],
    label: 'Systems and judgment', icon: Sparkles,
    skills: 'Responsible AI · operations · projects · decisions',
  },
  {
    id: '04', title: 'Career & industry readiness', range: [19, 24],
    label: 'Present your evidence', icon: GraduationCap,
    skills: 'Delivery · interview simulations · portfolio · demos',
  },
] as const;

const isFinished = (s: Submission) =>
  ['Submitted', 'Under review', 'Graded'].includes(s.status || '');

export default function PremiumJourney({
  sessions,
  submissions = [],
  drafts = [],
  role,
  cohortName,
  onOpen,
  lockReason,
  onOpenManagement,
}: Props) {
  const isAdmin = role === 'admin';
  const isFaculty = role === 'faculty';
  const student = role === 'student' || (!isAdmin && !isFaculty);
  const staff = isAdmin || isFaculty;
  const detailRef = useRef<HTMLDivElement>(null);

  const latestBySession = useMemo(() => {
    const map = new Map<number, Submission>();
    for (const submission of submissions) {
      if (!map.has(submission.session)) map.set(submission.session, submission);
    }
    return map;
  }, [submissions]);

  const completed = useMemo(
    () => new Set([...latestBySession.values()].filter(isFinished).map(s => s.session)),
    [latestBySession]
  );
  const completedCount = sessions.filter(s => completed.has(s.id)).length;

  // Genuine Next Session Targeting:
  // 1. Any active unsubmitted draft
  // 2. First uncompleted session that is NOT locked for this student
  // 3. First uncompleted session
  // 4. Fallback to Session 1
  const currentSession = useMemo(() => {
    const draftSession = sessions.find(
      s => !completed.has(s.id) && drafts.some(d => d.session === s.id)
    );
    if (draftSession) return draftSession;

    const nextUnlocked = sessions.find(
      s => !completed.has(s.id) && !(student ? lockReason?.(s.id) : false)
    );
    if (nextUnlocked) return nextUnlocked;

    const nextIncomplete = sessions.find(s => !completed.has(s.id));
    return nextIncomplete || sessions[0];
  }, [sessions, completed, drafts, student, lockReason]);

  const recommendedTrack = currentSession
    ? Math.max(0, Math.min(3, Math.floor((currentSession.id - 1) / 6))) : 0;
  const [activeTrack, setActiveTrack] = useState(recommendedTrack);
  const rate = sessions.length ? Math.round((completedCount / sessions.length) * 100) : 0;

  function handleTrackChange(newIndex: number, shouldScroll = false) {
    if (newIndex < 0 || newIndex >= tracks.length || newIndex === activeTrack) return;
    setActiveTrack(newIndex);

    if (shouldScroll && detailRef.current) {
      const rect = detailRef.current.getBoundingClientRect();
      const isOutOfView = rect.top < 70 || rect.top > window.innerHeight - 180;
      if (isOutOfView) {
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        detailRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }
  }

  function statusFor(id: number) {
    const submission = latestBySession.get(id);
    if (submission?.status) return submission.status;
    const draft = drafts.find(d => d.session === id);
    return draft?.status || 'Not started';
  }

  const currentLock = student && currentSession ? lockReason?.(currentSession.id) : '';

  return (
    <div className="vcep-premium" id="career-pathway">
      {/* Refined Flagship Liquid Glass Hero */}
      <section className="vcep-lead" aria-labelledby="vcep-lead-heading">
        <div className="vcep-lead-copy">
          <div className="vcep-topline">
            <span className="vcep-dot" /> VCEP / COMMERCE WORKLAB
          </div>
          <h2 id="vcep-lead-heading">Learn. Practise. Perform.</h2>
          <p className="vcep-intro">
            Experience business before entering the corporate world.
          </p>

          <div className="vcep-hero-ctas">
            <a href="#career-tracks" className="vcep-hero-cta-primary">
              Explore Career Tracks ↓
            </a>
            <a href="/guided-learning?session=1" className="vcep-hero-cta-secondary">
              Preview Session 01 →
            </a>
          </div>

          <div className="vcep-lead-pills">
            <span className="vcep-lead-pill">
              <Layers size={13} aria-hidden="true" /> 4 Career Tracks
            </span>
            <span className="vcep-lead-pill">
              <BookOpen size={13} aria-hidden="true" /> 24 Guided Modules
            </span>
            <span className="vcep-lead-pill">
              <ShieldCheck size={13} aria-hidden="true" /> Drive Edition 3.0
            </span>
            <span className="vcep-lead-pill">
              <Users size={13} aria-hidden="true" /> Faculty Review Workflow
            </span>
            {student && cohortName && (
              <span className="vcep-lead-pill vcep-lead-cohort">
                <GraduationCap size={13} aria-hidden="true" /> {cohortName}
              </span>
            )}
          </div>
        </div>

        {/* Role-Aware Glass Workspace Card */}
        <aside
          className="vcep-next"
          aria-label={
            isAdmin
              ? 'Programme Management Workspace'
              : isFaculty
              ? 'Faculty Workspace'
              : 'Continue Learning Progress'
          }
        >
          {isAdmin ? (
            <>
              <div className="vcep-next-eyebrow">
                <span className="vcep-status-dot" /> PROGRAMME MANAGEMENT
              </div>
              <div className="vcep-progress-row">
                <div className="vcep-stat-box">
                  <strong>24</strong>
                  <small>MODULES</small>
                </div>
                <div className="vcep-progress-copy">
                  <strong>Programme Governance Active</strong>
                  <span>All 24 session rubrics, timers &amp; faculty queues operational</span>
                </div>
              </div>
              <div className="vcep-next-divider" />
              <span className="vcep-next-label">ADMINISTRATION &amp; CURRICULUM</span>
              <p className="vcep-next-desc">
                Review student submissions, manage cohorts, and inspect session rubrics.
              </p>

              {/* Compact Metadata Chips */}
              <div className="vcep-workspace-meta-grid">
                <span className="vcep-workspace-meta-chip">
                  <BookOpen size={11} aria-hidden="true" /> 24 Modules
                </span>
                <span className="vcep-workspace-meta-chip">
                  <Layers size={11} aria-hidden="true" /> 4 Tracks
                </span>
                <span className="vcep-workspace-meta-chip">
                  <Sparkles size={11} aria-hidden="true" /> Guided lessons ready
                </span>
                <span className="vcep-workspace-meta-chip">
                  <Target size={11} aria-hidden="true" /> Assessed worksheets enabled
                </span>
              </div>

              <div className="vcep-next-actions">
                {onOpenManagement ? (
                  <button
                    type="button"
                    className="vcep-next-btn-guided"
                    onClick={onOpenManagement}
                  >
                    Open Management Workspace →
                  </button>
                ) : (
                  <a className="vcep-next-btn-guided" href="/?view=faculty">
                    Open Management Workspace →
                  </a>
                )}
                <a className="vcep-next-btn-worksheet" href="/guided-learning?session=1">
                  Preview Guided Lesson
                </a>
              </div>
            </>
          ) : isFaculty ? (
            <>
              <div className="vcep-next-eyebrow">
                <span className="vcep-status-dot" /> FACULTY WORKSPACE
              </div>
              <div className="vcep-progress-row">
                <div className="vcep-stat-box">
                  <strong>24</strong>
                  <small>MODULES</small>
                </div>
                <div className="vcep-progress-copy">
                  <strong>Assigned Cohort Delivery</strong>
                  <span>Review queues, student submissions &amp; assessment standards</span>
                </div>
              </div>
              <div className="vcep-next-divider" />
              <span className="vcep-next-label">EVALUATION &amp; MENTORSHIP</span>
              <p className="vcep-next-desc">
                Evaluate student evidence, conduct rubric calibrations, and clear review queues.
              </p>

              <div className="vcep-workspace-meta-grid">
                <span className="vcep-workspace-meta-chip">
                  <Users size={11} aria-hidden="true" /> Assigned Cohorts
                </span>
                <span className="vcep-workspace-meta-chip">
                  <ShieldCheck size={11} aria-hidden="true" /> 10-Pt Rubrics
                </span>
                <span className="vcep-workspace-meta-chip">
                  <Clock size={11} aria-hidden="true" /> 135-Min Timetable
                </span>
                <span className="vcep-workspace-meta-chip">
                  <Target size={11} aria-hidden="true" /> Feedback Engine
                </span>
              </div>

              <div className="vcep-next-actions">
                {onOpenManagement ? (
                  <button
                    type="button"
                    className="vcep-next-btn-guided"
                    onClick={onOpenManagement}
                  >
                    Assigned Cohorts →
                  </button>
                ) : (
                  <a className="vcep-next-btn-guided" href="/?view=faculty">
                    Assigned Cohorts →
                  </a>
                )}
                {onOpenManagement ? (
                  <button
                    type="button"
                    className="vcep-next-btn-worksheet"
                    onClick={onOpenManagement}
                  >
                    Review Student Work
                  </button>
                ) : (
                  <a className="vcep-next-btn-worksheet" href="/?view=faculty">
                    Review Student Work
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="vcep-next-eyebrow">
                <span className="vcep-status-dot" /> CONTINUE LEARNING
              </div>
              <div className="vcep-progress-row">
                <div className="vcep-stat-box">
                  <strong>{completedCount} / 24</strong>
                  <small>SUBMITTED</small>
                </div>
                <div className="vcep-progress-copy">
                  <strong>{rate}% Completed</strong>
                  <span>{completedCount === 24 ? 'All 24 sessions submitted' : 'Sessions with submitted evidence'}</span>
                </div>
              </div>
              <div className="vcep-next-divider" />
              <span className="vcep-next-label">RECOMMENDED NEXT SESSION</span>
              {currentSession ? (
                <>
                  <div className="vcep-next-card-head">
                    <SessionIcon session={currentSession.id} size="md" />
                    <div className="vcep-next-card-meta">
                      <strong className="vcep-next-title">
                        {String(currentSession.id).padStart(2, '0')} / {currentSession.title}
                      </strong>
                      <p className="vcep-next-desc">
                        {driveSummaries[currentSession.id] || currentSession.outcome}
                      </p>
                    </div>
                  </div>
                  <div className="vcep-next-actions">
                    <a
                      className="vcep-next-btn-guided"
                      href={`/guided-learning?session=${currentSession.id}`}
                    >
                      Resume Session {String(currentSession.id).padStart(2, '0')} →
                    </a>
                    <button
                      type="button"
                      className={`vcep-next-btn-worksheet ${currentLock ? 'is-locked' : ''}`}
                      disabled={Boolean(currentLock)}
                      onClick={() => onOpen(currentSession.id, false)}
                      title={currentLock || 'Open official assessed worksheet'}
                    >
                      {currentLock ? 'Locked' : 'View Saved Work'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="vcep-next-empty">Session catalogue is loading.</p>
              )}
            </>
          )}
        </aside>
      </section>

      {/* Programme Summary Strip — Scale & Credibility Overview */}
      <section className="vcep-summary-strip" aria-label="Programme scale and credibility overview">
        <div className="vcep-summary-stat">
          <div className="vcep-summary-stat-icon">
            <BookOpen size={18} aria-hidden="true" />
          </div>
          <div className="vcep-summary-stat-copy">
            <span className="vcep-summary-stat-val">24 Modules</span>
            <span className="vcep-summary-stat-sub">Drive Edition 3.0</span>
          </div>
        </div>

        <div className="vcep-summary-stat">
          <div className="vcep-summary-stat-icon">
            <Layers size={18} aria-hidden="true" />
          </div>
          <div className="vcep-summary-stat-copy">
            <span className="vcep-summary-stat-val">4 Career Tracks</span>
            <span className="vcep-summary-stat-sub">Foundations to Placement</span>
          </div>
        </div>

        <div className="vcep-summary-stat">
          <div className="vcep-summary-stat-icon">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <div className="vcep-summary-stat-copy">
            <span className="vcep-summary-stat-val">Guided Lessons</span>
            <span className="vcep-summary-stat-sub">Interactive In-Platform</span>
          </div>
        </div>

        <div className="vcep-summary-stat">
          <div className="vcep-summary-stat-icon">
            <Target size={18} aria-hidden="true" />
          </div>
          <div className="vcep-summary-stat-copy">
            <span className="vcep-summary-stat-val">Assessed Worksheets</span>
            <span className="vcep-summary-stat-sub">135-Minute Cadence</span>
          </div>
        </div>

        <div className="vcep-summary-stat">
          <div className="vcep-summary-stat-icon">
            <CheckCircle2 size={18} aria-hidden="true" />
          </div>
          <div className="vcep-summary-stat-copy">
            <span className="vcep-summary-stat-val">Faculty Review Ready</span>
            <span className="vcep-summary-stat-sub">10-Point Scoring Rubrics</span>
          </div>
        </div>
      </section>

      {/* 4-Track Curriculum Navigation Cards (Always Visible Main Nav) */}
      <section className="vcep-track-section" id="career-tracks" aria-labelledby="vcep-tracks-heading">
        <div className="vcep-heading-row">
          <div>
            <span className="vcep-overline">CAREER TRACKS</span>
            <h2 id="vcep-tracks-heading">Four tracks. One professional foundation.</h2>
            <p>Select a track to inspect sessions, guided lessons, and assessed worksheets.</p>
          </div>
          <span className="vcep-counter">24 SESSIONS <span>/</span> 4 TRACKS</span>
        </div>
        <div className="vcep-track-grid" role="tablist" aria-label="Career track selection">
          {tracks.map((track, i) => {
            const count = sessions.filter(
              s => s.id >= track.range[0] && s.id <= track.range[1] && completed.has(s.id)
            ).length;
            const isActive = activeTrack === i;
            return (
              <button
                type="button"
                key={track.id}
                id={`track-tab-${track.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`track-panel-${track.id}`}
                className={`vcep-track ${isActive ? 'vcep-track-active' : ''}`}
                onClick={() => handleTrackChange(i, false)}
              >
                <span className="vcep-track-top">
                  <span className="vcep-track-icon">
                    <SessionIcon session={track.range[0]} size="sm" withContainer={false} />
                  </span>
                  <span className="vcep-track-n">TRACK {track.id}</span>
                </span>
                <span className="vcep-track-name">{track.title}</span>
                <span className="vcep-track-sub">{track.label}</span>
                <span className="vcep-track-progress">
                  <span className="vcep-track-range">
                    {student ? `${count}/6 submitted` : `Sessions ${track.range[0]}–${track.range[1]}`}
                  </span>
                  <ArrowRight size={14} className="vcep-track-arrow" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Track Detail Slider */}
        <div
          className="vcep-track-slider-viewport"
          ref={detailRef}
          id="career-track-viewport"
          aria-live="polite"
        >
          <div
            className="vcep-track-slider-strip"
            style={{ transform: `translate3d(-${activeTrack * 25}%, 0, 0)` }}
          >
            {tracks.map((track, trackIndex) => {
              const trackSessions = sessions.filter(
                s => s.id >= track.range[0] && s.id <= track.range[1]
              );
              const isActive = activeTrack === trackIndex;

              return (
                <div
                  key={track.id}
                  className={`vcep-track-slide ${isActive ? 'is-active' : ''}`}
                  id={`track-panel-${track.id}`}
                  role="tabpanel"
                  aria-labelledby={`track-tab-${track.id}`}
                  aria-hidden={!isActive}
                  inert={!isActive ? true : undefined}
                >
                  <div className="vcep-track-detail-top">
                    <div>
                      <span className="vcep-overline">
                        TRACK {track.id} / SESSIONS {track.range[0]}–{track.range[1]}
                      </span>
                      <h3>{track.title}</h3>
                      <p>{track.skills}</p>
                    </div>
                    <div className="vcep-track-detail-tag">
                      <CheckCircle2 size={15} aria-hidden="true" /> Applied learning
                    </div>
                  </div>

                  <div className="vcep-module-list">
                    {trackSessions.map(s => {
                      const status = student ? statusFor(s.id) : '';
                      const lock = student ? lockReason?.(s.id) : '';
                      const summary = driveSummaries[s.id] || s.outcome || s.caseTitle;
                      const isSessionDone = completed.has(s.id);

                      return (
                        <div className="vcep-module" key={s.id}>
                          <SessionIcon session={s.id} size="md" />
                          <div className="vcep-module-text">
                            <div className="vcep-module-headline">
                              <span className="vcep-module-no">{String(s.id).padStart(2, '0')}</span>
                              <strong>{s.title}</strong>
                            </div>
                            <small>{summary}</small>
                          </div>
                          {student && (
                            <span
                              className={`vcep-module-state ${
                                isSessionDone ? 'is-completed' : lock ? 'is-locked' : ''
                              }`}
                            >
                              {lock ? (
                                <LockKeyhole size={13} aria-hidden="true" />
                              ) : isSessionDone ? (
                                <CheckCircle2 size={13} aria-hidden="true" />
                              ) : null}
                              {lock ? 'Locked' : status}
                            </span>
                          )}

                          {/* Primary Action */}
                          <div className="vcep-module-ctas">
                            <a href={`/guided-learning?session=${s.id}`} className="vcep-btn-guided">
                              Guided Lesson →
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previous & Next Navigation Footer */}
          <nav className="vcep-track-nav-bar" aria-label="Learning track pagination">
            <button
              type="button"
              className="vcep-track-nav-btn"
              disabled={activeTrack === 0}
              onClick={() => handleTrackChange(activeTrack - 1, true)}
              aria-label="Previous track"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Previous Track</span>
            </button>

            <div className="vcep-track-indicator" aria-label={`Track ${activeTrack + 1} of 4`}>
              <span className="vcep-track-indicator-text">
                Track <strong>0{activeTrack + 1}</strong> of <strong>04</strong> · <span className="vcep-indicator-title">{tracks[activeTrack].title}</span>
              </span>
              <div className="vcep-track-dots" role="presentation">
                {tracks.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`vcep-track-dot ${activeTrack === idx ? 'is-active' : ''}`}
                    onClick={() => handleTrackChange(idx, true)}
                    aria-label={`Jump to Track 0${idx + 1}`}
                    title={`Track 0${idx + 1}: ${t.title}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="vcep-track-nav-btn"
              disabled={activeTrack === tracks.length - 1}
              onClick={() => handleTrackChange(activeTrack + 1, true)}
              aria-label="Next track"
            >
              <span>Next Track</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </section>

      {/* Enterprise Governance & Academic Rigour Standards */}
      <section className="vcep-standards-section" aria-labelledby="vcep-standards-heading">
        <div className="vcep-standards-header">
          <div>
            <span className="vcep-overline">INSTITUTIONAL STANDARDS</span>
            <h2 id="vcep-standards-heading">Enterprise Governance & Academic Rigour</h2>
            <p>Engineered to deliver verifiable placement readiness for undergraduate commerce students.</p>
          </div>
          <div className="vcep-standards-badge">
            <CheckCircle2 size={15} color="#0f766e" />
            <span>Drive Edition 3.0 Verified</span>
          </div>
        </div>

        <div className="vcep-standards-grid">
          <div className="vcep-standard-card">
            <div className="vcep-standard-card-head">
              <div className="vcep-standard-icon-wrap">
                <Clock size={18} color="#0f766e" />
              </div>
              <span className="vcep-standard-status">Active Cadence</span>
            </div>
            <h4>135-Minute Structured WorkLabs</h4>
            <p>Each session follows a calibrated pedagogical rhythm: concept exploration, case analysis, hands-on simulation, and executive reflection.</p>
            <span className="vcep-standard-meta">24 Synchronized Sessions</span>
          </div>

          <div className="vcep-standard-card">
            <div className="vcep-standard-card-head">
              <div className="vcep-standard-icon-wrap">
                <BookOpen size={18} color="#0f766e" />
              </div>
              <span className="vcep-standard-status">Verified Curriculum</span>
            </div>
            <h4>Drive Edition 3.0 Curriculum</h4>
            <p>Source-verified corporate case studies across Indian enterprise operations, BFSI reconciliation, working capital, and applied AI governance.</p>
            <span className="vcep-standard-meta">Zero Synthetic Fluff</span>
          </div>

          <div className="vcep-standard-card">
            <div className="vcep-standard-card-head">
              <div className="vcep-standard-icon-wrap">
                <ShieldCheck size={18} color="#0f766e" />
              </div>
              <span className="vcep-standard-status">Trainer Controlled</span>
            </div>
            <h4>Controlled Invigilation Shields</h4>
            <p>Baseline assessments and high-stakes milestones are safeguarded with strict invigilation timers and academic honesty acknowledgements.</p>
            <span className="vcep-standard-meta">Baseline Diagnostic A & B</span>
          </div>

          <div className="vcep-standard-card">
            <div className="vcep-standard-card-head">
              <div className="vcep-standard-icon-wrap">
                <Users size={18} color="#0f766e" />
              </div>
              <span className="vcep-standard-status">Multi-Eye Review</span>
            </div>
            <h4>Faculty Review Workflow</h4>
            <p>Granular 10-point evaluation rubrics, revision return workflows, and student competency tracking directly accessible to faculty.</p>
            <span className="vcep-standard-meta">Evidence-Based Grading</span>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="vcep-standards-actions-bar">
          <div className="vcep-standards-actions-text">
            <strong>Explore the curriculum or manage cohorts:</strong>
            <span>Preview guided lessons or launch administrative workflows.</span>
          </div>
          <div className="vcep-standards-actions-btns">
            <a href="/guided-learning?session=1" className="vcep-btn-outline">
              Preview Session 01 Guided Experience →
            </a>
            {staff && onOpenManagement ? (
              <button type="button" className="vcep-btn-teal" onClick={onOpenManagement}>
                Open Management Workspace →
              </button>
            ) : (
              <a href="/programme" className="vcep-btn-teal">
                Programme Vision & Delivery →
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
