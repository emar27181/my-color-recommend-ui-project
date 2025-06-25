import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { TYPOGRAPHY, BORDER_PRESETS } from '@/constants/ui';
import { Palette } from 'lucide-react';

export const ColorPicker = () => {
  const { selectedColor, setSelectedColor } = useColorStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
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
              <div className="relative cursor-pointer" data-tutorial="color-picker">
                <div className={`bg-white rounded-full p-2 ${BORDER_PRESETS.icon} hover:shadow-md transition-all duration-200`}>
                  <Palette className="w-6 h-6 text-muted-foreground" />
                </div>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  style={{ top: 0, left: 0 }}
                  title="クリックで色を選択"
                />
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
            <div className="relative cursor-pointer">
              <div className={`bg-white rounded-full p-1.5 ${BORDER_PRESETS.icon} hover:shadow-md transition-all duration-200`}>
                <Palette className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="absolute opacity-0 w-full h-full cursor-pointer"
                style={{ top: 0, left: 0 }}
                title="クリックで色を選択"
              />
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