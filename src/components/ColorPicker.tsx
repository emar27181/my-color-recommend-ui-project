import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>カラーピッカー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* HTML5 Color Input */}
        <div className="space-y-2">
          <label htmlFor="color-picker" className="text-sm font-medium">
            色を選択
          </label>
          <input
            id="color-picker"
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="w-full h-12 rounded-md border cursor-pointer"
          />
        </div>

        {/* Text Input for Color Code */}
        <div className="space-y-2">
          <label htmlFor="color-input" className="text-sm font-medium">
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
          <label className="text-sm font-medium">選択された色</label>
          <div
            className="w-full h-16 rounded-md border-2 border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <p className="text-sm text-muted-foreground text-center">
            {selectedColor}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};