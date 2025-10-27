import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Bug } from 'lucide-react';
import type { SurveyResponse } from '@/store/experimentStore';

interface SurveyFormProps {
  onSubmit: (response: SurveyResponse) => void;
  isDebugMode?: boolean;
}

/**
 * アンケートフォームコンポーネント
 *
 * - SUS簡易版（5問）
 * - TAM（3問）
 * - Mini-CSI（3問）
 * - 最も使いやすかったUI + 理由 + 改善点
 * - デバッグモード対応（自動入力）
 */
export const SurveyForm = ({ onSubmit, isDebugMode = false }: SurveyFormProps) => {
  // SUS簡易版（5問）- デバッグモード時は全て4に設定
  const [usability, setUsability] = useState<number[]>(isDebugMode ? [4, 4, 4, 4, 4] : [0, 0, 0, 0, 0]);

  // TAM（3問）- デバッグモード時は全て4に設定
  const [effectiveness, setEffectiveness] = useState<number[]>(isDebugMode ? [4, 4, 4] : [0, 0, 0]);

  // Mini-CSI（3問）- デバッグモード時は全て4に設定
  const [creativity, setCreativity] = useState<number[]>(isDebugMode ? [4, 4, 4] : [0, 0, 0]);

  // 選択UI・理由・改善点 - デバッグモード時は自動入力（複数選択可能）
  const [favoriteUI, setFavoriteUI] = useState<string[]>(isDebugMode ? ['Test3'] : []);
  const [reason, setReason] = useState<string>(isDebugMode ? 'デバッグモードでの自動入力テスト' : '');
  const [improvement, setImprovement] = useState<string>(isDebugMode ? '特になし（デバッグ）' : '');

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
    if (favoriteUI.length === 0) {
      alert('最も使いやすかったUIを少なくとも1つ選択してください');
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
      {/* デバッグモードインジケーター */}
      {isDebugMode && (
        <div className="p-3 bg-orange-100 dark:bg-orange-900 border-2 border-orange-500 rounded-lg">
          <div className="flex items-center gap-2 justify-center">
            <Bug className="w-5 h-5 text-orange-700 dark:text-orange-300" />
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              デバッグモード有効（アンケート自動入力済み）
            </span>
          </div>
        </div>
      )}

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
            <Label className="text-base">最も使いやすかったUIを選択してください（複数選択可）</Label>
            <div className="space-y-2">
              {['Test1', 'Test2', 'Test3'].map((cond) => (
                <div key={cond} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fav-${cond}`}
                    checked={favoriteUI.includes(cond)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFavoriteUI([...favoriteUI, cond]);
                      } else {
                        setFavoriteUI(favoriteUI.filter((ui) => ui !== cond));
                      }
                    }}
                  />
                  <Label htmlFor={`fav-${cond}`} className="cursor-pointer">{cond}</Label>
                </div>
              ))}
            </div>
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
