# VCEP Commerce — developer handover

Complete source snapshot • 30 September 2026

Start here, then read README.md for the delivered features and remaining institutional rollout requirements.
This is the source of the existing website, including its backend. It is not a database dump or a ready-made deployment to every hosting provider. No live student records, uploaded evidence, environment secrets, dependency folders or Git credentials are included.

## Stack and entry points

- React 19 / TypeScript with Next-style app routing, built by Vinext and Vite.
- Cloudflare Workers executes the server; Cloudflare D1 (SQLite) stores application records; R2 stores private evidence files.
- `app/workspace.tsx`: session catalog and role navigation.
- `app/practice-lab.tsx`: browser-local activities.
- `app/worksheet.tsx`: cloud drafts, history, submissions and exports.
- `app/staff.tsx`: college administration and faculty assessment.
- `app/api/[...path]/route.ts`: backend endpoints and server-side authorization.
- `app/chatgpt-auth.ts`: current trusted platform authentication adapter.
- `db/schema.ts` and `drizzle/`: all 12 tables and initial SQL migration.
- `lib/sessions.json`: all 24 current Indian-company cases and activities.
- `lib/legacy-sessions.json`: old case edition needed to preserve earlier saved work.
- `lib/export-work.ts`: current downloadable Word worksheets and completed work.
- `tests/workflow.mjs`: isolated backend integration checks.

## Local development

Use Node >=22.13 and pnpm 11.25.0 (the pinned package manager). Unzip, enter `VCEP_Commerce`, then run:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sudden_anthem.sql
pnpm dev
```

Open the local URL printed by the dev server (portable default port 5173). Keep it bound to localhost. A clean export defaults to the portable execution profile; there is no dependency on the original managed workspace's profile file. The build creates `dist/server/wrangler.json`; use that generated config for database commands. Apply the initial migration once to a new empty database. Future changes require new migrations; do not reapply the initial CREATE TABLE statements to an initialized database.

The portable preview has a localhost-only simulated sign-in. Its default identity is `seedy@sites.test`, which will be pending enrollment. For local administrator development, change only the preview plugin's `localEmail` constant in `build/sites-vite-plugin.ts` to the configured owner email in the API route, then restart the local server. This is local development identity simulation, not production authentication. Never use the preview cookie as an internet-facing login system.

If the local UI reports missing tables, confirm that the dev server and migration command are using the same `.wrangler/state` directory. The integration suite below manages its own independent temporary database and does not need local roster records.

## Validation

```sh
pnpm exec tsc --noEmit
pnpm build
node tests/workflow.mjs
```

The existing published implementation passed its build and isolated backend tests. This export additionally checks ZIP integrity, exact tracked-source hashes, all 24 cases and fresh SQL schema creation. A fresh dependency installation on your developer's machine and production identity-provider integration are separate checks. Browser/device/accessibility and load testing remain rollout gates as described in README.md.

## Database model

| Table | Purpose |
|---|---|
| cohorts | College groups and progression policies |
| roster | Email enrollment, role, cohort and participation flag |
| users | Authenticated identity profile |
| assignments | Cohort/session release and due dates |
| extensions | Individual deadlines |
| drafts | Current answer JSON, revision and status |
| versions | Recoverable draft versions |
| submissions | Immutable submitted attempts, grades and feedback |
| notifications | In-app messages |
| content | Versioned curriculum overrides |
| uploads | Private evidence metadata; bytes live in R2 |
| audit | Administrative and assessment event records |

Session curriculum is shipped in JSON; it is not seeded into student tables. Create a cohort, roster and schedule through Management after signing in as the configured administrator. Existing D1/R2 production records are not part of this ZIP.

## Backend routes

All routes are below `/api`. Writes require a matching Origin header. Authentication, role, cohort, ownership and release rules are enforced server-side.

| Route | Purpose |
|---|---|
| boot | Public curriculum or authenticated role workspace |
| template/:session and template/all | Blank Word worksheets or ZIP |
| draft/:session | Read/save drafts, restore history, change edition |
| submit/:session | Integrity-confirmed immutable submission |
| upload/:session | Private evidence upload |
| file/:id | Authorized private evidence download |
| review/:receipt | Faculty read/review/return/grade |
| notifications | Mark notifications seen |
| admin/cohort | Configure cohort |
| admin/roster | Enroll students and faculty |
| admin/assignment | Set release dates/deadlines |
| admin/extension | Set individual extension |
| admin/content | Edit supported case content |

Read the API route for exact JSON bodies; UI call sites and integration tests provide working request examples.

## Hosting outside ChatGPT Sites

The included `.openai/hosting.json` identifies the existing Site. It does not grant access to its account or database. The Vite config contains local placeholder database settings, not a provisioned production database.

Before deploying to your own Cloudflare account:
1. Provision your own D1 database and private R2 bucket, with Worker bindings `DB` and `BUCKET`. Configure real resource identifiers in your deployment configuration; keep the local placeholders for local work only.
2. Replace `getChatGPTUser` with server-verified institutional OIDC/session authentication and replace the sign-in/sign-out links. Use a stable user ID and verified email. Configure the administrator explicitly.
3. Do not trust incoming `oai-authenticated-user-*` headers from browsers or arbitrary proxies. Those headers are trustworthy only behind the current Sites authentication boundary. Preserve all downstream role/cohort checks.
4. Apply migrations to your new database, deploy the generated Worker/assets using your account's configuration, and verify the full enrollment → draft → submission → faculty grade journey.
5. Set up backups, monitoring, evidence scanning, retention and institutional access policies before handling real college data. README.md details the remaining requirements.

If you choose PostgreSQL, MySQL, Supabase or a Node/Express server instead, port the D1 SQL access and Worker/R2 bindings. Changing a connection string alone will not migrate this Cloudflare-specific backend.

## Content maintenance

Use the current 24-session JSON as the source. `curriculum/refresh_cases.py` is the authored case generator. Download routes generate matching current Word content. Files in `public/downloads` are retained historical worksheets; do not mistake them for the current case edition. Preserve legacy snapshots so earlier assessed work remains interpretable.

## Archive provenance

Source commit: b9881eb844c1d6e95cf3c30da6636a73e8fe596e
The tracked website files are unchanged. This handover and SOURCE_MANIFEST.json are export-only additions. Vendored license notices are retained. Third-party dependencies are installed from the lockfile and remain subject to their own licenses.
