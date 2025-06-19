import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

function App() {
  const isHeaderVisible = useScrollVisibility(50);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <NavigationMenu />
              <h2 className="text-2xl font-bold text-center text-foreground flex-1">色相・トーン推薦アプリ</h2>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-4 pt-0">
          {/* Mobile/Tablet: Vertical Layout */}
          <div className="block xl:hidden space-y-3">
            {/* Step 1 */}
            <section className="space-y-2">
              <h2 className="text-base font-medium text-foreground">1. ベース色選択</h2>
              <div className="grid grid-cols-1 gap-2">
                <ColorPicker />
                <ImageUpload />
              </div>
              <ExtractedColorsDisplay />
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-base font-medium mb-2 text-foreground">2. 色相推薦</h2>
              <ColorRecommendations />
            </section>

            {/* Step 3 */}
            <section>
              <h2 className="text-base font-medium mb-2 text-foreground">3. トーン推薦</h2>
              <ToneRecommendations />
            </section>

          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden xl:block space-y-2">
            {/* Step 1 */}
            <section>
              <h2 className="text-xl font-medium mb-0 text-foreground">1. ベース色選択</h2>
              <div className="grid grid-cols-2 gap-6">
                <ColorPicker />
                <ImageUpload />
              </div>
              <div className="mt-4">
                <ExtractedColorsDisplay />
              </div>
            </section>

            {/* Steps 2 & 3 */}
            <div className="grid grid-cols-2 gap-6">
              <section>
                <h2 className="text-xl font-medium mb-0 text-foreground">2.色相推薦</h2>
                <ColorRecommendations />
              </section>
              <section>
                <h2 className="text-xl font-medium mb-0 text-foreground">3.トーン推薦</h2>
                <ToneRecommendations />
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