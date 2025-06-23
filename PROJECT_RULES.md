# 📘 色推薦アプリ・プロジェクトルール集

このドキュメントは、色推薦アプリプロジェクトの開発・デザイン・操作に関する統一ルールをまとめています。  
すべてのセッションで、この規約に従って開発してください。

---

## 🔒 Git運用ルール

### 1. mainブランチでは直接作業・コミットしない
- 作業は必ず `feature/xxx` のような **作業用ブランチ**で行うこと
- `main` はPull Requestによってマージされる前提の安定ブランチとする

### 2. 自動でGitコミットしない
- コードの編集や変更があっても、**即座に `git commit` しない**
- 編集が完了した時点で「コミットしてもよいか」をユーザーに確認すること

### 3. 論理単位ごとにコミットを分ける
- 関数の定義・UIの更新・設定ファイルの生成など、
  **仕様や構造の変更があるたびに1つずつコミット**すること
- 複数機能の変更を1コミットにまとめない（履歴の可読性を保つため）

### 4. 実行確認はすべて事前にOKとみなす
- `git init`, `npm install`, ディレクトリ作成など、操作実行時に「本当に実行してもいいか？」と確認が求められる場合は、**このセッションではすべてOK（許可済み）とみなす**

### 5. ログを`CHANGELOG.md`に残す
- 作業した内容ログを`CHANGELOG.md`に残すこと
  - いつどのファイルの何の機能を追加したのか
  - どのような要望が提示されていたのか
  - どのようなバグをデバッグしたのか等

### 6. 決まった要件を`PROJECT_RULES.md`に更新すること
- チャット内の会話，または指示文で決まった要件は随時`PROJECT_RULES.md`に更新する
  - UIの表示形式や，固定値など以降の変更しないように決まったもの

---


## 📁 その他の開発ルール

- 依存パッケージの追加や設定ファイルの修正も、1コミットにまとめず**論理単位で履歴に残す**
- コードにエラーがある状態でのコミットは禁止（ビルド・型エラーがない状態で行う）

---

## 🎯 基本テーマ設定

### テーマ切り替え
- **デフォルト**: ライトモード（白背景）
- **切り替え方法**: ページ右上のナビゲーションバーにThemeToggleボタン
- **アイコン**: 太陽（ライト）⇔ 月（ダーク）
- **即座反映**: クリック時にリアルタイムでテーマ変更

---

## 🎨 色表示ブロック統一仕様

### ColorBlock基本規格
- **要素**: `<div>` または `<canvas>`（表示互換性重視）
- **サイズ**: 48px × 48px（固定）
- **境界線**: `border-2 border-gray-300`
- **角丸**: `rounded-sm`（2px）
- **ホバー効果**: `hover:scale-110 transition-transform`
- **背景色**: `style={{ backgroundColor: color }}`（CSS変数より直接指定優先）

### 実装参照
- **統一コンポーネント**: `src/components/common/ColorBlock.tsx`
- **定数定義**: `src/constants/ui.ts` の `COLOR_BLOCK_SPEC`

---

## 🎨 カラーピッカーアイコン統一ルール

### アイコン配置パターン
- **採用パターン**: Palette アイコン（右下角オーバーレイ）
- **アイコン**: `lucide-react` の `Palette`
- **配置**: 色ブロックの右下角に小さな円形背景で配置
- **スタイル**: `absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300`
- **アイコンサイズ**: 16px
- **アイコン色**: `text-gray-600`

### レイアウト構成
- **色ブロック**: 48px × 48px の COLOR_BLOCK_SPEC 準拠
- **input要素**: 色ブロック上に透明オーバーレイ (`absolute opacity-0 w-full h-full`)
- **カラーコード表示**: 色ブロックから十分離れた位置に配置
- **スペーシング**: `gap-4` 以上でアイコンとテキストの重複を回避

---

## 📋 コピーボタン統一ルール

### デザイン方針
- **表示**: アイコンのみ（テキストラベル禁止）
- **アイコン**: `lucide-react` の `Copy` / `Check`
- **状態**: 通常時 = Copy、成功時 = Check（緑色）
- **UI参照**: 必ず現在の `src/components/common/CopyColorButton.tsx` の実装を基準とする

### バリアント
1. **minimal**: アイコンのみ、丸ボタン
2. **compact**: アイコンのみ、角丸ボタン  
3. **full**: アイコンのみ、大きめボタン

### 実装ルール
- **コンポーネント参照**: 新規作成時は `CopyColorButton` の現在の状態を必ず参照
- **アイコンサイズ**: `w-4 h-4`（16px）統一
- **インラインスタイル**: SimpleTest等では `<Copy size={16} />` 形式
- **統一性**: 全プロジェクトで同じ見た目・動作を保つ

### 可視性
- **表示**: `opacity-80 hover:opacity-100`（常時表示）
- **group-hover**: 使用禁止（ユーザビリティのため）

---

## 📐 レイアウト設計原則

### アプリケーション全体レイアウト

#### メインレイアウト構造
- **コンテナ**: `container mx-auto` でセンタリング
- **モバイル/タブレット** (< 1280px): 縦積みレイアウト `space-y-6`
- **デスクトップ** (≥ 1280px): グリッドレイアウト
  - 上段: 3列グリッド `grid-cols-3 gap-6`
  - 下段: 2列グリッド `grid-cols-2 gap-6`

#### 主要コンポーネント配置
1. **ColorPicker** - 手動色選択（左上/モバイル1番目）
2. **ImageUpload** - 画像アップロード（中央上/モバイル2番目）
3. **ExtractedColorsDisplay** - 抽出色表示（右上/モバイル3番目）
4. **ColorRecommendations** - 色推薦（左下/モバイル4番目）
5. **ToneRecommendations** - トーン推薦（右下/モバイル5番目）

### コンポーネント内レイアウト原則

#### 水平レイアウト優先
- **カラーピッカー表示**: 色ブロック + カラーコード + コピーボタンを横並び
- **推薦色表示**: 同様に横並び維持
- **縦長回避**: `flex items-center gap-3/4` で水平配置統一

#### レスポンシブグリッドシステム
- **色表示グリッド**: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
- **配色技法ボタン**: `grid-cols-2 sm:grid-cols-4 md:grid-cols-6`
- **ギャップ**: `gap-3` 統一（12px）

### スペーシングシステム
- **アプリレベル**: モバイル `p-4`、デスクトップ `p-6`
- **セクション間**: モバイル `space-y-6`、デスクトップ `gap-6`
- **カード内**: `p-4` から `p-6` （コンポーネント依存）
- **要素間**: ColorItem内 `gap-4`（デスクトップ）、`gap-1`（モバイル）

---

## 🔤 フォント・タイポグラフィ

### フォントスタック
- **メイン**: Inter（Google Fonts）
- **コード**: JetBrains Mono（Google Fonts）
- **フォールバック**: システムフォント

### 色分け
- **カラーコード**: `font-mono`（モノスペース）
- **見出し**: `text-foreground`（明示的指定）
- **説明文**: `text-muted-foreground`

---

## 🎛 配色技法設定

### 表示形式ルール
- **形式**: `○○配色(x色): (説明文)` の統一フォーマット
- **例**: `ダイアード配色(2色): 対照的な色相の組み合わせ`
- **色数**: `angles` 配列の長さに基づく自動表示
- **説明**: 配色技法の特徴を簡潔に説明

### ボタンデザイン
- **形状**: コンパクトな角丸ボタン
- **配置**: 2-6列のレスポンシブグリッド
- **状態**: 選択時 = `bg-primary`、非選択時 = `bg-muted`

---

## 🚫 禁止事項

### 避けるべき実装
1. **縦長レイアウト**: 色表示の縦並び配置
2. **コピーボタンテキスト**: 「コピー」「Copy」等の文字表示
3. **group-hover隠し**: `opacity-0 group-hover:opacity-100`
4. **日本語配色技法名**: 「補色配色」「三角配色」等
5. **Canvas強制**: 表示されない場合はdivに切り替え
6. **コピーアイコンの独自実装**: 必ず `CopyColorButton.tsx` の現在のUIを参照・統一

### CSS変数依存回避
- Tailwindのカスタム変数が効かない場合は **インラインスタイル** を優先
- `style={{ backgroundColor: color }}` 等の直接指定を使用

---

## ✅ 品質チェックリスト

新しいコンポーネント作成時は以下を確認：

- [ ] ColorBlockは48px固定サイズか
- [ ] コピーボタンはアイコンのみか
- [ ] 水平レイアウトを維持しているか
- [ ] ライト・ダークモード両方で表示されるか
- [ ] レスポンシブデザインに対応しているか
- [ ] TypeScriptエラーがないか
- [ ] 配色技法名は英語か

---

## 🌈 色推薦表示ルール

### グラデーション並び替え
- **推薦色表示**: 必ず明るい→暗い順でソート表示
- **推薦トーン表示**: 同様に明るい→暗い順でソート表示
- **実装**: `sortColorsByLightness`関数で chroma.js の lightness 値を使用
- **適用場所**: `generateRecommendedColors()` と `generateRecommendedTones()` 内

### ソート仕様
- **基準**: HSL の lightness 値（0-1）
- **順序**: 降順（明るい→暗い）
- **エラーハンドリング**: 色変換エラー時は元の順序を維持

### スマホ用2列レイアウト仕様
- **採用レイアウト**: 2列横並び配置（~767px）
- **色ブロックサイズ**: 40px × 40px
- **要素順序**: 色ブロック → コピーボタン → カラーコード
- **ギャップ**: `gap-2` で要素間スペース確保
- **カラーコード**: `text-xs font-mono` でコンパクト表示、`truncate` で省略
- **コピーボタン**: 14pxアイコン、常時表示
- **レスポンシブ**: `space-y-3` で行間確保

### コピーボタン必須実装
- **全デバイス対応**: スマホ・タブレット・デスクトップすべてでコピーボタン必須
- **統一コンポーネント**: 必ず `CopyColorButton` コンポーネントを使用
- **独自実装禁止**: 独自のSVGやbuttonタグでのコピー機能実装は禁止
- **表示保証**: `opacity-100` で常時表示、`flex-shrink-0` で縮小防止
- **機能保証**: 成功時のフィードバック（緑色チェックアイコン）必須

### モバイル最適化仕様
- **メインコンテナ**: `pt-1 pb-0` で上部のみ最小余白、下部余白完全削除
- **セクションタイトル**: h3タグ、`text-xs leading-tight` で超コンパクト表示
- **最終セクション**: `mb-0` で下部余白完全削除
- **カードコンポーネント**: 最下部カードに `mb-0` で余白削除
- **カードヘッダー/コンテンツ**: `pb-1 pt-2` / `pt-1` で最小限の内部余白
- **配色技法ボタン**: `px-2 py-1 text-xs` で超コンパクトサイズ
- **アイコン縮小**: 空状態アイコン `w-6 h-6`、コンテナ `w-12 h-12`
- **シングルスクリーン**: 画面下部に不要な背景色領域を残さない

---

## 🎨 ボーダー・スタイリング統一管理ルール

### 統一ボーダー仕様の原則
- **一元管理**: すべてのボーダー（枠線・角丸）は `src/constants/ui.ts` で統一管理
- **色相推薦基準**: 角の丸みは色相推薦カラーボックスの `rounded` (4px) を基準とする
- **プリセット活用**: よく使われる組み合わせは `BORDER_PRESETS` として定義済み

### ボーダースタイル定義
```typescript
// 枠線の太さ
width: {
  thin: 'border',     // 1px
  normal: 'border-2', // 2px  
  thick: 'border-4'   // 4px
}

// 枠線の色
color: {
  transparent: 'border-transparent',
  default: 'border-border',
  muted: 'border-gray-300',
  accent: 'border-primary'
}

// 角の丸み（色相推薦カラーボックス基準）
radius: {
  none: 'rounded-none',
  small: 'rounded',      // 4px - 基準
  medium: 'rounded-md',  // 6px
  large: 'rounded-lg',   // 8px
  full: 'rounded-full'   // 完全な円形
}
```

### ボーダープリセット使用例
- **カラーブロック**: `BORDER_PRESETS.colorBlock` - 透明枠線 + 小さい角丸
- **カード**: `BORDER_PRESETS.card` - 細い枠線 + 中程度の角丸  
- **ボタン**: `BORDER_PRESETS.button` - 透明枠線 + 中程度の角丸
- **アップロード**: `BORDER_PRESETS.upload` - 点線 + 大きい角丸
- **アイコン**: `BORDER_PRESETS.icon` - 透明枠線のみ
- **プレビュー**: `BORDER_PRESETS.preview` - 大きい角丸のみ

### 実装ルール
- **コンポーネント更新**: 既存のハードコードされたTailwindクラスは統一プリセットに置き換え
- **新規コンポーネント**: 必ず `BORDER_PRESETS` を使用し、独自のボーダー指定禁止
- **一貫性保持**: プロジェクト全体で同じ角丸・枠線仕様を維持

---

## 📱 レイアウト・アーキテクチャ詳細仕様

### アプリケーション全体構造

#### 最上位レイアウト（App.tsx）
```
ToastProvider
└── div (min-h-screen flex flex-col)
    ├── header (固定ヘッダー)
    │   └── container
    │       └── NavigationMenu + [HelpButton, ThemeToggle]
    ├── main (flex-1 メインコンテンツ)
    │   ├── Mobile/Tablet レイアウト (block xl:hidden)
    │   └── Desktop レイアウト (hidden xl:block)
    └── ToastContainer (固定位置)
```

#### 基本レイアウトパターン
- **全画面**: `min-h-screen flex flex-col` - 画面全体を縦方向のフレックスコンテナ
- **ヘッダー固定**: `flex-shrink-0` でヘッダーサイズ固定
- **メインコンテンツ**: `flex-1` で残り領域を占有
- **レスポンシブ切り替え**: `xl:` ブレークポイント（1280px）でレイアウト変更

### レスポンシブレイアウト詳細

#### モバイル・タブレット（~1279px）
```
main (px-4 pb-2)
└── section.1 ベースカラー選択 (flex-shrink-0 mb-1)
    └── div (flex gap-1)
        ├── ColorPicker (flex-1)
        └── ImageUpload (flex-1)
    └── ExtractedColorsDisplay
└── div.2-3 推薦セクション (space-y-1)
    ├── section.2 色相推薦
    └── section.3 トーン推薦
```

#### デスクトップ（1280px~）
```
main (h-full flex flex-col)
└── section.1 ベースカラー選択 (flex-shrink-0 mb-2)
    └── div (grid grid-cols-3 gap-4)
        ├── ColorPicker
        ├── ImageUpload
        └── ExtractedColorsDisplay
└── div.2-3 推薦セクション (flex-1 grid grid-cols-2 gap-4)
    ├── section.2 色相推薦 (min-h-0 flex flex-col)
    └── section.3 トーン推薦 (min-h-0 flex flex-col)
```

### 主要UIコンポーネント一覧

#### レイアウト・構造系
| コンポーネント名 | ファイル | 役割 |
|------------------|----------|------|
| App | `/src/App.tsx` | 最上位アプリケーション構造 |
| NavigationMenu | `/src/components/NavigationMenu.tsx` | ハンバーガーメニューナビゲーション |
| ThemeToggle | `/src/components/ThemeToggle.tsx` | ライト・ダークモード切り替え |
| ToastContainer | `/src/components/ToastContainer.tsx` | 通知メッセージ表示 |

#### 機能系メインコンポーネント
| コンポーネント名 | ファイル | 役割 |
|------------------|----------|------|
| ColorPicker | `/src/components/ColorPicker.tsx` | カラーピッカー（パレットアイコン式） |
| ImageUpload | `/src/components/ImageUpload.tsx` | 画像アップロード・色抽出 |
| ExtractedColorsDisplay | `/src/components/ExtractedColorsDisplay.tsx` | 抽出色表示・選択 |
| ColorRecommendations | `/src/components/ColorRecommendations.tsx` | 色相推薦・配色技法選択 |
| ToneRecommendations | `/src/components/ColorRecommendations.tsx` | トーン推薦表示 |

#### 共通・再利用系コンポーネント
| コンポーネント名 | ファイル | 役割 |
|------------------|----------|------|
| ColorGrid | `/src/components/common/ColorGrid.tsx` | 統一カラーグリッドレイアウト |
| ColorItem | `/src/components/common/ColorItem.tsx` | 色表示アイテム（デスクトップ・モバイル対応） |
| ColorBlock | `/src/components/common/ColorBlock.tsx` | 統一色表示ブロック |
| CopyColorButton | `/src/components/common/CopyColorButton.tsx` | 統一コピーボタン |
| ProgressBar | `/src/components/common/ProgressBar.tsx` | プログレスバー |

#### shadcn/ui基盤コンポーネント
| コンポーネント名 | ファイル | 役割 |
|------------------|----------|------|
| Card | `/src/components/ui/card.tsx` | カード・コンテナ |
| Button | `/src/components/ui/button.tsx` | ボタン |
| Input | `/src/components/ui/input.tsx` | 入力フィールド |
| Toast | `/src/components/ui/toast.tsx` | トースト通知 |

### グリッドシステム・レスポンシブ仕様

#### 定義済みグリッドパターン（constants/ui.ts）
```typescript
RESPONSIVE_GRID = {
  colors: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  schemes: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6',
  gap: 'gap-3',
  padding: 'p-4'
}
```

#### ブレークポイント定義
- **xs**: 475px（拡張）
- **sm**: 640px（標準Tailwind）
- **md**: 768px（標準Tailwind）
- **lg**: 1024px（標準Tailwind）
- **xl**: 1280px（メイン切り替えポイント）
- **2xl**: 1536px（拡張）

#### カラーグリッドレスポンシブ動作
- **モバイル**: 2列固定（`flex gap-1` による2列レイアウト）
- **タブレット～**: 3-5列可変（`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`）

### スペーシング・余白システム

#### セクション間スペーシング
- **モバイル**: `mb-1` (4px), `space-y-1` (4px) - 超コンパクト
- **デスクトップ**: `mb-2` (8px), `gap-4` (16px) - 標準

#### カード内部スペーシング
- **ヘッダー**: `pb-1 pt-2` (上8px, 下4px)
- **コンテンツ**: `pt-1` (上4px), `pb-0` (下0px)
  
#### モバイル最適化余白
- **メインコンテナ**: `px-4 pb-2` (横16px, 下8px)
- **最終セクション**: `mb-0` で下部余白完全削除
- **タイトル**: `text-xs leading-tight` 超コンパクト

### ヘッダー・ナビゲーション構造

#### ヘッダーレイアウト
```
header (border-b border-border bg-background)
└── container (mx-auto px-4 py-3)
    └── flex (justify-between items-center)
        ├── NavigationMenu
        └── div (flex items-center gap-2)
            ├── HelpButton (Link to="/help")
            └── ThemeToggle
```

#### NavigationMenu仕様
- **トリガー**: ハンバーガーアイコン（Menu/X）
- **レイアウト**: ドロップダウン式メニュー
- **背景**: backdrop-blur-sm 効果
- **メニュー項目**: ホーム、ダミーページ1-3、ヘルプ

### カードレイアウト詳細仕様

#### Card基本構造
```
Card (統一border-presets)
├── CardHeader (pb-1 pt-2 flex-shrink-0)
└── CardContent (pt-0 flex-1 overflow-auto pb-0)
```

#### 高さ制約システム
- **ColorRecommendations**: 固定高さ `144px`
- **その他**: `h-full` で親コンテナに従う
- **フレックス**: `min-h-0` でオーバーフロー制御

### カラー表示レイアウト仕様

#### ColorItem レスポンシブ構造
- **デスクトップ**: `flex items-center gap-4` - 横並び標準レイアウト
- **モバイル**: 2列コンパクトレイアウト - `flex-1` で等幅分割

#### 色要素配置順序
1. **ColorBlock** - 色表示ブロック
2. **CopyColorButton** - コピーボタン
3. **カラーコード** - HEX値表示

#### ColorGrid 動作パターン
- **空状態**: 中央配置のプレースホルダー表示
- **データ有り**: レスポンシブグリッド表示
- **クリック動作**: `onColorClick` コールバック実行

---

## 🔧 技術仕様

### 状態管理・データフロー

#### Zustandストア構造（colorStore.ts）
```typescript
interface ColorState {
  selectedColor: string;           // 選択中のベースカラー
  recommendedColors: string[];     // 色相推薦結果
  recommendedTones: string[];      // トーン推薦結果
  selectedScheme: string;          // 選択中の配色技法
  toneBaseColor: string | null;    // トーン生成の基準色
  extractedColors: ExtractedColor[]; // 画像から抽出された色
  dominantColor: ExtractedColor | null; // ドミナントカラー
}
```

#### 色推薦アルゴリズム
- **色相推薦**: HSL色空間での色相角度操作
- **トーン推薦**: 明度・彩度の段階的変化
- **ソート機能**: `chroma.js` lightness値による明るい→暗い順
- **重複除去**: 同一色・極端な色（#000000, #FFFFFF）の自動除外

#### 配色技法データ
- **総計**: 13種類の配色技法
- **角度ベース**: 色相環での角度指定による色生成
- **アルゴリズム**: Identity, Analogous, Dyad, Triad, Tetrad, Split, Pentad, Hexad

### CSS・スタイリング仕様

#### Tailwind CSS設定
- **ダークモード**: class-based切り替え
- **カスタムブレークポイント**: xs(475px), 2xl(1536px)
- **フォント設定**: Inter（メイン）, JetBrains Mono（コード）
- **カラーシステム**: CSS変数ベースのテーマ対応

#### CSS変数システム
```css
:root {
  --background: oklch(1 0 0);      /* ライトモード背景 */
  --foreground: oklch(0.145 0 0);  /* ライトモード文字 */
  --primary: oklch(0.205 0 0);     /* プライマリ色 */
  --card: oklch(1 0 0);            /* カード背景 */
  --border: oklch(0.922 0 0);      /* 境界線 */
}

.dark {
  --background: oklch(0.145 0 0);  /* ダークモード背景 */
  --foreground: oklch(0.985 0 0);  /* ダークモード文字 */
  /* ... その他ダークモード変数 */
}
```

#### モバイル最適化CSS
- **スクロールバー非表示**: webkit-scrollbar, scrollbar-width
- **タッチスクロール**: -webkit-overflow-scrolling: touch
- **オーバーフロー制御**: overflow-x: hidden

#### カスタムアニメーション
- **fadeIn**: opacity + translateY 変化
- **scaleIn**: opacity + scale 変化
- **グラスモーフィズム**: backdrop-filter blur効果

### パフォーマンス・最適化

#### 色処理最適化
- **遅延評価**: 必要時のみ色計算実行
- **重複排除**: Set使用による効率的な重複除去
- **エラーハンドリング**: chroma.js例外の適切な処理

#### レンダリング最適化
- **条件分岐レンダリング**: 空配列時のプレースホルダー表示
- **レスポンシブ分岐**: CSS Grid vs Flexbox の適切な使い分け
- **画像最適化**: objectFit, maxHeight による表示制御

### 使用ライブラリ
- **アイコン**: lucide-react
- **色操作**: chroma-js（色相・明度・彩度計算）
- **状態管理**: zustand（軽量グローバル状態）
- **UI**: shadcn/ui + Tailwind CSS
- **型定義**: TypeScript（厳密型チェック）
- **画像処理**: ColorThief（色抽出）

### ファイル構成
```
src/
├── components/
│   ├── ColorPicker.tsx             # カラーピッカー（パレットアイコン式）
│   ├── ColorRecommendations.tsx    # 色相推薦・配色技法選択
│   ├── ExtractedColorsDisplay.tsx  # 抽出色表示・選択
│   ├── ImageUpload.tsx             # 画像アップロード・色抽出
│   ├── NavigationMenu.tsx          # ハンバーガーメニューナビゲーション
│   ├── ThemeToggle.tsx             # ライト・ダークモード切り替え
│   ├── ToastContainer.tsx          # 通知メッセージ表示
│   ├── common/
│   │   ├── ColorBlock.tsx          # 統一色表示ブロック
│   │   ├── ColorGrid.tsx           # 統一カラーグリッドレイアウト
│   │   ├── ColorItem.tsx           # 色表示アイテム（レスポンシブ対応）
│   │   ├── CopyColorButton.tsx     # 統一コピーボタン
│   │   └── ProgressBar.tsx         # プログレスバー
│   └── ui/
│       ├── button.tsx              # shadcn/ui ボタン
│       ├── card.tsx                # shadcn/ui カード
│       ├── input.tsx               # shadcn/ui 入力フィールド
│       └── toast.tsx               # shadcn/ui トースト
├── constants/
│   └── ui.ts                       # UI統一定数・ボーダープリセット
├── contexts/
│   └── ToastContext.tsx            # トースト通知コンテキスト
├── hooks/
│   ├── useScrollVisibility.ts      # スクロール表示制御
│   └── useToast.ts                 # トースト通知フック
├── lib/
│   ├── clipboard.ts                # クリップボード操作
│   ├── colorExtractor.ts           # 色抽出ロジック
│   └── utils.ts                    # ユーティリティ関数
├── pages/
│   └── HelpPage.tsx                # ヘルプページ
├── store/
│   └── colorStore.ts               # 色・配色技法管理 + グラデーションソート
└── types/
    └── colorthief.d.ts             # ColorThief型定義
```

---

---

## 📱 現在のレイアウト状態

### アプリケーション構成（2025-06-21時点）
- **メインレイアウト**: レスポンシブグリッド（モバイル縦積み ↔ デスクトップ3+2列）
- **色表示**: ColorBlock（48x48px、6px角丸）統一仕様
- **カード**: 中程度角丸（6px）、統一ボーダー
- **スペーシング**: gap-3（12px）基準、モバイルp-4/デスクトップp-6

### 主要機能エリア
1. **色選択セクション**: ColorPicker（手動選択）
2. **画像処理セクション**: ImageUpload + ExtractedColorsDisplay
3. **推薦システム**: ColorRecommendations（配色技法選択）
4. **トーン生成**: ToneRecommendations（明度・彩度バリエーション）

---

## 🧹 コード整理・クリーンアップルール

### 不要ファイル削除対象
以下のファイルは開発中の実験的コンポーネントで本番環境では不要のため削除対象：

#### テスト・実験用コンポーネント（削除対象）
- `/src/AppSimple.tsx` - 未使用の簡易版アプリ
- `/src/components/ColorPickerTest.tsx` - 未使用のUI実験コンポーネント  
- `/src/components/HorizontalColorTest.tsx` - 未使用のレイアウト実験コンポーネント
- `/src/components/SimpleTest.tsx` - AppSimple.tsx でのみ使用される基本テストコンポーネント
- `/src/components/test/` - 空ディレクトリ（実際のテストファイルは存在しない）

#### ダミーページ（要確認）
- `/src/pages/DummyPage1.tsx`
- `/src/pages/DummyPage2.tsx` 
- `/src/pages/DummyPage3.tsx`

**削除理由**: これらは本番機能と重複する実験的コンポーネントで、実際の機能は本番コンポーネント（ColorPicker.tsx、ColorItem.tsx等）で実装済み

### ファイル整理ルール
1. **実験的コンポーネント禁止**: `*Test.tsx` 形式の実験用コンポーネントは作成しない
2. **本番コンポーネント優先**: 機能実装は必ず本番用コンポーネント（ColorPicker.tsx等）で行う
3. **未使用ファイル削除**: import されていないコンポーネントは定期的に削除
4. **ディレクトリ構造維持**: 空ディレクトリは削除し、必要な場合のみ作成

---

**最終更新**: 2025-06-23  
**適用プロジェクト**: 色推薦アプリ プロジェクト全体  

このルールは、Claude Code セッションが毎回リセットされることを考慮して、**毎回最初に貼って読み込ませてください。**