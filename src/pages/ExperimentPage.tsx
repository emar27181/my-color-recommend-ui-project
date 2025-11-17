import { type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { LayoutRenderer } from '@/components/layout/LayoutRenderer';
import { ExperimentHeader } from '@/components/ExperimentHeader';
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

  const { condition, participantId, material, getFeatureFlags } = useExperimentStore();
  const featureFlags = getFeatureFlags();

  // 参加者IDが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    if (!participantId) {
      navigate('/experiment');
    }
  }, [participantId, navigate]);

  // タスクに応じて画像を自動読み込み
  useEffect(() => {
    if (!canvasColorRecommendationsRef.current || !material) return;

    // materialに応じて画像URLを決定
    const imageUrl = material === 'taskA'
      ? '/images/illust_bear.png'  // TaskA: イラスト
      : '/images/logo_techloop.png'; // TaskB: ロゴ

    // 少し待ってからキャンバスに画像を読み込み（初期化完了を待つ）
    const timer = setTimeout(() => {
      canvasColorRecommendationsRef.current?.loadImageFromUrl(imageUrl);
      console.log(`Auto-loaded image for ${material}: ${imageUrl}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [material]);

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

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

  // スケールを計算（画面サイズに応じて最大化）
  useEffect(() => {
    if (!mainRef.current || screenSize.width === 0 || screenSize.height === 0) return;

    // コンテンツの自然なサイズを測定（scale-90を削除したベースサイズ）
    const contentWidth = mainRef.current.scrollWidth;
    const contentHeight = mainRef.current.scrollHeight;

    if (contentWidth === 0 || contentHeight === 0) return;

    // 画面サイズに対する比率を計算（余白を考慮して95%まで）
    const widthRatio = (screenSize.width * 0.95) / contentWidth;
    const heightRatio = (screenSize.height * 0.95) / contentHeight;

    // 小さい方の比率を採用（縦横どちらかが幅いっぱいになる）
    const newScale = Math.min(widthRatio, heightRatio, 1.2); // 最大120%まで

    setScale(newScale);
    console.log(`Scale calculated: ${newScale.toFixed(2)} (width: ${widthRatio.toFixed(2)}, height: ${heightRatio.toFixed(2)})`);
  }, [screenSize]);

  // 初期スクロール位置を最上端に設定
  useEffect(() => {
    const setScrollPosition = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
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
   * UI1: massColorGrid のみ表示、baseColor 非表示
   * UI2: baseColor, colorRecommendation, toneRecommendation を表示
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

      // UI1のみベース色選択を非表示
      if (componentKey === 'baseColor' && condition === 'UI1') {
        return false;
      }

      // 大量色グリッドはUI1のみ表示
      if (componentKey === 'massColorGrid' && !featureFlags.MASS_COLOR_GRID_ON) {
        return false;
      }

      // 色相環＋トーンスライダーはUI2のみ表示
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

  // 参加者IDが未設定の場合は何も表示しない（リダイレクト中）
  if (!participantId) {
    return null;
  }

  return (
    <main
      ref={mainRef}
      className="flex-1 pb-1 min-h-0 flex flex-col origin-top"
      style={{ transform: `scale(${scale})` }}
    >
      {/* 実験ヘッダー */}
      <div className="px-4 pt-0 pb-0">
        <ExperimentHeader canvasRef={canvasColorRecommendationsRef} isDebugMode={isDebugMode} />
      </div>

      {/* モバイル表示 */}
      <div className={`${isMobile ? 'flex' : 'hidden'}`}>
        <LayoutRenderer
          columns={adjustedColumns}
          isMobile={true}
          isDebugMode={false}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-1`}>
        <LayoutRenderer
          columns={adjustedColumns}
          isMobile={false}
          isDebugMode={false}
          paintCanvasRef={canvasColorRecommendationsRef}
          handleExtractColorsFromCanvas={handleExtractColorsFromCanvas}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </main>
  );
};

export default ExperimentPage;
