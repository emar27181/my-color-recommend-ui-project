import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Download, CheckCircle } from 'lucide-react';
import {
  EXPERIMENT_TEXT_STYLES,
  EXPERIMENT_ICON_STYLES,
  getButtonClassName,
} from '@/constants/experimentTheme';

/**
 * 全体アンケートページ（incrementalモード用）
 *
 * UI1・UI2両方のタスク完了後に表示
 */
const ExperimentSurveyFinalPage = () => {
  const navigate = useNavigate();
  const { setFinalSurveyResponse, exportLog, participantId, ui1SurveyResponse, ui2SurveyResponse } = useExperimentStore();

  const [favoriteUI, setFavoriteUI] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  // 参加者IDまたはUI1/UI2アンケートが未設定の場合は導入ページにリダイレクト
  useEffect(() => {
    if (!participantId || !ui1SurveyResponse || !ui2SurveyResponse) {
      navigate('/experiment');
    }
  }, [participantId, ui1SurveyResponse, ui2SurveyResponse, navigate]);

  // 送信ハンドラ
  const handleSubmit = () => {
    if (!favoriteUI) {
      alert('最も使いやすかったUIを選択してください');
      return;
    }

    if (!reason.trim()) {
      alert('理由を入力してください');
      return;
    }

    // 全体アンケート回答を保存
    setFinalSurveyResponse({
      favoriteUI,
      reason,
      suggestions: suggestions.trim() || undefined,
    });

    setIsCompleted(true);
  };

  // ダウンロードハンドラ
  const handleDownload = () => {
    exportLog();
    alert('実験ログをダウンロードしました。ご協力ありがとうございました！');
  };

  if (isCompleted) {
    return (
      <main className="flex-1 pb-8 min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 mx-auto text-green-600 dark:text-green-400 mb-4" />
            <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-4`}>
              実験完了！
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              アンケートへのご協力、ありがとうございました。
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-foreground">
                実験ログをダウンロードして、研究者に送付してください。
              </p>
              <Button
                onClick={handleDownload}
                size="lg"
                className={`w-full ${getButtonClassName('action')}`}
              >
                <Download className={EXPERIMENT_ICON_STYLES.default} />
                実験ログをダウンロード
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pb-8 min-h-screen flex flex-col bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className={`${EXPERIMENT_TEXT_STYLES.pageTitle} mb-3`}>
            全体アンケート
          </h1>
          <p className="text-muted-foreground">
            UI1・UI2を比較して、以下の質問にお答えください。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={EXPERIMENT_TEXT_STYLES.cardTitle}>
              UI比較アンケート
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 最も使いやすかったUI */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                最も使いやすかったUIはどちらですか？ *
              </Label>
              <RadioGroup value={favoriteUI} onValueChange={setFavoriteUI}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UI1" id="ui1" />
                    <Label htmlFor="ui1" className="cursor-pointer">
                      UI1（大量の色を一度に表示）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UI2" id="ui2" />
                    <Label htmlFor="ui2" className="cursor-pointer">
                      UI2（色相→トーンの二段階選択）
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* 理由 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                その理由を教えてください。 *
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="使いやすかった理由を具体的にお書きください..."
                className="min-h-[120px]"
              />
            </div>

            {/* 機能改善提案 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                機能改善のご提案（任意）
              </Label>
              <Textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="こんな機能があればもっと使いやすいと思う点があればお書きください..."
                className="min-h-[120px]"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                size="lg"
                className={`w-full ${getButtonClassName('action')}`}
              >
                <CheckCircle className={EXPERIMENT_ICON_STYLES.default} />
                アンケートを送信
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentSurveyFinalPage;
