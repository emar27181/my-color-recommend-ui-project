import { useState } from 'react';
import { useExperimentStore, type SurveyResponse } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Home, ClipboardCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SurveyForm } from '@/components/SurveyForm';
import {
  EXPERIMENT_LAYOUT,
  EXPERIMENT_ICON_STYLES,
  EXPERIMENT_TEXT_STYLES,
  getBadgeProps,
  getButtonClassName,
} from '@/constants/experimentTheme';

/**
 * 実験完了ページ
 *
 * 全テスト（Test1~Test3）完了後に表示されるページ
 * アンケート回答後、ログをダウンロード可能
 * デバッグモード対応
 */
const ExperimentCompletePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDebugMode = searchParams.get('debug') === 'true';

  const { participantId, conditionLogs, surveyResponse, setSurveyResponse, exportLog } = useExperimentStore();
  const [showSurvey, setShowSurvey] = useState(!surveyResponse); // アンケート未回答時は表示

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

  // アンケート送信ハンドラー
  const handleSurveySubmit = (response: SurveyResponse) => {
    setSurveyResponse(response);
    setShowSurvey(false);

    // アンケート回答後、自動でログをダウンロード
    setTimeout(() => {
      exportLog();
      alert('アンケートありがとうございました！\n実験ログ（アンケート結果含む）をダウンロードしました。');
    }, 100);
  };

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className={`container mx-auto px-4 py-8 ${EXPERIMENT_LAYOUT.containerWidth.standard}`}>
        {/* 完了メッセージ */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className={`${EXPERIMENT_ICON_STYLES.xlarge} text-green-600 dark:text-green-400`} />
            </div>
          </div>
          <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-3`}>実験完了！</h1>
          <p className="text-muted-foreground text-lg">
            すべてのテスト（Test1~Test3）の評価が完了しました
          </p>
        </div>

        {/* 実験結果サマリー */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>実験結果サマリー</CardTitle>
            <CardDescription>
              参加者ID: <Badge {...getBadgeProps('participant')}>{participantId}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 各テストの結果 */}
            <div className="grid grid-cols-3 gap-4">
              {['Test1', 'Test2', 'Test3'].map((cond, index) => {
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

        {/* アンケートセクション */}
        {showSurvey ? (
          <div className="mb-6">
            <div className="mb-4 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <ClipboardCheck className={`${EXPERIMENT_ICON_STYLES.large} text-primary`} />
                <div>
                  <h2 className="text-lg font-semibold">アンケートにご協力ください</h2>
                  <p className="text-sm text-muted-foreground">
                    実験ログをダウンロードする前に、アンケートに回答してください
                  </p>
                </div>
              </div>
            </div>
            <SurveyForm onSubmit={handleSurveySubmit} isDebugMode={isDebugMode} />
          </div>
        ) : (
          /* 次のステップ */
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className={`${EXPERIMENT_ICON_STYLES.default} text-green-600`} />
                アンケート回答完了
              </CardTitle>
              <CardDescription>
                実験ログをダウンロードしてください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={exportLog} size="lg" className={`w-full ${getButtonClassName('primary')}`}>
                <Download className={EXPERIMENT_ICON_STYLES.default} />
                実験ログ＋アンケート結果をダウンロード
              </Button>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>1.</strong> 上のボタンをクリックして、実験ログ（JSONファイル）をダウンロード
                </p>
                <p>
                  <strong>2.</strong> ダウンロードしたファイルを研究者に提出してください
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ホームに戻るボタン */}
        <div className="text-center">
          <Button onClick={() => navigate('/')} variant="outline" className={getButtonClassName('outline')}>
            <Home className={EXPERIMENT_ICON_STYLES.small} />
            ホームに戻る
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ExperimentCompletePage;
