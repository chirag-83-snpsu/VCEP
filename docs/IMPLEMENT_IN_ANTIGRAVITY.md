# VCEP — Drive Edition 3 Student Frontend (24 Sessions)

**What this package is:** a working, additive React + TypeScript guided-learning route built from the **student Word workbooks** in your Drive `Session_01`–`Session_24` folders. It mirrors their teaching content and fictional source data, while shortening the visible interface. It is deliberately separate from the current assessed worksheet / Cloudflare D1 / faculty grading system.

**What it is not:** an automatic update to your local Mac; a production deployment; a replacement for trainer slides/controlled assessments; an official submission channel; or a verified replacement for the existing `lib/sessions.json` curriculum edition. Your current Antigravity branch contains unpushed changes I cannot inspect directly.

## Files

```text
app/guided-learning/page.tsx                New route and interactive UI
app/guided-learning/guided-learning.css      Self-contained professional styles
app/guided-learning/drive-edition-3.json     EXACT workbook case/concept/example + source tables + work sheets + AI and rubric

tests/verify-drive-edition3.mjs             Structure validation

docs/ANTIGRAVITY_INTEGRATION_PROMPT.md      Copy/paste into Antigravity Agent

docs/DRIVE_SOURCE_MAP.md                    Student Word source IDs

docs/extract_student_packs.py               Optional provenance/rebuild script, NOT needed for running
```

## Step 1 — Back up your feature work

In Antigravity's Terminal, inside your existing VCEP project:

```bash
git status --short
git branch --show-current
```

Ensure you are on a feature branch, not `main`. Review uncommitted changes; do not discard them. If the existing branch is clean you may start a new one, e.g. `git switch -c feature/drive3-guided-lessons`.

## Step 2 — Add the files

Download ZIP and extract it using Finder. **Copy the CONTENTS of the ZIP's `app/guided-learning/`, `tests/`, and `docs/` into the SAME paths within your existing VCEP folder**. Do not replace the whole `app` directory. If you already have an `app/guided-learning` folder, review the diff rather than overwriting it.

Or, if the ZIP is in Downloads and your Terminal is at the VCEP repository root:

```bash
unzip -n ~/Downloads/VCEP_Drive_Edition3_Frontend.zip -d .
```

`-n` skips existing files, protecting your local code. Avoid extracting to a nested `VCEP/VCEP` folder.

## Step 3 — Verify and preview

```bash
node tests/verify-drive-edition3.mjs
pnpm exec tsc --noEmit
pnpm build
pnpm dev
```

Open: **http://localhost:5173/guided-learning?session=1**. Use `?session=2` through `?session=24` to open the other student packs. Confirm that all 24 appear in the left sidebar and mobile selector.

Use the screenshots and checklist below to review the actual experience. This additive route has NOT yet changed the homepage.

## Step 4 — Integrate in the existing homepage with Antigravity

Open `docs/ANTIGRAVITY_INTEGRATION_PROMPT.md` in Antigravity and paste it to the agent. It must **inspect your CURRENT** local `app/workspace.tsx` / `app/premium-journey.tsx` (if present), present a proposed diff, and wait for your approval.

The homepage should ultimately show ONE clear curriculum index, with `Guided Lesson` leading to `/guided-learning?session=NN`. Preserve the existing `Assessed Worksheet` as a separate button; those records use a different original case edition. Do not silently convert an old assessed submission to the new edition.

Remove or collapse duplicative material from the PRIMARY student view after testing: the huge marketing hero, a second all-24 grid, the outdated **120-minute** generic workshop card, and unsupported 3D links. The Drive student packs specify **135 minutes**, including a break. Keep admin/faculty/staff features unchanged.

## Step 5 — Student experience checks

- `?session=1` shows a separate warning that Baseline A is controlled by the trainer and no exam questions/answers are revealed.
- `?session=2` contains team charter and Sessions 02–05 rotation tables.
- `?session=5` contains Case A ledger source records.
- `?session=7` contains the seven-row Case B raw receipts table, including duplicate R02.
- `?session=11` contains the Case E invoice and inward statement source records.
- `?session=22` blocks AI guidance during the controlled Exit B and interview.
- `?session=24` includes the portfolio/passport audit work sheets.
- All working-table blank cells and written prompts can accept draft input.
- The draft persists on **refresh in the same tab**, exports to TXT, and clears when users choose `Clear practice draft`. Warn students not to share a tab/session.
- Existing session lab, assessed worksheet, staff Management, enrolment, grader and progress remain intact.
- At least one mobile-width test, keyboard-only tab navigation, and a high-zoom test.

## Important curriculum boundary

The Drive student packs use Vayentra Labs / Cases A–G with a 135-minute session and a 10-point rubric. The current official `lib/sessions.json` in GitHub contains separate HUL/Infosys-inspired cases and 10–15-minute work stages. **Do not overwrite `lib/sessions.json` or update `curriculumEdition` without an archival migration strategy for saved student work.** New guided lessons are read-only source content plus browser-tab practice, not official graded work.

## Safe release steps

After local QA run:

```bash
git diff --check
node tests/verify-drive-edition3.mjs
pnpm exec tsc --noEmit
pnpm build
node tests/workflow.mjs
git status --short
```

Before any push, remove the simulated localhost administrator identity from production changes. Do not run any remote D1 migrations or deploy this preview without institutional authentication and release-gating decisions.
