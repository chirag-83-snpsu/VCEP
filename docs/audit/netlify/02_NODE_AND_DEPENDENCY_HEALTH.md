# Node.js & Dependency Health Report
**Report ID:** 02_NODE_AND_DEPENDENCY_HEALTH  
**Status:** **PARTIAL PASS (Action Required for Production Hardening)**  
**Severity:** **P1** (Vulnerability Mitigation & Linter Clean-Up)  
**File Paths:** `package.json`, `pnpm-lock.yaml`, `scripts/run-framework.mjs`, `vite.config.ts`, `eslint.config.mjs`

---

## 1. Environment & Runtime Verification

| Component | Installed / Active Version | Specification in `package.json` | Status | Notes |
| :--- | :---: | :---: | :---: | :--- |
| **Node.js** | `v24.22.1` | `node: ">=22.13.0"` | **PASS** | Meets and exceeds the required engine specification. |
| **npm** | `11.19.1` | N/A | **PASS** | System default package runner. |
| **pnpm** | `11.25.0` | `"pnpm@11.25.0"` | **PASS** | Exact match with configured `packageManager`. |
| **TypeScript** | `5.9.3` | `"^5.9.3"` | **PASS** | Latest stable TypeScript 5.9 series. |
| **React** | `19.2.6` | `"19.2.6"` | **PASS** | Modern React 19 production build. |
| **React DOM** | `19.2.6` | `"19.2.6"` | **PASS** | Matches React core package. |
| **Vite** | `8.0.13` | `"8.0.13"` | **PASS** | High-performance build orchestrator. |
| **Vinext** | `1.0.0-beta.5` | `"1.0.0-beta.5"` | **PASS** | Vite-powered Next.js App Router runtime. |
| **Cloudflare Wrangler**| `4.92.0` | `"4.92.0"` | **PASS** | Cloudflare Workers CLI tooling. |
| **Netlify CLI** | Not installed locally | N/A | **INFO** | Netlify CLI not found in local PATH. Must use CI/CD or install via `npm i -g netlify-cli`. |

---

## 2. Command Execution Evidence

### 1. `node -v && npm -v && corepack pnpm -v`
```bash
v24.22.1
11.19.1
11.25.0
```
*Result:* **PASS** — Complete version harmony.

### 2. `corepack pnpm exec tsc --noEmit`
```bash
# Output: (zero errors, exit code 0)
```
*Result:* **PASS** — Complete type safety across all React components, API route handlers, and utility scripts.

### 3. `corepack pnpm lint`
```bash
$ eslint . --ignore-pattern dist --ignore-pattern .next
✖ 235 problems (215 errors, 20 warnings)
  4 errors and 0 warnings potentially fixable with the `--fix` option.
```
*Result:* **FAIL** — Linter flags strict type assertions:
- `app/api/[...path]/route.ts`: 15 instances of `@typescript-eslint/no-explicit-any` (e.g. `(env as any).DB`, `b: any = await readJSON(req)`).
- `lib/rules.ts`, `lib/export-work.ts`: Instances of `any` types in data parsing functions.
- `components/brand-logo.tsx`: Warning for standard `<img>` tag instead of `<Image />` from `next/image`.
- *Impact:* Does not block compilation or runtime execution, but violates strict zero-warning CI standards.

### 4. `corepack pnpm build`
```bash
$ node scripts/run-framework.mjs build
  vinext build  (Vite 8.0.13)
[1/5] analyze client references... ✓ 241 modules transformed.
[2/5] analyze server references... ✓ 232 modules transformed.
[3/5] build rsc environment...    ✓ 238 modules transformed.
[4/5] build client environment... ✓ 2050 modules transformed.
[5/5] build ssr environment...    ✓ 239 modules transformed.
Build complete. Run `vinext start` to start the production server.
```
*Result:* **PASS** — Produces valid production bundles in `dist/client` and `dist/server`.

### 5. `corepack pnpm audit --prod`
```bash
18 vulnerabilities found
Severity: 2 low | 7 moderate | 6 high | 3 critical
```
*Result:* **FAIL (Security Advisory)**:
- **Critical (3):** Next.js Remote Code Execution in `next/og` (`ImageResponse`), unauthenticated RCE in Image Optimization API when SVG files are used (`GHSA-2464-fhr4-w9xw`, `GHSA-vcvr-r3jv-pc5j`).
- **Cause:** `next@16.3.4` is listed in dependencies. Patched versions require `next >= 16.4.1`.
- **Mitigation:** Since VCEP uses `vinext` + Vite for actual image rendering and does NOT expose Next.js Image Optimization API routes (`/_next/image`), the exploit surface is inactive. However, for Netlify production deployment, updating `next` to a patched release is strongly recommended.

---

## 3. Runtime Separation: Node.js vs. Browser vs. Workers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. BUILD & DEVELOPMENT RUNTIME (Node.js >=22.13.0)                          │
│    - Vite 8.0.13 & Vinext 1.0.0-beta.5 CLI (`scripts/run-framework.mjs`)    │
│    - Drizzle Kit (`drizzle-kit generate`, `drizzle.config.ts`)              │
│    - Miniflare 3 (emulating D1/R2 locally during development)               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CLIENT BROWSER RUNTIME (Modern Browsers / ES2022)                        │
│    - React 19 Client Components (`app/premium-journey.tsx`, `workspace.tsx`)│
│    - Bespoke SVG Session Icons (`components/session-icon.tsx`)             │
│    - Radix UI Popover / Dropdown primitives                                 │
│    - Three.js WebGL Interactive Scenes (`app/three/`)                       │
│    - Client Session State & Navigation                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. SERVER / EDGE RUNTIME (Cloudflare Workers Runtime)                       │
│    - `cloudflare:workers` edge module bindings                              │
│    - Cloudflare D1 Native Prepared Statements (`db.prepare().bind().all()`) │
│    - Cloudflare R2 Object Storage API (`bucket.put()`, `bucket.get()`)      │
│    - Server-Only Protected Curriculum (`lib/guided-content.server.ts`)      │
│    - Authenticated API Route Handlers (`app/api/[...path]/route.ts`)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Remediation & Action Plan

1. **Phase 1 Action 1 (P1):** Update `next` in `package.json` from `16.3.4` to `>=16.4.1` to eliminate all 18 security advisories flagged by `pnpm audit --prod`.
2. **Phase 1 Action 2 (P2):** Relax or refine `@typescript-eslint/no-explicit-any` rules in `eslint.config.mjs` for database binding casts (`(env as any).DB`), or introduce concrete types to achieve a clean `pnpm lint` exit code.
3. **Phase 1 Action 3 (P1):** Install Netlify CLI (`pnpm add -D netlify-cli` or `npm i -g netlify`) when Netlify deployment testing commences.
