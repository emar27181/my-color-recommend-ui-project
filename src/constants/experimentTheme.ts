/**
 * 実験ページ全体のUI統一設定
 *
 * このファイルの設定値を変更するだけで、
 * 実験ページ全体のデザインを一括変更できます
 */

// ========================================
// ボタンスタイル設定
// ========================================
export const EXPERIMENT_BUTTON_STYLES = {
  // 次に進む・実験開始などのアクションボタン（緑系）
  action: {
    base: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 text-white',
    className: 'gap-2',
  },

  // 通常のボタン（プライマリカラー）
  primary: {
    base: 'bg-primary text-primary-foreground hover:bg-primary/90',
    className: 'gap-2',
  },

  // アウトラインボタン（戻る、キャンセルなど）
  outline: {
    base: 'border bg-background hover:bg-accent hover:text-accent-foreground',
    className: 'gap-2',
  },

  // 危険なアクション（削除、リセットなど）
  destructive: {
    base: 'bg-destructive text-white hover:bg-destructive/90',
    className: 'gap-2',
  },
} as const;

// ========================================
// カードスタイル設定
// ========================================
export const EXPERIMENT_CARD_STYLES = {
  // 標準カード
  default: {
    border: 'border',
    radius: 'rounded-lg',
    shadow: '',
  },

  // 強調カード（重要な情報）
  emphasized: {
    border: 'border-2 border-primary/20',
    radius: 'rounded-lg',
    shadow: 'shadow-lg',
  },

  // 完了・成功メッセージカード
  success: {
    border: 'border-2 border-green-500/20',
    radius: 'rounded-lg',
    shadow: '',
  },
} as const;

// ========================================
// 入力欄スタイル設定
// ========================================
export const EXPERIMENT_INPUT_STYLES = {
  // 標準入力欄
  default: {
    base: 'border-2 bg-muted text-foreground',
    radius: 'rounded-md',
    padding: 'px-4',
    focus: 'focus:ring-2 focus:ring-primary/50',
  },

  // 大きい入力欄（参加者ID入力など）
  large: {
    base: 'font-mono text-xl h-[84px] px-4 border-2 bg-muted text-foreground',
    radius: 'rounded-md',
  },
} as const;

// ========================================
// バッジスタイル設定
// ========================================
export const EXPERIMENT_BADGE_STYLES = {
  // 条件バッジ（UI1, UI2）
  condition: {
    base: 'font-mono text-base px-3 py-1',
    variant: 'outline' as const,
  },

  // 参加者IDバッジ
  participant: {
    base: 'font-mono',
    variant: 'secondary' as const,
  },

  // 進捗バッジ
  progress: {
    base: 'font-mono',
    variant: 'outline' as const,
  },

  // 条件色分けバッジ（導入ページ）
  conditionColor: {
    UI1: 'bg-slate-500 text-white',
    UI2: 'bg-blue-500 text-white',
  },
} as const;

// ========================================
// 条件カードの色設定（導入ページ用）
// ========================================
export const EXPERIMENT_CONDITION_COLORS = {
  UI1: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-600',
    badge: 'bg-slate-500',
  },
  UI2: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-300 dark:border-blue-700',
    badge: 'bg-blue-500',
  },
} as const;

// ========================================
// アイコン設定
// ========================================
export const EXPERIMENT_ICON_STYLES = {
  // 小さいアイコン（インライン）
  small: 'w-4 h-4',

  // 標準アイコン
  default: 'w-5 h-5',

  // 大きいアイコン（ヘッダーなど）
  large: 'w-6 h-6',

  // 特大アイコン（完了画面など）
  xlarge: 'w-16 h-16',
} as const;

// ========================================
// レイアウト・余白設定
// ========================================
export const EXPERIMENT_LAYOUT = {
  // コンテナ幅
  containerWidth: {
    narrow: 'max-w-2xl',   // 狭い（アンケートなど）
    standard: 'max-w-3xl', // 標準（完了ページなど）
    wide: 'max-w-5xl',     // 広い（導入ページなど）
    centered: 'w-[70%] mx-auto', // 中央寄せ（説明カードなど）
  },

  // セクション間の余白
  sectionSpacing: {
    small: 'space-y-4',
    medium: 'space-y-6',
    large: 'space-y-8',
  },

  // カード内の余白
  cardPadding: {
    header: 'pt-10 pb-10 px-8',
    content: 'pt-16 pb-16 px-8',
  },
} as const;

// ========================================
// テキストスタイル設定
// ========================================
export const EXPERIMENT_TEXT_STYLES = {
  // ページタイトル
  pageTitle: 'text-4xl font-bold',

  // セクションタイトル
  sectionTitle: 'text-xl font-semibold',

  // カードタイトル
  cardTitle: 'text-lg font-semibold',

  // 説明文
  description: 'text-sm text-muted-foreground',

  // ラベル
  label: 'text-base font-semibold text-foreground',
} as const;

// ========================================
// タスクコンセプト設定
// ========================================
export const TASK_CONCEPTS = {
  taskA: '冬の丘に立つクマ',
  taskB: '近未来の幾何学ロゴ',
} as const;

// ========================================
// ヘルパー関数
// ========================================

/**
 * ボタンのclassNameを生成
 */
export const getButtonClassName = (type: keyof typeof EXPERIMENT_BUTTON_STYLES) => {
  const styles = EXPERIMENT_BUTTON_STYLES[type];
  return `${styles.base} ${styles.className}`;
};

/**
 * カードのclassNameを生成
 */
export const getCardClassName = (type: keyof typeof EXPERIMENT_CARD_STYLES) => {
  const styles = EXPERIMENT_CARD_STYLES[type];
  return `${styles.border} ${styles.radius} ${styles.shadow}`;
};

/**
 * 入力欄のclassNameを生成
 */
export const getInputClassName = (type: keyof typeof EXPERIMENT_INPUT_STYLES) => {
  const styles = EXPERIMENT_INPUT_STYLES[type];
  if ('focus' in styles) {
    return `${styles.base} ${styles.radius} ${styles.padding} ${styles.focus}`;
  }
  return styles.base;
};

/**
 * バッジのpropsを取得
 */
export const getBadgeProps = (type: 'condition' | 'participant' | 'progress') => {
  const styles = EXPERIMENT_BADGE_STYLES[type];
  return {
    variant: styles.variant,
    className: styles.base,
  };
};

/**
 * 条件カードの色設定を取得
 */
export const getConditionCardColors = (condition: 'UI1' | 'UI2') => {
  return EXPERIMENT_CONDITION_COLORS[condition];
};
