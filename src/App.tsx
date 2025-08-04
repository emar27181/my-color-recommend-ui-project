import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { SkinColorRecommendations } from '@/components/SkinColorRecommendations';
import { PaintCanvas } from '@/components/PaintCanvas';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
const App = () => {
  const { t } = useTranslation();
  const [isBaseColorCollapsed, setIsBaseColorCollapsed] = useState(false);
  const [isColorRecommendationCollapsed, setIsColorRecommendationCollapsed] = useState(false);
  const [isToneRecommendationCollapsed, setIsToneRecommendationCollapsed] = useState(false);
  const [isSkinColorCollapsed, setIsSkinColorCollapsed] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);

    // ダークモードをデフォルトに設定
    document.documentElement.classList.add('dark');

    // F5キーでデバッグモード切り替え
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault(); // ページリロードを防ぐ
        setIsDebugMode(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="flex-1 pb-2 min-h-0 flex flex-col" style={isDebugMode ? { backgroundColor: 'green' } : {}}>
      {/* Mobile/Tablet: Single Screen Layout */}
      <div className="hidden flex flex-col overflow-y-auto">
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
            <>
              <div className="flex gap-1">
                <div className="flex-1">
                  <ColorPicker />
                </div>
                <div className="flex-1">
                  <ImageUpload />
                </div>
              </div>
              <ExtractedColorsDisplay />
            </>
          )}
        </section>

        {/* Steps 2, 3 & 4: 色相推薦・トーン推薦・肌色推薦 - 動的サイズ */}
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
            {!isColorRecommendationCollapsed && <ColorRecommendations />}
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
            {!isToneRecommendationCollapsed && <ToneRecommendations />}
          </section>

          {/* Step 4 */}
          <section>
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsSkinColorCollapsed(!isSkinColorCollapsed)}
            >
              <span>α. 肌色推薦</span>
              {isSkinColorCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isSkinColorCollapsed && <SkinColorRecommendations />}
          </section>

          {/* Step 5: Paint Canvas - Tablet and larger */}
          <section className="md:block">
            <PaintCanvas />
          </section>
        </div>
      </div>

      {/* Desktop: Left Canvas + Right Color Tools Layout */}
      <div className="flex flex-1 gap-6" style={isDebugMode ? { padding: '32px', backgroundColor: 'yellow' } : { padding: '16px' }}>
        {/* Left: Paint Canvas */}
        <div className="w-1/2 flex flex-col min-h-0" style={isDebugMode ? { padding: '32px', backgroundColor: 'red' } : { padding: '16px' }}>
          {isDebugMode && <h1 className="text-4xl text-black">LEFT PANEL</h1>}
          <PaintCanvas />
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
              <div className="grid grid-cols-3 gap-4">
                <ColorPicker />
                <ImageUpload />
                <ExtractedColorsDisplay />
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
            {!isColorRecommendationCollapsed && <ColorRecommendations />}
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
            {!isToneRecommendationCollapsed && <ToneRecommendations />}
          </section>

          {/* Step 4: 肌色推薦 */}
          <section className="flex-shrink-0">
            <h3 
              className="text-lg font-medium mb-2 text-foreground cursor-pointer flex items-center justify-between"
              onClick={() => setIsSkinColorCollapsed(!isSkinColorCollapsed)}
            >
              <span>α. 肌色推薦</span>
              {isSkinColorCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h3>
            {!isSkinColorCollapsed && <SkinColorRecommendations />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;