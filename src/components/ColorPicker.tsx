import { useState } from 'react';
import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
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
    <Card className="w-full max-w-md bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-foreground">カラーピッカー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* HTML5 Color Input */}
        <div className="space-y-2">
          <label htmlFor="color-picker" className="text-sm font-medium text-foreground">
            色を選択
          </label>
          <div className="flex justify-center">
            <ColorBlock 
              color={selectedColor}
              onClick={() => document.getElementById('color-picker-input')?.click()}
              title="クリックで色を選択"
            />
            <input
              id="color-picker-input"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="hidden"
            />
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
            <div className="flex items-center gap-4">
              <ColorBlock color={selectedColor} />
              <div className="flex-1">
                <p className={`${TYPOGRAPHY.colorCode} bg-muted px-3 py-1 rounded-full`}>
                  {selectedColor}
                </p>
              </div>
              <CopyColorButton color={selectedColor} variant="compact" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};