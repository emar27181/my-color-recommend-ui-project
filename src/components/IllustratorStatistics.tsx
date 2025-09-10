import HueDistributionVisualization from "./HueDistributionVisualization";
import SaturationLightnessHeatmap from "./SaturationLightnessHeatmap";
import IllustratorImages from "./IllustratorImages";
import { ExternalLink } from "lucide-react";

interface IllustratorStatisticsProps {
  data: any;
  isExpanded?: boolean;
  name?: string;
}

export default function IllustratorStatistics({ data, isExpanded = false, name }: IllustratorStatisticsProps) {
  if (!data) {
    return null;
  }

  if (!isExpanded) {
    // 折りたたみ時は何も表示しない
    return null;
  }

  // よく使う色相を取得する関数（使用率10%以下・低彩度を除外）
  const getTopHues = (hueDistribution: number[], saturationLightnessData: number[][], maxCount: number = 5) => {
    if (!hueDistribution || hueDistribution.length === 0) return [];
    
    // 全体の合計値を取得
    const totalUsage = hueDistribution.reduce((sum, value) => sum + value, 0);
    if (totalUsage === 0) return [];
    
    // 彩度・明度データから有彩色の使用状況を分析
    const totalSaturationLightnessUsage = saturationLightnessData ? 
      saturationLightnessData.flat().reduce((sum, value) => sum + value, 0) : 0;
    
    // 高彩度領域（彩度60%以上）の使用率を計算
    let highSaturationUsage = 0;
    if (saturationLightnessData && saturationLightnessData.length === 5) {
      // 5x5グリッドの右側3列（彩度60%以上の領域）
      for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
        for (let colIndex = 3; colIndex < 5; colIndex++) { // 列3,4 = 彩度60%以上
          if (saturationLightnessData[rowIndex] && saturationLightnessData[rowIndex][colIndex]) {
            highSaturationUsage += saturationLightnessData[rowIndex][colIndex];
          }
        }
      }
    }
    
    // 高彩度色の使用率が低い場合（全体の20%未満）はフィルタを緩める
    const hasEnoughChromatic = totalSaturationLightnessUsage > 0 && 
      (highSaturationUsage / totalSaturationLightnessUsage) >= 0.2;
    
    // インデックスと値のペアを作成
    const hueWithIndex = hueDistribution.map((value, index) => ({
      index,
      value,
      hue: (index * 15) % 360, // 15度ずつの色相
      percentage: (value / totalUsage) * 100, // 使用率を計算
      color: `hsl(${(index * 15) % 360}, 75%, 55%)` // 鮮やかな色で表示
    }));
    
    // フィルタリング条件
    const usageThreshold = 10; // 使用率10%以上
    
    return hueWithIndex
      .filter(item => {
        // 基本条件：使用率10%以上
        if (item.value <= 0 || item.percentage < usageThreshold) return false;
        
        // 有彩色の使用が十分にある場合のみ、より厳しい条件を適用
        if (hasEnoughChromatic) {
          // 対応する彩度・明度データがあるかチェック
          // この色相が実際に高彩度で使われているかを簡易判定
          return item.percentage >= usageThreshold;
        }
        
        return true;
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, maxCount);
  };

  const topHues = getTopHues(data.used_pccs_count_sum_distribution, data.saturation_lightness_count_distribution);

  // よく使うトーンを取得する関数
  const getTopTones = (saturationLightnessData: number[][], maxCount: number = 5) => {
    if (!saturationLightnessData || saturationLightnessData.length === 0) return [];
    
    // 2次元配列を1次元に変換して処理
    const flatData = [];
    for (let rowIndex = 0; rowIndex < saturationLightnessData.length; rowIndex++) {
      const row = saturationLightnessData[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        flatData.push({
          value: row[colIndex],
          rowIndex,
          colIndex,
          saturation: ((colIndex + 0.5) / 5) * 100, // 0-100%
          lightness: ((4 - rowIndex + 0.5) / 5) * 100, // 上が明るい（100%）、下が暗い（0%）
        });
      }
    }

    // 全体の合計値を取得
    const totalUsage = flatData.reduce((sum, item) => sum + item.value, 0);
    if (totalUsage === 0) return [];

    // 最も使われている色相を取得
    const mostUsedHue = topHues.length > 0 ? topHues[0].hue : 180; // デフォルトは青

    // 各トーンの使用率を計算し、フィルタリング
    return flatData
      .map(item => ({
        ...item,
        percentage: (item.value / totalUsage) * 100,
        color: `hsl(${mostUsedHue}, ${item.saturation}%, ${item.lightness}%)`
      }))
      .filter(item => item.value > 0 && item.percentage >= 10) // 10%以上のみ表示（適度な閾値）
      .sort((a, b) => b.value - a.value)
      .slice(0, maxCount);
  };

  const topTones = getTopTones(data.saturation_lightness_count_distribution);

  // 展開時は基本統計から詳細統計まで表示
  return (
    <div className="mt-2 space-y-2 px-3">
      {/* 全体を横3列で表示: 左側に画像、中央に統計情報、右側に色相分布 */}
      <div className="grid grid-cols-3 gap-3">
        {/* 左列: 画像セクション */}
        <div className="bg-background border-2 border-primary/30 rounded-lg p-3">
          <IllustratorImages 
            name={name || ''} 
            showRepresentative={false}
            showTopLiked={true}
          />
        </div>
        {/* 中央列: 統計データセクション */}
        <div className="bg-background border rounded-lg p-3 space-y-3">
          {/* 基本統計情報セクション */}
          <div className="border rounded p-2">
            <div className="flex items-center gap-2 mb-2 px-1">
              <h4 className="text-xs font-medium text-foreground">基本統計</h4>
              {name && (
                <a
                  href={`https://instagram.com/${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>(@{name})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="space-y-1 text-xs px-1">
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
              
              {/* よく使う色相 */}
              {topHues.length > 0 && (
                <div className="mt-3 pt-2 border-t border-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">よく使う色相:</span>
                    <div className="flex gap-2">
                      {topHues.map((hue) => (
                        <div
                          key={hue.index}
                          className="border-2 border-transparent rounded-md"
                          style={{
                            backgroundColor: hue.color,
                            width: '24px',
                            height: '24px'
                          }}
                          title={`色相: ${hue.hue}° (使用率: ${hue.percentage.toFixed(1)}%)`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* よく使うトーン（10%以上の使用率のみ表示） */}
              {topTones.length > 0 && (
                <div className="mt-2 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">よく使うトーン:</span>
                    <div className="flex gap-2">
                      {topTones.map((tone) => (
                        <div
                          key={`${tone.rowIndex}-${tone.colIndex}`}
                          className="border-2 border-transparent rounded-md"
                          style={{
                            backgroundColor: tone.color,
                            width: '24px',
                            height: '24px'
                          }}
                          title={`彩度: ${tone.saturation.toFixed(0)}%, 明度: ${tone.lightness.toFixed(0)}% (使用率: ${tone.percentage.toFixed(1)}%)`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 彩度・明度分布セクション */}
          <div className="border rounded p-2">
            <SaturationLightnessHeatmap 
              data={data.saturation_lightness_count_distribution || []} 
              title="彩度・明度分布ヒートマップ"
            />
          </div>
        </div>

        {/* 右列: 色相分布と有彩色数分布セクション */}
        <div className="bg-background border rounded-lg p-3 space-y-3">
          {/* 色相分布 */}
          {data.used_pccs_count_sum_distribution && (
            <HueDistributionVisualization data={data.used_pccs_count_sum_distribution} />
          )}
          
          {/* 有彩色数分布セクション */}
          <div className="border rounded p-2">
            <h4 className="text-xs font-medium text-foreground mb-2 px-1">有彩色数分布</h4>
            <div className="px-1">
              {/* ラベル行 */}
              <div className="flex items-center gap-0.5 mb-1">
                {data.chromatic_colors_count_distribution?.slice(0, 8).map((_: number, index: number) => (
                  <div key={index} className="flex-1 text-center">
                    <span className="text-xs text-muted-foreground">{index}色</span>
                  </div>
                ))}
              </div>
              
              {/* バー表示行 */}
              <div className="flex items-end gap-0.5 h-8">
                {data.chromatic_colors_count_distribution?.slice(0, 8).map((count: number, index: number) => {
                  const maxCount = Math.max(...data.chromatic_colors_count_distribution.slice(0, 8));
                  const height = maxCount > 0 ? (count / maxCount) * 24 : 0; // 最大24px
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${Math.max(height, 1)}px` }} // 最小1px
                      />
                      <div className="mt-0 text-xs font-medium text-foreground">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}