import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColorGrid } from '@/components/common/ColorGrid';
import { useColorStore } from '@/store/colorStore';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { useMemo } from 'react';

interface HueToneExtractionProps {
  isMobile?: boolean;
}

// 色相環プロット用コンポーネント
const HueWheel = ({ colors }: { colors: { hex: string; usage: number }[] }) => {
  const size = 220; // 200 * 1.1
  const center = size / 2;
  const radius = 72; // 80 * 0.9（内側は変更しない）
  
  const huePoints = colors.map(color => {
    try {
      const [h] = chroma(color.hex).hsl();
      const angle = (h || 0) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle - Math.PI / 2);
      const y = center + radius * Math.sin(angle - Math.PI / 2);
      return { x, y, color: color.hex, usage: color.usage };
    } catch {
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="border rounded">
        {/* 色相環背景 */}
        <defs>
          <radialGradient id="hueWheel">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* 色相環の色相背景 */}
          {Array.from({ length: 360 }, (_, degree) => {
            const hue = degree;
            const color = chroma.hsl(hue, 0.5, 0.5).alpha(0.3).css();
            return (
              <linearGradient key={`hue-${degree}`} id={`hue-gradient-${degree}`}>
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            );
          })}
        </defs>
        
        {/* 色相環の色相セクター */}
        {Array.from({ length: 360 }, (_, degree) => {
          const angle1 = (degree - 90) * (Math.PI / 180);
          const angle2 = (degree + 1 - 90) * (Math.PI / 180);
          const innerRadius = 20;
          const outerRadius = radius;
          
          const x1 = center + innerRadius * Math.cos(angle1);
          const y1 = center + innerRadius * Math.sin(angle1);
          const x2 = center + outerRadius * Math.cos(angle1);
          const y2 = center + outerRadius * Math.sin(angle1);
          const x3 = center + outerRadius * Math.cos(angle2);
          const y3 = center + outerRadius * Math.sin(angle2);
          const x4 = center + innerRadius * Math.cos(angle2);
          const y4 = center + innerRadius * Math.sin(angle2);
          
          const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
          const hue = degree;
          const color = chroma.hsl(hue, 0.5, 0.5).alpha(0.3).css();
          
          return (
            <path
              key={`sector-${degree}`}
              d={pathData}
              fill={color}
              stroke="none"
            />
          );
        })}
        
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,3" />
        
        {/* 15度間隔の対角線 */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = i * 15 * (Math.PI / 180);
          const x1 = center + 10 * Math.cos(angle - Math.PI / 2);
          const y1 = center + 10 * Math.sin(angle - Math.PI / 2);
          const x2 = center + radius * Math.cos(angle - Math.PI / 2);
          const y2 = center + radius * Math.sin(angle - Math.PI / 2);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e5e7eb"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}
        
        {/* 角度数値ラベル（円の外側） */}
        {[0, 90, 180, 270].map((degrees, i) => {
          const angle = degrees * (Math.PI / 180);
          const labelRadius = radius + 16.5; // 15 * 1.1
          const x = center + labelRadius * Math.cos(angle - Math.PI / 2);
          const y = center + labelRadius * Math.sin(angle - Math.PI / 2);
          return (
            <text
              key={`angle-${i}`}
              x={x}
              y={y + 4}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {degrees}°
            </text>
          );
        })}
        
        {/* 色相ポイント */}
        {huePoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={Math.max(3, point.usage * 20)}
            fill={point.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};

// 彩度-明度散布図用コンポーネント
const SaturationLightnessPlot = ({ colors }: { colors: { hex: string; usage: number }[] }) => {
  const plotWidth = 145.8; // 162 * 0.9
  const plotHeight = 145.8; // 162 * 0.9
  const margin = 33; // 30 * 1.1
  const width = 214.5; // 固定サイズ
  const height = 214.5; // 固定サイズ
  
  const points = colors.map(color => {
    try {
      const [, s, l] = chroma(color.hex).hsl();
      const x = 43.45 + (s || 0) * plotWidth; // 22 + (214.5 * 0.1) = 22 + 21.45
      const y = 11 + plotHeight - (l || 0) * plotHeight; // 10 * 1.1
      return { x, y, color: color.hex, usage: color.usage };
    } catch {
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="border rounded">
        {/* 彩度-明度背景グラデーション */}
        <defs>
          {/* 彩度-明度の背景色グリッド */}
        </defs>
        
        {/* 背景色グリッドを描画 */}
        {Array.from({ length: 20 }, (_, i) => 
          Array.from({ length: 20 }, (_, j) => {
            const saturation = (i + 0.5) / 20;
            const lightness = (19.5 - j) / 20;
            const color = chroma.hsl(0, saturation, lightness).alpha(0.3).css(); // 赤色相固定
            return (
              <rect
                key={`bg-${i}-${j}`}
                x={43.45 + (i / 20) * plotWidth}
                y={11 + (j / 20) * plotHeight}
                width={plotWidth / 20}
                height={plotHeight / 20}
                fill={color}
                stroke="none"
              />
            );
          })
        ).flat()}
        
        {/* プロット領域の境界 */}
        <rect x="43.45" y="11" width={plotWidth} height={plotHeight} fill="none" stroke="#e5e7eb" strokeWidth="1"/>
        
        {/* 10等分グリッド線 */}
        {/* 縦線（彩度） */}
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={43.45 + (i / 10) * plotWidth}
            y1="11"
            x2={43.45 + (i / 10) * plotWidth}
            y2={11 + plotHeight}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {/* 横線（明度） */}
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="43.45"
            y1={11 + (i / 10) * plotHeight}
            x2={43.45 + plotWidth}
            y2={11 + (i / 10) * plotHeight}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        
        {/* 数値ラベル（外側） */}
        {/* 彩度の数値 (下側) */}
        {[0, 25, 50, 75, 100].map((value, i) => (
          <text
            key={`s-${i}`}
            x={43.45 + (value / 100) * plotWidth}
            y={height - 25}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {value}
          </text>
        ))}
        {/* 明度の数値 (左側) */}
        {[0, 25, 50, 75, 100].map((value, i) => (
          <text
            key={`l-${i}`}
            x="33.45"
            y={11 + plotHeight - (value / 100) * plotHeight + 4}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {value}
          </text>
        ))}
        
        {/* 軸ラベル */}
        <text x={43.45 + plotWidth/2} y={height - 8} textAnchor="middle" className="text-xs font-bold fill-foreground">彩度</text>
        <text x="23.45" y={11 + plotHeight/2} textAnchor="middle" className="text-xs font-bold fill-foreground" transform={`rotate(-90 23.45 ${11 + plotHeight/2})`}>明度</text>
        
        {/* ポイント */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={Math.max(3, point.usage * 20)}
            fill={point.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};

export const HueToneExtraction = ({ isMobile = false }: HueToneExtractionProps) => {
  const { extractedColors, dominantColor, setColorFromExtracted } = useColorStore();
  const { t } = useTranslation();

  const handleColorClick = (color: string) => {
    setColorFromExtracted(color);
  };

  // 可視化用のデータを準備
  const visualizationData = useMemo(() => {
    return extractedColors.map(color => ({
      hex: color.hex,
      usage: color.usage
    }));
  }, [extractedColors]);

  // 抽出された色をColorGridに適した形式に変換
  const colorItems = extractedColors.map(extractedColor => {
    try {
      const [h, s, l] = chroma(extractedColor.hex).hsl();
      const hsl = `hsl(${Math.round(h || 0)}, ${Math.round((s || 0) * 100)}%, ${Math.round((l || 0) * 100)}%)`;
      return {
        color: extractedColor.hex,
        title: extractedColor.hex,
        showClickIcon: false,
        subtitle: `${hsl} (${(extractedColor.usage * 100).toFixed(1)}%)`
      };
    } catch (error) {
      return {
        color: extractedColor.hex,
        title: extractedColor.hex,
        showClickIcon: false,
        subtitle: `${(extractedColor.usage * 100).toFixed(1)}%`
      };
    }
  });

  return (
    <Card className="w-full flex flex-col pb-0">
      <CardHeader className="pb-1 pt-2 flex-shrink-0">
      </CardHeader>
      <CardContent className="pt-0 flex-1 overflow-auto pb-0 min-h-0">
        <div data-tutorial="hue-tone-extraction" className="space-y-4">
          {/* 色相・トーンの可視化のみ表示 */}
          {extractedColors.length > 0 ? (
            <div className={`${isMobile ? 'flex flex-col space-y-4' : 'grid grid-cols-2 gap-4'}`}>
              <HueWheel colors={visualizationData} />
              <SaturationLightnessPlot colors={visualizationData} />
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              {t('extractedColors.noColors')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};