import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useColorStore } from '@/store/colorStore';
import chroma from 'chroma-js';
import { useState, useEffect } from 'react';

/**
 * Test2用: 色相環＋トーンスライダーコンポーネント
 *
 * 色相環とトーンスライダーで自由に色を作成できる。
 * 問題点：作れる色の数が多すぎて選択に迷う体験を提供。
 */
export const HueWheelToneSlider = () => {
  const { setPaintColor } = useColorStore();

  // 色の状態管理
  const [hue, setHue] = useState(0); // 0-360
  const [saturation, setSaturation] = useState(70); // 0-100
  const [lightness, setLightness] = useState(50); // 0-100

  // 現在の色を計算
  const currentColor = chroma.hsl(hue, saturation / 100, lightness / 100).hex();

  // 色が変わるたびに描画色を即座に更新
  useEffect(() => {
    setPaintColor(currentColor);
  }, [currentColor, setPaintColor]);

  // 色相環のサイズ設定
  const size = 240;
  const center = size / 2;
  const outerRadius = 100;
  const innerRadius = 60;

  // 色相環クリックハンドラ
  const handleHueWheelClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // SVG座標系に変換
    const svgX = (x / rect.width) * size;
    const svgY = (y / rect.height) * size;

    // 中心からの相対位置
    const deltaX = svgX - center;
    const deltaY = svgY - center;

    // 距離チェック（色相環の範囲内かどうか）
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < innerRadius || distance > outerRadius) return;

    // 角度計算（ラジアンから度数へ、12時方向を0度とする）
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90) % 360;
    if (angle < 0) angle += 360;

    setHue(angle);
  };


  // 選択中の色相位置を計算
  const selectedAngle = (hue - 90) * (Math.PI / 180);
  const selectedX = center + ((outerRadius + innerRadius) / 2) * Math.cos(selectedAngle);
  const selectedY = center + ((outerRadius + innerRadius) / 2) * Math.sin(selectedAngle);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">色相環＋トーンスライダー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 色相環 */}
        <div className="flex flex-col items-center">
          <svg
            width={size}
            height={size}
            onClick={handleHueWheelClick}
            className="cursor-crosshair"
          >
            {/* 色相環のリング */}
            <defs>
              <linearGradient id="hue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {Array.from({ length: 12 }, (_, i) => {
                  const h = (i * 360) / 12;
                  const color = chroma.hsl(h, 1, 0.5).hex();
                  return (
                    <stop key={i} offset={`${(i / 12) * 100}%`} stopColor={color} />
                  );
                })}
              </linearGradient>
            </defs>

            {/* 外側の円（背景） */}
            <circle
              cx={center}
              cy={center}
              r={outerRadius}
              fill="none"
              stroke="url(#hue-gradient)"
              strokeWidth={outerRadius - innerRadius}
            />

            {/* 色相グラデーション（セグメント方式） */}
            {Array.from({ length: 360 }, (_, i) => {
              const angle1 = (i - 90) * (Math.PI / 180);
              const angle2 = (i + 1 - 90) * (Math.PI / 180);

              const x1 = center + innerRadius * Math.cos(angle1);
              const y1 = center + innerRadius * Math.sin(angle1);
              const x2 = center + outerRadius * Math.cos(angle1);
              const y2 = center + outerRadius * Math.sin(angle1);
              const x3 = center + outerRadius * Math.cos(angle2);
              const y3 = center + outerRadius * Math.sin(angle2);
              const x4 = center + innerRadius * Math.cos(angle2);
              const y4 = center + innerRadius * Math.sin(angle2);

              const color = chroma.hsl(i, 1, 0.5).hex();

              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`}
                  fill={color}
                  stroke="none"
                />
              );
            })}

            {/* 選択中の色相マーカー */}
            <circle
              cx={selectedX}
              cy={selectedY}
              r={8}
              fill="white"
              stroke="black"
              strokeWidth={2}
            />

            {/* 中心の円（白抜き） */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="white"
              stroke="#ccc"
              strokeWidth={1}
            />
          </svg>

          <div className="text-xs text-muted-foreground mt-2">
            色相: {hue.toFixed(0)}°
          </div>
        </div>

        {/* トーンスライダー */}
        <div className="space-y-4">
          {/* 彩度スライダー */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>彩度 (Saturation)</label>
              <span className="font-mono">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-gray-300 via-pink-500 to-pink-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${chroma.hsl(hue, 0, lightness / 100).hex()}, ${chroma.hsl(hue, 1, lightness / 100).hex()})`
              }}
            />
          </div>

          {/* 明度スライダー */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>明度 (Lightness)</label>
              <span className="font-mono">{lightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => setLightness(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, black, ${chroma.hsl(hue, saturation / 100, 0.5).hex()}, white)`
              }}
            />
          </div>
        </div>

        {/* カラープレビュー */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">現在の描画色</div>
          <div
            className="w-full h-16 rounded border-2 border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
          <div className="text-xs font-mono text-center mt-1">{currentColor}</div>
        </div>
      </CardContent>
    </Card>
  );
};
