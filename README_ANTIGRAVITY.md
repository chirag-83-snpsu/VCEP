# VCEP Session 02 student lesson pilot — Antigravity installation

This is an **add-only**, student-safe preview page. It does NOT alter the existing homepage, database, APIs, authentication, curriculum JSON, assessed worksheet or student submissions. It is grounded in the user-provided Drive student workbook (Edition 3.0) for Session 02, **not** the differing existing GitHub case. The complete approved online curriculum is not yet migrated.

## 1. Safe installation

1. Open the existing cloned VCEP project in Antigravity.
2. In terminal, run `git status --short` and `git branch --show-current`. If existing changes are uncommitted, review them before proceeding; do not reset or stash blindly.
3. Make a new branch with `git switch -c feature/session02-learning-pilot` if the name is unused.
4. Copy the package's `app/lesson-preview/session-02/` folder into the repository's **existing** `app/` tree. Do not replace `app/` or any other folder.
5. Run `pnpm exec tsc --noEmit`, then `pnpm build` and `pnpm dev`.
6. Open `http://localhost:5173/lesson-preview/session-02` (or your actual local port). The pilot is **not** linked from the homepage yet.
7. Test: eight stages, 135-minute schedule, understanding-check feedback, text entry, back/next, role buttons, browser-only save/reload, copy prompt, exported practice text, 390px layout and keyboard navigation.
8. Run `git diff --check`, `git status --short` and `node tests/workflow.mjs`. Existing assessed workflow and admin/faculty management must still work.

## 2. Safety boundaries

- No migrations, database resets or remote Cloudflare commands.
- No changes to `app/api/`, `app/chatgpt-auth.ts`, `db/`, `drizzle/`, `app/worksheet.tsx`, `app/staff.tsx` or `lib/sessions.json`.
- **Never deploy local simulated authentication.** This pilot uses only public student-safe content; answer keys and unseen controlled assessments must not be copied into the client.
- Do not treat this preview's locally saved draft, self-checks or export as official submissions or grades.
- Do not silently replace the website's historical case edition or destroy earlier submissions.

## 3. AI prompt for Antigravity

Review the two new files in `app/lesson-preview/session-02/` and `README_ANTIGRAVITY.md`. My existing VCEP app is running. Check for compilation problems on this repository without replacing or editing other files. Ask approval before any command that writes to production, pushes to GitHub, or alters the database. Provide a diff report and check the preview route. Preserve all old login, local saving and graded worksheets. If a build issue is found, propose the smallest possible correction and request review.

## 4. Next steps after approval

- Trainer tests in a classroom alongside the actual Session 02 slide deck. Approve wording, timing, misconception checks and acceptance criteria.
- Separately create an approved, versioned student-safe curriculum model for all sessions, ensuring each class uses one case edition across slides, website and workbooks.
- Integrate an approved reusable `SessionLearningShell` into Practice Lab and enrolment routes, preserving existing state and permissions.
- Audit evidence requirements for spreadsheets: the current server supports PDF, DOCX, JPG and PNG attachments but not native `.xlsx`. Address through separately reviewed policy/implementation, not this UI-only package.
