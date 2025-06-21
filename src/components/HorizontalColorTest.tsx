import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { COLOR_BLOCK_SPEC } from '@/constants/ui';

interface ColorItem {
  color: string;
  name: string;
}

export const HorizontalColorTest = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const testColors: ColorItem[] = [
    { color: '#FF6B6B', name: 'Coral Red' },
    { color: '#4ECDC4', name: 'Turquoise' },
    { color: '#45B7D1', name: 'Sky Blue' },
    { color: '#96CEB4', name: 'Mint Green' },
    { color: '#FECA57', name: 'Golden Yellow' },
    { color: '#FF9FF3', name: 'Pink' },
    { color: '#54A0FF', name: 'Blue' },
    { color: '#5F27CD', name: 'Purple' }
  ];

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      console.error('Failed to copy color:', error);
    }
  };

  return (
    <div className="w-full border rounded-xl bg-card p-6" style={{ 
      borderColor: 'var(--border)',
      color: 'var(--foreground)'
    }}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">横並び色表示テスト</h2>
        <p className="text-sm text-muted-foreground">
          色の配置を横並びにしたレイアウトのテスト実装
        </p>
      </div>

      {/* Desktop: Full Horizontal Layout */}
      <div className="hidden lg:block mb-8">
        <h3 className="text-base font-medium mb-4 text-foreground">PC版: 全色横並び</h3>
        <div className="flex flex-wrap gap-6 p-6 bg-muted/30 rounded-sm">
          {testColors.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-card border border-border rounded-sm p-3 shadow-sm">
              <div 
                className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: item.color,
                  width: `${COLOR_BLOCK_SPEC.width}px`,
                  height: `${COLOR_BLOCK_SPEC.height}px`
                }}
                title={item.name}
              />
              <div className="flex flex-col gap-1">
                <p className="font-mono text-sm">{item.color}</p>
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>
              <button
                onClick={() => handleCopyColor(item.color)}
                className="p-2 rounded-sm bg-muted hover:bg-muted/80 transition-colors opacity-80 hover:opacity-100"
                title="色をコピー"
              >
                {copiedColor === item.color ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet: 2-Row Layout */}
      <div className="hidden md:block lg:hidden mb-8">
        <h3 className="text-base font-medium mb-4 text-foreground">タブレット版: 2行レイアウト</h3>
        <div className="space-y-4">
          {[0, 1].map((rowIndex) => (
            <div key={rowIndex} className="flex gap-6 p-4 bg-muted/30 rounded-sm">
              {testColors.slice(rowIndex * 4, (rowIndex + 1) * 4).map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-card border border-border rounded-sm p-4 shadow-sm flex-1">
                  <div 
                    className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${COLOR_BLOCK_SPEC.width}px`,
                      height: `${COLOR_BLOCK_SPEC.height}px`
                    }}
                    title={item.name}
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="font-mono text-sm">{item.color}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <button
                    onClick={() => handleCopyColor(item.color)}
                    className="p-2 rounded-sm bg-muted hover:bg-muted/80 transition-colors opacity-80 hover:opacity-100"
                    title="色をコピー"
                  >
                    {copiedColor === item.color ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: 2-Column Layout */}
      <div className="block md:hidden">
        <h3 className="text-base font-medium mb-4 text-foreground">スマホ版: 2列レイアウト</h3>
        <div className="space-y-4">
          {[0, 1, 2, 3].map((rowIndex) => (
            <div key={rowIndex} className="flex gap-3">
              {testColors.slice(rowIndex * 2, (rowIndex + 1) * 2).map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-card border border-border rounded-sm p-3 shadow-sm flex-1">
                  <div 
                    className="border-2 border-gray-300 rounded-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                    style={{ 
                      backgroundColor: item.color,
                      width: '40px',
                      height: '40px'
                    }}
                    title={item.color}
                  />
                  <button
                    onClick={() => handleCopyColor(item.color)}
                    className="p-1 rounded-sm bg-muted hover:bg-muted/80 transition-colors opacity-80 hover:opacity-100 flex-shrink-0"
                    title="色をコピー"
                  >
                    {copiedColor === item.color ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <span className="text-xs font-mono text-muted-foreground truncate">{item.color}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div className="mt-8 p-4 bg-muted/20 rounded-sm">
        <h3 className="text-base font-medium mb-3 text-foreground">レイアウト比較</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>PC (1280px+): 全色横並び、最大画面幅活用</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>タブレット (768px-1279px): 2行レイアウト、バランス重視</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>スマホ (〜767px): 2列レイアウト、コンパクト表示</span>
          </div>
        </div>
      </div>
    </div>
  );
};