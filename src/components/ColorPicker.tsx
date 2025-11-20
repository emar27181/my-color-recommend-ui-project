import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { ColorBlock } from '@/components/common/ColorBlock';
import { TYPOGRAPHY } from '@/constants/ui';
import { useTutorial } from '@/contexts/TutorialContext';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { useMemo } from 'react';

export const ColorPicker = () => {
  const { baseColor, setColorFromBase } = useColorStore();
  const { onUserAction } = useTutorial();
  const { t } = useTranslation();

  // 24色の色相パレット（15度区切り、明度50、彩度100）を生成
  const hueColors = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hue = i * 15; // 0, 15, 30, ..., 345
      return chroma.hsl(hue, 1, 0.5).hex();
    });
  }, []);

  const handleColorClick = (color: string) => {
    // ベース色選択：ベースカラー、selectedColor、描画色をすべて更新
    setColorFromBase(color);
    // チュートリアルの自動進行をトリガー
    onUserAction('click', '[data-tutorial="color-picker"]');
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:block h-full">
          <div className="p-1 transition-all duration-200">
            {/* 選択中のベースカラー表示 */}
            <div className="flex items-center gap-3" data-tutorial="color-picker">
              <ColorBlock
                color={baseColor}
                isHighlighted={true}
              />
              <div className="flex-1 min-w-0">
                <p className={`${TYPOGRAPHY.colorCode} truncate`}>{baseColor}</p>
              </div>
              <CopyColorButton
                color={baseColor}
                variant="minimal"
                className="opacity-100"
              />
            </div>

            {/* 24色パレット（横一列） - 常時表示 */}
            <div className="mt-3">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {hueColors.map((color, index) => (
                  <ColorBlock
                    key={index}
                    color={color}
                    onClick={() => handleColorClick(color)}
                    title={`${t('colorPicker.hue')}: ${index * 15}°`}
                    showClickIcon={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden h-full">
          <div className="p-1">
            {/* 選択中のベースカラー表示 */}
            <div className="flex items-center gap-2">
              <div
                className="border-2 border-foreground rounded-md"
                style={{
                  backgroundColor: baseColor,
                  width: '24px',
                  height: '24px'
                }}
              />
              <CopyColorButton
                color={baseColor}
                variant="minimal"
                className="opacity-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-muted-foreground truncate block">{baseColor}</span>
              </div>
            </div>

            {/* 24色パレット（横一列） - 常時表示 */}
            <div className="mt-2">
              <div className="flex gap-1 overflow-x-auto pb-2">
                {hueColors.map((color, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:scale-110 transition-all duration-200 rounded-md flex-shrink-0"
                    style={{
                      backgroundColor: color,
                      width: '32px',
                      height: '32px'
                    }}
                    onClick={() => handleColorClick(color)}
                    title={`${t('colorPicker.hue')}: ${index * 15}°`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};