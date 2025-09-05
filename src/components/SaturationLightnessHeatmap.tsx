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
    if (value === 0) {
      return 'rgba(240, 240, 240, 0.8)'; // 薄いグレー（未使用）
    }
    
    const intensity = value / maxValue;
    
    // 青色の単一色相でグラデーション表現（薄い→濃い）
    const alpha = Math.max(0.2, Math.min(1.0, intensity));
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
    <div className="flex flex-col">
      <div className="text-xs font-medium text-muted-foreground mb-2 text-center">
        {title}
      </div>
      <div className="relative">
        {/* 1:1の正方形ヒートマップ */}
        <div style={{ width: '250px', height: '250px' }} className="border border-border bg-background">
          <div className="grid grid-cols-5 grid-rows-5 gap-0 p-0" style={{ width: '250px', height: '250px' }}>
            {data.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="group relative hover:opacity-80 transition-opacity duration-200"
                  style={{ 
                    backgroundColor: getCellColor(value, maxValue),
                    width: '50px',
                    height: '50px'
                  }}
                  title={`彩度: ${((colIndex + 0.5) / 5 * 100).toFixed(0)}%, 明度: ${((4 - rowIndex + 0.5) / 5 * 100).toFixed(0)}%, 値: ${value.toFixed(3)}`}
                />
              ))
            )}
          </div>
        </div>
        
        {/* 軸ラベル */}
        <div className="flex justify-center text-xs text-muted-foreground mt-2">
          <span>彩度（横軸）: 0% → 100%</span>
        </div>
        <div className="absolute -left-36 top-1/2 -translate-y-1/2">
          <div className="text-xs text-muted-foreground transform -rotate-90 whitespace-nowrap">
            明度（縦軸）: 100% ↓ 0%
          </div>
        </div>
      </div>
    </div>
  );
}