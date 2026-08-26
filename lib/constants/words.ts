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
  all: "おすすめ",
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

  // --- ネタ拡充（60語） ---

  // ビジュアル追加
  {
    id: "shashin-ugarisug",
    label: "写真写り良すぎ",
    category: "visual",
    auraCategory: ["hero", "warm", "imp"],
  },
  {
    id: "jidori-no-oni",
    label: "自撮りの鬼",
    category: "visual",
    auraCategory: ["hero", "chaos", "imp"],
  },
  {
    id: "akunuketeru",
    label: "垢抜けてる",
    category: "visual",
    auraCategory: ["hero", "warm", "legend"],
  },
  {
    id: "meiryoku-sugoi",
    label: "目力がすごい",
    category: "visual",
    auraCategory: ["hero", "intellect", "imp"],
  },
  {
    id: "fashion-tsuyome",
    label: "ファッション強め",
    category: "visual",
    auraCategory: ["hero", "cool", "legend"],
  },
  {
    id: "bisei-waku",
    label: "美形枠",
    category: "visual",
    auraCategory: ["hero", "cool", "crystal"],
  },
  {
    id: "gyakko-de-kieru",
    label: "逆光で消える",
    category: "visual",
    auraCategory: ["mystic", "cool", "imp"],
  },

  // バイブス追加
  {
    id: "henshin-hayasug",
    label: "返信早すぎ",
    category: "vibes",
    auraCategory: ["heal", "warm", "imp"],
  },
  {
    id: "kidoku-suru-ma",
    label: "既読スルー魔",
    category: "vibes",
    auraCategory: ["cool", "void", "imp"],
  },
  {
    id: "kuuki-yomisug",
    label: "空気読みすぎ",
    category: "vibes",
    auraCategory: ["heal", "cool", "void"],
  },
  {
    id: "nomikai-junkan",
    label: "飲み会の潤滑油",
    category: "vibes",
    auraCategory: ["warm", "hero", "chaos"],
  },

  // ネタ・カオス追加
  {
    id: "yotei-cancel",
    label: "予定キャンセル多め",
    category: "chaos",
    auraCategory: ["chaos", "imp", "void"],
  },
  {
    id: "ronri-busou",
    label: "理論武装",
    category: "chaos",
    auraCategory: ["intellect", "chaos", "otaku"],
  },
  {
    id: "totsuzen-boke",
    label: "突然ボケる",
    category: "chaos",
    auraCategory: ["chaos", "imp", "warm"],
  },
  {
    id: "reaction-kajo",
    label: "リアクション過剰",
    category: "chaos",
    auraCategory: ["chaos", "warm", "imp"],
  },
  {
    id: "meshi-tero",
    label: "飯テロ魔",
    category: "chaos",
    auraCategory: ["chaos", "warm", "otaku"],
  },
  {
    id: "chikoku-joshu",
    label: "遅刻常習",
    category: "chaos",
    auraCategory: ["chaos", "imp", "void"],
  },
  {
    id: "tension-hokei",
    label: "テンション継続不能",
    category: "chaos",
    auraCategory: ["chaos", "imp", "otaku"],
  },
  {
    id: "goi-netto",
    label: "語彙がネット",
    category: "chaos",
    auraCategory: ["chaos", "otaku", "intellect"],
  },
  {
    id: "sekkyo-mode",
    label: "説教モード",
    category: "chaos",
    auraCategory: ["intellect", "hero", "chaos"],
  },
  {
    id: "neochi-tanto",
    label: "寝落ち担当",
    category: "chaos",
    auraCategory: ["void", "heal", "imp"],
  },
  {
    id: "jigaku-neta",
    label: "自虐ネタ過多",
    category: "chaos",
    auraCategory: ["chaos", "imp", "warm"],
  },
  {
    id: "oshi-shika-katan",
    label: "推ししか勝たん",
    category: "chaos",
    auraCategory: ["otaku", "chaos", "hero"],
  },

  // むっつりど変態系（行動観察寄り・結果がバレにくい語）
  {
    id: "hanashi-kyuu-ni-koku",
    label: "話が急に濃くなる",
    category: "chaos",
    auraCategory: ["chaos", "imp", "otaku"],
  },
  {
    id: "shumi-kaizoudo-bug",
    label: "趣味の解像度バグ",
    category: "chaos",
    auraCategory: ["chaos", "imp", "otaku"],
  },
  {
    id: "shitsumon-egui",
    label: "質問がえぐい",
    category: "chaos",
    auraCategory: ["chaos", "imp", "intellect"],
  },
  {
    id: "yoru-ni-naru-to-betsu",
    label: "夜になると別人",
    category: "gap",
    auraCategory: ["chaos", "otaku", "mystic"],
  },
  {
    id: "nori-shatei-nagai",
    label: "ノリの射程が長い",
    category: "chaos",
    auraCategory: ["chaos", "imp", "warm"],
  },

  // メンヘラかまってちゃん系（行動観察寄り・結果がバレにくい語）
  {
    id: "ondo-sa-binkan",
    label: "温度差に敏感",
    category: "gap",
    auraCategory: ["imp", "heal", "warm"],
  },
  {
    id: "aisare-jouzu",
    label: "愛され上手",
    category: "vibes",
    auraCategory: ["warm", "heal", "imp"],
  },
  {
    id: "hanno-machi-gachi",
    label: "反応待ちがち",
    category: "gap",
    auraCategory: ["void", "imp", "chaos"],
  },
  {
    id: "yohaku-ga-kowai",
    label: "余白が怖い",
    category: "gap",
    auraCategory: ["imp", "warm", "chaos"],
  },
  {
    id: "joucho-otenki",
    label: "情緒お天気",
    category: "gap",
    auraCategory: ["chaos", "imp", "void"],
  },
  {
    id: "soba-ni-ite-hoshii",
    label: "そばにいてほしい系",
    category: "gap",
    auraCategory: ["heal", "void", "imp"],
  },

  // ギャップ追加
  {
    id: "darui-non-yuuno",
    label: "だるいのに有能",
    category: "gap",
    auraCategory: ["intellect", "imp", "void"],
  },
  {
    id: "hito-mishiri",
    label: "人見知り",
    category: "gap",
    auraCategory: ["cool", "mystic", "void"],
  },
  {
    id: "emoi",
    label: "エモい",
    category: "gap",
    auraCategory: ["mystic", "warm", "imp"],
  },
  {
    id: "oshikatsu-no-oni",
    label: "推し活の鬼",
    category: "gap",
    auraCategory: ["otaku", "hero", "chaos"],
  },
  {
    id: "kuchihazuk-non-dokuzetsu",
    label: "口下手なのに毒舌",
    category: "gap",
    auraCategory: ["imp", "intellect", "cool"],
  },

  // サブカル追加
  {
    id: "ichininshou-tsuyoi",
    label: "一人称が強い",
    category: "secret",
    auraCategory: ["chaos", "hero", "otaku"],
  },
  {
    id: "gruchat-midoku",
    label: "グルチャ未読",
    category: "secret",
    auraCategory: ["void", "cool", "imp"],
  },
  {
    id: "onchi-non-atsui",
    label: "音痴なのに熱い",
    category: "secret",
    auraCategory: ["chaos", "warm", "imp"],
  },
  {
    id: "warai-no-inryoku",
    label: "笑いの引力",
    category: "secret",
    auraCategory: ["warm", "chaos", "hero"],
  },

  // 性格・わかりやすい素の印象
  {
    id: "nekketsu",
    label: "熱血",
    category: "vibes",
    auraCategory: ["hero", "warm", "chaos"],
  },
  {
    id: "reitetsu",
    label: "冷徹",
    category: "vibes",
    auraCategory: ["cool", "void", "intellect"],
  },
  {
    id: "onkou",
    label: "温厚",
    category: "vibes",
    auraCategory: ["heal", "warm"],
  },
  {
    id: "hentai",
    label: "変態",
    category: "chaos",
    auraCategory: ["chaos", "otaku", "imp"],
  },
  {
    id: "tennen",
    label: "天然",
    category: "vibes",
    auraCategory: ["warm", "heal", "chaos"],
  },
  {
    id: "makezugirai",
    label: "負けず嫌い",
    category: "vibes",
    auraCategory: ["hero", "chaos", "intellect"],
  },
  {
    id: "mendoumi-ii",
    label: "面倒見いい",
    category: "vibes",
    auraCategory: ["heal", "warm", "hero"],
  },
  {
    id: "haraguro",
    label: "腹黒",
    category: "gap",
    auraCategory: ["imp", "intellect", "void"],
  },
] as const;

/** 「おすすめ」タブ用：よく選ばれる12語（全語はカテゴリタブから） */
export const RECOMMENDED_WORD_LABELS: readonly string[] = [
  "熱血",
  "温厚",
  "冷徹",
  "変態",
  "話が急に濃くなる",
  "趣味の解像度バグ",
  "温度差に敏感",
  "反応待ちがち",
  "ギャップの鬼",
  "天才的バカ",
  "限界オタク",
  "NPC",
  "だるいのに有能",
  "天然",
  "カリスマ",
  "癒やし枠",
];

export const VOTE_WORDS = VOTE_WORD_DEFS.map((word) => word.label);

export type VoteWord = (typeof VOTE_WORD_DEFS)[number]["label"];

export function getVoteWordDef(label: string): VoteWordDef | undefined {
  return VOTE_WORD_DEFS.find((word) => word.label === label);
}

export function getWordsByCategory(category: VoteCategory | "all") {
  if (category === "all") {
    return RECOMMENDED_WORD_LABELS.flatMap((label) => {
      const def = getVoteWordDef(label);
      return def ? [def] : [];
    });
  }
  return VOTE_WORD_DEFS.filter((word) => word.category === category);
}

export function getCategoryWordCount(category: VoteCategory) {
  return VOTE_WORD_DEFS.filter((word) => word.category === category).length;
}
