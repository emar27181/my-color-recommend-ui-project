/** MD2D専用カラーピッカーの表示プリセット。UIの色や段階をこの一箇所で管理する。
 * 色の保存形式は従来どおり6桁HEX。選択肢にない色もHEX入力で指定できる。
 */
export const COLOR_PICKER = {
  hues: Array.from({ length: 12 }, (_, i) => i * 30),
  tones: [
    { id: "deep", saturation: 0.85, lightness: 0.29 },
    { id: "dark", saturation: 0.72, lightness: 0.40 },
    { id: "vivid", saturation: 0.92, lightness: 0.53 },
    { id: "bright", saturation: 0.80, lightness: 0.65 },
    { id: "soft", saturation: 0.52, lightness: 0.72 },
    { id: "pale", saturation: 0.34, lightness: 0.86 },
  ],
  neutral: ["000000", "333333", "666666", "999999", "CCCCCC", "FFFFFF"],
  defaultSaturation: 0.85,
  defaultLightness: 0.53,
} as const;

/** HSLはUIの見本色作成専用。スライド配色・推薦のOKLCHの計算を変更しない。 */
export function hslPickerHex(hue: number, saturation: number, lightness: number): string {
  const h = ((hue % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lightness - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** 開いた瞬間、現在の色に最も近い色相を示す。灰色では既定の色相を使う。 */
export function pickerHueOf(hex: string): number {
  const s = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return 0;
  const r = parseInt(s.slice(0, 2), 16) / 255;
  const g = parseInt(s.slice(2, 4), 16) / 255;
  const b = parseInt(s.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  const hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  const angle = (60 * hue + 360) % 360;
  return COLOR_PICKER.hues.reduce((best, current) => {
    const distance = (h: number) => Math.min(Math.abs(h - angle), 360 - Math.abs(h - angle));
    return distance(current) < distance(best) ? current : best;
  }, COLOR_PICKER.hues[0] ?? 0);
}
