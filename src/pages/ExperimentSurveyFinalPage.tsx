import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperimentStore } from '@/store/experimentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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

    // アンケート回答後、自動でログをダウンロード
    setTimeout(() => {
      exportLog();
      alert('アンケートありがとうございました！\n実験データ（ログ・アンケート・イラスト画像）をZIPファイルでダウンロードしました。');
    }, 100);
  };

  // ダウンロードハンドラ
  const handleDownload = () => {
    exportLog();
    alert('実験ログを再ダウンロードしました。');
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
                実験ログは自動的にダウンロードされました。<br />
                必要に応じて再ダウンロードしてください。
              </p>
              <Button
                onClick={handleDownload}
                size="lg"
                className={`w-full ${getButtonClassName('primary')}`}
              >
                <Download className={EXPERIMENT_ICON_STYLES.default} />
                実験データを再ダウンロード
              </Button>
              <div className="text-sm text-muted-foreground space-y-2 text-left">
                <p>
                  <strong>1.</strong> ダウンロードした実験データ（ZIPファイル）を確認
                </p>
                <p className="ml-6 text-xs">
                  • 実験ログ（JSON）<br />
                  • アンケート結果<br />
                  • 完成イラスト画像（各テスト）
                </p>
                <p>
                  <strong>2.</strong> ZIPファイルを研究者に提出してください
                </p>
              </div>
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
            全体評価
          </h1>
          <p className="text-muted-foreground">
            UI1・UI2を比較して、以下の質問にお答えください。
          </p>
        </div>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle>全体評価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">どちらのUIの方が使いやすかったですか？</Label>
              <div className="flex gap-6">
                {['UI1', 'UI2'].map((ui) => (
                  <label key={ui} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="favoriteUI"
                      value={ui}
                      checked={favoriteUI === ui}
                      onChange={(e) => setFavoriteUI(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span className="text-lg font-semibold">{ui}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="reason" className="text-base font-semibold">そう思った理由を教えてください</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="例：UIXの方が色を選びやすく、迷わずに必要な色を見つけられたため"
                className="min-h-[120px] resize-y text-foreground"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="suggestions" className="text-base font-semibold">感想記述欄（UI2に関して改善点や感想があれば教えてください・任意）</Label>
              <Textarea
                id="suggestions"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="例：UIXの方が色を絞りやすかった、もっと色の候補を増やしてほしい、など"
                className="min-h-[100px] resize-y text-foreground"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                size="lg"
                className={`w-full ${getButtonClassName('action')}`}
              >
                <CheckCircle className={EXPERIMENT_ICON_STYLES.default} />
                結果をダウンロード
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExperimentSurveyFinalPage;
