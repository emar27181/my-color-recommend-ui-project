// UI共通定数定義

/**
 * 統一ボーダー仕様
 */
export const BORDER_STYLES = {
  // 枠線の太さ
  width: {
    thin: 'border',           // 1px
    normal: 'border-2',       // 2px
    thick: 'border-4'         // 4px
  },
  
  // 枠線の色
  color: {
    transparent: 'border-transparent',
    default: 'border-border',
    muted: 'border-gray-300',
    accent: 'border-primary'
  },
  
  // 枠線のスタイル
  style: {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  },
  
  // 角の丸み（色相推薦カラーボックス基準）
  radius: {
    none: 'rounded-none',
    small: 'rounded',         // 4px - 色相推薦カラーボックスと同じ
    medium: 'rounded-md',     // 6px
    large: 'rounded-lg',      // 8px
    full: 'rounded-full'      // 完全な円形
  }
} as const;

/**
 * よく使われるボーダー組み合わせ
 */
export const BORDER_PRESETS = {
  // 色表示用（透明枠線 + 中程度の角丸）
  colorBlock: `${BORDER_STYLES.width.normal} ${BORDER_STYLES.color.transparent} ${BORDER_STYLES.radius.medium}`,
  
  // カード用（細い枠線 + 中程度の角丸）
  card: `${BORDER_STYLES.width.thin} ${BORDER_STYLES.color.default} ${BORDER_STYLES.radius.medium}`,
  
  // アップロード用（点線 + 大きい角丸）
  upload: `${BORDER_STYLES.width.normal} ${BORDER_STYLES.style.dashed} ${BORDER_STYLES.color.transparent} ${BORDER_STYLES.radius.large}`,
  
  // ボタン用（透明枠線 + 中程度の角丸）
  button: `${BORDER_STYLES.color.transparent} ${BORDER_STYLES.radius.medium}`,
  
  // 入力欄用（細い枠線 + 中程度の角丸）
  input: `${BORDER_STYLES.radius.medium} ${BORDER_STYLES.width.thin}`,
  
  // アイコン用（透明枠線 + 小さい角丸）
  icon: `${BORDER_STYLES.width.thin} ${BORDER_STYLES.color.transparent}`,
  
  // プレビュー画像用（大きい角丸のみ）
  preview: BORDER_STYLES.radius.large
} as const;

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
  
  // CSSクラス（統一ボーダー仕様を使用）
  className: `${BORDER_PRESETS.colorBlock} cursor-pointer hover:scale-110 transition-all duration-200`,
  
  // アニメーション
  hoverScale: 1.1,
  transitionDuration: '0.2s'
} as const;

/**
 * モバイルファーストのレスポンシブグリッド定義
 */
export const RESPONSIVE_GRID = {
  // カラム数定義
  colors: 'grid-cols-4',
  tones: 'grid-cols-4', // トーン推薦専用: 4x4の16パターン表示
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