# VCEP — Prioritized Remediation Roadmap & Release Action Plan

**Application:** VCEP (Vayentra Corporate Experience Program)  
**Version Under Test:** 0.1.0  
**Target Release:** Production Launch / Netlify-Cloudflare Edge  
**Auditor:** Release Certification Lead & Principal Software Testing Engineer  
**Classification:** RELEASE QUALITY REMEDIATION ROADMAP  

---

## 1. Executive Roadmap Summary

This Remediation Roadmap establishes the exact sequence of engineering actions required to transition VCEP from **CONDITIONALLY READY — WITH EXPLICIT LIMITATIONS** to **READY FOR PRODUCTION LAUNCH**.

Remediation is organized into four sequential, dependency-ordered phases:
- **Phase 1: Critical Security Blocker (P0)** — Eliminate identity header spoofing vulnerability.
- **Phase 2: Configuration & Feature Availability (P2)** — Unblock Vivi voice assistant and provision staging model secrets.
- **Phase 3: CI/CD Automation & Quality Gates (P2)** — Implement GitHub Actions pipeline and `pnpm test` script.
- **Phase 4: Optimization & Polish (P3)** — Dynamic code-splitting for 3D canvas and clean up legacy routes.

---

## 2. Phase 1: Critical Security Blocker (P0)

### Item 1.1: Neutralize Identity Header Trust in Standalone Deployments (DEF-001)
- **Priority:** **P0 — CRITICAL (MANDATORY RELEASE BLOCKER)**
- **Target Component:** `app/api/[...path]/route.ts#L130-L140` and `app/chatgpt-auth.ts#L21-L40`
- **Confirmed Root Cause:** `getChatGPTUser()` blindly reads `oai-authenticated-user-*` headers from the request without origin verification or shared secret protection.
- **Implementation Action:**
  1. In `app/api/[...path]/route.ts`, introduce an environment check:
     ```typescript
     // Bypass unverified canvas identity headers in standalone production
     const isCanvasEnvironment = Boolean(process.env.OPENAI_CANVAS_ENABLED === 'true' || (env as any)?.OPENAI_CANVAS_ENABLED === 'true');
     let auth = isCanvasEnvironment ? await getChatGPTUser() : null;
     ```
  2. Ensure that in standard web deployments (Netlify/Cloudflare), authentication is strictly derived from the validated D1 session token (`getSessionTokenFromCookie(req.headers.get('cookie'))`).
- **Dependencies:** None.
- **Regression Verification:**
  - Execute Miniflare synthetic request with forged `oai-authenticated-user-email: vayentragurukula@gmail.com`.
  - Assert that response returns `{"user": null}` and HTTP 401 for protected endpoints.
- **Acceptance Criteria:** Zero authentication bypass possible via HTTP request headers.

---

## 3. Phase 2: Configuration & Feature Availability (P2)

### Item 2.1: Grant Microphone Origin Permissions on Netlify (DEF-002)
- **Priority:** **P2 — MEDIUM**
- **Target Component:** `netlify.toml` (Line 38)
- **Confirmed Root Cause:** `Permissions-Policy` directive `microphone=()` disables browser Web Speech API across the entire origin.
- **Implementation Action:**
  Update `netlify.toml` line 38:
  ```toml
  Permissions-Policy = "camera=(), microphone=(self), geolocation=()"
  ```
- **Dependencies:** None.
- **Regression Verification:**
  Deploy preview to Netlify; click Vivi microphone button; verify browser prompts for audio permission and captures voice transcript.
- **Acceptance Criteria:** Vivi AI voice dictation operates without browser security exceptions.

### Item 2.2: Provision Cloudflare Staging AI Provider Secrets (DEF-005)
- **Priority:** **P2 — MEDIUM**
- **Target Component:** Cloudflare Worker Environment / `wrangler.staging.json`
- **Confirmed Root Cause:** Cloudflare Staging Worker lacks encrypted secret `VIVI_API_KEY` or `OPENAI_API_KEY`, causing `/api/vivi/chat` to return HTTP 503 `PROVIDER_UNCONFIGURED`.
- **Implementation Action:**
  Execute via Cloudflare CLI:
  ```bash
  npx wrangler secret put VIVI_API_KEY --config wrangler.staging.json
  # Alternatively, attach Cloudflare Workers AI binding in wrangler.staging.json:
  # "ai": { "binding": "AI" }
  ```
- **Dependencies:** Access to institutional Cloudflare account.
- **Regression Verification:**
  Run `tests/smoke-test-vivi.mjs` against staging worker; assert HTTP 200 SSE streaming response.
- **Acceptance Criteria:** Vivi AI streams live model responses on the staging environment.

---

## 4. Phase 3: CI/CD Automation & Quality Gates (P2)

### Item 3.1: Add Automated Test Script to `package.json` (DEF-003)
- **Priority:** **P2 — MEDIUM**
- **Target Component:** `package.json` (Scripts Section)
- **Implementation Action:**
  Add a unified test script:
  ```json
  "scripts": {
    "test": "node tests/verify-review-engine.mjs && node tests/verify-auth-system.mjs && node tests/verify-vivi-system.mjs && node tests/workflow.mjs"
  }
  ```
- **Dependencies:** None.
- **Regression Verification:** Run `corepack pnpm test`; assert exit code 0.
- **Acceptance Criteria:** Developers and CI runners can execute the test suite with a standard command.

### Item 3.2: Implement GitHub Actions Quality Gates Workflow (DEF-004)
- **Priority:** **P2 — MEDIUM**
- **Target Component:** `.github/workflows/ci.yml`
- **Implementation Action:**
  Create `.github/workflows/ci.yml` following the four-stage pipeline design specified in `docs/qa/C5_TEST_PROCESS_AND_CICD.md`:
  1. Static analysis (`tsc --noEmit`, `eslint`).
  2. Unit and Edge integration tests.
  3. Browser smoke and viewport overflow tests.
  4. Release certification check.
- **Dependencies:** DEF-003 (`pnpm test` availability).
- **Regression Verification:** Push branch to GitHub; verify automated green checkmark on PR.
- **Acceptance Criteria:** Every push and pull request is automatically verified prior to merge.

---

## 5. Phase 4: Optimization & Polish (P3)

### Item 4.1: Update Legacy Sign-In Route in Practice Lab (DEF-006)
- **Priority:** **P3 — LOW**
- **Target Component:** `app/practice-lab.tsx` (Line 31)
- **Implementation Action:**
  Change `href={'/signin-with-chatgpt?return_to='...` to `href={'/signin?return_to='...`.
- **Dependencies:** None.
- **Acceptance Criteria:** Clicking "Sign in to submit" routes to the active login page.

### Item 4.2: Code-Split 3D Three.js Bundle (DEF-007)
- **Priority:** **P3 — LOW**
- **Target Component:** `app/workspace.tsx`, `app/commerce-scene.tsx`
- **Implementation Action:**
  Wrap 3D canvas in `React.lazy()` or `next/dynamic` with `ssr: false` to reduce initial client chunk size below 500 kB.
- **Acceptance Criteria:** `pnpm run build` completes with zero chunk size warnings.

---

## 6. Implementation Summary & Release Checkpoints

```
[Phase 1: DEF-001 (P0)] ──> Checkpoint 1: Security Audit Sign-Off
            │
[Phase 2: DEF-002, 005] ──> Checkpoint 2: Feature & AI Connectivity Sign-Off
            │
[Phase 3: DEF-003, 004] ──> Checkpoint 3: CI/CD Quality Gate Sign-Off
            │
[Phase 4: DEF-006, 007] ──> Checkpoint 4: Final Release Certification
```

*By executing this structured remediation roadmap, VCEP will achieve an uncompromising, release-quality software baseline ready for multi-institution deployment.*
