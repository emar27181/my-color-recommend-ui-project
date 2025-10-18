# Changelog

このファイルは、色推薦アプリプロジェクトの開発履歴を記録します。

## 2025-10-18

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
