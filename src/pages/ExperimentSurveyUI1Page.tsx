import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  // UI1の質問
  const questions = [
    '1. 色を選ぶ操作は簡単でしたか？',
    '2. 目的の色を見つけやすかったですか？',
    '3. 色の選択肢の量は適切でしたか？',
    '4. 配色を考えるのに役立ちましたか？',
    '5. 色選びにかかった時間は適切でしたか？',
    '6. UIの見た目は分かりやすかったですか？',
    '7. 全体的な使いやすさはどうでしたか？',
  ];

  // 回答を更新
  const handleResponseChange = (questionIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = parseInt(value, 10);
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
            UI1アンケート
          </h1>
          <p className="text-muted-foreground">
            UI1を使ったタスクについて、以下の質問にお答えください。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={EXPERIMENT_TEXT_STYLES.cardTitle}>
              UI1（大量の色を一度に表示）について
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {questions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base font-semibold">{question}</Label>
                <RadioGroup
                  value={responses[index].toString()}
                  onValueChange={(value) => handleResponseChange(index, value)}
                >
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center gap-2">
                        <RadioGroupItem value={rating.toString()} id={`q${index}-${rating}`} />
                        <Label
                          htmlFor={`q${index}-${rating}`}
                          className="text-sm cursor-pointer"
                        >
                          {rating === 1 && 'とても悪い'}
                          {rating === 2 && 'やや悪い'}
                          {rating === 3 && 'どちらでもない'}
                          {rating === 4 && 'やや良い'}
                          {rating === 5 && 'とても良い'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
