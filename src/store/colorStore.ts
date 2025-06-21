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

// 配色技法のデータ定義（anglesの数で昇順ソート済み）
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'identity',
    name: 'アイデンティティ',
    description: '単一色のみの配色',
    angles: [0],
  },
  {
    id: 'analogous_1',
    name: 'アナロジー1',
    description: '基準色から時計回りのアナロジー配色',
    angles: [0, 30],
  },
  {
    id: 'analogous_2',
    name: 'アナロジー2',
    description: '基準色から反時計回りのアナロジー配色',
    angles: [0, -30],
  },
  {
    id: 'complementary',
    name: 'ダイアード',
    description: '対照的な色相の組み合わせ',
    angles: [0, 180],
  },
  {
    id: 'intermediate_1',
    name: 'インターミディエート1',
    description: '基準色から時計回りの60度配色',
    angles: [0, 60],
  },
  {
    id: 'intermediate_2',
    name: 'インターミディエート2',
    description: '基準色から反時計回りの60度配色',
    angles: [0, -60],
  },
  {
    id: 'opponent',
    name: 'オポーネント',
    description: '心理的補色に基づいた配色',
    angles: [0, 180],
  },
  {
    id: 'dominant_1',
    name: 'ドミナント1',
    description: '同系色の微細なバリエーション',
    angles: [0, 15, -15],
  },
  {
    id: 'dominant_2',
    name: 'ドミナント2',
    description: '同系色の微細なバリエーション',
    angles: [0, 30, -30],
  },
  {
    id: 'triadic',
    name: 'トライアド',
    description: '色相環を3等分した配色',
    angles: [0, 120, 240],
  },
  {
    id: 'split_complementary',
    name: 'スプリット',
    description: '補色の両隣を使った配色',
    angles: [0, 150, 210],
  },
  {
    id: 'tetradic',
    name: 'テトラード',
    description: '色相環を4等分した配色',
    angles: [0, 90, 180, 270],
  },
  {
    id: 'pentad',
    name: 'ペンタード',
    description: '色相環を5等分した配色',
    angles: [0, 72, 144, 216, 288],
  },
  {
    id: 'hexad',
    name: 'ヘクサード',
    description: '色相環を6等分した配色',
    angles: [0, 60, 120, 180, 240, 300],
  },
];



// トーン変化量設定（パーセント指定）
// 使用例: [20, -20] → 明るく・暗くの2パターン
// 使用例: [30, 10, 0, -10, -30] → 5段階の明度変化
export const TONE_LIGHTNESS_VARIATIONS = [-20, 20, -40, 40, -60, 60, -80, 80]; // 明度変化量（%）

// 使用例: [30, -30] → 鮮やか・くすんだの2パターン  
// 使用例: [0, -50, 50] → オリジナル・淡い・鮮やかの3パターン
// 20, 40, 60, 80のバリエーションでプラスマイナス2パターン追加
export const TONE_SATURATION_VARIATIONS = [-20, 20, -40, 40, -60, 60, -80, 80]; // 彩度変化量（%、0=変化なし）

// 設定に基づいてトーン調整値を自動生成する関数
const generateToneAdjustments = (): ToneAdjustment[] => {
  const adjustments: ToneAdjustment[] = [];

  // 明度バリエーション
  TONE_LIGHTNESS_VARIATIONS.forEach((lightness, index) => {
    adjustments.push({
      id: `lightness_${lightness > 0 ? 'plus' : lightness < 0 ? 'minus' : ''}${Math.abs(lightness)}`,
      name: '',
      lightnessOffset: lightness / 100, // パーセントを小数に変換
    });
  });

  // 彩度バリエーション（明度0は除く）
  TONE_SATURATION_VARIATIONS.filter(sat => sat !== 0).forEach((saturation) => {
    adjustments.push({
      id: `saturation_${saturation > 0 ? 'plus' : 'minus'}${Math.abs(saturation)}`,
      name: '',
      lightnessOffset: 0,
      saturationMultiplier: 1 + (saturation / 100), // パーセントを倍率に変換
    });
  });

  return adjustments;
};

// 自動生成されたトーン調整値
export const TONE_ADJUSTMENTS: ToneAdjustment[] = generateToneAdjustments();

// デバッグ用：現在のトーン設定を確認
console.log('Current tone settings:');
console.log('Lightness variations:', TONE_LIGHTNESS_VARIATIONS);
console.log('Saturation variations:', TONE_SATURATION_VARIATIONS);
console.log('Generated adjustments:', TONE_ADJUSTMENTS.length, 'patterns');

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

// カラーソート関数: 明るい→暗いでソート
const sortColorsByLightness = (colors: string[]): string[] => {
  return colors.sort((a, b) => {
    try {
      const lightnessA = chroma(a).get('hsl.l');
      const lightnessB = chroma(b).get('hsl.l');
      return lightnessB - lightnessA; // 明るい→暗い（降順）
    } catch (error) {
      console.error('Error sorting colors:', error);
      return 0;
    }
  });
};

export const useColorStore = create<ColorState>((set, get) => {
  // デフォルト色でトーンを事前生成
  const defaultColor = '#3b82f6';
  const defaultTones = TONE_ADJUSTMENTS.map(adjustment => {
    try {
      const color = chroma(defaultColor);
      const hue = color.get('hsl.h') || 0;
      const saturation = color.get('hsl.s');
      const lightness = color.get('hsl.l');

      const newLightness = Math.max(0, Math.min(1, lightness + adjustment.lightnessOffset));
      const newSaturation = adjustment.saturationMultiplier
        ? Math.max(0, Math.min(1, saturation * adjustment.saturationMultiplier))
        : saturation;

      return chroma.hsl(hue, newSaturation, newLightness).hex();
    } catch (error) {
      return defaultColor;
    }
  });

  return {
    selectedColor: defaultColor,
    recommendedColors: [],
    recommendedTones: sortColorsByLightness(defaultTones),
    selectedScheme: 'complementary',
    toneBaseColor: defaultColor,
    extractedColors: [],
    dominantColor: null,

    setSelectedColor: (color: string) => {
      set({ selectedColor: color });
      get().generateRecommendedColors();
      // デフォルトでトーン推薦も生成
      get().generateRecommendedTones(color);
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

        // 明るい→暗い順でソート
        const sortedRecommendations = sortColorsByLightness(recommendations);

        set({ recommendedColors: sortedRecommendations });
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

        // 明るい→暗い順でソート
        const sortedTones = sortColorsByLightness(tones);

        set({ recommendedTones: sortedTones, toneBaseColor: baseColor });
      } catch (error) {
        console.error('Failed to generate recommended tones:', error);
        set({ recommendedTones: [], toneBaseColor: null });
      }
    },
  };
});

// 初期化時にデフォルトの推薦色を生成
const initialState = useColorStore.getState();
initialState.generateRecommendedColors();