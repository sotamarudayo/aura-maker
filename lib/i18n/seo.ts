import type { Locale } from "./types";

export type SeoCopy = {
  siteTitle: string;
  siteDescription: string;
  homeTitle: string;
  homeDescription: string;
  aurasTitle: string;
  aurasDescription: string;
  blogTitle: string;
  blogDescription: string;
  faqTitle: string;
  faqDescription: string;
  ogImageAlt: string;
  keywords: string[];
  jsonLdDescription: string;
};

const SEO_JA: SeoCopy = {
  siteTitle: "AuraMaker | 友達から見た自分のオーラがわかる",
  siteDescription:
    "周りからどう思われてるか、知りたくない？友達にURLを送ってキーワードを選んでもらうだけでオーラ診断。登録不要・匿名OK。",
  homeTitle: "AuraMaker | 友達から見た自分のオーラがわかる",
  homeDescription:
    "周りからどう思われてるか、知りたくない？友達にURLを送ってキーワードを選んでもらうだけでオーラ診断。登録不要・匿名OK。",
  aurasTitle: "オーラ図鑑",
  aurasDescription:
    "AuraMakerの全22種類のオーラタイプ一覧。友達の印象ワードから決まる、他人から見たタイプ診断の図鑑。",
  blogTitle: "ブログ",
  blogDescription:
    "MBTIと友達目線のズレ、カオス系オーラの生態、投票リンクの送り方など、AuraMakerの攻略記事まとめ。",
  faqTitle: "よくある質問",
  faqDescription:
    "AuraMakerとは？MBTIとの違い、匿名投票、所要時間、無料かどうかなど、初めての方向けFAQ。",
  ogImageAlt: "AuraMaker | 友達から見た自分のオーラがわかる",
  keywords: [
    "オーラ診断",
    "友達 印象 診断",
    "他人から見た自分",
    "性格診断",
    "匿名 投票",
    "MBTI みたい",
    "AuraMaker",
  ],
  jsonLdDescription:
    "友達が印象ワードを選ぶだけで、他人から見た自分のオーラタイプがわかる無料の診断サービス。",
};

const SEO_EN: SeoCopy = {
  siteTitle: "AuraMaker | See Your Aura Through Friends' Eyes",
  siteDescription:
    "Curious how people actually see you? Send friends a link — they pick impression words, your aura reveals itself. Free, anonymous, no signup.",
  homeTitle: "AuraMaker | See Your Aura Through Friends' Eyes",
  homeDescription:
    "Curious how people actually see you? Send friends a link — they pick impression words, your aura reveals itself. Free, anonymous, no signup.",
  aurasTitle: "Aura Dex — All 22 Personality Auras",
  aurasDescription:
    "Browse every aura type in AuraMaker. A personality read built from how friends describe you — Common to Secret rarity.",
  blogTitle: "Blog",
  blogDescription:
    "Guides on friend-view aura diagnosis, MBTI gaps, chaos auras, and how to share your vote link.",
  faqTitle: "FAQ",
  faqDescription:
    "What is AuraMaker? How it differs from MBTI, anonymity, time required, pricing, and more.",
  ogImageAlt: "AuraMaker — personality aura quiz from friends' impressions",
  keywords: [
    "aura personality test",
    "how others see you",
    "friend impression poll",
    "personality quiz from friends",
    "anonymous vibe vote",
    "social personality type",
    "AuraMaker",
    "what do my friends think of me",
  ],
  jsonLdDescription:
    "A free web app where friends vote on impression words to reveal your aura personality type — how others actually see you.",
};

export function getSeoCopy(locale: Locale): SeoCopy {
  return locale === "en" ? SEO_EN : SEO_JA;
}
