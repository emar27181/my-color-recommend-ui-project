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
    
    if (intensity < 0.25) {
      // 青色（低使用量）
      const alpha = Math.max(0.4, intensity * 2);
      return `rgba(59, 130, 246, ${alpha})`;
    } else if (intensity < 0.5) {
      // 緑色（中低使用量）
      const alpha = Math.max(0.6, intensity * 1.2);
      return `rgba(34, 197, 94, ${alpha})`;
    } else if (intensity < 0.75) {
      // 黄色（中高使用量）
      const alpha = Math.max(0.7, intensity * 1.1);
      return `rgba(234, 179, 8, ${alpha})`;
    } else {
      // 赤色（高使用量）
      const alpha = Math.max(0.8, intensity);
      return `rgba(239, 68, 68, ${alpha})`;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        データがありません
      </div>
    );
  }

  // 使用頻度凡例を表示するコンポーネント
  const ColorLegend = () => {
    const scaleSteps = [
      { intensity: 0, color: 'rgba(240, 240, 240, 0.8)', label: '未使用' },
      { intensity: 0.125, color: 'rgba(59, 130, 246, 0.6)', label: '低' },
      { intensity: 0.375, color: 'rgba(34, 197, 94, 0.7)', label: '中低' },
      { intensity: 0.625, color: 'rgba(234, 179, 8, 0.8)', label: '中高' },
      { intensity: 0.875, color: 'rgba(239, 68, 68, 0.9)', label: '高' }
    ];

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">
          使用頻度
        </div>
        <div className="flex flex-col space-y-1">
          {scaleSteps.reverse().map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-3 border border-border/30 rounded-sm"
                style={{ backgroundColor: step.color }}
              />
              <span className="text-xs text-muted-foreground min-w-[24px]">
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          最大値: {maxValue.toFixed(3)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-start space-x-4">
      {/* ヒートマップ本体 */}
      <div className="flex flex-col">
        <div className="text-xs font-medium text-muted-foreground mb-2 text-center">
          {title}
        </div>
        <div className="relative">
          {/* 1:1の正方形ヒートマップ */}
          <div style={{ width: '250px', height: '250px' }} className="border border-border bg-background">
            <div className="grid grid-cols-5 grid-rows-5 gap-1 p-1" style={{ width: '250px', height: '250px' }}>
              {data.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="group relative hover:scale-105 transition-all duration-200 rounded-sm"
                    style={{ 
                      backgroundColor: getCellColor(value, maxValue),
                      width: '46px',
                      height: '46px'
                    }}
                    title={`彩度: ${((colIndex + 0.5) / 5 * 100).toFixed(0)}%, 明度: ${((4 - rowIndex + 0.5) / 5 * 100).toFixed(0)}%, 値: ${value.toFixed(3)}`}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* 軸ラベル */}
          <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
            <span>彩度: 0% → 100%</span>
          </div>
          <div className="absolute -left-8 top-0 h-full flex items-center">
            <div className="text-xs text-muted-foreground transform -rotate-90 whitespace-nowrap">
              明度: 100% ↓ 0%
            </div>
          </div>
        </div>
      </div>
      
      {/* 凡例 */}
      <div className="flex-shrink-0">
        <ColorLegend />
      </div>
    </div>
  );
}