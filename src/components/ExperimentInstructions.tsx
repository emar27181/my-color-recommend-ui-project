import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ExperimentCondition } from '@/store/experimentStore';

interface ExperimentInstructionsProps {
  condition: ExperimentCondition;
}

// 条件別の機能説明
const CONDITION_FEATURES = {
  C0: {
    title: 'C0: 推薦なし',
    description: '通常のカラーピッカーのみで色を選択します。',
    features: [
      'カラーピッカーで自由に色を選択',
      '画像から色を抽出',
      'キャンバスで色を塗る',
    ],
    disabled: ['色相推薦機能', 'トーン推薦機能'],
  },
  C1: {
    title: 'C1: 色相推薦のみ',
    description: 'ベース色から色相に基づく推薦色が表示されます。',
    features: [
      'カラーピッカーで自由に色を選択',
      '画像から色を抽出',
      'キャンバスで色を塗る',
      '色相推薦機能（配色技法に基づく推薦）',
    ],
    disabled: ['トーン推薦機能'],
  },
  C2: {
    title: 'C2: トーン推薦のみ',
    description: '選択した色からトーンに基づく推薦色が表示されます。',
    features: [
      'カラーピッカーで自由に色を選択',
      '画像から色を抽出',
      'キャンバスで色を塗る',
      'トーン推薦機能（明度・彩度バリエーション）',
    ],
    disabled: ['色相推薦機能'],
  },
  C3: {
    title: 'C3: 二段階推薦',
    description: '色相とトーンの両方に基づく推薦色が表示されます。',
    features: [
      'カラーピッカーで自由に色を選択',
      '画像から色を抽出',
      'キャンバスで色を塗る',
      '色相推薦機能（配色技法に基づく推薦）',
      'トーン推薦機能（明度・彩度バリエーション）',
    ],
    disabled: [],
  },
};

export const ExperimentInstructions = ({ condition }: ExperimentInstructionsProps) => {
  const conditionInfo = CONDITION_FEATURES[condition];

  return (
    <div className="space-y-4 mb-6">
      {/* 実験概要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-primary" />
            実験について
          </CardTitle>
          <CardDescription>
            色推薦UIの評価実験にご協力ありがとうございます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            この実験では、イラスト配色支援ツールの異なる推薦機能が、
            ユーザー体験や作業効率にどのような影響を与えるかを調査します。
          </p>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>データ収集について：</strong>
              実験中のすべての操作（色選択、推薦クリック、描画など）が自動的に記録されます。
              収集されたデータは研究目的のみに使用され、個人を特定する情報は含まれません。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 条件別の機能説明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-base">
              {condition}
            </Badge>
            {conditionInfo.title}
          </CardTitle>
          <CardDescription>
            {conditionInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 利用可能な機能 */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              利用可能な機能
            </h4>
            <ul className="text-sm space-y-1 ml-6">
              {conditionInfo.features.map((feature, index) => (
                <li key={index} className="list-disc text-muted-foreground">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* 利用不可の機能 */}
          {conditionInfo.disabled.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                利用不可の機能
              </h4>
              <ul className="text-sm space-y-1 ml-6">
                {conditionInfo.disabled.map((feature, index) => (
                  <li key={index} className="list-disc text-muted-foreground line-through">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 操作ガイド */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">操作方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal ml-4 space-y-2 text-muted-foreground">
            <li>
              <strong>参加者ID</strong>を入力して<strong>「開始」</strong>ボタンをクリック
            </li>
            <li>
              色選択ツールを使ってイラストに色を塗る（自由に操作してください）
            </li>
            <li>
              作業が終わったら<strong>「終了してダウンロード」</strong>ボタンをクリック
            </li>
            <li>
              JSONファイルが自動的にダウンロードされます
            </li>
            <li>
              ダウンロードしたファイルをGoogleフォームにアップロードしてください
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
