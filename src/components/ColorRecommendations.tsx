import React from 'react';
import { useColorStore, COLOR_SCHEMES } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { RESPONSIVE_GRID, TYPOGRAPHY } from '@/constants/ui';
import { ChevronDown } from 'lucide-react';

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
              className="w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 bg-transparent text-muted-foreground hover:bg-muted/20 rounded text-xs md:text-sm font-medium transition-colors border border-transparent"
            >
              <span className="truncate">{selectedSchemeData?.name || '配色技法を選択'}</span>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ドロップダウンメニュー */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-transparent rounded shadow-lg z-10 max-h-60 overflow-y-auto">
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
                      <div className="font-medium">{scheme.name}</div>
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
        {recommendedColors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-0 px-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
              </svg>
            </div>
            <p className="text-center text-muted-foreground text-xs">
              色を選択すると推薦色が表示されます
            </p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Layout */}
            <div className={`hidden md:block ${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {recommendedColors.map((color, index) => (
                <div key={index} className="bg-card border border-border rounded-sm p-1 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
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
                      className="opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile 2-Column Layout */}
            <div className="block md:hidden space-y-0">
              {Array.from({ length: Math.ceil(recommendedColors.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1">
                  {recommendedColors.slice(rowIndex * 2, (rowIndex + 1) * 2).map((color, index) => (
                    <div key={index} className="flex items-center gap-1 bg-card border border-border rounded-sm p-1 shadow-sm flex-1 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => handleGenerateTones(color)}>
                      <div
                        className="border-2 border-transparent rounded-sm cursor-pointer hover:scale-110 transition-all duration-200 flex-shrink-0"
                        style={{
                          backgroundColor: color,
                          width: '32px',
                          height: '32px'
                        }}
                        title={color}
                      />
                      <div onClick={(e) => e.stopPropagation()}>
                        <CopyColorButton
                          color={color}
                          variant="minimal"
                          className="opacity-100 flex-shrink-0"
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground truncate">{color}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
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
        {recommendedTones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-0 px-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Layout */}
            <div className={`hidden md:block ${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {recommendedTones.map((tone, index) => (
                <div key={index} className="bg-card border border-border rounded-sm p-1 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center gap-4">
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
                      className="opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile 2-Column Layout */}
            <div className="block md:hidden space-y-0">
              {Array.from({ length: Math.ceil(recommendedTones.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1">
                  {recommendedTones.slice(rowIndex * 2, (rowIndex + 1) * 2).map((tone, index) => (
                    <div key={index} className="flex items-center gap-1 bg-card border border-border rounded-sm p-1 shadow-sm flex-1">
                      <div
                        className="border-2 border-transparent rounded-sm cursor-pointer hover:scale-110 transition-all duration-200 flex-shrink-0"
                        style={{
                          backgroundColor: tone,
                          width: '32px',
                          height: '32px'
                        }}
                        title={tone}
                      />
                      <CopyColorButton
                        color={tone}
                        variant="minimal"
                        className="opacity-100 flex-shrink-0"
                      />
                      <span className="text-xs font-mono text-muted-foreground truncate">{tone}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};