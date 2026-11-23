# VCEP v1.0 — Curriculum and Assessment Gap Report

**Document:** Curriculum Alignment, Edition Mapping & Evidence Strategy  
**Release:** VCEP v1.0-RC1  
**Target:** College Academic Coordinators, Lead Trainers & Evaluators  

---

## 1. Executive Summary: The Dual-Edition Architecture

VCEP operates a dual-curriculum model designed to bridge interactive classroom learning with rigorous independent assessment:

1. **Guided Learning Engine (Drive Edition 3.0)**:
   - Hosted at `/guided-learning?session=:id`.
   - A progressive 24-session business simulation anchored to **Vayentra Labs** (a fictional B2B services enterprise).
   - Features rich 6-stage interactive workflows: Overview, Learn, Case, Work, Team, and Review.
   - Includes source data tables, interactive working sheets, squad challenges, approved AI prompt experiments, and a /10 rubric.
2. **Official Assessed Worksheets (India Cases 2026-09-30)**:
   - Hosted in the student workspace at `/?session=:id` and managed via `/api/draft/:id` and `/api/submit/:id`.
   - Anchored to **four real Indian corporate proxies**: Hindustan Unilever (HUL), Infosys, Maruti Suzuki, and Titan.
   - Evaluates independent transfer of learning: students take the concept mastered in the Vayentra Labs classroom lab and apply it to a new corporate context.
   - Officially recorded in Cloudflare D1 with student integrity confirmation, revision tracking, faculty feedback, and grades.

---

## 2. Session-by-Session Comparison (All 24 Sessions)

| # | Session Title | Guided Learning (Drive Edition 3.0) | Assessed Worksheet (India Cases 2026-09-30) | Edition Alignment & Transfer Note |
|---|---|---|---|---|
| **01** | **How a Business Works** | **Vayentra Labs:** Revenue 100k, expenses 75k, collected 60k, bank 20k. Baseline A diagnostic. | **HUL Proxy:** Profitable distributor cash shortfall deposit decision. | *Independent diagnostic. Baseline A administered separately by trainer.* |
| **02** | Professional Identity & Teamwork | Five-person squad laptop & travel constraints; commitment contract. | **Infosys Proxy:** Project team SLA handoff and risk mitigation. | Focus shifts from team norming to operational SLA delivery. |
| **03** | Workplace Communication | Clarifying vague manager request ("best customers report"). | **Infosys Proxy:** Client scope change communication and email draft. | Core concept is identical: clarifying assumptions before analysis. |
| **04** | Meetings & Reporting | Client delivery deadline conflict vs supplier delay. | **Maruti Suzuki Proxy:** Logistics delay escalations and action log. | Meeting minutes and decision log format transfers directly. |
| **05** | **Accounting Transactions** | **Case A:** 12 September source transactions into journal register. | **Titan Proxy:** Showroom customer advances vs sales revenue. | *Spreadsheet heavy. Journal rules transfer; numbers differ.* |
| **06** | Ledger & Month End Close | **Case A:** Correcting 35k customer advance posted as income; trial balance. | **Infosys Proxy:** Accruals, unbilled revenue, and closing errors. | Ledger reconciliation principles transfer directly. |
| **07** | **Excel & Data Cleaning** | **Case B:** Raw receipts (R01–R06) cleaning, duplicates, date formats. | **HUL Proxy:** FMCG duplicate dispatch extract cleaning. | *Data cleaning formulas (TRIM, DATE, UNIQUE) apply across both.* |
| **08** | **Bank Reconciliation** | **Case C:** Cash book 87.5k vs bank statement 76.2k reconciliation bridge. | **Titan Proxy:** Retail store swipe deposits vs bank clearing. | 3-column bank reconciliation format transfers directly. |
| **09** | Business Finance & Performance | **Case D:** 3-month MIS; growth vs direct-cost intensity analysis. | **HUL Proxy:** Product margin erosion and trade discount review. | Ratio formulas (Gross Margin, Operating Margin) identical. |
| **10** | **MIS Dashboard Development** | **Case D:** 1-page executive dashboard with 3 actionable KPIs. | **Maruti Suzuki Proxy:** Branch performance dashboard; vanity metric audit. | Visual layout and KPI selection criteria transfer directly. |
| **11** | **GST & Invoice Review** | **Case E:** Domestic tax invoices E01–E04 review; HSN & GST rate audit. | **HUL Proxy:** Vendor supply invoice hold and tax adjustment memo. | Domestic supply rules identical; invoices differ. |
| **12** | Receivables & Working Capital | **Case F:** 4 invoices (100k total), 7-day outflows (45k), ageing schedule. | **HUL Proxy:** Distributor credit limit review and ageing buckets. | 0–30, 31–60, 61–90 aging logic transfers directly. |
| **13** | **AI for Commerce Professionals** | Safe prompt preparation; anonymizing Case D financials; audit log. | **Infosys Proxy:** Auditing AI-generated financial memo against mini-ledger. | Prompt hygiene and verification checklist identical. |
| **14** | AI Verification & Automation | Catching hallucinated metrics in draft MIS memo. | **Infosys Proxy:** Detecting unsupported claims in billing summary. | Verification framework (Claims vs Source Data) identical. |
| **15** | Customer & Sales Operations | **Case G:** 8 leads pipeline (Won/Lost/Open); conversion metrics. | **Maruti Suzuki Proxy:** Fleet lead qualification and SLA follow-up. | Pipeline stage definitions and conversion ratios identical. |
| **16** | Commercial Decision Making | Special pricing request: contribution margin vs capacity limits. | **Titan Proxy:** Corporate bulk discount vs showroom retail margin. | Break-even and contribution formula transfers directly. |
| **17** | Industry Challenge Discovery | Capstone client brief discovery; root-cause problem statement. | **Maruti Suzuki Proxy:** Spare parts delivery bottleneck diagnosis. | Stakeholder interview and 5-Whys framework identical. |
| **18** | Solution Design & Planning | Capstone work plan: 10 working days, 6 hours extra, milestone RACI. | **Infosys Proxy:** Client implementation milestone and acceptance plan. | Project scheduling and risk matrix transfer directly. |
| **19** | Project Execution & QA | Building Capstone model using Case F; preserving Raw vs Clean. | **Titan Proxy:** Retail inventory tracking prototype and QA check. | Data integrity and version control methods transfer directly. |
| **20** | Review & Change Control | Applying approved 5k credit note to F02 and 8k supplier deferral. | **Maruti Suzuki Proxy:** Managing engineering change order and cost impact. | Version rollback and change log formats identical. |
| **21** | Resume & Portfolio Development | Converting Capstone artifacts into verifiable resume achievements. | **Infosys Proxy:** Technical portfolio development and STAR stories. | Evidence-over-claims resume formula identical. |
| **22** | **Hiring Simulation & Exit Assessment** | **Exit B:** Unseen 60-minute assessment + structured interview rubric. | **Infosys Proxy:** Operations hiring test; oral defense of cash reserve. | *Exit assessment. AI strictly locked server-side.* |
| **23** | Corporate Presentation Prep | Squad pitch deck: 7 min presentation, 3 min live demo, defense prep. | **Titan Proxy:** Demo-day investor slide deck and rehearsal log. | 10-minute executive presentation format identical. |
| **24** | **Demo Day & Industry Passport** | Squad presentations, individual viva stations, Industry Passport audit. | **Titan Proxy:** Final investment committee defense and portfolio audit. | Final terminal assessment. Passport competency criteria identical. |

---

## 3. Controlled Assessments & Trainer Safeguards

### Session 01 — Baseline A Diagnostic
- **Purpose:** Diagnostic assessment of incoming commerce capabilities before teaching begins.
- **Safeguards:**
  - In `app/guided-learning/page.tsx`, the controlled assessment warning is highlighted in yellow.
  - Baseline A test questions are administered separately by the trainer.
  - No AI prompt or assistance is permitted during the 60-minute attempt.

### Session 22 — Exit B Examination & Structured Interview
- **Purpose:** Terminal capability assessment evaluating independent execution without aids.
- **Server Enforcement:**
  - In `lib/guided-content.server.ts`:
    ```ts
    aiPrompt: lesson.controlledAssessment && sessionId === 22 ? '' : lesson.aiPrompt
    ```
  - The server explicitly strips the AI prompt for Session 22.
  - The client displays an amber banner: *"No AI during Exit B or interviews"*.

---

## 4. Evidence Strategy & Spreadsheet Upload Workaround

### The Challenge
Sessions 05, 07, 08, 10, 11, and 12 require students to build financial working models in Microsoft Excel (`.xlsx`) or CSV.

### The Backend File Validator
The file upload endpoint (`POST /api/upload/:session`) inspects binary magic bytes:
- `image/png` (`89 50 4E 47`)
- `image/jpeg` (`FF D8 FF`)
- `application/pdf` (`%PDF-`)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (`50 4B 03 04` with `wordprocessingml` XML)

### Pilot Workaround & Student Instruction
Because `.xlsx` is not currently in the magic-byte whitelist:
1. **Option A (Preferred):** Students export their completed Excel workbook or dashboard to **PDF** (`File > Export > Create PDF/XPS`) and upload the PDF.
2. **Option B:** Students copy/paste their formula tables and summary charts into the official session **DOCX** worksheet and upload the completed `.docx`.
3. Up to **5 evidence files** (maximum 5 MB each) can be uploaded per session.

---

## 5. Preservation of Historical Submissions & Schema Snapshots

The VCEP backend guarantees that existing student submissions remain valid and readable:

```ts
// app/api/[...path]/route.ts
const sessionForAnswers = (a: any) =>
  a?._curriculumEdition === getSession().curriculumEdition
    ? getSession()
    : legacySessions.find(v => v.id === sessionId) || getSession();
```

- When students submit work, `_curriculumEdition` and the exact session snapshot `_session` are serialized directly into the immutable submission record.
- If a student previously submitted work under `legacy-v1` (the Vayentra Labs edition), faculty reviewers see the original Vayentra Labs questions and rubrics.
- If a student submits under `india-cases-2026-09-30`, reviewers see the HUL/Titan questions.
- Existing student grades, drafts, and notifications remain 100% intact.
