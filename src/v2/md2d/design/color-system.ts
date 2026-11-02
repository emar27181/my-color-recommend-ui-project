/**
 * MD2D develop src/design/color-system.ts: color-harmony and tone registry.
 * This copy keeps the exact values and definitions used by MD2D.
 * V2 only: presentation documents/slide roles are intentionally excluded.
 */
export interface HarmonyTechnique {
  id: string;
  nameKey: string;
  hintKey: string;
  offsets: readonly number[];
}

export const HARMONY_TECHNIQUES: readonly HarmonyTechnique[] = [
  { id: "analogous", nameKey: "color.harmony.analogous", hintKey: "color.harmony.analogousHint", offsets: [0, 30, -30] },
  { id: "complementary", nameKey: "color.harmony.complementary", hintKey: "color.harmony.complementaryHint", offsets: [0, 180] },
  { id: "triadic", nameKey: "color.harmony.triadic", hintKey: "color.harmony.triadicHint", offsets: [0, 120, 240] },
  { id: "splitComplementary", nameKey: "color.harmony.splitComplementary", hintKey: "color.harmony.splitComplementaryHint", offsets: [0, 150, 210] },
  { id: "monochromatic", nameKey: "color.harmony.monochromatic", hintKey: "color.harmony.monochromaticHint", offsets: [0] },
  { id: "dominant", nameKey: "color.harmony.dominant", hintKey: "color.harmony.dominantHint", offsets: [0, 15, -15] },
];
export const harmonyOf = (id: string) => HARMONY_TECHNIQUES.find((h) => h.id === id);

/** 最初に見せる代表の技法（残りは「もっと見る」）。初心者に一度に多く見せない */

export interface ToneDef { id: string; nameKey: string; hintKey: string; lightness: number; chromaShare: number }
export const TONES: readonly ToneDef[] = [
  { id: "vivid", nameKey: "color.tone.vivid", hintKey: "color.tone.vividHint", lightness: 0.62, chromaShare: 1 },
  { id: "bright", nameKey: "color.tone.bright", hintKey: "color.tone.brightHint", lightness: 0.74, chromaShare: 0.85 },
  { id: "light", nameKey: "color.tone.light", hintKey: "color.tone.lightHint", lightness: 0.85, chromaShare: 0.55 },
  { id: "pale", nameKey: "color.tone.pale", hintKey: "color.tone.paleHint", lightness: 0.93, chromaShare: 0.3 },
  { id: "deep", nameKey: "color.tone.deep", hintKey: "color.tone.deepHint", lightness: 0.46, chromaShare: 0.9 },
  { id: "dark", nameKey: "color.tone.dark", hintKey: "color.tone.darkHint", lightness: 0.3, chromaShare: 0.6 },
  { id: "soft", nameKey: "color.tone.soft", hintKey: "color.tone.softHint", lightness: 0.7, chromaShare: 0.45 },
  { id: "dull", nameKey: "color.tone.dull", hintKey: "color.tone.dullHint", lightness: 0.52, chromaShare: 0.4 },
  { id: "grayish", nameKey: "color.tone.grayish", hintKey: "color.tone.grayishHint", lightness: 0.6, chromaShare: 0.18 },
];
/**
 * トーン表（2 軸の面）: 横 = あかるい → くらい（OKLCH の明るさ）、縦 = あざやか → しずか（その明るさ・色相で出せる最大の鮮やかさに対する割合）。
 * 名前のあるトーン（TONES）は、この表の見方を覚える入口（ビビッド / ソフト / ダル / ダーク）として並べる。
 */
export const TONE_GRID = { lightness: [0.92, 0.76, 0.58, 0.4], chromaShare: [1, 0.7, 0.4, 0.15] } as const;
/** 表の入口に並べる名前つきのトーン（TONES の id）。色の見本つきで、押すとこうなる、が先に見える */
export const TONE_GRID_PRESETS: readonly string[] = ["vivid", "soft", "dull", "dark"];

/** 文字と背景のコントラストの目安（WCAG の AAA 7:1 / AA 4.5:1）。◎ = good / ○ = ok / ▲ = それ未満 */


/** MD2D image palette sampling registry (same values as develop). */
export const IMAGE_PALETTE = {
  /** 代表色の数、間引いて読む最大の画素数、k-means の反復、最小の面積割合（これ未満の色は代表にしない） */
  colors: 5,
  maxSamples: 4000,
  iterations: 8,
  minShare: 0.02,
  /** 透明に近い画素は無視（アルファの下限 0–255） */
  minAlpha: 128,
} as const;

/** 画像からの配色の見せ方 */
