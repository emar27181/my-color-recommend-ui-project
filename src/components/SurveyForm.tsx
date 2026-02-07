import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bug } from 'lucide-react';
import type { SurveyResponse } from '@/store/experimentStore';

interface SurveyFormProps {
  onSubmit: (response: SurveyResponse) => void;
  isDebugMode?: boolean;
}

/**
 * アンケートフォームコンポーネント
 *
 * - UI1用評価（7問：1〜5段階）
 * - UI2用評価（7問：1〜5段階）
 * - 全体質問（どちらのUIが使いやすかったか）
 * - デバッグモード対応（自動入力）
 */
export const SurveyForm = ({ onSubmit, isDebugMode = false }: SurveyFormProps) => {
  // UI1用の評価（7問）
  const [ui1Responses, setUi1Responses] = useState<number[]>(isDebugMode ? [4, 4, 4, 4, 4, 4, 4] : [0, 0, 0, 0, 0, 0, 0]);

  // UI2用の評価（7問）
  const [ui2Responses, setUi2Responses] = useState<number[]>(isDebugMode ? [4, 4, 4, 4, 4, 4, 4] : [0, 0, 0, 0, 0, 0, 0]);

  // 全体質問
  const [favoriteUI, setFavoriteUI] = useState<string>(isDebugMode ? 'UI2' : '');
  const [reason, setReason] = useState<string>(isDebugMode ? 'デバッグモード：UI2の方が使いやすかったため' : '');
  const [suggestions, setSuggestions] = useState<string>(isDebugMode ? 'デバッグモード：特になし' : '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!favoriteUI) {
      alert('どちらのUIの方が使いやすかったか選択してください');
      return;
    }

    if (
      ui1Responses.some(v => v === 0) ||
      ui2Responses.some(v => v === 0)
    ) {
      alert('すべての質問に回答してください');
      return;
    }

    const response: SurveyResponse = {
      ui1_responses: ui1Responses,
      ui2_responses: ui2Responses,
      favoriteUI: favoriteUI,
      reason: reason.trim(),
      suggestions: suggestions.trim() || undefined, // 空の場合はundefined
    };

    onSubmit(response);
  };

  const updateRating = (
    ui: 'ui1' | 'ui2',
    index: number,
    value: number
  ) => {
    if (ui === 'ui1') {
      const newResponses = [...ui1Responses];
      newResponses[index] = value;
      setUi1Responses(newResponses);
    } else {
      const newResponses = [...ui2Responses];
      newResponses[index] = value;
      setUi2Responses(newResponses);
    }
  };

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
          className={`w-12 h-12 rounded-lg border-2 transition-all ${value === rating
            ? 'bg-primary text-primary-foreground border-primary scale-110'
            : 'bg-background text-foreground border-border hover:border-primary/50'
            }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* デバッグモードインジケーター */}
      {isDebugMode && (
        <div className="p-3 bg-orange-100 dark:bg-orange-900 border-2 border-orange-500 rounded-lg">
          <div className="flex items-center gap-2 justify-center">
            <Bug className="w-5 h-5 text-orange-700 dark:text-orange-300" />
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              デバッグモード（全項目自動入力済み）
            </span>
          </div>
        </div>
      )}

      {/* UI1の評価 */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">UI1 の評価</h2>
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
          {/* UI1 の7問 */}
          {questions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-base">
                {index + 1}. {question}
              </Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                <RatingScale
                  value={ui1Responses[index]}
                  onChange={(value) => updateRating('ui1', index, value)}
                />
                <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* UI2の評価 */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">UI2 の評価</h2>
        <div className="flex justify-center mb-4">
          <img
            src="/images/UI_test/image_T3.png"
            alt="UI2: 二段階推薦"
            className="w-full max-w-[256px] h-auto object-contain rounded-lg shadow-lg border border-border"
          />
        </div>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-blue-50 dark:bg-blue-950">
          <CardDescription>UI2について評価してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          {/* UI2 の7問 */}
          {questions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-base">
                {index + 1}. {question}
              </Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                <RatingScale
                  value={ui2Responses[index]}
                  onChange={(value) => updateRating('ui2', index, value)}
                />
                <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 全体質問 */}
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
        </CardContent>
      </Card>

      {/* 送信ボタン */}
      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" className="w-full max-w-md">
          結果をダウンロード
        </Button>
      </div>
    </form>
  );
};
