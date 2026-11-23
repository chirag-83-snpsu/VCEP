# Copy into Antigravity Agent — VCEP 24 guided lessons

You are implementing a premium, minimal, trainer-aligned learning platform for VCEP (Vayentra Corporate Experience Program). The user has imported `app/guided-learning/page.tsx`, `guided-learning.css`, `drive-edition-3.json` and `tests/verify-drive-edition3.mjs` into an existing Vinext / React / Cloudflare D1 project.

FIRST inspect the **current local source** before doing anything. The local files may differ from the public GitHub `main` branch. Read `START_HERE.md`, `app/workspace.tsx`, `app/practice-lab.tsx`, `app/worksheet.tsx`, `app/staff.tsx`, any `app/premium-journey.tsx`, and the new files. Run `git status --short`, `git diff --name-only` and `node tests/verify-drive-edition3.mjs`.

**Project objective:** One concise, standardized student homepage + a consistent guided-learning experience for *all 24 Drive Edition 3 student workbooks*. Screens should be simple and professional; the teaching substance stays detailed inside the six stages. Retain role protections and existing assignments.

### Phase A — Preview verification

1. Verify that `/guided-learning?session=1` through `?session=24` render the correct Drive student-pack source contents.
2. Check the case numbers, working tables, AI prompts and rubrics against `drive-edition-3.json` (source: student Word workbooks only).
3. Run `pnpm exec tsc --noEmit` and `pnpm build`. Fix only compilation issues in the new route, after showing proposed diffs and getting approval.
4. Never expose the trainer's answer keys, Baseline A, Exit B, faculty books or controlled assessment materials to the client.

### Phase B — Minimal homepage integration (only after user approves)

1. Keep exactly one student-facing curriculum index. Preserve the track structure but remove redundant second index/grid views, oversized marketing copy and purely decorative 3D experiences from the student landing screen. Do not remove actual routes or backend code required elsewhere.
2. Show a short title, one-line summary, six sessions per track and real logged-in status only if the existing backend returns it. Do not create mock progress or fake placement outcomes.
3. For EACH of 24 session cards/rows, add a primary link `Guided Lesson` to `/guided-learning?session=<s.id>`.
4. Preserve the existing `Assessed Worksheet` or official session workflow as a clearly secondary, separately labeled action with its ORIGINAL access, permissions and release rules. Never treat completion of a local guided lesson as submitted work.
5. Hide or remove the **generic 120-minute workshop promo** from the student landing page; the Drive sessions specify 135 minutes, including break. Do not alter the existing case data for the short legacy practice lab.
6. Preserve `Management`, staff grading, notifications, data exports, student cloud drafts, Word downloads and existing URLs.
7. The new page should use the VCEP navy/teal palette, existing logo, consistent card spacing and short labels. Long case records and learning explanations belong IN the selected guided lesson, not on the homepage.

### Phase C — Testing

- Verify all 24 links from the homepage and route query parameters.
- Verify modules 01, 02, 07, 11, 22, 24 thoroughly; sampling alone is not sufficient for the 24 links.
- Test refresh/back navigation, mobile width, keyboard-only, browser-tab save/clear and export.
- Test existing `/?session=1&mode=practice`, student assessed worksheet (authorized user only), Management and faculty role view.
- Run `git diff --check`, `node tests/verify-drive-edition3.mjs`, `pnpm exec tsc --noEmit`, `pnpm build`, `node tests/workflow.mjs`.

**Hard limits:** Do NOT edit `lib/sessions.json`, `lib/legacy-sessions.json`, `app/api/**`, `app/chatgpt-auth.ts`, `db/**`, `drizzle/**`, auth, Cloudflare config, real D1/R2 bindings, or student's existing saved work. Do NOT push or deploy. Do not install new packages without permission. Never copy the local mock admin identity into a production merge.

Before editing old files, **show a precise before/after plan and the exact file list**, then request approval. Limit changes to the smallest homepage JSX/CSS surfaces necessary. Summarize the verification results afterward.
