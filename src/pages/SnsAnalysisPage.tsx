import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Palette, TrendingUp } from "lucide-react";

export default function SnsAnalysisPage() {
  // テスト用に直接配列を定義
  const illustratorNames = [
    "test_one_photo",
    "mika_pikazo_mpz",
    "harunonioikaze",
    "gaako_illust",
    "mokmok_skd",
    "nest_virgo",
    "omrice4869",
    "oz_yarimasu"
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* メインタイトル */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-heading text-foreground mb-2">
              SNS嗜好分析
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              イラストレーターの色使いパターンから、あなたの好みに合った色推薦を提供します
            </p>
          </div>

          {/* イラストレーター一覧 */}
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Palette className="w-6 h-6 text-foreground" />
                <h2 className="text-2xl font-heading text-foreground">
                  イラストレーター一覧
                </h2>
              </div>
              <p className="text-muted-foreground">
                以下のイラストレーターの色使い統計データが利用可能です
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {illustratorNames.map((name, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted rounded-md border hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              総イラストレーター数: <span className="font-medium text-foreground">{illustratorNames.length}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}