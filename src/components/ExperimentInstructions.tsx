import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import type { ExperimentCondition } from '@/store/experimentStore';
import {
  EXPERIMENT_LAYOUT,
  EXPERIMENT_ICON_STYLES,
  getBadgeProps,
} from '@/constants/experimentTheme';

interface ExperimentInstructionsProps {
  condition: ExperimentCondition;
}

// 条件別の説明
const CONDITION_INFO = {
  Test1: {
    title: 'Test1: UI方式1',
    description: '大量の色が一度に表示されます。多くの選択肢から色を選ぶ体験をしてください。',
  },
  Test2: {
    title: 'Test2: UI方式2',
    description: '色相環とスライダーで自由に色を作成できます。色の数に制限はありません。',
  },
  Test3: {
    title: 'Test3: UI方式3',
    description: 'まず色相から選択し、次にトーンから選択します。',
  },
};

export const ExperimentInstructions = ({ condition }: ExperimentInstructionsProps) => {
  const conditionInfo = CONDITION_INFO[condition];

  return (
    <div className={`${EXPERIMENT_LAYOUT.containerWidth.centered} space-y-4 mb-6`}>
      {/* 現在の条件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className={`${EXPERIMENT_ICON_STYLES.default} text-primary`} />
            <Badge {...getBadgeProps('condition')}>
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
