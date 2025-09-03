interface IllustratorStatisticsProps {
  data: any;
  isExpanded?: boolean;
}

export default function IllustratorStatistics({ data, isExpanded = false }: IllustratorStatisticsProps) {
  if (!data) {
    return null;
  }

  if (!isExpanded) {
    // 折りたたみ時は何も表示しない
    return null;
  }

  // 展開時は基本統計から詳細統計まで表示
  return (
    <div className="mt-4 space-y-6">
      {/* 基本統計情報（展開時の最初の表示） */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">有彩色: </span>
          <span className="font-medium">{data.chromatic_colors_count_ave?.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">無彩色: </span>
          <span className="font-medium">{data.achromatic_colors_count_ave?.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">有彩色率: </span>
          <span className="font-medium">{(data.chromatic_colors_rate_ave * 100)?.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-muted-foreground">統一性: </span>
          <span className="font-medium">{data.mean_resultant_length_ave?.toFixed(3)}</span>
        </div>
      </div>

      {/* 詳細統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {data.chromatic_colors_count_ave?.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">有彩色平均数</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {data.achromatic_colors_count_ave?.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">無彩色平均数</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {(data.chromatic_colors_rate_ave * 100)?.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">有彩色率</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {data.mean_resultant_length_ave?.toFixed(4)}
          </p>
          <p className="text-sm text-muted-foreground">色統一性指標</p>
        </div>
      </div>

      {/* 有彩色数分布 */}
      <div>
        <h4 className="text-base font-medium text-foreground mb-3">有彩色数分布</h4>
        <div className="space-y-2">
          {data.chromatic_colors_count_distribution?.slice(0, 8).map((count: number, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-8">{index}色</span>
              <div className="flex-1 bg-muted/50 rounded-full h-2">
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

      {/* 彩度・明度分布（簡略版） */}
      <div>
        <h4 className="text-base font-medium text-foreground mb-3">彩度・明度分布</h4>
        <div className="grid grid-cols-5 gap-1">
          {data.saturation_lightness_count_distribution?.map((row: number[], rowIndex: number) => (
            <div key={rowIndex} className="space-y-1">
              <span className="text-xs text-muted-foreground text-center block">S{rowIndex + 1}</span>
              {row.map((count: number, colIndex: number) => (
                <div key={colIndex} className="relative h-6 bg-muted/30 rounded text-center">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-red-400 h-full rounded"
                    style={{ 
                      opacity: count > 0 ? Math.min(count / 150, 0.8) : 0.1 
                    }}
                  ></div>
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