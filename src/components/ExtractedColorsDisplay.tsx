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
        <CardContent className="space-y-6">
          {/* ドミナントカラー */}
          {dominantColor && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <span>最頻出色</span>
                <span className="text-xs text-muted-foreground">(自動選択済み)</span>
              </h3>
              <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
                   onClick={() => handleColorSelect(dominantColor.hex)}>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                    <div 
                      className="absolute inset-0 border-8"
                      style={{ 
                        borderColor: dominantColor.hex,
                        background: `radial-gradient(circle, ${dominantColor.hex} 20%, ${dominantColor.hex}80 60%, ${dominantColor.hex} 100%)`,
                        boxShadow: `inset 0 0 20px ${dominantColor.hex}60, 0 0 15px ${dominantColor.hex}40`
                      }}
                      title={`ドミナントカラー: ${dominantColor.hex} (クリックで選択)`}
                    />
                    <div 
                      className="absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: dominantColor.hex }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-1">最頻出色</h4>
                    <p className="font-mono text-sm text-foreground mb-2">{dominantColor.hex}</p>
                    <p className="text-xs text-muted-foreground">
                      使用度: {Math.round(dominantColor.usage * 100)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MousePointer className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* その他の抽出色 */}
          <div>
            <h3 className="text-sm font-medium mb-3">その他の抽出色</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {extractedColors
                .filter(color => color.hex !== dominantColor?.hex)
                .map((color, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                       onClick={() => handleColorSelect(color.hex)}>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden border-2 border-border">
                        <div 
                          className="absolute inset-0"
                          style={{ 
                            background: `conic-gradient(${color.hex} 0deg, ${color.hex}90 90deg, ${color.hex} 180deg, ${color.hex}90 270deg, ${color.hex} 360deg)`,
                            boxShadow: `0 0 20px ${color.hex}50`
                          }}
                          title={`${color.hex} (クリックで選択)`}
                        />
                        <div 
                          className="absolute inset-2 rounded border-2"
                          style={{ 
                            borderColor: color.hex,
                            backgroundColor: `${color.hex}20`
                          }}
                        />
                        <div 
                          className="absolute bottom-1 left-1 w-2 h-2 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-bold truncate" style={{ color: color.hex }}>{color.hex}</p>
                        <p className="text-xs" style={{ color: `${color.hex}CC` }}>
                          {Math.round(color.usage * 100)}% • 
                          <span className="inline-block w-2 h-2 rounded-full ml-1" style={{ backgroundColor: color.hex }}></span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={(e) => handleCopyColor(color.hex, e)}
                          className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          title="カラーコードをコピー"
                        >
                          {copiedColor === color.hex ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
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