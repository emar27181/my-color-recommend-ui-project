# 色推薦アプリ

## V1 と V2 の併用／論文のURL互換性

- **新しい公開先**: `/` は **V2**（標準トップ）。`/v2` もV2の固定リンク。
- **論文掲載の既存URL**: `https://color-recommend.netlify.app/` は **V1（従来版）** のまま。論文のリンクを変更する必要がないよう、旧ホスト名を完全一致で区別。
- **従来版の固定リンク**: どのホストでも `/classic` / `/v1` はV1。研究用 `/experiment` 以下のパスも変更しない。
- **ルートの正本**: `src/routing/landing.ts`。旧ホストを維持し、新しい公開先（新しいホスト）を別に設定して初めて「新トップ=V2／論文URL=V1」が両立する。
- V2 のパレット保存は専用ローカルストレージを使用し、従来版と分離。V2の色計算はMD2DのOKLCH系列を使用（V1の研究アルゴリズムとは別）。
- V2: HEXコードのコピー（`#` を含む）、画像から色抽出、パレット編集、スポイト用の色面PNG、HEXラベル付きPNG、クリップボードへの画像コピー（対応ブラウザのみ）。
- デザインの正本・互換性・検証条件: [V2_DESIGN.md](docs/V2_DESIGN.md)
- 開発時検証: `npm run test:v2` / `npm run build`


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