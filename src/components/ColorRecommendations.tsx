import { useColorStore, COLOR_SCHEMES, TONE_ADJUSTMENTS } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastContext } from '@/contexts/ToastContext';
import { copyToClipboard } from '@/lib/clipboard';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { RESPONSIVE_GRID, TYPOGRAPHY } from '@/constants/ui';

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
          <h3 className={`${TYPOGRAPHY.subtitle} mb-3`}>配色技法:</h3>
          <div className={`${RESPONSIVE_GRID.schemes} ${RESPONSIVE_GRID.gap}`}>
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedScheme === scheme.id 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {scheme.name}
              </button>
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
          <div className={`${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
            {recommendedColors.map((color, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                   onClick={() => handleGenerateTones(color)}>
                <div className="flex items-center gap-3">
                  <ColorBlock 
                    color={color}
                    title={`色: ${color} (タップでトーン生成)`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`${TYPOGRAPHY.colorCode} truncate`}>{color}</p>
                  </div>
                  <CopyColorButton 
                    color={color} 
                    variant="minimal"
                  />
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
          <div className={`${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
            {recommendedTones.map((tone, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                   onClick={(e) => handleCopyTone(tone, e)}>
                <div className="flex items-center gap-3">
                  <ColorBlock 
                    color={tone}
                    title={tone}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`${TYPOGRAPHY.colorCode} truncate`}>{tone}</p>
                  </div>
                  <CopyColorButton 
                    color={tone} 
                    variant="minimal"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};