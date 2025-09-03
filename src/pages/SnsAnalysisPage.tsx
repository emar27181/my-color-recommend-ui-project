import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Palette, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { getIllustratorNames, getIllustratorStatistics } from "@/lib/illustratorData";
import { useState, useEffect } from "react";
import IllustratorStatistics from "@/components/IllustratorStatistics";

export default function SnsAnalysisPage() {
  const [illustratorNames, setIllustratorNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIllustrators, setExpandedIllustrators] = useState<Set<string>>(new Set());
  const [statisticsCache, setStatisticsCache] = useState<Record<string, any>>({});
  const [loadingStats, setLoadingStats] = useState<Set<string>>(new Set());

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

  const handleIllustratorToggle = async (name: string) => {
    const isExpanded = expandedIllustrators.has(name);
    
    if (isExpanded) {
      // 折りたたみ
      const newExpanded = new Set(expandedIllustrators);
      newExpanded.delete(name);
      setExpandedIllustrators(newExpanded);
    } else {
      // 展開
      const newExpanded = new Set(expandedIllustrators);
      newExpanded.add(name);
      setExpandedIllustrators(newExpanded);
      
      // データがキャッシュされていない場合は取得
      if (!statisticsCache[name]) {
        const newLoading = new Set(loadingStats);
        newLoading.add(name);
        setLoadingStats(newLoading);
        
        try {
          const data = await getIllustratorStatistics(name);
          setStatisticsCache(prev => ({ ...prev, [name]: data }));
        } catch (error) {
          console.error('Failed to load statistics:', error);
        } finally {
          const updatedLoading = new Set(loadingStats);
          updatedLoading.delete(name);
          setLoadingStats(updatedLoading);
        }
      }
    }
  };

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
                クリックで統計データを展開表示
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
                <div className="space-y-3">
                  {illustratorNames.map((name, index) => {
                    const isExpanded = expandedIllustrators.has(name);
                    const isLoading = loadingStats.has(name);
                    const statisticsData = statisticsCache[name];
                    
                    return (
                      <div key={index} className="border rounded-lg">
                        <div 
                          onClick={() => handleIllustratorToggle(name)}
                          className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isLoading && <span className="text-xs text-muted-foreground">読み込み中...</span>}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {/* 基本統計表示（常に表示） */}
                        {statisticsData && !isExpanded && (
                          <div className="px-4 pb-4">
                            <IllustratorStatistics data={statisticsData} isExpanded={false} />
                          </div>
                        )}
                        
                        {/* 詳細統計表示（展開時） */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t">
                            {isLoading ? (
                              <div className="py-6 text-center">
                                <p className="text-muted-foreground">統計データを読み込み中...</p>
                              </div>
                            ) : statisticsData ? (
                              <IllustratorStatistics data={statisticsData} isExpanded={true} />
                            ) : (
                              <div className="py-6 text-center">
                                <p className="text-muted-foreground">データが見つかりません</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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