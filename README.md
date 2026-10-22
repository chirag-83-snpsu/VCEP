# VCEP Commerce WorkLab — PRD implementation

An upgrade of the existing 24-session student workbook into a college-managed learning workspace. Existing project identity, public audience, case content and downloadable student resources are preserved. Faculty answer keys are not included in public assets.

## Operational entry point

The verified site owner (`vayentragurukula@gmail.com`) becomes the administrator through platform sign-in. Everyone else must be enrolled by email. There is no first-user-wins administrator registration.

1. Sign in with the owner account.
2. Open **College setup**, create a cohort and choose open or sequential progression.
3. Add students and faculty to the roster using the email each will sign in with. Faculty is scoped to one cohort in this release.
4. Confirm participation permission only after the college has actually recorded it. Include guardian permission where required. No personal identity-document uploads.
5. Publish session release dates/deadlines and individual extensions where necessary.
6. Students save, attach evidence, accept the integrity declaration and submit. Faculty reviews the immutable attempt, publishes a rubric grade or returns it for revision.

## Delivered

- All 24 connected case studies, source tables, worksheet fields, five independent practice tickets and Word download packs.
- Platform sign-in; server-side student/faculty/admin authorisation; roster-based cohort assignment; student and cohort isolation.
- Cloud drafts with optimistic revision checks; 10-second/blur saves; account-specific local recovery buffer; explicit conflict resolution; latest 10 saved versions and restore.
- Offline buffering/reconnect save while the loaded workspace remains open. This is not a full offline-installable PWA.
- Editable formatted notes (Markdown bold/italic/bullets), editable tables, required-field validation, AI verification records and evidence handover.
- Actual DOCX answer export, print/PDF answer view without textarea truncation, original Word templates, ZIP of all student packs and JSON recovery export.
- Integrity declaration, receipt ID and server timestamp, immutable submission snapshots (including the case/worksheet version), Draft → Submitted → Under review → Graded/Returned, revision attempts, deadlines, late flags, extensions and sequential/date release rules.
- Private evidence files in R2, server-side ownership checks, 5 MB/file and 5 files/session UI limits, signature checks, DOCX package validation and attachment-only downloads. The file-count guard is a pilot application check, not a transactional storage quota.
- Faculty filtered review queue, per-section comments, overall feedback, 4/2/2/2 rubric validation, return/review/grade actions, filtered CSV export, cohort/session/student evidence coverage and mean graded scores.
- Student progress, grades, feedback, upcoming deadlines, in-app receipts/feedback updates, optional focus timer.
- Admin cohort/roster/schedule/extension management and editing of session brief text. Existing worksheet structure and datasets remain controlled curriculum source assets. Word packs are not silently regenerated after online CMS changes.
- Optional lazy-loaded Three.js session city and six commerce concept explainers; Full/Light/Static detection; reduced/off preferences; reduced-motion handling; paused rendering when hidden/offscreen; keyboard-operable text alternatives; no 3D on the editing surface; resource disposal on exit.
- Programme vision/delivery page, privacy/participation notice, 30-minute client inactivity sign-out attempt, audit events for administrative/assessment actions, and public WebMCP session read/navigation tools (feature-detected).

## PRD items that remain institutional production work

The PRD is a multi-phase production specification. This build must not be described as complete against every acceptance criterion.

| Area | Remaining requirement |
|---|---|
| Identity | Institution Google Workspace/SSO or approved student-ID/password provider, password recovery and server-enforced institution session policy. Current supported identity is ChatGPT sign-in. Client inactivity sign-out is not a substitute for identity-provider controls. |
| Notifications | Email provider, institution sender/domain configuration, consent/preferences and scheduled reminder delivery. In-app updates work; no email delivery is claimed. |
| Security | Malware scanner and quarantine, independent penetration testing, transaction-safe upload quotas, institution rate limits, credential/session threat modelling and production incident processes. |
| Privacy | Approved retention/deletion/export workflow, institution data-processing agreements and legal review of applicable requirements and minors' consent. The UI checkbox does not establish legal compliance. |
| Reliability | Scheduled daily backups, verified 30-day retention, restore drills, 4-hour RTO, monitoring and 99.5% availability validation. |
| Scale | 2,000-user concurrency tests, pagination beyond the pilot queue's newest 2,000 attempts, and measured latency/availability under load. |
| Accessibility/performance | Real browser/screen-reader/device QA, six-device 3D validation, 30-minute memory profiling and measured Lighthouse/LCP/FPS/input latency. Build output size checks are not Lighthouse results. |
| 3D assets | Authored marketplace/ship/warehouse GLBs, Blender source, Draco/Meshopt/KTX2 pipeline, asset upload/version registry and production per-device budgets. The present scenes use lightweight procedural geometry. |
| Content | Full worksheet-schema/resource CMS, versioned resource publishing and matching regenerated downloadable editions. |
| Faculty efficiency | Bulk review/return/grade workflows, multi-cohort faculty assignments and rubric moderation/audit UI. Individual review and CSV export work. |
| Learning | Concept-check measurement/A-B study, rewards, plagiarism support and calibrated final credential aggregation if approved. These are not silently invented. |
| Offline | Offline app-shell caching and a full installable PWA. Recovery currently protects edits from the active loaded page. |

## Data and access

`db/schema.ts` is the schema source. Drizzle schema-only migrations are committed in `drizzle/`. D1 holds users, roster, cohorts, schedules, extensions, drafts, versions, immutable attempts, notifications, curriculum overrides, file metadata and audit events. R2 holds private evidence bytes.

All APIs check platform identity and role. Roster membership is separate from identity. Student rows are scoped by platform user ID. Faculty review/file access is scoped by cohort. Writes require a matching Origin. Prepared SQL uses bound values. Grade ranges, answers, file type/size and request-body sizes are checked server-side. The platform's trusted authentication headers must never be accepted directly from an untrusted proxy outside Sites.

## Validation

- `pnpm exec tsc --noEmit`
- `node /root/.codex/plugins/cache/openai-curated-remote/sites/0.1.75/scripts/build-site.mjs`
- `node tests/workflow.mjs` — isolated local Worker/D1/R2 integration; no production learner records or fabricated results are seeded.
- `tests/workflow.mjs` covers identity/enrolment, cross-student and cross-cohort isolation, write-origin rejection, revision conflict handling, required integrity, late/extension flags, immutable attempts, review/return/resubmit/grade flow, release locks, version retention/restore CMS behaviour, immutable case snapshots, private evidence uploads/downloads and server rendering.

Browser interaction, assistive-technology, WebMCP execution and physical-device validation were unavailable in the current permitted preview environment. They remain an acceptance gate for a real college rollout. No production sign-in journey or browser visual QA is claimed merely because the build passes.

## Source and publication

Preserve `.openai/hosting.json` project ID. The selected project uses logical `DB` and `BUCKET` bindings. Never commit credentials or local student data. Production schema changes must use new immutable Drizzle migrations. Generated output is not source; public blank worksheet packs live under `public/downloads`.

## Session exploration correction

The default home for every role now includes all 24 session cards. Faculty and administrators switch to Management explicitly. Clicking a session as a visitor or staff member opens the full Practice Lab immediately; enrolled students open their cloud-backed assessed worksheet. The Practice action remains available separately for local exercises.

Practice Lab contains four guided stages: case and source records, editable working, squad/AI activities, and review/export. It includes local browser saving, source CSV downloads, Word/PDF/JSON exports, direct session links and previous/next/jump navigation. Its local storage and lack of grading are clearly labelled. Practice answers can be explicitly imported into an enrolled student's assessed draft before official submission; they never silently overwrite or submit cloud data. Anonymous users get a sign-in-to-submit link, pending users get their enrolment requirement, and faculty keep the review queue. Existing backend membership, consent, deadlines and submission integrity controls remain enforced.

## Indian company case edition 30 September 2026

All 24 session briefs now use a clearly labelled Infosys, HUL, Maruti Suzuki or Titan company lens. Official historical FY2024–25 context is sourced separately from invented operating records. Each session has three data tables, three short answer cells and one recommendation. The individual task is 10–15 minutes, excluding advance case reading and team play. The 15-minute squad lab includes four roles, rounds, an interactive surprise card, an AI critic prompt, an offline alternative and five peer-feedback points (not grades).

Download routes generate current Word worksheets and the full ZIP from the same curriculum as the site. Legacy public static files remain historical resources; current UI links point to `/api/template/{id}` and `/api/template/all`. Saved old cloud drafts and submissions retain their original case; an explicit new-edition action starts a blank current draft. Local practice uses an edition-specific key so old answers cannot populate unrelated new questions. Stale CMS case bodies from the previous edition do not override the new base; new CMS edits retain the edition tag.
