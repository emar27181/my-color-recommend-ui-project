import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeHex, sanitizedPalette, addPaletteColor, movePaletteColor, createPaletteCanvas, PALETTE_SPEC } from '../src/v2/paletteExport.ts';
import { BREAKPOINTS } from '../src/v2/design/breakpoints.ts';
import { COLOR_ROUTES, PRESERVED_RESEARCH_HOSTS, landingVersion } from '../src/routing/landing.ts';
import { COLOR_PICKER, hslPickerHex, pickerHueOf } from '../src/v2/md2d/design/color-picker.ts';
import { HARMONY_TECHNIQUES, TONES } from '../src/v2/md2d/design/color-system.ts';
import { hexToOklch, oklchToHex } from '../src/v2/md2d/domain/color/oklch.ts';
import { harmonyCandidates, toneCandidates, V2_HARMONIES } from '../src/v2/colorRecommendations.ts';
import { extractPalette } from '../src/v2/md2d/domain/color/imagePalette.ts';
import { IMAGE_PALETTE } from '../src/v2/md2d/design/color-system.ts';

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
    assert.equal(canvas.width, PALETTE_SPEC.exportTileSize * 2);
    assert.equal(canvas.height, PALETTE_SPEC.exportTileSize);
    assert.deepEqual(fills, [
      { fill: '#AA1122', x: 0, y: 0, w: PALETTE_SPEC.exportTileSize, h: PALETTE_SPEC.exportTileSize },
      { fill: '#33BB44', x: PALETTE_SPEC.exportTileSize, y: 0, w: PALETTE_SPEC.exportTileSize, h: PALETTE_SPEC.exportTileSize },
    ]);
  } finally {
    globalThis.document = priorDocument;
  }
});
test('V2 is default / while the original research URL keeps V1', () => {
  assert.equal(COLOR_ROUTES.home, '/');
  assert.equal(COLOR_ROUTES.v2, '/v2');
  assert.equal(COLOR_ROUTES.classic, '/classic');
  assert.equal(COLOR_ROUTES.v1, '/v1');
  assert.equal(COLOR_ROUTES.experiment, '/experiment');
  assert.deepEqual([...PRESERVED_RESEARCH_HOSTS], ['color-recommend.netlify.app']);
  assert.equal(landingVersion('color-recommend.netlify.app'), 'classic');
  assert.equal(landingVersion('COLOR-RECOMMEND.NETLIFY.APP.'), 'classic');
  assert.equal(landingVersion('www.color-recommend.netlify.app'), 'v2');
  assert.equal(landingVersion('fakecolor-recommend.netlify.app'), 'v2');
  assert.equal(landingVersion('localhost'), 'v2');
  assert.equal(landingVersion('preview.pages.dev'), 'v2');
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.match(main, /path={COLOR_ROUTES.home}/);
  assert.match(main, /landingVersion\(window.location.hostname\)/);
  assert.match(main, /path={COLOR_ROUTES.classic} element={<Layout><App \/><\/Layout>}/);
  assert.match(main, /path={COLOR_ROUTES.v1} element={<Layout><App \/><\/Layout>}/);
  assert.match(main, /path={COLOR_ROUTES.v2} element={<PaletteV2Page \/>/);
  for (const path of ['/experiment', '/experiment/task', '/experiment/survey/ui1', '/experiment/survey/ui2']) {
    assert.ok(main.includes('path="' + path + '"'), 'historic experiment link missing: ' + path);
  }
  const nav = readFileSync(new URL('../src/components/NavigationMenu.tsx', import.meta.url), 'utf8');
  assert.match(nav, /to="\/v2"/);
  const v2 = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  assert.match(v2, /to={COLOR_ROUTES.classic}/);
  assert.doesNotMatch(v2, /to="\/"/);
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
  assert.ok(media.includes('(max-width: ' + BREAKPOINTS.tinyPhoneMax + 'px)'));
  assert.ok(media.includes('(max-width: ' + BREAKPOINTS.tabletMax + 'px)'));
});

test('recommendation and saved palette share a square swatch atom', () => {
  const atoms = readFileSync(new URL('../src/v2/components.tsx', import.meta.url), 'utf8');
  const molecules = readFileSync(new URL('../src/v2/paletteComponents.tsx', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/v2/design/tokens.css', import.meta.url), 'utf8');
  assert.match(atoms, /export function SwatchSurface/);
  assert.match(atoms, /<SwatchSurface color={hex} checked={checked}/);
  assert.match(molecules, /<SwatchSurface color={color}/);
  assert.match(molecules, /<SwatchButton hex={color}/);
  assert.match(page, /<RecommendationColorTile /);
  assert.match(page, /<PaletteColorCard /);
  assert.doesNotMatch(page, /crv2-palette-strip/, 'no duplicate non-square strip');
  assert.match(css, /\.crv2-swatch-surface\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/s);
  assert.match(css, /\.crv2-palette-list\s*\{[^}]*grid-template-columns:/s);
  assert.ok(!css.includes('--crv2-palette-height:'), 'remove stale fixed palette height');
  assert.equal(PALETTE_SPEC.exportTileSize, 180);
});

test('compact UI uses shared design tokens for grid, icon radii and interaction sizes', () => {
  const css = readFileSync(new URL('../src/v2/design/tokens.css', import.meta.url), 'utf8');
  const media = readFileSync(new URL('../src/v2/design/breakpoints.css', import.meta.url), 'utf8');
  const atoms = readFileSync(new URL('../src/v2/components.tsx', import.meta.url), 'utf8');
  const molecule = readFileSync(new URL('../src/v2/paletteComponents.tsx', import.meta.url), 'utf8');
  const icons = readFileSync(new URL('../src/v2/design/icons.ts', import.meta.url), 'utf8');
  assert.match(css, /--crv2-swatch-columns:\s*4/);
  assert.match(css, /--crv2-swatch-columns-tiny:\s*3/);
  assert.match(css, /--crv2-palette-mobile-columns:\s*3/);
  assert.match(media, /repeat\(var\(--crv2-palette-mobile-columns\)/);
  assert.match(css, /repeat\(var\(--crv2-swatch-columns\)/);
  assert.match(media, /--crv2-swatch-columns:\s*var\(--crv2-swatch-columns-tiny\)/);
  assert.match(css, /--crv2-radius-icon-button:\s*var\(--crv2-radius-control\)/);
  assert.match(css, /--crv2-radius-swatch:\s*var\(--crv2-radius-control\)/);
  assert.match(css, /--crv2-radius-palette-card:\s*var\(--crv2-radius-card\)/);
  assert.match(css, /\.crv2-iconbtn\s*\{[^}]*border-radius:\s*var\(--crv2-radius-icon-button\)/s);
  assert.match(css, /\.crv2-swatch-surface\s*\{[^}]*border-radius:\s*var\(--crv2-radius-swatch\)/s);
  for (const line of css.split('\n').filter(line => /\bborder-radius\s*:/.test(line))) {
    assert.match(line, /border-radius:\s*var\(--crv2-/, 'no literal border radius allowed: ' + line.trim());
  }
  assert.match(atoms, /export function IconMenu/);
  assert.match(molecule, /<IconMenu /);
  assert.match(icons, /more:\s*Ellipsis/);
  assert.doesNotMatch(molecule, /icon="moveUp"|icon="moveDown"/, 'semantic left/right icons are required');
});

test('V2 uses MD2D native-free ColorPicker, not the legacy UI/store', () => {
  const page = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  const molecule = readFileSync(new URL('../src/v2/ColorPicker.tsx', import.meta.url), 'utf8');
  const atoms = readFileSync(new URL('../src/v2/components.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/v2/design/tokens.css', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /useColorStore|COLOR_SCHEMES|recommendedTones.*colorStore/);
  assert.match(page, /<ColorPicker /);
  assert.doesNotMatch(atoms + molecule, /type="color"|type='color'/);
  assert.match(molecule, /COLOR_PICKER, hslPickerHex, pickerHueOf/);
  assert.match(css, /\.crv2-color-input, \.crv2-picker-preview\s*\{[^}]*border-radius:\s*var\(--crv2-radius-control\)/s);
  assert.match(css, /\.crv2-color-dialog\s*\{[^}]*border-radius:\s*var\(--crv2-radius-card\)/s);
});
test('MD2D picker presets and conversion are used directly', () => {
  assert.equal(COLOR_PICKER.hues.length, 12);
  assert.equal(COLOR_PICKER.tones.length, 6);
  assert.equal(COLOR_PICKER.neutral.length, 6);
  assert.equal(hslPickerHex(0, 1, 0.5), 'FF0000');
  assert.equal(pickerHueOf('#FF0000'), 0);
  assert.equal(pickerHueOf('#00FF00'), 120);
});
test('MD2D OKLCH and registry are V2 recommendation single source of truth', () => {
  assert.equal(V2_HARMONIES, HARMONY_TECHNIQUES);
  assert.equal(TONES.length, 9);
  const base = '#B51A00';
  const chroma = hexToOklch(base);
  assert.ok(chroma.c > 0);
  const roundtrip = oklchToHex(chroma);
  const rgb = (hex) => [1,3,5].map(i => parseInt(hex.replace('#','').slice(i-1,i+1), 16));
  const a = rgb(base), b = rgb(roundtrip);
  assert.ok(a.every((v,i)=>Math.abs(v-b[i]) <= 1), 'OKLCH roundtrip differs from source');
  const complement = HARMONY_TECHNIQUES.find(t=>t.id==='complementary');
  const hues = harmonyCandidates(base, complement.id);
  assert.equal(hues.length, complement.offsets.length);
  assert.equal(hues[0], base);
  assert.equal(harmonyCandidates(base, 'nonexistent').length, 0);
  const tones = toneCandidates(base);
  assert.equal(tones.length, TONES.length);
  assert.deepEqual(tones.map(t=>t.id), TONES.map(t=>t.id));
  assert.ok(tones.every(t=>/^#[0-9A-F]{6}$/.test(t.hex)));
  assert.equal(toneCandidates('invalid').length, 0);
});

test('V2 image extraction delegates to MD2D OKLab k-means and ignores transparent pixels', () => {
  const page = readFileSync(new URL('../src/v2/PaletteV2Page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /@\/lib\/colorExtractor|extractColorsFromImage|useColorStore/);
  assert.match(page, /extractImageColors\(file\)/);
  const transparent = new Uint8Array(4 * IMAGE_PALETTE.colors);
  assert.deepEqual(extractPalette(transparent), []);
  const red = new Uint8Array(Array(20).fill([255,0,0,255]).flat());
  const results = extractPalette(red);
  assert.equal(results.length, 1);
  assert.equal(results[0].share, 1);
  assert.ok(/^([A-F0-9]{6})$/.test(results[0].hex));
  assert.ok(parseInt(results[0].hex.slice(0,2),16) >= 254);
  assert.ok(parseInt(results[0].hex.slice(2,4),16) <= 1);
  assert.ok(parseInt(results[0].hex.slice(4,6),16) <= 1);
});
