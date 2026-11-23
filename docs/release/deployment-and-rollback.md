# VCEP v1.0 — Staging Deployment, Backup and Rollback Runbook

**Document:** Operational Deployment, D1/R2 Disaster Recovery & Rollback Guide  
**Release:** VCEP v1.0-RC1  
**Target:** DevOps, Security Engineers & Cloudflare Infrastructure Administrators  

---

## 1. Architecture Overview & Infrastructure Separation

To protect student privacy and ensure regulatory compliance, **production and staging environments must be strictly isolated**:

```
                       CLOUDFLARE INFRASTRUCTURE
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       STAGING ENVIRONMENT       │       │      PRODUCTION ENVIRONMENT     │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ Worker: vcep-staging-worklab    │       │ Worker: vcep-production-worklab │
│ D1:     vcep-staging-d1         │       │ D1:     vcep-prod-d1            │
│ R2:     vcep-staging-evidence   │       │ R2:     vcep-prod-evidence      │
│ Data:   100% Synthetic Fixtures │       │ Data:   Real Enrolled Students  │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

> [!CAUTION]
> **Strict Rule:** Never connect staging workers to production D1 databases or production R2 buckets. Never export production student records or evidence to staging.

---

## 2. Staging Environment Provisioning (Step-by-Step)

### Step 1: Provision Staging Storage Resources
Run using Wrangler CLI (authenticated with Cloudflare account):
```bash
# 1. Create Staging D1 Database
wrangler d1 create vcep-staging-d1
# Note the returned database_id (UUID)

# 2. Create Staging R2 Evidence Bucket
wrangler r2 bucket create vcep-staging-evidence
```

### Step 2: Define Staging Configuration in `wrangler.jsonc`
Create/update root `wrangler.jsonc` with the staging environment block:
```jsonc
{
  "name": "vcep-worklab",
  "main": "dist/server/index.js",
  "compatibility_date": "2026-05-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "dist/client"
  },
  "env": {
    "staging": {
      "name": "vcep-staging-worklab",
      "vars": {
        "ENVIRONMENT": "staging"
      },
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "vcep-staging-d1",
          "database_id": "<STAGING_D1_UUID_FROM_STEP_1>"
        }
      ],
      "r2_buckets": [
        {
          "binding": "BUCKET",
          "bucket_name": "vcep-staging-evidence"
        }
      ]
    }
  }
}
```

### Step 3: Apply Clean D1 Schema
Execute the Drizzle migration SQL against the staging D1 instance:
```bash
wrangler d1 execute vcep-staging-d1 --env staging --file=drizzle/0000_sudden_anthem.sql
```

### Step 4: Seed Staging with Synthetic College Fixtures
Execute the synthetic staging seed script:
```bash
# Populates mock cohorts (College Alpha, College Beta), synthetic faculty, and fake students
node scripts/seed-staging.mjs --target=staging
```

### Step 5: Build & Deploy to Staging
```bash
# 1. Compile production bundles
corepack pnpm build

# 2. Deploy worker to staging
wrangler deploy --env staging
```

---

## 3. Staging Post-Deployment Smoke Verification

Immediately after deployment, run the remote smoke test:
```bash
# 1. Verify Anonymous Boot (Public catalogue only)
curl -s -i https://staging-worklab.vcep.edu/api/boot | head -n 1
# Expected: HTTP/1.1 200 OK

# 2. Verify Anonymous Guided Learning Lock
curl -s -i https://staging-worklab.vcep.edu/api/guided/session/1 | head -n 1
# Expected: HTTP/1.1 401 Unauthorized

# 3. Verify Anonymous Template Download Lock
curl -s -i https://staging-worklab.vcep.edu/api/template/1 | head -n 1
# Expected: HTTP/1.1 401 Unauthorized

# 4. Verify Static Downloads Removed
curl -s -i https://staging-worklab.vcep.edu/downloads/VCEP_Student_Session_Packs.zip | head -n 1
# Expected: HTTP/1.1 404 Not Found
```

---

## 4. Rollback Procedures

### A. Instant Worker Rollback (< 2 seconds)
If a software defect or runtime error is detected in the deployed worker code:
```bash
# Roll back staging worker to previous deployment
wrangler rollback --env staging

# List deployment history to confirm active version
wrangler deployments list --env staging
```
*Worker rollback reverts routing and server execution immediately. Persistent data in D1 and R2 is untouched.*

### B. Database Rollback & Point-in-Time Recovery (D1)
If database records become corrupted during testing:

**Method 1: Cloudflare D1 Time Travel (Point-in-Time Recovery)**
```bash
# 1. Check current D1 bookmark
wrangler d1 info vcep-staging-d1

# 2. Restore D1 database to specific timestamp (e.g., 30 minutes ago)
wrangler d1 time-travel restore vcep-staging-d1 --timestamp="2026-10-23T12:00:00Z"
```

**Method 2: Clean Re-Initialization (Staging Only)**
Because staging uses **only synthetic data**, if schema corruption occurs:
```bash
# Drop and recreate all tables
wrangler d1 execute vcep-staging-d1 --env staging --file=drizzle/0000_sudden_anthem.sql
# Re-apply synthetic seed
node scripts/seed-staging.mjs --target=staging
```

### C. R2 Storage Recovery & Maintenance
1. **Evidence Safety:** Files uploaded to R2 are named with UUIDs (`id()`) and stored privately.
2. **Bucket Deletion Protection:** Enable Cloudflare Object Lock / Bucket Deletion Protection on production R2 buckets.
3. **Local Download Archive Restoration:** If `public/downloads/` ever needs to be restored locally:
   ```bash
   node scripts/restore-downloads.mjs
   ```

---

## 5. Security Incident Response Protocol

If an unauthorized access or credential leak is detected:
1. **Immediate Quarantine:**
   ```bash
   # Route traffic to maintenance page or suspend worker
   wrangler deploy --env staging --compatibility-flag=drain_traffic
   ```
2. **Audit Extraction:**
   ```bash
   # Export audit log table for forensic inspection
   wrangler d1 execute vcep-staging-d1 --command="SELECT * FROM audit ORDER BY created DESC LIMIT 500;"
   ```
3. **Session Invalidation:**
   - Invalidate all active session tokens and purge Cloudflare cache.
