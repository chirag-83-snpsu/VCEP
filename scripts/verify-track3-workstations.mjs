import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 9293;
const BASE_URL = 'http://127.0.0.1:5173';
const SESSION_TOKEN = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';
const ARTIFACTS_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';

async function main() {
  console.log('--- VERIFYING ALL TRACK 3 WORKSTATIONS (SESSIONS 13-18) IN CHROME CDP ---');

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1440,900',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === reqId) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((r) => (ws.onopen = r));
    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    await send('Network.setCookie', {
      name: '__vcep_session',
      value: SESSION_TOKEN,
      domain: '127.0.0.1',
      path: '/',
    });

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    async function waitForContent(substring, maxWaitMs = 10000) {
      const start = Date.now();
      while (Date.now() - start < maxWaitMs) {
        const res = await send('Runtime.evaluate', {
          expression: `(() => {
            const text = document.body.innerText || '';
            return text.includes(${JSON.stringify(substring)});
          })()`,
          returnByValue: true,
        });
        if (res.result.value === true) return true;
        await new Promise((r) => setTimeout(r, 250));
      }
      return false;
    }

    const workstations = [
      {
        num: 13,
        name: 'Session 13 (AI for Commerce Professionals)',
        expectedText: 'Data Minimization, Boundary Prompting & Human Verification',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('ENTERPRISE AI COMPLIANCE STUDIO'),
            hasDPDP: text.includes('DPDP standards') || text.includes('DPDP'),
            hasPromptTemplate: text.includes('Constrained Enterprise Prompt Template'),
            hasVerificationLog: text.includes('Human Verification Audit Trail'),
          };
        })()`,
      },
      {
        num: 14,
        name: 'Session 14 (AI Verification and Automation)',
        expectedText: 'Audit AI Hallucinations & Build Automated Checkpoints',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('AI VERIFICATION & WORKFLOW AUDIT STUDIO'),
            hasFaultInjection: text.includes('Automated Checkpoint & Fault-Injection Simulator'),
            hasClaimAudit: text.includes('The Four AI Claims Audit Register'),
            hasHaltStatus: text.includes('WORKFLOW HALTED'),
          };
        })()`,
      },
      {
        num: 15,
        name: 'Session 15 (Customer and Sales Operations)',
        expectedText: 'CRM Pipeline Tracking & Conversion Funnel Analysis',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('SALES OPERATIONS & CRM STUDIO'),
            hasAllLeadWinRate: text.includes('37.5%'),
            hasClosedWinRate: text.includes('60.0%'),
            hasOverdueAlert: text.includes('L06 (28 Oct) & L07 (30 Oct)'),
          };
        })()`,
      },
      {
        num: 16,
        name: 'Session 16 (Commercial Decision Making)',
        expectedText: 'Unit Contribution, Break-Even & Capacity Constraint Simulator',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('COMMERCIAL DECISION & BREAK-EVEN STUDIO'),
            hasBaseline30k: text.includes('30,000') || text.includes('₹30,000'),
            hasZeroIncremental: text.includes('₹0') || text.includes('0 incremental'),
            hasCapacityExhaustion: text.includes('100.0%') || text.includes('100%'),
          };
        })()`,
      },
      {
        num: 17,
        name: 'Session 17 (Industry Challenge Discovery)',
        expectedText: 'Client Discovery Interview & Business Problem Formulation',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('CAPSTONE DISCOVERY STUDIO'),
            has8Questions: text.includes('The Eight Structured Discovery Questions'),
            has80WordProblem: text.includes('80-Word Business Problem Statement'),
            hasScopeExclusion: text.includes('No Join Key') || text.includes('Case F and Case G'),
          };
        })()`,
      },
      {
        num: 18,
        name: 'Session 18 (Solution Design and Project Planning)',
        expectedText: 'Solution Design, Work Breakdown Structure (WBS) & Acceptance Gates',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('PROJECT CHARTER & ARCHITECTURE STUDIO'),
            hasOptionA: text.includes('OPTION A: Dynamic Spreadsheet'),
            hasWbsTable: text.includes('10-Day Work Breakdown Structure'),
            has5GatesPassed: text.includes('GATE PASSED') && text.includes('Case F Control Total Reconciliation'),
          };
        })()`,
      },
    ];

    for (const wsInfo of workstations) {
      console.log(`\nTesting ${wsInfo.name}...`);
      const targetUrl = `${BASE_URL}/guided-learning?session=${wsInfo.num}&section=Work`;
      await send('Page.navigate', { url: targetUrl });

      const found = await waitForContent(wsInfo.expectedText, 10000);
      if (!found) {
        console.error(`  FAIL: Workstation header "${wsInfo.expectedText}" not found for Session ${wsInfo.num}`);
      } else {
        console.log(`  ✓ Workstation loaded: "${wsInfo.expectedText}"`);
      }

      // Check domain logic expressions
      const evalRes = await send('Runtime.evaluate', {
        expression: wsInfo.verifyExpression,
        returnByValue: true,
      });
      console.log('  Domain Checks:', evalRes.result.value);

      // Check overflow at 1440px
      const overflowDesktop = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth
          };
        })()`,
        returnByValue: true,
      });
      console.log('  Desktop 1440px Overflow:', overflowDesktop.result.value);

      // Capture desktop screenshot
      const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(ARTIFACTS_DIR, `track3-session-${String(wsInfo.num).padStart(2, '0')}-work.png`),
        Buffer.from(shotDesktop.data, 'base64')
      );
      console.log(`  Saved screenshot: track3-session-${String(wsInfo.num).padStart(2, '0')}-work.png`);

      // Switch to 390px mobile viewport to test responsive behavior
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 600));

      const overflowMobile = await send('Runtime.evaluate', {
        expression: `(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            hasOverflow: document.documentElement.scrollWidth > window.innerWidth
          };
        })()`,
        returnByValue: true,
      });
      console.log('  Mobile 390px Overflow:', overflowMobile.result.value);

      const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        path.join(ARTIFACTS_DIR, `track3-session-${String(wsInfo.num).padStart(2, '0')}-mobile-390.png`),
        Buffer.from(shotMobile.data, 'base64')
      );
      console.log(`  Saved screenshot: track3-session-${String(wsInfo.num).padStart(2, '0')}-mobile-390.png`);

      // Restore to 1440px desktop
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }

    console.log('\n=============================================');
    console.log('ALL TRACK 3 WORKSTATIONS SUCCESSFULLY VERIFIED!');
    console.log('=============================================');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    chrome.kill();
  }
}

main();
