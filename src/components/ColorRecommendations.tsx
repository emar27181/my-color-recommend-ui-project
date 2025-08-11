import React from 'react';
import { useColorStore, COLOR_SCHEMES } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { ColorWheelMini } from '@/components/common/ColorWheelMini';
import { useTutorial } from '@/contexts/TutorialContext';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';
import chroma from 'chroma-js';

interface ColorRecommendationsProps {
  isMobile?: boolean;
}

export const ColorRecommendations = ({ isMobile = false }: ColorRecommendationsProps) => {
  const { recommendedColors, selectedScheme, setSelectedScheme, generateRecommendedTones, selectedColor, setSelectedColor, paintColor } = useColorStore();
  const { onUserAction } = useTutorial();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleGenerateTones = (color: string) => {
    // クリックされた色を描画色として設定
    setSelectedColor(color); // setSelectedColorが内部でpaintColorも更新
    generateRecommendedTones(color);
    // チュートリアルの自動進行をトリガー
    onUserAction('click', '[data-tutorial="recommended-colors"]');
  };

  const selectedSchemeData = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedScheme(schemeId);
    setIsDropdownOpen(false);
    // チュートリアルの自動進行をトリガー
    onUserAction('click', '[data-tutorial="color-schemes"]');
  };

  // ベースカラーから色相角度を取得
  const getBaseHue = () => {
    if (!selectedColor) return 0;
    try {
      return chroma(selectedColor).get('hsl.h') || 0;
    } catch {
      return 0;
    }
  };

  // 色の距離を計算する関数（deltaE 2000使用）
  const calculateColorDistance = (color1: string, color2: string): number => {
    try {
      return chroma.deltaE(color1, color2);
    } catch {
      return Infinity;
    }
  };

  // 描画色に最も近い推薦色を見つける
  const findClosestColorIndex = (colors: string[], drawingColor: string): number => {
    if (!drawingColor || colors.length === 0) return -1;
    
    let closestIndex = -1;
    let minDistance = Infinity;
    
    colors.forEach((color, index) => {
      const distance = calculateColorDistance(color, drawingColor);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };

  const closestColorIndex = findClosestColorIndex(recommendedColors, paintColor);


  return (
    <Card className="w-full flex flex-col pb-0" style={{ height: '96px', minWidth: '0' }}>
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
        <div className="mt-0">
          <div className="relative">
            {/* 新しい配色技法選択バー（色相環付き） */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 bg-background text-muted-foreground hover:bg-muted/20 text-xs md:text-sm font-medium transition-colors border border-border rounded-md`}
              data-tutorial="color-schemes"
            >
              <div className="flex items-center gap-3">
                {/* 選択中の配色技法の色相環 */}
                {selectedSchemeData && (
                  <ColorWheelMini
                    radius={12}
                    schemeId={selectedScheme}
                    baseHue={getBaseHue()}
                  />
                )}
                <span className="truncate">
                  {selectedSchemeData ? (
                    <span className="font-bold">{t(`colorSchemes.${selectedSchemeData.id}`)}</span>
                  ) : (
                    t('colorRecommendations.selectScheme')
                  )}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 展開時の配色技法一覧 */}
            {isDropdownOpen && (
              <div 
                className={`absolute top-full left-0 sm:left-0 mt-1 bg-background ${BORDER_PRESETS.button} shadow-lg z-10 max-h-60 overflow-y-auto w-full`}
              >
                <div className="p-3 min-w-0">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                    {COLOR_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => handleSchemeSelect(scheme.id)}
                        className={`flex items-center p-2 transition-all hover:scale-105 border border-border rounded-md ${
                          selectedScheme === scheme.id
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        {/* ミニ色相環 */}
                        <div className="mr-2 flex-shrink-0">
                          <ColorWheelMini
                            radius={28}
                            schemeId={scheme.id}
                            baseHue={getBaseHue()}
                          />
                        </div>
                        
                        {/* 配色技法名 */}
                        <div className="text-xs font-medium leading-tight min-w-0 flex-1">
                          {t(`colorSchemes.${scheme.id}`)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </CardHeader>
      
      {/* ドロップダウンが開いている時のオーバーレイ */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setIsDropdownOpen(false);
          }}
        />
      )}
      
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="recommended-colors">
          <ColorGrid
            colors={recommendedColors.map((color, index) => ({
              color,
              title: t('colorRecommendations.generateTones'),
              showClickIcon: false,
              isHighlighted: index === closestColorIndex
          }))}
          onColorClick={handleGenerateTones}
          gridType="colors" // 2セクション（色推薦）: モバイル4列、PC4列
          isMobile={isMobile}
          emptyMessage={t('colorRecommendations.noRecommendations')}
        />
        </div>
      </CardContent>
    </Card>
  );
};

interface ToneRecommendationsProps {
  isMobile?: boolean;
}

export const ToneRecommendations = ({ isMobile = false }: ToneRecommendationsProps) => {
  const { recommendedTones, selectedColor, generateRecommendedTones, setSelectedColor, paintColor } = useColorStore();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (recommendedTones.length === 0 && selectedColor) {
      generateRecommendedTones(selectedColor);
    }
  }, [selectedColor, recommendedTones.length, generateRecommendedTones]);

  const handleToneClick = (color: string) => {
    // クリックされた色を描画色として設定
    setSelectedColor(color); // setSelectedColorが内部でpaintColorも更新
  };

  // 色の距離を計算する関数（deltaE 2000使用）
  const calculateColorDistance = (color1: string, color2: string): number => {
    try {
      return chroma.deltaE(color1, color2);
    } catch {
      return Infinity;
    }
  };

  // 描画色に最も近いトーン色を見つける
  const findClosestToneIndex = (tones: string[], drawingColor: string): number => {
    if (!drawingColor || tones.length === 0) return -1;
    
    let closestIndex = -1;
    let minDistance = Infinity;
    
    tones.forEach((tone, index) => {
      const distance = calculateColorDistance(tone, drawingColor);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };

  const closestToneIndex = findClosestToneIndex(recommendedTones, paintColor);

  return (
    <Card className="w-full flex flex-col pb-0">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="tone-variations">
          <ColorGrid
            colors={recommendedTones.map((tone, index) => ({
              color: tone,
              title: "色を選択",
              showClickIcon: false,
              isHighlighted: index === closestToneIndex
            }))}
            onColorClick={handleToneClick}
            clickable={true}
            gridType="tones"
            isMobile={isMobile}
            emptyMessage={t('toneRecommendations.noTones')}
          />
        </div>
      </CardContent>
    </Card>
  );
};