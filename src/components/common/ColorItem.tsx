import React from 'react';
import { ColorBlock } from '@/components/common/ColorBlock';
import { CopyColorButton } from '@/components/common/CopyColorButton';
import { TYPOGRAPHY } from '@/constants/ui';

interface ColorItemProps {
  color: string;
  onClick?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  clickable?: boolean;
}

/**
 * 統一されたカラーアイテムコンポーネント
 * カラーボックス + コピーボタン + テキスト情報のレイアウトを管理
 */
export const ColorItem = ({
  color,
  onClick,
  className = '',
  title,
  subtitle,
  compact = false,
  clickable = true
}: ColorItemProps) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  // デスクトップ版レイアウト
  if (!compact) {
    return (
      <div 
        className={`bg-card border border-border rounded-sm p-1 shadow-sm hover:shadow-md transition-all duration-200 ${
          clickable ? 'cursor-pointer' : ''
        } group ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          <ColorBlock
            color={color}
            title={title || color}
          />
          <div className="flex-1 min-w-0">
            <p className={`${TYPOGRAPHY.colorCode} truncate`}>{color}</p>
            {subtitle && (
              <p className={TYPOGRAPHY.usage}>
                {subtitle}
              </p>
            )}
          </div>
          <CopyColorButton
            color={color}
            variant="minimal"
            className="opacity-100"
          />
        </div>
      </div>
    );
  }

  // モバイル版コンパクトレイアウト
  return (
    <div 
      className={`flex items-center gap-1 bg-card border border-border rounded-sm p-1 shadow-sm flex-1 ${
        clickable ? 'cursor-pointer hover:shadow-md' : ''
      } transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="relative flex items-center justify-center flex-shrink-0" style={{
        width: '32px',
        height: '32px'
      }}>
        <div
          className="border-2 border-transparent rounded-sm cursor-pointer hover:scale-110 transition-all duration-200"
          style={{
            backgroundColor: color,
            width: '24px',
            height: '24px'
          }}
          title={title || color}
        />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <CopyColorButton
          color={color}
          variant="minimal"
          className="opacity-100 flex-shrink-0"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-mono text-muted-foreground truncate block">{color}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};