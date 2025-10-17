import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Activity, ArrowRight } from 'lucide-react';
import type { CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';

// 条件の説明
const CONDITION_DESCRIPTIONS = {
  C0: '推薦なし（通常のカラーピッカーのみ）',
  C1: '色相推薦のみ',
  C2: 'トーン推薦のみ',
  C3: '二段階推薦（色相＋トーン）',
};

interface ExperimentHeaderProps {
  canvasRef?: React.RefObject<CanvasColorRecommendationsRef | null>;
}

export const ExperimentHeader = ({ canvasRef }: ExperimentHeaderProps) => {
  const navigate = useNavigate();
  const {
    participantId,
    condition,
    isExperimentRunning,
    events,
    hasNextCondition,
    getNextCondition,
    completeCurrentCondition,
    nextCondition,
    exportLog,
    conditionLogs,
  } = useExperimentStore();

  // 条件完了ハンドラ
  const handleComplete = () => {
    completeCurrentCondition();

    // 次の条件があるかチェック
    if (hasNextCondition()) {
      const nextCond = getNextCondition();

      // 確認ダイアログを表示
      const confirmed = window.confirm(
        `${condition} の実験が完了しました。\n\n次の条件（${nextCond}）に進みますか？`
      );

      if (confirmed) {
        // キャンバスをリセット
        if (canvasRef?.current) {
          console.log('Clearing canvas for condition transition');
          canvasRef.current.clearAllLayers();
        }

        // 次の条件に進む
        nextCondition();
        // 次の条件のページに遷移
        navigate(`/experiment/task?cond=${nextCond}`);
      }
    } else {
      // 全条件完了
      const confirmed = window.confirm(
        `すべての条件（C0~C3）が完了しました！\n\n実験ログをダウンロードしますか？`
      );

      if (confirmed) {
        exportLog();
        // 完了ページに遷移
        navigate('/experiment/complete');
      }
    }
  };

  return (
    <Card className="mb-4 border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">実験進行中</CardTitle>
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {condition}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {CONDITION_DESCRIPTIONS[condition]}
            </span>
          </div>

          {/* 進捗表示 */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              参加者: {participantId}
            </Badge>
            <Badge variant="outline" className="font-mono">
              進捗: {conditionLogs.length + (isExperimentRunning ? 1 : 0)}/4
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-3">
          {/* イベント数表示 */}
          {isExperimentRunning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-mono">
                {events.length} 操作記録中
              </span>
            </div>
          )}

          {/* 条件完了ボタン */}
          {isExperimentRunning && (
            <Button onClick={handleComplete} size="lg" className="gap-2">
              <CheckCircle className="w-5 h-5" />
              条件を完了
              {hasNextCondition() && (
                <span className="flex items-center gap-1">
                  <ArrowRight className="w-4 h-4" />
                  {getNextCondition()}へ
                </span>
              )}
            </Button>
          )}

          {/* ログダウンロードボタン（実験終了後） */}
          {!isExperimentRunning && conditionLogs.length > 0 && (
            <Button onClick={exportLog} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              ログダウンロード
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
