import React from 'react';
import { COLOR_SCHEMES } from '@/store/colorStore';

interface ColorWheelMiniProps {
  /** 色相環の半径（デフォルト: 24px） */
  radius?: number;
  /** 現在選択されている配色技法のID */
  schemeId?: string;
  /** ベースカラーの色相角度（0-360度） */
  baseHue?: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ミニサイズの色相環表示コンポーネント
 * 配色技法一括表示用の小さなサイズ
 */
export const ColorWheelMini: React.FC<ColorWheelMiniProps> = ({
  radius = 24, // 小さなサイズ
  schemeId,
  baseHue = 0, // ベースカラーの実際の色相値
  className = ''
}) => {
  const containerRadius = radius;
  const wheelRadius = radius - 2; // 外枠より少し小さく
  const size = containerRadius * 2;
  const strokeWidth = 1;
  const plotRadius = radius * 0.6; // プロット点の配置半径

  // 選択された配色技法のanglesを取得
  const scheme = schemeId ? COLOR_SCHEMES.find(s => s.id === schemeId) : null;
  const angles = scheme?.angles || [0];

  // 角度から座標を計算する関数（hue=0を12時位置に固定）
  const getCoordinates = (angle: number) => {
    // 配色技法の角度にベースカラーの色相値を加算
    // hue=0が12時位置になるよう -90度オフセット
    const actualHue = (baseHue + angle) % 360;
    const radian = (actualHue - 90) * Math.PI / 180;
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
          strokeWidth={0.5}
          strokeDasharray="2,1"
        />

        {/* 配色技法のプロット点を表示 */}
        {angles.map((angle, index) => {
          const coords = getCoordinates(angle);
          const isBaseColor = angle === 0;
          // 実際の色相値を計算（ベースカラーの色相 + 配色技法の角度）
          const actualHue = (baseHue + angle) % 360;
          const pointColor = `hsl(${actualHue}, 70%, 50%)`;

          return (
            <g key={`${angle}-${index}`}>
              {/* 中心からプロット点への線 */}
              <line
                x1={containerRadius}
                y1={containerRadius}
                x2={coords.x}
                y2={coords.y}
                stroke="#666666"
                strokeWidth={0.5}
              />

              {/* プロット点 */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={2.5}
                fill={pointColor}
                stroke="#ffffff"
                strokeWidth={isBaseColor ? 1.2 : 0.8}
                className="drop-shadow-sm"
              />
            </g>
          );
        })}

      </svg>
    </div>
  );
};