# Student, Faculty & Administrator Workflows Audit
**Report ID:** 06_STUDENT_FACULTY_ADMIN_WORKFLOWS  
**Status:** **ALL WORKFLOWS VERIFIED & TESTED**  
**Test Evidence:** `tests/workflow.mjs`, `tests/verify-guided-security.mjs`  
**Data Isolation:** Strict Multi-Tenant Cohort Isolation

---

## 1. Full Student Lifecycle Verification

| Workflow Step | Endpoint / Method | Security & Business Rules Verified | Audit Status |
| :--- | :--- | :--- | :---: |
| **1. Enrolment & Roster Check** | `GET /api/boot` | Must be listed in `roster` with matching email. Role set to `student`, `faculty`, or `pending`. Unenrolled users marked `pending`. | **PASS** |
| **2. Participation Consent** | `roster.consent = 1` | Required before student can access guided lessons (`GET /api/guided/:id`), save drafts, or upload evidence. Missing consent returns `403`. | **PASS** |
| **3. Sequential Progression Lock**| `cohort.policy = 'sequential'` | In sequential cohorts, Session $N$ ($N > 1$) is locked until Session $N-1$ is submitted and not returned. Attempting access returns `403`. | **PASS** |
| **4. Cloud Draft Saving** | `POST /api/draft/:session` | Optimistic concurrency control using `revision` integer. Stale updates return `409 Conflict`. Answers sanitized via `cleanAnswers`. | **PASS** |
| **5. 10-Version Draft History**| `draft.revision`, `versions` | Last 10 revisions preserved automatically in `versions` table. Students can restore any prior version via `{ restore: versionId }`. | **PASS** |
| **6. Private Evidence Upload** | `POST /api/upload/:session` | Magic-byte signature verification (PNG `89 50 4E 47`, JPEG `FF D8 FF`, PDF `%PDF-`, DOCX with `[Content_Types].xml`). Max 5 files, 5MB each. | **PASS** |
| **7. Official Submission** | `POST /api/submit/:session` | Requires `integrity: true`. Verifies all required worksheet answers. Generates immutable UUID receipt, sets late flag if past due/extension. | **PASS** |
| **8. Real-Time Notifications** | `GET /api/boot`, `notifications` | Submission receipts, late flags, faculty feedback, and returned notices appear in in-app notification tray. | **PASS** |
| **9. Returned Work & Resubmit** | `POST /api/review/:receipt` | Returned assignments unlock the draft state (`status = 'Returned'`). Students can edit, correct, and resubmit cleanly. | **PASS** |

---

## 2. Faculty & Management Workspace Workflows

| Faculty / Admin Action | Implementation in `route.ts` | Verification Details | Audit Status |
| :--- | :--- | :--- | :---: |
| **1. College Cohort Creation** | `POST /api/admin/cohort` | Validates name (3–100 chars), enforces policy (`open` vs `sequential`). Inserts into `cohorts` table and audit log. | **PASS** |
| **2. Bulk Roster Import** | `POST /api/admin/roster` | Validates 1–200 rows. Rejects moving students with existing submissions between cohorts to prevent grade tampering. | **PASS** |
| **3. Multi-Tenant Cohort Isolation** | `mayReview(role, facultyCohort, studentCohort)` | Faculty can **only** view and grade submissions from their assigned cohort. Unauthorized access attempts return `403`. | **PASS** |
| **4. Release Schedules & Deadlines** | `POST /api/admin/assignment` | Cohort-specific `unlock` and `due` timestamps. Unlocked sessions open automatically; submissions past `due` flagged `late: 1`. | **PASS** |
| **5. Individual Student Extensions**| `POST /api/admin/extension` | Overrides cohort deadline for an individual student email. Prevents false `late` flags upon submission. | **PASS** |
| **6. Submission Review & Rubric** | `POST /api/review/:receipt` | Enforces rubric ceilings: `execution <= 4`, `reasoning <= 2`, `communication <= 2`, `process <= 2`. Requires minimum 10 characters feedback. | **PASS** |
| **7. Evidence File Inspection** | `GET /api/file/:id` | Private stream from R2. Accessible only by file owner or authorized faculty reviewing that student's submission. | **PASS** |

---

## 3. Verified Security Isolation Guarantees

```
[ COLLEGE A COHORT ]                            [ COLLEGE B COHORT ]
┌───────────────────────────────┐               ┌───────────────────────────────┐
│ Faculty A                     │               │ Faculty B                     │
│ ├─ Student A1 (Submissions)   │   X BLOCKED X │ ├─ Student B1 (Submissions)   │
│ ├─ Student A2 (Drafts)        │ ◄───────────► │ ├─ Student B2 (Drafts)        │
│ └─ Private Uploads in R2      │               │ └─ Private Uploads in R2      │
└───────────────────────────────┘               └───────────────────────────────┘
  ▲ Faculty A cannot view or grade                ▲ Faculty B cannot view or grade
    College B submissions (HTTP 403)                College A submissions (HTTP 403)
```

**Verdict:** Student, faculty, and administrator lifecycle workflows are rigorously implemented, protected by atomic database transactions, and fully validated by end-to-end integration tests.
