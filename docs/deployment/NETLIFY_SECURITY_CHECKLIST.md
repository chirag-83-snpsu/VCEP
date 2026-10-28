# VCEP Netlify Security & Curriculum Protection Audit Checklist

**Program:** Vayentra Corporate Experience Program (VCEP)  
**Security Lead:** Application Security Lead & Principal Systems Architect  
**Date:** 28 October 2026  
**Compliance Standard:** India DPDP Act 2023, OWASP ASVS Level 2, VCEP Institutional Security Policy  

---

## 1. Proprietary Curriculum Protection Audit

| Control Item | Requirement | Verification Method | Audit Status |
|---|---|---|:---:|
| **Public Downloads Exclusion** | No `.docx`, `.xlsx`, or `.zip` student worksheet files in public webroot. | Verified `fs.existsSync('public/downloads') === false`. Files moved to `curriculum/archive/`. | **PASS** |
| **Git Tracking Guard** | Proprietary curriculum files excluded from Git tracking. | `git check-ignore app/guided-learning/drive-edition-3.json` returns ignored path. | **PASS** |
| **Client Bundle Security** | Paid lesson source texts (`drive-edition-3.json`) must never be imported in client components or bundled into client JS. | Inspected `dist/client/_next/static/`; searched for proprietary strings in minified JS chunks. 0 leaks found. | **PASS** |
| **Server Authorization Gate** | `GET /api/guided/session/:id` must enforce authentication, roster enrollment, cohort release schedule, and consent. | Automated tests in `tests/verify-guided-security.mjs` (10 of 10 checks passed). | **PASS** |
| **Controlled Assessment Protection** | Session 22 (Exit B) must strictly lock AI prompts and require independent candidate execution. | Server returns `aiPrompt: ''` and enforces server-side AI lockout. | **PASS** |

### Git History Remediation & Secret-Rotation Protocol

> [!WARNING]
> **Audit Finding: Legacy Tracked Files in Git History**  
> Initial commit `4f4137a` historically included `public/downloads/*.docx`. Although deleted in the active working tree, these binary documents remain embedded in historical Git commits.
> 
> **Safe Remediation Plan Before Making Repository Public:**
> 1. **Do not run destructive history rewrites on shared branches.**
> 2. Create a clean production release branch: `git checkout -b release/netlify-production-launch`.
> 3. If institutional policy requires total historical purge before open-sourcing the code:
>    ```bash
>    # Use git-filter-repo to scrub the historical downloads directory:
>    git-filter-repo --path public/downloads/ --invert-paths --force
>    ```
> 4. **Secret Rotation Protocol:** Rotate `SESSION_SECRET` and `VCEP_ADMIN_MFA_KEY` in the Cloudflare Worker environment immediately upon creating the production deployment.

---

## 2. Authentication & Session Governance

| Security Dimension | Implementation Standard | Verification | Status |
|---|---|---|:---:|
| **Password Hashing** | PBKDF2 with SHA-256, 100,000 iterations, unique 16-byte cryptographically secure salt per user. | Verified in `lib/auth-crypto.server.ts` | **PASS** |
| **Session Cookies** | `__vcep_session` cookie configured with `HttpOnly; SameSite=Lax; Secure; Path=/`. | Tested via browser CDP and Miniflare API tests | **PASS** |
| **Invitation Tokens** | High-entropy random UUID tokens with `vcep_act_` prefix. Single-use enforcement (stored as SHA-256 hash in D1 `invitations` table with `used` flag and expiry). | Tested in `tests/verify-auth-system.mjs` | **PASS** |
| **Session Invalidation** | Sign-out endpoint deletes the session record from D1 `sessions` table and issues `Max-Age=0` header. | Verified in `tests/verify-user-flows.mjs` | **PASS** |
| **Admin MFA Protection** | Administrative operations require secondary TOTP code verification; root privileges restricted to `vayentragurukula@gmail.com`. | Verified in `app/api/[...path]/route.ts` | **PASS** |

---

## 3. Multi-Tenancy & Cross-College Isolation

| Governance Dimension | Requirement | Implementation | Status |
|---|---|---|:---:|
| **Cross-College Isolation** | Faculty from College A must never view roster, drafts, or submissions belonging to College B. | All D1 SQL queries in `app/api/[...path]/route.ts` scope by `WHERE r.cohort = ?`. | **PASS** |
| **Institutional Consent Gate** | Students cannot view lessons or save drafts until institutional consent (`consent = 1`) is confirmed by their college coordinator. | Verified: returns `403 Your college must confirm the required participation consent`. | **PASS** |
| **Release Schedule Gate** | Sessions unlock according to cohort release schedule (`assignments.unlock`). Early access is blocked at the server level. | Verified: returns `403 This session has not opened yet`. | **PASS** |
| **Sequential Progression Gate** | Cohorts configured with `policy: 'sequential'` require submitting Session $N-1$ before unlocking Session $N$. | Verified: returns `403 Submit the previous session worksheet to unlock this lesson`. | **PASS** |

---

## 4. HTTP Edge Security Headers

The following response headers are configured in `netlify.toml` and injected on all edge responses:

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- **Clickjacking Prevention:** `X-Frame-Options: DENY` ensures the VCEP workspace cannot be embedded in malicious iframes.
- **MIME-Sniffing Prevention:** `X-Content-Type-Options: nosniff` forces browsers to adhere strictly to declared MIME types.
- **HSTS Enforcement:** `Strict-Transport-Security` enforces HTTPS globally for 1 full year.
- **Curriculum Caching Policy:** `*.json` endpoints enforce `Cache-Control: no-store, private` to prevent shared caching of assessment or user data.
