# VCEP — Defect Register & Vulnerability Tracking Log

**Application:** VCEP (Vayentra Corporate Experience Program)  
**Version Under Test:** 0.1.0  
**Audit Date:** November 4, 2026  
**Auditor:** Principal Software Testing Engineer & Application Security Specialist  
**Classification:** RELEASE QUALITY AUDIT LOG  

---

## 1. Defect Summary Statistics

| Severity Level | Definition | Confirmed Open | Resolved in Audit | Release Blocker? |
|---|---|:---:|:---:|:---:|
| **P0 — Critical** | Security vulnerability, broken authentication, data loss, cross-tenant breach, assessment bypass | 1 | 0 | **YES (Hard Blocker)** |
| **P1 — High** | Core student workflow broken, AI stream failure in production, arithmetic formula error | 0 | 2 (Historical) | **NO** |
| **P2 — Medium** | Configuration defect, missing CI pipeline, responsive layout edge case, test runner omission | 4 | 0 | **CONDITIONAL** |
| **P3 — Low** | Minor cosmetic styling, non-blocking label typo, bundle chunk size warning | 2 | 0 | **NO** |
| **Total** | | **7** | **2** | |

---

## 2. Active Defect Register

### DEF-001: Authentication Bypass via Development Header Trust in Production Deployment
- **Severity:** **P0 — CRITICAL (RELEASE BLOCKER)**
- **Category:** Application Security / Broken Access Control (OWASP A01 / CWE-287)
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `app/chatgpt-auth.ts` (Lines 21–40)
  - `app/api/[...path]/route.ts` (Lines 130–140)
- **Reproduction Steps:**
  1. Build and run the production server bundle: `corepack pnpm build`.
  2. Send an HTTP GET request to `/api/boot` with headers:
     ```http
     GET /api/boot HTTP/1.1
     Host: 127.0.0.1:5173
     oai-authenticated-user-email: vayentragurukula@gmail.com
     oai-authenticated-user-id: attacker-01
     ```
  3. Inspect the JSON response body.
- **Expected Behavior:**
  The server must reject or ignore unvalidated external headers, returning unauthenticated public data (`{"user": null}`) unless a valid signed session cookie is present.
- **Actual Behavior:**
  The server trusts the header and returns an authenticated Administrator session (`"role": "admin"`), granting full access to institutional rosters, all student submissions, and grading controls.
- **Root Cause:**
  `getChatGPTUser()` was designed for an OpenAI Canvas reverse-proxy environment where incoming headers were stripped by the gateway. When deployed to a standalone Cloudflare Worker or Netlify, external clients can set arbitrary headers.
- **Evidence:**
  Verified in Miniflare and test suites (`tests/workflow.mjs` lines 10–12 relies on these headers).
- **Proposed Fix:**
  In `app/api/[...path]/route.ts`, gate `getChatGPTUser()` behind an internal environment check or require a shared secret header (`X-Canvas-Secret`). In standalone Netlify/Cloudflare mode, bypass it completely and require `getSessionTokenFromCookie()`.
- **Regression Test Recommendation:**
  Add a dedicated negative test verifying that requests with forged `oai-authenticated-user-*` headers from public origins receive `{"user": null}`.

---

### DEF-002: Permissions-Policy Disables Vivi Voice Recognition on Netlify
- **Severity:** **P2 — MEDIUM**
- **Category:** Deployment Configuration / Feature Availability
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `netlify.toml` (Line 38)
- **Reproduction Steps:**
  1. Inspect `netlify.toml` global security response headers under `[[headers]]`.
  2. Observe `Permissions-Policy = "camera=(), microphone=(), geolocation=()"`.
  3. Deploy to Netlify and click the microphone icon in Vivi AI (`<ViviWidget />`).
- **Expected Behavior:**
  Browser prompts for microphone access and allows voice dictation for Vivi AI.
- **Actual Behavior:**
  Browser immediately blocks microphone access due to `microphone=()`, disabling voice input.
- **Root Cause:**
  Overly restrictive default permissions policy header template that omitted the `(self)` origin directive.
- **Evidence:**
  `netlify.toml:38: Permissions-Policy = "camera=(), microphone=(), geolocation=()"`.
- **Proposed Fix:**
  Update line 38 of `netlify.toml` to:
  `Permissions-Policy = "camera=(), microphone=(self), geolocation=()"`.
- **Regression Test Recommendation:**
  Verify in Chrome/Safari that microphone permission is granted on the origin domain.

---

### DEF-003: Missing Automated Test Runner Script in `package.json`
- **Severity:** **P2 — MEDIUM**
- **Category:** Test Operations / Developer Tooling
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `package.json` (Lines 8–15)
- **Reproduction Steps:**
  1. Run `corepack pnpm test` in terminal.
- **Expected Behavior:**
  Executes the automated regression test suite and reports exit status.
- **Actual Behavior:**
  `ERR_PNPM_NO_SCRIPT: Missing script: test`.
- **Root Cause:**
  `package.json` defines `install:ci`, `dev`, `build`, `start`, `lint`, and `db:generate`, but omitted a unified `"test"` command.
- **Evidence:**
  `package.json` script section inspection.
- **Proposed Fix:**
  Add `"test": "node tests/workflow.mjs"` (or a unified script running all 12 test suites) to `package.json`.
- **Regression Test Recommendation:**
  Execute `pnpm test` and verify clean 0 exit code.

---

### DEF-004: Missing GitHub Actions CI/CD Workflow Directory
- **Severity:** **P2 — MEDIUM**
- **Category:** CI/CD / Release Automation
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `.github/workflows/` (Missing directory)
- **Reproduction Steps:**
  1. Inspect root directory for `.github/workflows/`.
- **Expected Behavior:**
  GitHub Actions automated workflow executes type checks, linting, unit tests, and build checks on pull requests.
- **Actual Behavior:**
  Directory does not exist; pull requests on GitHub run zero automated quality gates.
- **Root Cause:**
  CI configuration was managed via local scripts and has not yet been codified into a GitHub Actions YAML workflow.
- **Evidence:**
  `ls -la .github/workflows` returns "No such file or directory".
- **Proposed Fix:**
  Create `.github/workflows/ci.yml` adhering to the specification in `docs/qa/C5_TEST_PROCESS_AND_CICD.md`.
- **Regression Test Recommendation:**
  Trigger a test PR and verify that all quality gate steps pass.

---

### DEF-005: Vivi AI Provider Unconfigured in Staging/Production Environment
- **Severity:** **P2 — MEDIUM**
- **Category:** Configuration / AI Functionality
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `wrangler.staging.json` (Lines 1–19)
  - `lib/vivi/vivi-providers.server.ts` (Lines 137–156)
- **Reproduction Steps:**
  1. Run `tests/smoke-test-vivi.mjs` against staging without local development flags.
  2. Send a query to `/api/vivi/chat`.
- **Expected Behavior:**
  Vivi streams a response from the configured model provider.
- **Actual Behavior:**
  Server returns HTTP 503 with code `PROVIDER_UNCONFIGURED`: *"No model provider configured. Set VIVI_API_KEY or OPENAI_API_KEY."*
- **Root Cause:**
  `wrangler.staging.json` does not bind `AI` (Cloudflare Workers AI) and lacks encrypted secrets for `VIVI_API_KEY` or `OPENAI_API_KEY`. (Local dev works because `VIVI_LOCAL_DEV: "true"` enables the built-in pedagogical tutor).
- **Evidence:**
  `tests/smoke-test-vivi.mjs` diagnostic outcome: `FAILED / BLOCKED - 503 PROVIDER_UNCONFIGURED`.
- **Proposed Fix:**
  Set `VIVI_API_KEY` via Cloudflare secrets (`npx wrangler secret put VIVI_API_KEY --config wrangler.staging.json`) or attach Workers AI binding.
- **Regression Test Recommendation:**
  Run `tests/smoke-test-vivi.mjs` against staging and verify HTTP 200 SSE stream.

---

### DEF-006: Hardcoded Legacy Route in Practice Lab Submission Card
- **Severity:** **P3 — LOW**
- **Category:** Usability / Dead Link
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `app/practice-lab.tsx` (Line 31)
- **Reproduction Steps:**
  1. Open Practice Lab unauthenticated.
  2. Inspect "Sign in to submit" anchor tag: `<a href={'/signin-with-chatgpt?return_to=...`
  3. Click link.
- **Expected Behavior:**
  Navigates to the platform sign-in page (`/signin?return_to=...`).
- **Actual Behavior:**
  Navigates to `/signin-with-chatgpt`, which was an OpenAI Sites canvas route.
- **Root Cause:**
  Legacy URL path that was not updated during the standalone authentication refactor.
- **Evidence:**
  `app/practice-lab.tsx#L31`.
- **Proposed Fix:**
  Update URL to `/signin?return_to=...`.

---

### DEF-007: Client Bundle Chunk Size Warning (> 500 kB)
- **Severity:** **P3 — LOW**
- **Category:** Performance / Bundle Optimization
- **Status:** **CONFIRMED OPEN**
- **Affected Files:**
  - `vite.config.ts`
  - `app/commerce-scene.tsx`
- **Reproduction Steps:**
  1. Run `corepack pnpm build`.
- **Expected Behavior:**
  Build completes with zero chunk warnings.
- **Actual Behavior:**
  Vite reports: `(!) Some chunks are larger than 500 kB after minification`.
- **Root Cause:**
  Three.js (`three@0.186.0`) 3D canvas is statically bundled into the primary client chunk.
- **Evidence:**
  `pnpm run build` output logs.
- **Proposed Fix:**
  Load 3D scenes dynamically via `React.lazy()` with dynamic code splitting.

---

## 3. Resolved Historical Defects (Verified Closed in Audit)

| Defect ID | Historical Issue Description | Resolution Applied | Current Verification Evidence |
|---|---|---|---|
| **HIST-001** | Vivi AI returned identical boilerplate answers for all questions. | Removed static template; dynamically grounded responses in user query and curriculum context. | `tests/test-vivi-distinct-queries.mjs`: 6/6 distinct topical responses verified. |
| **HIST-002** | Vivi returned 503 "temporarily unavailable" in local dev when keys were missing. | Built-in Socratic tutor engine (`streamLocalIntelligentTutor`) added for local dev. | `tests/verify-vivi-system.mjs`: Socratic engine verified; honest 503 returned when unconfigured. |

---

*The Defect Register clearly separates the single P0 release blocker (DEF-001) from operational improvements, providing a transparent remediation path for production certification.*
