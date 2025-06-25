import { useState } from 'react';
import { COLOR_SCHEMES, useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorWheelMini } from '@/components/common/ColorWheelMini';
import { ChevronDown } from 'lucide-react';
import { BORDER_PRESETS } from '@/constants/ui';

export const ColorSchemeOverview = () => {
  const { selectedScheme, setSelectedScheme } = useColorStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedSchemeData = COLOR_SCHEMES.find(scheme => scheme.id === selectedScheme);

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedScheme(schemeId);
    setIsExpanded(false); // 選択後に閉じる
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-1 pt-2">
        <div className="relative">
          {/* 選択バー */}
          <button
            onClick={toggleExpanded}
            className={`w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 bg-transparent text-muted-foreground hover:bg-muted/20 text-xs md:text-sm font-medium transition-colors ${BORDER_PRESETS.button}`}
          >
            <div className="flex items-center gap-3">
              {/* 選択中の配色技法の色相環 */}
              {selectedSchemeData && (
                <ColorWheelMini
                  radius={12}
                  schemeId={selectedScheme}
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
            <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform flex-shrink-0 ml-1 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </CardHeader>
      
      {/* 展開時の配色技法一覧 */}
      {isExpanded && (
        <CardContent className="pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleSchemeSelect(scheme.id)}
                className={`flex flex-col items-center p-2 transition-all hover:scale-105 ${BORDER_PRESETS.button} ${
                  selectedScheme === scheme.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {/* ミニ色相環 */}
                <div className="mb-2">
                  <ColorWheelMini
                    radius={20}
                    schemeId={scheme.id}
                  />
                </div>
                
                {/* 配色技法名 */}
                <div className="text-xs font-medium text-center leading-tight">
                  {/* 配色技法名の最初の部分（色数含む）のみ表示 */}
                  {scheme.name.split(':')[0]}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      )}

      {/* 展開時の背景オーバーレイ */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </Card>
  );
};