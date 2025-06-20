import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

function App() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 初期表示時にページの最上端を表示
    window.scrollTo(0, 0);
  }, []);

  return (
    <ToastProvider>
      <div className="bg-background text-foreground h-screen flex flex-col">
        {/* ヘッダーを画面上部に表示 */}
        <header className="border-b border-border bg-background flex-shrink-0">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <NavigationMenu />
              <div className="flex items-center gap-2">
                <Link
                  to="/help"
                  className="p-2 rounded-lg bg-background/50 border-none hover:bg-muted/50 transition-colors backdrop-blur-sm"
                  title="ヘルプページ"
                >
                  <HelpCircle className="w-5 h-5 text-foreground" />
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main
          className="flex-1 overflow-auto px-4 pb-2"
        >
          {/* Mobile/Tablet: Single Screen Layout */}
          <div className="block xl:hidden flex flex-col">
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

            {/* Steps 2 & 3: 色相推薦・トーン推薦 - 動的サイズ */}
            <div className="space-y-1">
              {/* Step 2 */}
              <section>
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight">2. 色相(配色技法)推薦</h3>
                <ColorRecommendations />
              </section>

              {/* Step 3 */}
              <section>
                <h3 className="text-xs font-medium mb-0 text-foreground leading-tight">3. トーン(明度・彩度)推薦</h3>
                <ToneRecommendations />
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