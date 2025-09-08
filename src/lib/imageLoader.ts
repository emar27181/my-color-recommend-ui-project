/**
 * 実際のファイル名で画像を検索・取得するユーティリティ
 */

// 各イラストレーターのTOP3画像のマッピング
const TOP_LIKED_IMAGES_MAP: Record<string, string[]> = {};

/**
 * 画像マッピングを初期化（実際のファイル名を使用）
 */
export const initializeImageMapping = async () => {
  // 実際の画像ファイル名をここに追加
  // サーバーサイドではファイルシステムから読み取る必要があるため、
  // クライアントサイドでは事前定義または API経由で取得
  
  const knownMappings = {
    '_oco_me_': [
      'rank_01_98939_likes_2022-07-18_06-05-37_UTC.jpg',
      'rank_02_66865_likes_2022-09-08_05-29-56_UTC.jpg',
      'rank_03_44851_likes_2022-09-30_14-40-03_UTC.jpg',
    ],
    '_yukoring': [
      'rank_01_33141_likes_2024-07-20_07-26-53_UTC.jpg',
      'rank_02_24365_likes_2024-09-09_06-44-02_UTC.jpg',
      'rank_03_22545_likes_2024-09-17_10-55-42_UTC.jpg',
    ],
    'amao_1015': [
      'rank_01_02249_likes_2021-03-27_12-31-09_UTC.jpg',
      'rank_02_01897_likes_2022-01-01_02-39-25_UTC.jpg',
      'rank_03_01850_likes_2022-01-09_12-29-08_UTC.jpg',
    ],
    'birdstory_pic': [
      'rank_01_10793_likes_2024-11-23_23-11-39_UTC.jpg',
      'rank_02_07552_likes_2024-11-20_11-49-05_UTC.jpg',
      'rank_03_03776_likes_2024-12-24_22-18-57_UTC.jpg',
    ],
    'bj00100': [
      'rank_01_59074_likes_2024-04-19_19-36-43_UTC.jpg',
      'rank_02_55488_likes_2024-05-24_13-16-23_UTC.jpg',
      'rank_03_47863_likes_2024-08-04_13-59-39_UTC.jpg',
    ],
    'chi_bee.official': [
      'rank_01_00793_likes_2024-05-01_04-44-49_UTC.jpg',
      'rank_02_00741_likes_2025-01-01_03-04-22_UTC.jpg',
      'rank_03_00605_likes_2024-09-28_02-31-07_UTC.jpg',
    ],
    'coal_owl': [
      'rank_01_404485_likes_2024-03-26_13-19-48_UTC.jpg',
      'rank_02_402920_likes_2022-02-10_10-14-50_UTC.jpg',
      'rank_03_104164_likes_2023-01-01_09-12-25_UTC.jpg',
    ],
    'den_1210': [
      'rank_01_00025_likes_2018-10-21_06-12-50_UTC.jpg',
      'rank_02_00020_likes_2018-08-31_07-17-56_UTC.jpg',
      'rank_03_00017_likes_2018-10-21_06-11-18_UTC.jpg',
    ],
    'deppa_53': [
      'rank_01_66156_likes_2022-09-06_16-02-54_UTC.jpg',
      'rank_02_20260_likes_2025-01-16_13-31-05_UTC.jpg',
      'rank_03_11573_likes_2024-12-05_08-49-49_UTC.jpg',
    ],
    'emanuelartist': [
      'rank_01_02107_likes_2024-12-18_22-15-08_UTC.jpg',
      'rank_02_02067_likes_2024-11-10_19-46-58_UTC.jpg',
      'rank_03_01919_likes_2025-01-10_20-38-02_UTC.jpg',
    ],
    'gaako_illust': [
      'rank_01_12804_likes_2024-12-11_14-00-25_UTC.jpg',
      'rank_02_08178_likes_2024-11-01_16-48-18_UTC.jpg',
      'rank_03_08165_likes_2024-12-03_12-28-59_UTC.jpg',
    ],
    'harunonioikaze': [
      'rank_01_97893_likes_2023-05-13_10-38-11_UTC.jpg',
      'rank_02_46383_likes_2023-08-17_09-55-56_UTC.jpg',
      'rank_03_43324_likes_2023-07-07_09-27-40_UTC.jpg',
    ],
    'harupeipei': [
      'rank_01_01146_likes_2024-12-19_12-03-05_UTC.jpg',
      'rank_02_01069_likes_2024-12-21_13-53-22_UTC.jpg',
      'rank_03_01036_likes_2024-12-17_11-17-00_UTC.jpg',
    ],
    'iina.gram': [
      'rank_01_00003_likes_2023-09-30_16-28-51_UTC.jpg',
      'rank_02_00003_likes_2023-11-17_11-00-05_UTC.jpg',
      'rank_03_00003_likes_2023-11-23_01-10-13_UTC.jpg',
    ],
    'jerome_trez_oudot': [
      'rank_01_08267_likes_2024-11-01_08-49-48_UTC.jpg',
      'rank_02_05708_likes_2024-11-22_08-50-25_UTC.jpg',
      'rank_03_05538_likes_2024-10-18_07-27-10_UTC.jpg',
    ],
    'meeesuke_': [
      'rank_01_05770_likes_2021-05-12_11-50-26_UTC.jpg',
      'rank_02_05167_likes_2021-08-14_12-45-49_UTC.jpg',
      'rank_03_04914_likes_2021-05-20_11-07-18_UTC.jpg',
    ],
    'mika_pikazo_mpz': [
      'rank_01_39453_likes_2023-08-13_06-23-27_UTC.jpg',
      'rank_02_28526_likes_2023-08-24_08-43-02_UTC.jpg',
      'rank_03_18376_likes_2024-07-20_12-40-24_UTC.jpg',
    ],
    'mokmok_skd': [
      'rank_01_11444_likes_2024-11-11_18-20-48_UTC.jpg',
      'rank_02_09227_likes_2024-06-21_16-00-59_UTC.jpg',
      'rank_03_08903_likes_2024-06-14_17-48-32_UTC.jpg',
    ],
    'nest_virgo': [
      'rank_01_113022_likes_2022-05-21_09-59-29_UTC.jpg',
      'rank_02_98871_likes_2023-09-03_00-00-36_UTC.jpg',
      'rank_03_48326_likes_2024-01-08_08-17-15_UTC.jpg',
    ],
    'obungu_mofumofu': [
      'rank_01_51171_likes_2024-08-20_11-00-00_UTC.jpg',
      'rank_02_38731_likes_2025-01-03_12-18-52_UTC.jpg',
      'rank_03_38594_likes_2024-08-14_11-00-00_UTC.jpg',
    ],
    'omrice4869': [
      'rank_01_24052_likes_2024-10-28_09-48-58_UTC.jpg',
      'rank_02_22217_likes_2023-09-14_11-17-10_UTC.jpg',
      'rank_03_19518_likes_2022-05-26_21-02-34_UTC.jpg',
    ],
    'oz_yarimasu': [
      'rank_01_653310_likes_2024-10-18_10-00-00_UTC.jpg',
      'rank_02_141672_likes_2023-09-03_11-16-21_UTC.jpg',
      'rank_03_113900_likes_2023-12-09_13-46-06_UTC.jpg',
    ],
    'sa_ka_na_4': [
      'rank_01_61751_likes_2023-09-12_04-09-40_UTC.jpg',
      'rank_02_31780_likes_2024-04-23_15-00-56_UTC.jpg',
      'rank_03_29034_likes_2023-09-17_17-43-59_UTC.jpg',
    ],
    'sexygirl.jp': [
      'rank_01_17531_likes_2024-09-29_10-00-00_UTC.jpg',
      'rank_02_09470_likes_2023-04-17_12-37-10_UTC.jpg',
      'rank_03_09243_likes_2024-09-01_11-00-00_UTC.jpg',
    ],
    'shirokumaai': [
      'rank_01_03429_likes_2024-04-04_10-08-12_UTC.jpg',
      'rank_02_02808_likes_2024-04-05_23-23-04_UTC.jpg',
      'rank_03_02428_likes_2024-03-30_21-30-37_UTC.jpg',
    ],
    'skt2ing': [
      'rank_01_00119_likes_2023-11-20_00-03-29_UTC.jpg',
      'rank_02_00104_likes_2024-06-01_04-07-20_UTC.jpg',
      'rank_03_00074_likes_2024-09-14_12-46-16_UTC.jpg',
    ],
    'test_one_photo': [
      'top1.jpg',
      'top2.jpg',
      'top3.jpg',
    ],
    'trcoot': [
      'rank_01_37188_likes_2022-04-23_10-08-49_UTC.jpg',
      'rank_02_28792_likes_2024-11-21_05-11-06_UTC.jpg',
      'rank_03_28265_likes_2024-05-30_04-09-46_UTC.jpg',
    ],
    'tsumugitopan': [
      'rank_01_250905_likes_2023-12-13_13-26-19_UTC.jpg',
      'rank_02_247486_likes_2024-02-09_03-24-24_UTC.jpg',
      'rank_03_205896_likes_2024-02-27_14-52-47_UTC.jpg',
    ],
  };

  Object.assign(TOP_LIKED_IMAGES_MAP, knownMappings);
};

/**
 * イラストレーターのTOP画像URLを取得
 * @param name イラストレーター名
 * @param rank ランキング (1, 2, 3)
 */
export const getActualTopLikedImageUrl = (name: string, rank: number): string | null => {
  const images = TOP_LIKED_IMAGES_MAP[name];
  if (!images || rank < 1 || rank > 3 || !images[rank - 1]) {
    return null;
  }
  return `/images/top_liked_images/${name}/${images[rank - 1]}`;
};

/**
 * イラストレーターのTOP3画像URLを一括取得
 * @param name イラストレーター名
 */
export const getActualTop3Images = (name: string): string[] => {
  const images = TOP_LIKED_IMAGES_MAP[name];
  if (!images) return [];
  
  return images
    .slice(0, 3)
    .map(filename => `/images/top_liked_images/${name}/${filename}`);
};

/**
 * 画像の存在確認
 * @param name イラストレーター名
 */
export const hasTopLikedImages = (name: string): boolean => {
  return !!TOP_LIKED_IMAGES_MAP[name];
};

// 初期化を実行
initializeImageMapping();