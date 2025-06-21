// UI共通定数定義

/**
 * 色表示ブロックの統一仕様
 */
export const COLOR_BLOCK_SPEC = {
  // サイズ（コンポーネント全体）
  width: 48,
  height: 48,
  
  // 色表示エリアのサイズ（95%）
  colorWidth: 46,
  colorHeight: 46,
  
  // CSSクラス
  className: 'border-2 border-transparent rounded cursor-pointer hover:scale-110 transition-all duration-200',
  
  // アニメーション
  hoverScale: 1.1,
  transitionDuration: '0.2s'
} as const;

/**
 * モバイルファーストのレスポンシブグリッド定義
 */
export const RESPONSIVE_GRID = {
  // カラム数定義
  colors: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  schemes: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6',
  
  // ギャップ
  gap: 'gap-3',
  
  // パディング
  padding: 'p-4'
} as const;

/**
 * モバイルファーストのタイポグラフィ
 */
export const TYPOGRAPHY = {
  title: 'text-lg font-semibold',
  subtitle: 'text-sm text-muted-foreground',
  colorCode: 'font-mono text-sm',
  usage: 'text-xs text-muted-foreground'
} as const;