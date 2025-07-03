import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t } = useTranslation();
  
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
              <h3 className="text-xs font-medium text-foreground leading-tight mb-0">1. {t('app.steps.baseColorSelection')}</h3>
              <div className="flex gap-1">
                <div className="flex-1">
                  <ColorPicker />
                </div>
                <div className="flex-1">
                  <ImageUpload />
                </div>
              </div>
              <ExtractedColorsDisplay />
            </section>

            {/* Steps 2 & 3: 色相推薦・トーン推薦 - 動的サイズ */}
            <div className="space-y-1">
              {/* Step 2 */}
              <section>
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight">2. {t('app.steps.colorRecommendation')}</h3>
                <ColorRecommendations />
              </section>

              {/* Step 3 */}
              <section>
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight">3. {t('app.steps.toneRecommendation')}</h3>
                <ToneRecommendations />
              </section>
            </div>
          </div>

          {/* Desktop: Single Screen Layout */}
          <div className="hidden xl:block h-full flex flex-col">
            {/* Step 1: ベース色選択 - 上部コンパクト配置 */}
            <section className="flex-shrink-0 mb-2">
              <h2 className="text-lg font-medium mb-1 text-foreground">1. {t('app.steps.baseColorSelectionShort')}</h2>
              <div className="grid grid-cols-3 gap-4">
                <ColorPicker />
                <ImageUpload />
                <ExtractedColorsDisplay />
              </div>
            </section>

            {/* Steps 2 & 3: 色相推薦・トーン推薦 - 並列表示 */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
              <section className="min-h-0 flex flex-col">
                <h2 className="text-lg font-medium mb-1 text-foreground flex-shrink-0">2. {t('app.steps.colorRecommendationShort')}</h2>
                <div className="flex-1 min-h-0">
                  <ColorRecommendations />
                </div>
              </section>
              <section className="min-h-0 flex flex-col mb-0">
                <h2 className="text-lg font-medium mb-1 text-foreground flex-shrink-0">3. {t('app.steps.toneRecommendationShort')}</h2>
                <div className="flex-1 min-h-0">
                  <ToneRecommendations />
                </div>
              </section>
            </div>
          </div>
    </main>
  );
};

export default App;