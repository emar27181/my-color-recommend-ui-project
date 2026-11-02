import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const url = 'https://color-recommend.netlify.app';
const paths = ['/', '/v2', '/classic', '/experiment'];
const dir = 'diagnostics/production';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];
try {
  for (const path of paths) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    const failed = [];
    const consoleErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', req => failed.push({ url: req.url(), failure: req.failure()?.errorText }));
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    const response = await page.goto(url + path, { waitUntil: 'networkidle', timeout: 25000 }).catch(e => {
      errors.push('navigation failed: ' + e.message); return null;
    });
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => ({
      rootChildren: document.querySelector('#root')?.children.length ?? -1,
      rootTextLength: document.querySelector('#root')?.textContent?.trim().length ?? 0,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      activeV2: Boolean(document.querySelector('.cr-v2')),
      title: document.title,
      loadedScripts: [...document.scripts].map(x => x.src).filter(Boolean),
    }));
    const name = path === '/' ? 'home' : path.slice(1);
    await page.screenshot({ path: dir + '/' + name + '.png', fullPage: true });
    report.push({ url: url + path, httpStatus: response?.status() ?? null, ...state,
      errors: errors.slice(0, 12), requestFailures: failed.slice(0, 12), consoleErrors: consoleErrors.slice(0, 12) });
    await page.close();
  }
  await writeFile(dir + '/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log('PRODUCTION BROWSER REPORT:\n' + JSON.stringify(report, null, 2));
} finally { await browser.close(); }
