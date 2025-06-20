import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import { useEffect, useRef } from 'react';

function App() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 初期表示時にメインコンテンツにフォーカス
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <ToastProvider>
      <div className="bg-background text-foreground">
        {/* ヘッダーを画面上部に薄く表示（初期フォーカスは下のメインコンテンツ） */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-12">
          <div className="container mx-auto px-4 py-1">
            <div className="flex justify-between items-center h-full">
              <NavigationMenu />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* メインコンテンツを1画面内に収める */}
        <main
          ref={mainRef}
          className="h-screen overflow-auto px-4 py-2 pt-14"
          style={{ scrollMarginTop: '48px' }}
        >
          {/* Mobile/Tablet: Single Screen Layout */}
          <div className="block xl:hidden h-full flex flex-col">
            {/* Step 1: ベース色選択 - コンパクト化 */}
            <section className="flex-shrink-0 mb-1">
              <h3 className="text-xs font-medium text-foreground leading-tight mb-0">1. ベースカラー(推薦元)選択</h3>
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

            {/* Steps 2 & 3: 色相推薦・トーン推薦 - 1画面内収納 */}
            <div className="flex-1 grid grid-cols-1 gap-1 min-h-0">
              {/* Step 2 */}
              <section className="min-h-0 flex flex-col">
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight flex-shrink-0">2. 色相(配色技法)推薦</h3>
                <div className="flex-1 min-h-0">
                  <ColorRecommendations />
                </div>
              </section>

              {/* Step 3 */}
              <section className="min-h-0 flex flex-col mb-0">
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight flex-shrink-0">3. トーン(明度・彩度)推薦</h3>
                <div className="flex-1 min-h-0">
                  <ToneRecommendations />
                </div>
              </section>
            </div>
          </div>

          {/* Desktop: Single Screen Layout */}
          <div className="hidden xl:block h-full flex flex-col">
            {/* Step 1: ベース色選択 - 上部コンパクト配置 */}
            <section className="flex-shrink-0 mb-2">
              <h2 className="text-lg font-medium mb-1 text-foreground">1. ベース色選択</h2>
              <div className="grid grid-cols-3 gap-4">
                <ColorPicker />
                <ImageUpload />
                <ExtractedColorsDisplay />
              </div>
            </section>

            {/* Steps 2 & 3: 色相推薦・トーン推薦 - 並列表示 */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
              <section className="min-h-0 flex flex-col">
                <h2 className="text-lg font-medium mb-1 text-foreground flex-shrink-0">2. 色相推薦</h2>
                <div className="flex-1 min-h-0">
                  <ColorRecommendations />
                </div>
              </section>
              <section className="min-h-0 flex flex-col mb-0">
                <h2 className="text-lg font-medium mb-1 text-foreground flex-shrink-0">3. トーン推薦</h2>
                <div className="flex-1 min-h-0">
                  <ToneRecommendations />
                </div>
              </section>
            </div>
          </div>
        </main>

        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;