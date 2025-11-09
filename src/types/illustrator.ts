export interface IllustratorStatistics {
  illustrator_name: string;
  chromatic_colors_count_ave: number;
  achromatic_colors_count_ave: number;
  chromatic_colors_rate_ave: number;
  achromatic_colors_rate_ave: number;
  chromatic_colors_count_distribution: number[];
  used_pccs_count_sum_distribution: number[];
  mean_resultant_length_ave: number;
  mean_resultant_length_distribution: number[];
  saturation_lightness_count_distribution: number[][];
}

export type IllustratorData = IllustratorStatistics[];