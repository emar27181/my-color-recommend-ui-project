import React from 'react';
import { COLOR_SCHEMES } from '@/store/colorStore';

interface ColorWheelProps {
  /** 色相環の半径（デフォルト: 50px） */
  radius?: number;
  /** 現在選択されている配色技法のID */
  schemeId?: string;
  /** ベースカラーの色相角度（0-360度） */
  baseHue?: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * 色相環表示コンポーネント
 * 配色技法のangles配列に基づいて色の配置を視覚化
 */
export const ColorWheel: React.FC<ColorWheelProps> = ({ 
  radius = 50, 
  schemeId,
  baseHue = 0,
  className = ''
}) => {
  const size = radius * 2;
  const strokeWidth = 2;
  const plotRadius = radius * 0.75; // プロット点の配置半径

  // 選択された配色技法のanglesを取得
  const scheme = schemeId ? COLOR_SCHEMES.find(s => s.id === schemeId) : null;
  const angles = scheme?.angles || [0];

  // 角度から座標を計算する関数（SVGでは-90度オフセットが必要）
  const getCoordinates = (angle: number) => {
    const radian = ((baseHue + angle) - 90) * Math.PI / 180;
    return {
      x: radius + plotRadius * Math.cos(radian),
      y: radius + plotRadius * Math.sin(radian)
    };
  };

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-sm"
        role="img"
        aria-label={`色相環: ${scheme?.name.split(':')[0] || '基本色相環'}`}
      >
        {/* 外側の円（色相環の枠） */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          className="opacity-60"
        />
        
        {/* 内側の円（中央部分） */}
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.25}
          fill="hsl(var(--background))"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          className="opacity-80"
        />
        
        {/* 配色技法のプロット点を表示 */}
        {angles.map((angle, index) => {
          const coords = getCoordinates(angle);
          const isBaseColor = angle === 0;
          
          return (
            <g key={`${angle}-${index}`}>
              {/* プロット点 */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isBaseColor ? 6 : 4}
                fill={isBaseColor ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                stroke={isBaseColor ? "hsl(var(--primary-foreground))" : "hsl(var(--accent-foreground))"}
                strokeWidth={isBaseColor ? 2 : 1}
                className="drop-shadow-sm"
              />
              
              {/* 中心からプロット点への線 */}
              {!isBaseColor && (
                <line
                  x1={radius}
                  y1={radius}
                  x2={coords.x}
                  y2={coords.y}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  className="opacity-50"
                />
              )}
            </g>
          );
        })}
        
        {/* ベースカラーから中心への線 */}
        {angles.length > 0 && (
          <line
            x1={radius}
            y1={radius}
            x2={getCoordinates(0).x}
            y2={getCoordinates(0).y}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            className="opacity-70"
          />
        )}
        
        {/* 配色技法名の表示 */}
        {scheme && (
          <text
            x={radius}
            y={radius - radius * 0.4}
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-medium"
            fontSize="8"
          >
            {angles.length}色
          </text>
        )}
      </svg>
    </div>
  );
};