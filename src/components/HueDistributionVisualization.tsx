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
      <h4 className="text-base font-medium text-foreground mb-2">色相使用分布</h4>
      
      {/* 円環形式で色相分布を表示 */}
      <div className="flex justify-center -my-2">
        <svg width="300" height="300" viewBox="0 0 300 300" className="transform -rotate-90">
          {normalizedData.map((value, index) => {
            // 値が0の場合は高さ0で表示、それ以外は最小値を保証
            const height = value === 0 ? 0 : Math.max(value * 0.8, 8);
            
            // 24分割の角度計算（15度ずつ）
            const angle = (index * 15) * (Math.PI / 180);
            const innerRadius = 30; // 60から30に縮小
            const outerRadius = innerRadius + height;
            
            // セクターの開始・終了角度（15度幅）
            const startAngle = angle - (7.5 * Math.PI / 180);
            const endAngle = angle + (7.5 * Math.PI / 180);
            
            // セクターのパス計算
            const x1 = 150 + innerRadius * Math.cos(startAngle);
            const y1 = 150 + innerRadius * Math.sin(startAngle);
            const x2 = 150 + outerRadius * Math.cos(startAngle);
            const y2 = 150 + outerRadius * Math.sin(startAngle);
            const x3 = 150 + outerRadius * Math.cos(endAngle);
            const y3 = 150 + outerRadius * Math.sin(endAngle);
            const x4 = 150 + innerRadius * Math.cos(endAngle);
            const y4 = 150 + innerRadius * Math.sin(endAngle);
            
            const largeArcFlag = 0; // 15度なので常に小さい弧
            
            const pathData = height > 0 ? 
              `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}` :
              '';
            
            return height > 0 ? (
              <g key={index} className="group">
                <path
                  d={pathData}
                  fill={generateHueColor(index)}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="0.5"
                />
                
                {/* ツールチップトリガー用の透明セクター */}
                <path
                  d={`M 150 150 L ${x1} ${y1} A ${innerRadius + 40} ${innerRadius + 40} 0 ${largeArcFlag} 1 ${x4} ${y4} Z`}
                  fill="transparent"
                  className="cursor-pointer"
                />
                
                {/* ツールチップ - SVG内では表示が困難なため簡略化 */}
              </g>
            ) : null;
          })}
          
          {/* 中心円 */}
          <circle cx="150" cy="150" r="30" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
      </div>
      
    </div>
  );
}