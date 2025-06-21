import React from 'react';
import { useColorStore, COLOR_SCHEMES } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { ChevronDown } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';

export const ColorRecommendations = () => {
  const { recommendedColors, selectedScheme, setSelectedScheme, generateRecommendedTones } = useColorStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleGenerateTones = (color: string) => {
    generateRecommendedTones(color);
  };

  const selectedSchemeData = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedScheme(schemeId);
    setIsDropdownOpen(false);
  };

  return (
    <Card className="w-full flex flex-col pb-0" style={{ height: '144px' }}>
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
        <div className="mt-0">
          <div className="relative">
            {/* ドロップダウンボタン */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 bg-transparent text-muted-foreground hover:bg-muted/20 text-xs md:text-sm font-medium transition-colors ${BORDER_PRESETS.button}`}
            >
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
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ドロップダウンメニュー */}
            {isDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-1 bg-background ${BORDER_PRESETS.button} shadow-lg z-10 max-h-60 overflow-y-auto`}>
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleSchemeSelect(scheme.id)}
                    className={`w-full text-left px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm hover:bg-muted transition-colors ${
                      selectedScheme === scheme.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {scheme.name.split(':').map((part, index) => (
                          <span key={index}>
                            {index === 0 ? (
                              <span className="font-bold">{part}</span>
                            ) : (
                              <span>:{part}</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs opacity-75 hidden md:block">{scheme.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      {/* ドロップダウンが開いている時のオーバーレイ */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <ColorGrid
          colors={recommendedColors.map(color => ({
            color,
            title: `色: ${color} (タップでトーン生成)`
          }))}
          onColorClick={handleGenerateTones}
          emptyMessage="色を選択すると推薦色が表示されます"
        />
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
        <ColorGrid
          colors={recommendedTones.map(tone => ({
            color: tone,
            title: tone
          }))}
          clickable={false}
          emptyMessage="トーン推薦がありません"
        />
      </CardContent>
    </Card>
  );
};