import { COLOR_BLOCK_SPEC } from '@/constants/ui';

interface ColorBlockProps {
  color: string;
  onClick?: () => void;
  title?: string;
  className?: string;
}

/**
 * 統一仕様の色表示ブロックコンポーネント
 */
export const ColorBlock = ({ 
  color, 
  onClick, 
  title,
  className = ''
}: ColorBlockProps) => {
  return (
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
  );
};