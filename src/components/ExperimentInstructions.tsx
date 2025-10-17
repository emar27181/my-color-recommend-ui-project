import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import type { ExperimentCondition } from '@/store/experimentStore';

interface ExperimentInstructionsProps {
  condition: ExperimentCondition;
}

// 条件別の説明
const CONDITION_INFO = {
  C0: {
    title: 'C0: 推薦なし',
    description: '通常のカラーピッカーのみで色を選択します。色相推薦・トーン推薦は表示されません。',
  },
  C1: {
    title: 'C1: 色相推薦のみ',
    description: 'ベース色から色相に基づく推薦色が表示されます（配色技法に基づく推薦）。',
  },
  C2: {
    title: 'C2: トーン推薦のみ',
    description: '選択した色からトーンに基づく推薦色が表示されます（明度・彩度バリエーション）。',
  },
  C3: {
    title: 'C3: 二段階推薦',
    description: '色相とトーンの両方に基づく推薦色が表示されます（すべての推薦機能が利用可能）。',
  },
};

export const ExperimentInstructions = ({ condition }: ExperimentInstructionsProps) => {
  const conditionInfo = CONDITION_INFO[condition];

  return (
    <div className="space-y-4 mb-6">
      {/* 現在の条件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-primary" />
            <Badge variant="outline" className="font-mono text-base">
              {condition}
            </Badge>
            {conditionInfo.title}
          </CardTitle>
          <CardDescription>
            {conditionInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            このツールを使って、自由にイラストに色を塗ってください。
            完了したら画面上部の「条件を完了」ボタンを押してください。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
