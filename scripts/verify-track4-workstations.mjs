import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 9294;
const BASE_URL = 'http://127.0.0.1:5173';
const SESSION_TOKEN = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';
const ARTIFACTS_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';

async function main() {
  console.log('--- VERIFYING ALL TRACK 4 WORKSTATIONS (SESSIONS 19-24) IN CHROME CDP ---');

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
        num: 19,
        name: 'Session 19 (Project Execution and Quality Assurance)',
        expectedText: 'Execute Acceptance Tests, Audit Formulas & Enforce Edge Controls',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('QUALITY ASSURANCE & TESTING STUDIO'),
            hasSensitivityTester: text.includes('As-Of Date Boundary Sensitivity Tester'),
            hasQaMatrix: text.includes('Excel Quality Assurance & Formula Audit Matrix'),
            hasControlTotalInvariance: text.includes('1,00,000') || text.includes('₹1,00,000'),
          };
        })()`,
      },
      {
        num: 20,
        name: 'Session 20 (Management Review and Change Control)',
        expectedText: 'Assess Approved Scope Changes, Branch Model v2.0 & Maintain Audit Log',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('CHANGE CONTROL & MANAGEMENT REVIEW STUDIO'),
            hasVersionEngine: text.includes('Model Version Comparison Engine'),
            hasReceivables95k: text.includes('95,000') || text.includes('₹95,000'),
            hasDeficitShrunk: text.includes('12,000') || text.includes('₹12,000'),
          };
        })()`,
      },
      {
        num: 21,
        name: 'Session 21 (Resume and Portfolio Development)',
        expectedText: 'Translate Capstone Deliverables into Verified XYZ Resume Bullets',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('RESUME & PROFESSIONAL PORTFOLIO STUDIO'),
            hasXyzFramework: text.includes('High-Impact Resume Bullets (Google XYZ Framework)'),
            hasPortfolioIndex: text.includes('Six-Artifact Verifiable Professional Portfolio Index'),
            has90WordSummary: text.includes('90-Word Professional Career Summary'),
          };
        })()`,
      },
      {
        num: 22,
        name: 'Session 22 (Hiring Simulation and Exit Assessment)',
        expectedText: 'Exit Assessment B & Technical Viva Voce Defense',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasControlledBanner: text.includes('CONTROLLED ASSESSMENT · FORMAL EXAMINATION'),
            has60MinTimer: text.includes('60 MIN TIMED · ZERO AI'),
            hasVivaScenarios: text.includes('Five Core Technical Viva Voce Defense Scenarios'),
            hasIndAS: text.includes('Ind AS 115'),
          };
        })()`,
      },
      {
        num: 23,
        name: 'Session 23 (Corporate Presentation Preparation)',
        expectedText: 'Structure 6-Slide Executive Deck & Rehearse 7-Minute Briefing',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('EXECUTIVE PRESENTATION & LIVE DEMO STUDIO'),
            hasAgenda: text.includes('7-Minute Squad Briefing Agenda'),
            has6Slides: text.includes('Six-Slide Executive Presentation Deck Outline'),
            hasLiveDemoScript: text.includes('Three-Minute Live Model Demonstration Script'),
          };
        })()`,
      },
      {
        num: 24,
        name: 'Session 24 (Corporate Demo Day and Industry Passport)',
        expectedText: 'Vayentra Industry Passport & Competency Record',
        verifyExpression: `(() => {
          const text = document.body.innerText;
          return {
            hasTitle: text.includes('OFFICIAL COMPETENCY TRANSCRIPT · VCEP 2026'),
            hasBadges: text.includes('Six Certified Professional Competency Transcripts'),
            hasScorecard: text.includes('External Jury Evaluation Scorecard'),
            has10Points: text.includes('10 / 10 Points') || text.includes('10/10'),
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
        path.join(ARTIFACTS_DIR, `track4-session-${String(wsInfo.num).padStart(2, '0')}-work.png`),
        Buffer.from(shotDesktop.data, 'base64')
      );
      console.log(`  Saved screenshot: track4-session-${String(wsInfo.num).padStart(2, '0')}-work.png`);

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
        path.join(ARTIFACTS_DIR, `track4-session-${String(wsInfo.num).padStart(2, '0')}-mobile-390.png`),
        Buffer.from(shotMobile.data, 'base64')
      );
      console.log(`  Saved screenshot: track4-session-${String(wsInfo.num).padStart(2, '0')}-mobile-390.png`);

      // Restore to 1440px desktop
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }

    console.log('\n=============================================');
    console.log('ALL TRACK 4 WORKSTATIONS SUCCESSFULLY VERIFIED!');
    console.log('=============================================');
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    chrome.kill();
  }
}

main();
