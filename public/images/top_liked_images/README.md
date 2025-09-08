# イラストレーターいいね数TOP3画像ディレクトリ

## 構造
各イラストレーター名のディレクトリ内にいいね数TOP3の画像を配置してください：

- `top1.jpg` - いいね数1位の画像
- `top2.jpg` - いいね数2位の画像  
- `top3.jpg` - いいね数3位の画像

## 使用方法
```typescript
const getTopLikedImageUrl = (name: string, rank: number) => 
  `/images/top_liked_images/${name}/top${rank}.jpg`;

// 例: 1位画像を取得
const topImage = getTopLikedImageUrl('mika_pikazo_mpz', 1);
// 結果: /images/top_liked_images/mika_pikazo_mpz/top1.jpg
```

## 統合表示例
```typescript
// TOP3を一括取得
const getTop3Images = (name: string) => 
  [1, 2, 3].map(rank => getTopLikedImageUrl(name, rank));
```

## イラストレーター一覧
総数: 29名

- _oco_me_
- _yukoring
- amao_1015
- birdstory_pic
- bj00100
- chi_bee.official
- coal_owl
- den_1210
- deppa_53
- emanuelartist
- gaako_illust
- harunonioikaze
- harupeipei
- iina.gram
- jerome_trez_oudot
- meeesuke_
- mika_pikazo_mpz
- mokmok_skd
- nest_virgo
- obungu_mofumofu
- omrice4869
- oz_yarimasu
- sa_ka_na_4
- sexygirl.jp
- shirokumaai
- skt2ing
- test_one_photo
- trcoot
- tsumugitopan