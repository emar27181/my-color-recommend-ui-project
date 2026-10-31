import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const host = process.env.V2_SCREENSHOT_URL || 'http://127.0.0.1:4173';
const dir = 'docs/screenshots/v2';
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const views = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
];
const report = [];
try {
  for (const view of views) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
      deviceScaleFactor: 1,
    });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(host + '/v2', { waitUntil: 'networkidle' });
    await page.screenshot({ path: dir + '/' + view.name + '.png', fullPage: true, animations: 'disabled' });
    const state = await page.evaluate(() => ({
      title: document.title,
      screenWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      paletteHeading: Array.from(document.querySelectorAll('h2')).some(h => h.textContent?.includes('パレット')),
      swatches: document.querySelectorAll('[role=radio]').length,
    }));
    const result = { ...view, ...state, errors: pageErrors };
    report.push(result);
    if (state.scrollWidth > state.screenWidth + 1) {
      throw new Error(view.name + ': horizontal overflow ' + state.scrollWidth + ' > ' + state.screenWidth);
    }
    if (!state.paletteHeading || state.swatches < 5) {
      throw new Error(view.name + ': recommendation workspace missing');
    }
    if (pageErrors.length) throw new Error(view.name + ': ' + pageErrors.join('; '));
    await page.close();
  }
  // Capture a second mobile screenshot with the light theme enabled.
  const light = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await light.goto(host + '/v2', { waitUntil: 'networkidle' });
  await light.getByRole('button', { name: '外観を切り替える' }).click();
  await light.screenshot({ path: dir + '/mobile-light.png', fullPage: true, animations: 'disabled' });
  await light.close();
  await writeFile(dir + '/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
