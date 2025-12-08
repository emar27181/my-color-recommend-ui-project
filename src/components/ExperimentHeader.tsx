import { useNavigate } from 'react-router-dom';
import { useExperimentStore, parsePattern } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { CanvasColorRecommendationsRef } from '@/components/CanvasColorRecommendations';
import {
  EXPERIMENT_ICON_STYLES,
  TASK_CONCEPTS,
  getBadgeProps,
  getButtonClassName,
  getCardClassName,
} from '@/constants/experimentTheme';
import { ExperimentInstructionsModal } from '@/components/ExperimentInstructionsModal';

interface ExperimentHeaderProps {
  canvasRef?: React.RefObject<CanvasColorRecommendationsRef | null>;
  isDebugMode?: boolean;
}

export const ExperimentHeader = ({ canvasRef, isDebugMode = false }: ExperimentHeaderProps) => {
  const navigate = useNavigate();
  const {
    isExperimentRunning,
    hasNextCondition,
    getNextCondition,
    completeCurrentCondition,
    nextCondition,
    currentConditionIndex,
    experimentPatterns,
    surveyMode,
  } = useExperimentStore();

  // 現在のパターン名を取得（例: U1A, U2B）
  const currentPattern = experimentPatterns[currentConditionIndex];

  // パターンからmaterialを取得してコンセプトを決定
  const { material } = parsePattern(currentPattern);
  const concept = TASK_CONCEPTS[material];

  // 条件完了ハンドラ
  const handleComplete = () => {
    console.log('ExperimentHeader handleComplete called');
    console.log('現在の状態:', {
      currentConditionIndex,
      currentPattern,
      experimentPatterns,
      surveyMode
    });

    // キャンバス画像を取得
    const canvasImage = canvasRef?.current?.getCanvasImage() || undefined;

    // 確認ダイアログを表示（共通）
    const confirmed = window.confirm(
      `${currentPattern} の実験が完了しました。\n\n前のページには戻れません。次のページに進んで良いですか？`
    );

    if (!confirmed) {
      return; // キャンセル時は何もしない
    }

    // 確認後に条件を完了（キャンバス画像を保存）
    completeCurrentCondition(canvasImage);

    // incrementalモードの場合、UI完了時（TaskB完了時）にアンケートページへ遷移
    if (surveyMode === 'incremental') {
      const { condition, material } = parsePattern(currentPattern);
      console.log('ExperimentHeader: incrementalモード - condition:', condition, 'material:', material, 'currentPattern:', currentPattern);

      // TaskB完了（UI完了）の場合
      if (material === 'taskB') {
        const debugParam = isDebugMode ? '?debug=true' : '';

        // UI1完了 → UI1アンケート
        if (condition === 'UI1') {
          console.log('ExperimentHeader: UI1-TaskB完了。UI1アンケートページへ遷移');
          const { participantId } = useExperimentStore.getState();
          console.log('ExperimentHeader: 遷移前のparticipantId:', participantId);
          navigate(`/experiment/survey/ui1${debugParam}`);
          return;
        }
        // UI2完了 → UI2アンケート
        if (condition === 'UI2') {
          console.log('ExperimentHeader: UI2-TaskB完了。UI2アンケートページへ遷移');
          const { participantId } = useExperimentStore.getState();
          console.log('ExperimentHeader: 遷移前のparticipantId:', participantId);
          navigate(`/experiment/survey/ui2${debugParam}`);
          return;
        }
      }
    }

    // 次の条件があるかチェック
    if (hasNextCondition()) {
      const nextCond = getNextCondition();

      // 次のパターン名を取得
      const nextPatternIndex = currentConditionIndex + 1;
      const nextPattern = experimentPatterns[nextPatternIndex];

      // キャンバスをリセット
      if (canvasRef?.current) {
        console.log('Clearing canvas for condition transition');
        canvasRef.current.clearAllLayers();
      }

      // 次の条件に進む
      nextCondition();

      // 次のパターンのmaterialを取得
      const { material: nextMaterial } = parsePattern(nextPattern);

      const debugParam = isDebugMode ? '&debug=true' : '';

      // TaskAの時のみ説明ページへ、TaskBの時は直接タスクページへ
      if (nextMaterial === 'taskA') {
        navigate(`/experiment/instruction?cond=${nextCond}${debugParam}`);
      } else {
        navigate(`/experiment/task?cond=${nextCond}${debugParam}`);
      }
    } else {
      // 全条件完了（次の条件がない）
      // TaskAの場合は次のTaskBに進むが、これは既にincrementalモードでアンケートに遷移している
      // ここに到達するのは、TaskAの場合のみ（TaskBはアンケートに遷移済み）
      console.log('ExperimentHeader: 全条件完了 - 次の条件なし');
      console.warn('想定外の状態: incrementalモードではTaskB完了時にアンケートに遷移するはず');
    }
  };

  return (
    <Card className={`mb-0 ${getCardClassName('emphasized')}`}>
      <CardContent className="py-1 px-4">
        <div className="flex items-center justify-between gap-3">
          {/* 左側: 条件情報とコンセプト */}
          <div className="flex items-center gap-3">
            <Badge {...getBadgeProps('condition')}>
              {currentPattern}
            </Badge>
            <span className="text-sm text-foreground">
              <span className="font-semibold underline">「{concept}」</span>というコンセプトを守るようにバランスよく塗ってください。
            </span>
            <ExperimentInstructionsModal variant="ghost" size="sm" buttonText="指示書を再表示" />
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
                  {experimentPatterns[currentConditionIndex + 1]}へ
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
