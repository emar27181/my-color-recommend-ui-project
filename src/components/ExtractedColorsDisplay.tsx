import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';

interface ExtractedColorsDisplayProps {
  isMobile?: boolean;
}

export const ExtractedColorsDisplay = ({ isMobile = false }: ExtractedColorsDisplayProps) => {
  const { extractedColors, setColorFromExtracted } = useColorStore();

  if (extractedColors.length === 0) {
    return null;
  }

  const handleColorSelect = (color: string) => {
    setColorFromExtracted(color);
  };

  return (
    <section>
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="pb-0 pt-1 flex-shrink-0">
        </CardHeader>
        <CardContent className="pt-0 flex-1 overflow-auto pb-0">
          <ColorGrid
            colors={extractedColors.map(color => ({
              color: color.hex,
              title: `${color.hex} (タップで選択)`,
              subtitle: `${Math.round(color.usage * 100)}%`
            }))}
            onColorClick={handleColorSelect}
            isMobile={isMobile}
            emptyMessage="画像から色が抽出されていません"
          />
        </CardContent>
      </Card>
    </section>
  );
};