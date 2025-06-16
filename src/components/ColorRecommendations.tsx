import { useColorStore, COLOR_SCHEMES, TONE_ADJUSTMENTS } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToastContext } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/clipboard';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const ColorRecommendations = () => {
  const { recommendedColors, selectedScheme, setSelectedScheme, generateRecommendedTones } = useColorStore();
  const { showToast } = useToastContext();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleGenerateTones = (color: string) => {
    generateRecommendedTones(color);
  };

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

  const currentScheme = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>推薦色相</CardTitle>
        <p className="text-sm text-muted-foreground">
          選択した色に基づいて、色彩理論に従った相性の良い色を推薦します
        </p>
        
        {/* 配色技法選択UI */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-3">配色技法を選択:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {COLOR_SCHEMES.map((scheme) => (
              <Button
                key={scheme.id}
                variant={selectedScheme === scheme.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedScheme(scheme.id)}
                className="text-xs h-8 px-2 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {scheme.name}
              </Button>
            ))}
          </div>
          {currentScheme && (
            <p className="text-xs text-muted-foreground mt-2">
              {currentScheme.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recommendedColors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground text-sm">
              色を選択すると推薦色が表示されます
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-2">
            {recommendedColors.map((color, index) => (
              <div key={index} className="space-y-1 group">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-md border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => handleGenerateTones(color)}
                    title={`色: ${color} (クリックでトーン生成)`}
                  />
                  <button
                    onClick={(e) => handleCopyColor(color, e)}
                    className="absolute top-1 right-1 p-1 rounded bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    title="カラーコードをコピー"
                  >
                    {copiedColor === color ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded text-center truncate">{color}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ToneRecommendations = () => {
  const { recommendedTones, toneBaseColor } = useColorStore();
  const { showToast } = useToastContext();
  const [copiedTone, setCopiedTone] = useState<string | null>(null);

  const handleCopyTone = async (color: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await copyToClipboard(color);
    
    if (result.success) {
      setCopiedTone(color);
      showToast(`カラーコード ${color} をコピーしました`, 'success');
      setTimeout(() => setCopiedTone(null), 2000);
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>推薦トーン</CardTitle>
        <p className="text-sm text-muted-foreground">
          選択した色の明度・彩度を変化させたトーンバリエーション
        </p>
        {toneBaseColor && (
          <div className="mt-2 flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: toneBaseColor }}
            />
            <span className="text-xs text-muted-foreground">
              ベース色: {toneBaseColor}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {recommendedTones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground text-sm max-w-md">
              推薦色をクリックするか「トーン生成」ボタンを押すとトーンが表示されます
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-2">
            {recommendedTones.map((tone, index) => {
              const adjustment = TONE_ADJUSTMENTS[index];
              return (
                <div key={index} className="space-y-1 group">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-md border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
                      style={{ backgroundColor: tone }}
                      title={`${adjustment?.name || ''}: ${tone}`}
                      onClick={(e) => handleCopyTone(tone, e)}
                    />
                    <button
                      onClick={(e) => handleCopyTone(tone, e)}
                      className="absolute top-1 right-1 p-1 rounded bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      title="カラーコードをコピー"
                    >
                      {copiedTone === tone ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded text-center truncate">{tone}</p>
                    {adjustment && (
                      <p className="text-xs text-muted-foreground font-medium">{adjustment.name}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};