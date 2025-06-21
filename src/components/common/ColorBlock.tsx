import { COLOR_BLOCK_SPEC } from '@/constants/ui';
import { Palette } from 'lucide-react';

interface ColorBlockProps {
  color: string;
  onClick?: () => void;
  title?: string;
  className?: string;
  showPicker?: boolean;
}

/**
 * 統一仕様の色表示ブロックコンポーネント
 */
export const ColorBlock = ({ 
  color, 
  onClick, 
  title,
  className = '',
  showPicker = false
}: ColorBlockProps) => {
  return (
    <div className="relative">
      <div 
        className={`${COLOR_BLOCK_SPEC.className} ${className}`}
        style={{ 
          width: `${COLOR_BLOCK_SPEC.width}px`,
          height: `${COLOR_BLOCK_SPEC.height}px`,
          backgroundColor: color 
        }}
        onClick={onClick}
        title={title}
      />
      {showPicker && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300">
          <Palette className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};