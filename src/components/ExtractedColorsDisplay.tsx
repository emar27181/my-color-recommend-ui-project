import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { RESPONSIVE_GRID, TYPOGRAPHY } from '@/constants/ui';

export const ExtractedColorsDisplay = () => {
  const { extractedColors, setColorFromExtracted } = useColorStore();

  if (extractedColors.length === 0) {
    return null;
  }

  const handleColorSelect = (color: string) => {
    setColorFromExtracted(color);
  };

  return (
    <section>
      <Card className="w-full">
        <CardHeader className="pb-2">
        </CardHeader>
        <CardContent className="pt-2">
          {/* 抽出色一覧 */}
          <>
            {/* Desktop/Tablet Layout */}
            <div className={`hidden md:block ${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {extractedColors.map((color, index) => (
                <div key={index} className="bg-card border border-border rounded-sm p-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleColorSelect(color.hex)}>
                  <div className="flex items-center gap-4">
                    <ColorBlock
                      color={color.hex}
                      title={`${color.hex} (タップで選択)`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`${TYPOGRAPHY.colorCode} truncate`}>{color.hex}</p>
                      <p className={TYPOGRAPHY.usage}>
                        {Math.round(color.usage * 100)}%
                      </p>
                    </div>
                    <CopyColorButton
                      color={color.hex}
                      variant="minimal"
                      className="opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile 2-Column Layout */}
            <div className="block md:hidden space-y-2">
              {Array.from({ length: Math.ceil(extractedColors.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {extractedColors.slice(rowIndex * 2, (rowIndex + 1) * 2).map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-card border border-border rounded-sm p-2 shadow-sm flex-1 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => handleColorSelect(color.hex)}>
                      <div
                        className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                        style={{
                          backgroundColor: color.hex,
                          width: '40px',
                          height: '40px'
                        }}
                        title={`${color.hex} (タップで選択)`}
                      />
                      <CopyColorButton
                        color={color.hex}
                        variant="minimal"
                        className="opacity-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono text-muted-foreground truncate block">{color.hex}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(color.usage * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        </CardContent>
      </Card>
    </section>
  );
};