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
    return `hsl(${hue}, 70%, 60%)`; // 彩度70%, 明度60%で統一
  };

  // データの最大値を取得してスケーリング
  const maxValue = Math.max(...data);
  const normalizedData = data.map(value => (value / maxValue) * 100);

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
                  className="w-3 rounded-t-sm transition-all duration-300 hover:w-4"
                  style={{ 
                    height: `${Math.max(value * 0.8, 2)}%`,
                    backgroundColor: generateHueColor(index),
                    opacity: value > 0 ? 0.8 : 0.2
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
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: generateHueColor(index) }}
              ></div>
              <span className="text-sm text-muted-foreground w-12">{index * 15}°</span>
              
              {/* ヴァイオリン風の形状 */}
              <div className="flex-1 relative h-6 bg-muted/20 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${generateHueColor(index)}80, ${generateHueColor(index)}40)`
                  }}
                ></div>
                
                {/* 中央の密度表現 */}
                <div 
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 h-4 rounded-full"
                  style={{
                    width: `${value}%`,
                    background: `radial-gradient(ellipse at center, ${generateHueColor(index)} 0%, transparent 70%)`,
                    opacity: 0.6
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