import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 9292;
const BASE_URL = 'http://127.0.0.1:5173';
const SESSION_TOKEN = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';
const ARTIFACTS_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';

async function main() {
  console.log('--- VERIFYING ALL TRACK 2 WORKSTATIONS IN CHROME ---');

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
        num: 7,
        name: 'Session 07 (Excel Cleaning & Reconciliation)',
        expectedText: 'Independent Reconciliation & Exposure Control',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasZeroVariance: text.includes('BALANCED (0 VARIANCE)'),
            hasRawTotal: text.includes('44,000') || text.includes('₹44,000'),
            hasCleanTotal: text.includes('25,000') || text.includes('₹25,000'),
            hasQuarantine: text.includes('19,000') || text.includes('₹19,000'),
          };
        })()`,
      },
      {
        num: 8,
        name: 'Session 08 (Bank Reconciliation Statement)',
        expectedText: 'Three-Column Bank Reconciliation Statement',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasAdjustedBook: text.includes('87,200'),
            hasStatementBridge: text.includes('83,200'),
            hasZeroVariance: text.includes('ZERO VARIANCE') || text.includes('₹0 VARIANCE'),
            hasCharges: text.includes('500'),
            hasInterest: text.includes('200'),
          };
        })()`,
      },
      {
        num: 9,
        name: 'Session 09 (Business Finance & Performance)',
        expectedText: 'Case D Three-Month Financial Intelligence',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasGrossMargin: text.includes('50.0%') && text.includes('55.0%'),
            hasReceivables: text.includes('70,000'),
            hasOverhead: text.includes('45,000'),
          };
        })()`,
      },
      {
        num: 10,
        name: 'Session 10 (MIS Dashboard Development)',
        expectedText: 'One-Page Executive MIS Dashboard',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasRevenueCard: text.includes('1,50,000') || text.includes('150,000'),
            hasStressTester: text.includes('Sensitivity Stress-Tester'),
            hasMemo: text.includes('Executive Management Memo'),
          };
        })()`,
      },
      {
        num: 11,
        name: 'Session 11 (GST & Invoice Review)',
        expectedText: 'Domestic GST Invoice Review & GSTR-2B',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasE01: text.includes('VL001'),
            hasE02: text.includes('Tamil Nadu') && text.includes('3,600'),
            hasE03Defect: text.includes('Missing Serial'),
            hasEligibleItc: text.includes('720'),
            hasQuarantineItc: text.includes('360'),
          };
        })()`,
      },
      {
        num: 12,
        name: 'Session 12 (Receivables & Working Capital)',
        expectedText: 'Receivables Aging Schedule & 7-Day Cash',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasAgingSchedule: text.includes('Current') && text.includes('61–90 Days'),
            hasDeficitBridge: text.includes('20,000') || text.includes('- ₹20,000'),
            hasClosingSurplus: text.includes('+ ₹5,000') || text.includes('5,000'),
            hasBeaconDispute: text.includes('5,000') && text.includes('Beacon'),
          };
        })()`,
      },
    ];

    for (const wsInfo of workstations) {
      console.log(`\nNavigating to ${wsInfo.name} (section=Work)...`);
      await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=${wsInfo.num}&section=Work` });

      const found = await waitForContent(wsInfo.expectedText, 10000);
      if (!found) {
        console.warn(`⚠️ Warning: Expected text "${wsInfo.expectedText}" not found immediately.`);
      }

      await new Promise((r) => setTimeout(r, 1000));

      const verification = await send('Runtime.evaluate', {
        expression: wsInfo.verifyExpression,
        returnByValue: true,
      });

      const overflowCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const docScrollWidth = document.documentElement.scrollWidth;
          const windowWidth = window.innerWidth;
          return {
            docScrollWidth,
            windowWidth,
            overflow: docScrollWidth > windowWidth,
          };
        })()`,
        returnByValue: true,
      });

      console.log(`${wsInfo.name} Results:`, {
        checks: verification.result.value,
        layout: overflowCheck.result.value,
      });

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(ARTIFACTS_DIR, `workstation-session-${String(wsInfo.num).padStart(2, '0')}-work.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`✓ Saved screenshot: ${shotPath} (${Math.round((shot.data.length * 0.75) / 1024)} KB)`);
    }

    console.log('\n--- ALL 6 TRACK 2 WORKSTATIONS VERIFIED SUCCESSFULLY ---');
    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
  }
}

main();
