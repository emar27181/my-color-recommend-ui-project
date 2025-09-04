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
  
  // デバッグ: 色生成とスケーリングをテスト
  console.log('HueDistribution data:', data);
  console.log('Normalized data:', normalizedData);
  console.log('Sample heights:', normalizedData.slice(0, 5).map(value => Math.max(Math.pow(value / 100, 0.5) * 90, 8)));
  console.log('Sample colors:', Array.from({length: 5}, (_, i) => generateHueColor(i)));

  return (
    <div>
      <h4 className="text-base font-medium text-foreground mb-4">色相使用分布</h4>
      
      {/* 色相環形式の表示 */}
      <div className="mb-6">
        <div className="relative w-full h-80 flex items-end justify-center">
          {/* 背景の色相環 */}
          <div className="absolute bottom-0 w-full h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 opacity-20"></div>
          
          {/* データバー */}
          <div className="relative w-full h-full flex items-end justify-between px-2">
            {normalizedData.map((value, index) => (
              <div key={index} className="flex flex-col items-center group relative">
                <div 
                  className="w-3 rounded-t-sm transition-all duration-300" 
                  style={{ 
                    height: `${Math.max(Math.pow(value / 100, 0.5) * 90, 8)}%`, // 非線形スケーリング（べき乗）で高さのみで差を強調
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

      {/* 詳細分布を横一列で表示 */}
      <div>
        <h5 className="text-sm font-medium text-foreground mb-3">詳細分布</h5>
        <div className="flex justify-center items-end gap-0">
          {normalizedData.map((value, index) => {
            if (value < 1) return null; // 値が小さいものは表示しない
            
            return (
              <div key={index} className="group relative">
                <div 
                  className="w-6 flex flex-col items-center"
                  style={{ 
                    height: `${Math.max(value * 2, 20)}px`, // 高さで使用量を表現（最小20px）
                    backgroundColor: generateHueColor(index),
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                ></div>
                
                {/* ツールチップ */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-background border rounded px-2 py-1 text-xs whitespace-nowrap z-10 left-1/2 transform -translate-x-1/2">
                  <div className="text-center">
                    <div className="font-medium">使用数: {data[index]}</div>
                    <div className="text-muted-foreground">色相: {(index * 15)}°</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}