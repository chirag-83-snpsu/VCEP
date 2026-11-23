# VCEP v1.0 — Privacy & Real-User Operations Plan

**Release Candidate:** v1.0-RC1  
**Audit Standard:** [VCEP_v1_College_Pilot_Release_Gates.md](file:///Users/yashvanthkrishnamurthy/Downloads/VCEP_v1_College_Pilot_Release_Gates.md) (Gate 7 & Gate 9)  
**Status:** **NOT VERIFIED (Draft Pilot State / Unverified for Commercial DPDP Compliance)**  
**Auditor:** Regulatory Compliance & Operations Auditor  

---

## 1. Executive Summary

This document evaluates the legal, privacy, and operational readiness of VCEP v1.0 for multi-college deployment. While the application implements effective database-level cohort isolation and draft audit logging, formal compliance under India's **Digital Personal Data Protection Act, 2023 (DPDP Act 2023)** and institutional Data Processing Agreements (DPA) remain incomplete and must be formalized prior to onboarding real students.

---

## 2. Privacy Policy & Legal Architecture Review

### 2.1 Current Pilot Privacy Notice (`app/privacy/page.tsx`)
The current policy at [`app/privacy/page.tsx`](file:///Users/yashvanthkrishnamurthy/Documents/Vayentra-Projects/VCEP/app/privacy/page.tsx) transparently documents operational realities:
- **Stored Data Elements:** Sign-in identifier (ChatGPT user ID), email address, college enrollment details, worksheet responses, last 10 draft revisions, final submissions, uploaded evidence files, grades, faculty feedback, and operational audit events.
- **Access Boundaries:** Student accesses own work; assigned cohort faculty reviews submitted attempts; program administrator reviews multi-college records; public visitors see only safe catalog metadata.
- **Minors Policy:** Directs partner colleges to collect and retain parental/guardian permissions where students are minors (<18 years old).
- **Compliance Disclaimer:** The notice explicitly states:
  > *"Production retention, backup restore and deletion procedures must be agreed before institutional rollout. This pilot notice does not claim legal certification or a completed compliance review."*

### 2.2 Gap Analysis: India DPDP Act 2023 Requirements

| Statutory Requirement | Current Implementation | Compliance Gap | Action Required Before Scale |
|---|---|---|---|
| **Data Fiduciary vs Processor Designation** | Unformalized | Partner colleges and Vayentra have not executed an institutional Data Processing Agreement (DPA). | Draft and execute standard college DPA defining Vayentra as Data Processor. |
| **Notice & Itemized Consent** | Single checkbox recorded in admin panel | No clear, affirmative, itemized consent presented to students upon initial sign-in. | Implement initial onboarding modal with explicit consent opt-in. |
| **Children's Data (<18 Years)** | College-managed checkbox | No verifiable parental consent mechanism under Section 9 of DPDP Act. | Colleges must warrant that enrolled participants are >=18 or retain written parental consent. |
| **Right to Erasure & Correction** | Manual email to Gmail | No automated account deletion or data export route in the user interface. | Establish automated data export (`JSON/ZIP`) and formal erasure workflow. |
| **Data Protection Officer (DPO)** | Generic Gmail address | No named Grievance Redressal Officer published. | Designate named Grievance Officer with published Indian mailing address and SLA. |

---

## 3. Real-User Operations & Escalation Framework

### 3.1 Current Staffing Status (Gate 9 Gap)
Currently, only a single contact email ([`vayentragurukula@gmail.com`](mailto:vayentragurukula@gmail.com)) is assigned across all administrative, pedagogical, and technical functions. For a multi-college pilot, an accountable operational roster must be established.

### 3.2 Target Pilot Operational Roster

| Role | Primary Contact | Responsibilities | Availability |
|---|---|---|---|
| **Lead System Administrator** | Lead DevOps Engineer | Cloudflare Worker health, D1 backup, R2 storage, emergency rollback | 24/7 on-call during pilot days |
| **Lead Academic Coordinator** | Lead Trainer | Curriculum delivery, trainer onboarding, student disputes, rubrics | 08:00 – 18:00 IST |
| **College Alpha Liaison** | Assigned College Faculty | Cohort A student attendance, local device support, proctoring Baseline A & Exit B | Classroom hours |
| **College Beta Liaison** | Assigned College Faculty | Cohort B student attendance, local device support, proctoring Baseline A & Exit B | Classroom hours |
| **Grievance Redressal Officer** | Designated Legal/Ops Lead | Privacy concerns, data deletion requests, DPDP compliance inquiries | Response within 48 business hours |

### 3.3 Incident Severity Ladder & Response SLA

| Severity | Definition | Target Response | Target Resolution | Escalation Path |
|---|---|---|---|---|
| **P1 (Critical Outage)** | Entire platform down; database unreachable; student submissions failing during active class. | 15 minutes | < 2 hours | DevOps Lead -> Lead Trainer -> College Liaisons |
| **P2 (Major Defect)** | Specific session materials inaccessible; evidence upload failing; faculty unable to grade. | 30 minutes | < 6 hours | DevOps Lead -> Lead Trainer |
| **P3 (Minor Issue)** | Typo in case brief; formatting glitch on mobile screen; non-blocking UI issue. | 4 hours | < 24 hours | Product Engineer |
| **P4 (Feature Request)** | Request for new export format; theme adjustment. | 24 hours | Next sprint | Backlog review |

---

## 4. Operational Runbooks for Pilot Delivery

### 4.1 Missed Sessions & Assessment Extension Runbook
- If a student misses a synchronous 135-minute session due to illness or connectivity issues:
  1. The college faculty liaison logs the absence in the college attendance roster.
  2. The faculty coordinator issues a 48-hour draft extension by toggling the student's cohort policy or approving an asynchronous catch-up attempt.
  3. Controlled assessments (Session 01 Baseline A and Session 22 Exit B) **cannot** be attempted asynchronously; they must be rescheduled in a proctored makeup slot.

### 4.2 Account Offboarding & Data Deletion Procedure
- Upon completion of the pilot cohort:
  1. Final grades, attendance, and Industry Passport credentials are exported to the partner college registrar.
  2. The cohort status in D1 is transitioned to `archived`.
  3. Student draft histories older than 30 days are scheduled for automated purge.
  4. Submitted final attempts and evidence files in R2 are preserved for the agreed institutional retention window (standard: academic semester + 90 days), after which permanent cryptographic erasure is executed.
