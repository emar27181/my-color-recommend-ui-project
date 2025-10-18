# Changelog

このファイルは、色推薦アプリプロジェクトの開発履歴を記録します。

## 2025-10-18

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
