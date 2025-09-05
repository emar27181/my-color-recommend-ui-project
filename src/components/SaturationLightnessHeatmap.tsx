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
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return { datasets: [] };
    }

    const points: { x: number; y: number; v: number }[] = [];
    const maxValue = Math.max(...data.flat(), 1);

    // 5x5のグリッドから散布図用のデータポイントを生成
    data.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value > 0) {
          // 彩度（x軸）: 0-100%、明度（y軸）: 0-100%
          const saturation = ((colIndex + 0.5) / 5) * 100; // 10%, 30%, 50%, 70%, 90%
          const lightness = ((4 - rowIndex + 0.5) / 5) * 100; // 90%, 70%, 50%, 30%, 10% (Y軸反転)
          
          points.push({
            x: saturation,
            y: lightness,
            v: value / maxValue // 正規化された値（0-1）
          });
        }
      });
    });

    return {
      datasets: [
        {
          label: '使用頻度',
          data: points,
          backgroundColor: (context: any) => {
            const point = context.raw;
            const intensity = point.v;
            
            // 彩度・明度に基づいて基本色を決定
            const saturation = point.x;
            const lightness = point.y;
            const hue = 0; // 赤色固定
            
            // HSLからRGBに変換して、使用頻度に基づいて青のオーバーレイを追加
            const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            const overlayOpacity = Math.max(intensity * 0.7, 0.3);
            
            return `rgba(59, 130, 246, ${overlayOpacity})`; // 青色オーバーレイ
          },
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
          pointRadius: (context: any) => {
            const point = context.raw;
            const intensity = point.v;
            return Math.max(intensity * 20, 5); // 5-20pxの範囲でサイズ変更
          },
          pointHoverRadius: (context: any) => {
            const point = context.raw;
            const intensity = point.v;
            return Math.max(intensity * 25, 8); // ホバー時少し大きく
          }
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            const originalValue = Math.round(point.v * Math.max(...data.flat(), 1));
            return `使用数: ${originalValue}`;
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
        },
        ticks: {
          stepSize: 20,
          color: 'rgb(113, 113, 122)',
          font: {
            size: 9
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
        },
        ticks: {
          stepSize: 20,
          color: 'rgb(113, 113, 122)',
          font: {
            size: 9
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

  return (
    <div className="h-48">
      <Scatter data={chartData} options={options} />
    </div>
  );
}