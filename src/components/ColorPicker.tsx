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
          <div className="flex justify-start">
            <div className="relative">
              <input
                id="color-picker"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-20 h-12 rounded-lg border-2 border-border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          </div>
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
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-foreground">選択色</p>
                  <p className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {selectedColor}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};