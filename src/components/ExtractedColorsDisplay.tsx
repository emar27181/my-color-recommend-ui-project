import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';

interface ExtractedColorsDisplayProps {
  isMobile?: boolean;
}

export const ExtractedColorsDisplay = ({ isMobile = false }: ExtractedColorsDisplayProps) => {
  const { extractedColors, setColorFromBase } = useColorStore();

  if (extractedColors.length === 0) {
    return null;
  }

  const handleColorSelect = (color: string) => {
    // 抽出色からの選択はベース色選択として扱う
    setColorFromBase(color);
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
              title: "タップで選択",
              subtitle: `${Math.round(color.usage * 100)}%`
            }))}
            onColorClick={handleColorSelect}
            isMobile={isMobile}
            gridType="baseColors" // ベース色選択専用: モバイル2列、PC4列
            emptyMessage="画像から色が抽出されていません"
          />
        </CardContent>
      </Card>
    </section>
  );
};