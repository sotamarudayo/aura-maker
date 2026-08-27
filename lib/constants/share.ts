/** サービス紹介用シェア文面 */
export const SERVICE_SHARE_TEXT =
  "周りからどう思われてるか、知りたくない？友達の印象からオーラ診断✨ AuraMaker #AuraMaker";

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
  return `【AuraMaker】${displayName}さんのタイプ診断に投票して`;
}

/** LINE / X のリンクプレビュー用説明文 */
export function buildVoteInviteDescription(displayName: string) {
  return `MBTIみたいな他人から見たタイプ診断。${displayName}さんの印象ワードを最大3つ選ぶだけ（匿名・約10秒）。結果は本人だけが見られます。`;
}

/**
 * 投票依頼を送るときの本文（URLの前にサービス説明を置く）
 */
export function buildVoteInviteShareText(displayName: string) {
  return [
    "【AuraMaker】MBTIみたいな他人から見たタイプ診断🙏",
    `${displayName}の印象に合う言葉を、最大3つ選んで投票してほしい！`,
    "匿名OK・約10秒。",
  ].join("\n");
}

export function buildVoteInviteSharePayload(displayName: string, voteUrl: string) {
  return `${buildVoteInviteShareText(displayName)}\n${voteUrl}`;
}

export function buildVoteInviteShareUrls(displayName: string, voteUrl: string) {
  const text = buildVoteInviteShareText(displayName);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(voteUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${voteUrl}`)}`,
  };
}

/** 投票ページ冒頭：サービス説明（初見向け） */
export const VOTE_PAGE_WHAT_IS_THIS =
  "AuraMakerは、MBTIみたいな他人から見たタイプ診断。自分で答えるんじゃなく、友達が印象ワードを選ぶとオーラタイプがわかります。";

/** 投票ページ本体の見出し */
export function buildVotePageHeading(displayName: string) {
  return `${displayName}さんから、あなたの印象を教えてほしいと頼まれています`;
}

/** 投票ページ本体のサブコピー */
export function buildVotePageSubcopy(displayName: string) {
  return `下の言葉から最大3つ選んで送るだけ。匿名OK・約10秒。結果は${displayName}さん本人だけが見られます。`;
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
