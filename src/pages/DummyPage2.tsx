import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';

export const DummyPage2 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <NavigationMenu />
            <h2 className="text-3xl font-bold text-center text-foreground flex-1">ダミーページ2</h2>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">ダミーページ2のコンテンツ</h3>
              <p className="text-muted-foreground mb-6">
                こちらはダミーページ2です。異なるコンテンツとレイアウトでページの切り替えを確認できます。
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h4 className="font-semibold mb-3">メインコンテンツエリア</h4>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-4">
                      <h5 className="font-medium mb-2">カードコンテンツ 1</h5>
                      <p className="text-sm text-muted-foreground">
                        このエリアには実際のアプリケーションコンテンツが配置されます。
                        現在はデモンストレーション用のプレースホルダーコンテンツです。
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg p-4">
                      <h5 className="font-medium mb-2">カードコンテンツ 2</h5>
                      <p className="text-sm text-muted-foreground">
                        各ページで異なるコンテンツを表示することで、
                        ナビゲーションシステムの動作を確認できます。
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="font-medium mb-2">サイドバー</h5>
                    <p className="text-xs text-muted-foreground mb-3">
                      追加情報やナビゲーション要素
                    </p>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded"></div>
                      <div className="w-3/4 h-2 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-800 dark:to-orange-800 rounded"></div>
                      <div className="w-1/2 h-2 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">ページナビゲーション</h3>
              <div className="flex flex-wrap gap-2">
                <a href="/" className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                  ホームに戻る
                </a>
                <a href="/page1" className="inline-flex items-center px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors">
                  ダミーページ1へ
                </a>
                <a href="/page3" className="inline-flex items-center px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors">
                  ダミーページ3へ
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};