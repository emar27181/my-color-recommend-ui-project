import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { SurveyResponse } from '@/store/experimentStore';

interface SurveyFormProps {
  onSubmit: (response: SurveyResponse) => void;
}

/**
 * アンケートフォームコンポーネント
 *
 * - SUS簡易版（5問）
 * - TAM（3問）
 * - Mini-CSI（3問）
 * - 最も使いやすかったUI + 理由 + 改善点
 */
export const SurveyForm = ({ onSubmit }: SurveyFormProps) => {
  // SUS簡易版（5問）
  const [usability, setUsability] = useState<number[]>([0, 0, 0, 0, 0]);

  // TAM（3問）
  const [effectiveness, setEffectiveness] = useState<number[]>([0, 0, 0]);

  // Mini-CSI（3問）
  const [creativity, setCreativity] = useState<number[]>([0, 0, 0]);

  // 選択UI・理由・改善点
  const [favoriteUI, setFavoriteUI] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [improvement, setImprovement] = useState<string>('');

  // SUS質問文
  const susQuestions = [
    'このシステムを頻繁に使いたい',
    'このシステムは使いやすい',
    'このシステムの機能はよく統合されている',
    'このシステムの使い方をすぐに学べた',
    '自信を持ってこのシステムを使えた',
  ];

  // TAM質問文
  const tamQuestions = [
    'このシステムは配色タスクに役立つ',
    'このシステムを使うと作業が速くなる',
    '今後もこのシステムを使いたい',
  ];

  // Mini-CSI質問文
  const csiQuestions = [
    '新しい配色の発想が得られた',
    '自分の配色に自信が持てた',
    '配色作業が楽しかった',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!favoriteUI) {
      alert('最も使いやすかったUIを選択してください');
      return;
    }

    if (usability.some(v => v === 0) || effectiveness.some(v => v === 0) || creativity.some(v => v === 0)) {
      alert('すべての質問に回答してください');
      return;
    }

    const response: SurveyResponse = {
      usability,
      effectiveness,
      creativity,
      favoriteUI,
      reason: reason.trim(),
      improvement: improvement.trim(),
    };

    onSubmit(response);
  };

  const updateRating = (category: 'usability' | 'effectiveness' | 'creativity', index: number, value: number) => {
    if (category === 'usability') {
      const newUsability = [...usability];
      newUsability[index] = value;
      setUsability(newUsability);
    } else if (category === 'effectiveness') {
      const newEffectiveness = [...effectiveness];
      newEffectiveness[index] = value;
      setEffectiveness(newEffectiveness);
    } else if (category === 'creativity') {
      const newCreativity = [...creativity];
      newCreativity[index] = value;
      setCreativity(newCreativity);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SUS簡易版 */}
      <Card>
        <CardHeader>
          <CardTitle>1. システムの使いやすさ（SUS）</CardTitle>
          <CardDescription>
            1（全くそう思わない）〜 5（非常にそう思う）で評価してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {susQuestions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-base">{question}</Label>
              <div className="flex gap-4 items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`sus-${index}`}
                      value={value}
                      checked={usability[index] === value}
                      onChange={() => updateRating('usability', index, value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TAM */}
      <Card>
        <CardHeader>
          <CardTitle>2. システムの有用性（TAM）</CardTitle>
          <CardDescription>
            1（全くそう思わない）〜 5（非常にそう思う）で評価してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tamQuestions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-base">{question}</Label>
              <div className="flex gap-4 items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`tam-${index}`}
                      value={value}
                      checked={effectiveness[index] === value}
                      onChange={() => updateRating('effectiveness', index, value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mini-CSI */}
      <Card>
        <CardHeader>
          <CardTitle>3. 創造性支援（Mini-CSI）</CardTitle>
          <CardDescription>
            1（全くそう思わない）〜 5（非常にそう思う）で評価してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {csiQuestions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-base">{question}</Label>
              <div className="flex gap-4 items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`csi-${index}`}
                      value={value}
                      checked={creativity[index] === value}
                      onChange={() => updateRating('creativity', index, value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 最も使いやすかったUI */}
      <Card>
        <CardHeader>
          <CardTitle>4. 最も使いやすかったUI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">最も使いやすかったUIを選択してください</Label>
            <RadioGroup value={favoriteUI} onValueChange={setFavoriteUI}>
              {['Test1', 'Test2', 'Test3'].map((cond) => (
                <div key={cond} className="flex items-center space-x-2">
                  <RadioGroupItem value={cond} id={`fav-${cond}`} />
                  <Label htmlFor={`fav-${cond}`} className="cursor-pointer">{cond}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="reason" className="text-base">そう思った理由を教えてください</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：色の選択が直感的で、推薦機能が役立った"
              rows={4}
              className="resize-none bg-muted text-foreground border-2"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="improvement" className="text-base">改善してほしい点があれば教えてください</Label>
            <Textarea
              id="improvement"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="例：推薦色の数を増やしてほしい"
              rows={4}
              className="resize-none bg-muted text-foreground border-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 送信ボタン */}
      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto px-12">
          実験結果をダウンロード
        </Button>
      </div>
    </form>
  );
};
