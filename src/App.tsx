import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <NavigationMenu />
              <h2 className="text-3xl font-bold text-center text-foreground flex-1">色相・トーン推薦アプリ</h2>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Mobile/Tablet: Vertical Layout */}
          <div className="block xl:hidden space-y-4">
            {/* Step 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-medium text-foreground">1. ベース色選択</h2>
              <div className="grid grid-cols-1 gap-3">
                <ColorPicker />
                <ImageUpload />
              </div>
              <ExtractedColorsDisplay />
            </section>

            {/* Step 2 */}
            <section>
              <h2 className="text-lg font-medium mb-3 text-foreground">2. 色相推薦</h2>
              <ColorRecommendations />
            </section>

            {/* Step 3 */}
            <section>
              <h2 className="text-lg font-medium mb-3 text-foreground">3. トーン推薦</h2>
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