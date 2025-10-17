import { type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { LayoutRenderer } from '@/components/layout/LayoutRenderer';
import { ExperimentHeader } from '@/components/ExperimentHeader';
import { ExperimentInstructions } from '@/components/ExperimentInstructions';
import { LAYOUT_CONFIG } from '@/constants/layout';
import { useExperimentStore } from '@/store/experimentStore';
import { useExperimentQuery } from '@/hooks/useQueryParams';
import { useEffect, useState, useRef } from 'react';

/**
 * 実験ページコンポーネント
 *
 * URLクエリパラメータ ?cond=C0〜C3 に応じて機能を制御
 * - C0: 推薦なし
 * - C1: 色相推薦のみ
 * - C2: トーン推薦のみ
 * - C3: 二段階推薦（すべて）
 */
const ExperimentPage = () => {
  // URLから条件を読み取る
  useExperimentQuery();

  const { condition, isExperimentRunning, getFeatureFlags } = useExperimentStore();
  const featureFlags = getFeatureFlags();

  const [isDebugMode, setIsDebugMode] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // デバイス判定（閾値800px）
  const isMobile = screenSize.width < 800;

  // コラプス状態をオブジェクトで管理
  const [collapseStates, setCollapseStates] = useState({
    isCanvasCollapsed: false,
    isBaseColorCollapsed: false,
    isColorRecommendationCollapsed: false,
    isToneRecommendationCollapsed: false,
    isSkinColorCollapsed: true,
    isHueToneExtractionCollapsed: false,
    isCanvasColorRecommendationCollapsed: false,
  });

  // CanvasColorRecommendationsへの参照
  const canvasColorRecommendationsRef = useRef<CanvasColorRecommendationsRef>(null);

  // 画像アップロード時の処理
  const handleImageUpload = (imageFile: File) => {
    console.log('Image uploaded, drawing to canvas:', imageFile.name);
    canvasColorRecommendationsRef.current?.drawImageToCanvas(imageFile);
  };

  // キャンバスから色を抽出する処理
  const handleExtractColorsFromCanvas = async () => {
    try {
      console.log('Attempting to extract colors from canvas...');

      if (!canvasColorRecommendationsRef.current) {
        console.error('CanvasColorRecommendations ref is null');
        return;
      }

      await canvasColorRecommendationsRef.current.extractColorsFromCanvas();
      console.log('Color extraction completed successfully');
    } catch (error) {
      console.error('Canvas color extraction failed:', error);
    }
  };

  // コラプス状態更新用ヘルパー
  const setCollapseState = (key: string, value: boolean) => {
    setCollapseStates(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);

    // ダークモードをデフォルトに設定
    document.documentElement.classList.add('dark');

    // 画面サイズを取得・更新する関数
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 初期画面サイズ設定
    updateScreenSize();

    // F5キーでデバッグモード切り替え
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault();
        setIsDebugMode(prev => !prev);
      }
    };

    // リサイズイベントリスナー
    window.addEventListener('resize', updateScreenSize);
    document.addEventListener('keydown', handleKeyDown);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', updateScreenSize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 初期スクロール位置を60px下に設定
  useEffect(() => {
    const setScrollPosition = () => {
      window.scrollTo({ top: 60, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 60;
      document.body.scrollTop = 60;
    };

    setScrollPosition();

    const rafId = requestAnimationFrame(() => {
      setScrollPosition();
    });

    const timerId = setTimeout(() => {
      setScrollPosition();
    }, 0);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, []);

  /**
   * 条件に応じてコンポーネントをフィルタリング
   *
   * C0: colorRecommendation, toneRecommendation を除外
   * C1: toneRecommendation を除外
   * C2: colorRecommendation を除外
   * C3: すべて表示
   */
  const filterComponentsByCondition = (components: readonly string[]): readonly string[] => {
    return components.filter(componentKey => {
      // 色相推薦を表示するかチェック
      if (componentKey === 'colorRecommendation' && !featureFlags.HUE_RECO_ON) {
        return false;
      }

      // トーン推薦を表示するかチェック
      if (componentKey === 'toneRecommendation' && !featureFlags.TONE_RECO_ON) {
        return false;
      }

      // その他のコンポーネントは常に表示
      return true;
    });
  };

  // 条件に応じてフィルタリングされたレイアウト設定
  const filteredColumns = LAYOUT_CONFIG.desktop.columns.map(column => ({
    ...column,
    components: filterComponentsByCondition(column.components),
  })) as any;

  const deviceType = isMobile ? 'MOBILE/TABLET' : 'DESKTOP';

  return (
    <main className="flex-1 pb-2 min-h-0 flex flex-col" style={isDebugMode ? { backgroundColor: '#607d8b', padding: '16px' } : {}}>
      {/* 実験ヘッダー */}
      <div className="px-4 pt-2">
        <ExperimentHeader />
      </div>

      {/* 実験説明（実験開始前のみ表示） */}
      {!isExperimentRunning && (
        <div className="px-4">
          <ExperimentInstructions condition={condition} />
        </div>
      )}

      {/* デバッグ情報表示 */}
      {isDebugMode && (
        <div className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded text-xs font-mono">
          <div>画面: {screenSize.width}x{screenSize.height}</div>
          <div>デバイス: {deviceType}</div>
          <div>条件: {condition}</div>
          <div>色相推薦: {featureFlags.HUE_RECO_ON ? 'ON' : 'OFF'}</div>
          <div>トーン推薦: {featureFlags.TONE_RECO_ON ? 'ON' : 'OFF'}</div>
          <div>実験中: {isExperimentRunning ? 'YES' : 'NO'}</div>
        </div>
      )}

      {/* モバイル表示 */}
      <div className={`${isMobile ? 'flex' : 'hidden'}`}>
        {isDebugMode && (
          <div className="bg-red-600 text-white p-2 text-center font-bold">
            📱 MOBILE/TABLET LAYOUT (&lt;800px)
          </div>
        )}
        <LayoutRenderer
          columns={filteredColumns}
          isMobile={true}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
          collapseStates={collapseStates}
          setCollapseState={setCollapseState}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-1`} style={isDebugMode ? { backgroundColor: '#795548', padding: '12px' } : {}}>
        <LayoutRenderer
          columns={filteredColumns}
          isMobile={false}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
          collapseStates={collapseStates}
          setCollapseState={setCollapseState}
        />
      </div>
    </main>
  );
};

export default ExperimentPage;
