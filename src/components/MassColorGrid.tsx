import { Card, CardContent } from '@/components/ui/card';
import chroma from 'chroma-js';
import { useColorStore } from '@/store/colorStore';
import { memo } from 'react';

/**
 * UI1用: 全色相×複数トーンのグリッド表示コンポーネント
 *
 * 既存のカラーパレット方式の問題を体験させる目的で、
 * 大量の色を一度に表示して選択の困難さを再現
 */

// 色相の数: 30度刻みで12色相
const HUE_STEPS = 12;
const HUE_INCREMENT = 360 / HUE_STEPS;

// トーン推薦と同じ明度・彩度の組み合わせ（16パターン = 4×4）
const SATURATION_LEVELS = [20, 40, 60, 80]; // 4段階の彩度（左から右へ：薄い→鮮やか）
const LIGHTNESS_LEVELS = [80, 60, 40, 20]; // 4段階の明度（上から下へ：明るい→暗い）

interface ColorCell {
  hex: string;
  hue: number;
  saturation: number;
  lightness: number;
}

// 全色を生成する関数
// 配列順: 明度（明るい→暗い）→ 彩度（低い→高い）→ 色相（0°→360°）
const generateMassColorGrid = (): ColorCell[] => {
  const colors: ColorCell[] = [];

  // 明度ごとにループ（明るい→暗い）
  for (const lightness of LIGHTNESS_LEVELS) {
    // 各明度内で彩度ごとにループ
    for (const saturation of SATURATION_LEVELS) {
      // 各彩度内で全色相をループ（横一列に24色相）
      for (let hueIndex = 0; hueIndex < HUE_STEPS; hueIndex++) {
        const hue = hueIndex * HUE_INCREMENT;

        try {
          const color = chroma.hsl(hue, saturation / 100, lightness / 100);
          colors.push({
            hex: color.hex(),
            hue,
            saturation,
            lightness,
          });
        } catch (error) {
          console.error('Error generating color:', error);
        }
      }
    }
  }

  return colors;
};

// メモ化された色グリッド
const MassColorGridContent = memo(() => {
  const { setPaintColor } = useColorStore();
  const colors = generateMassColorGrid();

  const handleColorClick = (color: ColorCell) => {
    setPaintColor(color.hex);
  };

  return (
    <div className="space-y-2">
      {/* カラーグリッド */}
      <div
        className="grid gap-1 p-2"
        style={{
          gridTemplateColumns: `repeat(${HUE_STEPS}, minmax(0, 1fr))`,
        }}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(color)}
            className="w-12 h-12 aspect-square rounded-sm border-2 border-gray-300 hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ backgroundColor: color.hex }}
            title={`${color.hex} (H:${color.hue.toFixed(0)}° S:${color.saturation}% L:${color.lightness}%)`}
          />
        ))}
      </div>
    </div>
  );
});

MassColorGridContent.displayName = 'MassColorGridContent';

/**
 * UI1: 既存カラーパレット方式
 * 全色相×複数トーンの大量の色を一度に表示
 */
export const MassColorGrid = () => {
  return (
    <Card className="h-[650px] flex flex-col">
      <CardContent className="pt-2 flex-1 overflow-auto">
        <MassColorGridContent />
      </CardContent>
    </Card>
  );
};
