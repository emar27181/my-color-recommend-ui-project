import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Palette, TrendingUp, ArrowLeft, BarChart3 } from "lucide-react";
import { getIllustratorNames, getIllustratorStatistics } from "@/lib/illustratorData";
import { useState, useEffect } from "react";
import IllustratorStatistics from "@/components/IllustratorStatistics";

export default function SnsAnalysisPage() {
  const [illustratorNames, setIllustratorNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIllustrator, setSelectedIllustrator] = useState<string | null>(null);
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  useEffect(() => {
    const loadNames = async () => {
      try {
        const names = await getIllustratorNames();
        setIllustratorNames(names);
      } catch (error) {
        console.error('Failed to load illustrator names:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNames();
  }, []);

  const handleIllustratorClick = async (name: string) => {
    setSelectedIllustrator(name);
    setStatisticsLoading(true);
    try {
      const data = await getIllustratorStatistics(name);
      setStatisticsData(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedIllustrator(null);
    setStatisticsData(null);
  };

  // 統計詳細表示
  if (selectedIllustrator) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* 戻るボタンとタイトル */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackClick}
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                戻る
              </button>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-foreground" />
                <h1 className="text-3xl font-heading text-foreground">
                  {selectedIllustrator} の統計データ
                </h1>
              </div>
            </div>

            {/* 統計データ表示 */}
            {statisticsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">統計データを読み込み中...</p>
              </div>
            ) : (
              <IllustratorStatistics data={statisticsData} />
            )}
          </div>
        </main>
      </div>
    );
  }

  // イラストレーター一覧表示
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
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">データを読み込み中...</p>
                </div>
              ) : illustratorNames.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">データの読み込みに失敗しました</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {illustratorNames.map((name, index) => (
                    <div 
                      key={index}
                      onClick={() => handleIllustratorClick(name)}
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
              )}
            </CardContent>
          </Card>

          {/* 統計情報 */}
          {!loading && (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                総イラストレーター数: <span className="font-medium text-foreground">{illustratorNames.length}</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}