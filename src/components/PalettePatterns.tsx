import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const testColors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8000', '#8000FF', '#0080FF', '#80FF00', '#FF0080', '#00FF80',
  '#FF4040', '#40FF40', '#4040FF', '#FFFF40', '#FF40FF', '#40FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'
];

export const PalettePatterns = () => {
  const [selectedPattern, setSelectedPattern] = useState<number>(1);

  // パターン1: シンプルなグリッドパレット
  const Pattern1 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン1: シンプルなグリッドパレット</h3>
      <div className="grid grid-cols-8 gap-1 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  // パターン2: グラデーション付きパレット
  const Pattern2 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン2: グラデーション付きパレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              background: `linear-gradient(45deg, ${color} 0%, ${color}80 50%, ${color} 100%)`,
              boxShadow: `0 2px 8px ${color}40`
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  // パターン3: ボーダーメインパレット
  const Pattern3 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン3: ボーダーメインパレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-white rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              border: `4px solid ${color}`,
              boxShadow: `inset 0 0 8px ${color}30, 0 0 4px ${color}50`
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  // パターン4: 重ねボーダーパレット
  const Pattern4 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン4: 重ねボーダーパレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-white rounded cursor-pointer hover:scale-110 transition-transform relative"
            style={{ 
              border: `2px solid ${color}`,
              boxShadow: `0 0 0 1px white, 0 0 0 3px ${color}80`
            }}
            title={color}
          >
            <div 
              className="absolute inset-1 rounded"
              style={{ backgroundColor: `${color}20` }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // パターン5: CSS変数パレット
  const Pattern5 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン5: CSS変数パレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded cursor-pointer hover:scale-110 transition-transform border-2 border-gray-300"
            style={{ 
              '--color': color,
              background: `var(--color)`,
              borderColor: color
            } as React.CSSProperties}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  // パターン6: 二重四角パレット
  const Pattern6 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン6: 二重四角パレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 p-1 cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          >
            <div 
              className="w-full h-full border-2 border-white"
              style={{ backgroundColor: `${color}80` }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // パターン7: 影メインパレット
  const Pattern7 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン7: 影メインパレット</h3>
      <div className="grid grid-cols-8 gap-3 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-white rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              boxShadow: `0 0 0 2px ${color}, 0 4px 8px ${color}60, inset 0 0 8px ${color}30`
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  // パターン8: ストライプパレット
  const Pattern8 = () => (
    <div className="space-y-3">
      <h3 className="font-semibold">パターン8: ストライプパレット</h3>
      <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 rounded-lg">
        {testColors.map((color, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              background: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 4px, white 4px, white 6px, ${color} 6px, ${color} 10px)`,
              border: `1px solid ${color}`
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  const patterns = [
    { id: 1, name: 'シンプル', component: Pattern1 },
    { id: 2, name: 'グラデーション', component: Pattern2 },
    { id: 3, name: 'ボーダー', component: Pattern3 },
    { id: 4, name: '重ねボーダー', component: Pattern4 },
    { id: 5, name: 'CSS変数', component: Pattern5 },
    { id: 6, name: '二重四角', component: Pattern6 },
    { id: 7, name: '影メイン', component: Pattern7 },
    { id: 8, name: 'ストライプ', component: Pattern8 }
  ];

  const ActivePattern = patterns.find(p => p.id === selectedPattern)?.component || Pattern1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>四角いパレット表示パターン試作</CardTitle>
        <p className="text-sm text-muted-foreground">
          異なる表示手法でのパレットパターンをテストできます
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* パターン選択ボタン */}
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern) => (
            <Button
              key={pattern.id}
              variant={selectedPattern === pattern.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPattern(pattern.id)}
            >
              {pattern.name}
            </Button>
          ))}
        </div>

        {/* 選択されたパターンの表示 */}
        <div className="border rounded-lg p-4">
          <ActivePattern />
        </div>

        {/* 全パターン一覧表示 */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">全パターン一覧</h3>
          <Pattern1 />
          <Pattern2 />
          <Pattern3 />
          <Pattern4 />
          <Pattern5 />
          <Pattern6 />
          <Pattern7 />
          <Pattern8 />
        </div>
      </CardContent>
    </Card>
  );
};