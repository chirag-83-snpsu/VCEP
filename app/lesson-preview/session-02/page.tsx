'use client';

import { useEffect, useMemo, useState } from 'react';
import './lesson-preview.css';

type Draft = {
  intro: string;
  task: string;
  owner: string;
  reviewer: string;
  backup: string;
  responseWindow: string;
  laptopPlan: string;
  escalation: string;
  missedDeadline: string;
  contribution: string;
  correction: string;
  aiAudit: string;
  spokenCheck: string;
};

const emptyDraft: Draft = {
  intro: '', task: '', owner: '', reviewer: '', backup: '',
  responseWindow: '', laptopPlan: '', escalation: '',
  missedDeadline: '', contribution: '', correction: '', aiAudit: '', spokenCheck: '',
};

const sections = [
  { id: 'overview', title: 'Overview', timing: '00–10 min', description: 'Business brief & outcomes' },
  { id: 'learn', title: 'Learn', timing: '10–25 min', description: 'Accountability & retrieval' },
  { id: 'practice', title: 'Practice', timing: '25–60 min', description: 'Individual intro & charter' },
  { id: 'team', title: 'Team Lab', timing: '60–95 min', description: 'Squad roles & laptop plan' },
  { id: 'review', title: 'Review', timing: '95–130 min', description: 'Verification & /10 rubric' },
  { id: 'submit', title: 'Submit', timing: '130–135 min', description: 'Handover & export draft' },
] as const;

const aiPrompt = 'Review this fictional student squad charter for missing ownership, reviewer availability, response windows, shared-device scheduling, escalation and AI-use boundaries. Quote the clause behind each observation. Mark missing information instead of inventing it. Do not claim that a student accepted an assignment unless their charter explicitly says so.';
const storageKey = 'vcep:s02:drive-v3:student-preview';

const retrievalQuestions = [
  {
    prompt: 'In Session 01, what was the primary rule of professional communication in a company simulation?',
    options: ['State verifiable facts with source references', 'Reply instantly without checking data', 'Use informal chat abbreviations'],
    right: 0,
    why: 'Professional communication in commerce requires verifiable source facts and traceable evidence, established in Session 01.',
  },
  {
    prompt: 'A reviewer is absent on the submission day. Who is accountable for the delivery?',
    options: ['The reviewer alone', 'The named deliverable owner', 'Whoever has the laptop'],
    right: 1,
    why: 'The named owner remains accountable. The reviewer checks quality, and a backup or escalation must be arranged when review is unavailable.',
  },
  {
    prompt: 'Which is the clearest, most actionable professional commitment?',
    options: ['I will do my best to complete it', 'Mira owns the stock-count file, sends by 15:30, and escalates missing reference IDs by 14:00', 'The team will finish somehow before end of day'],
    right: 1,
    why: 'A professional commitment specifies the accountable owner, precise deliverable, delivery time, and proactive escalation threshold.',
  },
];

const rubricCriteria = [
  { category: 'Execution', points: 4, label: 'Charter includes output, owner, reviewer, backup, and shared-device plan.' },
  { category: 'Reasoning', points: 2, label: 'Distinguishes accountability from task execution; realistic laptop rota.' },
  { category: 'Communication', points: 2, label: '90-second intro based on actual skills; transparent escalation clause.' },
  { category: 'Professional Process', points: 2, label: 'Verbal check defended; feedback correction recorded; AI disclosed.' },
];

const testCriteria = [
  'My 90s introduction describes a real, current skill without exaggeration.',
  'Our charter names one accountable owner, one reviewer, and one backup.',
  'We scheduled realistic shared-laptop timeboxes (no impossible keyboard overlap).',
  'I can verbally explain my output, reviewer, and escalation time in my own words.',
  'Any AI assistance is disclosed and verified against our charter.',
];

function InputField({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <label className="vcep-field">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export default function Session02Pilot() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [role, setRole] = useState('Coordinator');
  const [copyState, setCopyState] = useState('Copy safe AI prompt');
  const [saveMessage, setSaveMessage] = useState('Practice only · stored in browser');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDraft({ ...emptyDraft, ...(parsed.draft ?? {}) });
        setAnswers(parsed.answers ?? {});
        setChecked(parsed.checked ?? {});
        setSaveMessage('Practice draft restored from this browser · not submitted');
      }
    } catch {
      setSaveMessage('Browser saving unavailable · export your work');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ draft, answers, checked, savedAt: new Date().toISOString() }));
      setSaveMessage('Practice saved locally · not submitted');
    } catch {
      setSaveMessage('Browser saving unavailable · export your work');
    }
  }, [draft, answers, checked, hydrated]);

  const completedFields = useMemo(() => Object.values(draft).filter(value => value.trim().length > 0).length, [draft]);
  const update = (field: keyof Draft, value: string) => setDraft(current => ({ ...current, [field]: value }));
  const navigate = (value: number) => {
    setSectionIndex(Math.max(0, Math.min(value, sections.length - 1)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearPracticeDraft = () => {
    if (confirm('Clear your local practice draft on this computer? Make sure you have exported your work first.')) {
      setDraft(emptyDraft);
      setAnswers({});
      setChecked({});
      try {
        localStorage.removeItem(storageKey);
        setSaveMessage('Practice draft cleared');
      } catch {}
    }
  };

  const exportDraft = () => {
    const content = [
      'VCEP / SESSION 02 / STUDENT PRACTICE EXPORT',
      'Curriculum reference: Drive student workbook Edition 3.0 (135 min)',
      'This export is Formative Practice only — NOT an assessed faculty submission.',
      '',
      '--- 90-SECOND INTRODUCTION ---',
      draft.intro || '(not completed)',
      '',
      '--- TEAM CHARTER COMMITMENTS ---',
      `Deliverable & Deadline: ${draft.task || '(not completed)'}`,
      `Accountable Owner: ${draft.owner || '(not completed)'}`,
      `Quality Reviewer: ${draft.reviewer || '(not completed)'}`,
      `Designated Backup: ${draft.backup || '(not completed)'}`,
      `Response Windows: ${draft.responseWindow || '(not completed)'}`,
      `Shared Laptop Access Plan: ${draft.laptopPlan || '(not completed)'}`,
      `Escalation Threshold & Route: ${draft.escalation || '(not completed)'}`,
      `Missed-Deadline Recovery Rule: ${draft.missedDeadline || '(not completed)'}`,
      '',
      '--- INDIVIDUAL RECORD & DEFENCE ---',
      `My Role: ${role}`,
      `My Contribution: ${draft.contribution || '(not completed)'}`,
      `Spoken Acceptance Check: ${draft.spokenCheck || '(not completed)'}`,
      `Revision After Feedback: ${draft.correction || '(not completed)'}`,
      `AI Verification / Human Decision: ${draft.aiAudit || '(not completed)'}`,
      '',
      '--- EVIDENCE SELF-CHECKLIST ---',
      ...testCriteria.map((c, i) => `${checked[i] ? '[x]' : '[ ]'} ${c}`),
    ].join('\n');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'VCEP_S02_Practice_Draft.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopyState('Prompt copied');
      setTimeout(() => setCopyState('Copy safe AI prompt'), 2000);
    } catch {
      setCopyState('Select and copy below');
    }
  }

  const current = sections[sectionIndex];

  return (
    <div className="vcep-preview">
      <header className="vcep-topbar">
        <div className="vcep-logo">
          <span className="vcep-monogram">V</span>
          <div>
            <strong>VCEP</strong>
            <small>COMMERCE WORKLAB</small>
          </div>
        </div>
        <div className="vcep-top-actions">
          <span className="vcep-save-pill" role="status">{saveMessage}</span>
          <a className="vcep-back" href="/">← Dashboard</a>
        </div>
      </header>

      <main className="vcep-layout">
        {/* Compact Above-The-Fold Header */}
        <section className="vcep-hero">
          <div className="vcep-eyebrow">SESSION 02 / 24 · CORPORATE FOUNDATIONS · 135 MIN</div>
          <h1>Professional Identity & Teamwork</h1>
          <p className="vcep-outcome">
            Define clear deliverable ownership, draft a resilient team charter with a realistic laptop schedule, and master professional handovers.
          </p>
          <div className="vcep-hero-status">
            <span className="vcep-tag">Section {sectionIndex + 1} of 6: {current.title} ({current.timing})</span>
            <span className="vcep-tag-practice">Drive Edition 3.0 · Formative Practice</span>
          </div>
        </section>

        {/* 6-Section Navigation Pills */}
        <nav className="vcep-stepper" aria-label="Lesson sections">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`vcep-step-btn ${sectionIndex === idx ? 'is-active' : ''}`}
              onClick={() => navigate(idx)}
              aria-current={sectionIndex === idx ? 'step' : undefined}
            >
              <span className="vcep-step-n">{String(idx + 1).padStart(2, '0')}</span>
              <span className="vcep-step-label">{s.title}</span>
              <small className="vcep-step-time">{s.timing}</small>
            </button>
          ))}
        </nav>

        {/* Active Section Content Panel */}
        <article className="vcep-panel" aria-live="polite">
          <div className="vcep-panel-head">
            <span className="vcep-step-indicator">SECTION {String(sectionIndex + 1).padStart(2, '0')} / 06 · {current.title.toUpperCase()}</span>
            <span>{current.timing}</span>
          </div>

          {/* SECTION 1: OVERVIEW (00-10 min) */}
          {sectionIndex === 0 && (
            <div className="vcep-block">
              <div className="vcep-kicker">THE MANAGER&apos;S BRIEF · 10 MIN</div>
              <h2>One team. One deadline. Realistic workplace constraints.</h2>
              <p>
                You belong to a five-person team assigned to deliver a reconciliation and compliance summary by <strong>18:00</strong>.
                Two teammates share one laptop, one teammate commutes 90 minutes, and the primary reviewer has an urgent conflict during the final review hour.
              </p>
              <div className="vcep-case-note">
                <strong>Your Session Mission</strong>
                <p>
                  Produce an honest 90-second professional introduction and a team charter with unmistakable ownership, backup coverage, realistic laptop rota, and escalation rules.
                </p>
              </div>

              <div className="vcep-grid-two">
                <div className="vcep-mini-card">
                  <strong>What You Learn</strong>
                  <p>Accountable ownership vs quality review, shared device scheduling, and proactive escalation.</p>
                </div>
                <div className="vcep-mini-card">
                  <strong>What You Produce</strong>
                  <p>90s intro script, 5-member team charter, individual role defence, and review notes.</p>
                </div>
              </div>

              <details className="vcep-details">
                <summary>Background Context: Why Team Charters Fail in Commerce</summary>
                <div className="vcep-details-content">
                  <p>
                    Most student groups write vague agreements like &quot;everyone will contribute equally.&quot; When someone is absent or a laptop battery dies, no one is accountable, deadlines slip without notice, and managers receive excuses. A professional charter specifies exact deliverables, named owners, timeboxed review slots, and an escalation trigger.
                  </p>
                </div>
              </details>
            </div>
          )}

          {/* SECTION 2: LEARN (10-25 min) */}
          {sectionIndex === 1 && (
            <div className="vcep-block">
              <div className="vcep-kicker">CORE CONCEPT & WORKPLACE MODEL · 15 MIN</div>
              <h2>Accountability vs. Review vs. Backup</h2>
              <p>
                In a professional finance or operations team, three distinct roles govern every deliverable:
              </p>
              <div className="vcep-roles-explainer">
                <div className="vcep-role-box">
                  <strong>1. Accountable Owner</strong>
                  <p>One person who ensures the deliverable is finished on time. They do not do all the work alone, but they own the schedule and escalation.</p>
                </div>
                <div className="vcep-role-box">
                  <strong>2. Quality Reviewer</strong>
                  <p>Validates formulas, data sources, and formatting against the business brief before release.</p>
                </div>
                <div className="vcep-role-box">
                  <strong>3. Designated Backup</strong>
                  <p>Steps in to perform or review if the primary owner or reviewer encounters an emergency or technical outage.</p>
                </div>
              </div>

              <div className="vcep-example">
                <strong>Workplace Example: Stock-Count Reconciliations</strong>
                <p>
                  A four-person accounting team must submit inventory counts by 16:00. Mira is the <strong>accountable owner</strong> of the workbook. Arun is the <strong>reviewer</strong> scheduled from 14:30 to 15:00. If Arun is unreachable at 14:30, Priya is the <strong>designated backup</strong>. If source data is missing by 14:00, Mira escalates immediately to the team lead. Everyone knows their exact trigger.
                </p>
              </div>

              <h3>Concept Retrieval Checks (Session 01 to Session 02)</h3>
              <p className="vcep-subtext">Reinforce foundational concepts before drafting your commitments.</p>
              {retrievalQuestions.map((q, qi) => (
                <fieldset className="vcep-question" key={qi}>
                  <legend>{qi + 1}. {q.prompt}</legend>
                  {q.options.map((option, oi) => (
                    <label className="vcep-choice" key={option}>
                      <input
                        type="radio"
                        name={`vcep-q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => setAnswers(curr => ({ ...curr, [qi]: oi }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                  {answers[qi] !== undefined && (
                    <div className={`vcep-feedback ${answers[qi] === q.right ? 'correct' : ''}`} role="status">
                      <strong>{answers[qi] === q.right ? '✓ Correct reasoning' : 'Notice:'}</strong>
                      <p>{q.why}</p>
                    </div>
                  )}
                </fieldset>
              ))}
            </div>
          )}

          {/* SECTION 3: PRACTICE (25-60 min) */}
          {sectionIndex === 2 && (
            <div className="vcep-block">
              <div className="vcep-kicker">INDIVIDUAL PRACTICE & ATTEMPT · 35 MIN</div>
              <h2>Your Honest Introduction & First Commitments</h2>
              <p>
                Write an authentic 90-second introduction. Anchor it in actual coursework, tools you know (e.g. Excel formulas, GST invoice entries), and real verifiable habits. <em>Do not invent corporate internships or imaginary clients.</em>
              </p>

              <InputField
                label="My 90-Second Professional Introduction (Actual Skills & Verifiable Evidence)"
                value={draft.intro}
                onChange={v => update('intro', v)}
                rows={5}
                placeholder="I am a commerce student specializing in... Current skills I have practiced include... A specific entry-level task I can reliably own is... Evidence of my accuracy is..."
              />

              <h3>First Charter Commitments</h3>
              <InputField
                label="Deliverable Name & Submission Deadline"
                value={draft.task}
                onChange={v => update('task', v)}
                placeholder="Exact file name and time (e.g. S02_Reconciliation_Summary.xlsx due at 18:00)"
                rows={2}
              />

              <div className="vcep-grid-two">
                <InputField
                  label="Named Accountable Owner"
                  value={draft.owner}
                  onChange={v => update('owner', v)}
                  placeholder="Who is single-point accountable?"
                  rows={2}
                />
                <InputField
                  label="Named Reviewer & Designated Backup"
                  value={draft.reviewer}
                  onChange={v => update('reviewer', v)}
                  placeholder="Reviewer name and who steps in if absent"
                  rows={2}
                />
              </div>

              <div className="vcep-break-notice">
                <strong>Scheduled 10-Minute Break (Minutes 50–60)</strong>
                <p>
                  Step away from the screen. Your work is preserved in this browser. When you return, you will negotiate the team charter and laptop access plan with your squad.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: TEAM LAB (60-95 min) */}
          {sectionIndex === 3 && (
            <div className="vcep-block">
              <div className="vcep-kicker">SQUAD COLLABORATION & SIMULATION · 35 MIN</div>
              <h2>Team Charter & Realistic Shared-Laptop Plan</h2>
              <p>
                Five students cannot each have 20 minutes of keyboard time in a 35-minute block on one laptop. A professional team builds a staggered rota with clear offline preparation.
              </p>

              <div className="vcep-table-wrap">
                <table className="vcep-rota-table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Deliverable Owner</th>
                      <th>Quality Reviewer</th>
                      <th>Designated Backup</th>
                      <th>Laptop Access Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>S02</strong></td>
                      <td>Student A (Coordinator)</td>
                      <td>Student B (Reviewer)</td>
                      <td>Student C</td>
                      <td>15 min keyboard · 20 min review</td>
                    </tr>
                    <tr>
                      <td><strong>S03</strong></td>
                      <td>Student B (Finance)</td>
                      <td>Student C (Reviewer)</td>
                      <td>Student D</td>
                      <td>Rotated keyboard slot</td>
                    </tr>
                    <tr>
                      <td><strong>S04</strong></td>
                      <td>Student C (Data)</td>
                      <td>Student D (Reviewer)</td>
                      <td>Student E</td>
                      <td>Rotated keyboard slot</td>
                    </tr>
                    <tr>
                      <td><strong>S05</strong></td>
                      <td>Student D (Comms)</td>
                      <td>Student E (Reviewer)</td>
                      <td>Student A</td>
                      <td>Rotated keyboard slot</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Select Your Role for This Session</h3>
              <div className="vcep-role-pills" role="group" aria-label="Select your role">
                {['Coordinator', 'Finance', 'Data', 'Client Comms', 'Quality Reviewer'].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`vcep-role-chip ${role === r ? 'is-selected' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="vcep-case-note">
                <strong>Your Role: {role}</strong>
                <p>
                  {role === 'Coordinator' && 'Confirm owners, maintain timeboxes, verify laptop handover, and lead escalation.'}
                  {role === 'Finance' && 'Verify numeric entries, reconcile totals, and identify formula assumptions.'}
                  {role === 'Data' && 'Maintain version naming (e.g. v0.1, v0.2), verify source citations, and backup records.'}
                  {role === 'Client Comms' && 'Draft transparent status updates and ensure commitments never promise unverified work.'}
                  {role === 'Quality Reviewer' && 'Audit deliverable against brief, question missing rows, and sign off with comments.'}
                </p>
              </div>

              <InputField
                label="Shared Laptop & Device Scheduling Plan"
                value={draft.laptopPlan}
                onChange={v => update('laptopPlan', v)}
                placeholder="How will the squad rotate keyboard time? Who prepares offline notes while another student enters data?"
                rows={3}
              />

              <div className="vcep-grid-two">
                <InputField
                  label="Proactive Escalation Trigger"
                  value={draft.escalation}
                  onChange={v => update('escalation', v)}
                  placeholder="If review comments are missing at 16:30, who is contacted immediately?"
                  rows={2}
                />
                <InputField
                  label="Missed-Deadline Recovery Rule"
                  value={draft.missedDeadline}
                  onChange={v => update('missedDeadline', v)}
                  placeholder="What happens if a file is blocked? What is submitted as partial verifiable progress?"
                  rows={2}
                />
              </div>

              <InputField
                label="My Individual Attributable Contribution"
                value={draft.contribution}
                onChange={v => update('contribution', v)}
                placeholder="What exact section or reconciliation did you personally verify?"
                rows={2}
              />

              <div className="vcep-verbal-check">
                <strong>Trainer&apos;s Spoken Acceptance Check:</strong>
                <p>
                  Before finishing this block, each student must verbally state to the trainer or peer squad:
                  <br />
                  <em>&quot;I am [Name]. My deliverable is [Output]. My reviewer is [Name], and if blocked by [Time], I escalate to [Contact].&quot;</em>
                </p>
                <InputField
                  label="Record Your Verbal Statement"
                  value={draft.spokenCheck}
                  onChange={v => update('spokenCheck', v)}
                  placeholder="Write the exact 20-word statement you spoke for your acceptance check."
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* SECTION 5: REVIEW (95-130 min) */}
          {sectionIndex === 4 && (
            <div className="vcep-block">
              <div className="vcep-kicker">VERIFICATION & QUALITY AUDIT · 35 MIN</div>
              <h2>Challenge the Plan & Audit Against Rubric</h2>
              <p>
                Exchange charters with a neighboring squad. Critique impossible deadlines, missing backups, and vague language.
              </p>

              <details className="vcep-details">
                <summary>Optional Generative AI Critique Prompt (Strict Boundaries)</summary>
                <div className="vcep-details-content">
                  <p>
                    AI critique is optional and permitted only <em>after</em> your human draft is written. Never enter personal emails, passwords, or client records.
                  </p>
                  <pre className="vcep-code-box">{aiPrompt}</pre>
                  <button type="button" className="vcep-copy-btn" onClick={copyPrompt}>{copyState}</button>
                </div>
              </details>

              <InputField
                label="Human Decision Record: Feedback Accepted, Rejected, or Corrected"
                value={draft.aiAudit}
                onChange={v => update('aiAudit', v)}
                placeholder="What did your peers or critique challenge, and what change did you agree to make?"
                rows={3}
              />

              <h3>Drive Edition 3.0 Four-Part Assessment Rubric (/10 Marks)</h3>
              <div className="vcep-rubric-grid">
                {rubricCriteria.map(r => (
                  <div key={r.category} className="vcep-rubric-item">
                    <div className="vcep-rubric-top">
                      <strong>{r.category}</strong>
                      <span>{r.points} marks</span>
                    </div>
                    <p>{r.label}</p>
                  </div>
                ))}
              </div>

              <h3>Student Evidence Self-Checklist</h3>
              {testCriteria.map((criterion, idx) => (
                <label key={idx} className="vcep-check-item">
                  <input
                    type="checkbox"
                    checked={!!checked[idx]}
                    onChange={e => setChecked(curr => ({ ...curr, [idx]: e.target.checked }))}
                  />
                  <span>{criterion}</span>
                </label>
              ))}

              <InputField
                label="One Specific Correction Made After Review"
                value={draft.correction}
                onChange={v => update('correction', v)}
                placeholder="What specific clause, timebox, or backup rule was improved?"
                rows={2}
              />
            </div>
          )}

          {/* SECTION 6: SUBMIT & HANDOVER (130-135 min) */}
          {sectionIndex === 5 && (
            <div className="vcep-block">
              <div className="vcep-kicker">PROFESSIONAL HANDOVER & EXPORT · 5 MIN</div>
              <h2>Export Your Practice Notes</h2>
              <p>
                You have completed the 135-minute Drive Edition 3.0 practice lesson. Your working notes are compiled and ready to export.
              </p>

              <div className="vcep-grid-two">
                <div className="vcep-mini-card">
                  <strong>{completedFields} / {Object.keys(emptyDraft).length}</strong>
                  <p>Practice fields completed</p>
                </div>
                <div className="vcep-mini-card">
                  <strong>{testCriteria.filter((_, i) => checked[i]).length} / {testCriteria.length}</strong>
                  <p>Quality checks verified</p>
                </div>
              </div>

              <div className="vcep-export-actions">
                <button type="button" className="vcep-btn-primary" onClick={exportDraft}>
                  Export Practice Draft (.txt) ↓
                </button>
                <button type="button" className="vcep-btn-danger" onClick={clearPracticeDraft}>
                  Clear Practice Draft
                </button>
              </div>

              <div className="vcep-privacy-warning">
                <strong>Shared Computer Privacy Warning</strong>
                <p>
                  Practice drafts are saved in this browser&apos;s local storage. If using a shared lab computer, always export your practice notes and use <strong>Clear Practice Draft</strong> before leaving the machine.
                </p>
              </div>

              <div className="vcep-worksheet-bridge">
                <strong>Official Faculty Assessment</strong>
                <p>
                  This guided lesson is browser-stored formative practice. Official grading, submission receipts, and faculty evaluation are conducted through the authenticated Assessed Worksheet.
                </p>
                <a href="/?session=2" className="vcep-btn-secondary">
                  Open Assessed Worksheet →
                </a>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <footer className="vcep-panel-footer">
            <button
              type="button"
              className="vcep-nav-btn"
              disabled={sectionIndex === 0}
              onClick={() => navigate(sectionIndex - 1)}
            >
              ← Previous Section
            </button>
            <span className="vcep-footer-save">{saveMessage}</span>
            <button
              type="button"
              className="vcep-nav-btn-primary"
              disabled={sectionIndex === sections.length - 1}
              onClick={() => navigate(sectionIndex + 1)}
            >
              Next Section →
            </button>
          </footer>
        </article>

        <footer className="vcep-page-footer">
          VCEP · Experience corporate before you enter corporate.
          <span>Drive Student Workbook Edition 3.0 · Formative Practice Preview · Fictional simulation</span>
        </footer>
      </main>
    </div>
  );
}
