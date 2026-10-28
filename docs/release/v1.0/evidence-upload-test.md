# VCEP v1.0 — Student Evidence & Spreadsheet Upload Evaluation

**Release Candidate:** v1.0-RC1  
**Audit Standard:** [VCEP_v1_College_Pilot_Release_Gates.md](file:///Users/yashvanthkrishnamurthy/Downloads/VCEP_v1_College_Pilot_Release_Gates.md) (Gate 6)  
**Status:** **FAIL (Blocking for Formula-Based Financial Auditing)**  
**Auditor:** QA Engineering & Academic Assessment Auditor  

---

## 1. Executive Summary

A critical requirement for the VCEP Commerce WorkLab is validating students' spreadsheet execution, modeling capabilities, and formula logic. In 11 of the 24 sessions (notably Sessions 05, 07, 08, 10, 11, and 12), students build financial models, data cleaning formulas, bank reconciliation bridges, and GST registers.

Gate 6 requires:
> *"Native .xlsx submissions or approved equivalent retaining formula evidence, scoped authorization, reviewer access, restore and file validation."*

**Audit Finding:** The server's upload endpoint strictly blocks native `.xlsx` workbooks and `.csv` data files, forcing students to submit static PDFs or DOCX files where formula evidence cannot be directly inspected by faculty evaluators.

---

## 2. Server Upload Validator Inspection

File uploads are handled by `POST /api/upload/:session` in [`app/api/[...path]/route.ts`](file:///Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/api/[...path]/route.ts#L95-L101):

```ts
// app/api/[...path]/route.ts
const allowedTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
```

### Binary Magic-Byte Inspection
The server inspects the initial byte headers of the uploaded file buffer:
- **PNG:** `89 50 4E 47 0D 0A 1A 0A`
- **JPEG:** `FF D8 FF`
- **PDF:** `25 50 44 46` (`%PDF-`)
- **DOCX:** `50 4B 03 04` (PK ZIP container) combined with string check for `wordprocessingml` in the unpacked manifest.

### Behavior on Native Spreadsheet Uploads
- **Upload `.xlsx`:** Rejected with `HTTP 400 Bad Request` (`{"error": "Invalid file type. Only PNG, JPEG, PDF, and DOCX are allowed."}`).
- **Upload `.csv`:** Rejected with `HTTP 400 Bad Request`.
- **Upload renamed `.xlsx` as `.docx`:** Rejected with `HTTP 400 Bad Request` (magic byte parser fails to detect `wordprocessingml`).

---

## 3. Academic Impact Across the 24 Sessions

| Session # | Core Technical Task | Spreadsheet Formulas Required | Impact of Upload Rejection |
|---|---|---|---|
| **05** | Journal Register | Debit/Credit balance check (`=SUM`), balance verification | Formulas flattened; faculty can only see static output table. |
| **06** | Ledger & Month End Close | Closing adjustments, trial balance equations | Loss of dynamic formula auditability. |
| **07** | Excel & Data Cleaning | `=TRIM()`, `=CLEAN()`, `=DATEVALUE()`, `=UNIQUE()`, deduplication | **CRITICAL GAP:** Assessment tests specific formula syntax; cannot be confirmed from PDF. |
| **08** | Bank Reconciliation | Timing difference reconciliation bridge | Math logic cannot be audited for circular references or hardcoding. |
| **09** | Business Finance / MIS | `=SUMIFS()`, Gross Margin %, EBITDA % | Ratio calculations cannot be dynamically audited. |
| **10** | Executive Dashboard | KPI card formulas, dynamic range references | Static screenshot only. |
| **11** | GST & Invoice Audit | Tax rate lookups, CGST/SGST/IGST logic | Cannot verify lookup table logic. |
| **12** | Receivables Aging | Aging buckets (`0-30`, `31-60`, `61-90`) via `=IF()`, `=IFS()` | Logical formula structure obscured. |
| **16** | Special Pricing | Break-even volume and contribution margin models | Formula modeling cannot be verified. |
| **19/20** | Capstone Model & Changes | Complex multi-tab financial model | Entire workbook architecture flattened. |
| **22** | Exit B Examination | Live 60-min financial model defense | Evaluator cannot test model with stress test values. |

---

## 4. Controlled Pilot Workaround Protocol

For the controlled pilot (under 30 students), the following operating procedure is mandated until `.xlsx` support is deployed:

1. **Dual-Artifact Evidence Protocol:**
   - **Visual Verification:** Students export their completed workbook as a **PDF** (`File > Export > Create PDF/XPS`) and upload the PDF file (max 5 MB) via the session workspace evidence uploader.
   - **Formula Proof:** In the student's text submission box, students must paste the exact Excel formula used for key critical cells (e.g., Session 07 data cleaning formulas, Session 12 aging logic).
2. **Embedded DOCX Method:**
   - Students copy and paste the formatted spreadsheet tables and formula text into the official `.docx` session worksheet template and upload the `.docx`.
3. **Faculty Inspection Guideline:**
   - Evaluators must review the pasted formulas in the text submission against the PDF visual output to confirm that students did not hardcode values.

---

## 5. Engineering Remediation Plan (Post-Pilot / Phase 4B)

To achieve full compliance with Gate 6 without weakening binary validation:
1. Update `allowedTypes` to include `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
2. Extend the ZIP magic-byte inspector (`50 4B 03 04`) to search for `xl/workbook.xml` within the PK archive structure (mirroring the existing `wordprocessingml` check for DOCX).
3. Validate MIME type sniffing:
   ```ts
   // Proposed safe XLSX inspection
   if (header === '504b0304' && bufferContains(buf, 'xl/workbook.xml')) {
     mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
   }
   ```
4. Add automated test case `upload-xlsx.mjs` verifying that valid `.xlsx` uploads succeed while executable ZIPs (e.g. `.exe` disguised as `.xlsx`) are strictly rejected.
