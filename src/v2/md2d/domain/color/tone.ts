/** トーン（明るさ・鮮やかさ）の候補（純粋関数）。同じ色相で、トーン登録簿の各段の色を作る。表示できない色は鮮やかさを下げて収める */
import { TONES, TONE_GRID, type ToneDef } from "../../design/color-system.ts";
import { hexToOklch, maxChroma, oklchToHex } from "./oklch.ts";

export interface ToneCell { tone: ToneDef; hex: string }

export function toneGrid(hex: string, hueOverride?: number): ToneCell[] {
  const o = hexToOklch(hex);
  const h = hueOverride ?? o.h;
  return TONES.map((tone) => ({ tone, hex: oklchToHex({ l: tone.lightness, c: maxChroma(tone.lightness, h) * tone.chromaShare, h }) }));
}

/** 今の色にいちばん近いトーン（明るさと鮮やかさの割合の距離） */
export function nearestTone(hex: string): ToneDef {
  const o = hexToOklch(hex);
  let best = TONES[0]!, bestD = Infinity;
  for (const t of TONES) {
    const share = o.c / Math.max(1e-4, maxChroma(o.l, o.h));
    const d = (o.l - t.lightness) ** 2 + (share - t.chromaShare) ** 2;
    if (d < bestD) { best = t; bestD = d; }
  }
  return best;
}

/** 色相だけを変える（明るさと鮮やかさは保つ。表示できなければ鮮やかさを下げる。ほぼ無彩色は少しだけ色を付ける） */
export function withHue(hex: string, hue: number): string {
  const o = hexToOklch(hex);
  const h = ((hue % 360) + 360) % 360;
  // 白・黒に近い色は、そのままでは色を付けられない（鮮やかさの上限が 0）。少しだけ明るさを譲って、色相の変更に反応させる
  const l = o.c < MIN_TINT ? Math.min(0.96, Math.max(0.15, o.l)) : o.l;
  return oklchToHex({ l, c: Math.min(maxChroma(l, h), Math.max(o.c, MIN_TINT)), h });
}
const MIN_TINT = 0.04;

export interface ToneMatrixCell { hex: string; lightness: number; chromaShare: number; current: boolean }

/** トーン表（行 = あざやか → しずか、列 = あかるい → くらい）。色相は今の色のまま（指定があればそれ）。今の色にいちばん近い 1 マスに current を付ける */
export function toneMatrix(hex: string, hueOverride?: number): ToneMatrixCell[][] {
  const o = hexToOklch(hex);
  const h = hueOverride ?? o.h;
  const share = o.c / Math.max(1e-4, maxChroma(o.l, o.h));
  const nearest = (v: number, list: readonly number[]) => list.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b), list[0]!);
  const curL = nearest(o.l, TONE_GRID.lightness), curS = nearest(share, TONE_GRID.chromaShare);
  return TONE_GRID.chromaShare.map((s) => TONE_GRID.lightness.map((l) => ({
    hex: oklchToHex({ l, c: maxChroma(l, h) * s, h }), lightness: l, chromaShare: s, current: l === curL && s === curS,
  })));
}
