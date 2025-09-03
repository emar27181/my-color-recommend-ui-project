interface HueDistributionVisualizationProps {
  data: number[]; // 色相分布データ (used_pccs_count_sum_distribution)
}

export default function HueDistributionVisualization({ data }: HueDistributionVisualizationProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // 色相を24分割（15度ずつ）に対応する色を生成
  const generateHueColor = (index: number) => {
    const hue = (index * 15) % 360; // 15度ずつの色相
    return `hsl(${hue}, 80%, 55%)`; // 彩度80%, 明度55%で鮮やか統一
  };

  // データの最大値を取得してスケーリング
  const maxValue = Math.max(...data);
  const normalizedData = data.map(value => (value / maxValue) * 100);
  
  // デバッグ: 色生成をテスト
  console.log('HueDistribution data:', data);
  console.log('Sample colors:', Array.from({length: 5}, (_, i) => generateHueColor(i)));

  return (
    <div>
      <h4 className="text-base font-medium text-foreground mb-4">色相使用分布</h4>
      
      {/* 色相環形式の表示 */}
      <div className="mb-6">
        <div className="relative w-full h-40 flex items-end justify-center">
          {/* 背景の色相環 */}
          <div className="absolute bottom-0 w-full h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 opacity-20"></div>
          
          {/* データバー */}
          <div className="relative w-full h-full flex items-end justify-between px-2">
            {normalizedData.map((value, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div 
                  className="rounded-t-sm transition-all duration-300"
                  style={{ 
                    height: `${Math.max(value * 0.8, 2)}%`,
                    width: `${Math.max(value * 0.15, 2)}px`, // 幅も分布に応じて変化（最小2px、最大約15px）
                    backgroundColor: generateHueColor(index),
                    opacity: value > 0 ? 1 : 0.3,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                ></div>
                
                {/* ツールチップ */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-background border rounded px-2 py-1 text-xs whitespace-nowrap z-10">
                  <div className="text-center">
                    <div className="font-medium">{data[index]}</div>
                    <div className="text-muted-foreground">{(index * 15)}°</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 色相ラベル */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0° (赤)</span>
          <span>90° (黄)</span>
          <span>180° (緑)</span>
          <span>270° (青)</span>
          <span>360° (赤)</span>
        </div>
      </div>

      {/* ヴァイオリン図風の表示 */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-foreground">詳細分布</h5>
        {normalizedData.map((value, index) => {
          if (value < 1) return null; // 値が小さいものは表示しない
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="rounded-full flex-shrink-0"
                style={{ 
                  width: `${Math.max(value * 0.2, 8)}px`, // 分布に応じてサイズ変化（最小8px、最大約20px）
                  height: `${Math.max(value * 0.2, 8)}px`,
                  backgroundColor: generateHueColor(index),
                  border: '2px solid rgba(0,0,0,0.2)'
                }}
              ></div>
              <span className="text-sm text-muted-foreground w-12">{index * 15}°</span>
              
              {/* ヴァイオリン風の形状 */}
              <div 
                className="flex-1 relative bg-muted/20 rounded-full overflow-hidden"
                style={{
                  height: `${Math.max(value * 0.3, 6)}px` // 分布に応じて高さも変化（最小6px、最大約30px）
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${value}%`,
                    backgroundColor: generateHueColor(index),
                    opacity: 0.7
                  }}
                ></div>
                
                {/* 中央の密度表現 */}
                <div 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 rounded-full"
                  style={{
                    width: `${value}%`,
                    height: `${Math.max(value * 0.2, 4)}px`, // バーと連動して高さ変化
                    backgroundColor: generateHueColor(index),
                    opacity: 0.5,
                    filter: 'blur(1px)'
                  }}
                ></div>
              </div>
              
              <span className="text-sm font-medium text-foreground w-8">{data[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}