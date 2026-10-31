/** Exact MD2D first-party OKLab k-means representative color extraction.
 * Source: emar27181/MD2D develop src/domain/color/imagePalette.ts
 * Slide palette roles are not part of the palette-recommendation UI.
 */
import { IMAGE_PALETTE as P } from '../../design/color-system.ts';
import { rgbToHex } from './index.ts';
import { hexToOklch, oklchToHex } from './oklch.ts';

export interface Swatch { hex: string; /** 画像に占める割合（0〜1） */ share: number }

/** 画素 → 代表色。OKLab で k-means（初期値は明るさ順の等間隔）。割合の小さい色は捨てる */
export function extractPalette(rgba: ArrayLike<number>): Swatch[] {
  const pts: [number, number, number][] = [];
  const total = Math.floor(rgba.length / 4);
  const step = Math.max(1, Math.floor(total / P.maxSamples));
  for (let i = 0; i < total; i += step) {
    if (rgba[i * 4 + 3]! < P.minAlpha) continue;
    const o = hexToOklch(rgbToHex({ r: rgba[i * 4]!, g: rgba[i * 4 + 1]!, b: rgba[i * 4 + 2]! }));
    pts.push([o.l, o.c * Math.cos((o.h * Math.PI) / 180), o.c * Math.sin((o.h * Math.PI) / 180)]);
  }
  if (pts.length === 0) return [];
  const sorted = [...pts].sort((a, b) => a[0] - b[0]);
  let centers = Array.from({ length: P.colors }, (_, i) => [...sorted[Math.min(sorted.length - 1, Math.floor(((i + 0.5) / P.colors) * sorted.length))]!] as [number, number, number]);
  let counts: number[] = [];
  for (let it = 0; it < P.iterations; it++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of pts) {
      let bi = 0, bd = Infinity;
      centers.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bd) { bd = d; bi = i; } });
      const s = sums[bi]!; s[0]! += p[0]; s[1]! += p[1]; s[2]! += p[2]; s[3]!++;
    }
    counts = sums.map((s) => s[3]!);
    centers = sums.map((s, i) => (s[3]! > 0 ? [s[0]! / s[3]!, s[1]! / s[3]!, s[2]! / s[3]!] : centers[i]!) as [number, number, number]);
  }
  return centers
    .map((c, i) => ({ hex: oklchToHex({ l: c[0], c: Math.hypot(c[1], c[2]), h: ((Math.atan2(c[2], c[1]) * 180) / Math.PI + 360) % 360 }), share: counts[i]! / pts.length }))
    .filter((s) => s.share >= P.minShare)
    .sort((a, b) => b.share - a.share);
}


