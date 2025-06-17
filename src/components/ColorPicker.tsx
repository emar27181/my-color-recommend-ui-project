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
    <div className="w-full border rounded-xl bg-card" style={{
      borderColor: 'var(--border)',
      color: 'var(--foreground)'
    }}>
      {/* Mobile/Tablet: Vertical Layout */}
      <div className="block lg:hidden p-4 space-y-4">

        {/* Color Picker */}
        <div className="space-y-2">
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

        {/* Text Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              id="color-input"
              type="text"
              value={inputColor}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="#000000"
              className="flex-1"
            />
            <Button onClick={handleInputSubmit} size="sm">
              適用
            </Button>
          </div>
        </div>

      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden lg:block p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">カラーピッカー</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Color Picker */}
          <div className="space-y-2">
            <label htmlFor="color-picker-desktop" className="text-sm font-medium text-foreground">
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
                  id="color-picker-desktop"
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  style={{ top: 0, left: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="color-input-desktop"
                type="text"
                value={inputColor}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="#000000"
                className="flex-1"
              />
              <Button onClick={handleInputSubmit} size="sm">
                適用
              </Button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};