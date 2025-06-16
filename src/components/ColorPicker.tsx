import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { Palette } from 'lucide-react';
import { TYPOGRAPHY, COLOR_BLOCK_SPEC } from '@/constants/ui';

export const ColorPicker = () => {
  const { selectedColor, setSelectedColor } = useColorStore();
  const [inputColor, setInputColor] = useState(selectedColor);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setInputColor(color);
    setSelectedColor(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
  };

  const handleInputSubmit = () => {
    try {
      setSelectedColor(inputColor);
    } catch (error) {
      console.error('Invalid color format:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-xl border" style={{ 
      backgroundColor: 'var(--card)', 
      borderColor: 'var(--border)',
      color: 'var(--foreground)',
      minHeight: '300px'
    }}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>カラーピッカー</h2>
      </div>
      <div className="space-y-4">
        {/* HTML5 Color Input */}
        <div className="space-y-2">
          <label htmlFor="color-picker" className="text-sm font-medium text-foreground">
            色を選択
          </label>
          <div className="flex justify-center">
            <div className="relative cursor-pointer">
              <div 
                className="border-2 border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: selectedColor,
                  width: `${COLOR_BLOCK_SPEC.width}px`,
                  height: `${COLOR_BLOCK_SPEC.height}px`
                }}
                title="クリックで色を選択"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300 pointer-events-none">
                <Palette size={16} className="text-gray-600" />
              </div>
              <input
                id="color-picker-input"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="absolute opacity-0 w-full h-full cursor-pointer"
                style={{ top: 0, left: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Text Input for Color Code */}
        <div className="space-y-2">
          <label htmlFor="color-input" className="text-sm font-medium text-foreground">
            カラーコード
          </label>
          <div className="flex gap-2">
            <Input
              id="color-input"
              type="text"
              value={inputColor}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="#000000 or rgb(0,0,0) or hsl(0,0%,0%)"
              className="flex-1"
            />
            <Button onClick={handleInputSubmit} size="sm">
              適用
            </Button>
          </div>
        </div>

        {/* Selected Color Preview */}
        <div className="space-y-2">
          <label className={TYPOGRAPHY.subtitle}>選択された色</label>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer">
                <div 
                  className="border-2 border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: selectedColor,
                    width: `${COLOR_BLOCK_SPEC.width}px`,
                    height: `${COLOR_BLOCK_SPEC.height}px`
                  }}
                  title="クリックで色を選択"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300 pointer-events-none">
                  <Palette size={16} className="text-gray-600" />
                </div>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  style={{ top: 0, left: 0 }}
                />
              </div>
              <div className="flex-1">
                <p className={`${TYPOGRAPHY.colorCode} bg-muted px-3 py-1 rounded-full`}>
                  {selectedColor}
                </p>
              </div>
              <CopyColorButton color={selectedColor} variant="compact" className="opacity-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};