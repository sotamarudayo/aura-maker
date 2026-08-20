const ADJECTIVES = [
  "星屑",
  "ネオン",
  "ミステリアス",
  "ふわふわ",
  "伝説の",
  "夜更かし",
  "宇宙",
  "虹色",
] as const;

const NOUNS = [
  "オーラ使い",
  "旅人",
  "観測者",
  "占い師",
  "光の子",
  "ドリーマー",
] as const;

export const DEFAULT_ANONYMOUS_NAME = "名無しのオーラ使い";

export function generateRandomNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

export function resolveAnonymousDisplayName() {
  return Math.random() > 0.5 ? generateRandomNickname() : DEFAULT_ANONYMOUS_NAME;
}
