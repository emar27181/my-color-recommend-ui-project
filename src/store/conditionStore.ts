import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 実験条件の型定義
export type ExperimentCondition = 'C0' | 'C1' | 'C2' | 'C3';

// 実験条件の詳細情報
export interface ConditionInfo {
  id: ExperimentCondition;
  label: string;
  labelEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  HUE_RECO_ON: boolean;
  TONE_RECO_ON: boolean;
  HARMONY_RANK_ON: boolean;
}

// 実験条件の定義
export const CONDITIONS: Record<ExperimentCondition, ConditionInfo> = {
  C0: {
    id: 'C0',
    label: '推薦なし（通常UI）',
    labelEn: 'No Recommendations',
    icon: '🔘',
    description: '色推薦機能なしの基本UI',
    descriptionEn: 'Basic UI without color recommendations',
    HUE_RECO_ON: false,
    TONE_RECO_ON: false,
    HARMONY_RANK_ON: false,
  },
  C1: {
    id: 'C1',
    label: '色相推薦のみ',
    labelEn: 'Hue Recommendations Only',
    icon: '🎨',
    description: '色相環に基づく配色推薦のみ表示',
    descriptionEn: 'Show only hue-based color recommendations',
    HUE_RECO_ON: true,
    TONE_RECO_ON: false,
    HARMONY_RANK_ON: false,
  },
  C2: {
    id: 'C2',
    label: 'トーン推薦のみ',
    labelEn: 'Tone Recommendations Only',
    icon: '🧭',
    description: '明度・彩度調整の推薦のみ表示',
    descriptionEn: 'Show only lightness/saturation tone recommendations',
    HUE_RECO_ON: false,
    TONE_RECO_ON: true,
    HARMONY_RANK_ON: false,
  },
  C3: {
    id: 'C3',
    label: '二段階推薦（色相＋トーン）',
    labelEn: 'Two-Stage Recommendations',
    icon: '🌈',
    description: '色相推薦とトーン推薦の両方を表示（ハーモニー順位づけ含む）',
    descriptionEn: 'Show both hue and tone recommendations with harmony ranking',
    HUE_RECO_ON: true,
    TONE_RECO_ON: true,
    HARMONY_RANK_ON: true,
  },
};

interface ConditionState {
  condition: ExperimentCondition;
  isExperimentMode: boolean; // 実験モード時はUI要素を表示
  setCondition: (condition: ExperimentCondition) => void;
  setExperimentMode: (enabled: boolean) => void;
  getFlags: () => {
    HUE_RECO_ON: boolean;
    TONE_RECO_ON: boolean;
    HARMONY_RANK_ON: boolean;
  };
}

// LocalStorage永続化付きのZustandストア
export const useConditionStore = create<ConditionState>()(
  persist(
    (set, get) => ({
      condition: 'C3', // デフォルトは二段階推薦（全機能有効）
      isExperimentMode: false, // デフォルトは実験モードOFF

      setCondition: (condition: ExperimentCondition) => {
        console.log('Condition changed:', condition, CONDITIONS[condition]);
        set({ condition });
      },

      setExperimentMode: (enabled: boolean) => {
        set({ isExperimentMode: enabled });
      },

      getFlags: () => {
        const { condition } = get();
        const conditionInfo = CONDITIONS[condition];
        return {
          HUE_RECO_ON: conditionInfo.HUE_RECO_ON,
          TONE_RECO_ON: conditionInfo.TONE_RECO_ON,
          HARMONY_RANK_ON: conditionInfo.HARMONY_RANK_ON,
        };
      },
    }),
    {
      name: 'experiment-condition-storage', // LocalStorageのキー名
    }
  )
);
