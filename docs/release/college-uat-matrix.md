# VCEP v1.0 — College User Acceptance Testing (UAT) Matrix

**Document:** Multi-College Staging Test Execution Matrix  
**Release:** VCEP v1.0-RC1  
**Target:** QA Engineers, Partner College Coordinators & Evaluators  

---

## 1. Test Personas & Synthetic Fixtures

All UAT tests must be conducted using synthetic fixture accounts on staging. **No real student or faculty PII may be used.**

| Persona ID | Display Name | Role | Cohort Assignment | Policy | Consent Recorded? |
|---|---|---|---|---|---|
| `guest` | Anonymous Visitor | None (Not signed in) | None | N/A | No |
| `pending_user` | Priya Pending | Pending | None | N/A | No |
| `student_alpha` | Aarav Sharma | Student | `cohort_alpha` (College Alpha) | `open` | **Yes (1)** |
| `student_beta` | Diya Patel | Student | `cohort_beta` (College Beta) | `sequential` | **Yes (1)** |
| `student_noconsent`| Rohan Gupta | Student | `cohort_alpha` (College Alpha) | `open` | **No (0)** |
| `faculty_alpha` | Prof. Anita Rao | Faculty | `cohort_alpha` (College Alpha) | `open` | **Yes (1)** |
| `faculty_beta` | Prof. Suresh Nair | Faculty | `cohort_beta` (College Beta) | `sequential` | **Yes (1)** |
| `admin` | System Admin | Admin | Global (`ownerEmail`) | N/A | N/A |

---

## 2. UAT Test Execution Matrix (14 Test Flows)

### Flow 1: Catalogue & Homepage Browsing
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-01.1` | `guest` | Load `GET /` | Homepage renders with VCEP brand, 4 career tracks, session cards with titles and 8-word summaries. No personal data shown. | **PASS** |
| `UAT-01.2` | `student_alpha` | Load `GET /` | Personalized progress ring shows percentage completed, current session card recommends next session. | **PASS** |
| `UAT-01.3` | `faculty_alpha` | Load `GET /` | "Faculty Management" button appears in navigation header; cards indicate submission counts for `cohort_alpha`. | **PASS** |

---

### Flow 2: Authentication & Role Verification
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-02.1` | `pending_user` | Sign in with unregistered email | Yellow banner renders: *"Awaiting college enrolment confirmation"*. Worksheets remain read-only. | **PASS** |
| `UAT-02.2` | `student_alpha` | Sign in with enrolled email | Renders student workspace with active drafts and notifications. | **PASS** |
| `UAT-02.3` | `guest` | Fetch `/api/draft/1` | Returns `HTTP 401 Unauthorized` with `{"error": "Sign in to continue"}`. | **PASS** |

---

### Flow 3: Guided Learning Access (`/guided-learning`)
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-03.1` | `guest` | Open `/guided-learning?session=1` | Sidebar displays safe titles. Main area renders *"Sign In Required"* access guard with link to home. No course body leaked. | **PASS** |
| `UAT-03.2` | `pending_user` | Open `/guided-learning?session=1` | Renders *"Access Restricted: Awaiting college enrolment confirmation"*. | **PASS** |
| `UAT-03.3` | `student_noconsent` | Open `/guided-learning?session=1` | Renders *"Access Restricted: Your college must confirm participation consent"*. | **PASS** |
| `UAT-03.4` | `student_alpha` | Open `/guided-learning?session=1` | Lesson 01 loads immediately with all 6 stages, source tables, and work prompts. | **PASS** |
| `UAT-03.5` | `student_beta` | Open `/guided-learning?session=2` before Session 1 submission | Server returns `HTTP 403 Forbidden`. Banner renders *"Submit the previous session worksheet to unlock this lesson"*. | **PASS** |
| `UAT-03.6` | `faculty_alpha` | Open `/guided-learning?session=1` | Authorized access: faculty can preview all 24 guided lessons for their assigned cohort. | **PASS** |

---

### Flow 4: Interactive Guided Learning Stages & Local Caching
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-04.1` | `student_alpha` | Navigate stages 1 to 6 (Overview -> Review) | Tab transitions smoothly without page reload. Previous stage inputs are preserved. | **PASS** |
| `UAT-04.2` | `student_alpha` | Enter text into working table textarea | Status indicator changes to *"Saved in this browser tab"*. Saved in `sessionStorage`. | **PASS** |
| `UAT-04.3` | `student_alpha` | Reload browser tab | Typed draft answers restore immediately from `sessionStorage`. | **PASS** |
| `UAT-04.4` | `student_alpha` | Click "Export Draft ↓" | Browser downloads `VCEP_S01_Practice_Draft.txt` containing timestamp, assignment, and all student answers. | **PASS** |
| `UAT-04.5` | `student_alpha` | Click "Copy approved prompt" (Team stage) | Approved AI prompt copies to clipboard; status shows *"AI prompt copied"*. | **PASS** |

---

### Flow 5: Controlled Assessment Safeguards (Sessions 01 & 22)
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-05.1` | `student_alpha` | Open Session 01 Overview tab | Renders amber box: *"Controlled assessment: Baseline A is issued separately by the trainer. Work independently without AI..."* | **PASS** |
| `UAT-05.2` | `student_alpha` | Open Session 22 Team tab | Renders amber box: *"No AI during Exit B or interviews"*. The AI prompt disclosure widget is omitted. | **PASS** |
| `UAT-05.3` | `student_alpha` | Inspect API response for `/api/guided/session/22` | Server response confirms `aiPrompt: ""`. No prompt text transmitted. | **PASS** |

---

### Flow 6: Download Permissions & Security Gatekeeping
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-06.1` | `guest` | `GET /downloads/VCEP_Student_Session_Packs.zip` | Returns `HTTP 404 Not Found` (Static file leak closed). | **PASS** |
| `UAT-06.2` | `guest` | `GET /api/template/1` | Returns `HTTP 401 Unauthorized` with `{"error": "Sign in with an enrolled account to download worksheets"}`. | **PASS** |
| `UAT-06.3` | `student_alpha` | `GET /api/template/1` | Returns `HTTP 200 OK` with `VCEP_S01_Worksheet.docx` attachment (valid DOCX file signature `PK`). | **PASS** |
| `UAT-06.4` | `student_beta` | `GET /api/template/2` before submitting Session 1 | Returns `HTTP 403 Forbidden` (`Submit the previous session worksheet to unlock this download`). | **PASS** |
| `UAT-06.5` | `student_alpha` | `GET /api/template/all` | Returns `VCEP_Permitted_Worksheets.zip` containing only unlocked sessions. | **PASS** |
| `UAT-06.6` | `admin` | `GET /api/template/all` | Returns `HTTP 200 OK` with `VCEP_24_India_Case_Worksheets.zip` containing all 24 session DOCX files. | **PASS** |

---

### Flow 7: Worksheet Cloud Drafts & Revision Concurrency
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-07.1` | `student_alpha` | Save draft on Session 1 with revision `0` | Returns `revision: 1`, updated timestamp. Draft stored in D1. | **PASS** |
| `UAT-07.2` | `student_alpha` | Send save request with stale revision `0` | Returns `HTTP 409 Conflict` with latest cloud draft. Prevents overwriting newer work. | **PASS** |
| `UAT-07.3` | `student_alpha` | Update draft 12 times | Version history retains exactly the latest 10 versions in `versions` table. | **PASS** |
| `UAT-07.4` | `student_alpha` | Restore version from history | Draft reverts to selected historical version; revision increments cleanly. | **PASS** |

---

### Flow 8: Evidence Uploads & Binary Validation
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-08.1` | `student_alpha` | Upload valid 2 MB `.pdf` document | Server validates magic bytes `%PDF-`, saves to R2 bucket, creates record in `uploads` table. | **PASS** |
| `UAT-08.2` | `student_alpha` | Upload executable `.exe` renamed as `.pdf` | Returns `HTTP 400 Bad Request` (*"Upload a PNG, JPEG, PDF or DOCX with a matching file signature"*). | **PASS** |
| `UAT-08.3` | `student_alpha` | Upload 6th file to same session | Returns `HTTP 400 Bad Request` (*"Maximum five files per session"*). | **PASS** |
| `UAT-08.4` | `student_alpha` | Upload 6 MB file | Returns `HTTP 400 Bad Request` (*"Each file must be between 1 byte and 5 MB"*). | **PASS** |

---

### Flow 9: Official Submission & Integrity Declarations
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-09.1` | `student_alpha` | Submit with incomplete required fields | Returns `HTTP 400 Bad Request` with list of missing fields. | **PASS** |
| `UAT-09.2` | `student_alpha` | Submit without integrity checkbox checked | Returns `HTTP 400 Bad Request` (*"Confirm the integrity declaration"*). | **PASS** |
| `UAT-09.3` | `student_alpha` | Submit complete worksheet on time | Submission recorded in D1 with receipt UUID; status set to `'Submitted'`; late set to `0`. | **PASS** |
| `UAT-09.4` | `student_alpha` | Submit past assignment due date | Submission recorded with `late: 1`. Receipt notes late submission. | **PASS** |

---

### Flow 10: Faculty Review, Rubric Limits & Cohort Isolation
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-10.1` | `faculty_alpha` | Open Faculty Management queue | Queue displays submissions exclusively from `cohort_alpha`. No submissions from `cohort_beta` appear. | **PASS** |
| `UAT-10.2` | `faculty_alpha` | Attempt to access submission from `cohort_beta` via direct URL | Returns `HTTP 403 Forbidden` (*"This cohort is outside your assignment"*). | **PASS** |
| `UAT-10.3` | `faculty_alpha` | Submit grade with Execution = 5 (max 4) | Returns `HTTP 400 Bad Request` (*"Rubric limits are 4, 2, 2 and 2"*). | **PASS** |
| `UAT-10.4` | `faculty_alpha` | Submit valid grade (Execution: 4, Reasoning: 2, Comm: 2, Process: 2) | Submission status changes to `'Graded'`; notification delivered to student. | **PASS** |
| `UAT-10.5` | `student_alpha` | Check student notifications | Notification received: *"Session 1: Graded. [Faculty comments]"*. Grade appears in progress card. | **PASS** |

---

### Flow 11: Return for Revision & Resubmission
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-11.1` | `faculty_alpha` | Return attempt with action `'return'` and feedback | Submission status set to `'Returned'`; draft status unlocked to `'Returned'`. | **PASS** |
| `UAT-11.2` | `student_alpha` | Open returned worksheet | Worksheet unlocks for editing; student makes corrections and resubmits. | **PASS** |
| `UAT-11.3` | `student_alpha` | Edit submission before faculty returns it | Returns `HTTP 409 Conflict` (*"This submission is locked"*). | **PASS** |

---

### Flow 12: Administrative Cohort & Schedule Controls
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-12.1` | `admin` | Create new cohort with policy `'sequential'` | Cohort created with unique ID in `cohorts` table; audit log recorded. | **PASS** |
| `UAT-12.2` | `admin` | Upload CSV roster with 50 students and 2 faculty | Roster updated in D1; consent flags set; audit log recorded. | **PASS** |
| `UAT-12.3` | `admin` | Set Session 02 unlock date to future timestamp | Session 02 locks for all students in cohort until specified time. | **PASS** |
| `UAT-12.4` | `admin` | Grant individual extension to `student_alpha` | Extended due date recorded in `extensions` table; prevents late flag for that student. | **PASS** |

---

### Flow 13: Cross-Cohort Data Leak Prevention
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-13.1` | `student_beta` | Attempt to download evidence uploaded by `student_alpha` | Returns `HTTP 403 Forbidden` (*"You cannot access this evidence"*). | **PASS** |
| `UAT-13.2` | `student_alpha` | Attempt to load draft belonging to `student_beta` | Returns blank new draft for `student_alpha`; cannot access `student_beta` draft. | **PASS** |
| `UAT-13.3` | `faculty_beta` | Download evidence uploaded by `student_alpha` in College Alpha | Returns `HTTP 403 Forbidden` (*"You cannot access this evidence"*). | **PASS** |

---

### Flow 14: Mobile & Desktop Viewport Accessibility
| Test ID | Role | Action | Expected Output | Status |
|---|---|---|---|---|
| `UAT-14.1` | Any | View `/guided-learning` at 375px width (Mobile) | Sidebar collapses into sticky mobile dropdown selector (`#v3-mobile-select`); layout stacks vertically. | **PASS** |
| `UAT-14.2` | Any | View `/guided-learning` at 1440px width (Desktop) | Two-column grid with sticky 290px session navigation sidebar and main content area. | **PASS** |
| `UAT-14.3` | Any | Tab through interface using keyboard only | Focus ring clearly visible on all buttons, tabs, textareas, and select elements; no keyboard traps. | **PASS** |
| `UAT-14.4` | Any | Screen reader audit | Interactive tables have accessible `aria-label` attributes with row, column, and header descriptions. | **PASS** |
