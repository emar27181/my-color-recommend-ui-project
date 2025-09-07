import React, { useMemo } from 'react';

interface SaturationLightnessHeatmapProps {
  data: number[][];
  title?: string;
}

export default function SaturationLightnessHeatmap({ 
  data, 
  title = "彩度・明度分布ヒートマップ" 
}: SaturationLightnessHeatmapProps) {
  const maxValue = useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    return Math.max(...data.flat(), 0.001);
  }, [data]);

  // セルの色を決定する関数
  const getCellColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    
    // 青色の単一色相でグラデーション表現（最小0.1から最大1.0まで）
    const alpha = Math.max(0.1, Math.min(1.0, intensity));
    return `rgba(59, 130, 246, ${alpha})`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        データがありません
      </div>
    );
  }


  return (
    <div className="relative">
      {/* タイトル */}
      <div className="text-xs font-medium text-foreground mb-2 text-center">
        {title}
      </div>
      
      {/* ヒートマップ */}
      <div style={{ width: '120px', height: '120px' }} className="border border-border bg-background mx-auto">
        <div className="grid grid-cols-5 grid-rows-5 gap-0 w-full h-full">
          {data.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="hover:opacity-80 transition-opacity duration-200"
                style={{ 
                  backgroundColor: getCellColor(value, maxValue)
                }}
                title={`彩度: ${((colIndex + 0.5) / 5 * 100).toFixed(0)}%, 明度: ${((4 - rowIndex + 0.5) / 5 * 100).toFixed(0)}%, 値: ${value.toFixed(3)}`}
              />
            ))
          )}
        </div>
      </div>
      
      {/* 軸ラベル - 絶対位置 */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
        <div className="text-xs text-muted-foreground transform -rotate-90 whitespace-nowrap">
          明度
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-center">
        彩度
      </div>
    </div>
  );
}