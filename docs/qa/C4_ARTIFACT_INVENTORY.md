# VCEP — C4: Complete Application Artifact Inventory

**Application:** VCEP (Vayentra Corporate Experience Program)  
**Version Under Test:** 0.1.0  
**Git Branch:** `release/netlify-production-launch` (Commit `4e59684`)  
**Auditor:** Full-Stack Quality Auditor & Principal Software Testing Engineer  
**Classification:** RELEASE QUALITY AUDIT BASELINE  

---

## 1. Overview

Phase C4 provides an exhaustive inventory of all architectural artifacts comprising the VCEP platform. Every artifact is mapped to its physical source file, functional purpose, test requirements, verification evidence, and associated defect references.

---

## 2. Frontend Artifacts

| Artifact Category | Source File(s) | Functional Purpose | Test Requirements Mapped | Verification Evidence | Defect Ref |
|---|---|---|---|---|:---:|
| **Liquid Glass Homepage** | `app/page.tsx`<br>`app/workspace.tsx`<br>`app/premium-journey.tsx` | Brand presentation, four tracks display, learner dashboard | REQ-UI-01, REQ-NAV-01 | Chrome CDP 1440px / 390px rendered with 0 overflow | None |
| **Sticky Navigation Bar** | `components/vcep-navbar.tsx`<br>`components/brand-logo.tsx` | Persistent brand header, user profile chip, sign-out trigger | REQ-NAV-02 | Verified across viewport scrolling; sticky header remains anchored | None |
| **Authentication & Sign-In** | `app/signin/page.tsx`<br>`app/activate/page.tsx` | Password login, invitation activation, error banners | REQ-AUTH-01, REQ-AUTH-02 | Tested in `tests/verify-auth-system.mjs` (12/12 pass) | None |
| **Guided Learning Shell** | `app/guided-learning/page.tsx`<br>`app/guided-learning/guided-learning.css` | 6-stage navigation tab container, mission header, draft controls | REQ-GUID-01 | Tested across all 24 sessions in `scratch/audit-24-sessions.mjs` | None |
| **Session 01 Startup Journey** | `app/guided-learning/components/session-01-startup-journey.tsx`<br>`session-01-startup-data.ts` | 6-stage startup journey (Founder Mindset to Investor Pitch Deck) | REQ-S01-01 | All 6 stages tested in CDP; interactive inputs verified | None |
| **Investor Pitch Deck** | `session-01-startup-journey.tsx#L1000`<br>`session-01-startup-data.ts#L994` | 8-slide in-platform investor pitch presentation mode | REQ-S01-02 | Verified 8 slides with speaker notes and full-screen mode | None |
| **Track 1 Workstations (S02–S06)** | `app/guided-learning/workstations/session-02` through `06-workstation.tsx` | Professional Identity, Communication, Meetings, Ledger, Month-End | REQ-TRK1-01 | 100% workstation mounting confirmed; 0 broken controls | None |
| **Track 2 Workstations (S07–S12)** | `app/guided-learning/workstations/session-07` through `12-workstation.tsx` | Excel Cleaning, BRS, Performance, MIS, GST, Receivables | REQ-TRK2-01 | Verified formula reconciliation and zero-variance math | None |
| **Track 3 Workstations (S13–S18)** | `app/guided-learning/workstations/session-13` through `18-workstation.tsx` | AI for Commerce, Verification, Sales Funnel, Decision, Capstone | REQ-TRK3-01 | Verified prompt engineering and capstone discovery forms | None |
| **Track 4 Workstations (S19–S24)** | `app/guided-learning/workstations/session-19` through `24-workstation.tsx` | QA Testing, Change Control, Resume, Exit Assessment B, Passport | REQ-TRK4-01 | Session 22 Exit B locked; Session 24 Passport verified | None |
| **Vivi AI Chat Widget** | `components/vivi/vivi-widget.tsx`<br>`components/vivi/vivi.css` | Voice & conversational tutor; Speech-to-Text; Kannada rendering | REQ-VIVI-01 | Verified FAB open, drawer animation, Kannada script | **DEF-002** (Netlify mic) |
| **Practice Lab (Legacy Bridge)** | `app/practice-lab.tsx` | Sandbox practice lab for unauthenticated exploratory use | REQ-PRAC-01 | Form controls intact; legacy link contains dead route | **DEF-006** (`signin-with-chatgpt`) |

---

## 3. Backend & Core Library Artifacts

| Artifact Category | Source File(s) | Functional Purpose | Test Requirements Mapped | Verification Evidence | Defect Ref |
|---|---|---|---|---|:---:|
| **Edge API Controller** | `app/api/[...path]/route.ts` | Central REST API router for Cloudflare Workers | REQ-API-01 | Unit & integration tests pass; unvalidated header trust | **DEF-001** (Header trust) |
| **ChatGPT Auth Adaptor** | `app/chatgpt-auth.ts` | Legacy OpenAI canvas reverse-proxy header extractor | REQ-AUTH-03 | Blindly reads `oai-authenticated-user-*` headers | **DEF-001** (Header trust) |
| **Authentication Cryptography** | `lib/auth-crypto.server.ts` | Web Crypto PBKDF2 hashing, SHA-256 tokens, cookies | REQ-AUTH-01 | Verified in `tests/verify-auth-system.mjs` | None |
| **Review Engine Dispatcher** | `lib/review-engine/engine.ts`<br>`lib/review-engine/registry.ts` | Automatic formative evaluation orchestrator | REQ-FORM-01 | Verified in `tests/verify-review-engine.mjs` (5/5 pass) | None |
| **Session Rules Modules** | `lib/review-engine/session-rules/session-01.ts`, `02.ts`, `07.ts`, `08.ts`, `generic-session.ts` | Specialized formula, variance, and governance evaluation logic | REQ-FORM-02 | Zero-variance proof algorithms verified across all test cases | None |
| **Vivi AI Server Controller** | `lib/vivi/vivi-server.ts` | Chat request orchestration, rate limiting, SSE streaming | REQ-VIVI-02 | Verified in `tests/verify-vivi-system.mjs` (11/11 pass) | None |
| **Vivi Provider Abstraction** | `lib/vivi/vivi-providers.server.ts` | OpenAI, Cloudflare Workers AI, and Local Socratic tutor streaming | REQ-VIVI-03 | Tested live streaming, timeouts, and unconfigured 503 fallback | **DEF-005** (Missing prod keys) |
| **Vivi Assessment Guardrails** | `lib/vivi/vivi-guardrails.server.ts` | Anti-cheating filters, Session 22 Exit B lockout | REQ-VIVI-04 | 100% prompt injection and Session 22 lockout verification | None |
| **Curriculum Context Retriever** | `lib/vivi/vivi-context.server.ts` | Permission-gated RAG context retrieval for active session | REQ-VIVI-05 | Authorized Session 07 context injection verified in SSE | None |
| **Word & ZIP Export Engine** | `lib/export-work.ts` | In-memory generation of DOCX and ZIP course archives | REQ-EXPT-01 | DOCX XML validity confirmed in `tests/workflow.mjs` | None |

---

## 4. API Endpoints Inventory

All endpoints exposed under `/api/*` were verified:

| HTTP Method | Route Path | Access Level | Request Validation | Response Schema / Status | Rate Limited? | Data Isolation Guard |
|---|---|---|---|---|:---:|---|
| `POST` | `/api/auth/signin` | Public | Email and Password strings | `{ ok: true, user, redirectUrl }` + Cookie | No | N/A |
| `POST` | `/api/auth/signout` | Authenticated | Cookie token | `{ ok: true }` + Clear Cookie | No | Deletes caller's session |
| `GET` | `/api/auth/invitation` | Public | `?token=...` query param | `{ ok: true, email, role, cohort, cohortName }` | No | SHA-256 token lookup |
| `POST` | `/api/auth/activate` | Public | Token, Password (>= 8 chars), Name | `{ ok: true, user, redirectUrl }` + Cookie | No | Single-use token marked used |
| `GET` | `/api/boot` | Public / Auth | Cookie token or dev header | `{ user, sessions, drafts?, submissions?, ... }` | No | Roster & cohort scoping |
| `GET` | `/api/guided/session/:id` | Student / Staff | Session ID (1–24) | `{ lesson }` | No | Consent, sequential & unlock locks |
| `GET` | `/api/template/:id` | Student / Staff | Session ID (1–24) | Binary DOCX (`Content-Disposition: attachment`) | No | Sequential unlock validation |
| `GET` | `/api/template/all` | Student / Staff | None | Binary ZIP (`VCEP_24_India_Case_Worksheets.zip`) | No | Filtered by student's unlocked sessions |
| `GET` | `/api/draft/:id` | Student | Session ID | `{ sessionSnapshot, draft, versions, uploads }` | No | Scoped to `owner === uid` |
| `POST` | `/api/draft/:id` | Student | Answers JSON, Revision integer | `{ revision, updated, answers, sessionSnapshot }` | No | Optimistic CAS: `drafts.revision = rev` |
| `POST` | `/api/submit/:id` | Student | `integrity === true`, Revision match | `{ receipt, created, late, status: 'Submitted' }` | No | Checks required fields & deadlines |
| `POST` | `/api/upload/:id` | Student | Multipart form; magic byte check | `{ id, filename, size, mime }` | No | Max 5 files; max 5 MB per file |
| `GET` | `/api/file/:id` | Student / Staff | File ID | Binary stream (`Content-Disposition: attachment`) | No | File owner or cohort faculty only |
| `GET` | `/api/review/:id` | Faculty / Admin | Submission ID | Submission details with answers & grade | No | Faculty cohort match (`mayReview`) |
| `POST` | `/api/review/:id` | Faculty / Admin | Action: `review` \| `grade` \| `return` | `{ status }` | No | Validates 10-point rubric limits |
| `POST` | `/api/admin/cohort` | Admin | Cohort Name (3–100 chars), Policy | `{ id }` | No | Admin role required |
| `POST` | `/api/admin/roster` | Admin | Array of 1–200 roster rows | `{ count }` | No | Admin role required |
| `POST` | `/api/admin/invite` | Admin / Faculty | Email address | `{ ok, email, role, cohort, token, inviteUrl }` | No | Faculty restricted to own cohort |
| `POST` | `/api/admin/assignment`| Admin | Cohort, Session, Due, Unlock | `{ ok: true }` | No | Admin role required |
| `POST` | `/api/vivi/chat` | Enrolled Student | Message (1–1000 chars), Mode, Context | SSE Stream (`text/event-stream`) | **YES** | 15 req / 10 min; Session 22 lockout |

---

## 5. Database Schema & Storage Bindings

### D1 Database Schema (`DB`)
- **`assignments`:** `(id PK, cohort, session, due, unlock)` — Unique on `(cohort, session)`.
- **`audit`:** `(id PK, actor, event, target, created)` — System audit trail for compliance.
- **`cohorts`:** `(id PK, name, policy DEFAULT 'open', created)`.
- **`content`:** `(session PK, body, updated)` — Central CMS overrides.
- **`drafts`:** `(id PK, owner, session, answers, revision, updated, status DEFAULT 'Draft')` — Unique on `(owner, session)`.
- **`extensions`:** `(id PK, email, session, due)`.
- **`notifications`:** `(id PK, owner, message, created, seen DEFAULT 0)`.
- **`roster`:** `(email PK, name, role, cohort, studentId, consent DEFAULT 0)`.
- **`submissions`:** `(id PK, owner, email, name, cohort, session, answers, created, status, late, revision, grade, feedback, reviewer)`.
- **`uploads`:** `(id PK, owner, session, filename, mime, size, created)`.
- **`users`:** `(id PK, email UNIQUE, name, created)`.
- **`versions`:** `(id PK, draft, revision, answers, created)` — Rolling 10-version history.
- **`auth_credentials`:** `(id PK, email UNIQUE, password_hash, salt, created, updated)`.
- **`invitations`:** `(id PK, email, token_hash UNIQUE, role, cohort, expires, used DEFAULT 0, created)`.
- **`sessions`:** `(id PK, user_id, email, created, expires, user_agent, ip_hash)`.

### Object Storage Bindings (`BUCKET` / Cloudflare R2)
- Stores student private evidence files (PNG, JPEG, PDF, DOCX).
- Encrypted at rest; accessed strictly through authenticated `/api/file/:id` proxy.

---

## 6. Deployment & Infrastructure Artifacts

| Infrastructure Artifact | Configuration File | Purpose & Settings | Audit Finding |
|---|---|---|---|
| **Netlify Option B Config** | `netlify.toml` | Build command: `corepack pnpm build`<br>Publish dir: `dist/client`<br>Proxy `/api/*` to Cloudflare Worker<br>Security headers: HSTS, X-Frame-Options, CSP | **DEF-002:** `Permissions-Policy` disables microphone. |
| **Cloudflare Staging Config** | `wrangler.staging.json` | Worker: `vcep-staging-worklab`<br>D1 binding: `vcep-staging-d1`<br>Assets: `dist/client` | **DEF-005:** Missing `VIVI_API_KEY` secret definition. |
| **Vite / vinext Build Config**| `vite.config.ts` | Miniflare bindings for local development and build pipelines | **DEF-007:** Client bundle > 500 kB chunk warning. |
| **Continuous Integration** | `.github/workflows/` | Automated GitHub Actions CI pipeline | **DEF-004:** Directory missing; zero automated CI gates. |

---

*Phase C4 artifact inventory confirms comprehensive architectural implementation across all tiers, while identifying the exact code and configuration artifacts requiring remediation.*
