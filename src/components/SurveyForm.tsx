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
 * - UI1用評価（コア4問 + 追加4問 + SEQ1問）
 * - UI2用評価（コア4問 + 追加4問 + SEQ1問）
 * - 全体質問（どちらのUIが使いやすかったか）
 * - デバッグモード対応（自動入力）
 */
export const SurveyForm = ({ onSubmit, isDebugMode = false }: SurveyFormProps) => {
  // UI1用の評価
  const [ui1Core, setUi1Core] = useState<number[]>(isDebugMode ? [4, 4, 4, 4] : [0, 0, 0, 0]);
  const [ui1Additional, setUi1Additional] = useState<number[]>(isDebugMode ? [4, 4, 4, 4] : [0, 0, 0, 0]);
  const [ui1Seq, setUi1Seq] = useState<number>(isDebugMode ? 4 : 0);

  // UI2用の評価
  const [ui2Core, setUi2Core] = useState<number[]>(isDebugMode ? [4, 4, 4, 4] : [0, 0, 0, 0]);
  const [ui2Additional, setUi2Additional] = useState<number[]>(isDebugMode ? [4, 4, 4, 4] : [0, 0, 0, 0]);
  const [ui2Seq, setUi2Seq] = useState<number>(isDebugMode ? 4 : 0);

  // 全体質問
  const [favoriteUI, setFavoriteUI] = useState<string>(isDebugMode ? 'UI2' : '');
  const [reason, setReason] = useState<string>(isDebugMode ? 'デバッグモード：UI2の方が使いやすかったため' : '');

  // 質問文の定義
  const coreQuestions = [
    '必要な色の見通しを立てやすかった',
    '色選びで迷うことが少なかった',
    '候補の色同士の違いを理解しやすかった',
    '最終的に選んだ配色に納得できた',
  ];

  const additionalQuestions = [
    '色の候補が多すぎると感じた（逆転項目）',
    '必要な色に自然と辿り着けた',
    'イメージに合う色が選びやすかった',
    '他の色も試したくなるUIだった',
  ];

  const seqQuestion = 'このタスクは簡単だった';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!favoriteUI) {
      alert('どちらのUIの方が使いやすかったか選択してください');
      return;
    }

    if (
      ui1Core.some(v => v === 0) ||
      ui1Additional.some(v => v === 0) ||
      ui1Seq === 0 ||
      ui2Core.some(v => v === 0) ||
      ui2Additional.some(v => v === 0) ||
      ui2Seq === 0
    ) {
      alert('すべての質問に回答してください');
      return;
    }

    const response: SurveyResponse = {
      ui1_core: ui1Core,
      ui1_additional: ui1Additional,
      ui1_seq: ui1Seq,
      ui2_core: ui2Core,
      ui2_additional: ui2Additional,
      ui2_seq: ui2Seq,
      favoriteUI: favoriteUI,
      reason: reason.trim(),
    };

    onSubmit(response);
  };

  const updateRating = (
    ui: 'ui1' | 'ui2',
    category: 'core' | 'additional',
    index: number,
    value: number
  ) => {
    if (ui === 'ui1') {
      if (category === 'core') {
        const newCore = [...ui1Core];
        newCore[index] = value;
        setUi1Core(newCore);
      } else {
        const newAdditional = [...ui1Additional];
        newAdditional[index] = value;
        setUi1Additional(newAdditional);
      }
    } else {
      if (category === 'core') {
        const newCore = [...ui2Core];
        newCore[index] = value;
        setUi2Core(newCore);
      } else {
        const newAdditional = [...ui2Additional];
        newAdditional[index] = value;
        setUi2Additional(newAdditional);
      }
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
          <CardDescription>UI1（大量の色を一度に表示）について評価してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 py-6">
          {/* UI1 コアの4問 */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">基本評価</h3>
            {coreQuestions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base">
                  {index + 1}. {question}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                  <RatingScale
                    value={ui1Core[index]}
                    onChange={(value) => updateRating('ui1', 'core', index, value)}
                  />
                  <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
                </div>
              </div>
            ))}
          </div>

          {/* UI1 追加の4問 */}
          <div className="space-y-6 pt-4 border-t">
            <h3 className="font-semibold text-lg">詳細評価</h3>
            {additionalQuestions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base">
                  {index + 5}. {question}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                  <RatingScale
                    value={ui1Additional[index]}
                    onChange={(value) => updateRating('ui1', 'additional', index, value)}
                  />
                  <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
                </div>
              </div>
            ))}
          </div>

          {/* UI1 SEQ */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-lg">タスク難易度</h3>
            <Label className="text-base">9. {seqQuestion}</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
              <RatingScale value={ui1Seq} onChange={setUi1Seq} />
              <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
            </div>
          </div>
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
          <CardDescription>UI2（二段階推薦）について評価してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 py-6">
          {/* UI2 コアの4問 */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">基本評価</h3>
            {coreQuestions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base">
                  {index + 1}. {question}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                  <RatingScale
                    value={ui2Core[index]}
                    onChange={(value) => updateRating('ui2', 'core', index, value)}
                  />
                  <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
                </div>
              </div>
            ))}
          </div>

          {/* UI2 追加の4問 */}
          <div className="space-y-6 pt-4 border-t">
            <h3 className="font-semibold text-lg">詳細評価</h3>
            {additionalQuestions.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base">
                  {index + 5}. {question}
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
                  <RatingScale
                    value={ui2Additional[index]}
                    onChange={(value) => updateRating('ui2', 'additional', index, value)}
                  />
                  <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
                </div>
              </div>
            ))}
          </div>

          {/* UI2 SEQ */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-lg">タスク難易度</h3>
            <Label className="text-base">9. {seqQuestion}</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-24 text-right">全くそう思わない</span>
              <RatingScale value={ui2Seq} onChange={setUi2Seq} />
              <span className="text-sm text-muted-foreground w-24">非常にそう思う</span>
            </div>
          </div>
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
              placeholder="例：UI2の方が色を選びやすく、迷わずに必要な色を見つけられたため"
              className="min-h-[120px] resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* 送信ボタン */}
      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" className="w-full max-w-md">
          アンケートを送信
        </Button>
      </div>
    </form>
  );
};
