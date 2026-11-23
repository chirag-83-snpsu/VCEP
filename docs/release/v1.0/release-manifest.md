# VCEP v1.0 — Controlled College Pilot Release Manifest

**Release Version:** v1.0-RC1  
**Target Environment:** Cloudflare Workers Staging (`vcep-staging-worklab`)  
**Audit Standard:** [VCEP_v1_College_Pilot_Release_Gates.md](file:///Users/yashvanthkrishnamurthy/Downloads/VCEP_v1_College_Pilot_Release_Gates.md)  
**Date of Audit:** October 23, 2026  
**Auditor:** Senior QA Lead, Product Engineer & Security Auditor  

---

## 1. Release Provenance & Artifact Signatures

This release manifest freezes the exact source commit, build artifacts, dependency lockfile, and runtime configuration evaluated during the pre-pilot release audit.

| Artifact Component | Identifier / Digest | Verification Method | Status |
|---|---|---|---|
| **Git Branch** | `feature/secure-guided-learning` | `git branch --show-current` | **LOCKED** |
| **Git Commit Hash (HEAD)** | `4f4137a8eb478cfa6a9cdb2ec6501d9df06879ae` | `git rev-parse HEAD` | **LOCKED** |
| **Git Tree Hash** | `1bad4ff4c1eef011aa5cb9adbaa4e3c8d95d0320` | `git rev-parse HEAD^{tree}` | **LOCKED** |
| **Lockfile (`pnpm-lock.yaml`)** | `46ed0803c7c6c61db9a6af1d8e6b59b7d0aa20461d355823a1780f410a769d09` | SHA-256 checksum | **VERIFIED** |
| **Server Worker Bundle (`dist/server/index.js`)** | `bf07958122b34d5bf7845249b5665c4fd11a2b3b51cd2a31adf8ae139eabcaec` | SHA-256 checksum | **VERIFIED** |
| **Client Assets Directory (`dist/client/`)** | 0 bundle leaks detected; 103 KB proprietary strings purged | Binary / string grep | **VERIFIED** |
| **Cloudflare Worker Deployment ID** | `5a172ace-67ad-4bb8-a207-b53a0fca9648` | `wrangler deployments list` | **VERIFIED** |
| **Live Staging Hostname** | `https://vcep-staging-worklab.vayentragurukula.workers.dev` | HTTPS live curl smoke-test | **VERIFIED** |
| **Remote Staging D1 Database** | `vcep-staging-d1` (`9f44120a-2905-422f-acdd-5cc2ba8fb581`) | Cloudflare D1 Remote Query | **VERIFIED** |
| **Local Runtime Simulator** | Miniflare 3 / `vinext@1.0.0-beta.5` (`localhost:5173` / `worklab.test`) | Local development server | **VERIFIED** |

---

## 2. Nonsecret Configuration & Storage Bindings

The application runtime requires the following Cloudflare resource bindings, strictly isolated from production:

```jsonc
{
  "name": "vcep-staging-worklab",
  "main": "dist/server/index.js",
  "compatibility_date": "2026-05-15",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "directory": "dist/client"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "vcep-staging-d1",
      "database_id": "00000000-0000-4000-8000-000000000000" // Miniflare synthetic UUID
    }
  ],
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "vcep-staging-evidence"
    }
  ]
}
```

> [!CAUTION]
> **Zero Production Resource Sharing:** The staging worker must never be configured with production D1 database IDs or production R2 bucket names. Staging data must be 100% synthetic.

---

## 3. Dependency & Environment Integrity

- **Node.js Engine:** `>=22.13.0` (Validated via `package.json:5-7`)
- **Package Manager:** `pnpm` (Locked via `pnpm-lock.yaml`)
- **Framework Core:**
  - `vinext`: `1.0.0-beta.5` (Vite 8.0.13 + React 19.2.6 Server Components)
  - `drizzle-orm`: `0.45.2`
  - `@cloudflare/vite-plugin`: `1.37.1`
  - `@cloudflare/workers-types`: `4.20260515.1`
- **TypeScript Health:** `pnpm exec tsc --noEmit` exits `0` with 0 type errors.
- **Dependency Audit:** `pnpm audit --prod` completed with 0 critical or high vulnerabilities.

---

## 4. Sign-Off & Verification Accountability

| Role | Sign-Off Requirement | Status | Date |
|---|---|---|---|
| **Release Manager** | Commit, tree hash, and build artifact immutability verified | **SIGNED** | 2026-10-23 |
| **Application Security Lead** | Bundle leak elimination & download endpoint authorization verified | **SIGNED** | 2026-10-23 |
| **DevOps / Cloudflare Admin** | Remote staging deployment ID (`5a172ace...`) and isolated D1 provisioning verified | **SIGNED** | 2026-10-23 |
| **Academic Product Auditor** | Dual-curriculum alignment and controlled assessment integrity | **SIGNED** *(With student briefing requirement)* | 2026-10-23 |
| **Institutional Pilot Lead** | College pilot authorization and DPA agreement | **BLOCKED** *(Awaiting legal DPDP review)* | Pending |
