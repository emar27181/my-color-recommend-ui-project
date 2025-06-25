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
  radius = 125, // デフォルトサイズを直接指定
  schemeId,
  baseHue: _baseHue = 0, // 現在は未使用（配色技法の純粋な角度関係を表示）
  className = ''
}) => {
  const containerRadius = radius; // 外枠半径
  const wheelRadius = 115; // 色相環半径 (外枠より少し小さく)
  const size = containerRadius * 2;
  const strokeWidth = 2;
  const plotRadius = 86; // プロット点の配置半径 (wheelRadius * 0.75相当)

  // 選択された配色技法のanglesを取得
  const scheme = schemeId ? COLOR_SCHEMES.find(s => s.id === schemeId) : null;
  const angles = scheme?.angles || [0];

  // 角度から座標を計算する関数（ベースカラーを真上に配置）
  const getCoordinates = (angle: number) => {
    // 配色技法の角度のみを使用し、ベースカラー（angle=0）を真上に配置
    // SVGでは0度が右（3時方向）なので、真上にするには -90度オフセット
    const radian = (angle - 90) * Math.PI / 180;
    return {
      x: containerRadius + plotRadius * Math.cos(radian),
      y: containerRadius + plotRadius * Math.sin(radian)
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
          cx={containerRadius}
          cy={containerRadius}
          r={wheelRadius - strokeWidth}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        
        {/* 軌道線（プロット点が配置される円） */}
        <circle
          cx={containerRadius}
          cy={containerRadius}
          r={plotRadius}
          fill="none"
          stroke="#999999"
          strokeWidth={1.5}
          strokeDasharray="5,3"
        />
        
        {/* 配色技法のプロット点を表示 */}
        {angles.map((angle, index) => {
          const coords = getCoordinates(angle);
          const isBaseColor = angle === 0;
          
          return (
            <g key={`${angle}-${index}`}>
              {/* 中心からプロット点への線 */}
              <line
                x1={containerRadius}
                y1={containerRadius}
                x2={coords.x}
                y2={coords.y}
                stroke="#666666"
                strokeWidth={2}
              />
              
              {/* プロット点 */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={4}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth={isBaseColor ? 1.5 : 1}
                className="drop-shadow-sm"
              />
            </g>
          );
        })}
        
        
        
      </svg>
    </div>
  );
};