import HueDistributionVisualization from "./HueDistributionVisualization";

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


      {/* 有彩色数分布（横表示） */}
      <div>
        <h4 className="text-base font-medium text-foreground mb-3">有彩色数分布</h4>
        <div className="bg-background border rounded-lg p-4">
          {/* ラベル行 */}
          <div className="flex items-center gap-1 mb-2">
            {data.chromatic_colors_count_distribution?.slice(0, 8).map((count: number, index: number) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">{index}色</span>
              </div>
            ))}
          </div>
          
          {/* バー表示行 */}
          <div className="flex items-end gap-1 h-20">
            {data.chromatic_colors_count_distribution?.slice(0, 8).map((count: number, index: number) => {
              const maxCount = Math.max(...data.chromatic_colors_count_distribution.slice(0, 8));
              const height = maxCount > 0 ? (count / maxCount) * 60 : 0; // 最大60px
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 relative"
                    style={{ height: `${Math.max(height, 2)}px` }} // 最小2px
                  >
                    {/* ツールチップ */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover border rounded px-2 py-1 text-xs whitespace-nowrap z-10 left-1/2 transform -translate-x-1/2">
                      <div className="text-center">
                        <div className="font-medium">{index}色: {count}作品</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs font-medium text-foreground">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 色相分布（色付き可視化） */}
      {data.used_pccs_count_sum_distribution && (
        <HueDistributionVisualization data={data.used_pccs_count_sum_distribution} />
      )}

      {/* 彩度・明度分布（ヒートマップ） */}
      <div>
        <h4 className="text-base font-medium text-foreground mb-3">彩度・明度分布</h4>
        
        {/* ヒートマップ表示 */}
        <div className="bg-background border rounded-lg p-4">
          
          {/* ヒートマップグリッド */}
          <div className="space-y-1">
            {data.saturation_lightness_count_distribution?.map((row: number[], rowIndex: number) => {
              // 最大値を計算してスケーリング
              const maxInRow = Math.max(...row, 1);
              const globalMax = Math.max(...data.saturation_lightness_count_distribution.flat(), 1);
              
              return (
                <div key={rowIndex} className="flex items-center gap-1">
                  {/* ヒートマップセル */}
                  <div className="w-full grid grid-cols-5 gap-1">
                    {row.map((count: number, colIndex: number) => {
                      // 実際の彩度明度値を計算（0-1の範囲）
                      const saturation = (rowIndex + 1) / 5; // S1=0.2, S2=0.4, ..., S5=1.0
                      const lightness = (colIndex + 1) / 5;  // L1=0.2, L2=0.4, ..., L5=1.0
                      
                      // 色相0度（赤）固定でHSLカラーを生成
                      const actualColor = `hsl(0, ${saturation * 100}%, ${lightness * 100}%)`;
                      
                      // ヒート強度を計算（使用量による透明度）
                      const intensity = count / globalMax;
                      const overlayOpacity = intensity > 0 ? Math.max(intensity * 0.4, 0.1) : 0;
                      
                      return (
                        <div
                          key={colIndex}
                          className="group relative h-8 rounded border border-border/50 flex items-center justify-center transition-all duration-200 hover:scale-105 overflow-hidden"
                          style={{ backgroundColor: actualColor }}
                        >
                          {/* 使用量オーバーレイ */}
                          {intensity > 0 && (
                            <div 
                              className="absolute inset-0 bg-blue-500 pointer-events-none"
                              style={{ opacity: overlayOpacity }}
                            ></div>
                          )}
                          
                          {/* 数値表示 */}
                          <span 
                            className="relative z-10 text-xs font-medium transition-colors drop-shadow-sm"
                            style={{ 
                              color: lightness > 0.5 ? '#000000' : '#ffffff', // 明度に応じてテキスト色を調整
                              textShadow: lightness > 0.5 ? 'none' : '0 0 2px rgba(0,0,0,0.8)'
                            }}
                          >
                            {count > 0 ? count : ''}
                          </span>
                          
                          {/* ツールチップ */}
                          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover border rounded px-2 py-1 text-xs whitespace-nowrap z-20">
                            <div className="text-center">
                              <div className="font-medium">使用数: {count}</div>
                              <div className="text-xs text-muted-foreground">
                                彩度: {(saturation * 100).toFixed(0)}%, 明度: {(lightness * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
}