# AuraMaker 成長プレイブック（運用用）

コードで入った導線に加えて、週次で回すマーケ作業メモ。

## 1. note ↔ サイト相互リンク

- 各 note 末尾に対応 URL を必ず置く（`content/note/README.md` の対応表）
- note マガジン名例: **AuraMaker完全攻略ガイド**（無料）
- サイト記事末尾からも note へ誘導してよい（公開後に URL を追記）

固定記事候補: MBTI隠れオーラ → `/blog/mbti-kakure-aura`

## 2. X / Instagram スクショ文化

### 固定ハッシュタグ（JA）

`#AuraMaker` `#オーラ診断` `#私のトリセツ` `#友達目線`

### 投稿テンプレ（結果スクショ用）

```
私の友達目線オーラは「〇〇」だった🔮
自分では知らない、自分を知る。
https://auramaker.net
#AuraMaker #オーラ診断
```

ダッシュボードの「Ｘで私は〇〇と投稿」「投稿文をコピー」と同じ文面です。

### ストーリー

1. 結果画像を保存（ダッシュボードの画像シェア）
2. リンクスタンプに投票 URL or auramaker.net
3. 「匿名・10秒で投票して」＋テンプレ（`/blog/instagram-vote-templates`）

### TikTok（初期認知）

詳細は [`TIKTOK.md`](./TIKTOK.md)。型A/B・CapCut手順・投稿設定・AI共有プロンプト・1週間テストまで。

## 3. Search Console

1. 本番デプロイ後に `https://auramaker.net/sitemap.xml` を再送信
2. 週1で「検索パフォーマンス」を見る
3. **実際に表示されたクエリ**だけ記事化・オーラ詳細追記（推測で量産しない）

### 自分のアクセスを GA から外す

ブラウザで一度だけ開く（Cookie が付く）:

- オフ: https://auramaker.net/?ga=off
- 再開: https://auramaker.net/?ga=on

同じブラウザでは以降カウントされない。別端末・別ブラウザでもそれぞれ `?ga=off` を一度開く。

（任意）GA4 管理 → データストリーム → 内部トラフィック定義で自宅 IP を除外してもよい。IP が変わる回線では Cookie 方式の方が楽。

## 4. 被リンク・企画

- 友達企画: 「相互オーラ診断会」（グルチャでURL回し）
- 大学・サークル: 「新歓で印象投票」ノリの短時間企画
- 診断まとめサイト・個人ブログへの掲載依頼（AuraMakerとは＋URL）

## 5. プロダクト側ですでに実装済み

- 投票完了 → 自分のURL作成 CTA（相互誘導）
- 結果ワンタップ投稿（X / LINE / コピー）
- 画像シェア（ストーリー向け）
- LPヒーロー「自分では知らない、自分を知る。」＋票数社会的証明
- LP / 図鑑の人気オーラ TOP
- 自己診断スキップで先にURL
- ダッシュボード「今月の顔」ログ
- ダッシュボード「あとN票」進捗 CTA（メール通知なし・アプリ内のみ）
- Analytics: `votes_progress_cta` / `popular_aura_click` / `mutual_invite_*` / `share_result_flex`

## 6. やらないこと

- メール・プッシュなど外向き通知（うるさいので禁止）
- 結果判定への生成AI導入（費用・遅延のため。必要なら説明のみ・後出し）

## 7. インフラ（レイテンシ）

- Vercel Functions は `vercel.json` で **Tokyo (`hnd1`)** に固定
- Supabase も Project Settings → Infrastructure で **Northeast Asia (Tokyo)** か確認。米国のままだと DB 往復がまだ遠いまま
- デプロイ後、レスポンスヘッダ `X-Vercel-Id` が `…::hnd1::…` になっていれば OK（以前は `iad1` = 米国東部）

