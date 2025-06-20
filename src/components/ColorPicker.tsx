import { useColorStore } from '@/store/colorStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { TYPOGRAPHY } from '@/constants/ui';

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
        <div className="hidden md:block">
          <div className="bg-card border border-border rounded-sm p-1 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer">
                <ColorBlock
                  color={selectedColor}
                  title="クリックで色を選択"
                />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  style={{ top: 0, left: 0 }}
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
        <div className="block md:hidden">
          <div className="bg-card border border-border rounded-sm p-1 shadow-sm flex items-center gap-1">
            <div className="relative cursor-pointer">
              <div
                className="border-2 border-border rounded-sm cursor-pointer hover:scale-110 transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: selectedColor,
                  width: '32px',
                  height: '32px'
                }}
                title="クリックで色を選択"
              />
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
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono text-muted-foreground truncate block">{selectedColor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};