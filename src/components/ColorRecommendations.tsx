import React from 'react';
import { createPortal } from 'react-dom';
import { useColorStore, COLOR_SCHEMES } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { ColorWheel } from '@/components/common/ColorWheel';
import { ColorWheelMini } from '@/components/common/ColorWheelMini';
import { useTutorial } from '@/contexts/TutorialContext';
import { ChevronDown } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';
import chroma from 'chroma-js';

export const ColorRecommendations = () => {
  const { recommendedColors, selectedScheme, setSelectedScheme, generateRecommendedTones, selectedColor } = useColorStore();
  const { onUserAction } = useTutorial();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hoveredScheme, setHoveredScheme] = React.useState<string | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleGenerateTones = (color: string) => {
    generateRecommendedTones(color);
    // チュートリアルの自動進行をトリガー
    onUserAction('click', '[data-tutorial="recommended-colors"]');
  };

  const selectedSchemeData = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedScheme(schemeId);
    setIsDropdownOpen(false);
    setHoveredScheme(null); // 選択後は常に色相環を非表示
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

  // マウス位置を更新するハンドラー
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  // 色相環の表示位置を計算（PC: マウス追従、モバイル: 画面中央）
  const getTooltipPosition = () => {
    const tooltipWidth = 200;
    const tooltipHeight = 200;
    
    if (isMobile) {
      // モバイル版: 画面中央に固定表示
      return {
        left: (window.innerWidth - tooltipWidth) / 2,
        top: (window.innerHeight - tooltipHeight) / 2
      };
    }
    
    // PC版: マウス位置ベース（従来の処理）
    const offset = 20;
    let left = mousePosition.x + offset;
    let top = mousePosition.y - tooltipHeight / 2;
    
    // 右端はみ出し防止
    if (left + tooltipWidth > window.innerWidth) {
      left = mousePosition.x - tooltipWidth - offset;
    }
    
    // 上端はみ出し防止
    if (top < 0) {
      top = 10;
    }
    
    // 下端はみ出し防止
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - 10;
    }
    
    return { left, top };
  };

  // モバイルデバイスかどうかを判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

  return (
    <Card className="w-full flex flex-col pb-0" style={{ height: '144px', minWidth: '0' }}>
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
                    <>
                      {selectedSchemeData.name.split(':').map((part, index) => (
                        <span key={index}>
                          {index === 0 ? (
                            <span className="font-bold">{part}</span>
                          ) : (
                            <span>:{part}</span>
                          )}
                        </span>
                      ))}
                    </>
                  ) : (
                    '配色技法を選択'
                  )}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 展開時の配色技法一覧 */}
            {isDropdownOpen && (
              <div 
                className={`absolute top-full left-0 mt-1 bg-background ${BORDER_PRESETS.button} shadow-lg z-10 max-h-60 overflow-y-auto`}
                style={{ minWidth: '600px' }}
              >
                <div className="p-3 min-w-0">
                  <div className="grid grid-cols-4 gap-3 w-full">
                    {COLOR_SCHEMES.map((scheme) => (
                      <button
                        key={scheme.id}
                        onClick={() => handleSchemeSelect(scheme.id)}
                        onMouseEnter={() => {
                          // PC版のみマウスホバーで色相環を表示
                          if (!isMobile) {
                            setHoveredScheme(scheme.id);
                          }
                        }}
                        onMouseLeave={() => {
                          // PC版のみマウスリーブで色相環を非表示
                          if (!isMobile) {
                            setHoveredScheme(null);
                          }
                        }}
                        onMouseMove={handleMouseMove}
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
                          {/* 配色技法名の最初の部分（色数含む）のみ表示 */}
                          {scheme.name.split(':')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 色相環オーバーレイ表示（Portal使用） */}
            {hoveredScheme && createPortal(
              <div 
                className={`fixed z-50 p-4 shadow-2xl pointer-events-none ${BORDER_PRESETS.colorBlock} ${
                  isMobile ? 'bg-background/80 backdrop-blur-sm' : 'bg-background'
                }`}
                role="tooltip"
                aria-label={`${COLOR_SCHEMES.find(s => s.id === hoveredScheme)?.name} の配色パターン`}
                style={{ 
                  left: `${getTooltipPosition().left}px`,
                  top: `${getTooltipPosition().top}px`,
                  width: '200px',
                  height: '200px'
                }}
              >
                {/* 色相環コンポーネントのみ */}
                <div className="flex items-center justify-center h-full w-full">
                  <ColorWheel
                    radius={125}
                    schemeId={hoveredScheme}
                    baseHue={getBaseHue()}
                  />
                </div>
              </div>,
              document.body
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
            setHoveredScheme(null); // ドロップダウン閉じ時は常に色相環を非表示
          }}
        />
      )}
      
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="recommended-colors">
          <ColorGrid
            colors={recommendedColors.map(color => ({
              color,
              title: `色: ${color} (タップでトーン生成)`
          }))}
          onColorClick={handleGenerateTones}
          emptyMessage="色を選択すると推薦色が表示されます"
        />
        </div>
      </CardContent>
    </Card>
  );
};

export const ToneRecommendations = () => {
  const { recommendedTones, selectedColor, generateRecommendedTones } = useColorStore();

  React.useEffect(() => {
    if (recommendedTones.length === 0 && selectedColor) {
      generateRecommendedTones(selectedColor);
    }
  }, [selectedColor, recommendedTones.length, generateRecommendedTones]);

  return (
    <Card className="w-full flex flex-col pb-0">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="tone-variations">
          <ColorGrid
            colors={recommendedTones.map(tone => ({
              color: tone,
              title: tone
            }))}
          clickable={false}
          emptyMessage="トーン推薦がありません"
        />
        </div>
      </CardContent>
    </Card>
  );
};