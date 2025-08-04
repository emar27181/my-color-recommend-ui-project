import { ColorItem } from '@/components/common/ColorItem';
import { RESPONSIVE_GRID } from '@/constants/ui';

interface ColorData {
  color: string;
  title?: string;
  subtitle?: string;
  showClickIcon?: boolean;
}

interface ColorGridProps {
  colors: ColorData[];
  onColorClick?: (color: string) => void;
  className?: string;
  emptyMessage?: string;
  clickable?: boolean;
}

/**
 * 統一されたカラーグリッドコンポーネント
 * デスクトップとモバイルのレスポンシブレイアウトを管理
 */
export const ColorGrid = ({
  colors,
  onColorClick,
  className = '',
  emptyMessage = '色が選択されていません',
  clickable = true
}: ColorGridProps) => {
  if (colors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-0 px-2">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
          </svg>
        </div>
        <p className="text-center text-muted-foreground text-xs">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {colors.map((colorData, index) => (
        <ColorItem
          key={index}
          color={colorData.color}
          title={colorData.title}
          subtitle={colorData.subtitle}
          onClick={() => onColorClick?.(colorData.color)}
          compact={true}
          clickable={clickable}
          showClickIcon={colorData.showClickIcon}
        />
      ))}
    </div>
  );
};