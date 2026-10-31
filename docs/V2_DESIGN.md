# Color Recommendation V2 — デザインと互換性の正本

## 位置づけ

- 既存のホーム `/` は **従来版**。変更しない。既存の研究 UI1/UI2・実験画面・データはそのまま。
- 新しいパレット向け UI は `/v2`。両方をヘッダー内の相互リンクで行き来できる。
- 新UIだけを公開する置き換えではない。差分のレビュー後に PR をマージする。
- 色相とトーンの推薦ロジックは `src/store/colorStore.ts` を共有し、別アルゴリズムを作らない。

## MD2D をデザインの基準（Single Source of Truth）にする

参照: `emar27181/MD2D` の `develop`、`docs/DESIGN.md`、`src/design/icons.ts`、`src/components/foundation/Icon.tsx`、`src/components/atoms/Button.tsx`、`SwatchButton.tsx`、`src/styles/tokens.css`。

独立リポジトリのため MD2D のソースを runtime import せず、**コンポーネントの役割・API・規則**を V2 に適応して移植している。将来の差分を比較可能なように、この参照元を正本とする。

1. **Atomic Design:** `src/v2/design/icons.ts` → `src/v2/components.tsx` (Icon / Button / IconButton / SwatchButton) → `PaletteV2Page.tsx`。
2. **トークン一元化:** `src/v2/design/tokens.css` が Primitive → Semantic → Component の唯一の UI 数値・色・ブレークポイントの定義元。旧UIへの波及を避けるため `crv2-` で名前空間化。
3. **例外:** ユーザーが選んだ HEX を色面の `backgroundColor` に動的に設定することは許容。これをデザイントークンとして誤管理しない。
4. **見た目:** 枠線より背景面の差、4px余白の7段階、文字・アイコン・操作部品も7段階、角丸は用途で統一。無彩色の操作部＋黄色のアクセント。スウォッチの選択は色だけでなくチェックでも示す。
5. **アイコン:** `lucide-react` の import は V2 内では `design/icons.ts` に集約。絵文字を UI に使わない。
6. **言語:** `src/v2/design/copy.ts` を表示文言の正本とする。現在の ja/en を先行サポートし、未提供の翻訳の有無を明記する。現行アプリの他言語追加時に辞書を増やす。
7. **画面幅:** MD2D と同じスマホ <= 760px / タブレット <= 1100px。スマホ操作ボタンは最低44pxを基準とする。スクロール可能でキーボード表示時も入力が隠れない。
8. **アクセシビリティ:** タブ・フォーム・コピー・追加・移動・削除はキーボードで操作でき、状態にはラベル、色見本は `role=radio` / `aria-checked`。選択色の視認性は色のコントラストに依存させない。
9. **研究保護:** `/experiment` 以下のルートと実験ストア、色推薦計算を改変しない。従来UIの `/` を維持することをテストする。

## エクスポート仕様

- 1色のHEXコピー: `#RRGGBB` を大文字の正規化形式でコピー。
- パレット: 1〜12色。ローカルストレージに **V2専用キー** で保存。従来版データは上書きしない。
- PNG「スポイト用」: 180×360pxの色面を色数分だけ横連結。余白・枠・文字・影・透過を入れず、色面の各ピクセルは元のRGB値と同一。画像貼り付け後にスポイトで使うため。
- PNG「コード付き」: 色面の下側に白背景＋HEXラベル。色面は変更しない。
- 画像コピー: `navigator.clipboard.write` / `ClipboardItem('image/png')`。ブラウザや外部アプリによっては非対応なので PNG 保存を必ず残す。
- 画像抽出は従来の `src/lib/colorExtractor.ts` を共有し、抽出結果の色を基準色として選択可能にする。

## 品質ゲート

- `npm run build` （従来の TypeScript＋Vite ビルド）
- `npm run test:v2` （Node 22: 色正規化、重複・最大数、順番、PNG色面、旧UIルート、アイコン登録簿、余白トークン）
- V2 と旧UIをそれぞれ PC / スマホで操作確認する。画像を別アプリに貼った後のスポイト色の一致は人手でも検査する。
- 元の `/` と `/experiment` を置き換えたり、MD2D 側のコードを直接変更したりしない。

## 追加改善の候補（この PR の対象外）

- 調和の推薦を視覚的に示す色相環の改良
- 日本語・英語以外のV2文言拡充
- JSON / CSS カスタムプロパティ出力
- 外部アプリ固有の画像ペースト互換性の検証
