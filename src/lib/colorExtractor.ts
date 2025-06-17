import ColorThief from 'colorthief';
import chroma from 'chroma-js';

export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  usage: number; // 使用度合い（0-1）
}

export interface ColorExtractionResult {
  colors: ExtractedColor[];
  dominantColor: ExtractedColor;
}

export const extractColorsFromImage = async (
  file: File, 
  maxColors: number = 5,
  onProgress?: (progress: number) => void
): Promise<ColorExtractionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        onProgress?.(10); // 画像読み込み完了
        
        // 高速化: 大きな画像は縮小して処理
        const maxDimension = 800;
        let { width, height } = img;
        
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        onProgress?.(30); // 画像描画完了

        const colorThief = new ColorThief();
        
        // 高速化: 品質パラメータを調整（10 → 20）
        const dominantRgb = colorThief.getColor(img, 20);
        onProgress?.(50); // ドミナントカラー取得完了
        
        const palette = colorThief.getPalette(img, maxColors, 20) || [];
        onProgress?.(70); // パレット取得完了
        
        // 高速化: サンプリング間隔を増やしてピクセル数を減らす
        const sampleRate = Math.max(1, Math.floor(Math.sqrt(width * height) / 100));
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const totalSamples = Math.floor((width * height) / (sampleRate * sampleRate));
        
        const colorCounts = new Map<string, number>();
        const tolerance = 35; // 許容差を少し広げて処理を軽く
        
        let processedSamples = 0;
        
        for (let y = 0; y < height; y += sampleRate) {
          for (let x = 0; x < width; x += sampleRate) {
            const i = (y * width + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const pixelColor = chroma.rgb(r, g, b);
            
            let closestColor = '';
            let minDistance = Infinity;
            
            for (const paletteRgb of palette) {
              const paletteColor = chroma.rgb(paletteRgb[0], paletteRgb[1], paletteRgb[2]);
              const distance = chroma.deltaE(pixelColor, paletteColor);
              
              if (distance < minDistance && distance < tolerance) {
                minDistance = distance;
                closestColor = paletteColor.hex();
              }
            }
            
            if (closestColor) {
              colorCounts.set(closestColor, (colorCounts.get(closestColor) || 0) + 1);
            }
            
            processedSamples++;
            
            // プログレス更新（70-90%の範囲）
            if (processedSamples % Math.floor(totalSamples / 10) === 0) {
              const progress = 70 + Math.floor((processedSamples / totalSamples) * 20);
              onProgress?.(progress);
            }
          }
        }
        
        onProgress?.(90); // ピクセル分析完了
        
        // ExtractedColor形式に変換
        const colors: ExtractedColor[] = palette.map((rgb: [number, number, number]) => {
          const hex = chroma.rgb(rgb[0], rgb[1], rgb[2]).hex();
          const count = colorCounts.get(hex) || 0;
          const usage = count / totalSamples;
          
          return {
            hex,
            rgb,
            usage,
          };
        }).sort((a, b) => b.usage - a.usage);

        const dominantHex = chroma.rgb(dominantRgb[0], dominantRgb[1], dominantRgb[2]).hex();
        const dominantUsage = colorCounts.get(dominantHex) || 0;
        
        const dominantColor: ExtractedColor = {
          hex: dominantHex,
          rgb: dominantRgb,
          usage: dominantUsage / totalSamples,
        };

        const isDominantIncluded = colors.some(color => color.hex === dominantColor.hex);
        if (!isDominantIncluded) {
          colors.unshift(dominantColor);
          if (colors.length > maxColors) {
            colors.pop();
          }
        }
        
        onProgress?.(100); // 完了

        resolve({
          colors,
          dominantColor,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // ファイルからDataURLを作成
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // ファイルタイプをチェック
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '画像ファイルを選択してください' };
  }

  // ファイルサイズをチェック（10MB制限）
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'ファイルサイズは10MB以下にしてください' };
  }

  // サポートされる形式をチェック
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'JPEG、PNG、GIF、WebP形式の画像のみサポートしています' };
  }

  return { valid: true };
};