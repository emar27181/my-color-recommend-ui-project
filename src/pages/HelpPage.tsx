import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Construction } from 'lucide-react';

export const HelpPage = () => {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Construction className="w-8 h-8 text-orange-500" />
                準備中
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">

              <div className="bg-muted/20 p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  ヘルプページは現在作成中です。<br />
                  詳細な使い方ガイドやよくある質問などの<br />
                  情報を準備しております。
                </p>
                <p className="text-sm text-muted-foreground">
                  しばらくお待ちください。
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  アプリに戻る
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </main>
  );
};