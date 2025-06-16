import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';
import { ImageUpload } from '@/components/ImageUpload';
import { ExtractedColorsDisplay } from '@/components/ExtractedColorsDisplay';
import { PalettePatterns } from '@/components/PalettePatterns';
import { SingleColorBlockTest } from '@/components/SingleColorBlockTest';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center">色推薦アプリ</h1>
            <p className="text-center text-muted-foreground mt-2">
              色彩理論に基づいた相性の良い色とトーンを推薦します
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Single Color Block Test */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">単一色ブロック表示テスト</h2>
              <SingleColorBlockTest />
            </section>

            {/* Palette Patterns Test */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">パレット表示パターンテスト</h2>
              <PalettePatterns />
            </section>

            {/* Phase 1: Color Selection */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Step 1: 色を選択</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">手動で色を選択</h3>
                  <div className="flex justify-center">
                    <ColorPicker />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">画像から色を抽出</h3>
                  <ImageUpload />
                </div>
              </div>
            </section>

            {/* Extracted Colors Display */}
            <ExtractedColorsDisplay />

            {/* Phase 2: Color Recommendations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Step 2: 推薦色相</h2>
              <ColorRecommendations />
            </section>

            {/* Phase 3: Tone Recommendations */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Step 3: 推薦トーン</h2>
              <ToneRecommendations />
            </section>
          </div>
        </main>
        
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;