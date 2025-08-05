import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { SkinColorRecommendations } from '@/components/SkinColorRecommendations';
import { PaintCanvas, type PaintCanvasRef } from '@/components/PaintCanvas';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
const App = () => {
  const { t } = useTranslation();
  const [isCanvasCollapsed, setIsCanvasCollapsed] = useState(false);
  const [isBaseColorCollapsed, setIsBaseColorCollapsed] = useState(false);
  const [isColorRecommendationCollapsed, setIsColorRecommendationCollapsed] = useState(false);
  const [isToneRecommendationCollapsed, setIsToneRecommendationCollapsed] = useState(false);
  const [isSkinColorCollapsed, setIsSkinColorCollapsed] = useState(true);
  const [isHueToneExtractionCollapsed, setIsHueToneExtractionCollapsed] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  
  // PaintCanvasへの参照
  const paintCanvasRef = useRef<PaintCanvasRef>(null);

  // 画像アップロード時の処理
  const handleImageUpload = (imageFile: File) => {
    console.log('Image uploaded, drawing to canvas:', imageFile.name);
    paintCanvasRef.current?.drawImageToCanvas(imageFile);
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
        event.preventDefault(); // ページリロードを防ぐ
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

  // デバイス判定（閾値800px）
  const isMobile = screenSize.width < 800;
  const deviceType = isMobile ? 'MOBILE/TABLET' : 'DESKTOP';

  return (
    <main className="flex-1 pb-2 min-h-0 flex flex-col" style={isDebugMode ? { backgroundColor: 'green' } : {}}>
      {/* デバッグ情報表示 */}
      {isDebugMode && (
        <div className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded text-xs font-mono">
          <div>画面: {screenSize.width}x{screenSize.height}</div>
          <div>デバイス: {deviceType}</div>
          <div>800px閾値: {screenSize.width >= 800 ? 'DESKTOP' : 'MOBILE'}</div>
        </div>
      )}

      {/* Mobile/Tablet: Single Screen Layout */}
      <div className={`${isMobile ? 'flex' : 'hidden'} flex-col overflow-y-auto`}>
        {isDebugMode && (
          <div className="bg-red-600 text-white p-2 text-center font-bold">
            📱 MOBILE/TABLET LAYOUT (&lt;800px)
          </div>
        )}
        
        {/* Step 0: Paint Canvas - モバイルでも表示 */}
        <section className="flex-shrink-0 mb-1">
          <h3 
            className="text-xs font-medium text-foreground leading-tight mb-0 cursor-pointer flex items-center justify-between"
            onClick={() => setIsCanvasCollapsed(!isCanvasCollapsed)}
          >
            <span>0. {t('app.steps.canvas')}</span>
            {isCanvasCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </h3>
          {!isCanvasCollapsed && (
            <PaintCanvas ref={paintCanvasRef} />
          )}
        </section>

        {/* Step 1: ベース色選択 - コンパクト化 */}
        <section className="flex-shrink-0 mb-1">
          <h3 
            className="text-xs font-medium text-foreground leading-tight mb-0 cursor-pointer flex items-center justify-between"
            onClick={() => setIsBaseColorCollapsed(!isBaseColorCollapsed)}
          >
            <span>1. {t('app.steps.baseColorSelection')}</span>
            {isBaseColorCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </h3>
          {!isBaseColorCollapsed && (
            <div className="space-y-1">
              {/* 1行目: カラーピッカー + 画像アップロード */}
              <div className="flex gap-1">
                <div className="flex-1">
                  <ColorPicker />
                </div>
                <div className="flex-1">
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
              </div>
              {/* 2行目: 抽出された色の割合表示 */}
              <ExtractedColorsDisplay isMobile={isMobile} />
            </div>
          )}
        </section>

        {/* Steps 2, 3, 4 & β: 色相推薦・トーン推薦・肌色推薦・使用色相/トーン抽出 - 動的サイズ */}
        <div className="space-y-1">
          {/* Step 2 */}
          <section>
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsColorRecommendationCollapsed(!isColorRecommendationCollapsed)}
            >
              <span>2. {t('app.steps.colorRecommendation')}</span>
              {isColorRecommendationCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isColorRecommendationCollapsed && <ColorRecommendations isMobile={isMobile} />}
          </section>

          {/* Step 3 */}
          <section>
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsToneRecommendationCollapsed(!isToneRecommendationCollapsed)}
            >
              <span>3. {t('app.steps.toneRecommendation')}</span>
              {isToneRecommendationCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isToneRecommendationCollapsed && <ToneRecommendations isMobile={isMobile} />}
          </section>

          {/* Step 4: 肌色推薦 */}
          <section>
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsSkinColorCollapsed(!isSkinColorCollapsed)}
            >
              <span>α. {t('app.steps.skinColorRecommendation')}</span>
              {isSkinColorCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isSkinColorCollapsed && <SkinColorRecommendations isMobile={isMobile} />}
          </section>

          {/* Step β: 使用色相/トーン抽出 */}
          <section>
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsHueToneExtractionCollapsed(!isHueToneExtractionCollapsed)}
            >
              <span>β. {t('app.steps.hueToneExtraction')}</span>
              {isHueToneExtractionCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isHueToneExtractionCollapsed && (
              <div className="pt-2 text-center text-sm text-muted-foreground">
{t('common.preparing')}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Desktop: Left Canvas + Right Color Tools Layout */}
      <div className={`${isMobile ? 'hidden' : 'flex'} flex-1 gap-6`} style={isDebugMode ? { padding: '32px', backgroundColor: 'yellow' } : { padding: '16px' }}>
        {isDebugMode && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded font-bold z-40">
            🖥️ DESKTOP LAYOUT (≥800px)
          </div>
        )}
        {/* Left: Paint Canvas */}
        <div className="w-1/2 flex flex-col min-h-0" style={isDebugMode ? { padding: '32px', backgroundColor: 'red' } : { padding: '16px' }}>
          {isDebugMode && <h1 className="text-4xl text-black">LEFT PANEL</h1>}
          <section className="flex-shrink-0 flex-1 flex flex-col min-h-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsCanvasCollapsed(!isCanvasCollapsed)}
            >
              <span>0. {t('app.steps.canvas')}</span>
              {isCanvasCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isCanvasCollapsed && (
              <div className="flex-1 min-h-0">
                <PaintCanvas ref={paintCanvasRef} />
              </div>
            )}
          </section>
        </div>

        {/* Right: Color Tools in Vertical Layout */}
        <div className="w-1/2 flex flex-col space-y-4 min-h-0 overflow-y-auto" style={isDebugMode ? { padding: '32px', backgroundColor: 'blue' } : { padding: '16px' }}>
          {isDebugMode && <h1 className="text-4xl text-black">RIGHT PANEL</h1>}
          {/* Step 1: ベース色選択 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsBaseColorCollapsed(!isBaseColorCollapsed)}
            >
              <span>1. {t('app.steps.baseColorSelectionShort')}</span>
              {isBaseColorCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isBaseColorCollapsed && (
              <div className="space-y-4">
                {/* 1行目: カラーピッカー + 画像アップロード */}
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker />
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
                {/* 2行目: 抽出された色の割合表示 */}
                <ExtractedColorsDisplay isMobile={isMobile} />
              </div>
            )}
          </section>

          {/* Step 2: 色相推薦 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsColorRecommendationCollapsed(!isColorRecommendationCollapsed)}
            >
              <span>2. {t('app.steps.colorRecommendationShort')}</span>
              {isColorRecommendationCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isColorRecommendationCollapsed && <ColorRecommendations isMobile={isMobile} />}
          </section>

          {/* Step 3: トーン推薦 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsToneRecommendationCollapsed(!isToneRecommendationCollapsed)}
            >
              <span>3. {t('app.steps.toneRecommendationShort')}</span>
              {isToneRecommendationCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isToneRecommendationCollapsed && <ToneRecommendations isMobile={isMobile} />}
          </section>

          {/* Step 4: 肌色推薦 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsSkinColorCollapsed(!isSkinColorCollapsed)}
            >
              <span>α. {t('app.steps.skinColorRecommendation')}</span>
              {isSkinColorCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isSkinColorCollapsed && <SkinColorRecommendations isMobile={isMobile} />}
          </section>

          {/* Step β: 使用色相/トーン抽出 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsHueToneExtractionCollapsed(!isHueToneExtractionCollapsed)}
            >
              <span>β. {t('app.steps.hueToneExtraction')}</span>
              {isHueToneExtractionCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isHueToneExtractionCollapsed && (
              <div className="pt-4 text-center text-lg text-muted-foreground">
{t('common.preparing')}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;