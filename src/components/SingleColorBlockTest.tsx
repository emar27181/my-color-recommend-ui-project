import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SingleColorBlockTest = () => {
  const [testColor, setTestColor] = useState('#FF6B35');
  const [selectedSize, setSelectedSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = testColor;
        ctx.fillRect(0, 0, selectedSize, selectedSize);
      }
    }
  }, [testColor, selectedSize]);

  const sizes = [16, 20, 24, 28, 32, 40, 48, 56, 64];

  // テスト1: div要素 - background-color
  const DivBackgroundTest = ({ size }: { size: number }) => (
    <div
      className="border border-gray-300 rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: testColor
      }}
      title="div + background-color"
    />
  );

  // テスト2: div要素 - border色
  const DivBorderTest = ({ size }: { size: number }) => (
    <div
      className="bg-white rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${Math.max(2, size / 8)}px solid ${testColor}`
      }}
      title="div + border color"
    />
  );

  // テスト3: span要素 - background-color
  const SpanBackgroundTest = ({ size }: { size: number }) => (
    <span
      className="inline-block border border-gray-300 rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: testColor
      }}
      title="span + background-color"
    />
  );

  // テスト4: button要素 - background-color
  const ButtonBackgroundTest = ({ size }: { size: number }) => (
    <button
      className="border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: testColor,
        padding: 0
      }}
      title="button + background-color"
    />
  );

  // テスト5: div要素 - box-shadow
  const DivShadowTest = ({ size }: { size: number }) => (
    <div
      className="bg-white border border-gray-300 rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: `inset 0 0 ${size}px ${testColor}`
      }}
      title="div + box-shadow"
    />
  );

  // テスト6: div要素 - グラデーション
  const DivGradientTest = ({ size }: { size: number }) => (
    <div
      className="border border-gray-300 rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(45deg, ${testColor} 0%, ${testColor} 100%)`
      }}
      title="div + gradient"
    />
  );

  // テスト7: canvas要素
  const CanvasTest = ({ size }: { size: number }) => (
    <canvas
      ref={size === selectedSize ? canvasRef : undefined}
      width={size}
      height={size}
      className="border border-gray-300 rounded"
      title="canvas"
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    />
  );

  // テスト8: SVG要素
  const SvgTest = ({ size }: { size: number }) => (
    <svg
      width={size}
      height={size}
      className="border border-gray-300 rounded"
      title="SVG"
    >
      <rect width={size} height={size} fill={testColor} />
    </svg>
  );

  // テスト9: 擬似要素
  const PseudoElementTest = ({ size }: { size: number }) => (
    <div
      className="border border-gray-300 rounded relative"
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      title="pseudo-element"
    >
      <div
        className="absolute inset-0 rounded"
        style={{
          background: testColor,
          content: '""'
        }}
      />
    </div>
  );

  // テスト10: CSS変数
  const CssVariableTest = ({ size }: { size: number }) => (
    <div
      className="border border-gray-300 rounded"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        '--test-color': testColor,
        backgroundColor: 'var(--test-color)'
      } as React.CSSProperties}
      title="CSS variables"
    />
  );

  const testMethods = [
    { name: 'Div + Background', component: DivBackgroundTest },
    { name: 'Div + Border', component: DivBorderTest },
    { name: 'Span + Background', component: SpanBackgroundTest },
    { name: 'Button + Background', component: ButtonBackgroundTest },
    { name: 'Div + Shadow', component: DivShadowTest },
    { name: 'Div + Gradient', component: DivGradientTest },
    { name: 'Canvas', component: CanvasTest },
    { name: 'SVG', component: SvgTest },
    { name: 'Pseudo Element', component: PseudoElementTest },
    { name: 'CSS Variables', component: CssVariableTest }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>単一色ブロック表示テスト</CardTitle>
        <p className="text-sm text-muted-foreground">
          異なるサイズとコンポーネント手法での色表示をテスト
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* コントロール */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">テスト色:</label>
            <Input
              type="color"
              value={testColor}
              onChange={(e) => setTestColor(e.target.value)}
              className="w-12 h-8"
            />
            <Input
              type="text"
              value={testColor}
              onChange={(e) => setTestColor(e.target.value)}
              className="w-24 text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">サイズ:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-sm"
            >
              {sizes.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>

        {/* 選択サイズでの全手法テスト */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">選択サイズ ({selectedSize}px) での全手法比較</h3>
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            {testMethods.map((method, index) => {
              const Component = method.component;
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <Component size={selectedSize} />
                  <span className="text-xs text-center">{method.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* サイズ別比較（選択手法のみ） */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">サイズ別比較 (Div + Background)</h3>
          <div className="flex flex-wrap gap-4 items-end p-4 bg-gray-50 rounded-lg">
            {sizes.map(size => (
              <div key={size} className="flex flex-col items-center gap-2">
                <DivBackgroundTest size={size} />
                <span className="text-xs">{size}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* 全組み合わせマトリックス */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">全組み合わせマトリックス</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-sm">手法 / サイズ</th>
                  {sizes.map(size => (
                    <th key={size} className="border border-gray-300 p-2 text-sm">{size}px</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {testMethods.map((method, methodIndex) => {
                  const Component = method.component;
                  return (
                    <tr key={methodIndex}>
                      <td className="border border-gray-300 p-2 text-sm font-medium">{method.name}</td>
                      {sizes.map(size => (
                        <td key={size} className="border border-gray-300 p-2 text-center">
                          <div className="flex justify-center">
                            <Component size={size} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 推奨パターン */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">推奨パターン例</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-center mb-2">
                <DivBackgroundTest size={24} />
              </div>
              <p className="text-xs text-center">24px Div</p>
              <p className="text-xs text-center text-muted-foreground">小アイコン</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex justify-center mb-2">
                <ButtonBackgroundTest size={32} />
              </div>
              <p className="text-xs text-center">32px Button</p>
              <p className="text-xs text-center text-muted-foreground">タッチ対応</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex justify-center mb-2">
                <DivBackgroundTest size={48} />
              </div>
              <p className="text-xs text-center">48px Div</p>
              <p className="text-xs text-center text-muted-foreground">メイン表示</p>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex justify-center mb-2">
                <SvgTest size={40} />
              </div>
              <p className="text-xs text-center">40px SVG</p>
              <p className="text-xs text-center text-muted-foreground">高品質</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};