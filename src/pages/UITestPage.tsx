import { type CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import { LayoutRenderer } from '@/components/layout/LayoutRenderer';
import { EXPERIMENT_LAYOUT_CONFIG } from '@/constants/layout';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TestTube2, ChevronUp, ChevronDown } from 'lucide-react';

type UICondition = 'UI1' | 'UI2';
type TaskType = 'taskA' | 'taskB' | 'taskC';

/**
 * UI テストページコンポーネント
 *
 * 追加されたテスト画像（illust_bear.png、logo_techloop.png）を使用して
 * UI1とUI2を自由に試すことができるページ
 */
const UITestPage = () => {
  const [uiCondition, setUICondition] = useState<UICondition>('UI1');
  const [task, setTask] = useState<TaskType>('taskC');
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
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

  // タスクに応じて画像を自動読み込み
  useEffect(() => {
    if (!canvasColorRecommendationsRef.current || !task) return;

    // taskに応じて画像URLを決定
    const imageUrl =
      task === 'taskA' ? '/images/illust_bear.png' :  // TaskA: イラスト（くま）
      task === 'taskB' ? '/images/logo_techloop.png' : // TaskB: ロゴ
      '/images/illust_leaf.png'; // TaskC: イラスト（葉）

    // 少し待ってからキャンバスに画像を読み込み（初期化完了を待つ）
    const timer = setTimeout(() => {
      canvasColorRecommendationsRef.current?.loadImageFromUrl(imageUrl);
      console.log(`Auto-loaded image for ${task}: ${imageUrl}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [task]);

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

    // コンテンツの自然なサイズを測定
    const contentWidth = mainRef.current.scrollWidth;
    const contentHeight = mainRef.current.scrollHeight;

    if (contentWidth === 0 || contentHeight === 0) return;

    // 画面サイズに対する比率を計算（余白を考慮して95%まで）
    const widthRatio = (screenSize.width * 0.95) / contentWidth;
    const heightRatio = (screenSize.height * 0.95) / contentHeight;

    // 小さい方の比率を採用（縦横どちらかが幅いっぱいになる）
    const newScale = Math.min(widthRatio, heightRatio, 1.2); // 最大120%まで

    setScale(newScale);
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

  // 機能フラグを取得
  const getFeatureFlags = () => {
    return {
      MASS_COLOR_GRID_ON: uiCondition === 'UI1',   // UI1: 全色相×複数トーンのグリッド表示
      HUE_WHEEL_SLIDER_ON: false,
      HUE_RECO_ON: uiCondition === 'UI2',          // UI2: 色相推薦
      TONE_RECO_ON: uiCondition === 'UI2',         // UI2: トーン推薦
    };
  };

  const featureFlags = getFeatureFlags();

  /**
   * 条件に応じてコンポーネントをフィルタリング
   */
  const filterComponentsByCondition = (components: readonly string[]): readonly string[] => {
    return components.filter(componentKey => {
      // 肌色推薦を非表示
      if (componentKey === 'skinColor') {
        return false;
      }

      // 使用色相/トーン抽出を非表示
      if (componentKey === 'hueToneExtraction') {
        return false;
      }

      // UI1のみベースカラー選択を非表示
      if (componentKey === 'baseColor' && uiCondition === 'UI1') {
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

  // 条件に応じてフィルタリングされたレイアウト設定
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* コントロールパネル */}
      <div className="px-4 pt-4 pb-2">
        <Card className="border-2 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TestTube2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl">UI テストページ</CardTitle>
              </div>
              <button
                onClick={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label={isControlPanelCollapsed ? '展開' : '折りたたむ'}
              >
                {isControlPanelCollapsed ? (
                  <ChevronDown className="w-5 h-5 text-foreground" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
            {!isControlPanelCollapsed && (
              <CardDescription>
                テスト用画像を使って UI1 と UI2 を自由に試すことができます
              </CardDescription>
            )}
          </CardHeader>
          {!isControlPanelCollapsed && <CardContent>
            <div className="space-y-6">
              {/* UI選択 */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">どちらのUIを試しますか？</Label>
                <div className="flex gap-6">
                  {['UI1', 'UI2'].map((ui) => (
                    <label key={ui} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="uiCondition"
                        value={ui}
                        checked={uiCondition === ui}
                        onChange={(e) => setUICondition(e.target.value as UICondition)}
                        className="w-5 h-5"
                      />
                      <span className="text-lg font-semibold">
                        {ui === 'UI1' ? 'UI1: 大量の色を一度に表示' : 'UI2: 二段階推薦'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* タスク選択 */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">どの画像を塗りますか？</Label>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'taskA', label: 'TaskA: イラスト（くま）' },
                    { value: 'taskB', label: 'TaskB: ロゴ（TechLoop）' },
                    { value: 'taskC', label: 'TaskC: イラスト（葉）' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="task"
                        value={option.value}
                        checked={task === option.value}
                        onChange={(e) => setTask(e.target.value as TaskType)}
                        className="w-5 h-5"
                      />
                      <span className="text-lg font-semibold">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 現在の設定表示 */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <div className="text-sm font-mono">
                <span className="font-semibold">現在の設定:</span> {uiCondition} × {
                  task === 'taskA' ? 'イラスト（くま）' :
                  task === 'taskB' ? 'ロゴ' :
                  'イラスト（葉）'
                }
              </div>
            </div>
          </CardContent>}
        </Card>
      </div>

      {/* メインコンテンツ */}
      <main
        ref={mainRef}
        className="flex-1 pb-1 min-h-0 flex flex-col origin-top"
        style={{ transform: `scale(${scale})` }}
      >
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
    </div>
  );
};

export default UITestPage;
