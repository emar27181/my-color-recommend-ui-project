import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { Palette } from 'lucide-react';
import { TYPOGRAPHY } from '@/constants/ui';

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
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:block">
          <div className="bg-card border border-border rounded-sm p-1 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer">
                <ColorBlock
                  color={selectedColor}
                  title="クリックで色を選択"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300">
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
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <Input
                  type="text"
                  value={inputColor}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="#000000"
                  className={`${TYPOGRAPHY.colorCode} flex-1`}
                />
                <Button onClick={handleInputSubmit} size="sm">
                  適用
                </Button>
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
        <div className="block md:hidden">
          <div className="bg-card border border-border rounded-sm p-1 shadow-sm flex items-center gap-1">
            <div className="relative cursor-pointer">
              <div
                className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                style={{
                  backgroundColor: selectedColor,
                  width: '32px',
                  height: '32px'
                }}
                title="クリックで色を選択"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-300">
                <Palette size={12} className="text-gray-600" />
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="absolute opacity-0 w-full h-full cursor-pointer"
                style={{ top: 0, left: 0 }}
              />
            </div>
            <CopyColorButton
              color={selectedColor}
              variant="minimal"
              className="opacity-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 flex items-center gap-1">
              <Input
                type="text"
                value={inputColor}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="#000000"
                className="text-xs font-mono flex-1"
              />
              <Button onClick={handleInputSubmit} size="sm" className="text-xs px-2 py-1">
                適用
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};