import React from 'react';

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
 * 簡単な色相環表示コンポーネント
 * 現在は基本的な円のみを表示
 */
export const ColorWheel: React.FC<ColorWheelProps> = ({ 
  radius = 50, 
  schemeId,
  baseHue = 0,
  className = ''
}) => {
  const size = radius * 2;
  const strokeWidth = 4;

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-sm"
        role="img"
        aria-label={`色相環: ${schemeId ? `${schemeId}配色技法` : '基本色相環'}`}
      >
        {/* 外側の円（色相環の枠） */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="#333333"
          strokeWidth={strokeWidth}
          className="opacity-80"
        />
        
        {/* 内側の円（中央部分） */}
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.3}
          fill="#ffffff"
          stroke="#666666"
          strokeWidth={2}
          className="opacity-90"
        />
        
        {/* テスト用の目立つ円 */}
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.15}
          fill="#ff0000"
          className="opacity-70"
        />
        
        {/* ベースカラーの位置を示すマーカー（簡単な点） */}
        {baseHue !== undefined && (
          <circle
            cx={radius + (radius * 0.7) * Math.cos((baseHue - 90) * Math.PI / 180)}
            cy={radius + (radius * 0.7) * Math.sin((baseHue - 90) * Math.PI / 180)}
            r={6}
            fill="#00ff00"
            stroke="#000000"
            strokeWidth={2}
            className="drop-shadow-sm"
          />
        )}
        
        {/* 配色技法の表示（現在は簡単なラインのみ） */}
        {schemeId && baseHue !== undefined && (
          <g className="opacity-90">
            {/* 補色の例：180度対面に線を引く */}
            {schemeId === 'dyad' && (
              <>
                <line
                  x1={radius}
                  y1={radius}
                  x2={radius + (radius * 0.7) * Math.cos((baseHue + 180 - 90) * Math.PI / 180)}
                  y2={radius + (radius * 0.7) * Math.sin((baseHue + 180 - 90) * Math.PI / 180)}
                  stroke="#0000ff"
                  strokeWidth={3}
                  strokeDasharray="5,3"
                />
                {/* 補色の位置にもマーカー */}
                <circle
                  cx={radius + (radius * 0.7) * Math.cos((baseHue + 180 - 90) * Math.PI / 180)}
                  cy={radius + (radius * 0.7) * Math.sin((baseHue + 180 - 90) * Math.PI / 180)}
                  r={4}
                  fill="#0000ff"
                  stroke="#ffffff"
                  strokeWidth={1}
                />
              </>
            )}
            
            {/* 他の配色技法もテスト表示 */}
            {(schemeId === 'triad' || schemeId === 'analogous') && (
              <circle
                cx={radius + (radius * 0.5) * Math.cos((baseHue + 120 - 90) * Math.PI / 180)}
                cy={radius + (radius * 0.5) * Math.sin((baseHue + 120 - 90) * Math.PI / 180)}
                r={3}
                fill="#ff8800"
                stroke="#000000"
                strokeWidth={1}
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};