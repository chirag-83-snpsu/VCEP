import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9248;
const BASE_URL = 'http://127.0.0.1:5173';

async function run() {
  console.log('--- STARTING PHASE 5: AUDIT GUIDED LEARNING SESSIONS 02 TO 24 ---');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

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

    // Collect console logs and errors
    const consoleErrors = [];
    ws.addEventListener('message', (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        if (parsed.method === 'Runtime.consoleAPICalled' && parsed.params.type === 'error') {
          consoleErrors.push(parsed.params.args.map(a => a.value || a.description).join(' '));
        }
      } catch {}
    });

    // Set authenticated cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    // Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const results = [];

    // Loop through sessions 2 to 24
    for (let sid = 2; sid <= 24; sid++) {
      process.stdout.write(`Auditing Session ${String(sid).padStart(2, '0')}... `);

      // Check Work tab directly
      await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=${sid}&section=Work` });
      await new Promise((r) => setTimeout(r, 600));

      const workAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const text = document.body.innerText;
          const hasTitle = text.includes('VCEP') && !text.includes('Loading session');
          const hasError = text.includes('Could not connect') || text.includes('Sign In to Access') || text.includes('Internal Server Error');
          const downloadButtons = Array.from(document.querySelectorAll('button, a')).filter(b =>
            b.textContent.toLowerCase().includes('download') && (b.textContent.toLowerCase().includes('answer') || b.textContent.toLowerCase().includes('word') || b.textContent.toLowerCase().includes('csv'))
          );
          const hasInputs = document.querySelectorAll('input, textarea, select, table').length > 0;
          const hasNavTabs = document.querySelectorAll('.v3-tabs button').length === 6;

          return {
            hasTitle,
            hasError,
            downloadButtonsCount: downloadButtons.length,
            hasInputs,
            hasNavTabs,
            textExcerpt: text.substring(0, 150).replace(/\\n/g, ' ')
          };
        })()`,
        returnByValue: true,
      });

      const auditData = workAudit.result.value;

      if (auditData.hasError || !auditData.hasTitle || !auditData.hasInputs || auditData.downloadButtonsCount > 0) {
        console.log(`❌ FAILED`);
        console.error(`Session ${sid} failed:`, auditData);
        results.push({ session: sid, status: 'FAILED', details: auditData });
      } else {
        console.log(`✓ PASS`);
        results.push({ session: sid, status: 'PASSED' });
      }

      // Capture screenshot for key milestone sessions
      if ([2, 5, 7, 12, 18, 22, 24].includes(sid)) {
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(ART_DIR, `qa-audit-session${String(sid).padStart(2, '0')}-workstation.png`), Buffer.from(shot.data, 'base64'));
      }
    }

    // Now test Review tab for session 02 and 24
    console.log('\nTesting Review tab functionality for Sessions 02 & 24...');
    for (const sid of [2, 24]) {
      await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=${sid}&section=Review` });
      await new Promise((r) => setTimeout(r, 800));

      const reviewAudit = await send('Runtime.evaluate', {
        expression: `(() => {
          const text = document.body.innerText;
          return {
            hasRubric: text.includes('Rubric') || text.includes('Assessment Rubric') || text.includes('Points'),
            hasSavedWork: text.includes('My Saved Work') || text.includes('My Work & Verification Dashboard'),
            hasEngineCard: text.includes('Formative Review Engine') || text.includes('Assessment Details'),
          };
        })()`,
        returnByValue: true,
      });

      console.log(`Session ${sid} Review Audit:`, reviewAudit.result.value);
      if (!reviewAudit.result.value.hasRubric || !reviewAudit.result.value.hasSavedWork) {
        throw new Error(`FAIL: Session ${sid} Review tab missing required rubric or saved work dashboard!`);
      }
    }

    console.log('\n======================================================');
    console.log(`PHASE 5 AUDIT COMPLETED: ${results.filter(r => r.status === 'PASSED').length}/23 SESSIONS PASSED!`);
    console.log(`Console Errors Recorded: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('======================================================');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Phase 5 Audit error:', err);
  process.exit(1);
});
