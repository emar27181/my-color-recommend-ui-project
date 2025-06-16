import { create } from 'zustand';
import chroma from 'chroma-js';
import type { ExtractedColor } from '@/lib/colorExtractor';

// 配色技法の型定義
export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  angles: number[];
}

// トーン調整の型定義
export interface ToneAdjustment {
  id: string;
  name: string;
  lightnessOffset: number;
  saturationMultiplier?: number;
}

// 配色技法のデータ定義
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'dominant',
    name: 'ドミナント配色',
    description: '同系色の微細なバリエーション',
    angles: [0, 15, -15, 30, -30],
  },
  {
    id: 'analogous',
    name: '類似色配色',
    description: '隣接する色相の組み合わせ',
    angles: [0, 30, -30, 60, -60],
  },
  {
    id: 'complementary',
    name: '補色配色',
    description: '対照的な色相の組み合わせ',
    angles: [0, 180],
  },
  {
    id: 'triadic',
    name: '三角配色',
    description: '色相環を3等分した配色',
    angles: [0, 120, 240],
  },
  {
    id: 'tetradic',
    name: '四角配色',
    description: '色相環を4等分した配色',
    angles: [0, 90, 180, 270],
  },
  {
    id: 'split_complementary',
    name: '分割補色配色',
    description: '補色の両隣を使った配色',
    angles: [0, 150, 210],
  },
];

// トーン調整値の定義
export const TONE_ADJUSTMENTS: ToneAdjustment[] = [
  { id: 'darker', name: '暗く', lightnessOffset: -0.2 },
  { id: 'lighter', name: '明るく', lightnessOffset: 0.2 },
  { id: 'much_darker', name: 'とても暗く', lightnessOffset: -0.4 },
  { id: 'much_lighter', name: 'とても明るく', lightnessOffset: 0.4 },
  { id: 'desaturated', name: '彩度を下げて', lightnessOffset: 0, saturationMultiplier: 0.5 },
  { id: 'saturated', name: '彩度を上げて', lightnessOffset: 0, saturationMultiplier: 1.5 },
  { id: 'muted', name: 'くすませて', lightnessOffset: -0.1, saturationMultiplier: 0.7 },
  { id: 'vivid', name: '鮮やかに', lightnessOffset: 0.1, saturationMultiplier: 1.3 },
];

export interface ColorState {
  selectedColor: string;
  recommendedColors: string[];
  recommendedTones: string[];
  selectedScheme: string;
  toneBaseColor: string | null;
  extractedColors: ExtractedColor[];
  dominantColor: ExtractedColor | null;
  setSelectedColor: (color: string) => void;
  setSelectedScheme: (schemeId: string) => void;
  setExtractedColors: (colors: ExtractedColor[], dominantColor: ExtractedColor) => void;
  setColorFromExtracted: (color: string) => void;
  generateRecommendedColors: () => void;
  generateRecommendedTones: (baseColor: string) => void;
}

export const useColorStore = create<ColorState>((set, get) => ({
  selectedColor: '#3b82f6', // デフォルトは青色
  recommendedColors: [],
  recommendedTones: [],
  selectedScheme: 'analogous', // デフォルトは類似色配色
  toneBaseColor: null,
  extractedColors: [],
  dominantColor: null,
  
  setSelectedColor: (color: string) => {
    set({ selectedColor: color });
    get().generateRecommendedColors();
  },
  
  setSelectedScheme: (schemeId: string) => {
    set({ selectedScheme: schemeId });
    get().generateRecommendedColors();
  },
  
  setExtractedColors: (colors: ExtractedColor[], dominantColor: ExtractedColor) => {
    set({ extractedColors: colors, dominantColor });
    // ドミナントカラーを自動的に選択色として設定
    get().setSelectedColor(dominantColor.hex);
  },
  
  setColorFromExtracted: (color: string) => {
    get().setSelectedColor(color);
  },
  
  generateRecommendedColors: () => {
    const { selectedColor, selectedScheme } = get();
    try {
      const baseColor = chroma(selectedColor);
      const hue = baseColor.get('hsl.h') || 0;
      const saturation = baseColor.get('hsl.s');
      const lightness = baseColor.get('hsl.l');
      
      // 選択された配色技法を取得
      const scheme = COLOR_SCHEMES.find(s => s.id === selectedScheme);
      if (!scheme) {
        console.error('Invalid color scheme:', selectedScheme);
        set({ recommendedColors: [] });
        return;
      }
      
      // 配色技法に基づく推薦色を生成
      const recommendations = scheme.angles.map(angle => {
        const newHue = (hue + angle) % 360;
        return chroma.hsl(newHue, saturation, lightness).hex();
      });
      
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
      const lightness = color.get('hsl.l');
      
      // TONE_ADJUSTMENTSに基づいてトーンを生成
      const tones = TONE_ADJUSTMENTS.map(adjustment => {
        const newLightness = Math.max(0, Math.min(1, lightness + adjustment.lightnessOffset));
        const newSaturation = adjustment.saturationMultiplier 
          ? Math.max(0, Math.min(1, saturation * adjustment.saturationMultiplier))
          : saturation;
        
        return chroma.hsl(hue, newSaturation, newLightness).hex();
      });
      
      set({ recommendedTones: tones, toneBaseColor: baseColor });
    } catch (error) {
      console.error('Failed to generate recommended tones:', error);
      set({ recommendedTones: [], toneBaseColor: null });
    }
  },
}));

// 初期状態で推薦色を生成
setTimeout(() => {
  console.log('Generating initial recommended colors...');
  useColorStore.getState().generateRecommendedColors();
  console.log('Recommended colors:', useColorStore.getState().recommendedColors);
}, 0);