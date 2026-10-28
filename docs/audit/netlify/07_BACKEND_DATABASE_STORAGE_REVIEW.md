# Backend, Database & Storage Architecture Review
**Report ID:** 07_BACKEND_DATABASE_STORAGE_REVIEW  
**Status:** **INSPECTED & ANALYZED (READ-ONLY)**  
**Database Engine:** Cloudflare D1 (SQLite Edge Engine)  
**Object Storage:** Cloudflare R2 (S3-Compatible Private Storage)  
**ORM / Query Layer:** Drizzle ORM (`sqlite-core`) + D1 Native Prepared Statements  

---

## 1. Cloudflare D1 Database Schema Inventory

The application schema is version-controlled in [`drizzle/0000_sudden_anthem.sql`](file:///Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/drizzle/0000_sudden_anthem.sql) and defined in [`db/schema.ts`](file:///Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/db/schema.ts):

| Table Name | Primary Key | Key Indexes | Purpose & Data Retained |
| :--- | :--- | :--- | :--- |
| `cohorts` | `id` (text) | None | College cohort groups and progression policies (`open` vs `sequential`). |
| `roster` | `email` (text) | `roster_cohort` | Student & faculty directory, assigned cohort, role, `studentId`, `consent` flag. |
| `users` | `id` (text) | `user_email` (unique) | Authenticated user profiles with latest sign-in timestamps. |
| `assignments`| `id` (text) | `assignment_cohort_session` | Cohort-level session scheduling (`unlock` date, `due` date). |
| `extensions` | `id` (text) | None | Individual student deadline extensions (`email:session`). |
| `drafts` | `id` (text) | `draft_owner_session` | In-progress student worksheet answers, `revision` counter, status (`Draft`, `Submitted`, `Returned`). |
| `versions` | `id` (text) | `version_draft` | 10-revision immutable snapshot history for point-in-time draft recovery. |
| `submissions`| `id` (text) | `submission_cohort_status`, `submission_owner_session` | Immutable graded attempts with receipt UUID, snapshot of answers + curriculum, late flag, rubric scores (`grade`), feedback. |
| `notifications`| `id` (text) | `notifications_owner` | In-app user notifications (submission receipts, grading alerts). |
| `content` | `session` (int) | None | CMS session content overrides for fictional business cases. |
| `uploads` | `id` (text) | `uploads_owner_session` | Private evidence file metadata (filename, verified MIME type, file byte size, owner). |
| `audit` | `id` (text) | None | Security audit trail of administrative and student actions. |

---

## 2. Route-by-Route Backend Migration Analysis

| Route & Method | Current Cloudflare Implementation | Cloudflare Dependency | Option A: Full Netlify Rewrite | Option B: Hybrid Proxy | Migration Risk |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET /api/boot` | `db.prepare().all()` | `env.DB` | Query external DB (Turso/Neon) | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `GET /api/guided/:id` | `getAuthorizedLesson()` | Server Module + `env.DB` | Rewrite handler in Netlify Function | Pass-through via Netlify Rewrite | **Med (Opt A) / Zero (Opt B)** |
| `GET /api/template/:id`| `exportWork()` (.docx) | Server Module + `env.DB` | Rewrite handler in Netlify Function | Pass-through via Netlify Rewrite | **Med (Opt A) / Zero (Opt B)** |
| `POST /api/draft/:id` | Atomic D1 batching | `env.DB`, `db.batch()` | Rewrite with external DB transaction | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `POST /api/submit/:id`| Atomic D1 batching | `env.DB`, `db.batch()` | Rewrite with external DB transaction | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `POST /api/upload/:id`| `bucket.put()` (R2) | `env.BUCKET` (Native R2) | Implement `@aws-sdk/client-s3` | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `GET /api/file/:id` | `bucket.get()` (R2) | `env.BUCKET` (Native R2) | Implement S3 `GetObjectCommand` | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `GET /api/review/:id`| `db.prepare().first()` | `env.DB` | Query external DB | Pass-through via Netlify Rewrite | **Med (Opt A) / Zero (Opt B)** |
| `POST /api/review/:id`| `db.batch()` | `env.DB` | Rewrite with external DB transaction | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |
| `POST /api/admin/*` | `db.batch()` / `prepare()`| `env.DB` | Query external DB | Pass-through via Netlify Rewrite | **High (Opt A) / Zero (Opt B)** |

---

## 3. Storage Architecture: Private R2 Bucket

Evidence files are stored in a private Cloudflare R2 bucket (`BUCKET`):
1. **Zero Public Bucket Access:** The R2 bucket has public access permanently disabled. Files cannot be accessed by public URL guessing.
2. **Access Control Gate:** `GET /api/file/:id` enforces that only the file owner OR a faculty member assigned to that student's cohort can stream the file body.
3. **Magic-Byte Signature Verification:** Uploads are inspected at the binary level before writing to R2, preventing malicious payload disguise (`.exe` renamed to `.pdf`).

**Safety Guarantee:** During this audit, zero production database tables, schemas, connection strings, migrations, or R2 evidence files were altered or deleted.
