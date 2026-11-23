import { spawn } from 'node:child_process';

const PORT = 9254;
const BASE_URL = 'http://127.0.0.1:5173/guided-learning?session=1';

async function run() {
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

    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Testing Stages 1 through 6 for internal overflow at 1440px desktop...');
    for (let stage = 1; stage <= 6; stage++) {
      await send('Page.navigate', { url: `${BASE_URL}&stage=${stage}` });
      await new Promise((r) => setTimeout(r, 1500));

      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const all = Array.from(document.querySelectorAll('*'));
          const winW = window.innerWidth;
          const bad = [];
          for (const el of all) {
            const r = el.getBoundingClientRect();
            // Ignore the known track buttons for now to see if the inner stage content has anything else overflowing
            if (r.right > winW + 1 && !el.closest('.vcep-journey-progress-track')) {
              bad.push({
                tag: el.tagName,
                cls: String(el.className).substring(0, 40),
                right: Math.round(r.right),
                width: Math.round(r.width)
              });
            }
          }
          return {
            stage: ${stage},
            innerOverflowCount: bad.length,
            badSamples: bad.slice(0, 5)
          };
        })()`,
        returnByValue: true,
      });

      console.log(`Stage ${stage}: inner overflow elements outside progress-track = ${res.result.value.innerOverflowCount}`);
      if (res.result.value.innerOverflowCount > 0) {
        console.log('Samples:', res.result.value.badSamples);
      }
    }

  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
