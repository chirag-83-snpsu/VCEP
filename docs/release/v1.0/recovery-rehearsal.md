# VCEP v1.0 — Disaster Recovery & Rollback Rehearsal Plan

**Release Candidate:** v1.0-RC1  
**Audit Standard:** [VCEP_v1_College_Pilot_Release_Gates.md](file:///Users/yashvanthkrishnamurthy/Downloads/VCEP_v1_College_Pilot_Release_Gates.md) (Gate 8)  
**Status:** **REPORTED PASS (Documented & Archived) / NOT VERIFIED (Live Remote Rehearsal)**  
**Auditor:** Infrastructure & Site Reliability Auditor  

---

## 1. Executive Summary

A critical launch requirement is maintaining a strict separation between **Worker application code rollback** and **D1/R2 persistent state recovery**. Code rollbacks must never inadvertently mutate or drop student submissions, grades, or evidence files.

This runbook documents the exact recovery commands, retention guarantees, and download pack restoration mechanisms for the VCEP v1.0 release.

---

## 2. Cloudflare Worker Code Rollback (Instant < 30s)

If an application regression or security issue is discovered in the deployed Worker, traffic can be instantly reverted to the previous stable release without touching the database.

### 2.1 Worker Rollback Procedure
1. List recent deployment IDs and timestamps:
   ```bash
   wrangler deployments list --env staging
   ```
2. Identify the last known good deployment ID (e.g. `d01a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c`).
3. Execute the rollback command:
   ```bash
   wrangler rollback d01a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c --env staging --message "Rollback to RC1 pre-audit build"
   ```
4. Verify HTTP traffic and asset serving:
   ```bash
   curl -I https://staging-worklab.vcep.edu/api/health
   ```
5. Confirm that D1 database schemas and existing student submission records remain completely unchanged.

---

## 3. Database Disaster Recovery (Cloudflare D1 Time Travel)

Cloudflare D1 automatically retains transactional transaction logs allowing Point-in-Time Recovery (PITR) up to 30 days.

### 3.1 D1 Time Travel Restoration Runbook
1. **Identify Failure Timestamp:** Determine the exact ISO-8601 timestamp prior to the corrupting event or unintended migration.
2. **Inspect Bookmark Information:**
   ```bash
   wrangler d1 time-travel info vcep-staging-d1 --env staging
   ```
3. **Safe Dry-Run Restoration (Clone-First Principle):**
   *Never restore directly over active pilot data without a snapshot.*
   ```bash
   # 1. Export current state snapshot as emergency backup
   wrangler d1 export vcep-staging-d1 --output backup-before-restore.sql --env staging

   # 2. Execute Time Travel restore to target timestamp
   wrangler d1 time-travel restore vcep-staging-d1 --timestamp="2026-10-23T12:00:00Z" --env staging
   ```
4. **Data Integrity Verification:**
   Query student submission counts and draft revision histories:
   ```bash
   wrangler d1 execute vcep-staging-d1 --command="SELECT COUNT(*) FROM submissions;" --env staging
   wrangler d1 execute vcep-staging-d1 --command="SELECT COUNT(*) FROM drafts;" --env staging
   ```

---

## 4. Student Evidence Recovery (Cloudflare R2 Bucket)

Evidence files uploaded by students (`.png`, `.jpg`, `.pdf`, `.docx`) are stored in the private Cloudflare R2 bucket (`vcep-staging-evidence`).

### 4.1 R2 Protection Safeguards
- **Private Access Only:** The R2 bucket does not have public read access enabled. All downloads are served through authenticated Worker streaming routes.
- **Bucket Versioning:** Object versioning is enabled on `vcep-staging-evidence` to prevent accidental overwrites if a student uploads files with duplicate filenames.
- **Disaster Recovery Synchronization:**
  In the event of an availability zone incident, R2 files can be mirrored using AWS CLI / S3-compatible API:
  ```bash
  aws s3 sync s3://vcep-staging-evidence ./backup/evidence --endpoint-url https://<account_id>.r2.cloudflarestorage.com
  ```

---

## 5. Curriculum & Download Pack Archive Verification

During Phase 4A, all 24 individual session `.docx` student packs and the bulk `.zip` bundle were securely moved from `public/downloads/` into a protected local archive to prevent public exposure.

### 5.1 Archive Inventory & Hash Verification
- **Archive Path:** `curriculum/archive/downloads/`
- **Total Files Archived:** 25 files (Sessions 01–24 `.docx` files + `vcep-all-worksheets.zip`).
- **Integrity Manifest:** `curriculum/archive/downloads/manifest.json`.
  Every archived file possesses a recorded SHA-256 cryptographic digest verified against the Drive Edition 3.0 master source.

### 5.2 Restoration Runbook (`scripts/restore-downloads.mjs`)
If static file serving is ever re-authorized (e.g. in a private, air-gapped intranet environment), the restoration script can safely reconstitute the files:
```bash
# Execute dry-run restoration check
node scripts/restore-downloads.mjs --dry-run

# Reconstitute public downloads directory
node scripts/restore-downloads.mjs
```
The script validates SHA-256 checksums before writing, preventing file tampering or corrupt restoration.

---

## 6. Rehearsal Status Summary

| Rehearsal Gate | Expected Proof | Verification Status | Notes |
|---|---|---|---|
| **Worker Rollback** | Deployment revert via Wrangler | **NOT VERIFIED (REMOTE)** | Blocked awaiting remote Wrangler login. |
| **D1 Time Travel** | CLI PITR restore on staging D1 | **NOT VERIFIED (REMOTE)** | Blocked awaiting remote Wrangler login. |
| **R2 Evidence Recovery** | Bucket versioning & isolation | **PASS (DOCUMENTED)** | Resource isolation defined in runbook. |
| **Curriculum Pack Restore** | SHA-256 archive manifest & script | **PASS (VERIFIED)** | 25 files preserved and checksum verified. |
