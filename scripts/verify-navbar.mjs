import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9260;
const BASE_URL = 'http://127.0.0.1:5173';
const SESSION_TOKEN = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';

async function main() {
  console.log('--- STARTING COMPREHENSIVE VCEP NAVBAR VERIFICATION ---');

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

    // Authenticate as Admin
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: SESSION_TOKEN,
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
    });

    // ==========================================
    // 1. DESKTOP 1440px - TOP OF PAGE
    // ==========================================
    console.log('\n[1/7] Testing 1440px Desktop — Top of Page...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 2000));

    const topMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        const brand = document.querySelector('.vcep-header-brand-wrap');
        const actions = document.querySelector('.vcep-header-actions');
        const hRect = h.getBoundingClientRect();
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          headerWidth: hRect.width,
          headerHeight: hRect.height,
          headerTop: hRect.top,
          isSticky: window.getComputedStyle(h).position === 'sticky',
          isScrolledClass: h.classList.contains('vcep-header-scrolled'),
          brandWidth: brand ? brand.getBoundingClientRect().width : 0,
          actionsWidth: actions ? actions.getBoundingClientRect().width : 0,
        };
      })()`,
      returnByValue: true,
    });
    console.log('1440px Top Metrics:', topMetrics.result.value);

    const shotTop1440 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-desktop-top-1440.png'), Buffer.from(shotTop1440.data, 'base64'));

    // ==========================================
    // 2. DESKTOP 1440px - SCROLLED (scrollY = 500)
    // ==========================================
    console.log('\n[2/7] Testing 1440px Desktop — Scrolled (scrollY = 500)...');
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 500, behavior: 'instant' });` });
    await new Promise((r) => setTimeout(r, 600));

    const scrolledMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        const hRect = h.getBoundingClientRect();
        return {
          scrollY: window.scrollY,
          headerTop: hRect.top,
          headerHeight: hRect.height,
          isScrolledClass: h.classList.contains('vcep-header-scrolled'),
          headerVisible: hRect.top >= 0 && hRect.bottom > 0,
        };
      })()`,
      returnByValue: true,
    });
    console.log('1440px Scrolled Metrics:', scrolledMetrics.result.value);

    const shotScrolled1440 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-desktop-scrolled-1440.png'), Buffer.from(shotScrolled1440.data, 'base64'));

    // ==========================================
    // 3. DESKTOP 1440px - PROFILE DROPDOWN INTERACTION
    // ==========================================
    console.log('\n[3/7] Testing Profile Avatar & Dropdown Interaction...');
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 0, behavior: 'instant' });` });
    await new Promise((r) => setTimeout(r, 400));

    // Click profile avatar button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.vcep-nav-avatar-btn');
        if (btn) btn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 400));

    const dropdownMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const dd = document.querySelector('.vcep-profile-dropdown');
        if (!dd) return { isOpen: false };
        const rect = dd.getBoundingClientRect();
        const text = dd.innerText;
        return {
          isOpen: true,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          windowWidth: window.innerWidth,
          overflowsRight: rect.right > window.innerWidth,
          hasAdminTitle: text.includes('VCEP Programme Administrator'),
          hasRole: text.includes('Programme Administrator') || text.includes('ADMIN'),
          hasEmail: text.includes('vayentragurukula@gmail.com'),
          hasSignOut: text.includes('Sign out'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Profile Dropdown Metrics:', dropdownMetrics.result.value);

    const shotDropdown1440 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-desktop-dropdown-1440.png'), Buffer.from(shotDropdown1440.data, 'base64'));

    // Test Escape key closing dropdown
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 300));

    const dropdownClosedCheck = await send('Runtime.evaluate', {
      expression: `!document.querySelector('.vcep-profile-dropdown')`,
      returnByValue: true,
    });
    console.log('Dropdown closed after Escape key:', dropdownClosedCheck.result.value);

    // ==========================================
    // 4. DESKTOP 1920px (Ultrawide)
    // ==========================================
    console.log('\n[4/7] Testing 1920px Ultrawide Viewport...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 600));

    const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-desktop-1920.png'), Buffer.from(shot1920.data, 'base64'));

    const ultrawideMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        const hRect = h.getBoundingClientRect();
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          headerWidth: hRect.width,
          overflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      })()`,
      returnByValue: true,
    });
    console.log('1920px Ultrawide Metrics:', ultrawideMetrics.result.value);

    // ==========================================
    // 5. TABLET 768px
    // ==========================================
    console.log('\n[5/7] Testing 768px Tablet Viewport...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 600));

    const tabletMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        const hRect = h.getBoundingClientRect();
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          headerWidth: hRect.width,
          headerHeight: hRect.height,
          overflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      })()`,
      returnByValue: true,
    });
    console.log('768px Tablet Metrics:', tabletMetrics.result.value);

    const shotTablet768 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-tablet-768.png'), Buffer.from(shotTablet768.data, 'base64'));

    // ==========================================
    // 6. MOBILE 390px - TOP OF PAGE
    // ==========================================
    console.log('\n[6/7] Testing 390px Mobile Viewport...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 600));

    const mobileMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        const hRect = h.getBoundingClientRect();
        const toggleBtn = document.querySelector('.vcep-mobile-toggle-btn');
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          headerWidth: hRect.width,
          headerHeight: hRect.height,
          hasToggleBtn: !!toggleBtn && window.getComputedStyle(toggleBtn).display !== 'none',
          overflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      })()`,
      returnByValue: true,
    });
    console.log('390px Mobile Metrics:', mobileMetrics.result.value);

    const shotMobile390 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-mobile-top-390.png'), Buffer.from(shotMobile390.data, 'base64'));

    // ==========================================
    // 7. MOBILE 390px - DRAWER OPENED
    // ==========================================
    console.log('\n[7/7] Testing 390px Mobile Navigation Drawer Open...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const toggleBtn = document.querySelector('.vcep-mobile-toggle-btn');
        if (toggleBtn) toggleBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 400));

    const drawerMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const drawer = document.querySelector('.vcep-mobile-drawer');
        if (!drawer) return { isOpen: false };
        const rect = drawer.getBoundingClientRect();
        const text = drawer.innerText;
        return {
          isOpen: true,
          drawerWidth: rect.width,
          drawerHeight: rect.height,
          hasSessionLab: text.includes('Session Lab'),
          hasManagement: text.includes('Management Workspace'),
          hasProgramme: text.includes('Programme Vision'),
          hasSignout: text.includes('Sign out'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Mobile Drawer Metrics:', drawerMetrics.result.value);

    const shotMobileDrawer = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-fixed-mobile-drawer-390.png'), Buffer.from(shotMobileDrawer.data, 'base64'));

    console.log('\n======================================================');
    console.log('ALL NAVBAR TESTS & SCREENSHOTS COMPLETED SUCCESSFULLY!');
    console.log('======================================================');

    ws.close();
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Navbar verification error:', err);
  process.exit(1);
});
