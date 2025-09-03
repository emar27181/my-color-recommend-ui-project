// イラストレーター統計データ（統計データから名前のみ抽出）
const ILLUSTRATOR_NAMES = [
  "test_one_photo",
  "mika_pikazo_mpz",
  "harunonioikaze",
  "gaako_illust",
  "mokmok_skd",
  "nest_virgo",
  "omrice4869",
  "oz_yarimasu",
  "sa_ka_na_4",
  "trcoot",
  "birdstory_pic",
  "amao_1015",
  "meeesuke_",
  "shirokumaai",
  "tsumugitopan",
  "sexygirl.jp",
  "obungu_mofumofu",
  "skt2ing",
  "iina.gram",
  "chi_bee.official",
  "harupeipei",
  "bj00100",
  "jerome_trez_oudot",
  "deppa_53"
];

/**
 * イラストレーター統計データを取得
 */
export function getIllustratorData() {
  // 現在は名前のみのダミーデータを返す
  return ILLUSTRATOR_NAMES.map(name => ({
    illustrator_name: name,
    chromatic_colors_count_ave: 0,
    achromatic_colors_count_ave: 0,
    chromatic_colors_rate_ave: 0,
    achromatic_colors_rate_ave: 0,
    chromatic_colors_count_distribution: [],
    used_pccs_count_sum_distribution: [],
    mean_resultant_length_ave: 0,
    mean_resultant_length_distribution: [],
    saturation_lightness_count_distribution: []
  }));
}

/**
 * イラストレーター名の一覧を取得
 */
export function getIllustratorNames(): string[] {
  return ILLUSTRATOR_NAMES;
}

/**
 * 指定したイラストレーターの統計データを取得
 */
export function getIllustratorStatistics(name: string) {
  const data = getIllustratorData();
  return data.find(item => item.illustrator_name === name);
}