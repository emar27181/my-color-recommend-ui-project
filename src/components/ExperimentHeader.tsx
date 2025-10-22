import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Activity, ArrowRight } from 'lucide-react';
import type { CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import {
  EXPERIMENT_BUTTON_STYLES,
  EXPERIMENT_CARD_STYLES,
  EXPERIMENT_ICON_STYLES,
  getBadgeProps,
  getButtonClassName,
  getCardClassName,
} from '@/constants/experimentTheme';

// 条件の説明
const CONDITION_DESCRIPTIONS = {
  Test1: '既存カラーパレット方式（大量の色を一度に表示）',
  Test2: '色相環＋トーンスライダー方式（自由に色を作成）',
  Test3: '二段階推薦方式（色相→トーン）',
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
      // 全条件完了 - アンケートページに遷移
      window.alert(
        `すべてのテスト（Test1~Test3）が完了しました！\n\nアンケートにご協力ください。`
      );

      // 完了ページ（アンケート）に遷移
      navigate('/experiment/complete');
    }
  };

  return (
    <Card className={`mb-4 ${getCardClassName('emphasized')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">実験進行中</CardTitle>
            <Badge {...getBadgeProps('condition')}>
              {condition}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {CONDITION_DESCRIPTIONS[condition]}
            </span>
          </div>

          {/* 進捗表示 */}
          <div className="flex items-center gap-2">
            <Badge {...getBadgeProps('participant')}>
              参加者: {participantId}
            </Badge>
            <Badge {...getBadgeProps('progress')}>
              進捗: {conditionLogs.length + (isExperimentRunning ? 1 : 0)}/3
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-3">
          {/* イベント数表示 */}
          {isExperimentRunning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
              <Activity className={EXPERIMENT_ICON_STYLES.small} />
              <span className="text-sm font-mono">
                {events.length} 操作記録中
              </span>
            </div>
          )}

          {/* 条件完了ボタン */}
          {isExperimentRunning && (
            <Button
              onClick={handleComplete}
              size="lg"
              className={getButtonClassName('action')}
            >
              <CheckCircle className={EXPERIMENT_ICON_STYLES.default} />
              条件を完了
              {hasNextCondition() && (
                <span className="flex items-center gap-1">
                  <ArrowRight className={EXPERIMENT_ICON_STYLES.small} />
                  {getNextCondition()}へ
                </span>
              )}
            </Button>
          )}

        </div>
      </CardContent>
    </Card>
  );
};
