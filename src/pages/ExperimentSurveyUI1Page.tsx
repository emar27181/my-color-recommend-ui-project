import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import {
  EXPERIMENT_TEXT_STYLES,
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
} from '@/constants/experimentTheme';

/**
 * UI1個別アンケートページ（incrementalモード用）
 *
 * UI1のタスク完了後に表示
 */
const ExperimentSurveyUI1Page = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUI1SurveyResponse, participantId } = useExperimentStore();
  const isDebugMode = searchParams.get('debug') === 'true';

  // 7つの質問への回答（1〜5段階）
  const [responses, setResponses] = useState<number[]>(Array(7).fill(0));

  // 参加者IDが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    if (!participantId) {
      navigate('/experiment');
    }
  }, [participantId, navigate]);

  // 質問文の定義（7問）
  const questions = [
    '色が多すぎると感じた',
    '色が少なすぎると感じた',
    '塗りたいと思った色が見つかった',
    '指示された「バランスよく塗る」が実践しやすかった',
    '塗りたい色にたどり着くまでがスムーズだった',
    '完成した絵の出来に満足できた',
    '使用したUI（カラーパレット）に満足できた',
  ];

  // 評価スケールコンポーネント
  const RatingScale = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`w-12 h-12 rounded-lg border-2 transition-all ${
            value === rating
              ? 'bg-primary text-primary-foreground border-primary scale-110'
              : 'bg-background text-foreground border-border hover:border-primary/50'
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );

  // 回答を更新
  const updateRating = (index: number, value: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  // 送信ハンドラ
  const handleSubmit = () => {
    // すべての質問に回答しているか確認
    if (responses.some((r) => r === 0)) {
      alert('すべての質問に回答してください');
      return;
    }

    // UI1アンケート回答を保存
    setUI1SurveyResponse({ ui_responses: responses });

    // 次のタスク（UI2-TaskA）の説明ページへ遷移
    const debugParam = isDebugMode ? '&debug=true' : '';
    navigate(`/experiment/instruction?cond=UI2${debugParam}`);
  };

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-3`}>
            UI1 の評価
          </h1>
          <div className="flex justify-center mb-4">
            <img
              src="/images/UI_test/image_T1.png"
              alt="UI1: 大量の色を一度に表示"
              className="w-full max-w-[256px] h-auto object-contain rounded-lg shadow-lg border border-border"
            />
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="bg-slate-50 dark:bg-slate-900">
            <CardDescription>UI1について評価してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 py-6">
            {questions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base">
                  {index + 1}. {question}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24 text-right">
                    全くそう思わない
                  </span>
                  <RatingScale
                    value={responses[index]}
                    onChange={(value) => updateRating(index, value)}
                  />
                  <span className="text-sm text-muted-foreground w-24">
                    非常にそう思う
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                size="lg"
                className={`w-full ${getButtonClassName('action')}`}
              >
                次へ（UI2のタスクへ）
                <ArrowRight className={EXPERIMENT_ICON_STYLES.default} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentSurveyUI1Page;
