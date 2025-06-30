import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { ColorBlock } from '@/components/common/ColorBlock';
import { TYPOGRAPHY, BORDER_PRESETS } from '@/constants/ui';
import { useTutorial } from '@/contexts/TutorialContext';
import { Palette } from 'lucide-react';
import chroma from 'chroma-js';

export const ColorPicker = () => {
  const { selectedColor, setSelectedColor } = useColorStore();
  const { onUserAction } = useTutorial();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    // チュートリアルの自動進行をトリガー
    onUserAction('click', '[data-tutorial="color-picker"]');
  };

  // ベースカラーとのコントラスト比を考慮したアイコン色を取得
  const getIconColor = () => {
    try {
      const color = chroma(selectedColor);
      const lightness = color.get('hsl.l');
      // 明るい色には暗いアイコン、暗い色には明るいアイコン
      return lightness > 0.5 ? '#374151' : '#f9fafb'; // gray-700 or gray-50
    } catch {
      return '#6b7280'; // デフォルト: gray-500
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:block h-full">
          <div className="p-1 transition-all duration-200 h-full flex items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-3" data-tutorial="color-picker">
                <div className="relative cursor-pointer hover:scale-110 transition-all duration-200">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    title="クリックで色を選択"
                  />
                  <div 
                    className={`${BORDER_PRESETS.colorBlock} flex items-center justify-center pointer-events-none`}
                    style={{
                      backgroundColor: selectedColor,
                      width: '46px',
                      height: '46px'
                    }}
                    title={`選択中の色: ${selectedColor} - クリックで変更`}
                  >
                    <Palette 
                      className="w-5 h-5" 
                      style={{ color: getIconColor() }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${TYPOGRAPHY.colorCode} truncate`}>{selectedColor}</p>
              </div>
              <CopyColorButton
                color={selectedColor}
                variant="minimal"
                className="opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden h-full">
          <div className="p-1 flex items-center gap-1 h-full">
            <div className="flex items-center gap-2">
              <div className="relative cursor-pointer hover:scale-110 transition-all duration-200">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  title="クリックで色を選択"
                />
                <div 
                  className={`${BORDER_PRESETS.colorBlock} flex items-center justify-center pointer-events-none`}
                  style={{
                    backgroundColor: selectedColor,
                    width: '24px',
                    height: '24px'
                  }}
                  title={`選択中の色: ${selectedColor} - タップで変更`}
                >
                  <Palette 
                    className="w-3 h-3" 
                    style={{ color: getIconColor() }}
                  />
                </div>
              </div>
            </div>
            <CopyColorButton
              color={selectedColor}
              variant="minimal"
              className="opacity-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono text-muted-foreground truncate block">{selectedColor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};