# VCEP Premium Student Experience — integration guide

Prepared for existing `chirag-83-snpsu/VCEP` repository, reviewed 22 October 2026.

## What this package adds

- `app/premium-journey.tsx` + `app/premium-journey.css`: responsive career-pathway landing experience, real student progress, six-module tracks, accessible lesson navigation, next session call to action, 120-minute delivery framework. All data comes from the existing `sessions`, `boot`, and `latest` state; no fabricated student marks or credentials.
- `app/session-playbook.tsx` + `app/session-playbook.css`: expandable 8-stage, 120-minute instructor-led session guide inside the existing *Practice Lab*. The detailed Session 01 worked example is fully grounded in the existing fictional case data. It does not alter any assessment scoring, session source data or database records.

## Safety boundaries

These are additive React files and scoped styles. The package does not include database migrations, auth changes, Cloudflare configuration, npm lock changes or server code. Do NOT deploy with local simulated sign-in. Do NOT alter `lib/sessions.json`, `app/worksheet.tsx`, `app/staff.tsx`, `app/api/[...path]/route.ts`, `db/`, `drizzle/`, or `.openai/hosting.json` in this redesign.

### 1. Create a new local branch

In the root of the cloned VCEP repo (not in a live production checkout):

```
git status
git switch -c feature/premium-student-journey
```

If you already have local-only simulated admin sign-in changes on another learning branch, start from that branch but **do not merge the simulated-login change into the real deployment**. You can also temporarily stash local changes before creating this clean feature branch.

### 2. Add these files

Copy the four files from this package's `app/` folder into the EXISTING repository's `app/` directory. They are new file names; don't replace any existing files.

### 3. Open the agent panel in Antigravity and paste `ANTIGRAVITY_PROMPT.md`

The agent should show a reviewed diff, not make speculative edits. The only existing code files it should change are `app/workspace.tsx` and `app/practice-lab.tsx`.

Proposed integration in `app/workspace.tsx`:

```
import PremiumJourney from './premium-journey';
```

Inside the workspace component, replace **only the old hero and the 3D visual explorer** with:

```
<PremiumJourney
  sessions={sessions}
  submissions={latest}
  drafts={boot.drafts || []}
  role={user?.role}
  cohortName={boot.cohort?.name}
  onOpen={open}
  lockReason={locked}
/>
```

Remove the old 3D viewer choices, its import, and the `journeyView` conditional without removing the working 2D 24-session grid. Keep student progress metrics, deadlines, notifications, search, filters, `open()`, `locked()`, and the `Worksheet`/`Staff` branches unchanged. The session grid section must have `id="learning-journey"` so the new CTA scrolls to it.

Proposed integration in `app/practice-lab.tsx`:

```
import SessionPlaybook from './session-playbook';
```

Immediately AFTER the existing `<CompanyContext session={s}/>` insert:

```
<SessionPlaybook session={s}/>
```

Keep existing Tabs, local browser saves, DOCX exports, direct session links, individual timers and reviewed submission logic.

### 4. Review and validate

```
git diff --check
git diff --stat
pnpm exec tsc --noEmit
pnpm build
pnpm dev
```

Note that newly added files might not appear in `git diff --stat` until staged; also run `git status`.

In the browser check:

- Guest view shows 24 sessions, four tracks, no 3D, and working launch links.
- Local student view shows REAL progress; no manufactured marks.
- Locked sessions route to permitted local practice, never bypass assessment permissions.
- Practice Lab Session 01 shows the 120-minute guide and correct worked example.
- Practice Lab Session 13 shows a tailored guide referencing its real case and AI prompt.
- Student assessed worksheet can still save and submit in the local test database.
- Faculty/admin management works as before.
- Small-screen check at 390px, tablet at 768px, desktop at 1440px.
- Keyboard Tab navigation visible; prefers-reduced-motion respected.

Do not push until you've reviewed the changes. Do not merge the local mock-auth edit to `main`. Do not deploy to students without actual production authentication and privacy/security readiness.

## Not implemented by this package

- Fully authored 120-minute datasets and tasks for every session. The 120-minute playbook stages provide a *usable delivery outline* and use current evidence, but 23 sessions still need specialised deep-work material and pilot testing.
- Institutional login, notifications, onboarding, live analytics, accessibility certification, production backups or security validation.
- A complete faculty dashboard redesign. This first release prioritises student navigation and practical learning.

## Why a 2D career pathway rather than 3D?

The prior homepage mounted a Three.js scene on initial view and also offered a second 3D city-map navigation. The replacement is ordinary HTML/CSS/React, easy to navigate with keyboard and on low-power devices, and highlights actual tasks rather than decorative graphics. This package does not prove why 3D failed on the user's machine; browser console diagnostics would be required.
