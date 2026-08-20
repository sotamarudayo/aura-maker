export type VoteCategory =
  | "visual"
  | "vibes"
  | "chaos"
  | "gap"
  | "secret";

/** オーラ判定で使う属性タグ */
export type AuraAttribute =
  | "hero"
  | "heal"
  | "warm"
  | "cool"
  | "mystic"
  | "chaos"
  | "otaku"
  | "imp"
  | "intellect"
  | "void"
  | "god"
  | "crystal"
  | "legend";

export type VoteWordDef = {
  id: string;
  label: string;
  category: VoteCategory;
  auraCategory: readonly AuraAttribute[];
};

export const VOTE_CATEGORY_LABELS: Record<VoteCategory | "all", string> = {
  all: "すべて",
  visual: "ビジュアル",
  vibes: "バイブス",
  chaos: "ネタ",
  gap: "ギャップ",
  secret: "サブカル",
};

export const VOTE_WORD_DEFS: VoteWordDef[] = [
  // ビジュアル・存在感
  {
    id: "biju-bakuhatsu",
    label: "ビジュ爆発",
    category: "visual",
    auraCategory: ["hero", "warm", "legend"],
  },
  {
    id: "attoteki-shujinko",
    label: "圧倒的主人公",
    category: "visual",
    auraCategory: ["hero", "legend", "god"],
  },
  {
    id: "tomeikan",
    label: "透明感",
    category: "visual",
    auraCategory: ["cool", "crystal", "heal"],
  },
  {
    id: "charisma",
    label: "カリスマ",
    category: "visual",
    auraCategory: ["hero", "legend", "intellect"],
  },
  {
    id: "hakanage",
    label: "儚げ",
    category: "visual",
    auraCategory: ["mystic", "cool", "crystal"],
  },
  {
    id: "heisei-retro",
    label: "平成レトロ",
    category: "visual",
    auraCategory: ["warm", "mystic", "imp"],
  },
  {
    id: "silhouette-tsuyome",
    label: "シルエット強め",
    category: "visual",
    auraCategory: ["hero", "cool", "imp"],
  },

  // バイブス・空気感
  {
    id: "numa",
    label: "沼",
    category: "vibes",
    auraCategory: ["mystic", "otaku", "imp"],
  },
  {
    id: "minus-ion",
    label: "マイナスイオン",
    category: "vibes",
    auraCategory: ["heal", "cool", "crystal"],
  },
  {
    id: "kyorikan-bug",
    label: "距離感バグ",
    category: "vibes",
    auraCategory: ["chaos", "imp", "void"],
  },
  {
    id: "youkya-vibes",
    label: "陽キャバイブス",
    category: "vibes",
    auraCategory: ["warm", "hero", "chaos"],
  },
  {
    id: "iyashi-waku",
    label: "癒やし枠",
    category: "vibes",
    auraCategory: ["heal", "warm"],
  },
  {
    id: "tayoreru-aibo",
    label: "頼れる相棒",
    category: "vibes",
    auraCategory: ["hero", "heal", "warm"],
  },
  {
    id: "kuuki-seijouki",
    label: "空気清浄機",
    category: "vibes",
    auraCategory: ["heal", "cool", "intellect"],
  },

  // ネタ・カオス
  {
    id: "shinya-tension",
    label: "深夜テンション",
    category: "chaos",
    auraCategory: ["chaos", "otaku", "imp"],
  },
  {
    id: "genkai-otaku",
    label: "限界オタク",
    category: "chaos",
    auraCategory: ["otaku", "chaos", "void"],
  },
  {
    id: "npc",
    label: "NPC",
    category: "chaos",
    auraCategory: ["void", "cool", "otaku"],
  },
  {
    id: "chian-warume",
    label: "治安悪め",
    category: "chaos",
    auraCategory: ["chaos", "imp", "god"],
  },
  {
    id: "kyoki",
    label: "狂気",
    category: "chaos",
    auraCategory: ["chaos", "god", "void"],
  },
  {
    id: "tensai-baka",
    label: "天才的バカ",
    category: "chaos",
    auraCategory: ["chaos", "intellect", "god"],
  },
  {
    id: "kusa-fukahi",
    label: "草不可避",
    category: "chaos",
    auraCategory: ["chaos", "warm", "imp"],
  },

  // ギャップ・性格
  {
    id: "gap-no-oni",
    label: "ギャップの鬼",
    category: "gap",
    auraCategory: ["imp", "chaos", "mystic"],
  },
  {
    id: "tsundere",
    label: "ツンデレ",
    category: "gap",
    auraCategory: ["imp", "cool", "warm"],
  },
  {
    id: "cool-doji",
    label: "クールに見えてドジ",
    category: "gap",
    auraCategory: ["imp", "cool", "warm"],
  },
  {
    id: "mysterious",
    label: "ミステリアス",
    category: "gap",
    auraCategory: ["mystic", "cool", "void"],
  },
  {
    id: "chiseiha",
    label: "知性派",
    category: "gap",
    auraCategory: ["intellect", "cool", "legend"],
  },
  {
    id: "jitsuwa-sabishigari",
    label: "実は寂しがり",
    category: "gap",
    auraCategory: ["heal", "mystic", "warm"],
  },
  {
    id: "tennen-dokuzetsu",
    label: "天然毒舌",
    category: "gap",
    auraCategory: ["imp", "chaos", "intellect"],
  },

  // サブカル・シークレット枠
  {
    id: "gainen",
    label: "概念",
    category: "secret",
    auraCategory: ["void", "mystic", "legend"],
  },
  {
    id: "kuromaku",
    label: "黒幕",
    category: "secret",
    auraCategory: ["void", "god", "intellect"],
  },
  {
    id: "isekai-tense",
    label: "異世界転生",
    category: "secret",
    auraCategory: ["otaku", "hero", "god"],
  },
  {
    id: "zettai-reido",
    label: "絶対零度",
    category: "secret",
    auraCategory: ["crystal", "cool", "void"],
  },
  {
    id: "last-boss",
    label: "ラスボス",
    category: "secret",
    auraCategory: ["god", "chaos", "legend"],
  },
  {
    id: "bug-waza",
    label: "バグ技",
    category: "secret",
    auraCategory: ["chaos", "otaku", "god"],
  },
  {
    id: "ijigen",
    label: "異次元",
    category: "secret",
    auraCategory: ["void", "legend", "crystal"],
  },
  {
    id: "cheat-kyu",
    label: "チート級",
    category: "secret",
    auraCategory: ["god", "hero", "legend"],
  },
] as const;

export const VOTE_WORDS = VOTE_WORD_DEFS.map((word) => word.label);

export type VoteWord = (typeof VOTE_WORD_DEFS)[number]["label"];

export function getVoteWordDef(label: string): VoteWordDef | undefined {
  return VOTE_WORD_DEFS.find((word) => word.label === label);
}

export function getWordsByCategory(category: VoteCategory | "all") {
  if (category === "all") return VOTE_WORD_DEFS;
  return VOTE_WORD_DEFS.filter((word) => word.category === category);
}
