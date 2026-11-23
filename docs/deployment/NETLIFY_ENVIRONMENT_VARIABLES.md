# VCEP Netlify Environment Variables & Secret Configuration

**Program:** Vayentra Corporate Experience Program (VCEP)  
**Host Target:** Netlify (Frontend & Proxy) + Cloudflare (Worker Backend)  
**Date:** 28 October 2026  
**Security Policy:** Strict Zero-Exposure Protocol. Variable names and descriptions only; no plaintext secrets or credentials may be written to documentation.

---

## 1. Netlify Dashboard Environment Variables

Configure these variables in the **Netlify Team Dashboard** under:  
`Site settings` → `Build & deploy` → `Environment variables`

| Variable Name | Scope | Purpose | Staging Value / Source | Production Value / Source |
|---|---|---|---|---|
| `NODE_VERSION` | Build | Pin the Node.js execution runtime for reproducible builds. | `24.22.1` | `24.22.1` |
| `PNPM_VERSION` | Build | Pin the pnpm package manager version via Corepack. | `11.25.0` | `11.25.0` |
| `VCEP_BACKEND_ORIGIN` | Build & Edge | Base URL of the Cloudflare Worker handling API traffic. Used by `netlify.toml` redirects. | `https://vcep-staging-worklab.vayentragurukula.workers.dev` | `https://vcep-api.vayentragurukula.workers.dev` (or custom API subdomain `https://api.vayentra.com`) |
| `NETLIFY_SITE_ID` | Build & CI | Unique site identifier for Netlify CLI automated deployments. | Obtained from Netlify Site Overview | Obtained from Netlify Site Overview |

---

## 2. Cloudflare Edge Worker Environment Variables & Secrets

Configure these variables in Cloudflare via `wrangler secret put <NAME>` or the **Cloudflare Dashboard** under:  
`Workers & Pages` → `vcep-commerce-worklab` → `Settings` → `Variables and Secrets`

> [!CAUTION]
> Never store database encryption keys, session secrets, or admin credentials in public repositories, `.env` files committed to Git, or frontend client bundles.

| Variable / Secret Name | Binding Type | Scope | Description & Security Purpose | How to Obtain / Generate |
|---|---|---|---|---|
| `DB` | D1 Database Binding | Worker Runtime | Native Cloudflare D1 distributed SQLite database instance for user profiles, cohorts, roster, drafts, submissions, and audit logs. | Bound via `wrangler.json` (ID: Cloudflare D1 Dashboard) |
| `BUCKET` | R2 Storage Binding | Worker Runtime | Private object storage bucket holding student uploaded proof files and evidence documents. Access is private-only via signed worker endpoints. | Bound via `wrangler.json` (Bucket: `site-creator-r2` / `vcep-evidence-prod`) |
| `SESSION_SECRET` | Secret String | Server-Side Only | High-entropy cryptographic salt (minimum 64 characters) used for HMAC-SHA256 session token signature validation. | Generated via `openssl rand -hex 32` |
| `VCEP_ADMIN_EMAIL` | Plaintext Variable | Server-Side Only | Authorized administrative owner email address granted root platform governance rights. | Set to `vayentragurukula@gmail.com` |
| `VCEP_ADMIN_MFA_KEY` | Secret String | Server-Side Only | Base32-encoded secret key used for Time-Based One-Time Password (TOTP / Google Authenticator) MFA validation during admin sign-in. | Generated via standard TOTP provisioning tool |
| `CLOUDFLARE_API_TOKEN` | CI/CD Secret | GitHub Actions / Deployment Script | Scoped Cloudflare API token with `Workers:Edit` and `D1:Edit` permissions for automated staging and production releases. | Generated in Cloudflare Profile → API Tokens → Custom Token |
| `CLOUDFLARE_ACCOUNT_ID` | CI/CD Variable | GitHub Actions / Wrangler | Cloudflare account hash identifying the institutional tenancy. | Obtained from Cloudflare Dashboard Overview URL |

---

## 3. Local Development (`.env.local`) Configuration

For local development using Vite and Miniflare, tool environment flags are configured in `vite.config.ts` and `.env.local` (which is strictly ignored in `.gitignore`):

```bash
# Example local non-secret flags (strictly in ignored .env.local)
CLOUDFLARE_CF_FETCH_ENABLED=false
WRANGLER_SEND_METRICS=false
WRANGLER_WRITE_LOGS=false
```

---

## 4. Verification Check Before Launch

Before triggering any Netlify or Cloudflare build:
1. Verify `NODE_VERSION` equals `24.22.1` in Netlify build environment.
2. Verify `PNPM_VERSION` equals `11.25.0` in Netlify build environment.
3. Confirm `VCEP_BACKEND_ORIGIN` resolves to the verified staging/production Cloudflare Worker over HTTPS.
4. Test that `curl -I https://<worker-origin>/api/boot` returns `HTTP/2 200` with `X-Content-Type-Options: nosniff`.
