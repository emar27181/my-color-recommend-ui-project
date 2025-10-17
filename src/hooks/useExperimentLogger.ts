import { useExperimentStore } from '@/store/experimentStore';

/**
 * 実験イベントログを記録するためのカスタムフック
 *
 * 各種UIイベントを簡単にログに記録できるヘルパー関数を提供
 */
export const useExperimentLogger = () => {
  const { recordEvent, isExperimentRunning } = useExperimentStore();

  // カラーピッカーで色を選択
  const logColorPick = (color: string, target?: string) => {
    if (isExperimentRunning) {
      recordEvent('color_pick', color, target);
    }
  };

  // 推薦色をクリック
  const logRecommendationClick = (color: string, recommendationType: 'hue' | 'tone', target?: string) => {
    if (isExperimentRunning) {
      recordEvent('recommendation_click', color, target || recommendationType);
    }
  };

  // 推薦色を採用（描画色として設定）
  const logApplyColor = (color: string, target?: string) => {
    if (isExperimentRunning) {
      recordEvent('apply_color', color, target);
    }
  };

  // 配色技法を変更
  const logSchemeChange = (schemeId: string) => {
    if (isExperimentRunning) {
      recordEvent('scheme_change', schemeId, 'color_scheme');
    }
  };

  // 画像をアップロード
  const logImageUpload = (fileName: string) => {
    if (isExperimentRunning) {
      recordEvent('image_upload', fileName, 'upload');
    }
  };

  // 抽出色をクリック
  const logExtractedColorClick = (color: string) => {
    if (isExperimentRunning) {
      recordEvent('extracted_color_click', color, 'extracted_colors');
    }
  };

  // キャンバスで描画
  const logCanvasDraw = (color: string, tool: 'pen' | 'eraser' | 'fill') => {
    if (isExperimentRunning) {
      recordEvent('canvas_draw', color, tool);
    }
  };

  // Undo/Redo操作
  const logCanvasAction = (action: 'undo' | 'redo' | 'clear') => {
    if (isExperimentRunning) {
      recordEvent('canvas_action', action, 'canvas');
    }
  };

  // 汎用イベントログ
  const logCustomEvent = (type: string, value: string, target?: string) => {
    if (isExperimentRunning) {
      recordEvent(type, value, target);
    }
  };

  return {
    logColorPick,
    logRecommendationClick,
    logApplyColor,
    logSchemeChange,
    logImageUpload,
    logExtractedColorClick,
    logCanvasDraw,
    logCanvasAction,
    logCustomEvent,
    isExperimentRunning,
  };
};
