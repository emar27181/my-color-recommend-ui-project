import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import {
  EXPERIMENT_ICON_STYLES,
  getBadgeProps,
  getButtonClassName,
  getCardClassName,
} from '@/constants/experimentTheme';

// 条件の説明
const CONDITION_DESCRIPTIONS = {
  Test1: 'UI方式1（大量の色を一度に表示）',
  Test2: 'UI方式2（色相環＋スライダー）',
  Test3: 'UI方式3（色相→トーン）',
};

interface ExperimentHeaderProps {
  canvasRef?: React.RefObject<CanvasColorRecommendationsRef | null>;
  isDebugMode?: boolean;
}

export const ExperimentHeader = ({ canvasRef, isDebugMode = false }: ExperimentHeaderProps) => {
  const navigate = useNavigate();
  const {
    condition,
    isExperimentRunning,
    hasNextCondition,
    getNextCondition,
    completeCurrentCondition,
    nextCondition,
  } = useExperimentStore();

  // 条件完了ハンドラ
  const handleComplete = () => {
    completeCurrentCondition();

    // 次の条件があるかチェック
    if (hasNextCondition()) {
      const nextCond = getNextCondition();

      // 確認ダイアログを表示
      const confirmed = window.confirm(
        `${condition} の実験が完了しました。\n\n前のページには戻れません。次のページに進んで良いですか？\n\n次の条件：${nextCond}`
      );

      if (confirmed) {
        // キャンバスをリセット
        if (canvasRef?.current) {
          console.log('Clearing canvas for condition transition');
          canvasRef.current.clearAllLayers();
        }

        // 次の条件に進む
        nextCondition();
        // 次の条件のページに遷移（デバッグモードを引き継ぐ）
        const debugParam = isDebugMode ? '&debug=true' : '';
        navigate(`/experiment/task?cond=${nextCond}${debugParam}`);
      }
    } else {
      // 全条件完了 - アンケートページに遷移
      const confirmed = window.confirm(
        `すべてのテスト（Test1~Test3）が完了しました！\n\n前のページには戻れません。アンケートページに進んで良いですか？`
      );

      if (!confirmed) {
        return;
      }

      // 完了ページ（アンケート）に遷移（デバッグモードを引き継ぐ）
      const debugParam = isDebugMode ? '?debug=true' : '';
      navigate(`/experiment/complete${debugParam}`);
    }
  };

  return (
    <Card className={`mb-2 ${getCardClassName('emphasized')}`}>
      <CardContent className="py-2 px-4">
        <div className="flex items-center justify-between gap-3">
          {/* 左側: 条件情報 */}
          <div className="flex items-center gap-2">
            <Badge {...getBadgeProps('condition')}>
              {condition}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {CONDITION_DESCRIPTIONS[condition]}
            </span>
          </div>

          {/* 右側: 条件完了ボタン */}
          {isExperimentRunning && (
            <Button
              onClick={handleComplete}
              size="sm"
              className={getButtonClassName('action')}
            >
              <CheckCircle className={EXPERIMENT_ICON_STYLES.small} />
              条件を完了
              {hasNextCondition() && (
                <>
                  <ArrowRight className={EXPERIMENT_ICON_STYLES.small} />
                  {getNextCondition()}へ
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
