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

### デプロイメント
- **本番デプロイ**: `netlify deploy --prod` コマンドでNetlifyにプロダクションデプロイ
- **デプロイURL**: https://color-recommend.netlify.app
- **自動ビルド**: Netlify側で `npm run build` が実行される

---

## 🎯 基本テーマ設定

### テーマ切り替え
- **デフォルト**: ダークモード（黒背景）
- **切り替え方法**: ページ右上のナビゲーションバーにThemeToggleボタン
- **アイコン**: 太陽（ライト）⇔ 月（ダーク）
- **即座反映**: クリック時にリアルタイムでテーマ変更

### 言語切り替え
- **対応言語**: 日本語（デフォルト）⇔ 英語
- **配置**: ヘッダー右側、ナビゲーションメニューの左隣
- **アイコン**: `Languages`（lucide-react）
- **表示**: 「JP」⇔「EN」テキストラベル
- **デザイン**: 完全透明ボタン（`bg-transparent border-transparent hover:bg-transparent hover:border-transparent`）
- **実装**: `react-i18next`ライブラリ使用、localStorage永続化
- **自動検出**: ブラウザ言語から初期言語設定

---

## 🎨 キャンバス塗りつぶし機能仕様

### フラッドフィル（塗りつぶし）アルゴリズム設定
- **実装場所**: `src/components/PaintCanvas.tsx` の `floodFill` 関数
- **アルゴリズム**: スタックベース + ビットマップ最適化フラッドフィル
- **隙間ブリッジ機能**: 小さな隙間を越えて閉じた領域を塗りつぶし

### 調整可能パラメータ（コード上部に配置）
```typescript
const colorTolerance = 8;        // 色の許容閾値（0-255）
const gapBridgeDistance = 3;     // 隙間をブリッジする最大距離（px）
const gapSearchRadius = 1;       // 隙間検索時の探索半径（px）
```

### 動作仕様
- **基本塗りつぶし**: 色差8以下の同色領域を塗りつぶし
- **隙間ブリッジ**: 最大3px幅の隙間を越えて同色領域に到達可能
- **厳格条件**: 隙間は2px以下、到達先の80%以上が同色の場合のみ
- **方向制限**: 水平・垂直方向のみ（斜め除外）、1方向のみブリッジ
- **パフォーマンス**: ビットマップ訪問管理、マンハッタン距離計算で高速化

### 防止機能
- **全体塗りつぶし防止**: 厳格な条件により意図しない広範囲塗りつぶしを回避
- **重複処理防止**: ビットマップによる効率的な訪問済み管理
- **無限ループ防止**: 範囲外チェックと訪問済みチェック

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

## 🎨 カラーピッカー統一ルール

### デザインパターン
- **採用パターン**: カラーボックス内中央配置の Palette アイコン
- **アイコン**: `lucide-react` の `Palette`
- **配置**: カラーボックスの中央に直接配置
- **サイズ統一**: ColorItemと同じサイズ（デスクトップ46x46px、モバイル24x24px）
- **コントラスト対応**: ベースカラーの明度に応じてアイコン色を動的変更

### 技術実装
- **input要素**: カラーボックス全体に透明オーバーレイ (`absolute inset-0 opacity-0 z-10`)
- **イベント制御**: カラーボックスに `pointer-events-none` でクリックを透過
- **アイコン色算出**: `chroma.js`でlightness取得、0.5基準で明暗切り替え
  - 明るい色: `#374151` (gray-700)
  - 暗い色: `#f9fafb` (gray-50)
- **ホバー効果**: `hover:scale-110` で全体スケールアップ

### レイアウト仕様
- **デスクトップ**: 46x46px（COLOR_BLOCK_SPECの実際の色表示エリア）
- **モバイル**: 24x24px（ColorItemのcompactモードと統一）
- **アイコンサイズ**: デスクトップ20px、モバイル12px
- **ボーダー**: `BORDER_PRESETS.colorBlock` 統一仕様

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

#### 統一レイアウト構造（2025-07-01更新）
- **全ページ共通**: Layoutコンポーネント（`src/components/Layout.tsx`）でラップ
- **グローバルヘッダー**: ナビゲーションメニュー + ボタン群（チュートリアル・スワイプ・ヘルプ・テーマ切り替え）
- **統一ナビゲーション**: 全ページで同じヘッダーナビゲーションを表示
- **レスポンシブヘッダー**: `border-b border-border bg-background flex-shrink-0`

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

### フォントスタック（2025-07-01更新）
- **メイン**: Outfit（モダン・読みやすい）
- **見出し**: Space Grotesk（テクニカル・洗練）
- **ディスプレイ**: Syne（アーティスティック・独特）
- **コード**: Space Mono（未来的・クール）
- **スタイリッシュ**: Syne（ラベル・タグ用）

### 色分け・使用例
- **HEXコード**: `font-mono`（Space Mono - 未来的でテクニカル）
- **ラベル**: `font-stylish uppercase tracking-wider`（Syne - 洗練されたラベル）
- **見出し**: `font-heading`（Space Grotesk - モダンで読みやすい）
- **ディスプレイ**: `font-display`（Syne - インパクトのある表示）
- **説明文**: `font-sans`（Outfit - 標準的な読みやすさ）

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

### 肌色推薦仕様（2025-07-10追加）
- **固定色表示**: 10色の肌色パレット（色白系→やや褐色系）
- **色順序**: ベース色と頬色のペアを5段階で表示
- **コンポーネント**: `SkinColorRecommendations.tsx` で実装
- **レイアウト**: 既存のColorGridコンポーネントを使用
- **機能**: 表示のみ（クリック機能なし）
- **固定色リスト**: 
  - 色白系: `#FFF5F0`（ベース）, `#FFDCD1`（頬）
  - 明るめナチュラル: `#FFEBE1`（ベース）, `#FFCDC1`（頬）
  - 標準的な肌色: `#FFE1CD`（ベース）, `#FFC3AA`（頬）
  - 健康的な褐色: `#FAD2B4`（ベース）, `#FFAF8C`（頬）
  - やや褐色系: `#FABE96`（ベース）, `#FFA582`（頬）

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
- **色相環UI統一**: 色相環選択UIの背景と枠線は `BORDER_PRESETS.colorBlock` を使用し、他のカラーボックスと統一
- **背景色統一**: 色相環コンテナは `bg-background` を使用してテーマに応じた背景色を適用
- **配色技法選択バー統一**: 配色技法選択バーとドロップダウン項目の背景は `bg-background`、枠線は `border border-border rounded-md` を使用してベースカラー選択エリアのカード枠線と統一
- **配色技法ドロップダウン仕様**: PC版では4列表示（`grid-cols-4`）、固定幅600pxで親コンテナの制約を回避

---

## 🎨 アイコン統一ルール

### アイコン色統一仕様
- **統一クラス**: すべてのアイコンに `text-foreground` クラスを適用
- **テーマ対応**: ライト・ダークモード自動切り替え
  - **ライトモード**: 暗い色（`oklch(0.145 0 0)`）
  - **ダークモード**: 白っぽい色（`oklch(0.985 0 0)`）
- **ライブラリ**: `lucide-react` アイコンセット使用
- **アイコン選定**: [Lucide公式サイト](https://lucide.dev)から適切なアイコンを選択

### 適用対象アイコン
- **ナビゲーション**: Home, Menu, X, ChevronUp, ChevronDown
- **機能アイコン**: Sun/Moon（テーマ切り替え）, CircleDashed（リセット）, Copy, Check（コピー）
- **UI要素**: Languages, Bug（デバッグ）, Palette, UploadCloud等

### 実装ルール
- **必須クラス**: 新規アイコンには必ず `text-foreground` を追加
- **固定色禁止**: `text-red-500` 等の固定色クラス使用禁止
- **一貫性保持**: プロジェクト全体で統一された視覚体験を提供
- **アクセシビリティ**: テーマ変更時の視認性を確保

### 実装例
```tsx
// ✅ 正しい実装
<CircleDashed className="w-4 h-4 text-foreground" />
<Home className="w-5 h-5 text-foreground" />

// ❌ 避けるべき実装
<CircleDashed className="w-4 h-4 text-gray-600" />
<Home className="w-5 h-5" /> // 色指定なし
```

### アイコン選定ガイドライン
- **公式サイト参照**: https://lucide.dev でアイコンを検索・確認
- **機能適合性**: アイコンの意味が機能と一致することを確認
- **視覚的一貫性**: プロジェクト全体で統一された印象を保つ
- **アクセシビリティ**: 明確で理解しやすいアイコンを選択

---

## 🎨 色相環UI視覚補助ルール

### 基本仕様
- **表示トリガー**: 配色技法選択ドロップダウンのホバー時に表示
- **目的**: 色相環における配色関係の視覚的理解を補助
- **認知負荷軽減**: 必要時のみ表示し、常時表示による情報過多を回避

### デバイス別動作仕様

#### PC版 (マウス操作)
- **表示方法**: マウスカーソル追従表示
- **位置調整**: 画面端はみ出し時は自動位置調整
- **非表示**: マウスリーブ時・選択完了時に即座に非表示
- **背景**: 不透明背景 (`bg-card`)

#### モバイル版 (タッチ操作)  
- **表示方法**: 画面中央固定表示
- **自動非表示**: 3秒後に自動で非表示
- **背景**: 半透明背景 (`bg-card/80 backdrop-blur-sm`)
- **タップ操作**: PC版マウスイベントと分離処理

### 色相環コンポーネント仕様

#### サイズ構成 (固定値管理)
- **外枠半径**: 125px (containerRadius)
- **色相環半径**: 115px (wheelRadius) 
- **プロット配置半径**: 86px (plotRadius)
- **表示枠サイズ**: 200px × 200px

#### 視覚要素
- **中心点**: 4px半径の円、全要素の最前面表示
- **配色点**: 4px半径の円、統一サイズ
- **接続線**: 中心から全配色点への実線接続
- **軌道線**: プロット配置位置を示す点線円
- **外枠**: 色相環境界を示す枠線

#### 角度計算とプロット
- **基準角度**: 配色技法の`angles`配列を使用
- **座標計算**: `(angle - 90) * Math.PI / 180` で真上基準
- **ベースカラー**: angle=0として真上(12時位置)に配置
- **色相関係**: 純粋な配色技法角度関係を表示

### 実装技術仕様

#### React Portal使用
- **DOM配置**: `createPortal(element, document.body)`
- **目的**: 親要素のstacking context制約回避
- **固定位置**: `position: fixed`で画面基準配置

#### デバイス検出
- **判定条件**: User-Agent + 画面幅768px以下
- **分離処理**: PC/モバイルでイベントハンドリング分離
- **最適化**: デバイス特性に応じたUX提供

### ファイル構成
- **メインコンポーネント**: `src/components/common/ColorWheel.tsx`
- **統合コンポーネント**: `src/components/ColorRecommendations.tsx` 
- **データソース**: `src/store/colorStore.ts` の `COLOR_SCHEMES.angles`
- **設定ルール**: 本`PROJECT_RULES.md`ファイル

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
| Layout | `/src/components/Layout.tsx` | 全ページ共通レイアウト・ヘッダー統一 |
| App | `/src/App.tsx` | ホームページメインコンテンツ |
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

### ヘッダー・ナビゲーション構造（2025-07-01更新）

#### 統一Layoutコンポーネント
- **ファイル**: `src/components/Layout.tsx`
- **用途**: 全ページ共通のヘッダー・フッター・基本構造
- **ルーティング**: main.tsxで各ページをLayoutでラップ
- **props**: `showHeader?: boolean` でヘッダー表示制御

#### ヘッダーレイアウト
```
Layout
└── header (border-b border-border bg-background flex-shrink-0)
    └── container (mx-auto px-4 py-3)
        └── flex (justify-between items-center)
            ├── div (flex items-center gap-2)
            │   ├── TutorialButton (Play icon)
            │   ├── SwipeButton (ClipboardPenLine icon, Link to="/swipe")
            │   ├── HelpButton (HelpCircle icon, Link to="/help")
            │   └── ThemeToggle (Sun/Moon icon)
            └── NavigationMenu (ハンバーガーメニュー - 右端配置)
```

#### NavigationMenu仕様
- **トリガー**: ハンバーガーアイコン（Menu/X）
- **レイアウト**: ドロップダウン式メニュー
- **背景**: backdrop-blur-sm 効果
- **メニュー項目**: ホーム、ダミーページ1-3、ヘルプ

#### ページ配置調整ルール
- **スワイプページ**: ステータスバー位置を `top-16` (モバイル) / `top-20` (デスクトップ) に調整
- **一般ページ**: ヘッダー下の適切な余白を確保
- **個別ヘッダー禁止**: 各ページで独自ヘッダーを作成せず、Layout統一を使用

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

## 🎯 スワイプ式色推薦ページ仕様

### スワイプページ基本設計
- **ルート**: `/swipe`
- **レイアウト**: フルスクリーン背景、カード中央配置
- **操作方法**: 水平スワイプジェスチャーによる評価
- **画面制約**: 上下スクロール完全禁止、h-screen w-screen固定

### カードデザイン仕様
- **モバイル**: `w-[80vw] max-w-sm` - レスポンシブ幅
- **PC版**: `w-[640px] h-[400px]` - 黄金比（8:5）固定サイズ
- **カード構造**: `w-full` で親コンテナに合わせて調整
- **角丸**: `rounded-[2rem]` - 大きな角丸で現代的デザイン

### アニメーション・インタラクション
- **回転制限**: `Math.max(-30, Math.min(30, dragX * 0.15))` - ±30度まで
- **スワイプ閾値**: 100px または velocity 500px/s
- **フェードアウト**: `x: ±300, opacity: 0` でカード退場
- **スプリングアニメーション**: `stiffness: 300, damping: 30`

### UI要素配置
- **ナビゲーション要素**: レスポンシブ位置設定 `justify-between`
  - モバイル: `top-8 left-6 right-6`
  - PC: `top-12 left-12 right-12`
- **戻るボタン**: `<ArrowLeft>` - ホームページ（/）へのナビゲーション
- **カウンター表示**: 中央配置、透明背景、`color: textColor` のみ
- **お気に入りボタン**: `<Star>` - パレットをお気に入りに追加、填充で状態表示
- **ボタンスタイル**: 完全透明（`backgroundColor: transparent`, `border: transparent`）
- **スクロール制御**: position:fixed + touchmove preventDefault

### 背景・レイアウト
- **フルスクリーン**: `h-screen w-screen` - デバイス全画面使用
- **余白除去**: html, body, #root すべて margin:0 padding:0
- **背景色**: `bg-background`でテーマ対応（白/黒）
- **カード色**: 各パレットのmainColorがカード背景
- **コンテンツ配置**: `flex-1 flex items-center justify-center`

### ナビゲーション連携
- **ホームページアクセス**: ヘッダー右側に`ClipboardPenLine`アイコンで`/swipe`リンク
- **戻る機能**: スワイプページから`ArrowLeft`ボタンで`/`へ戻る
- **お気に入り機能**: `Star`アイコンで配色パレットをローカル保存

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
│   ├── Layout.tsx                  # 全ページ共通レイアウト・ヘッダー統一
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
│   │   ├── ColorWheel.tsx          # 色相環視覚補助コンポーネント
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

## 🎡 色相環UI視覚補助ルール

### 色相環表示システム仕様

#### 基本表示ルール
- **表示条件**: 配色技法選択ドロップダウンの項目ホバー時のみ表示
- **表示内容**: 配色技法のangles配列に基づく正確な色相関係を視覚化
- **コンポーネント**: `ColorWheel.tsx` を使用（統一コンポーネント）
- **配置**: React Portal を使用してdocument.bodyに直接レンダリング

#### デバイス別動作仕様

##### PC版（デスクトップ）
- **表示タイミング**: マウスホバー時に即座表示
- **非表示タイミング**: マウスリーブ時に即座非表示
- **位置**: マウスカーソルの右20px、垂直中央配置
- **背景**: 完全不透明（`bg-card`）
- **自動非表示**: なし（ホバー制御のみ）

##### モバイル版（タッチデバイス）
- **表示タイミング**: タップ時に表示
- **非表示タイミング**: 3秒後自動非表示
- **位置**: タップ位置基準（画面端調整あり）
- **背景**: 半透明80%（`bg-card/80 backdrop-blur-sm`）
- **自動非表示**: 3秒タイマー

#### 色相環ビジュアル仕様
- **外枠円**: 色相環の境界線
- **軌道線**: プロット点配置円を点線表示（strokeDasharray="5,3"）
- **ベースカラー**: 12時方向（真上）に配置、大きいマーカー（半径6px）
- **関連色**: 配色技法角度に基づく配置、小さいマーカー（半径4px）
- **接続線**: 中心から各プロット点への点線
- **サイズ**: 半径56px、コンテナ160x160px

#### 技術実装ルール
- **角度計算**: `(angle - 90) * Math.PI / 180` でベースカラーを真上配置
- **デバイス判定**: User-Agent + 画面幅768px以下でモバイル判定
- **Portal使用**: 親要素のスタッキングコンテキスト回避
- **イベント制御**: PC/モバイルで異なるマウスイベント処理

#### 禁止事項
- 色相環の常時表示
- baseHue依存の角度計算（純粋な配色技法角度を使用）
- 固定位置配置（必ずマウス/タップ位置ベース）
- デバイス判定なしの統一動作

---

## ✅ 最近解決された課題

### PC版色相環選択バーの表示・レイアウト問題（2025-06-25解決）
- **問題**: PC版の色相環選択バー下部見切れ、レスポンシブ列数の複雑さ
- **解決策**: 
  - **列数シンプル化**: `grid-cols-2 xl:grid-cols-6`（モバイル2列・PC6列）
  - **レイアウト変更**: 色相環と名前を縦配置から横配置に変更
  - **サイズ最適化**: ColorWheelMiniを20px→28pxに拡大
  - **Flex最適化**: `flex-shrink-0`、`flex-1`でレイアウト安定化
- **結果**: PC版での下部見切れ解消、視認性向上

### 色相環デザイン統一（2025-06-25解決）
- **問題**: 色相環の点の色がバラバラ、透明度による視認性低下、不要な中心点
- **解決策**:
  - **色統一**: 全ての点を青色（`#3b82f6`）に統一
  - **透明度削除**: `opacity-60`、`opacity-80`を削除して完全不透明に
  - **中心点削除**: 不要な中心円を削除してクリーンな見た目に
  - **枠線調整**: 適切な太さに調整（ColorWheel: 1.5px/1px、ColorWheelMini: 0.8px/0.5px）
- **結果**: 統一感のあるクリーンな色相環デザイン

## 🚧 未解決課題・TODO

### キャンバスUI要素間のスペーシング調整（中優先度）
- **現状**: ペン/消しゴム/塗りつぶしボタン、Undo/Redoボタン、ペンサイズ調整ボタン同士の間隔が狭い
- **要件**: 各ボタン群内のボタン同士に適切なパディング（4px-20px程度）を設ける
- **課題**: gap-5（20px）に変更したが視覚的変化が見られず、元の設定に戻された
- **次回対応**: ボタン間隔の調整方法を再検討（margin、padding、gap以外のアプローチ含む）

### 色相環の色テーマ対応（低優先度）
- **現状**: 色相環の点が固定色（`#3b82f6`）で統一されている
- **将来的改善案**: ライト・ダークモード対応の動的色変更
- **優先度**: 低（現在の固定色でも十分な視認性を確保済み）

---

## 📱 スワイプ式色推薦ページ仕様（2025-07-01追加）

### 基本仕様
- **ルート**: `/swipe`
- **コンポーネント**: `SwipeRecommender.tsx`
- **目的**: モバイルアプリライクなスワイプ操作による配色評価UI

### レイアウト・デザイン仕様

#### フルスクリーン背景
- **背景色**: メインカラーが画面全体の背景（`backgroundColor: currentPalette.mainColor`）
- **余白**: 画面端から`px-8 py-6`、適切な視覚的余白を確保
- **カードサイズ**: 画面幅の80%（`w-[80vw] max-w-sm`）

#### カードデザイン
- **メインカード**: 角丸32px（`rounded-[2rem]`）、太い境界線4px
- **背景**: 極薄透明背景（`${textColor}05`）でコントラスト対応
- **内部余白**: `p-10`で十分な内部スペース
- **コンテンツ幅**: カード内要素は90%幅（`w-[90%] mx-auto`）

#### タイポグラフィ
- **HEXコード**: `text-4xl font-mono tracking-[0.2em]`（Space Mono）
- **ラベル**: `font-stylish uppercase tracking-widest`（Syne）
- **メタ情報**: `font-heading`（Space Grotesk）
- **英語表記**: "Main Color", "Technique", "Tone", "SWIPE TO RATE"

### 機能仕様

#### スワイプ操作
- **ライブラリ**: framer-motion + react-swipeable
- **左スワイプ**: Dislike → 次のカードへ
- **右スワイプ**: Like → 次のカードへ
- **アニメーション**: 回転・フェード・スケール効果

#### インタラクション
- **スワイプインジケーター**: ドラッグ中に"LIKE"/"NOPE"表示
- **ボタン操作**: 下部のハート・Xボタンでも操作可能
- **ホバー効果**: パレット色にホバーでHEXコード表示

#### 状態管理
- **評価記録**: like/dislikeを配列で保持
- **結果表示**: 全カード完了後に統計表示
- **リセット機能**: "もう一度試す"でセッション再開

### データ仕様
- **サンプルデータ**: `src/data/palettes.json`（10件の配色パレット）
- **カラーパレット構造**: mainColor、colors配列、technique、tone、tags
- **配色技法**: アナロジー、補色、トライアド、モノクロマティック等

### 技術実装

#### フォント・コントラスト
- **自動色調整**: `getContrastColor()`でメインカラーに応じてテキスト色を白/黒切り替え
- **統一透明度**: 背景要素は03-08の統一透明度システム

#### レスポンシブ対応
- **モバイル最適化**: タッチジェスチャー完全対応
- **デスクトップ**: マウス操作でも利用可能
- **ビューポート**: 各デバイスで適切な余白とカードサイズ

---

## 📝 開発履歴・セッションログ

### 🎯 メジャー機能追加履歴

#### [2025-07-01] スワイプ式色推薦ページ実装
- **スワイプ式色推薦ページ**: `/swipe` ルートで新しいモバイルアプリ風UI実装
  - **フルスクリーン背景**: メインカラーが画面全体を占める没入型デザイン
  - **スワイプ操作**: framer-motion + react-swipeableによる滑らかなジェスチャー操作
  - **配色カード**: 10種類の配色パレットサンプルデータ（`src/data/palettes.json`）
  - **評価システム**: Like/Dislikeスワイプによる配色評価・統計表示
  - **レスポンシブ対応**: 画面幅80%のカードサイズで適切な余白確保

#### [2025-06-17] 全面UIリデザイン・モバイル最適化
- **グラデーション並び替え機能**: `sortColorsByLightness`関数でchroma.js lightness値による明るい→暗い順ソート
- **スマホ用2列レイアウト**: 40px色ブロック + コピーボタン + カラーコード
- **モダンUIデザイン**: ナビゲーション固定ヘッダー + バックドロップブラー
- **ミニマルデザイン適用**: 冗長な説明文削除、ステップ名明確化
- **角丸デザイン変更**: `rounded`（4px）→ `rounded-sm`（2px）でシャープ化

#### [2025-06-20] 超コンパクトモバイル表示
- **モバイル単画面表示最適化**: セクションタイトル縮小、余白網羅的削減
- **固定ヘッダーとビューポート最適化**: ナビゲーションバー直下からコンテンツ表示
- **下部余白完全削除**: 画面下部に不要な背景色領域を残さない設計

### 🔧 技術改善履歴

#### 色表示技術の進化
1. **ピクセルサイズ表示** → **Canvas要素** → **48px Button統一**
2. **近似計算** → **実際のピクセル分析（deltaE色差使用）**
3. **バラバラなサイズ** → **48px統一仕様**
4. **複雑なレイアウト** → **シンプルなモバイルUI**

#### UI統一化・コンポーネント化
- **統一ColorBlockコンポーネント**: 全色表示を統一（`src/components/common/ColorBlock.tsx`）
- **統一CopyColorButtonコンポーネント**: 3種類のバリアント（minimal, compact, full）
- **UI統一定数**: `src/constants/ui.ts`で48px Canvas仕様を統一定義
- **ボーダー・スタイリング統一管理**: `BORDER_PRESETS`での一元管理

#### レスポンシブ・モバイルファースト
- **レスポンシブグリッド**: 2-6列のモバイル対応グリッド統一
- **モバイルファーストデザイン**: 縦並びカード型レイアウトでタッチ操作最適化
- **アクセシビリティ向上**: 十分な色見本サイズと明確なラベリング

#### 国際化・ナイトモード
- **配色技法名英語化**: 補色配色→Dyad、三角配色→Triad、四角配色→Tetrad等
- **ナイトモードデフォルト**: App.tsxに`dark`クラス追加
- **おしゃれフォント設定**: Inter（メイン）、JetBrains Mono（コード）

### 📋 主要コミット履歴

#### 最新（2025-07-01）
- `f145dad` - Update PROJECT_RULES.md with latest layout and navigation structure
- `c07eb47` - Add CLAUDE.md with complete project rules for session persistence
- `8967eda` - Move hamburger menu to right side of navigation bar
- `428cc97` - Add global navigation layout and refactor page structure

#### グラデーション・モバイル最適化（2025-06-17）
- `ed210e0` - Add gradient sorting for color recommendations
- `9c5be61` - Consolidate project rules into single PROJECT_RULES.md
- `b401e56` - Implement mobile 2-column layout for color and tone recommendations
- `d4900c4` - Implement modern minimal UI design overhaul
- `cf4225e` - Add mandatory copy button implementation rules

#### コンパクト表示・構文修正（2025-06-20）
- `2884c0c` - Optimize mobile UI spacing for compact single-screen display
- `d3597e6` - Further optimize mobile spacing and fix syntax errors
- `bb77e3f` - Remove bottom margin and add mobile optimization rules

#### 色表示技術確立（2025-06-16）
- `581d730` - Improve responsive design for color recommendation pages
- `99a9c07` - Fix color extraction percentage calculation and standardize color display sizes
- `3a3b09d` - Standardize all color displays to 64px and document UI specifications

### 🏗️ 現在のアーキテクチャ状態

#### UI統一仕様
- **色表示**: 48px × 48px Canvas要素、`border-2 border-gray-300`、`rounded-sm`（2px）
- **レスポンシブグリッド**: 色表示2-5列、配色技法2-6列、`gap-3`統一
- **モバイル最適化**: `pt-1 pb-0`、超コンパクト表示、シングルスクリーン設計

#### 技術スタック
- **色処理**: ColorThief + chroma-js、deltaE色差判定、実際ピクセル数計算
- **状態管理**: Zustand（軽量グローバル状態）
- **UI**: shadcn/ui + Tailwind CSS、モバイルファーストデザイン
- **配色技法**: 13種類（Identity, Analogous, Dyad, Triad, Tetrad, Split, Pentad, Hexad等）

#### コンポーネント構成
- **統一レイアウト**: Layout.tsx（全ページ共通ヘッダー・ナビゲーション）
- **色表示統一**: ColorBlock.tsx、CopyColorButton.tsx
- **レスポンシブグリッド**: ColorGrid.tsx、ColorItem.tsx
- **配色技法**: ColorRecommendations.tsx、ToneRecommendations.tsx

---

## 🚧 未解決課題・TODO

### 色相環選択バーのレスポンシブ表示問題（高優先度）
- **問題**: PCでも色相環選択バーが2列で表示される
- **期待動作**: スマホ2列、PC4列の適切なレスポンシブ表示
- **現状**: `grid-cols-2 sm:grid-cols-4` が期待通りに動作していない
- **影響範囲**: `src/components/ColorRecommendations.tsx` の配色技法ドロップダウン
- **調査要件**: 
  - Tailwind CSSブレークポイント動作の確認
  - ドロップダウン幅制限との競合チェック
  - 代替レスポンシブアプローチの検討

### 左右分割レスポンシブレイアウト問題（高優先度）
- **問題**: デスクトップで左右分割レイアウトが表示されず、すべて縦積みになる
- **期待動作**: スマホ（~1023px）縦積み、PC（1024px以上）左右分割
- **現状**: `hidden lg:flex` と `lg:hidden` の組み合わせが期待通りに動作しない
- **影響範囲**: `src/App.tsx` のメインレイアウト切り替え
- **調査要件**:
  - Tailwind CSSレスポンシブ条件の検証
  - Layout.tsx の高さ制約（h-screen）との競合チェック
  - 強制表示は動作するため、条件文の論理的問題の可能性
- **テスト済み**:
  - 強制表示（`flex`）: ✅ 正常動作
  - 逆転条件: ✅ 動作確認済み
  - 各ブレークポイント（md, lg, xl）: ❌ すべて縦積み表示

### 解決予定
- レスポンシブ条件の根本的見直し
- 代替アプローチの検討（CSS Grid、JS制御等）
- 次回セッションで優先的に対応

---

**最終更新**: 2025-07-03  
**適用プロジェクト**: 色推薦アプリ プロジェクト全体  

このルールは、Claude Code セッションが毎回リセットされることを考慮して、**毎回最初に貼って読み込ませてください。**