import { COLOR_BLOCK_SPEC, BORDER_PRESETS } from '@/constants/ui';
import { Palette, SquareMousePointer } from 'lucide-react';
import chroma from 'chroma-js';

interface ColorBlockProps {
  color: string;
  onClick?: () => void;
  title?: string;
  className?: string;
  showPicker?: boolean;
  showClickIcon?: boolean;
  isHighlighted?: boolean;
}

/**
 * 統一仕様の色表示ブロックコンポーネント
 */
export const ColorBlock = ({ 
  color, 
  onClick, 
  title,
  className = '',
  showPicker = false,
  showClickIcon = false,
  isHighlighted = false
}: ColorBlockProps) => {
  
  // ベースカラーとのコントラスト比を考慮したアイコン色を取得
  const getIconColor = () => {
    try {
      const colorObj = chroma(color);
      const lightness = colorObj.get('hsl.l');
      // 明るい色には暗いアイコン、暗い色には明るいアイコン
      return lightness > 0.5 ? '#374151' : '#f9fafb'; // gray-700 or gray-50
    } catch {
      return '#6b7280'; // デフォルト: gray-500
    }
  };
  return (
    <div className="relative flex items-center justify-center" style={{ 
      width: `${COLOR_BLOCK_SPEC.width}px`,
      height: `${COLOR_BLOCK_SPEC.height}px`
    }}>
      <div 
        className={`${isHighlighted ? 'border-2 border-foreground rounded-md' : COLOR_BLOCK_SPEC.className} ${className} ${showClickIcon ? 'cursor-pointer hover:scale-110 transition-all duration-200' : ''} flex items-center justify-center`}
        style={{ 
          width: `${COLOR_BLOCK_SPEC.colorWidth}px`,
          height: `${COLOR_BLOCK_SPEC.colorHeight}px`,
          backgroundColor: color 
        }}
        onClick={onClick}
        title={title}
      >
        {showClickIcon && (
          <SquareMousePointer 
            className="w-5 h-5" 
            style={{ color: getIconColor() }}
          />
        )}
      </div>
      {showPicker && (
        <div className={`absolute -bottom-1 -right-1 bg-white rounded-full p-1 ${BORDER_PRESETS.icon}`}>
          <Palette className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};