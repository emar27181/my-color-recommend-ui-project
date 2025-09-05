import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SaturationLightnessHeatmapProps {
  data: number[][];
  title?: string;
}

export default function SaturationLightnessHeatmap({ 
  data, 
  title = "彩度・明度分布ヒートマップ" 
}: SaturationLightnessHeatmapProps) {
  const { chartData, maxValue } = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return { chartData: { datasets: [] }, maxValue: 0 };
    }

    const points: { x: number; y: number; v: number; rawValue: number }[] = [];
    const maxValue = Math.max(...data.flat(), 0.001); // 0除算を避ける

    // 5x5のグリッドでヒートマップを生成
    data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        // 彩度（x軸）: 10%, 30%, 50%, 70%, 90%
        const saturation = ((colIndex + 0.5) / 5) * 100;
        // 明度（y軸）: 90%, 70%, 50%, 30%, 10% (上が明るい、Y軸反転)
        const lightness = ((4 - rowIndex + 0.5) / 5) * 100;
        
        // 値が0でも表示（ヒートマップらしくするため）
        points.push({
          x: saturation,
          y: lightness,
          v: value / maxValue, // 正規化された値（0-1）
          rawValue: value
        });
      });
    });

    return {
      chartData: {
        datasets: [
          {
            label: '使用頻度',
            data: points,
            backgroundColor: (context: any) => {
              const point = context.raw;
              const intensity = point.v;
              
              // ヒートマップ風の色スケール（青→緑→黄→赤）
              if (intensity === 0) {
                return 'rgba(240, 240, 240, 0.8)'; // 薄いグレー（未使用）
              } else if (intensity < 0.25) {
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
            },
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 0.5,
            pointRadius: 25, // 5x5グリッドの升目を埋めるサイズ
            pointHoverRadius: 27,
            pointStyle: 'rect' // 四角形でヒートマップらしく
          }
        ]
      },
      maxValue
    };
  }, [data]);

  const options = {
    responsive: false, // 固定サイズに設定
    maintainAspectRatio: false, // aspectRatioを無効にして固定サイズを優先
    width: 256,
    height: 256, // 完全に正方形に設定
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: 'rgb(113, 113, 122)', // text-muted-foreground相当
        font: {
          size: 12,
          weight: 'normal' as const
        }
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const point = context[0].raw;
            return `彩度: ${point.x.toFixed(0)}%, 明度: ${point.y.toFixed(0)}%`;
          },
          label: (context: any) => {
            const point = context.raw;
            const intensity = (point.v * 100).toFixed(1);
            return `使用強度: ${intensity}% (値: ${point.rawValue.toFixed(3)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: '彩度 (%)',
          color: 'rgb(113, 113, 122)', // text-muted-foreground相当
          font: {
            size: 10
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(113, 113, 122, 0.2)',
          display: true
        },
        ticks: {
          stepSize: 20,
          color: 'rgb(113, 113, 122)',
          font: {
            size: 9
          },
          values: [0, 20, 40, 60, 80, 100], // 5x5グリッドに合わせた目盛り
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: '明度 (%)',
          color: 'rgb(113, 113, 122)', // text-muted-foreground相当
          font: {
            size: 10
          }
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(113, 113, 122, 0.2)',
          display: true
        },
        ticks: {
          stepSize: 20,
          color: 'rgb(113, 113, 122)',
          font: {
            size: 9
          },
          values: [0, 20, 40, 60, 80, 100], // 5x5グリッドに合わせた目盛り
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    interaction: {
      intersect: false,
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        データがありません
      </div>
    );
  }

  // 使用率の高い色と凡例を表示するコンポーネント
  const ColorAnalysis = () => {
    // データから使用率の高い色を分析
    const topColors = useMemo(() => {
      if (!data || !Array.isArray(data)) return [];
      
      const colorData: { saturation: number; lightness: number; value: number; color: string }[] = [];
      
      data.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value > 0) {
            const saturation = ((colIndex + 0.5) / 5) * 100;
            const lightness = ((4 - rowIndex + 0.5) / 5) * 100;
            const hslColor = `hsl(0, ${saturation}%, ${lightness}%)`;
            
            colorData.push({
              saturation,
              lightness,
              value,
              color: hslColor
            });
          }
        });
      });
      
      // 使用値でソートして上位3つを取得
      return colorData
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
    }, [data]);

    const scaleSteps = [
      { intensity: 0, color: 'rgba(240, 240, 240, 0.8)', label: '未使用' },
      { intensity: 0.125, color: 'rgba(59, 130, 246, 0.6)', label: '低' },
      { intensity: 0.375, color: 'rgba(34, 197, 94, 0.7)', label: '中低' },
      { intensity: 0.625, color: 'rgba(234, 179, 8, 0.8)', label: '中高' },
      { intensity: 0.875, color: 'rgba(239, 68, 68, 0.9)', label: '高' }
    ];

    return (
      <div className="flex flex-col space-y-4">
        {/* 使用頻度凡例 */}
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

      </div>
    );
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="w-64 h-64"> {/* 固定サイズ256x256px */}
        <Scatter data={chartData} options={options} />
      </div>
      <div className="flex-shrink-0">
        <ColorAnalysis />
      </div>
    </div>
  );
}