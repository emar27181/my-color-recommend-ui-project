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
      
      {/* 詳細分布をメイン表示に */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-end gap-0 min-w-max">
          {normalizedData.map((value, index) => {
            // 値が0の場合は高さ0で表示、それ以外は最小10pxを保証
            const height = value === 0 ? 0 : Math.max(value * 1, 10);
            
            return (
              <div key={index} className="group relative">
                <div 
                  className="flex-shrink-0 flex flex-col items-center"
                  style={{ 
                    width: '20px', // より細い幅に変更
                    height: `${height}px`, // 0の場合は高さ0、それ以外は最小10px
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