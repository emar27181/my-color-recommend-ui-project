import { create } from 'zustand';
import chroma from 'chroma-js';

export interface ColorState {
  selectedColor: string;
  recommendedColors: string[];
  recommendedTones: string[];
  setSelectedColor: (color: string) => void;
  generateRecommendedColors: () => void;
  generateRecommendedTones: (baseColor: string) => void;
}

export const useColorStore = create<ColorState>((set, get) => ({
  selectedColor: '#3b82f6', // デフォルトは青色
  recommendedColors: [],
  recommendedTones: [],
  
  setSelectedColor: (color: string) => {
    set({ selectedColor: color });
    get().generateRecommendedColors();
  },
  
  generateRecommendedColors: () => {
    const { selectedColor } = get();
    try {
      const baseColor = chroma(selectedColor);
      const hue = baseColor.get('hsl.h') || 0;
      
      // 色相環に基づく推薦色を生成
      const recommendations = [
        // 補色 (180度反対)
        chroma.hsl(hue + 180, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(),
        // 類似色 (±30度)
        chroma.hsl(hue + 30, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(),
        chroma.hsl(hue - 30, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(),
        // 三角色 (±120度)
        chroma.hsl(hue + 120, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(),
        chroma.hsl(hue - 120, baseColor.get('hsl.s'), baseColor.get('hsl.l')).hex(),
      ];
      
      set({ recommendedColors: recommendations });
    } catch (error) {
      console.error('Failed to generate recommended colors:', error);
      set({ recommendedColors: [] });
    }
  },
  
  generateRecommendedTones: (baseColor: string) => {
    try {
      const color = chroma(baseColor);
      const hue = color.get('hsl.h') || 0;
      const saturation = color.get('hsl.s');
      
      // 明度と彩度を変化させたトーンを生成
      const tones = [
        // 明度のバリエーション (彩度は維持)
        chroma.hsl(hue, saturation, 0.2).hex(), // 暗い
        chroma.hsl(hue, saturation, 0.4).hex(), // やや暗い
        chroma.hsl(hue, saturation, 0.6).hex(), // やや明るい
        chroma.hsl(hue, saturation, 0.8).hex(), // 明るい
        // 彩度のバリエーション (明度は0.5で固定)
        chroma.hsl(hue, 0.3, 0.5).hex(), // 低彩度
        chroma.hsl(hue, 0.6, 0.5).hex(), // 中彩度
        chroma.hsl(hue, 0.9, 0.5).hex(), // 高彩度
      ];
      
      set({ recommendedTones: tones });
    } catch (error) {
      console.error('Failed to generate recommended tones:', error);
      set({ recommendedTones: [] });
    }
  },
}));

// 初期状態で推薦色を生成
setTimeout(() => {
  console.log('Generating initial recommended colors...');
  useColorStore.getState().generateRecommendedColors();
  console.log('Recommended colors:', useColorStore.getState().recommendedColors);
}, 0);