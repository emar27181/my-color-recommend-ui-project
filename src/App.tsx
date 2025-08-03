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
  const [isPaintCanvasCollapsed, setIsPaintCanvasCollapsed] = useState(false);

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);

    // ダークモードをデフォルトに設定
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <main className="flex-1 px-4 pb-2 overflow-y-auto">
      {/* Mobile/Tablet: Single Screen Layout */}
      <div className="block xl:hidden flex flex-col">
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
            <h3 
              className="text-xs font-medium mb-0 text-foreground leading-tight cursor-pointer flex items-center justify-between"
              onClick={() => setIsPaintCanvasCollapsed(!isPaintCanvasCollapsed)}
            >
              <span>β. 試し塗りキャンバス</span>
              {isPaintCanvasCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </h3>
            {!isPaintCanvasCollapsed && <PaintCanvas />}
          </section>
        </div>
      </div>

      {/* Desktop: Single Screen Layout */}
      <div className="hidden xl:block h-full flex flex-col">
        {/* Step 1: ベース色選択 - 上部コンパクト配置 */}
        <section className="flex-shrink-0 mb-2">
          <h2 
            className="text-lg font-medium mb-1 text-foreground cursor-pointer flex items-center justify-between"
            onClick={() => setIsBaseColorCollapsed(!isBaseColorCollapsed)}
          >
            <span>1. {t('app.steps.baseColorSelectionShort')}</span>
            {isBaseColorCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </h2>
          {!isBaseColorCollapsed && (
            <div className="grid grid-cols-3 gap-4">
              <ColorPicker />
              <ImageUpload />
              <ExtractedColorsDisplay />
            </div>
          )}
        </section>

        {/* Steps 2, 3, 4 & 5: 色相推薦・トーン推薦・肌色推薦・試し塗りキャンバス - 並列表示 */}
        <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
          <section className="min-h-0 flex flex-col">
            <h2 
              className="text-lg font-medium mb-1 text-foreground flex-shrink-0 cursor-pointer flex items-center justify-between"
              onClick={() => setIsColorRecommendationCollapsed(!isColorRecommendationCollapsed)}
            >
              <span>2. {t('app.steps.colorRecommendationShort')}</span>
              {isColorRecommendationCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h2>
            {!isColorRecommendationCollapsed && (
              <div className="flex-1 min-h-0">
                <ColorRecommendations />
              </div>
            )}
          </section>
          <section className="min-h-0 flex flex-col">
            <h2 
              className="text-lg font-medium mb-1 text-foreground flex-shrink-0 cursor-pointer flex items-center justify-between"
              onClick={() => setIsToneRecommendationCollapsed(!isToneRecommendationCollapsed)}
            >
              <span>3. {t('app.steps.toneRecommendationShort')}</span>
              {isToneRecommendationCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h2>
            {!isToneRecommendationCollapsed && (
              <div className="flex-1 min-h-0">
                <ToneRecommendations />
              </div>
            )}
          </section>
          <section className="min-h-0 flex flex-col">
            <h2 
              className="text-lg font-medium mb-1 text-foreground flex-shrink-0 cursor-pointer flex items-center justify-between"
              onClick={() => setIsSkinColorCollapsed(!isSkinColorCollapsed)}
            >
              <span>α. 肌色推薦</span>
              {isSkinColorCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h2>
            {!isSkinColorCollapsed && (
              <div className="flex-1 min-h-0">
                <SkinColorRecommendations />
              </div>
            )}
          </section>
          <section className="min-h-0 flex flex-col mb-0">
            <h2 
              className="text-lg font-medium mb-1 text-foreground flex-shrink-0 cursor-pointer flex items-center justify-between"
              onClick={() => setIsPaintCanvasCollapsed(!isPaintCanvasCollapsed)}
            >
              <span>β. 試し塗りキャンバス</span>
              {isPaintCanvasCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </h2>
            {!isPaintCanvasCollapsed && (
              <div className="flex-1 min-h-0">
                <PaintCanvas />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;