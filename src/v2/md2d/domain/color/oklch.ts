/** OKLCH（知覚的に均一な色空間。Ottosson 2020）と sRGB の変換。トーンの計算に使う。表示できない色は鮮やかさを下げて収める */
import { hexToRgb, rgbToHex } from "./index.ts";

export interface Oklch { l: number; c: number; h: number }

const toLinear = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const fromLinear = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function hexToOklch(hex: string): Oklch {
  const { r, g, b } = hexToRgb(hex);
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)] as const;
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(a, bb);
  return { l: L, c, h: c < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

function toLinearRgb({ l, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_, -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_, -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_];
}
const inGamut = (rgb: readonly number[]) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** sRGB に収まる最大の鮮やかさ（その明るさ・色相で） */
export function maxChroma(l: number, h: number): number {
  let lo = 0, hi = 0.4;
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(toLinearRgb({ l, c: mid, h }))) lo = mid; else hi = mid; }
  return lo;
}

/** 表示できない色は、明るさと色相を保って鮮やかさを下げる */
export function oklchToHex(color: Oklch): string {
  const l = Math.min(1, Math.max(0, color.l));
  const c = Math.min(color.c, maxChroma(l, color.h));
  const [r, g, b] = toLinearRgb({ l, c, h: color.h });
  return rgbToHex({ r: fromLinear(Math.max(0, Math.min(1, r))), g: fromLinear(Math.max(0, Math.min(1, g))), b: fromLinear(Math.max(0, Math.min(1, b))) });
}
