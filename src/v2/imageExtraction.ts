/** Browser adapter for MD2D OKLab k-means extraction.
 * The domain extraction and its color parameters are maintained by MD2D
 * in src/v2/md2d/domain/color/imagePalette.ts and design/color-system.ts.
 */
import { extractPalette, type Swatch } from './md2d/domain/color/imagePalette.ts';

export const IMAGE_DECODE = {
  maxDimension: 512,
} as const;

export async function extractImageColors(file: File): Promise<Swatch[]> {
  let image: ImageBitmap | HTMLImageElement;
  let revoke: (() => void) | undefined;
  if (typeof createImageBitmap === 'function') {
    image = await createImageBitmap(file);
  } else {
    const url = URL.createObjectURL(file);
    revoke = () => URL.revokeObjectURL(url);
    image = new Image();
    image.src = url;
    try { await image.decode(); } catch (error) { revoke(); throw error; }
  }
  try {
    const width = 'naturalWidth' in image ? image.naturalWidth : image.width;
    const height = 'naturalHeight' in image ? image.naturalHeight : image.height;
    if (!width || !height) throw new Error('Invalid image size');
    const ratio = Math.min(1, IMAGE_DECODE.maxDimension / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D canvas unavailable');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return extractPalette(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  } finally {
    if ('close' in image) image.close();
    revoke?.();
  }
}
