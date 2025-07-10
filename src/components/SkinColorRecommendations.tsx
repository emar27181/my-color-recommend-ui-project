import { Card, CardContent } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';

interface SkinColorRecommendationsProps {
  className?: string;
}

/**
 * 肌色推薦コンポーネント
 * 固定された肌色パレットを表示
 */
export const SkinColorRecommendations = ({ className = '' }: SkinColorRecommendationsProps) => {
  // 固定の肌色パレット（順番通り）
  const skinColors = [
    '#FFF5F0', // 色白系ベース
    '#FFDCD1', // 色白系頬
    '#FFEBE1', // 明るめナチュラルベース
    '#FFCDC1', // 明るめナチュラル頬
    '#FFE1CD', // 標準的な肌色ベース
    '#FFC3AA', // 標準的な肌色頬
    '#FAD2B4', // 健康的な褐色ベース
    '#FFAF8C', // 健康的な褐色頬
    '#FABE96', // やや褐色系ベース
    '#FFA582', // やや褐色系頬
  ];

  const colorData = skinColors.map((color) => ({
    color,
    showClickIcon: false,
  }));

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardContent className="pt-1 flex-1 overflow-auto pb-0">
        <ColorGrid
          colors={colorData}
          emptyMessage="肌色が読み込まれていません"
          clickable={false}
        />
      </CardContent>
    </Card>
  );
};