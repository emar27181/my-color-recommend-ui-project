import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 実験完了ページ
 *
 * 全条件（C0~C3）完了後に表示されるページ
 */
const ExperimentCompletePage = () => {
  const navigate = useNavigate();
  const { participantId, conditionLogs, exportLog } = useExperimentStore();

  // 各条件の所要時間を計算
  const getConditionDuration = (condIndex: number) => {
    if (condIndex < conditionLogs.length) {
      return conditionLogs[condIndex].task_duration_sec;
    }
    return null;
  };

  // 全体の所要時間を計算
  const totalDuration = conditionLogs.reduce((sum, log) => {
    return sum + (log.task_duration_sec || 0);
  }, 0);

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 完了メッセージ */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">実験完了！</h1>
          <p className="text-muted-foreground text-lg">
            すべての条件（C0~C3）の評価が完了しました
          </p>
        </div>

        {/* 実験結果サマリー */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>実験結果サマリー</CardTitle>
            <CardDescription>
              参加者ID: <Badge variant="secondary" className="font-mono">{participantId}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 各条件の結果 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['C0', 'C1', 'C2', 'C3'].map((cond, index) => {
                const duration = getConditionDuration(index);
                return (
                  <div key={cond} className="p-4 border rounded-lg text-center">
                    <Badge variant="outline" className="font-mono mb-2">{cond}</Badge>
                    <div className="text-2xl font-bold">
                      {duration !== null ? `${duration.toFixed(1)}s` : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">所要時間</div>
                  </div>
                );
              })}
            </div>

            {/* 全体の統計 */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{totalDuration.toFixed(1)}s</div>
                  <div className="text-sm text-muted-foreground">合計時間</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {conditionLogs.reduce((sum, log) => sum + log.events.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">総操作数</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 次のステップ */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>次のステップ</CardTitle>
            <CardDescription>
              実験データをダウンロードし、Googleフォームに提出してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportLog} size="lg" className="w-full gap-2">
              <Download className="w-5 h-5" />
              実験ログをダウンロード
            </Button>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>1.</strong> 上のボタンをクリックして、実験ログ（JSONファイル）をダウンロード
              </p>
              <p>
                <strong>2.</strong> ダウンロードしたファイルをGoogleフォームにアップロード
              </p>
              <p>
                <strong>3.</strong> アンケートにご回答ください
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ホームに戻るボタン */}
        <div className="text-center">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <Home className="w-4 h-4" />
            ホームに戻る
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ExperimentCompletePage;
