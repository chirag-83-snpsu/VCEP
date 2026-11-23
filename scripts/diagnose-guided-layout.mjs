import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9250;
const URL = 'http://127.0.0.1:5173/guided-learning?session=1';

async function run() {
  console.log('Launching headless Chrome to diagnose Guided Learning layout...');
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

    // Authenticate
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    // 1440x900 baseline at 100% zoom
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: URL });
    await new Promise((r) => setTimeout(r, 2500));

    // Capture initial screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'guided-learning-before-diagnosis-1440.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved guided-learning-before-diagnosis-1440.png');

    // Measure computed dimensions & bounding rects
    const diagnosis = await send('Runtime.evaluate', {
      expression: `(() => {
        const getInfo = (sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const comp = window.getComputedStyle(el);
          return {
            selector: sel,
            rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right },
            width: comp.width,
            maxWidth: comp.maxWidth,
            minWidth: comp.minWidth,
            margin: comp.margin,
            padding: comp.padding,
            overflow: comp.overflow,
            overflowX: comp.overflowX,
            display: comp.display,
            gridTemplateColumns: comp.gridTemplateColumns,
            transform: comp.transform
          };
        };

        const bodyRect = document.body.getBoundingClientRect();
        const htmlRect = document.documentElement.getBoundingClientRect();
        const docScrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;

        return {
          windowWidth,
          docScrollWidth,
          hasHorizontalScroll: docScrollWidth > windowWidth,
          htmlRect: { width: htmlRect.width, height: htmlRect.height },
          bodyRect: { width: bodyRect.width, height: bodyRect.height },
          root: getInfo('.v3-root'),
          header: getInfo('.v3-header'),
          shell: getInfo('.v3-shell'),
          sidebar: getInfo('.v3-sidebar'),
          main: getInfo('.v3-main'),
          topline: getInfo('.v3-topline'),
          content: getInfo('.v3-content'),
          startupContainer: getInfo('.vcep-startup-journey-container'),
          navHeader: getInfo('.vcep-journey-nav-header'),
          progressTrack: getInfo('.vcep-journey-progress-track'),
          stepBtns: Array.from(document.querySelectorAll('.vcep-journey-step-btn')).map(b => {
            const r = b.getBoundingClientRect();
            return { width: r.width, left: r.left, right: r.right };
          })
        };
      })()`,
      returnByValue: true,
    });

    console.log('--- COMPUTED LAYOUT DIAGNOSIS ---');
    console.log(JSON.stringify(diagnosis.result.value, null, 2));

  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Diagnosis error:', err);
  process.exit(1);
});
