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
  const size = 200;
  const center = size / 2;
  const radius = 80;
  
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
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,3" />
        
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
  const width = 200;
  const height = 200;
  
  const points = colors.map(color => {
    try {
      const [, s, l] = chroma(color.hex).hsl();
      const x = (s || 0) * width;
      const y = height - (l || 0) * height;
      return { x, y, color: color.hex, usage: color.usage };
    } catch {
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="border rounded">
        {/* グリッド */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* 軸ラベル */}
        <text x={width/2} y={height-5} textAnchor="middle" className="text-xs font-bold fill-foreground">彩度</text>
        <text x="10" y={height/2} textAnchor="middle" className="text-xs font-bold fill-foreground" transform={`rotate(-90 10 ${height/2})`}>明度</text>
        
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