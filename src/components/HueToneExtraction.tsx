import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { useColorStore } from '@/store/colorStore';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

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
  const colorItems = extractedColors.map(extractedColor => {
    try {
      const [h, s, l] = chroma(extractedColor.hex).hsl();
      const hsl = `hsl(${Math.round(h || 0)}, ${Math.round((s || 0) * 100)}%, ${Math.round((l || 0) * 100)}%)`;
      return {
        color: extractedColor.hex,
        title: extractedColor.hex,
        showClickIcon: false,
        subtitle: `${hsl} (${(extractedColor.usage * 100).toFixed(1)}%)`
      };
    } catch (error) {
      return {
        color: extractedColor.hex,
        title: extractedColor.hex,
        showClickIcon: false,
        subtitle: `${(extractedColor.usage * 100).toFixed(1)}%`
      };
    }
  });

  return (
    <Card className="w-full flex flex-col pb-0">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
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