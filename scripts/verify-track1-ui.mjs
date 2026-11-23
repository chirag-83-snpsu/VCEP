import { spawn } from 'node:child_process';

const PORT = 9285;
const BASE_URL = 'http://127.0.0.1:5173';
const SESSION_TOKEN = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';

async function main() {
  console.log('--- VERIFYING TRACK 1 (SESSIONS 01 TO 06) IN UI ---');

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
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

    // Check Session 02 Guided Learning
    console.log('Checking Session 02...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=2&section=Learn` });
    await new Promise((r) => setTimeout(r, 1500));

    const s02Info = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          title: document.title,
          hasNewConcept: text.includes('High-performing corporate teams run on clear ownership'),
          hasNewExample: text.includes('receipt matching for Batch A'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Session 02 Check:', s02Info.result.value);

    // Check Session 05 Guided Learning
    console.log('Checking Session 05...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=5&section=Learn` });
    await new Promise((r) => setTimeout(r, 1500));

    const s05Info = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          title: document.title,
          hasNewConcept: text.includes('every transaction impacts at least two accounts'),
          hasNewExample: text.includes('Debit Bank Account ₹8,000'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Session 05 Check:', s05Info.result.value);

    // Check Session 06 Guided Learning
    console.log('Checking Session 06...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=6&section=Learn` });
    await new Promise((r) => setTimeout(r, 1500));

    const s06Info = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          title: document.title,
          hasNewConcept: text.includes('total debits equal total credits'),
          hasNewExample: text.includes('advance collection from a customer is mistakenly credited to Revenue'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Session 06 Check:', s06Info.result.value);

    ws.close();
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

main().catch(console.error);
