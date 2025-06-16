import { ColorPicker } from '@/components/ColorPicker';
import { ColorRecommendations, ToneRecommendations } from '@/components/ColorRecommendations';

function App() {
  return (
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
          {/* Phase 1: Color Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Step 1: 色を選択</h2>
            <div className="flex justify-center">
              <ColorPicker />
            </div>
          </section>

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
    </div>
  );
}

export default App;