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

// 配色技法の推薦優先度を取得する関数（未使用）
/*
const getSchemeRecommendationOrder = (currentScheme: string): string[] => {
  const schemes = {
    // ドミナント配色優先グループ
    'identity': ['identity', 'dominant_1', 'dominant_2', 'analogous_1', 'analogous_2', 'complementary'],
    'dominant_1': ['dominant_1', 'dominant_2', 'analogous_1', 'identity', 'analogous_2', 'complementary'],
    'dominant_2': ['dominant_2', 'dominant_1', 'analogous_1', 'analogous_2', 'identity', 'complementary'],
    
    // アナロジー配色優先グループ
    'analogous_1': ['analogous_1', 'analogous_2', 'dominant_1', 'dominant_2', 'intermediate_1', 'complementary'],
    'analogous_2': ['analogous_2', 'analogous_1', 'intermediate_2', 'dominant_2', 'intermediate_1', 'complementary'],
    
    // 補色配色優先グループ
    'complementary': ['complementary', 'split_complementary', 'tetradic', 'triadic', 'analogous_1', 'dominant_1'],
    'opponent': ['opponent', 'complementary', 'split_complementary', 'tetradic', 'triadic', 'analogous_1'],
    
    // 三角・四角配色優先グループ
    'triadic': ['triadic', 'split_complementary', 'tetradic', 'complementary', 'analogous_1', 'dominant_1'],
    'tetradic': ['tetradic', 'triadic', 'complementary', 'split_complementary', 'analogous_2', 'dominant_2'],
    
    // その他の配色技法
    'intermediate_1': ['intermediate_1', 'analogous_1', 'analogous_2', 'dominant_1', 'complementary', 'triadic'],
    'intermediate_2': ['intermediate_2', 'analogous_2', 'analogous_1', 'dominant_2', 'complementary', 'triadic'],
    'split_complementary': ['split_complementary', 'complementary', 'triadic', 'tetradic', 'analogous_1', 'dominant_1'],
    'pentad': ['pentad', 'triadic', 'tetradic', 'hexad', 'split_complementary', 'complementary'],
    'hexad': ['hexad', 'pentad', 'tetradic', 'triadic', 'split_complementary', 'complementary']
  };
  
  return schemes[currentScheme as keyof typeof schemes] || 
         ['complementary', 'analogous_1', 'dominant_1', 'triadic', 'tetradic', 'split_complementary'];
};
*/

// 配色技法のデータ定義（推薦優先度で動的ソート）
export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'identity',
    name: 'アイデンティティ配色(1色): 単一色のみの配色',
    description: '単一色のみの配色',
    angles: [0],
  },
  {
    id: 'analogous_1',
    name: 'アナロジー配色(2色): 基準色から時計回りのアナロジー配色',
    description: '基準色から時計回りのアナロジー配色',
    angles: [0, 30],
  },
  {
    id: 'analogous_2',
    name: 'アナロジー配色(2色): 基準色から反時計回りのアナロジー配色',
    description: '基準色から反時計回りのアナロジー配色',
    angles: [0, -30],
  },
  {
    id: 'complementary',
    name: 'ダイアード配色(2色): 対照的な色相の組み合わせ',
    description: '対照的な色相の組み合わせ',
    angles: [0, 180],
  },
  {
    id: 'intermediate_1',
    name: 'インターミディエート配色(2色): 基準色から時計回りの60度配色',
    description: '基準色から時計回りの60度配色',
    angles: [0, 60],
  },
  {
    id: 'intermediate_2',
    name: 'インターミディエート配色(2色): 基準色から反時計回りの60度配色',
    description: '基準色から反時計回りの60度配色',
    angles: [0, -60],
  },
  {
    id: 'opponent',
    name: 'オポーネント配色(2色): 心理的補色に基づいた配色',
    description: '心理的補色に基づいた配色',
    angles: [0, 180],
  },
  {
    id: 'dominant_1',
    name: 'ドミナント配色(3色): 同系色の微細なバリエーション',
    description: '同系色の微細なバリエーション',
    angles: [0, 15, -15],
  },
  {
    id: 'dominant_2',
    name: 'ドミナント配色(3色): 同系色の微細なバリエーション',
    description: '同系色の微細なバリエーション',
    angles: [0, 30, -30],
  },
  {
    id: 'triadic',
    name: 'トライアド配色(3色): 色相環を3等分した配色',
    description: '色相環を3等分した配色',
    angles: [0, 120, 240],
  },
  {
    id: 'split_complementary',
    name: 'スプリットコンプリメンタリー配色(3色): 補色の両隣を使った配色',
    description: '補色の両隣を使った配色',
    angles: [0, 150, 210],
  },
  {
    id: 'tetradic',
    name: 'テトラード配色(4色): 色相環を4等分した配色',
    description: '色相環を4等分した配色',
    angles: [0, 90, 180, 270],
  },
  {
    id: 'pentad',
    name: 'ペンタード配色(5色): 色相環を5等分した配色',
    description: '色相環を5等分した配色',
    angles: [0, 72, 144, 216, 288],
  },
  {
    id: 'hexad',
    name: 'ヘクサード配色(6色): 色相環を6等分した配色',
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
  TONE_LIGHTNESS_VARIATIONS.forEach((lightness) => {
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

// 量子化関数
// 色相環用: 15度間隔で量子化（0, 15, 30, 45, ...）
export const quantizeHue = (hue: number): number => {
  return Math.round(hue / 15) * 15;
};

// トーン表用: 10等分で量子化（0, 10, 20, 30, ..., 100）
export const quantizeSaturationLightness = (value: number): number => {
  return Math.round(value * 100 / 10) * 10 / 100;
};

// デバッグ用：現在のトーン設定を確認
console.log('Current tone settings:');
console.log('Lightness variations:', TONE_LIGHTNESS_VARIATIONS);
console.log('Saturation variations:', TONE_SATURATION_VARIATIONS);
console.log('Generated adjustments:', TONE_ADJUSTMENTS.length, 'patterns');

export interface ColorState {
  selectedColor: string;
  paintColor: string; // 描画色（キャンバス用）
  recommendedColors: string[];
  recommendedTones: string[];
  selectedScheme: string;
  toneBaseColor: string | null;
  extractedColors: ExtractedColor[];
  dominantColor: ExtractedColor | null;
  isQuantizationEnabled: boolean;
  setSelectedColor: (color: string) => void;
  setPaintColor: (color: string) => void;
  setSelectedScheme: (schemeId: string) => void;
  setExtractedColors: (colors: ExtractedColor[], dominantColor: ExtractedColor) => void;
  setColorFromExtracted: (color: string) => void;
  generateRecommendedColors: () => void;
  generateRecommendedTones: (baseColor: string) => void;
  toggleQuantization: () => void;
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

// 重複色・極端な色を除外する関数
const filterValidTones = (colors: string[], baseColor: string): string[] => {
  const seen = new Set<string>();
  const validColors: string[] = [];
  
  for (const color of colors) {
    const upperColor = color.toUpperCase();
    
    // 重複チェック
    if (seen.has(upperColor)) {
      continue;
    }
    
    // 極端な色（完全な黒・白）を除外
    if (upperColor === '#000000' || upperColor === '#FFFFFF') {
      continue;
    }
    
    // ベースカラーとの重複チェック
    if (upperColor === baseColor.toUpperCase()) {
      continue;
    }
    
    seen.add(upperColor);
    validColors.push(color);
  }
  
  return validColors;
};

// 配色技法を推定する関数（未使用）
/*
const detectColorScheme = (colors: ExtractedColor[], baseColor: string): string => {
  if (colors.length < 2) {
    return 'identity'; // 色が少ない場合は単色配色
  }

  try {
    // ベースカラーの色相を取得
    const baseHue = chroma(baseColor).get('hsl.h') || 0;
    
    // 抽出された色の色相を計算し、ベースカラーとの角度差を求める
    const hueAngles: number[] = [];
    const hueThreshold = 20; // 色相の許容範囲（度）
    
    for (const colorData of colors) {
      const hue = chroma(colorData.hex).get('hsl.h') || 0;
      const angleDiff = Math.abs(((hue - baseHue + 540) % 360) - 180);
      const normalizedAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;
      
      // 使用率が高い色（5%以上）のみ考慮
      if (colorData.usage > 0.05) {
        hueAngles.push(normalizedAngle);
      }
    }
    
    // 角度差を分析して配色技法を推定
    const sortedAngles = hueAngles.sort((a, b) => a - b);
    console.log('Color scheme detection:', { baseHue, hueAngles: sortedAngles, colorCount: colors.length });
    
    // 優先度順に配色技法を判定
    
    // 1. ドミナント配色（同系色、角度差が15度以内）- 最優先
    const veryCloseColors = sortedAngles.filter(angle => angle <= 15);
    if (veryCloseColors.length >= 1) {
      console.log('Detected: Dominant color scheme (very close hues)');
      return 'dominant_1';
    }
    
    // 2. ドミナント配色（角度差が30度以内）
    const dominantColors = sortedAngles.filter(angle => angle <= 30);
    if (dominantColors.length >= 1) {
      console.log('Detected: Dominant color scheme');
      return 'dominant_2';
    }
    
    // 3. アナロジー配色（隣接色相、30-60度）
    const analogousColors = sortedAngles.filter(angle => angle > 25 && angle <= 60);
    if (analogousColors.length >= 1) {
      // より近い角度はanalogous_1、遠い角度はanalogous_2
      const closeAnalogous = analogousColors.filter(angle => angle <= 45);
      if (closeAnalogous.length >= 1) {
        console.log('Detected: Close analogous color scheme');
        return 'analogous_1';
      } else {
        console.log('Detected: Wide analogous color scheme');  
        return 'analogous_2';
      }
    }
    
    // 4. スプリットコンプリメンタリー（150度前後と210度前後）
    const splitComp1 = sortedAngles.filter(angle => angle >= 140 && angle <= 160);
    const splitComp2 = sortedAngles.filter(angle => angle >= 200 && angle <= 220);
    if (splitComp1.length >= 1 && splitComp2.length >= 1) {
      console.log('Detected: Split complementary color scheme');
      return 'split_complementary';
    }
    
    // 5. 補色配色（170-190度）
    const complementaryColors = sortedAngles.filter(angle => angle >= 170 && angle <= 190);
    if (complementaryColors.length >= 1) {
      console.log('Detected: Complementary color scheme');
      return 'complementary';
    }
    
    // 6. トライアド配色（115-125度、235-245度）
    const triadic1 = sortedAngles.filter(angle => angle >= 115 && angle <= 125);
    const triadic2 = sortedAngles.filter(angle => angle >= 235 && angle <= 245);
    if (triadic1.length >= 1 || triadic2.length >= 1) {
      console.log('Detected: Triadic color scheme');
      return 'triadic';
    }
    
    // 7. テトラード配色（85-95度、175-185度、265-275度）
    const tetradic1 = sortedAngles.filter(angle => angle >= 85 && angle <= 95);
    const tetradic2 = sortedAngles.filter(angle => angle >= 175 && angle <= 185);
    if (tetradic1.length >= 1 && tetradic2.length >= 1) {
      console.log('Detected: Tetradic color scheme');
      return 'tetradic';
    }
    
    // 8. 60度配色 (インターミディエート)
    const intermediate = sortedAngles.filter(angle => angle >= 55 && angle <= 65);
    if (intermediate.length >= 1) {
      console.log('Detected: Intermediate color scheme');
      return 'intermediate_1';
    }
    
    // デフォルトは補色配色
    console.log('Default: Complementary color scheme');
    return 'complementary';
    
  } catch (error) {
    console.error('Error in color scheme detection:', error);
    return 'complementary';
  }
};
*/

export const useColorStore = create<ColorState>((set, get) => {
  // デフォルト色でトーンを事前生成
  const defaultColor = '#b51a00';
  const color = chroma(defaultColor);
  const hue = color.get('hsl.h') || 0;
  
  // 固定の16パターン（saturation 20,40,60,80 × lightness 20,40,60,80）
  const saturations = [20, 40, 60, 80]; // %
  const lightnesses = [20, 40, 60, 80]; // %
  
  const defaultTones: string[] = [];
  
  // 16パターンを生成（4×4の組み合わせ）
  for (const saturation of saturations) {
    for (const lightness of lightnesses) {
      try {
        const hslColor = chroma.hsl(
          hue, 
          saturation / 100,  // 0-1の範囲に変換
          lightness / 100    // 0-1の範囲に変換
        );
        defaultTones.push(hslColor.hex());
      } catch (error) {
        console.error('Error generating default tone:', error);
      }
    }
  }
  
  // デフォルトトーンも重複色・極端な色を除外
  const filteredDefaultTones = filterValidTones(defaultTones, defaultColor);

  return {
    selectedColor: defaultColor,
    paintColor: defaultColor,
    recommendedColors: [],
    recommendedTones: sortColorsByLightness(filteredDefaultTones),
    selectedScheme: 'complementary',
    toneBaseColor: defaultColor,
    extractedColors: [],
    dominantColor: null,
    isQuantizationEnabled: true,

    setSelectedColor: (color: string) => {
      set({ selectedColor: color });
      // デフォルトでトーン推薦も生成
      get().generateRecommendedTones(color);
    },

    setPaintColor: (color: string) => {
      set({ paintColor: color });
    },

    setSelectedScheme: (schemeId: string) => {
      set({ selectedScheme: schemeId });
      get().generateRecommendedColors();
    },

    setExtractedColors: (colors: ExtractedColor[], dominantColor: ExtractedColor) => {
      set({ extractedColors: colors, dominantColor });
      
      // 配色技法の自動検出・設定を停止 - ユーザーが手動で変更するまで固定
      // const detectedScheme = detectColorScheme(colors, dominantColor.hex);
      // console.log('Auto-detected color scheme:', detectedScheme);
      // set({ selectedScheme: detectedScheme });
      
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

        // 固定の16パターン（saturation 20,40,60,80 × lightness 80,60,40,20）
        const saturations = [20, 40, 60, 80]; // % (左から右へ：薄い→鮮やか)
        const lightnesses = [80, 60, 40, 20]; // % (上から下へ：明るい→暗い)
        
        const tones: string[] = [];
        
        // 16パターンを固定順序で生成（4×4の組み合わせ）
        // 各明度ごとに彩度20,40,60,80の順序で配置（上=明るい、下=暗い、左=薄い、右=鮮やか）
        for (const lightness of lightnesses) {
          for (const saturation of saturations) {
            const hslColor = chroma.hsl(
              hue, 
              saturation / 100,  // 0-1の範囲に変換
              lightness / 100    // 0-1の範囲に変換
            );
            tones.push(hslColor.hex());
          }
        }

        // 配置を固定するため、ソートせずにそのまま使用
        console.log('Generated tones order (first 4 = lightness80% with sat 20,40,60,80):', 
          tones.slice(0, 4).map((tone, i) => `${i}: ${tone} (S:${saturations[i]}%)`));
        set({ recommendedTones: tones, toneBaseColor: baseColor });
      } catch (error) {
        console.error('Failed to generate recommended tones:', error);
        set({ recommendedTones: [], toneBaseColor: null });
      }
    },

    toggleQuantization: () => {
      set(state => ({ isQuantizationEnabled: !state.isQuantizationEnabled }));
    },
  };
});

// 初期化時にデフォルトの推薦色とトーン推薦を生成
const initialState = useColorStore.getState();
initialState.generateRecommendedColors();
initialState.generateRecommendedTones(initialState.selectedColor);