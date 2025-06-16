# 色推薦アプリ

色彩理論に基づいた相性の良い色とトーンを推薦するReact + TypeScriptアプリケーションです。

## 機能

- **手動カラー選択**: HTML5カラーピッカーとカラーコード入力
- **画像からの色抽出**: 画像をアップロードして使用されている色を自動抽出
- **色相推薦**: 色彩理論に基づいた配色技法（補色、類似色、三角配色など）
- **トーン推薦**: 選択した色の明度・彩度を変化させたバリエーション
- **クリップボード機能**: 全ての色でワンクリックコピー

## UI仕様

### 色表示の統一規格

全ての色表示は以下の統一規格に従います：

- **色見本サイズ**: 64px × 64px (Tailwind CSS: `w-16 h-16`)
- **角丸**: 4px (Tailwind CSS: `rounded`)
- **ボーダー**: 2px (Tailwind CSS: `border-2`)
- **ホバー効果**: 1.05倍スケール + ボーダー色変更
- **コピーボタン**: 右上角に配置、ホバー時表示

### グリッドレイアウト

レスポンシブグリッドレイアウト：
- モバイル (default): 6列
- sm (640px+): 8列
- md (768px+): 10列
- lg (1024px+): 12列
- xl (1280px+): 14列

### 色表示の種類

1. **カラーピッカー**: 選択中の色を表示
2. **抽出色表示**: 画像から抽出された色と使用率
3. **推薦色相**: 色彩理論に基づく推薦色
4. **推薦トーン**: 明度・彩度のバリエーション

## 技術スタック

- **React 18** + **TypeScript**
- **Vite** (ビルドツール)
- **Tailwind CSS** (スタイリング)
- **Zustand** (状態管理)
- **ColorThief** (色抽出)
- **chroma-js** (色操作)

## 開発環境

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## 色抽出の精度

画像からの色抽出では、実際のピクセル分析による正確な色使用率を計算しています：
- deltaE色差による近似色判定
- 実際のピクセル数に基づく使用率計算
- 使用率の高い順にソート表示

## 配色技法

以下の色彩理論に基づく配色技法をサポート：
- 補色配色
- 類似色配色
- 三角配色
- 四角配色
- 分割補色配色
- 単色配色

---

## React + TypeScript + Vite テンプレート

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```