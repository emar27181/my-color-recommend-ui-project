import HueDistributionVisualization from "./HueDistributionVisualization";
import SaturationLightnessHeatmap from "./SaturationLightnessHeatmap";
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

  // 展開時は基本統計から詳細統計まで表示
  return (
    <div className="mt-2 space-y-2 px-3">
      {/* 全体を横二列で表示: 左側に統計情報、右側に色相分布 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 左列: 統計データセクション */}
        <div className="bg-background border rounded p-3 space-y-3">
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
        <div className="bg-background border rounded p-3 space-y-3">
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
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div
                        className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 relative"
                        style={{ height: `${Math.max(height, 1)}px` }} // 最小1px
                      >
                        {/* ツールチップ */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-popover border rounded px-1 py-0.5 text-xs whitespace-nowrap z-10 left-1/2 transform -translate-x-1/2">
                          <div className="text-center">
                            <div className="font-medium">{index}色: {count}作品</div>
                          </div>
                        </div>
                      </div>
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