/** サービス紹介用シェア文面 */
export const SERVICE_SHARE_TEXT =
  "友達から見た自分の『オーラ』がわかる！ AuraMakerでみんなの印象を集めよう✨ #AuraMaker";

export function buildServiceShareUrls(siteUrl: string) {
  const encodedText = encodeURIComponent(SERVICE_SHARE_TEXT);
  const encodedUrl = encodeURIComponent(siteUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedText}%0A${encodedUrl}`,
  };
}

export function buildVoteShareText(displayName: string) {
  return `${displayName}さんのオーラ診断結果を見てみて！ #AuraMaker`;
}

/** LINE / X のリンクプレビュー用タイトル */
export function buildVoteInviteTitle(displayName: string) {
  return `緊急：${displayName}のオーラ、観測ミッション発生中`;
}

/** LINE / X のリンクプレビュー用説明文 */
export function buildVoteInviteDescription(displayName: string) {
  return `匿名・約10秒。印象ワードを3つ選ぶだけ。正直でもネタ多めでもOK。${displayName}の正体、みんなでバラそう。`;
}

/** 投票ページ本体の見出し */
export function buildVotePageHeading(displayName: string) {
  return `${displayName}のオーラ、観測してみ？`;
}

/** 投票ページ本体のサブコピー */
export const VOTE_PAGE_SUBCOPY =
  "匿名・最大3ワード。正直でもネタ多めでも歓迎。あなたの一言でオーラが覚醒します。";

