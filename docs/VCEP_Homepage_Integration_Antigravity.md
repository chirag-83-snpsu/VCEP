# VCEP Homepage Integration — Antigravity implementation brief

## Current state

The user has installed and tested `app/guided-learning/` for all 24 Drive Edition 3 student sessions. The existing VCEP homepage is still an older curriculum interface. The latest edits may be local and differ from GitHub `main`.

## Mission

Make Guided Learning the main student-facing path without touching existing assessed worksheets, Cloudflare D1/R2, permissions, grades, submission records or faculty management. Keep the old practice and assessment system available, but do not represent its old case edition as Edition 3.

## Mandatory first actions (read-only)

1. Inspect `git status --short`, `git diff --name-only`, `git branch --show-current`.
2. Read the CURRENT local `app/workspace.tsx`, `app/premium-journey.tsx` and CSS if present, `app/page.tsx`, `app/guided-learning/page.tsx`, `app/guided-learning/guided-learning.css`, `app/worksheet.tsx`, and `app/practice-lab.tsx`. Determine which component ACTUALLY renders the homepage.
3. Check route `/guided-learning?session=1` and confirm its contents originate from `app/guided-learning/drive-edition-3.json`.
4. Show proposed changes and complete file list before editing. Request approval.

## Approved UI outcome (homepage only)

- One compact welcome header: `Learn. Practise. Perform.` and `24 sessions across four professional learning tracks.`
- One curriculum index grouped into four tracks, six sessions each. Do not show a second 24-session grid below it.
- Each session row: padded session number, exact title, short skill outcome (from Drive Edition 3 JSON), existing authentic progress status if present, and primary `Guided Lesson` link to `/guided-learning?session=<id>`.
- Keep a separate secondary action `Assessed Worksheet` for an enrolled student when allowed by the existing `locked(id)` and role logic. Call the existing authorized `open(id, false)` function rather than rebuilding the assessment or linking directly to internal URLs. If student is locked, show the actual lock reason and do not bypass it. Do not offer assessed submissions to unauthorised or pending accounts.
- For faculty/admin roles retain `Management` and the existing authorised practice/review flow. Never pretend a staff user's practice action is a student assessed submission.
- Optionally expose `Legacy Practice Lab` as a small tertiary action, clearly described as the earlier case edition, without changing or deleting its route.
- Remove the giant marketing hero, generic 120-minute promotional panel, decorative 3D homepage controls and duplicate catalogue from the homepage display **only**. Do NOT delete shared files or components used by other routes.
- Preserve cohort name, assignment deadlines, notifications, authentic grades, original download links and progress; if moved below the fold, ensure they remain findable.
- Preserve existing accessibility structure (`main` landmark, skip link, semantic controls, keyboard focus and responsive layouts).
- The guided lesson is *practice only*, with sessionStorage drafts and TXT export; do not show its completion as an official grade or submission. No fabricated progress, hiring or employer partnership claims.
- Do not show trainer answer keys, controlled Baseline A or Exit B materials.

## IMPORTANT security/release constraint

`app/guided-learning/page.tsx` currently imports ALL 24 lesson bodies from client-side JSON and exposes direct URLs without independent enrolled/assignment release enforcement. Do not assert that disabling a homepage button secures this material. Keep all new content in local/development preview; flag paid-course access control and auth as a separate release blocker. Production will need an authorised server-mediated content delivery path, actual role + enrollment + release checks and secure third-party auth if hosting away from ChatGPT Sites. Don't attempt that migration in this UI change.

## Hard file boundaries

Do not modify any of `app/api/**`, `app/chatgpt-auth.ts`, `app/worksheet.tsx`, `app/staff.tsx`, `db/**`, `drizzle/**`, `lib/sessions.json`, `lib/legacy-sessions.json`, Cloudflare config, authentication, `package.json`, `pnpm-lock.yaml` or existing data. Do not reset DB, run remote D1 commands, push, merge or deploy. Do not commit local mock admin identity. Keep edits limited to the actual homepage component and its homepage-only styles.

## Validation (after approved changes)

```bash
git diff --check
node tests/verify-drive-edition3.mjs
pnpm exec tsc --noEmit
pnpm build
node tests/workflow.mjs
git status --short
git diff --name-only
```

Manual checks: all 24 Guided Lesson links; browser back/forward; Session 01, 02, 07, 11, 22, 24; student with allowed session; student with locked session; pending/anonymous user; admin and faculty Management; existing assessed worksheet and draft saving; legacy practice URL `/?session=1&mode=practice`; mobile width, keyboard navigation, sessionStorage practice/clear/export; confirm no DB data modified. Never test against production records.

## Required final report from Antigravity

- Before/after homepage screenshots or a clear DOM/section summary
- Exactly which files changed
- Output of all five tests
- All 24 lesson links verified
- Role / lock behaviour matrix for student, pending, admin and faculty
- Any known bugs or production release blockers, especially unauthorised access to the route/client bundle
- Confirmation that API, DB, auth, official worksheet, student grades, submissions and faculty pages were NOT changed
