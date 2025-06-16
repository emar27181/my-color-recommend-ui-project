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
  maxColors: number = 5
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
        // キャンバスに画像を描画
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const colorThief = new ColorThief();
        
        // ドミナントカラーを取得
        const dominantRgb = colorThief.getColor(img, 10);
        
        // カラーパレットを取得
        const palette = colorThief.getPalette(img, maxColors, 10) || [];
        
        // ExtractedColor形式に変換
        const colors: ExtractedColor[] = palette.map((rgb: [number, number, number], index: number) => ({
          hex: chroma.rgb(rgb[0], rgb[1], rgb[2]).hex(),
          rgb,
          usage: 1 - (index / palette.length), // 最初の色ほど使用度が高い
        }));

        const dominantColor: ExtractedColor = {
          hex: chroma.rgb(dominantRgb[0], dominantRgb[1], dominantRgb[2]).hex(),
          rgb: dominantRgb,
          usage: 1,
        };

        // ドミナントカラーが結果に含まれていない場合は先頭に追加
        const isDominantIncluded = colors.some(color => color.hex === dominantColor.hex);
        if (!isDominantIncluded) {
          colors.unshift(dominantColor);
          // 配列のサイズを調整
          if (colors.length > maxColors) {
            colors.pop();
          }
        }

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