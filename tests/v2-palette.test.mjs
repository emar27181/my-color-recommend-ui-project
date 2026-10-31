import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeHex, sanitizedPalette, addPaletteColor, movePaletteColor, createPaletteCanvas, PALETTE_SPEC } from '../src/v2/paletteExport.ts';
import { BREAKPOINTS } from '../src/v2/design/breakpoints.ts';

test('HEX normalization supports CSS hex and rejects invalid codes', () => {
  assert.equal(normalizeHex('#abC123'), '#ABC123');
  assert.equal(normalizeHex('abc'), '#AABBCC');
  assert.equal(normalizeHex('#1234'), null);
  assert.equal(normalizeHex('not-hex'), null);
});
test('palette is deduplicated, normalized and bounded', () => {
  const palette = sanitizedPalette(['#abcdef', 'ABCDEF', '#123', 'invalid', ...Array(20).fill('#000000')]);
  assert.deepEqual(palette, ['#ABCDEF', '#112233', '#000000']);
  assert.equal(addPaletteColor(palette, '#abcdef'), palette);
  assert.deepEqual(addPaletteColor(palette, '#FF0000'), [...palette, '#FF0000']);
  assert.equal(sanitizedPalette(Array.from({ length: 30 }, (_, i) => '#' + i.toString(16).padStart(6,'0'))).length, PALETTE_SPEC.maxColors);
});
test('move keeps original array intact and does not move outside bounds', () => {
  const palette = ['#FF0000', '#00FF00', '#0000FF'];
  assert.deepEqual(movePaletteColor(palette, 1, -1), ['#00FF00', '#FF0000', '#0000FF']);
  assert.deepEqual(movePaletteColor(palette, 0, -1), palette);
  assert.deepEqual(palette, ['#FF0000', '#00FF00', '#0000FF']);
});
test('eyedropper PNG is solid unmodified blocks with no margins or labels', () => {
  const fills = [];
  const context = {
    fillStyle: '',
    fillRect(x,y,w,h) { fills.push({ fill: this.fillStyle, x, y, w, h }); },
    fillText() { throw new Error('solid mode must not draw text'); },
  };
  const priorDocument = globalThis.document;
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => context }) };
  try {
    const canvas = createPaletteCanvas(['#AA1122','#33BB44'], 'solid');
    assert.equal(canvas.width, PALETTE_SPEC.exportCellWidth * 2);
    assert.equal(canvas.height, PALETTE_SPEC.exportSwatchHeight);
    assert.deepEqual(fills, [
      { fill: '#AA1122', x: 0, y: 0, w: PALETTE_SPEC.exportCellWidth, h: PALETTE_SPEC.exportSwatchHeight },
      { fill: '#33BB44', x: PALETTE_SPEC.exportCellWidth, y: 0, w: PALETTE_SPEC.exportCellWidth, h: PALETTE_SPEC.exportSwatchHeight },
    ]);
  } finally {
    globalThis.document = priorDocument;
  }
});
test('legacy route is retained and V2 route is independently mounted', () => {
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.match(main, /path="\/" element={<Layout><App \/><\/Layout>}/);
  assert.match(main, /path="\/v2" element={<PaletteV2Page \/>/);
  const nav = readFileSync(new URL('../src/components/NavigationMenu.tsx', import.meta.url), 'utf8');
  assert.match(nav, /to="\/v2"/);
  const v2 = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  assert.match(v2, /to="\/"/);
});
test('MD2D-inspired V2 icon registry is centralized', () => {
  const files = ['components.tsx', 'PaletteV2Page.tsx'];
  for (const file of files) {
    const body = readFileSync(new URL('../src/v2/' + file, import.meta.url), 'utf8');
    assert.ok(!body.includes("from 'lucide-react'"), 'direct Lucide import in ' + file);
  }
  const tokens = readFileSync(new URL('../src/v2/design/tokens.css', import.meta.url), 'utf8');
  for (let i=1;i<=7;i++) assert.ok(tokens.includes('--crv2-space-' + i), 'missing spacing token ' + i);
});

test('MD2D controls and breakpoints have one source of truth', () => {
  const page = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /<(button|input|select)\b/, 'raw inputs belong in atoms');
  const css = readFileSync(new URL('../src/v2/design/tokens.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /@media/, 'media rules belong in breakpoints.css');
  const media = readFileSync(new URL('../src/v2/design/breakpoints.css', import.meta.url), 'utf8');
  assert.ok(media.includes('(max-width: ' + BREAKPOINTS.phoneMax + 'px)'));
  assert.ok(media.includes('(max-width: ' + BREAKPOINTS.tabletMax + 'px)'));
});
