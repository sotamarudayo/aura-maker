import type { Locale } from "@/lib/i18n/types";

/** サービス紹介用シェア文面 */
export const SERVICE_SHARE_TEXT =
  "周りからどう思われてるか、知りたくない？友達にURLを送ってキーワードを選んでもらうだけでオーラ診断✨ AuraMaker #AuraMaker";

export const SERVICE_SHARE_TEXT_EN =
  "Curious how people actually see you? Send friends a link, they pick words, your aura reveals itself ✨ AuraMaker #AuraMaker";

export function buildServiceShareText(locale: Locale = "ja") {
  return locale === "en" ? SERVICE_SHARE_TEXT_EN : SERVICE_SHARE_TEXT;
}

export function buildServiceShareUrls(siteUrl: string, locale: Locale = "ja") {
  const encodedText = encodeURIComponent(buildServiceShareText(locale));
  const encodedUrl = encodeURIComponent(siteUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedText}%0A${encodedUrl}`,
  };
}

export function buildVoteShareText(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `Check out ${displayName}'s aura on AuraMaker! #AuraMaker`
    : `${displayName}さんのオーラ診断結果を見てみて！ #AuraMaker`;
}

/** LINE / X のリンクプレビュー用タイトル */
export function buildVoteInviteTitle(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `[AuraMaker] Vote on ${displayName}'s aura type`
    : `【AuraMaker】${displayName}さんのタイプ診断に投票して`;
}

/** LINE / X のリンクプレビュー用説明文 */
export function buildVoteInviteDescription(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `A personality read from how others see you — pick up to 3 impression words for ${displayName} (anonymous, ~10 sec). Only they can see the result.`
    : `MBTIみたいな他人から見たタイプ診断。${displayName}さんの印象ワードを最大3つ選ぶだけ（匿名・約10秒）。結果は本人だけが見られます。`;
}

/**
 * 投票依頼を送るときの本文（URLの前にサービス説明を置く）
 */
export function buildVoteInviteShareText(displayName: string, locale: Locale = "ja") {
  if (locale === "en") {
    return [
      "[AuraMaker] A personality read from how others see you 🙏",
      `Pick up to 3 words that match how you see ${displayName}!`,
      "Anonymous · ~10 seconds.",
    ].join("\n");
  }
  return [
    "【AuraMaker】MBTIみたいな他人から見たタイプ診断🙏",
    `${displayName}の印象に合う言葉を、最大3つ選んで投票してほしい！`,
    "匿名OK・約10秒。",
  ].join("\n");
}

export function buildVoteInviteSharePayload(displayName: string, voteUrl: string, locale: Locale = "ja") {
  return `${buildVoteInviteShareText(displayName, locale)}\n${voteUrl}`;
}

export function buildVoteInviteShareUrls(displayName: string, voteUrl: string, locale: Locale = "ja") {
  const text = buildVoteInviteShareText(displayName, locale);
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

export const VOTE_PAGE_WHAT_IS_THIS_EN =
  "AuraMaker is a personality read from how others see you — friends pick impression words, not you. Your aura type emerges from their votes.";

export function getVotePageWhatIsThis(locale: Locale = "ja") {
  return locale === "en" ? VOTE_PAGE_WHAT_IS_THIS_EN : VOTE_PAGE_WHAT_IS_THIS;
}

/** 投票ページ本体の見出し */
export function buildVotePageHeading(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `${displayName} asked you to describe them`
    : `${displayName}さんから、あなたの印象を教えてほしいと頼まれています`;
}

/** 投票ページ本体のサブコピー */
export function buildVotePageSubcopy(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `Pick up to 3 words below. Anonymous · ~10 sec. Only ${displayName} sees the result.`
    : `下の言葉から最大3つ選んで送るだけ。匿名OK・約10秒。結果は${displayName}さん本人だけが見られます。`;
}

/** 投票後に何が起きるか（3ステップ） */
export const VOTE_PAGE_FLOW = [
  "あなたが印象ワードを選んで送る（匿名）",
  "友達の投票が集まっていく",
  "集まった印象からオーラタイプと診断結果が完成",
] as const;

export const VOTE_PAGE_FLOW_EN = [
  "You pick impression words and send (anonymous)",
  "Votes stack up from friends",
  "Their impressions become an aura type + diagnosis",
] as const;

export function getVotePageFlow(locale: Locale = "ja") {
  return locale === "en" ? VOTE_PAGE_FLOW_EN : VOTE_PAGE_FLOW;
}

/** 投票ボタンラベル */
export function buildVoteSubmitLabel(selectedCount: number, locale: Locale = "ja") {
  if (locale === "en") {
    return selectedCount > 0 ? `Submit vote (${selectedCount}/3)` : "Submit vote (0/3)";
  }
  return selectedCount > 0 ? `この内容で投票する（${selectedCount}/3）` : "投票する（0/3）";
}

/** 投票完了メッセージ */
export function buildVoteThanksMessage(displayName: string, locale: Locale = "ja") {
  return locale === "en"
    ? `Your impression just joined ${displayName}'s aura. More votes = a sharper read.`
    : `${displayName}さんのオーラ診断に、あなたの印象が加わりました。投票が増えるほど診断結果が育っていきます。`;
}
