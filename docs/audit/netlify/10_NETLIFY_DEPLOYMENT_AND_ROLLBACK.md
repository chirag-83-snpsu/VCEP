# Netlify Deployment Configuration & Rollback Plan
**Report ID:** 10_NETLIFY_DEPLOYMENT_AND_ROLLBACK  
**Status:** **DEPLOYMENT BLUEPRINT & DISASTER RECOVERY DEFINED**  
**Recommended Architecture:** Option B (Netlify CDN Frontend + Cloudflare Managed Edge Backend)  

---

## 1. Production `netlify.toml` Specification

When deploying to Netlify, the following exact configuration file must be placed in the repository root:

```toml
# Netlify Production Configuration for VCEP (Option B: Hybrid Architecture)

[build]
  command = "corepack pnpm build"
  publish = "dist/client"

[build.environment]
  NODE_VERSION = "24.22.1"
  PNPM_VERSION = "11.25.0"

# Transparent API Proxy to Cloudflare Managed Edge Backend
[[redirects]]
  from = "/api/*"
  to = "https://vcep-staging-worklab.vayentragurukula.workers.dev/api/:splat"
  status = 200
  force = true
  headers = { X-Forwarded-Host = ":host" }

# Single Page App Navigation Fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Global Security Response Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

# Cache Policy for Static Assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Curriculum Shield: Prevent Direct Public Access to Raw JSON Data
[[headers]]
  for = "*.json"
  [headers.values]
    Cache-Control = "no-store, private"
```

---

## 2. Environment Isolation & Pipeline Staging

```
[ DEVELOPMENT ]                  [ NETLIFY STAGING ]              [ NETLIFY PRODUCTION ]
localhost:5173                   vcep-staging.netlify.app        vcep.vayentra.com
      │                                 │                                 │
      ▼                                 ▼                                 ▼
Local Vite + Miniflare           Netlify Rewrite (/api/*)         Netlify Rewrite (/api/*)
      │                                 │                                 │
      ▼                                 ▼                                 ▼
Local SQLite (.wrangler)         Cloudflare Staging Worker        Cloudflare Prod Worker
                                 (vcep-staging-worklab)           (vcep-prod-worklab)
                                 ├─ Staging D1 Database           ├─ Production D1 Database
                                 └─ Staging R2 Bucket             └─ Production R2 Bucket
```

---

## 3. Comprehensive Rollback & Recovery Procedures

> [!CAUTION]
> **Fundamental Principle:** An application frontend rollback on Netlify **never rolls back database transactions or uploaded files**. Frontend, backend, database, and storage recovery must be managed as distinct operational procedures.

### Procedure 1: Frontend Instant Rollback (Netlify)
- **Trigger:** Visual regression, client JS bug, or slider rendering failure.
- **Execution:** 
  1. Open the Netlify Team Dashboard → `Deploys`.
  2. Select the previous verified deployment ID (e.g., from release git tag).
  3. Click **"Publish deploy"**.
- **Recovery Time:** **Instantaneous (0 seconds)**. Netlify atomic deploys swap CDN pointer immediately.

### Procedure 2: Backend Worker Rollback (Cloudflare)
- **Trigger:** API route regression, authorization logic bug, or submission parsing failure.
- **Execution:**
  ```bash
  # Check active deployments
  wrangler deployments list
  # Roll back to the previous verified Cloudflare Worker version
  wrangler rollback <DEPLOYMENT_ID>
  ```
- **Recovery Time:** **< 15 seconds** across all 330+ Cloudflare edge data centers.

### Procedure 3: D1 Database Disaster Recovery (Cloudflare)
- **Trigger:** Accidental table corruption, unauthorized roster deletion, or invalid migration.
- **Execution:**
  1. D1 maintains continuous automatic Point-in-Time backups.
  2. Restore using Wrangler CLI:
     ```bash
     wrangler d1 export site-creator-d1 --remote --output backup-restore.sql
     # Or restore from time-travel checkpoint
     wrangler d1 time-travel restore site-creator-d1 --timestamp="2026-10-23T12:00:00Z"
     ```
  3. Verify schema integrity and row count across `submissions` and `roster`.

### Procedure 4: R2 Evidence Storage Recovery (Cloudflare)
- **Trigger:** Accidental evidence file deletion or upload corruption.
- **Execution:**
  1. Ensure **Object Versioning** is enabled on the `site-creator-r2` bucket.
  2. Restore deleted objects by rolling back delete markers using Cloudflare R2 API or AWS S3 SDK.
