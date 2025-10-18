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
