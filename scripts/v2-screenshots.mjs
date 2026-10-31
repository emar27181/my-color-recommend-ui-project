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
    // Confirm the last panel and footer are actually reachable, not merely present in the DOM.
    await page.locator('.crv2-footer').scrollIntoViewIfNeeded();
    const footerVisible = await page.locator('.crv2-footer').evaluate(element => {
      const rect = element.getBoundingClientRect();
      return rect.top >= -1 && rect.bottom <= window.innerHeight + 1;
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: dir + '/' + view.name + '.png', fullPage: true, animations: 'disabled' });
    const state = await page.evaluate(() => ({
      title: document.title,
      screenWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      paletteHeading: Array.from(document.querySelectorAll('h2')).some(h => h.textContent?.includes('パレット')),
      swatches: document.querySelectorAll('[role=radio]').length,
      rootHeight: Math.round(document.querySelector('#root')?.getBoundingClientRect().height || 0),
      surfaceHeight: Math.round(document.querySelector('.cr-v2')?.getBoundingClientRect().height || 0),
      documentHeight: document.documentElement.scrollHeight,
      footerVisible,
    }));
    const result = { ...view, ...state, errors: pageErrors };
    report.push(result);
    if (state.scrollWidth > state.screenWidth + 1) {
      throw new Error(view.name + ': horizontal overflow ' + state.scrollWidth + ' > ' + state.screenWidth);
    }
    if (!state.footerVisible) {
      throw new Error(view.name + ': footer clipped or unreachable');
    }
    if (state.surfaceHeight < state.documentHeight - 3) {
      throw new Error(view.name + ': V2 background shorter than document (' + state.surfaceHeight + ' < ' + state.documentHeight + ')');
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
