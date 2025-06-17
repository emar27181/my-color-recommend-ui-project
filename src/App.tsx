import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';
import { HorizontalColorTest } from '@/components/HorizontalColorTest';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <ThemeToggle />
            </div>
            <h1 className="text-3xl font-bold text-center text-foreground">色推薦アプリ</h1>
            <p className="text-center mt-2 text-muted-foreground">
              色彩理論に基づいた相性の良い色とトーンを推薦します
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Mobile/Tablet: Vertical Layout */}
          <div className="block xl:hidden space-y-6">
            {/* Phase 1: Color Selection */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Step 1: 色を選択</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-3 text-foreground">手動で色を選択</h3>
                  <ColorPicker />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-3 text-foreground">画像から色を抽出</h3>
                  <ImageUpload />
                </div>
              </div>
            </section>

            {/* Extracted Colors Display */}
            <ExtractedColorsDisplay />

            {/* Phase 2: Color Recommendations */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Step 2: 推薦色相</h2>
              <ColorRecommendations />
            </section>

            {/* Phase 3: Tone Recommendations */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Step 3: 推薦トーン</h2>
              <ToneRecommendations />
            </section>

            {/* Horizontal Color Test */}
            <section>
              <HorizontalColorTest />
            </section>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden xl:block">
            {/* Header Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Step 1: 色を選択</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-foreground">手動で色を選択</h3>
                  <ColorPicker />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4 text-foreground">画像から色を抽出</h3>
                  <ImageUpload />
                </div>
              </div>
            </section>

            {/* Extracted Colors Display */}
            <ExtractedColorsDisplay />

            {/* Main Content Area: Side by Side */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              {/* Phase 2: Color Recommendations */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Step 2: 推薦色相</h2>
                <ColorRecommendations />
              </section>

              {/* Phase 3: Tone Recommendations */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Step 3: 推薦トーン</h2>
                <ToneRecommendations />
              </section>
            </div>

            {/* Horizontal Color Test - Full Width */}
            <section className="mt-8">
              <HorizontalColorTest />
            </section>
          </div>
        </main>
        
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;