import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  UI1: {
    title: 'UI1: UI方式1',
    description: '大量の色が一度に表示されます。多くの選択肢から色を選ぶ体験をしてください。',
  },
  UI2: {
    title: 'UI2: UI方式2',
    description: '色相環とスライダーで自由に色を作成できます。色の数に制限はありません。',
  },
};

export const ExperimentInstructions = ({ condition }: ExperimentInstructionsProps) => {
  const conditionInfo = CONDITION_INFO[condition];

  return (
    <div className={`${EXPERIMENT_LAYOUT.containerWidth.centered} mb-2`}>
      {/* 現在の条件 */}
      <Card>
        <CardHeader className="py-2 px-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <InfoIcon className={`${EXPERIMENT_ICON_STYLES.small} text-primary`} />
            <Badge {...getBadgeProps('condition')}>
              {condition}
            </Badge>
            <span className="text-sm">{conditionInfo.title}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {conditionInfo.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
