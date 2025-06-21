import { ThemeToggle } from '@/components/ThemeToggle';
import { NavigationMenu } from '@/components/NavigationMenu';

export const DummyPage1 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <NavigationMenu />
            <h2 className="text-3xl font-bold text-center text-foreground flex-1">ダミーページ1</h2>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">ダミーページ1へようこそ</h3>
              <p className="text-muted-foreground mb-4">
                これはダミーページ1のコンテンツです。ナビゲーションメニューの動作確認用のページとして作成されました。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">サンプルコンテンツ A</h4>
                  <p className="text-sm text-muted-foreground">
                    ここにはサンプルのコンテンツが配置されています。実際のアプリケーションでは、
                    ここに機能的なコンテンツが入ります。
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">サンプルコンテンツ B</h4>
                  <p className="text-sm text-muted-foreground">
                    このセクションも同様にダミーコンテンツです。レイアウトの確認や
                    デザインの動作テストに使用できます。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">ナビゲーション</h3>
              <p className="text-muted-foreground mb-4">
                左上のハンバーガーメニューから他のページにアクセスできます。
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="/" className="inline-flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                  ホームに戻る
                </a>
                <a href="/page2" className="inline-flex items-center px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors">
                  ダミーページ2へ
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