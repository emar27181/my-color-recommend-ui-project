import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { useColorStore } from '@/store/colorStore';
import { useTranslation } from 'react-i18next';

interface HueToneExtractionProps {
  isMobile?: boolean;
}

export const HueToneExtraction = ({ isMobile = false }: HueToneExtractionProps) => {
  const { extractedColors, dominantColor, setColorFromExtracted } = useColorStore();
  const { t } = useTranslation();

  const handleColorClick = (color: string) => {
    setColorFromExtracted(color);
  };

  // 抽出された色をColorGridに適した形式に変換
  const colorItems = extractedColors.map(extractedColor => ({
    color: extractedColor.hex,
    title: `${extractedColor.hex} (${(extractedColor.usage * 100).toFixed(1)}%)`,
    showClickIcon: false,
    subtitle: `${(extractedColor.usage * 100).toFixed(1)}%`
  }));

  return (
    <Card className="w-full flex flex-col pb-0">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
        {/* ドミナントカラー表示 */}
        {dominantColor && (
          <div className="mb-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              {t('extractedColors.dominant')}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: dominantColor.hex }}
              />
              <span className="text-xs font-mono">
                {dominantColor.hex} ({(dominantColor.usage * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="hue-tone-extraction">
          <ColorGrid
            colors={colorItems}
            onColorClick={handleColorClick}
            clickable={true}
            isMobile={isMobile}
            emptyMessage={t('extractedColors.noColors')}
          />
        </div>
      </CardContent>
    </Card>
  );
};