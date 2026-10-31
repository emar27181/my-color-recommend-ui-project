import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { PALETTE_SPEC } from '../src/v2/paletteExport.ts';

const host = process.env.V2_SCREENSHOT_URL || 'http://127.0.0.1:4173';
const dir = 'docs/screenshots/v2';
await mkdir(dir, { recursive: true });
const fixture = JSON.parse(await readFile(new URL('../tests/fixtures/v2-palette.json', import.meta.url), 'utf8'));
const palette = fixture.colors;

const browser = await chromium.launch({ headless: true });
const views = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-small', width: 320, height: 740 },
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
    // Preview fixture uses V2's canonical storage key; it is not an application default.
    await page.addInitScript(({ key, colors }) => localStorage.setItem(key, JSON.stringify(colors)),
      { key: PALETTE_SPEC.storageKey, colors: palette });
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
    }));
    const swatchBoxes = await page.locator('.crv2-swatch-surface').evaluateAll(nodes =>
      nodes.map(node => {
        const { width, height } = node.getBoundingClientRect();
        return { width, height };
      }));
    const paletteCards = await page.locator('.crv2-palette-card').count();
    const paletteColumns = await page.locator('.crv2-palette-list').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length);
    const result = { ...view, ...state, footerVisible,
      squareSwatches: swatchBoxes.length, paletteCards, paletteColumns, errors: pageErrors };
    report.push(result);
    if (state.scrollWidth > state.screenWidth + 1) {
      throw new Error(view.name + ': horizontal overflow ' + state.scrollWidth + ' > ' + state.screenWidth);
    }
    if (!footerVisible) {
      throw new Error(view.name + ': footer clipped or unreachable');
    }
    if (state.surfaceHeight < state.documentHeight - 3) {
      throw new Error(view.name + ': V2 background shorter than document (' + state.surfaceHeight + ' < ' + state.documentHeight + ')');
    }
    if (['mobile', 'mobile-small'].includes(view.name) && paletteColumns < 3) {
      throw new Error(view.name + ': compact palette requires at least three square cards per row');
    }
    if (paletteCards !== palette.length) {
      throw new Error(view.name + ': saved palette fixture missing');
    }
    if (swatchBoxes.length < 5 || swatchBoxes.some(({ width, height }) => Math.abs(width - height) > 1)) {
      throw new Error(view.name + ': a recommended or saved swatch is not square');
    }
    if (!state.paletteHeading || state.swatches < 5) {
      throw new Error(view.name + ': recommendation workspace missing');
    }
    if (pageErrors.length) throw new Error(view.name + ': ' + pageErrors.join('; '));

    // Actions are hidden by default and revealed with a single MD2D-style icon menu.
    const menu = page.locator('.crv2-palette-card .crv2-icon-menu').first();
    if (await menu.getAttribute('open') !== null) throw new Error('palette menu must start collapsed');
    await menu.locator('summary').click();
    const actionButtons = menu.locator('.crv2-palette-actions .crv2-iconbtn');
    if (await actionButtons.count() !== 3) throw new Error('palette actions are missing');
    const menuContained = await menu.evaluate(el => {
      const card = el.closest('.crv2-palette-card')?.getBoundingClientRect();
      const panel = el.querySelector('.crv2-icon-menu__panel')?.getBoundingClientRect();
      return Boolean(card && panel && panel.left >= card.left - 1 && panel.right <= card.right + 1 && panel.bottom <= card.bottom + 1);
    });
    if (!menuContained) throw new Error(view.name + ': action menu overlaps other swatches');
    const radius = await page.evaluate(() => ({
      icon: getComputedStyle(document.querySelector('.crv2-iconbtn')).borderRadius,
      trigger: getComputedStyle(document.querySelector('.crv2-icon-menu__trigger')).borderRadius,
      swatch: getComputedStyle(document.querySelector('.crv2-palette-card .crv2-swatch-surface')).borderRadius,
      card: getComputedStyle(document.querySelector('.crv2-palette-card')).borderRadius,
    }));
    if (radius.icon !== radius.trigger || radius.icon !== radius.swatch)
      throw new Error(view.name + ': icon, menu and swatch radius tokens diverged');
    if (radius.card === radius.icon) throw new Error('card and control roles must differ');
    if (view.width <= 760) {
      const heights = await actionButtons.evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().height));
      if (heights.some(h => h < 44)) throw new Error(view.name + ': menu touch targets below 44px');
    }
    if (view.name === 'mobile') {
      await page.screenshot({ path: dir + '/mobile-actions.png', fullPage: true, animations: 'disabled' });
    }
    await menu.locator('summary').click();
    // MD2D custom picker: no browser native color dialog. It opens a consistent
    // hue/tone/neutral selector and shares the control radius from tokens.
    if (await page.locator('input[type="color"]').count() !== 0) {
      throw new Error(view.name + ': native color input must not be rendered');
    }
    const pickerButton = page.getByRole('button', { name: '色相・トーン・HEXを調整' });
    const field = page.locator('.crv2-picker-row .crv2-textfield').first();
    const oldHex = await field.inputValue();
    await pickerButton.click();
    const picker = page.locator('dialog.crv2-color-dialog');
    if (!await picker.isVisible()) throw new Error(view.name + ': MD2D custom ColorPicker did not open');
    if (await picker.locator('[role="radio"]').count() !== 24)
      throw new Error(view.name + ': MD2D hue/tone/neutral preset registry mismatch');
    const pickerRadius = await picker.evaluate(el => ({
      dialog: getComputedStyle(el).borderRadius,
      input: getComputedStyle(document.querySelector('.crv2-color-input')).borderRadius,
      tile: getComputedStyle(document.querySelector('.crv2-swatch-surface')).borderRadius,
    }));
    if (pickerRadius.input !== pickerRadius.tile)
      throw new Error(view.name + ': native base color and swatches have divergent corner radii');
    await picker.locator('.crv2-picker-section').first().locator('[role="radio"]').nth(4).click();
    if (await field.inputValue() === oldHex)
      throw new Error(view.name + ': MD2D hue selection did not update base hex');
    if (view.name === 'mobile' || view.name === 'desktop') {
      await page.screenshot({ path: dir + '/' + view.name + '-picker.png', animations: 'disabled' });
    }
    await picker.getByRole('button', { name: '閉じる' }).click();
    if (await picker.isVisible()) throw new Error(view.name + ': custom picker did not close');
    await page.close();
  }
  // Capture a second mobile screenshot with the light theme enabled.
  const light = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await light.addInitScript(({ key, colors }) => localStorage.setItem(key, JSON.stringify(colors)),
    { key: PALETTE_SPEC.storageKey, colors: palette });
  await light.goto(host + '/v2', { waitUntil: 'networkidle' });
  await light.getByRole('button', { name: '外観を切り替える' }).click();
  await light.screenshot({ path: dir + '/mobile-light.png', fullPage: true, animations: 'disabled' });
  await light.close();
  await writeFile(dir + '/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
