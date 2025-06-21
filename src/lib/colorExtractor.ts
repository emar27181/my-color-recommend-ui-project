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

// ΔE値によるカラークラスタリング関数
const clusterColorsByDeltaE = (colors: ExtractedColor[], threshold: number = 10): ExtractedColor[] => {
  const clusters: ExtractedColor[][] = [];
  
  for (const color of colors) {
    let merged = false;
    
    // 既存のクラスターから近い色を探す
    for (const cluster of clusters) {
      const representative = cluster[0];
      const deltaE = chroma.deltaE(chroma(color.hex), chroma(representative.hex));
      
      if (deltaE <= threshold) {
        cluster.push(color);
        merged = true;
        break;
      }
    }
    
    // 近い色がなければ新しいクラスターを作成
    if (!merged) {
      clusters.push([color]);
    }
  }
  
  // 各クラスターで加重平均を計算
  return clusters.map(cluster => {
    if (cluster.length === 1) {
      return cluster[0];
    }
    
    // 使用率による加重平均
    const totalUsage = cluster.reduce((sum, color) => sum + color.usage, 0);
    
    let weightedR = 0, weightedG = 0, weightedB = 0;
    
    for (const color of cluster) {
      const weight = color.usage / totalUsage;
      weightedR += color.rgb[0] * weight;
      weightedG += color.rgb[1] * weight;
      weightedB += color.rgb[2] * weight;
    }
    
    const avgRgb: [number, number, number] = [
      Math.round(weightedR),
      Math.round(weightedG), 
      Math.round(weightedB)
    ];
    
    return {
      hex: chroma.rgb(avgRgb[0], avgRgb[1], avgRgb[2]).hex(),
      rgb: avgRgb,
      usage: totalUsage
    };
  }).sort((a, b) => b.usage - a.usage);
};

export const extractColorsFromImage = async (
  file: File, 
  maxColors: number = 30,
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
        const rawColors: ExtractedColor[] = palette.map((rgb: [number, number, number]) => {
          const hex = chroma.rgb(rgb[0], rgb[1], rgb[2]).hex();
          const count = colorCounts.get(hex) || 0;
          const usage = count / totalSamples;
          
          return {
            hex,
            rgb,
            usage,
          };
        })
        .filter(color => color.usage > 0) // 0%の色を除外
        .sort((a, b) => b.usage - a.usage);
        
        // ΔE値によるクラスタリングで色を統合
        const clusteredColors = clusterColorsByDeltaE(rawColors, 10);
        
        // 最終的な色数を制限（元のmaxColorsに合わせる）
        const colors = clusteredColors.slice(0, Math.min(clusteredColors.length, 8));

        const dominantHex = chroma.rgb(dominantRgb[0], dominantRgb[1], dominantRgb[2]).hex();
        const dominantUsage = colorCounts.get(dominantHex) || 0;
        
        const dominantColor: ExtractedColor = {
          hex: dominantHex,
          rgb: dominantRgb,
          usage: dominantUsage / totalSamples,
        };

        const isDominantIncluded = colors.some(color => color.hex === dominantColor.hex);
        // ドミナントカラーも0%でなければ追加
        if (!isDominantIncluded && dominantColor.usage > 0) {
          colors.unshift(dominantColor);
          if (colors.length > 8) {
            colors.pop();
          }
        }
        
        // 最終的に0%の色を再度除外（念のため）
        const finalColors = colors.filter(color => color.usage > 0);
        
        onProgress?.(100); // 完了

        resolve({
          colors: finalColors,
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