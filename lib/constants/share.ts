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
