// レイアウト設定定数
export const LAYOUT_CONFIG = {
  // デスクトップレイアウト設定
  desktop: {
    // 3列レイアウト: [キャンバス, メインツール, 分析ツール]
    columns: [
      {
        id: 'canvas',
        width: 'w-7/12', // 7/12幅（約58.3%）に拡大
        components: ['canvasColorRecommendation']
      },
      {
        id: 'main-tools', 
        width: 'w-1/4', // 1/4幅（25%）維持
        components: ['baseColor', 'colorRecommendation', 'toneRecommendation', 'skinColor']
      },
      {
        id: 'analysis',
        width: 'w-1/6', // 1/6幅（約16.7%）に縮小
        components: ['hueToneExtraction']
      }
    ],
    gap: 'gap-6'
  },
  
  // モバイルレイアウト設定（縦積み）
  mobile: {
    order: ['canvasColorRecommendation', 'baseColor', 'colorRecommendation', 'toneRecommendation', 'skinColor', 'hueToneExtraction']
  }
} as const;

// コンポーネント定義
export const COMPONENT_CONFIG = {
  canvas: {
    key: 'canvas',
    step: '0-before',
    titleKey: 'app.steps.canvas',
    collapseState: 'isCanvasCollapsed',
    hasUpdateButton: false
  },
  baseColor: {
    key: 'baseColor', 
    step: '1',
    titleKey: 'app.steps.baseColorSelectionShort',
    collapseState: 'isBaseColorCollapsed',
    hasUpdateButton: true
  },
  colorRecommendation: {
    key: 'colorRecommendation',
    step: '2', 
    titleKey: 'app.steps.colorRecommendationShort',
    collapseState: 'isColorRecommendationCollapsed',
    hasUpdateButton: false
  },
  toneRecommendation: {
    key: 'toneRecommendation',
    step: '3',
    titleKey: 'app.steps.toneRecommendationShort', 
    collapseState: 'isToneRecommendationCollapsed',
    hasUpdateButton: false
  },
  skinColor: {
    key: 'skinColor',
    step: 'α',
    titleKey: 'app.steps.skinColorRecommendation',
    collapseState: 'isSkinColorCollapsed', 
    hasUpdateButton: false
  },
  hueToneExtraction: {
    key: 'hueToneExtraction',
    step: 'β',
    titleKey: 'app.steps.hueToneExtraction',
    collapseState: 'isHueToneExtractionCollapsed',
    hasUpdateButton: true
  },
  canvasColorRecommendation: {
    key: 'canvasColorRecommendation',
    step: '0',
    titleKey: 'app.steps.canvasColorRecommendation',
    collapseState: 'isCanvasColorRecommendationCollapsed',
    hasUpdateButton: false
  }
} as const;

export type ComponentKey = keyof typeof COMPONENT_CONFIG;
export type LayoutColumn = typeof LAYOUT_CONFIG.desktop.columns[number];