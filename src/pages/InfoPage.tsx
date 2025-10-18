import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Info, Palette, User, Lightbulb } from 'lucide-react';

export const InfoPage = () => {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl">
              <Info className="w-8 h-8 text-primary" />
              サイト情報
            </CardTitle>
            <CardDescription>
              色推薦アプリケーションについて
            </CardDescription>
          </CardHeader>
        </Card>

        {/* サイトの趣旨 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-foreground" />
              サイトの趣旨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">
              このアプリケーションは、色彩理論に基づいた色推薦システムを提供します。
              ユーザーが選択したベースカラーから、調和の取れた配色を自動的に生成し、
              デザインやアートワークの制作をサポートします。
            </p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-foreground">主な機能</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>色相推薦：色相環に基づいた調和のとれた配色提案</li>
                <li>トーン推薦：明度・彩度を調整したバリエーション生成</li>
                <li>配色技法：ダイアード、トライアド、テトラッド等の配色パターン</li>
                <li>画像からの色抽出：アップロードした画像から主要な色を抽出</li>
                <li>キャンバス機能：色を使った簡易的な描画・塗りつぶし</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 使い方 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-foreground" />
              使い方
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground mb-1">1. ベースカラーを選択</h4>
                <p className="text-muted-foreground text-sm">
                  カラーピッカーまたは画像アップロードから基準となる色を選択します。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground mb-1">2. 配色技法を選択</h4>
                <p className="text-muted-foreground text-sm">
                  ダイアード（補色）、トライアド（三角配色）などの配色技法から好みのパターンを選びます。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground mb-1">3. 推薦された色を確認</h4>
                <p className="text-muted-foreground text-sm">
                  色相推薦とトーン推薦のセクションで、調和のとれた配色パレットが表示されます。
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground mb-1">4. 色をコピーして利用</h4>
                <p className="text-muted-foreground text-sm">
                  各色のコピーボタンをクリックすると、HEXコードがクリップボードにコピーされます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 作成者情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-foreground" />
              作成者情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="space-y-2">
                <p className="text-foreground">
                  <span className="font-semibold">プロジェクト：</span> 色推薦アプリケーション
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">目的：</span> 色彩理論に基づく配色支援ツールの研究・開発
                </p>
                <p className="text-muted-foreground text-sm mt-4">
                  本アプリケーションは研究・教育目的で開発されています。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 戻るボタン */}
        <div className="text-center pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            アプリに戻る
          </Link>
        </div>
      </div>
    </main>
  );
};
