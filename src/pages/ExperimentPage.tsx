import { type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { LayoutRenderer } from '@/components/layout/LayoutRenderer';
import { ExperimentHeader } from '@/components/ExperimentHeader';
import { ExperimentInstructions } from '@/components/ExperimentInstructions';
import { EXPERIMENT_LAYOUT_CONFIG } from '@/constants/layout';
import { useExperimentStore } from '@/store/experimentStore';
import { useExperimentQuery } from '@/hooks/useQueryParams';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * 実験ページコンポーネント
 *
 * URLクエリパラメータ ?cond=C0〜C3 に応じて機能を制御
 * - C0: 推薦なし
 * - C1: 色相推薦のみ
 * - C2: トーン推薦のみ
 * - C3: 二段階推薦（すべて）
 * デバッグモード対応（?debug=true）
 */
const ExperimentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDebugMode = searchParams.get('debug') === 'true';

  // URLから条件を読み取る
  useExperimentQuery();

  const { condition, isExperimentRunning, participantId, getFeatureFlags } = useExperimentStore();
  const featureFlags = getFeatureFlags();

  // 参加者IDが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    if (!participantId) {
      navigate('/experiment');
    }
  }, [participantId, navigate]);

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // デバイス判定（閾値800px）
  const isMobile = screenSize.width < 800;

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

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);

    // localStorageから設定を読み込み、なければダークモードをデフォルトに設定
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // 画面サイズを取得・更新する関数
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 初期画面サイズ設定
    updateScreenSize();

    // リサイズイベントリスナー
    window.addEventListener('resize', updateScreenSize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', updateScreenSize);
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
   * Test1: massColorGrid のみ表示、baseColor 非表示
   * Test2: hueWheelToneSlider のみ表示、baseColor 非表示
   * Test3: colorRecommendation, toneRecommendation, baseColor 表示
   *
   * 実験中は常に除外:
   * - skinColor (肌色推薦)
   * - hueToneExtraction (使用色相/トーン抽出)
   */
  const filterComponentsByCondition = (components: readonly string[]): readonly string[] => {
    return components.filter(componentKey => {
      // 実験中は肌色推薦を非表示
      if (componentKey === 'skinColor') {
        return false;
      }

      // 実験中は使用色相/トーン抽出を非表示
      if (componentKey === 'hueToneExtraction') {
        return false;
      }

      // Test1・Test2ではベース色選択を非表示
      if (componentKey === 'baseColor' && (condition === 'Test1' || condition === 'Test2')) {
        return false;
      }

      // 大量色グリッドはTest1のみ表示
      if (componentKey === 'massColorGrid' && !featureFlags.MASS_COLOR_GRID_ON) {
        return false;
      }

      // 色相環＋トーンスライダーはTest2のみ表示
      if (componentKey === 'hueWheelToneSlider' && !featureFlags.HUE_WHEEL_SLIDER_ON) {
        return false;
      }

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

  // 条件に応じてフィルタリングされたレイアウト設定（実験専用レイアウトを使用）
  const filteredColumnsWithEmpty = EXPERIMENT_LAYOUT_CONFIG.desktop.columns.map(column => ({
    ...column,
    components: filterComponentsByCondition(column.components),
  }));

  // 空の列を除外
  const filteredColumns = filteredColumnsWithEmpty.filter(column => column.components.length > 0);

  // 列数に応じて幅を再調整
  const adjustedColumns = filteredColumns.map((column, index) => {
    if (filteredColumns.length === 2) {
      // 2列の場合: キャンバス 2/3、メインツール 1/3
      return {
        ...column,
        width: index === 0 ? ('w-2/3' as const) : ('w-1/3' as const)
      };
    } else if (filteredColumns.length === 1) {
      // 1列の場合: 全幅
      return {
        ...column,
        width: 'w-full' as const
      };
    }
    // 3列の場合: 元の幅を維持
    return column;
  }) as any;

  const deviceType = isMobile ? 'MOBILE/TABLET' : 'DESKTOP';

  // 参加者IDが未設定の場合は何も表示しない（リダイレクト中）
  if (!participantId) {
    return null;
  }

  return (
    <main className="flex-1 pb-2 min-h-0 flex flex-col" style={isDebugMode ? { backgroundColor: '#607d8b', padding: '16px' } : {}}>
      {/* 実験ヘッダー */}
      <div className="px-4 pt-2">
        <ExperimentHeader canvasRef={canvasColorRecommendationsRef} isDebugMode={isDebugMode} />
      </div>

      {/* 条件説明 */}
      <div className="px-4">
        <ExperimentInstructions condition={condition} />
      </div>

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
          columns={adjustedColumns}
          isMobile={true}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-1`} style={isDebugMode ? { backgroundColor: '#795548', padding: '12px' } : {}}>
        <LayoutRenderer
          columns={adjustedColumns}
          isMobile={false}
          isDebugMode={isDebugMode}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </main>
  );
};

export default ExperimentPage;
