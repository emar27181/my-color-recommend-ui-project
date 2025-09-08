/**
 * イラストレーター画像関連のユーティリティ関数
 */

/**
 * イラストレーターの代表画像URLを取得
 */
export const getIllustratorImageUrl = (name: string): string => {
  return `/images/illustrators/${name}/representative.jpg`;
};

/**
 * イラストレーターのいいね数TOP画像URLを取得
 * @param name イラストレーター名
 * @param rank ランキング (1, 2, 3)
 */
export const getTopLikedImageUrl = (name: string, rank: number): string => {
  if (rank < 1 || rank > 3) {
    throw new Error('Rank must be between 1 and 3');
  }
  const rankStr = rank.toString().padStart(2, '0'); // 01, 02, 03
  return `/images/top_liked_images/${name}/rank_${rankStr}_`;
};

/**
 * イラストレーターのTOP3画像URLを一括取得
 * @param name イラストレーター名
 * @returns [top1.jpg, top2.jpg, top3.jpg]のURL配列
 */
export const getTop3Images = (name: string): string[] => {
  return [1, 2, 3].map(rank => getTopLikedImageUrl(name, rank));
};

/**
 * 画像の存在確認（フォールバック対応）
 * @param imageUrl 画像URL
 * @param fallbackUrl フォールバック画像URL
 */
export const getImageWithFallback = (imageUrl: string, fallbackUrl?: string): string => {
  // 実際の実装では、画像の存在確認を行い、存在しない場合はfallbackUrlを返す
  // 現在は単純にimageUrlを返す（将来的な拡張用）
  if (fallbackUrl) {
    // 将来的にここで画像存在確認ロジックを追加
    console.log('Fallback URL available:', fallbackUrl);
  }
  return imageUrl;
};

/**
 * イラストレーター名から安全なファイル名に変換
 * （特殊文字を含む名前の場合の対応）
 */
export const sanitizeIllustratorName = (name: string): string => {
  // URLエンコードではなく、ファイルシステム用のサニタイズ
  return name.replace(/[<>:"/\\|?*]/g, '_');
};