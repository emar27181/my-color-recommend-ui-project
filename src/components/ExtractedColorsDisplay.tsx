import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToastContext } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/clipboard';
import { Copy, Check, Palette, MousePointer } from 'lucide-react';

export const ExtractedColorsDisplay = () => {
  const { extractedColors, dominantColor, setColorFromExtracted } = useColorStore();
  const { showToast } = useToastContext();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (extractedColors.length === 0) {
    return null;
  }

  const handleCopyColor = async (color: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await copyToClipboard(color);
    
    if (result.success) {
      setCopiedColor(color);
      showToast(`カラーコード ${color} をコピーしました`, 'success');
      setTimeout(() => setCopiedColor(null), 2000);
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  const handleColorSelect = (color: string) => {
    setColorFromExtracted(color);
    showToast(`${color} を選択色として設定しました`, 'success');
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
        <CardContent className="space-y-4">
          {/* ドミナントカラー */}
          {dominantColor && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span>最頻出色</span>
                <span className="text-xs text-muted-foreground">(自動選択済み)</span>
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div
                    className="w-8 h-8 rounded border-2 border-primary shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: dominantColor.hex }}
                    onClick={() => handleColorSelect(dominantColor.hex)}
                    title={`ドミナントカラー: ${dominantColor.hex} (クリックで選択)`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MousePointer className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm">{dominantColor.hex}</p>
                  <p className="text-xs text-muted-foreground">
                    使用度: {Math.round(dominantColor.usage * 100)}%
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCopyColor(dominantColor.hex, e)}
                  className="flex items-center gap-1"
                >
                  {copiedColor === dominantColor.hex ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  コピー
                </Button>
              </div>
            </div>
          )}

          {/* その他の抽出色 */}
          <div>
            <h3 className="text-sm font-medium mb-2">その他の抽出色</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-2">
              {extractedColors
                .filter(color => color.hex !== dominantColor?.hex)
                .map((color, index) => (
                  <div key={index} className="space-y-1 group">
                    <div className="relative">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer hover:border-primary hover:scale-105 transition-all duration-200 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => handleColorSelect(color.hex)}
                        title={`${color.hex} (クリックで選択)`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <MousePointer className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                      <button
                        onClick={(e) => handleCopyColor(color.hex, e)}
                        className="absolute top-0.5 right-0.5 p-1 rounded bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        title="カラーコードをコピー"
                      >
                        {copiedColor === color.hex ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded text-center truncate">
                        {color.hex}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {Math.round(color.usage * 100)}%
                      </p>
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