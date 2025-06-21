import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';
import { Palette, Brush, Layers } from 'lucide-react';

export const DummyPage3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <NavigationMenu />
            <h2 className="text-3xl font-bold text-center text-foreground flex-1">ダミーページ3</h2>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">アイコンギャラリー</h3>
              <p className="text-muted-foreground">
                このページではアイコンとカードレイアウトのデモンストレーションを行います。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">カラーパレット</h4>
                <p className="text-sm text-muted-foreground">
                  色彩理論に基づいた美しいカラーパレットを作成できます
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brush className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">ブラシツール</h4>
                <p className="text-sm text-muted-foreground">
                  多様なブラシツールで創造的な作品を制作できます
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">レイヤー管理</h4>
                <p className="text-sm text-muted-foreground">
                  効率的なレイヤー管理で複雑なデザインも簡単に
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-foreground">フィーチャーハイライト</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">直感的なインターフェース</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    ユーザーフレンドリーなデザインで、初心者でも簡単に使いこなせます。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      使いやすい
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                      高性能
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                      カスタマイズ可能
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">高度な機能</h4>
                  <p className="text-sm text-muted-foreground">
                    プロフェッショナルレベルの機能を搭載し、あらゆるニーズに対応します。
                  </p>
                  <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                    <li>• リアルタイムプレビュー</li>
                    <li>• クラウド同期</li>
                    <li>• 豊富なエクスポートオプション</li>
                    <li>• 協働機能</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">他のページを探索</h3>
              <div className="flex flex-wrap gap-2">
                <a href="/" className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                  ホームに戻る
                </a>
                <a href="/page1" className="inline-flex items-center px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors">
                  ダミーページ1へ
                </a>
                <a href="/page2" className="inline-flex items-center px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors">
                  ダミーページ2へ
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};