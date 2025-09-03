/**
 * イラストレーター統計データを取得
 */
export async function getIllustratorData() {
  try {
    const response = await fetch('/statistics_for_illustrators.json');
    if (!response.ok) {
      console.warn('Could not fetch statistics file, using fallback data');
      return getFallbackData();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Error loading statistics data, using fallback:', error);
    return getFallbackData();
  }
}

// フォールバックデータ（最初の3つのイラストレーターのサンプル）
function getFallbackData() {
  return [
    {
      "illustrator_name": "test_one_photo",
      "chromatic_colors_count_ave": 4.828282828282828,
      "achromatic_colors_count_ave": 1.9393939393939394,
      "chromatic_colors_rate_ave": 0.45903702481597164,
      "achromatic_colors_rate_ave": 0.5409629751840284,
      "chromatic_colors_count_distribution": [2, 3, 10, 9, 19, 15, 22, 11, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "used_pccs_count_sum_distribution": [0, 40, 16, 30, 26, 15, 5, 8, 2, 2, 4, 4, 6, 11, 25, 33, 53, 27, 27, 23, 23, 15, 27, 27, 31],
      "mean_resultant_length_ave": 0.4973878303002137,
      "mean_resultant_length_distribution": [8, 3, 6, 12, 3, 7, 8, 16, 8, 8, 14, 2, 2],
      "saturation_lightness_count_distribution": [[13, 36, 36, 24, 0], [36, 155, 147, 95, 5], [45, 160, 246, 318, 45], [19, 133, 200, 127, 16], [11, 39, 32, 13, 0]]
    },
    {
      "illustrator_name": "mika_pikazo_mpz",
      "chromatic_colors_count_ave": 4.828282828282828,
      "achromatic_colors_count_ave": 1.9393939393939394,
      "chromatic_colors_rate_ave": 0.45903702481597164,
      "achromatic_colors_rate_ave": 0.5409629751840284,
      "chromatic_colors_count_distribution": [2, 3, 10, 9, 19, 15, 22, 11, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "used_pccs_count_sum_distribution": [0, 40, 16, 30, 26, 15, 5, 8, 2, 2, 4, 4, 6, 11, 25, 33, 53, 27, 27, 23, 23, 15, 27, 27, 31],
      "mean_resultant_length_ave": 0.4973878303002137,
      "mean_resultant_length_distribution": [8, 3, 6, 12, 3, 7, 8, 16, 8, 8, 14, 2, 2],
      "saturation_lightness_count_distribution": [[13, 36, 36, 24, 0], [36, 155, 147, 95, 5], [45, 160, 246, 318, 45], [19, 133, 200, 127, 16], [11, 39, 32, 13, 0]]
    },
    {
      "illustrator_name": "harunonioikaze",
      "chromatic_colors_count_ave": 2.1313131313131315,
      "achromatic_colors_count_ave": 1.8585858585858586,
      "chromatic_colors_rate_ave": 0.6436272100850331,
      "achromatic_colors_rate_ave": 0.3563727899149669,
      "chromatic_colors_count_distribution": [0, 19, 53, 22, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "used_pccs_count_sum_distribution": [0, 64, 5, 5, 2, 1, 0, 0, 0, 1, 0, 0, 3, 4, 96, 8, 5, 1, 0, 0, 0, 0, 0, 7, 12],
      "mean_resultant_length_ave": 0.3501488018074992,
      "mean_resultant_length_distribution": [18, 0, 0, 0, 0, 0, 2, 4, 15, 9, 32, 17, 2],
      "saturation_lightness_count_distribution": [[6, 19, 10, 2, 0], [73, 94, 66, 37, 4], [82, 196, 147, 62, 3], [49, 106, 107, 55, 3], [20, 34, 16, 3, 0]]
    }
  ];
}

/**
 * イラストレーター名の一覧を取得
 */
export async function getIllustratorNames(): Promise<string[]> {
  const data = await getIllustratorData();
  return data.map((item: any) => item.illustrator_name);
}

/**
 * 指定したイラストレーターの統計データを取得
 */
export async function getIllustratorStatistics(name: string) {
  const data = await getIllustratorData();
  return data.find((item: any) => item.illustrator_name === name);
}