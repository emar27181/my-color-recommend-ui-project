interface IllustratorStatisticsProps {
  data: any;
}

export default function IllustratorStatistics({ data }: IllustratorStatisticsProps) {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">データが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 基本統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">有彩色平均数</h3>
          <p className="text-2xl font-bold text-foreground">
            {data.chromatic_colors_count_ave?.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">無彩色平均数</h3>
          <p className="text-2xl font-bold text-foreground">
            {data.achromatic_colors_count_ave?.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">有彩色率</h3>
          <p className="text-2xl font-bold text-foreground">
            {(data.chromatic_colors_rate_ave * 100)?.toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">無彩色率</h3>
          <p className="text-2xl font-bold text-foreground">
            {(data.achromatic_colors_rate_ave * 100)?.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 平均合成長 */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-medium text-foreground mb-2">平均合成長</h3>
        <p className="text-3xl font-bold text-primary">
          {data.mean_resultant_length_ave?.toFixed(4)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          色の統一性を示す指標（0-1の範囲、1に近いほど統一された色使い）
        </p>
      </div>

      {/* 有彩色数分布 */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-medium text-foreground mb-4">有彩色数分布</h3>
        <div className="space-y-2">
          {data.chromatic_colors_count_distribution?.slice(0, 10).map((count: number, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-8">{index}色:</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(count / Math.max(...data.chromatic_colors_count_distribution)) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 平均合成長分布 */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-medium text-foreground mb-4">平均合成長分布</h3>
        <div className="space-y-2">
          {data.mean_resultant_length_distribution?.slice(0, 10).map((count: number, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12">
                {(index * 0.08).toFixed(2)}-{((index + 1) * 0.08).toFixed(2)}:
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(count / Math.max(...data.mean_resultant_length_distribution)) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 彩度・明度分布（簡略版） */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-medium text-foreground mb-4">彩度・明度分布</h3>
        <div className="grid grid-cols-5 gap-2">
          {data.saturation_lightness_count_distribution?.map((row: number[], rowIndex: number) => (
            <div key={rowIndex} className="space-y-1">
              <span className="text-xs text-muted-foreground">S{rowIndex + 1}</span>
              {row.map((count: number, colIndex: number) => (
                <div key={colIndex} className="relative">
                  <div className="w-full h-8 bg-muted rounded border">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-red-400 h-full rounded opacity-70"
                      style={{ 
                        opacity: count > 0 ? Math.min(count / 200, 1) : 0.1 
                      }}
                    ></div>
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}