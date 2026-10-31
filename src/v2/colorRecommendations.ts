/** V2 adapter: MD2D harmony offsets + OKLCH tone functions.
 * No legacy chroma.js/Zustand recommendation code; research routes stay isolated.
 * Every hue and tone value comes from MD2D's design/color-system registry.
 */
import { HARMONY_TECHNIQUES } from './md2d/design/color-system';
import { hexToOklch } from './md2d/domain/color/oklch';
import { toneGrid, withHue } from './md2d/domain/color/tone';
import { normalizeHex } from './paletteExport';

export const V2_HARMONIES = HARMONY_TECHNIQUES;
export const V2_DEFAULT_HARMONY = HARMONY_TECHNIQUES.find(t => t.id === 'complementary')?.id ?? HARMONY_TECHNIQUES[0]!.id;

export function harmonyCandidates(baseColor: string, techniqueId: string): string[] {
  const base = normalizeHex(baseColor);
  const technique = HARMONY_TECHNIQUES.find(t => t.id === techniqueId);
  if (!base || !technique) return [];
  const hue = hexToOklch(base).h;
  return [...new Set(technique.offsets.map(offset =>
    offset === 0 ? base : '#' + withHue(base, hue + offset)
  ))];
}

export function toneCandidates(hex: string): { id: string; hex: string }[] {
  const base = normalizeHex(hex);
  if (!base) return [];
  return toneGrid(base).map(item => ({ id: item.tone.id, hex: '#' + item.hex }));
}
