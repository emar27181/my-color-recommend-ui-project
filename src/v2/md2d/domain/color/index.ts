/** Unmodified MD2D HEX/RGB conversion core; copied from src/domain/color/index.ts. */
export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const HEX6 = /^#?([0-9a-fA-F]{6})$/;

export function normalizeHex(input: string): string | null {
  const m = HEX6.exec(input.trim());
  return m ? m[1]!.toUpperCase() : null;
}

export function hexToRgb(hex: string): Rgb {
  const n = normalizeHex(hex);
  if (!n) throw new Error(`invalid hex: ${hex}`);
  return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}

