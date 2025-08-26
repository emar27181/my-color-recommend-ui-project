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
    name: 'アイデンティティ配色\n単色のみ',
    description: '一つの色だけを使った配色',
    angles: [0],
  },
  {
    id: 'analogous_1',
    name: 'アナロジー配色\n近い色同士',
    description: '色相環で隣り合う近い色同士の組み合わせ',
    angles: [0, 30],
  },
  {
    id: 'analogous_2',
    name: 'アナロジー配色\n近い色同士',
    description: '色相環で隣り合う近い色同士の組み合わせ',
    angles: [0, -30],
  },
  {
    id: 'complementary',
    name: 'ダイアード配色\n正反対の色同士',
    description: '色相環で正反対にある色同士の組み合わせ',
    angles: [0, 180],
  },
  {
    id: 'intermediate_1',
    name: 'インターミディエート配色\n中間色の組み合わせ',
    description: '隣接色と反対色の中間にある色の組み合わせ',
    angles: [0, 60],
  },
  {
    id: 'intermediate_2',
    name: 'インターミディエート配色\n中間色の組み合わせ',
    description: '隣接色と反対色の中間にある色の組み合わせ',
    angles: [0, -60],
  },
  {
    id: 'dominant_1',
    name: 'ドミナント配色\n統一感のある色合い',
    description: '似た色相でまとめた統一感のある組み合わせ',
    angles: [0, 30, -30],
  },
  {
    id: 'dominant_2',
    name: 'ドミナント配色\n統一感のある色合い',
    description: '似た色相でまとめた統一感のある組み合わせ',
    angles: [0, 30, 60],
  },
  {
    id: 'dominant_3',
    name: 'ドミナント配色\n統一感のある色合い',
    description: '似た色相でまとめた統一感のある組み合わせ',
    angles: [0, -30, -60],
  },
  {
    id: 'triadic',
    name: 'トライアド配色\n三等分の色合い',
    description: '色相環を3つに分けた均等な色の組み合わせ',
    angles: [0, 120, 240],
  },
  {
    id: 'split_complementary',
    name: 'スプリットコンプリメンタリー配色\n反対色の隣接色',
    description: '反対色の隣の2色を使った配色',
    angles: [0, 150, 210],
  },
  {
    id: 'tetradic',
    name: 'テトラード配色\n四等分の色合い',
    description: '色相環を4つに分けた均等な色の組み合わせ',
    angles: [0, 90, 180, 270],
  },
  {
    id: 'pentad',
    name: 'ペンタード配色\n五等分の色合い',
    description: '色相環を5つに分けた均等な色の組み合わせ',
    angles: [0, 72, 144, 216, 288],
  },
  {
    id: 'hexad',
    name: 'ヘクサード配色\n六等分の色合い',
    description: '色相環を6つに分けた均等な色の組み合わせ',
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
  baseColor: string; // ベースカラー（色相推薦の基準色）
  selectedColor: string; // 現在選択中の色（表示用）
  paintColor: string; // 描画色（キャンバス用）
  recommendedColors: string[];
  recommendedTones: string[];
  selectedScheme: string;
  toneBaseColor: string | null;
  extractedColors: ExtractedColor[];
  dominantColor: ExtractedColor | null;
  isQuantizationEnabled: boolean;
  setBaseColor: (color: string) => void;
  setSelectedColor: (color: string) => void;
  setPaintColor: (color: string) => void;
  setSelectedScheme: (schemeId: string) => void;
  setExtractedColors: (colors: ExtractedColor[], dominantColor: ExtractedColor) => void;
  setColorFromRecommendation: (color: string) => void; // 推薦色から選択時（描画色のみ変更）
  setColorFromBase: (color: string) => void; // ベース色選択時（ベースカラー+描画色変更）
  generateRecommendedColors: () => void;
  generateRecommendedTones: (baseColor: string) => void;
  toggleQuantization: () => void;
}

// ソート手法の設定
export type SortMethod = 'lightness_desc' | 'lightness_asc' | 'hue' | 'hue_distance' | 'saturation_desc' | 'saturation_asc' | 'original' | 'random';

// === 色相推薦ソート設定 ===
// 以下の設定値を変更することで、色相推薦の並び替えを簡単に切り替えできます

// 推薦色のソート手法設定
export const COLOR_SORT_CONFIG = {
  // 推薦色の並び替え手法 (変更可能)
  method: 'hue_distance' as SortMethod,
  
  // 利用可能な手法一覧とその説明
  availableMethods: {
    'lightness_desc': '明るい→暗い順 (従来の方法)',
    'lightness_asc': '暗い→明るい順',
    'hue': '色相順 (赤→橙→黄→緑→青→紫)',
    'hue_distance': '色相距離順 (ベースカラーに近い順)',
    'saturation_desc': '鮮やか→くすんだ順', 
    'saturation_asc': 'くすんだ→鮮やか順',
    'original': '元の順序を維持 (配色技法の角度順)',
    'random': 'ランダムシャッフル'
  } as const
};

// 配色技法のソート手法設定
export const SCHEME_SORT_CONFIG = {
  // 配色技法の並び替え手法 (変更可能)
  method: 'hue_distance' as 'compatibility' | 'hue_distance' | 'original',
  
  // 利用可能な手法一覧とその説明
  availableMethods: {
    'compatibility': '抽出色との適合度順 (従来の方法)',
    'hue_distance': '色相距離順 (近い色相の配色技法を優先)',
    'original': '固定順序 (COLOR_SCHEMES配列の順序)'
  } as const
};

// === 設定値の変更方法 ===
// 
// 【推薦色の並び替えを変更したい場合】
// COLOR_SORT_CONFIG.method を以下のいずれかに変更:
// - 'lightness_desc': 明るい→暗い順 (従来の方法)  
// - 'hue_distance': 色相距離順 (現在の設定)
// - 'original': 配色技法の角度順
// - その他: 'lightness_asc', 'hue', 'saturation_desc', 'saturation_asc', 'random'
//
// 【配色技法の並び替えを変更したい場合】
// SCHEME_SORT_CONFIG.method を以下のいずれかに変更:
// - 'hue_distance': 色相距離順 (現在の設定)
// - 'compatibility': 抽出色との適合度順 (従来の方法)
// - 'original': COLOR_SCHEMES配列の固定順序
//
// 変更例:
// COLOR_SORT_CONFIG.method = 'lightness_desc';     // 明るい順に戻す
// SCHEME_SORT_CONFIG.method = 'compatibility';     // 適合度順に戻す

// 現在のソート手法（簡単に変更可能）
// 近い色相を好むユーザという仮定で hue_distance に設定
const CURRENT_SORT_METHOD: SortMethod = COLOR_SORT_CONFIG.method;

// 色相環上の最短距離を計算する関数
const getHueDistance = (hue1: number, hue2: number): number => {
  const diff = Math.abs(hue1 - hue2);
  return Math.min(diff, 360 - diff);
};

// カラーソート関数: 指定された手法でソート
const sortColorsByMethod = (colors: string[], method: SortMethod = CURRENT_SORT_METHOD, baseColor?: string): string[] => {
  if (method === 'original') {
    return [...colors]; // 元の順序を維持
  }
  
  if (method === 'random') {
    const shuffled = [...colors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return colors.sort((a, b) => {
    try {
      switch (method) {
        case 'lightness_desc': {
          const lightnessA = chroma(a).get('hsl.l');
          const lightnessB = chroma(b).get('hsl.l');
          return lightnessB - lightnessA; // 明るい→暗い
        }
        case 'lightness_asc': {
          const lightnessA = chroma(a).get('hsl.l');
          const lightnessB = chroma(b).get('hsl.l');
          return lightnessA - lightnessB; // 暗い→明るい
        }
        case 'hue': {
          const hueA = chroma(a).get('hsl.h') || 0;
          const hueB = chroma(b).get('hsl.h') || 0;
          return hueA - hueB; // 色相順（赤→橙→黄→緑→青→紫）
        }
        case 'hue_distance': {
          if (!baseColor) {
            console.warn('hue_distance sorting requires baseColor parameter');
            return 0;
          }
          const baseHue = chroma(baseColor).get('hsl.h') || 0;
          const hueA = chroma(a).get('hsl.h') || 0;
          const hueB = chroma(b).get('hsl.h') || 0;
          const distanceA = getHueDistance(baseHue, hueA);
          const distanceB = getHueDistance(baseHue, hueB);
          return distanceA - distanceB; // 近い色相順（距離の小さい順）
        }
        case 'saturation_desc': {
          const satA = chroma(a).get('hsl.s');
          const satB = chroma(b).get('hsl.s');
          return satB - satA; // 鮮やか→くすんだ
        }
        case 'saturation_asc': {
          const satA = chroma(a).get('hsl.s');
          const satB = chroma(b).get('hsl.s');
          return satA - satB; // くすんだ→鮮やか
        }
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error sorting colors:', error);
      return 0;
    }
  });
};

// 後方互換性のための関数（既存コードで使用）
const sortColorsByLightness = (colors: string[], baseColor?: string): string[] => {
  return sortColorsByMethod(colors, CURRENT_SORT_METHOD, baseColor);
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
    baseColor: defaultColor,
    selectedColor: defaultColor,
    paintColor: defaultColor,
    recommendedColors: [],
    recommendedTones: sortColorsByLightness(filteredDefaultTones),
    selectedScheme: 'complementary',
    toneBaseColor: defaultColor,
    extractedColors: [],
    dominantColor: null,
    isQuantizationEnabled: true,

    setBaseColor: (color: string) => {
      set({ baseColor: color });
    },

    setSelectedColor: (color: string) => {
      set({ selectedColor: color });
      // デフォルトでトーン推薦も生成
      get().generateRecommendedTones(color);
      // 描画色も同時に更新（統一性保持）
      set({ paintColor: color });
    },

    setPaintColor: (color: string) => {
      set({ paintColor: color });
    },

    // ベース色選択時: ベースカラー、selectedColor、描画色をすべて更新
    setColorFromBase: (color: string) => {
      set({ 
        baseColor: color,
        selectedColor: color,
        paintColor: color 
      });
      // トーン推薦も新しいベース色で更新
      get().generateRecommendedTones(color);
      // 色相推薦も新しいベース色で更新
      get().generateRecommendedColors();
    },

    // 推薦色から選択時: selectedColorと描画色のみ更新、ベースカラーは維持
    setColorFromRecommendation: (color: string) => {
      set({ 
        selectedColor: color,
        paintColor: color 
      });
      // トーン推薦は新しい選択色で更新
      get().generateRecommendedTones(color);
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

      // ドミナントカラーを選択色に自動設定するのを停止（ユーザーの描画色を維持）
      // get().setSelectedColor(dominantColor.hex);
    },


    generateRecommendedColors: () => {
      const { baseColor, selectedScheme } = get();
      try {
        const baseColorChroma = chroma(baseColor);
        const hue = baseColorChroma.get('hsl.h') || 0;
        const saturation = baseColorChroma.get('hsl.s');
        const lightness = baseColorChroma.get('hsl.l');

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

        // 設定されたソート手法でソート（色相距離ソートの場合はbaseColorを渡す）
        const sortedRecommendations = sortColorsByLightness(recommendations, baseColor);

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

        // 明るい→暗い順でソート（色相推薦と統一）
        const sortedTones = sortColorsByLightness(tones);
        console.log('Generated tones order (sorted by lightness):',
          sortedTones.slice(0, 4).map((tone, i) => `${i}: ${tone}`));
        set({ recommendedTones: sortedTones, toneBaseColor: baseColor });
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

// 抽出された色の色相を分析する関数
export const analyzeExtractedHues = (extractedColors: ExtractedColor[]): number[] => {
  const hues: number[] = [];
  
  extractedColors.forEach(color => {
    try {
      const hue = chroma(color.hex).get('hsl.h');
      if (typeof hue === 'number' && !isNaN(hue)) {
        hues.push(hue);
      }
    } catch (error) {
      console.error('Error analyzing hue for color:', color.hex, error);
    }
  });
  
  return hues;
};

// 配色技法の適合度を計算する関数
export const calculateSchemeCompatibility = (
  extractedColors: ExtractedColor[], 
  selectedColor: string, 
  scheme: ColorScheme
): number => {
  if (extractedColors.length === 0) return 0;
  
  try {
    const baseHue = chroma(selectedColor).get('hsl.h') || 0;
    const extractedHues = analyzeExtractedHues(extractedColors);
    
    if (extractedHues.length === 0) return 0;
    
    // 配色技法の期待色相を計算
    const expectedHues = scheme.angles.map(angle => (baseHue + angle) % 360);
    
    let compatibilityScore = 0;
    let totalWeight = 0;
    
    // 抽出された色相と期待色相の適合度を計算
    extractedColors.forEach((extractedColor, index) => {
      if (index >= extractedHues.length) return;
      
      const extractedHue = extractedHues[index];
      const weight = extractedColor.usage; // 使用率を重みとして使用
      
      // 最も近い期待色相との距離を計算
      let minDistance = Infinity;
      expectedHues.forEach(expectedHue => {
        const distance = Math.min(
          Math.abs(extractedHue - expectedHue),
          360 - Math.abs(extractedHue - expectedHue)
        );
        minDistance = Math.min(minDistance, distance);
      });
      
      // 距離が小さいほど適合度が高い（最大30度の許容範囲）
      const similarity = Math.max(0, 1 - minDistance / 30);
      compatibilityScore += similarity * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? compatibilityScore / totalWeight : 0;
  } catch (error) {
    console.error('Error calculating scheme compatibility:', error);
    return 0;
  }
};

// 配色技法の色相距離を計算する関数
const calculateSchemeHueDistance = (scheme: ColorScheme, baseColor: string): number => {
  try {
    const baseHue = chroma(baseColor).get('hsl.h') || 0;
    
    // 各配色角度との距離を計算し、平均距離を求める
    const distances = scheme.angles.map(angle => {
      const targetHue = (baseHue + angle) % 360;
      return getHueDistance(baseHue, targetHue);
    });
    
    // 平均距離を返す（近い色相順でソートするため）
    return distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
  } catch (error) {
    console.error('Error calculating scheme hue distance:', error);
    return Infinity; // エラー時は最後尾に配置
  }
};

// 配色技法を色相距離順にソートする関数（近い色相を好むユーザ向け）
export const sortSchemesByHueDistance = (
  baseColor: string,
  schemes: ColorScheme[] = COLOR_SCHEMES
): ColorScheme[] => {
  // 各配色技法の色相距離を計算
  const schemesWithDistances = schemes.map(scheme => ({
    scheme,
    hueDistance: calculateSchemeHueDistance(scheme, baseColor)
  }));
  
  // 色相距離順にソート（近い順）
  schemesWithDistances.sort((a, b) => a.hueDistance - b.hueDistance);
  
  console.log('Scheme hue distances:', schemesWithDistances.map(s => ({
    name: s.scheme.name.split(':')[0],
    distance: s.hueDistance.toFixed(1)
  })));
  
  return schemesWithDistances.map(s => s.scheme);
};

// 配色技法を適合度順にソートする関数
export const sortSchemesByCompatibility = (
  extractedColors: ExtractedColor[],
  selectedColor: string,
  schemes: ColorScheme[] = COLOR_SCHEMES
): ColorScheme[] => {
  if (extractedColors.length === 0) {
    // 抽出色がない場合はデフォルト順序
    return [...schemes];
  }
  
  // 各配色技法の適合度を計算
  const schemesWithScores = schemes.map(scheme => ({
    scheme,
    compatibility: calculateSchemeCompatibility(extractedColors, selectedColor, scheme)
  }));
  
  // 適合度順にソート（降順）
  schemesWithScores.sort((a, b) => b.compatibility - a.compatibility);
  
  console.log('Scheme compatibility scores:', schemesWithScores.map(s => ({
    name: s.scheme.name.split(':')[0],
    score: s.compatibility.toFixed(3)
  })));
  
  return schemesWithScores.map(s => s.scheme);
};

// 初期化時にデフォルトの推薦色とトーン推薦を生成
const initialState = useColorStore.getState();
initialState.generateRecommendedColors();
initialState.generateRecommendedTones(initialState.selectedColor);