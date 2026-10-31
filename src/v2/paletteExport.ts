/**
 * V2 のパレットドメインと画像出力アダプタ。
 * MD2D の domain / browser API 分離を踏襲し、配色計算と export を混ぜない。
 */
export type ExportMode = 'solid' | 'labeled';

export const PALETTE_SPEC = {
  maxColors: 12,
  defaultBaseColor: '#B51A00',
  maxImageBytes: 10 * 1024 * 1024,
  /** MD2D-inspired shape rule: every export swatch is square and pixel-exact. */
  exportTileSize: 180,
  exportLabelHeight: 64,
  exportFontSize: 18,
  filePrefix: 'color-recommendation',
  storageKey: 'color-recommendation:v2:palette',
  themeKey: 'color-recommendation:v2:theme',
} as const;

export function normalizeHex(input: string): string | null {
  const value = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return '#' + value.split('').map(c => c + c).join('').toUpperCase();
  }
  return /^[0-9a-fA-F]{6}$/.test(value) ? '#' + value.toUpperCase() : null;
}

export function sanitizedPalette(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const result: string[] = [];
  for (const candidate of value) {
    const hex = typeof candidate === 'string' ? normalizeHex(candidate) : null;
    if (hex && !result.includes(hex)) result.push(hex);
    if (result.length >= PALETTE_SPEC.maxColors) break;
  }
  return result;
}

export function addPaletteColor(colors: string[], value: string): string[] {
  const hex = normalizeHex(value);
  if (!hex || colors.includes(hex) || colors.length >= PALETTE_SPEC.maxColors) return colors;
  return [...colors, hex];
}

export function movePaletteColor(colors: string[], index: number, offset: number): string[] {
  const target = index + offset;
  if (index < 0 || index >= colors.length || target < 0 || target >= colors.length) return colors;
  const result = [...colors];
  [result[index], result[target]] = [result[target], result[index]];
  return result;
}

export function createPaletteCanvas(colors: string[], mode: ExportMode): HTMLCanvasElement {
  const palette = sanitizedPalette(colors);
  if (!palette.length) throw new Error('No colors to export');
  const width = PALETTE_SPEC.exportTileSize;
  const swatchHeight = PALETTE_SPEC.exportTileSize;
  const labelHeight = mode === 'labeled' ? PALETTE_SPEC.exportLabelHeight : 0;
  const canvas = document.createElement('canvas');
  canvas.width = palette.length * width;
  canvas.height = swatchHeight + labelHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');

  palette.forEach((hex, index) => {
    ctx.fillStyle = hex;
    ctx.fillRect(index * width, 0, width, swatchHeight);
  });
  if (mode === 'labeled') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, swatchHeight, canvas.width, labelHeight);
    ctx.fillStyle = '#0B1220';
    ctx.font = '500 ' + PALETTE_SPEC.exportFontSize + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    palette.forEach((hex, index) => ctx.fillText(hex, (index + 0.5) * width, swatchHeight + labelHeight / 2));
  }
  // 'solid': adjacent square blocks with no margins, text, rounding or alpha. HEX -> pixels stays exact.
  return canvas;
}

export function toPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('PNG encoding failed'));
    }, 'image/png');
  });
}

export async function downloadPalette(colors: string[], mode: ExportMode): Promise<void> {
  const blob = await toPngBlob(createPaletteCanvas(colors, mode));
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = PALETTE_SPEC.filePrefix + '-' + mode + '.png';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyPaletteImage(colors: string[], mode: ExportMode): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
    throw new Error('Image clipboard is not supported');
  }
  const blob = await toPngBlob(createPaletteCanvas(colors, mode));
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
