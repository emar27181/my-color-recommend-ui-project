import { useColorStore, COLOR_SCHEMES } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { RESPONSIVE_GRID, TYPOGRAPHY } from '@/constants/ui';

export const ColorRecommendations = () => {
  const { recommendedColors, selectedScheme, setSelectedScheme, generateRecommendedTones } = useColorStore();

  const handleGenerateTones = (color: string) => {
    generateRecommendedTones(color);
  };

  const currentScheme = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  return (
    <Card className="w-full">
      <CardHeader>
        {/*
        <p className="text-sm text-muted-foreground">
          選択した色に基づいて、色彩理論に従った相性の良い色を推薦します
        </p>
         */}

        {/* 配色技法選択UI */}
        <div className="mt-4">
          <div className={`${RESPONSIVE_GRID.schemes} ${RESPONSIVE_GRID.gap}`}>
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedScheme === scheme.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {scheme.name}
              </button>
            ))}
          </div>

          {/*
          {currentScheme && (
            <p className="text-xs text-muted-foreground mt-2">
              {currentScheme.description}
            </p>
          )}
          */}

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
          <>
            {/* Desktop/Tablet Layout */}
            <div className={`hidden md:block ${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {recommendedColors.map((color, index) => (
                <div key={index} className="bg-card border border-border rounded-sm p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
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
            <div className="block md:hidden space-y-3">
              {Array.from({ length: Math.ceil(recommendedColors.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-3">
                  {recommendedColors.slice(rowIndex * 2, (rowIndex + 1) * 2).map((color, index) => (
                    <div key={index} className="flex items-center gap-4 bg-card border border-border rounded-sm p-4 shadow-sm flex-1 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => handleGenerateTones(color)}>
                      <div 
                        className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                        style={{ 
                          backgroundColor: color,
                          width: '40px',
                          height: '40px'
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
  const { recommendedTones, toneBaseColor } = useColorStore();

  return (
    <Card className="w-full">
      <CardHeader>
        {/*
        <p className="text-sm text-muted-foreground">
          選択した色の明度・彩度を変化させたトーンバリエーション
        </p>
        */}
        {toneBaseColor && (
          <div className="mt-2 flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: toneBaseColor }}
            />
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
              推薦色をクリックするとトーンが表示されます
            </p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Layout */}
            <div className={`hidden md:block ${RESPONSIVE_GRID.colors} ${RESPONSIVE_GRID.gap}`}>
              {recommendedTones.map((tone, index) => (
                <div key={index} className="bg-card border border-border rounded-sm p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
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
            <div className="block md:hidden space-y-3">
              {Array.from({ length: Math.ceil(recommendedTones.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-3">
                  {recommendedTones.slice(rowIndex * 2, (rowIndex + 1) * 2).map((tone, index) => (
                    <div key={index} className="flex items-center gap-4 bg-card border border-border rounded-sm p-4 shadow-sm flex-1">
                      <div 
                        className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                        style={{ 
                          backgroundColor: tone,
                          width: '40px',
                          height: '40px'
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