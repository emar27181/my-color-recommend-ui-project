import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function SnsAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
          {/* メインタイトル */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading text-foreground mb-2">
              SNS嗜好分析
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              あなたのSNSの投稿から色の好みを分析し、パーソナライズされた色推薦を提供します
            </p>
          </div>

          {/* 準備中カード */}
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center pb-4">
              <h2 className="text-2xl font-heading text-foreground">
                🚧 現在準備中
              </h2>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                この機能は現在開発中です。<br/>
                近日中にリリース予定です。
              </p>
              
              {/* SNSアイコン */}
              <div className="flex justify-center space-x-6">
                <div className="flex flex-col items-center space-y-2">
                  <Instagram className="w-8 h-8 text-foreground opacity-50" />
                  <span className="text-xs text-muted-foreground">Instagram</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Twitter className="w-8 h-8 text-foreground opacity-50" />
                  <span className="text-xs text-muted-foreground">Twitter</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Facebook className="w-8 h-8 text-foreground opacity-50" />
                  <span className="text-xs text-muted-foreground">Facebook</span>
                </div>
              </div>

              {/* 予定機能 */}
              <div className="text-left space-y-3 pt-4 border-t">
                <h3 className="font-heading text-foreground text-sm">予定機能:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SNS投稿画像からの色傾向分析</li>
                  <li>• パーソナライズされた色推薦</li>
                  <li>• 色の好み履歴の可視化</li>
                  <li>• トレンド色との比較分析</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}