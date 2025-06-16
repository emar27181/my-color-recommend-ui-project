import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { RESPONSIVE_GRID, TYPOGRAPHY } from '@/constants/ui';

export const ExtractedColorsDisplay = () => {
  const { extractedColors, dominantColor, setColorFromExtracted } = useColorStore();

  if (extractedColors.length === 0) {
    return null;
  }

  const handleColorSelect = (color: string) => {
    setColorFromExtracted(color);
  };

  return (
    <section>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            抽出された色
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            画像から抽出された色をクリックして推薦の起点として使用できます
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ドミナントカラー */}
          {dominantColor && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <span>最頻出色</span>
                <span className="text-xs text-muted-foreground">(自動選択済み)</span>
              </h3>
              <div className="bg-card border-2 border-primary rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
                   onClick={() => handleColorSelect(dominantColor.hex)}>
                <div className="flex items-center gap-4">
                  <ColorBlock 
                    color={dominantColor.hex}
                    title={`ドミナントカラー: ${dominantColor.hex} (タップで選択)`}
                  />
                  <div className="flex-1">
                    <h4 className={`${TYPOGRAPHY.title} mb-1`}>最頻出色</h4>
                    <p className={`${TYPOGRAPHY.colorCode} mb-1`}>{dominantColor.hex}</p>
                    <p className={TYPOGRAPHY.usage}>
                      {Math.round(dominantColor.usage * 100)}%
                    </p>
                  </div>
                  <CopyColorButton 
                    color={dominantColor.hex} 
                    variant="compact"
                    className="opacity-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* その他の抽出色 */}
          <div>
            <h3 className="text-sm font-medium mb-3">その他の抽出色</h3>
            <div className={`${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {extractedColors
                .filter(color => color.hex !== dominantColor?.hex)
                .map((color, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                       onClick={() => handleColorSelect(color.hex)}>
                    <div className="flex items-center gap-3">
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
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};