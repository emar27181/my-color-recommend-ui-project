import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import chroma from 'chroma-js';
import { useColorStore } from '@/store/colorStore';
import { memo } from 'react';

/**
 * Test1用: 全色相×複数トーンのグリッド表示コンポーネント
 *
 * 既存のカラーパレット方式の問題を体験させる目的で、
 * 大量の色を一度に表示して選択の困難さを再現
 */

// 色相の数: 15度刻みで24色相
const HUE_STEPS = 24;
const HUE_INCREMENT = 360 / HUE_STEPS;

// 各色相に対するトーンバリエーション
const SATURATION_LEVELS = [30, 50, 70, 90]; // 4段階の彩度
const LIGHTNESS_LEVELS = [85, 70, 55, 40, 25]; // 5段階の明度

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
    <div className="space-y-4">
      {/* カラーグリッド */}
      <div
        className="grid gap-1 overflow-auto max-h-[500px] p-2"
        style={{
          gridTemplateColumns: `repeat(${HUE_STEPS}, minmax(0, 1fr))`,
        }}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(color)}
            className="w-10 h-10 rounded border border-gray-300 hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ backgroundColor: color.hex }}
            title={`${color.hex} (H:${color.hue.toFixed(0)}° S:${color.saturation}% L:${color.lightness}%)`}
          />
        ))}
      </div>

      {/* 統計情報 */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <div>合計 {colors.length} 色（色相 {HUE_STEPS}種 × 彩度 {SATURATION_LEVELS.length}段階 × 明度 {LIGHTNESS_LEVELS.length}段階）</div>
        <div>横: 色相（24種）/ 縦: 明度×彩度（明るい→暗い）</div>
      </div>
    </div>
  );
});

MassColorGridContent.displayName = 'MassColorGridContent';

/**
 * Test1: 既存カラーパレット方式
 * 全色相×複数トーンの大量の色を一度に表示
 */
export const MassColorGrid = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">カラーパレット</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <MassColorGridContent />
      </CardContent>
    </Card>
  );
};
