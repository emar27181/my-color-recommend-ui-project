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
    // キャンバス画像を取得
    const canvasImage = canvasRef?.current?.getCanvasImage() || undefined;

    // 次の条件があるかチェック
    if (hasNextCondition()) {
      const nextCond = getNextCondition();

      // 確認ダイアログを表示
      const confirmed = window.confirm(
        `${condition} の実験が完了しました。\n\n前のページには戻れません。次のページに進んで良いですか？\n\n次の条件：${nextCond}`
      );

      if (!confirmed) {
        return; // キャンセル時は何もしない
      }

      // 確認後に条件を完了（キャンバス画像を保存）
      completeCurrentCondition(canvasImage);

      // キャンバスをリセット
      if (canvasRef?.current) {
        console.log('Clearing canvas for condition transition');
        canvasRef.current.clearAllLayers();
      }

      // 次の条件に進む
      nextCondition();
      // 次の条件の説明ページに遷移（デバッグモードを引き継ぐ）
      const debugParam = isDebugMode ? '&debug=true' : '';
      navigate(`/experiment/instruction?cond=${nextCond}${debugParam}`);
    } else {
      // 全条件完了 - アンケートページに遷移
      const confirmed = window.confirm(
        `すべてのテスト（Test1~Test3）が完了しました！\n\n前のページには戻れません。アンケートページに進んで良いですか？`
      );

      if (!confirmed) {
        return; // キャンセル時は何もしない
      }

      // 確認後に条件を完了（キャンバス画像を保存）
      completeCurrentCondition(canvasImage);

      // 完了ページ（アンケート）に遷移（デバッグモードを引き継ぐ）
      const debugParam = isDebugMode ? '?debug=true' : '';
      navigate(`/experiment/complete${debugParam}`);
    }
  };

  return (
    <Card className={`mb-0 ${getCardClassName('emphasized')}`}>
      <CardContent className="py-1 px-4">
        <div className="flex items-center justify-between gap-3">
          {/* 左側: 条件情報 */}
          <div className="flex items-center gap-2">
            <Badge {...getBadgeProps('condition')}>
              {condition}
            </Badge>
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
