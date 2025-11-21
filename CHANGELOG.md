# Changelog

このファイルは、色推薦アプリプロジェクトの開発履歴を記録します。

## 2025-11-21

### ベースカラー選択を24色相パレット形式に変更

**変更内容:**
- 従来のHTML5カラーピッカーから、15度区切りの24色相パレット（明度50、彩度100）に変更
- 12列×2行のグリッドレイアウトで表示
- 選択中の色相を四角で縁取りハイライト表示
- 折り畳みボタンを削除し、常時表示に変更
- ImageUploadコンポーネントを削除

**理由:**
- より直感的な色選択UI
- CLAUDE.md規定のColorBlock統一仕様に準拠
- トーン推薦と統一されたハイライトデザイン

**変更ファイル:**
- `src/components/ColorPicker.tsx`
- `src/components/layout/LayoutRenderer.tsx`
- `src/constants/layout.ts`
- `src/i18n/locales/ja.json`
- `src/i18n/locales/en.json`

**コミット:**
- `7b37213` ベースカラー選択を24色相パレット形式に変更し、クリック展開式UIを実装
- `28f593a` カラーピッカーのパレットを横一列レイアウトに変更
- `199062a` 24色パレットを2列（12色×2行）のグリッド表示に変更
- `eb9b037` 選択中の色相をハイライト表示する機能を追加
- `34cc624` 折り畳みボタンとImageUploadコンポーネントを削除
- `63116d5` ベースカラー選択のUI改善：更新ボタン非表示とパレット初期展開

---

### ページ読み込み時と画像ロード時に使用色を自動抽出

**変更内容:**
- CanvasColorRecommendationsコンポーネント初期化時に自動色抽出を実行
- 画像アップロード完了後に自動色抽出を実行
- URLから画像ロード完了後に自動色抽出を実行（実験ページのタスク切り替えに対応）
- 色抽出前に使用色をクリアして前のページの色が残らないように修正

**理由:**
- ページ読み込み時に使用色の割合が自動更新されるように
- 実験ページでタスク切り替え時（UI1→UI2、TaskA→TaskB）に使用色が正しく更新されるように
- ユーザーが手動で更新ボタンを押す必要をなくす

**変更ファイル:**
- `src/components/CanvasColorRecommendations.tsx`
- `src/App.tsx`

**コミット:**
- `b271a7f` 画像ロード時に使用色を自動抽出する機能を追加

---

## 2025-10-21

### Input要素のテキスト色をテーマ対応に修正

**変更内容:**
- Input UIコンポーネントに `text-foreground` クラスを追加
- ライトモードでは暗い色、ダークモードでは明るい色で入力テキストを表示

**理由:**
- ダークモードでの入力テキストの視認性が低かった
- テーマに応じた適切な色で表示することで可読性向上

**変更ファイル:**
- `src/components/ui/input.tsx`

---

### 参加者ID入力ボックスの縦幅を1.5倍に拡大

**変更内容:**
- ExperimentIntroPage: 参加者ID入力ボックスの高さを `h-14` (56px) から `h-[84px]` (84px) に変更

**理由:**
- 入力エリアを大きくして視認性向上
- タップ・クリック操作をしやすく

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

---

### 実験導入ページのレイアウトを中央揃え・幅制限

**変更内容:**
- ExperimentIntroPage: コンテナ幅を70%に設定（`w-[70%]`）
- ExperimentInstructions: コンテナ幅を70%に設定、中央揃え適用（`w-[70%] mx-auto`）

**理由:**
- 実験説明の可読性向上
- 中央揃えで視線の集中を促進
- 適切な幅制限で長い文章を読みやすく

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`
- `src/components/ExperimentInstructions.tsx`

---

### T1とT2のカード高さを統一

**変更内容:**
- MassColorGrid: カードに固定高さ `h-[600px]` を設定、フレックスレイアウト適用
- HueWheelToneSlider: カードに固定高さ `h-[600px]` を設定、フレックスレイアウト適用
- CardContentに `flex-1 overflow-auto` を追加してオーバーフロー制御

**理由:**
- T1（カラーパレット）とT2（色相環＋トーンスライダー）の表示下端を揃える
- 実験条件間での視覚的統一感を向上
- コンテンツ量に関わらず一貫した高さを維持

**変更ファイル:**
- `src/components/MassColorGrid.tsx`
- `src/components/HueWheelToneSlider.tsx`

---

### T1のカードタイトル「カラーパレット」を削除

**変更内容:**
- MassColorGrid: CardHeaderとCardTitleを削除
- T2と同様にタイトルなしのシンプルなUIに統一

**理由:**
- 実験参加者の認知負荷を軽減
- 視覚的要素（カラーグリッド）のみに集中できるUIに

**変更ファイル:**
- `src/components/MassColorGrid.tsx`

**コミット:** `e884d91` - refactor: T1のカードタイトル「カラーパレット」を削除

---

### T2のテキスト表示を一部削除してUIをシンプル化

**削除したテキスト:**
- カードタイトル「色相環＋トーンスライダー」
- 色相値の表示「色相: 66°」
- 彩度×明度プロットのタイトル「彩度 × 明度」
- 彩度・明度の値表示「彩度: 87% / 明度: 9%」

**維持したテキスト:**
- スライダーのラベル「彩度 (Saturation)」「明度 (Lightness)」と数値
- カラープレビューのラベル「現在の描画色」とHEX値

**理由:**
- 実験参加者の認知負荷を軽減
- 操作に必要な情報（スライダー値・描画色）は残す

**変更ファイル:**
- `src/components/HueWheelToneSlider.tsx`

**コミット:**
- `f220217` - refactor: T2の全テキスト表示を削除してUIをシンプル化
- `9f3d3a1` - fix: T2のスライダーラベル・数値と描画色表示を復元

---

### T2に彩度×明度の2次元プロットを追加

**変更内容:**
- Test2（色相環+トーンスライダー）に、彩度（横軸）×明度（縦軸）のデカルト平面プロットを追加
- クリック・ドラッグで彩度と明度を同時に操作可能
- 現在位置をマーカー（白丸+黒枠）で表示
- グリッド線（5×5）で視認性を向上
- スライダーと双方向で連動

**実装詳細:**
- プロットサイズ: 200×200px
- グラデーション表現:
  - 左上: 白（彩度0%, 明度100%）
  - 右上: 純色（彩度100%, 明度100%）
  - 左下: 黒（彩度0%, 明度0%）
  - 右下: 暗い純色（彩度100%, 明度0%）
- ドラッグ状態管理（isDraggingPlot）でスムーズな操作を実現

**ユーザー体験:**
- スライダーと2次元プロットの両方で操作可能
- より直感的な色選択が可能に

**変更ファイル:**
- `src/components/HueWheelToneSlider.tsx`

**コミット:** `7df2727` - feat: T2に彩度×明度の2次元プロットを追加

---

### T2色相環の二重表示を修正

**不具合内容:**
- Test2の色相環で色相が二重に表示される

**原因:**
- linearGradientを使った外側の円（stroke）とセグメント方式の色相グラデーションが重複表示

**修正内容:**
- linearGradientを使った外側の円を削除
- セグメント方式の色相グラデーション（360個のpath要素）のみを残す

**変更ファイル:**
- `src/components/HueWheelToneSlider.tsx`

**コミット:** `7aba823` - fix: T2色相環の二重表示を修正

---

### Test1・Test2でベース色選択を非表示に変更

**変更内容:**
- Test1（カラーパレット）とTest2（色相環+スライダー）では、ベース色選択セクションを非表示
- Test3（推薦機能あり）では従来通りベース色選択を表示

**理由:**
- T1/T2では直接色を選択するUIのため、ベース色選択が不要
- UIをシンプルにして実験参加者の認知負荷を軽減

**実装:**
- `ExperimentPage.tsx`の`filterComponentsByCondition`関数に、Test1・Test2時の`baseColor`フィルタリングロジックを追加

**変更ファイル:**
- `src/pages/ExperimentPage.tsx`

**コミット:** `12c47cb` - feat: Test1・Test2でベース色選択を非表示に変更

---

### 実験ページT1/T2で描画色が即座に変更されない不具合の修正

**不具合内容:**
- 実験ページのT1（カラーパレット）でカラーボックスをクリックしても描画色が変わらない
- T2（色相環+トーンスライダー）で色相環クリック・スライダー操作しても描画色が変わらない

**原因:**
- CanvasColorRecommendationsコンポーネントが`selectedColor`を使用
- MassColorGrid・HueWheelToneSliderが`paintColor`を更新
- 2つの状態が同期されておらず、描画色が反映されない

**修正内容:**
- HueWheelToneSlider: 適用ボタンを削除し、`useEffect`で色変更時に即座に`paintColor`を更新
- CanvasColorRecommendations: `selectedColor`から`paintColor`へ全面的に統一
  - useColorStoreからの取得を変更
  - 全ての描画処理（ペン・塗りつぶし・スポイト）で`paintColor`を使用
  - カラーピッカー・プレビュー表示も`paintColor`に統一

**動作確認:**
- T1: カラーボックスクリック → 即座に描画色変更 ✓
- T2: 色相環クリック → 即座に描画色変更 ✓
- T2: 彩度スライダー操作 → リアルタイムで描画色変更 ✓
- T2: 明度スライダー操作 → リアルタイムで描画色変更 ✓

**変更ファイル:**
- `src/components/HueWheelToneSlider.tsx`
- `src/components/CanvasColorRecommendations.tsx`

**コミット:** `ed2aa51` - fix: 実験ページT1/T2でクリック時に描画色が即座に変更されるように修正

---

## 2025-10-19

### 実験ページでの推薦表示不具合の修正

**不具合内容:**
- 実験ページ（`/experiment/task?cond=C1`など）で色相推薦・トーン推薦が表示されない
- URLパラメータで設定した条件（C1, C2, C3）が推薦コンポーネントに反映されない

**原因:**
- ColorRecommendations・ToneRecommendationsコンポーネントが`useConditionStore()`を使用
- ExperimentPageは`useExperimentStore()`を使用
- 2つのストアが同期されておらず、条件フラグが伝わらない

**修正内容:**
- ColorRecommendations・ToneRecommendationsに`useExperimentStore()`を追加
- 実験モード判定ロジックを実装：
  - `participantId`が設定されている場合（実験モード）→ `experimentStore.getFeatureFlags()`を使用
  - それ以外（通常モード）→ `conditionStore.getFlags()`を使用
- 通常モードと実験モードの両方で正しく動作するように改善

**動作確認:**
- C0: 推薦なし（正常に非表示）
- C1: 色相推薦のみ表示（正常に表示）
- C2: トーン推薦のみ表示（正常に表示）
- C3: 色相推薦とトーン推薦の両方表示（正常に表示）

**変更ファイル:**
- `src/components/ColorRecommendations.tsx`

**コミット:** `1e55d09` - fix: use experimentStore flags in recommendation components

---

### セクション折り畳み機能の無効化

**変更内容:**
- すべてのセクションの折り畳み機能を無効化（常に展開状態）
- 折り畳みUI要素（ChevronDown/Up/Leftアイコン）を削除
- 折り畳み関連のロジックを削除・簡略化
- RefreshCwボタン（キャンバス色抽出）は維持

**理由:**
- ユーザーの要望により、すべてのコンテンツを常に表示してアクセシビリティを向上
- 折り畳み操作の手間を削減し、よりシンプルなUIを実現
- 実験参加者が推薦機能を見逃すリスクを排除

**詳細な変更:**
- **App.tsx**:
  - すべての折り畳み状態を `false` に設定
  - 不要な `useEffect` フック（折り畳み状態管理）を削除
- **ExperimentPage.tsx**:
  - すべての折り畳み状態を `false` に設定
  - 条件に応じた折り畳み初期化ロジックを削除
- **LayoutRenderer.tsx**:
  - `SectionHeader` から折り畳みUI要素を削除
  - クリックイベント（`onClick={onToggle}`）を削除
  - `Section` コンポーネントの条件分岐を削除し、常に表示
  - βセクションの横方向折り畳みロジックを削除
  - デスクトップレイアウトの動的幅調整ロジックを削除

**影響範囲:**
- ホームページ（`/`）
- 実験ページ（`/experiment/task`）
- すべてのデスクトップ・モバイルレイアウト

**変更ファイル:**
- `src/App.tsx`
- `src/pages/ExperimentPage.tsx`
- `src/components/layout/LayoutRenderer.tsx`

**コミット:** `5b161fe` - feat: disable collapse functionality for all sections

---

## 2025-10-18

### C1〜C3条件で推薦UIを自動展開

**変更内容:**
- C1〜C3の条件時に、色相推薦・トーン推薦セクションを最初から展開状態で表示
- 条件（condition）が変更されたときに自動的にコラプス状態をリセット
- useEffectで条件に応じた初期化処理を追加

**理由:**
- 実験参加者が推薦機能をすぐに利用できるように
- 折りたたまれた状態から手動で展開する手間を削減
- よりスムーズな実験体験を提供

**変更ファイル:**
- `src/pages/ExperimentPage.tsx`

---

### 実験ページでα・βセクションを非表示化（PC・モバイル両対応）

**変更内容:**
- 実験中は肌色推薦（α. skinColor）を非表示に設定
- 実験中は使用色相/トーン抽出（β. hueToneExtraction）を非表示に設定
- `filterComponentsByCondition` 関数に除外ロジックを追加
- モバイルレイアウトでもフィルタリングが適用されるように `LayoutRenderer.tsx` を修正

**理由:**
- 実験参加者の認知負荷を軽減
- 実験タスクに関係ない機能を非表示にして集中力を向上
- シンプルなUI提供により実験の妥当性を確保
- PC・モバイル両方で統一した実験環境を提供

**変更ファイル:**
- `src/pages/ExperimentPage.tsx`
- `src/components/layout/LayoutRenderer.tsx`

---

### 実験開始セクションのパディング拡大

**変更内容:**
- CardHeaderのパディングを追加（`pt-6 pb-6 px-8`）
- CardContentのパディングを拡大（`pt-10 pb-10 px-10`）

**理由:**
- 「実験を開始」「参加者IDを入力して実験を開始してください」のテキストに十分な余白を確保
- より見やすく、リラックスした視覚体験を提供
- タイトル・説明文・入力フォームの視認性向上

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

---

### 実験ページUI仕様の追加

**変更内容:**
- CLAUDE.mdに実験ページUI仕様セクションを追加
- 2024年UI/UXベストプラクティスに基づくデザイン原則を文書化
- 参加者ID入力フォームの詳細仕様を記録

**仕様詳細:**
- **デザイン原則**: ミニマルデザイン、視覚要素による理解促進、モバイル対応、グラデーション効果
- **色分けシステム**: C0-C3条件の色分け仕様（スレート/青/紫/緑）
- **フォーム仕様**: 入力フィールドサイズ（h-14, text-xl）、ボタンサイズ（h-16, text-xl）、適切な余白（pt-8 pb-8 px-8）
- **アイコン使用**: Palette, Sparkles, Layers, Clock, InfoIcon, User, Play
- **禁止事項**: ホバーアニメーション、プログレスインジケーター、過剰な装飾

**変更ファイル:**
- `CLAUDE.md`

**コミット:** `17fb8f4` - feat: enhance experiment page input form visibility

---

### 実験ページ入力フォームの視認性向上

**変更内容:**
- 参加者ID入力フィールドのサイズを拡大（h-14, text-xl）
- 明示的なラベル「参加者ID」を追加
- 実験開始ボタンのサイズを拡大（h-16, text-xl）
- フォーム全体のパディングとスペーシングを改善（pt-8 pb-8 px-8, space-y-6）
- CardHeaderとAlertのスタイリング強化

**理由:**
- 入力フォームが見にくいとのフィードバックを受けて視認性を向上
- タップエリアの拡大によりモバイルでの操作性向上
- 適切な余白確保により視覚的な快適さを改善

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

**コミット:** `17fb8f4` - feat: enhance experiment page input form visibility

---

### ナビゲーションバーのアイコン更新

**変更内容:**
- スワイプ推薦ボタンのアイコンを `ClipboardPenLine` から `ScrollText` に変更
- SNS嗜好分析ボタンのアイコンは `BarChart3` のまま維持

**要望:**
- スワイプ推薦ページ（色の好みを選ぶページ）にスクロールアイコンを使用
- SNS嗜好分析はデータ分析を連想させるアイコンを使用

**変更ファイル:**
- `src/components/NavigationMenu.tsx`

**コミット:** `5c6140c` - refactor: update navigation icons for clarity

---

### 実験ページへのナビゲーションリンク追加

**変更内容:**
- `/experiment` ページへのリンクをナビゲーションバーに追加
- `ClipboardList` アイコンを使用（実験/評価システムへのアクセス）

**要望:**
- 実験ページ（http://localhost:5173/experiment）にナビゲーションバーから簡単にアクセスできるようにする

**変更ファイル:**
- `src/components/NavigationMenu.tsx`

**コミット:** `9bced11` - feat: add experiment page link to navigation bar

---

### チュートリアル・ヘルプボタンの非表示化

**変更内容:**
- ナビゲーションバーのチュートリアルボタン（Playアイコン）を非表示化
- ナビゲーションバーのヘルプボタン（HelpCircleアイコン）を非表示化

**理由:**
- UIをシンプルにするため、使用頻度の低いボタンをコメントアウト
- 必要に応じて後で再度有効化可能な状態で保存

**変更ファイル:**
- `src/components/NavigationMenu.tsx`

**コミット:** `c6ef8e3` - refactor: hide tutorial and help buttons in navigation

---

### サイト情報ページの追加

**変更内容:**
- `/info` ルートに新しいサイト情報ページを作成
- ナビゲーションバーに `Info` アイコン（○で囲まれたi）ボタンを追加
- ページ内容：サイトの趣旨、使い方、作成者情報

**機能詳細:**
- **サイトの趣旨セクション**: アプリの目的と主な機能の説明
- **使い方セクション**: 4ステップの簡潔な利用ガイド
- **作成者情報セクション**: プロジェクトと開発目的の情報

**変更ファイル:**
- `src/pages/InfoPage.tsx` (新規作成)
- `src/components/NavigationMenu.tsx`
- `src/main.tsx`

**コミット:** `bd257be` - feat: add site information page with Info button

---

### ナビゲーションUIの改善

**変更内容:**
- スワイプ推薦ボタン（ScrollTextアイコン）を非表示化
- SNS嗜好分析のアイコンを `BarChart3` から `FlaskConical`（フラスコ）に変更
- ナビゲーションバーのアイコン間スペースを `gap-3`（12px）から `gap-5`（20px）に拡大

**理由:**
- スワイプ推薦機能を一時的に非表示にしてUIをシンプル化
- SNS分析ページに研究・実験のイメージを持たせるためフラスコアイコンを採用
- アイコン間の視覚的な余白を改善し、見やすさを向上

**変更ファイル:**
- `src/components/NavigationMenu.tsx`

**コミット:** `bd9c092` - refactor: update navigation UI with icon and spacing improvements

---

### 実験導入ページのUIリデザイン

**変更内容:**
- 実験導入ページ（`/experiment`）を最新のUI/UXデザインベストプラクティスに基づいて全面刷新

**デザイン改善:**
- **グラデーション背景**: 視覚的な深みを追加
- **色分けされた条件カード**: 各条件を色で区別（グレー/青/紫/緑）
- **プログレスインジケーター**: C0→C1→C2→C3の実験フローを視覚化
- **アイコン強化**: 各条件と情報カードにアイコンを追加
- **コンパクト情報カード**: 所要時間と実験形式を2列グリッドで表示
- **ホバーエフェクト**: 条件カードにホバーでスケールアップ効果
- **グラデーションボタン**: 実験開始ボタンを強調

**デザイン原則（2024年実験・調査UI研究に基づく）:**
- ミニマルデザインと十分なホワイトスペース
- 視覚要素（アイコン・色）による理解促進
- 明確な情報階層
- モバイル対応レスポンシブグリッド

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

**コミット:** `41df007` - feat: redesign experiment intro page with modern UI

---

### 実験ページのUI微調整

**変更内容:**
- 条件カードのホバーアニメーション（拡大効果）を削除
- 条件バッジ（C0, C1, C2, C3）にパディング（`px-3 py-1`）を追加

**理由:**
- ホバーアニメーションを削除してよりシンプルで落ち着いたUXに
- バッジの周りに余白を設けて視認性を向上

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

**コミット:** `9419f13` - refactor: remove hover animation and add badge padding on experiment page

---

### 実験ページレイアウトの簡略化

**変更内容:**
- プログレスインジケーター（C0→C1→C2→C3のビジュアル表示）を削除
- 「実験の流れ」タイトルセクションを独立した枠付きカードとして分離
- レイアウト構造をシンプル化して読みやすさを向上

**理由:**
- プログレスインジケーターを削除してページをよりシンプルに
- タイトルセクションを枠付きカードにすることで視覚的な階層を明確化
- 不要な要素を削除してコンテンツに集中できるUIに

**変更ファイル:**
- `src/pages/ExperimentIntroPage.tsx`

**コミット:** `947f133` - refactor: simplify experiment page layout
