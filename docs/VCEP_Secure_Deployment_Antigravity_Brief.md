# VCEP — Secure Deployment & Guided Learning Access Brief

**Project:** `chirag-83-snpsu/VCEP` on the user's Mac in Antigravity.  
**Purpose:** Secure Drive Edition 3.0 Guided Learning before any public deployment.  
**Mode:** Read-only audit first. No automated deployment or production-data operations.

## Evidence boundary

The user reports all eight homepage and lesson integration checks passing locally. The latest local Git changes and post-integration screenshots are not accessible here. The GitHub `main` snapshot and the previously generated Drive Edition 3.0 frontend package were inspected. Do not assume remote GitHub `main` mirrors the Mac.

## Security issues identified in inspected sources

1. The starter `app/guided-learning/page.tsx` is a client component importing all 24 lesson bodies directly from `drive-edition-3.json`. A hidden button is not authorization; the JavaScript/content may be retrievable.
2. The original `app/api/[...path]/route.ts` returns full session data for anonymous `boot` and exposes `template/:session` and `template/all` before authentication. Determine which resources the institution intends to keep public before changing legacy behavior.
3. The original `app/chatgpt-auth.ts` trusts `oai-authenticated-user-*` headers provided by the current hosted platform; `build/sites-vite-plugin.ts` simulates login locally. Neither is a production login solution on arbitrary third-party hosting.
4. Original student records use the authenticated `uid` as owner (`drafts`, `submissions`, `uploads`, notifications and versions indirectly), whereas `roster` uses email. Replacing login can change `uid` and sever access to existing data unless identity linking is planned.
5. The two curricula are different editions. Official assessed worksheets, saved drafts, legacy snapshots, faculty reviews, grades and submitted records must remain intact.

## Intended permissions

| Role | Public title catalogue | Edition 3 lesson | Official assessed worksheet | Management |
|---|---|---|---|---|
| Guest, not signed in | Yes | No | No | No |
| Signed in, not enrolled/pending | Yes | No | No | No |
| Enrolled but not eligible/consent incomplete | Yes | No | No | No |
| Student in active eligible cohort | Yes | Only released sessions, applying cohort policy | Existing original authorization rules | No |
| Faculty | Yes | Only authorized assigned cohorts | Read/review only as allowed by current backend | Only assigned cohorts |
| Administrator | Yes | Yes under auditable privileges | Existing admin operations | Authorized administration |

Treat the above as a proposed policy to review with the owner before implementation. Do not infer payment eligibility solely from an email address.

## Read-only audit: first Antigravity task

1. `git status --short`, `git branch --show-current`, `git diff --name-only`; stop if uncommitted/unknown changes might be overwritten.
2. Identify actual homepage, guided-learning client/server modules, curriculum JSON imports, JavaScript build assets, public/download links, API bootstrap/templates, authentication adapter, D1/R2 bindings, and Vite deployment profiles.
3. Build locally, inventory public assets and bundle references to student lesson text. Explain what an anonymous user can fetch even when navigation buttons are hidden.
4. Trace the route and role decisions from anonymous to pending to student to faculty/admin, including cross-cohort reads and ID manipulation.
5. Inventory all uses of external identity IDs and email in user records. Produce a data-preserving authentication migration strategy.
6. Output proposed file-by-file change list, risk assessment, test matrix and rollback strategy. **Do not modify code, DB, secrets or deployments in the audit pass.**

## Implementation phase 1 — Isolate premium course content

- Move full 24-session lesson contents into a **server-only content module/storage** so no course body is imported by a client component, embedded in public assets, or delivered as HTML hydration for unauthorized users.
- Provide a read-only authenticated endpoint, conceptually `GET /api/guided/session/:id`, that returns **one** lesson after server-side identity, role, active-cohort, consent/eligibility, assignment/release and cross-cohort checks.
- Reuse existing policy semantics thoughtfully; do not accidentally relax `available()` checks. Default deny where a release decision is unclear. Require a documented publication/assignment state if the product is paid and sessions must be released explicitly.
- Return only safe catalogue metadata to unauthenticated users; separately review the current public `boot`, `template/:id`, `template/all` and `/public/downloads/` exposure. Changing public downloads is product behavior: propose it for approval with compatibility tests.
- Respond `401` unauthenticated; `403` signed in but unauthorized; avoid revealing student records or restricted assessment answers.
- Use private/no-store caching for protected responses. Check deployed client bundles, asset manifests, pre-rendered HTML and source maps for lesson leaks.
- Keep the client `app/guided-learning` interface, six tabs, accessibility, local preview save/export; replace static full-curriculum import with one authorized lesson response.

## Implementation phase 2 — Production authentication (separate approval)

- Choose a proven OIDC identity provider with a verified email claim, Authorization Code flow and secure sessions; validate Cloudflare Workers/Vinext compatibility before selecting a library.
- Sessions: HttpOnly, Secure, SameSite cookie, server-side expiration/revocation, CSRF protection for state-changing operations, explicit logout. MFA for admin/faculty.
- Never trust `oai-authenticated-user-*` headers received from the internet. Disable and exclude mock auth from production builds.
- Maintain a stable internal user ID or a verified identity-link mapping between legacy IDs and new OIDC subjects before migrating. A new provider subject is not automatically equivalent to a legacy `uid`. Protect owner references across drafts, versions, submissions, uploads, R2 evidence, grades, notifications, reviews and audit logs.
- Make admin access an explicit approved enrollment/role assignment, not simply an unverified email string comparison.
- Change authorization and authentication on staging with synthetic fixtures, not live production records. Preserve original IDs and edition snapshots.

## Implementation phase 3 — Staging and release controls

- Provision separate staging D1/R2 and separate production D1/R2 bindings. Do not point localhost or staging at live data.
- Apply reviewed, forward-only migrations to staging first. Do not rerun the initial migration against an initialized database.
- Plan production backups and restore rehearsals. D1 Time Travel has a finite retention window and should not be the only archival strategy; evidence stored in R2 needs independent retention/backup planning.
- Keep Worker secrets out of repo/config/plain frontend `VITE_*` variables. Add session rate limiting, audit logging, safe error responses and basic security headers.
- Release with a rollback plan that reverses code changes without deleting/mutating submissions.

## Required negative-security tests

- Anonymous / pending user cannot fetch a paid lesson via direct URL, API, browser HTML or client JS chunks.
- Student in cohort A cannot fetch cohort B's drafts, uploads, feedback, reviewed answers or lesson releases.
- Locked session is `403` even if the numeric URL parameter is manually changed.
- Faculty only accesses the assigned cohort; a student cannot access Management or grade API by forging client role state.
- Forged `oai-authenticated-user-*` browser request headers do not authenticate production users.
- Sign-out revokes sessions; a copied/expired session is rejected.
- Case content and trainer-controlled Baseline A / Exit B keys are absent from public bundles.
- The 24 guided links, six tabs, sessionStorage preview save/export, official original assessed workflow, deadlines, notifications, grades and faculty actions still work when authorized.
- `git diff --check`, `node tests/verify-drive-edition3.mjs`, `pnpm exec tsc --noEmit`, `pnpm build`, `node tests/workflow.mjs`, plus new security integration tests pass.

## First copy-paste prompt to Antigravity

> Act as VCEP's senior full-stack security engineer. READ THIS BRIEF AND AUDIT THE CURRENT LOCAL REPOSITORY ONLY. The new Drive Edition 3 guided learning and homepage have passed the user's manual tests. Identify all client bundle, static asset and public API routes that expose course content, including `/guided-learning`, its JSON, `boot`, template downloads and historic public files. Map server-side authorization, cookie and trusted-header authentication, role/cohort/assignment checks and record ownership. Trace how existing user IDs bind to saved drafts, submitted work, grades, faculty comments and R2 evidence. Propose the smallest safe implementation sequence using a server-only course module plus one authorized lesson endpoint. Preserve older curricula and all databases. Show risks, permission matrix, exact files to change, tests and rollback. DO NOT WRITE CODE, RUN REMOTE COMMANDS, CHANGE DATABASES, INSTALL PACKAGES, PUSH OR DEPLOY. Wait for explicit approval.
