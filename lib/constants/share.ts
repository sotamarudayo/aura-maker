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
  return `【匿名10秒】${displayName}さんのオーラ診断に協力`;
}

/** LINE / X のリンクプレビュー用説明文 */
export function buildVoteInviteDescription(displayName: string) {
  return `印象ワードを最大3つ選ぶだけ。投票が集まると${displayName}さんのオーラタイプと診断結果が完成します（匿名・本人のみ結果表示）。`;
}

/** 投票ページ本体の見出し */
export function buildVotePageHeading(displayName: string) {
  return `${displayName}さんの印象、教えて！`;
}

/** 投票ページ本体のサブコピー */
export function buildVotePageSubcopy(displayName: string) {
  return `匿名でOK・約10秒。選んだ言葉は${displayName}さんのオーラ診断に使われ、本人のダッシュボードに反映されます。`;
}

/** 投票後に何が起きるか（3ステップ） */
export const VOTE_PAGE_FLOW = [
  "あなたが印象ワードを選んで送る（匿名）",
  "友達の投票が集まっていく",
  "集まった印象からオーラタイプと診断結果が完成",
] as const;

/** 投票ボタンラベル */
export function buildVoteSubmitLabel(selectedCount: number) {
  return selectedCount > 0 ? `この内容で投票する（${selectedCount}/3）` : "投票する（0/3）";
}

/** 投票完了メッセージ */
export function buildVoteThanksMessage(displayName: string) {
  return `${displayName}さんのオーラ診断に、あなたの印象が加わりました。投票が増えるほど診断結果が育っていきます。`;
}
