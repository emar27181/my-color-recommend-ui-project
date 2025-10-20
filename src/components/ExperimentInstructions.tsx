import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import type { ExperimentCondition } from '@/store/experimentStore';

interface ExperimentInstructionsProps {
  condition: ExperimentCondition;
}

// 条件別の説明
const CONDITION_INFO = {
  Test1: {
    title: 'Test1: 既存カラーパレット方式',
    description: '全色相×複数トーンの大量の色が一度に表示されます。多くの選択肢から色を選ぶ体験をしてください。',
  },
  Test2: {
    title: 'Test2: 色相環＋トーンスライダー方式',
    description: '色相環とトーンスライダーで自由に色を作成できます。色の数に制限はありません。',
  },
  Test3: {
    title: 'Test3: 二段階推薦方式',
    description: 'まず色相推薦から選択し、次にトーン推薦から選択します（提案手法）。',
  },
};

export const ExperimentInstructions = ({ condition }: ExperimentInstructionsProps) => {
  const conditionInfo = CONDITION_INFO[condition];

  return (
    <div className="w-[70%] mx-auto space-y-4 mb-6">
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
