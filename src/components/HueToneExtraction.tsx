import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useColorStore, quantizeHue, quantizeSaturationLightness, COLOR_SCHEMES } from '@/store/colorStore';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { useMemo } from 'react';

// 色相環プロット用コンポーネント
const HueWheel = ({ colors, onHueClick, isQuantized, selectedColor, selectedScheme }: { colors: { hex: string; usage: number }[], onHueClick?: (hue: number) => void, isQuantized: boolean, selectedColor?: string, selectedScheme?: string }) => {
  const size = 220;
  const center = size / 2;
  const radius = 72;

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

  // 選択中の色の色相を計算
  const selectedHuePoint = selectedColor ? (() => {
    try {
      const [h] = chroma(selectedColor).hsl();
      const angle = (h || 0) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle - Math.PI / 2);
      const y = center + radius * Math.sin(angle - Math.PI / 2);
      return { x, y, color: selectedColor, hue: h || 0 };
    } catch {
      return null;
    }
  })() : null;

  // 配色技法のプロット点を計算
  const colorSchemePoints = useMemo(() => {
    if (!selectedScheme || !selectedColor) return [];

    try {
      const scheme = COLOR_SCHEMES.find(s => s.id === selectedScheme);
      if (!scheme) return [];

      const baseHue = chroma(selectedColor).get('hsl.h') || 0;

      return scheme.angles.map((angle) => {
        const actualHue = (baseHue + angle) % 360;
        const radian = actualHue * (Math.PI / 180);
        const x = center + radius * Math.cos(radian - Math.PI / 2);
        const y = center + radius * Math.sin(radian - Math.PI / 2);

        return {
          x,
          y,
          angle,
          actualHue,
          isBase: angle === 0,
          color: chroma.hsl(actualHue, 0.7, 0.5).hex()
        };
      });
    } catch (error) {
      console.error('Error calculating color scheme points:', error);
      return [];
    }
  }, [selectedScheme, selectedColor, center, radius]);

  // SVGクリックハンドラ
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onHueClick) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // SVG座標系に変換
    const svgX = (x / rect.width) * size;
    const svgY = (y / rect.height) * size;

    // 中心からの相対位置
    const centerX = center;
    const centerY = center;
    const deltaX = svgX - centerX;
    const deltaY = svgY - centerY;

    // 距離チェック（色相環の範囲内かどうか）
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < 20 || distance > radius) return; // 内側の円と外側の範囲外は無視

    // 角度計算（ラジアンから度数へ、12時方向を0度とする）
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90) % 360; // 12時方向を0度に調整
    if (angle < 0) angle += 360;

    onHueClick(angle);
  };

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="border-0 rounded cursor-pointer"
        onClick={handleSvgClick}
      >
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

        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,3" opacity="0.3" />

        {/* 30度間隔の対角線: 量子化モードで切り替え */}
        {isQuantized ? (
          // 量子化モード: 太い線で30度間隔を強調
          Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30 * (Math.PI / 180);
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
                stroke="#000000"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })
        ) : (
          // 通常モード: 細い線
          Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30 * (Math.PI / 180);
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
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })
        )}

        {/* 角度数値ラベル: 量子化モードで切り替え */}
        {isQuantized ? (
          // 量子化モード: 30度間隔ですべて表示
          [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degrees, i) => {
            const angle = degrees * (Math.PI / 180);
            const labelRadius = radius + 8; // 余白を最小化
            const x = center + labelRadius * Math.cos(angle - Math.PI / 2);
            const y = center + labelRadius * Math.sin(angle - Math.PI / 2);
            return (
              <text
                key={`angle-${i}`}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="text-xs fill-foreground font-medium"
                opacity="0.3"
              >
                {degrees}°
              </text>
            );
          })
        ) : (
          // 通常モード: 90度間隔
          [0, 90, 180, 270].map((degrees, i) => {
            const angle = degrees * (Math.PI / 180);
            const labelRadius = radius + 8; // 余白を最小化
            const x = center + labelRadius * Math.cos(angle - Math.PI / 2);
            const y = center + labelRadius * Math.sin(angle - Math.PI / 2);
            return (
              <text
                key={`angle-${i}`}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
                opacity="0.3"
              >
                {degrees}°
              </text>
            );
          })
        )}

        {/* 色相ポイント */}
        {huePoints.map((point, index) => point && (
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

        {/* 配色技法のプロット（選択中の色がある場合のみ） */}
        {selectedColor && colorSchemePoints.length > 0 && (
          <g>
            {/* 中心から各プロット点への関係線 */}
            {colorSchemePoints.map((point, index) => (
              <line
                key={`scheme-line-${index}`}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#ff0000"
                strokeWidth="1"
                strokeDasharray={point.isBase ? "none" : "6,3"}
                opacity="0.5"
              />
            ))}

            {/* 配色技法のプロット点 */}
            {colorSchemePoints.map((point, index) => (
              <g key={`scheme-point-${index}`}>
                {/* 配色技法点 */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={point.isBase ? "6" : "4"}
                  fill={point.color}
                  stroke="#ff0000"
                  strokeWidth="1"
                  opacity="0.5"
                />

                {/* 角度ラベル（ベース色以外） */}
                {!point.isBase && (
                  <text
                    x={point.x + (point.x > center ? 12 : -12)}
                    y={point.y + 4}
                    textAnchor={point.x > center ? "start" : "end"}
                    className="text-xs fill-foreground font-medium"
                    opacity="0.7"
                  >
                    {point.angle > 0 ? `+${point.angle}°` : `${point.angle}°`}
                  </text>
                )}
              </g>
            ))}
          </g>
        )}

        {/* 選択中の色の強調表示 */}
        {selectedHuePoint && (
          <circle
            cx={selectedHuePoint.x}
            cy={selectedHuePoint.y}
            r="6"
            fill={selectedHuePoint.color}
            stroke="#ff0000"
            strokeWidth="1"
            opacity="0.5"
          />
        )}
      </svg>
    </div>
  );
};

// 彩度-明度散布図用コンポーネント
const SaturationLightnessPlot = ({ colors, onSaturationLightnessClick, isQuantized, selectedColor }: { colors: { hex: string; usage: number }[], onSaturationLightnessClick?: (saturation: number, lightness: number) => void, isQuantized: boolean, selectedColor?: string }) => {
  const plotWidth = 145.8;
  const plotHeight = 145.8;
  const width = 180;
  const height = 214.5;

  const points = colors.map(color => {
    try {
      const [, s, l] = chroma(color.hex).hsl();
      const x = 20 + (s || 0) * plotWidth; // 左マージン最小化維持
      const y = 11 + plotHeight - (l || 0) * plotHeight; // 元の上マージンに戻す
      return { x, y, color: color.hex, usage: color.usage };
    } catch {
      return null;
    }
  }).filter(Boolean);

  // 選択中の色の彩度・明度を計算
  const selectedSLPoint = selectedColor ? (() => {
    try {
      const [, s, l] = chroma(selectedColor).hsl();
      const x = 20 + (s || 0) * plotWidth;
      const y = 11 + plotHeight - (l || 0) * plotHeight;
      return { x, y, color: selectedColor };
    } catch {
      return null;
    }
  })() : null;

  // SVGクリックハンドラ
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onSaturationLightnessClick) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // SVG座標系に変換
    const svgX = (x / rect.width) * width;
    const svgY = (y / rect.height) * height;

    // プロット領域内かチェック
    if (svgX < 20 || svgX > 20 + plotWidth || svgY < 11 || svgY > 11 + plotHeight) return;

    // 彩度・明度を計算（0-1の範囲）
    const saturation = (svgX - 20) / plotWidth;
    const lightness = 1 - (svgY - 11) / plotHeight; // Y軸は反転

    onSaturationLightnessClick(
      Math.max(0, Math.min(1, saturation)),
      Math.max(0, Math.min(1, lightness))
    );
  };

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="border-0 rounded cursor-pointer"
        onClick={handleSvgClick}
      >
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
                x={20 + (i / 20) * plotWidth}
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
        <rect x="20" y="11" width={plotWidth} height={plotHeight} fill="none" stroke="#e5e7eb" strokeWidth="1" />

        {/* グリッド線: 量子化モードで切り替え */}
        {isQuantized ? (
          // 量子化モード: 10%間隔の太いグリッド
          <>
            {/* 縦線（彩度） */}
            {Array.from({ length: 11 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={20 + (i / 10) * plotWidth}
                y1="11"
                x2={20 + (i / 10) * plotWidth}
                y2={11 + plotHeight}
                stroke="#000000"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
          </>
        ) : (
          // 通常モード: 細いグリッド
          <>
            {/* 縦線（彩度） */}
            {Array.from({ length: 11 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={20 + (i / 10) * plotWidth}
                y1="11"
                x2={20 + (i / 10) * plotWidth}
                y2={11 + plotHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}
          </>
        )}
        {isQuantized ? (
          // 量子化モード: 10%間隔の太いグリッド
          <>
            {/* 横線（明度） */}
            {Array.from({ length: 11 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="20"
                y1={11 + (i / 10) * plotHeight}
                x2={20 + plotWidth}
                y2={11 + (i / 10) * plotHeight}
                stroke="#000000"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
          </>
        ) : (
          // 通常モード: 細いグリッド
          <>
            {/* 横線（明度） */}
            {Array.from({ length: 11 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1="20"
                y1={11 + (i / 10) * plotHeight}
                x2={20 + plotWidth}
                y2={11 + (i / 10) * plotHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}
          </>
        )}

        {/* 数値ラベル: 量子化モードで切り替え */}
        {isQuantized ? (
          // 量子化モード: 20%間隔ですべて表示
          <>
            {/* 彩度の数値 (下側) */}
            {[0, 20, 40, 60, 80, 100].map((value, i) => (
              <text
                key={`s-${i}`}
                x={20 + (value / 100) * plotWidth}
                y={height - 30}
                textAnchor="middle"
                className="text-xs fill-foreground font-medium"
                opacity="0.3"
              >
                {value}
              </text>
            ))}
            {/* 明度の数値 (左側) */}
            {[0, 20, 40, 60, 80, 100].map((value, i) => (
              <text
                key={`l-${i}`}
                x="10"
                y={11 + plotHeight - (value / 100) * plotHeight + 4}
                textAnchor="middle"
                className="text-xs fill-foreground font-medium"
                opacity="0.3"
              >
                {value}
              </text>
            ))}
          </>
        ) : (
          // 通常モード: 25%間隔
          <>
            {/* 彩度の数値 (下側) */}
            {[0, 25, 50, 75, 100].map((value, i) => (
              <text
                key={`s-${i}`}
                x={20 + (value / 100) * plotWidth}
                y={height - 30}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
                opacity="0.3"
              >
                {value}
              </text>
            ))}
            {/* 明度の数値 (左側) */}
            {[0, 25, 50, 75, 100].map((value, i) => (
              <text
                key={`l-${i}`}
                x="10"
                y={11 + plotHeight - (value / 100) * plotHeight + 4}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
                opacity="0.3"
              >
                {value}
              </text>
            ))}
          </>
        )}


        {/* ポイント */}
        {points.map((point, index) => point && (
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

        {/* 選択中の色の強調表示 */}
        {selectedSLPoint && (
          <circle
            cx={selectedSLPoint.x}
            cy={selectedSLPoint.y}
            r="6"
            fill={selectedSLPoint.color}
            stroke="white"
            strokeWidth="1"
            opacity="1"
          />
        )}
      </svg>
    </div>
  );
};

export const HueToneExtraction = () => {
  const { extractedColors, selectedColor, setSelectedColor, isQuantizationEnabled, selectedScheme } = useColorStore();

  const { t } = useTranslation();

  // 色相環クリック時のハンドラ
  const handleHueClick = (hue: number) => {
    try {
      // 量子化モードが有効ならHueを量子化
      const finalHue = isQuantizationEnabled ? quantizeHue(hue) : hue;

      // 現在の描画色のS, Lを取得
      const [, s, l] = chroma(selectedColor).hsl();
      // 新しいHueで色を作成
      const newColor = chroma.hsl(finalHue, s || 0.5, l || 0.5).hex();
      setSelectedColor(newColor);

      console.log(`Hue click: ${hue}° -> ${finalHue}° (quantization: ${isQuantizationEnabled ? 'ON' : 'OFF'})`);
    } catch (error) {
      console.error('色相変更エラー:', error);
    }
  };

  // トーン表クリック時のハンドラ
  const handleSaturationLightnessClick = (saturation: number, lightness: number) => {
    try {
      // 量子化モードが有効ならS, Lを量子化
      const finalSaturation = isQuantizationEnabled ? quantizeSaturationLightness(saturation) : saturation;
      const finalLightness = isQuantizationEnabled ? quantizeSaturationLightness(lightness) : lightness;

      // 現在の描画色のHueを取得
      const [h] = chroma(selectedColor).hsl();
      // 新しいS, Lで色を作成
      const newColor = chroma.hsl(h || 0, finalSaturation, finalLightness).hex();
      setSelectedColor(newColor);

      console.log(`S/L click: S ${saturation.toFixed(2)} -> ${finalSaturation.toFixed(2)}, L ${lightness.toFixed(2)} -> ${finalLightness.toFixed(2)} (quantization: ${isQuantizationEnabled ? 'ON' : 'OFF'})`);
    } catch (error) {
      console.error('彩度・明度変更エラー:', error);
    }
  };

  // 可視化用のデータを準備
  const visualizationData = useMemo(() => {
    return extractedColors.map(color => ({
      hex: color.hex,
      usage: color.usage
    }));
  }, [extractedColors]);

  return (
    <Card className="w-full flex flex-col p-0">
      <CardHeader className="p-0 flex-shrink-0">
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto min-h-0">
        <div data-tutorial="hue-tone-extraction" className="space-y-0">
          {/* 配色技法の表示 */}
          {selectedScheme && selectedColor && (
            <div className="px-2 py-1 text-center">
              <div className="text-xs text-muted-foreground opacity-80">
                {COLOR_SCHEMES.find(s => s.id === selectedScheme)?.name.split(':')[0] || '配色技法'}
              </div>
            </div>
          )}

          {/* 色相・トーンの可視化を常に表示 */}
          <div className="flex flex-col space-y-0">
            <HueWheel colors={visualizationData} onHueClick={handleHueClick} isQuantized={isQuantizationEnabled} selectedColor={selectedColor} selectedScheme={selectedScheme} />
            <SaturationLightnessPlot colors={visualizationData} onSaturationLightnessClick={handleSaturationLightnessClick} isQuantized={isQuantizationEnabled} selectedColor={selectedColor} />
          </div>
          {/* 抽出色がない場合のメッセージは下部に小さく表示 */}
          {extractedColors.length === 0 && (
            <div className="text-center text-muted-foreground text-xs py-2 opacity-50">
              {t('extractedColors.noColors')}
            </div>
          )}

          {/* 色使用量可視化バー */}
          <div className="pt-3 border-t-4 border-pink-500 mt-3 p-4 bg-orange-200">
            {/* 実際の抽出色バー（強制表示） */}
            <div className="mt-4 mb-4 w-[90%] mx-auto h-4 rounded-sm overflow-hidden flex border border-white bg-white">
              {extractedColors.map((color, index) => (
                <div
                  key={`${color.hex}-segment-${index}`}
                  className="h-full"
                  style={{
                    backgroundColor: color.hex,
                    width: `${color.usage * 100}%`,
                    minWidth: '20px',
                    height: '16px'
                  }}
                  title={`${color.hex}: ${(color.usage * 100).toFixed(1)}%`}
                >
                  &nbsp;
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};