import {
  getVoteWordDef,
  type AuraAttribute,
} from "@/lib/constants/words";
import { getWordResultFlavor } from "@/lib/constants/word-result-flavor";

export type AuraRarity = "common" | "uncommon" | "rare" | "legendary" | "secret";

export type AuraPalette = {
  a: string;
  b: string;
  c: string;
};

export type AuraType = {
  id: string;
  name: string;
  /** 会話で使える通り名（例: 盛り上げ番長） */
  archetypeName: string;
  catchCopy: string;
  description: string;
  gradient: string;
  palette: AuraPalette;
  keywords: readonly string[];
  /** ワード側 auraCategory と照合する属性 */
  attributes: readonly AuraAttribute[];
  rarity: AuraRarity;
};

export type AuraEcologyCore = {
  trigger: string;
  sideEffect: string;
  weakness: string;
};

export type AuraEcology = AuraEcologyCore & {
  /** よく観測される生息地 */
  habitat: string;
};

export type AuraStats = {
  social: number;
  neta: number;
  mystic: number;
  heal: number;
  gap: number;
};

export type AuraContradiction = {
  wordA: string;
  wordB: string;
  text: string;
};

export type AuraCompatibility = {
  good: { id: string; name: string };
  bad: { id: string; name: string };
};

export type AuraAwakening = {
  percent: number;
  hint: string;
};

export type AuraResultConfidence = "provisional" | "growing" | "stable";

/** 診断の根拠になった投票ワード */
export type VoteEvidence = {
  word: string;
  count: number;
  percent: number;
  rank: number;
  /** 最多 / 決め手 など */
  badge?: string;
};

export type DynamicAuraProfile = {
  mainText: string;
  /** 票数付きの診断根拠（多い順） */
  evidence: VoteEvidence[];
  /** 周囲からの見え方（証言風） */
  witnessText: string;
  /** なぜこのオーラか（本編解説） */
  readingText: string;
  /** 二面性・影の解説 */
  shadowText: string;
  ecology: AuraEcology;
  stats: AuraStats;
  specialMove: string;
  contradiction: AuraContradiction | null;
  compatibility: AuraCompatibility;
  shareLine: string;
  dailyFortune: string;
  awakening: AuraAwakening;
  /** 票数に応じた結果の確からしさ */
  confidence: AuraResultConfidence;
  confidenceLabel: string;
};

export type AuraCalculationOptions = {
  userId?: string;
  displayName?: string;
};

export type AuraCalculationResult = {
  aura: AuraType;
  topWords: string[];
  personalizedCatchCopy: string;
  dynamicProfile: DynamicAuraProfile;
};

const DORMANT_STATS: AuraStats = {
  social: 10,
  neta: 10,
  mystic: 10,
  heal: 10,
  gap: 10,
};

const DORMANT_COMPATIBILITY: AuraCompatibility = {
  good: { id: "healing-mint", name: "癒しのミントオーラ" },
  bad: { id: "chaos-neon", name: "陽気なカオスオーラ" },
};

const DORMANT_ECOLOGY: AuraEcology = {
  habitat: "投票URLの拡散待ち / ダッシュボードの余白",
  trigger: "友達からの投票が届く / 投票URLが拡散される",
  sideEffect: "ダッシュボードのオーラ色が少しずつ立ち上がる",
  weakness: "URLをシェアしないと永久スリープモード",
};

export const DORMANT_AURA: AuraType = {
  id: "dormant",
  name: "覚醒待ちのオーラ",
  archetypeName: "観測待ちのただの人",
  catchCopy: "まだ静かに眠る、半透明のモノトーンオーラ。",
  description:
    "あなたの纏う空気感は観測待ち。投票が集まるほど色と個性が立ち上がります。",
  gradient:
    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.12), transparent 50%), linear-gradient(160deg, #2d2d36 0%, #17171c 100%)",
  palette: { a: "#a1a1aa", b: "#71717a", c: "#52525b" },
  keywords: [],
  attributes: [],
  rarity: "common",
};

/** 通常獲得可能なオーラ（シークレット除く） */
export const STANDARD_AURA_TYPES: AuraType[] = [
  {
    id: "sunrise-hero",
    name: "サンライズ・ヒーローオーラ",
    archetypeName: "主人公番長",
    catchCopy: "眩しい前向きエネルギーが、周囲を自然と照らす。",
    description:
      "あなたの纏う空気感は、頼れる太陽タイプ。安心感と高揚感を同時に届けます。",
    gradient:
      "radial-gradient(circle at 25% 20%, #fbbf24, transparent 45%), radial-gradient(circle at 80% 30%, #fb7185, transparent 50%), linear-gradient(135deg, #1a0f00 0%, #3b1d05 100%)",
    palette: { a: "#fbbf24", b: "#fb7185", c: "#f97316" },
    keywords: ["ビジュ爆発", "圧倒的主人公", "カリスマ", "陽キャバイブス", "頼れる相棒", "シルエット強め", "写真写り良すぎ", "自撮りの鬼", "熱血", "負けず嫌い"],
    attributes: ["hero", "warm"],
    rarity: "common",
  },
  {
    id: "healing-mint",
    name: "癒しのミントオーラ",
    archetypeName: "空気清浄機枠",
    catchCopy: "やわらかな光が、触れた人の心を静かにほどく。",
    description:
      "あなたの纏う空気感は、安心と包容力の塊。そばにいるだけで呼吸が深くなります。",
    gradient:
      "radial-gradient(circle at 30% 25%, #6ee7b7, transparent 45%), radial-gradient(circle at 75% 70%, #67e8f9, transparent 50%), linear-gradient(135deg, #042f2e 0%, #0f172a 100%)",
    palette: { a: "#6ee7b7", b: "#67e8f9", c: "#34d399" },
    keywords: ["癒やし枠", "マイナスイオン", "空気清浄機", "頼れる相棒", "実は寂しがり", "温厚", "面倒見いい"],
    attributes: ["heal", "warm"],
    rarity: "common",
  },
  {
    id: "gourmet-sun",
    name: "グルメサンオーラ",
    archetypeName: "飯テロ番長",
    catchCopy: "食欲と陽気さが混ざった、幸せなオレンジの光。",
    description:
      "あなたの纏う空気感は、食と笑いで場を明るくする太陽。一緒にいると自然と元気になります。",
    gradient:
      "radial-gradient(circle at 30% 25%, #fb923c, transparent 45%), radial-gradient(circle at 75% 65%, #fbbf24, transparent 50%), linear-gradient(135deg, #2a1200 0%, #1a0f00 100%)",
    palette: { a: "#fb923c", b: "#fbbf24", c: "#f97316" },
    keywords: ["陽キャバイブス", "草不可避", "深夜テンション", "平成レトロ", "飲み会の潤滑油", "笑いの引力"],
    attributes: ["warm", "chaos"],
    rarity: "rare",
  },
  {
    id: "soft-peach",
    name: "ソフトピーチオーラ",
    archetypeName: "距離感近すぎ系",
    catchCopy: "甘くて親しみやすい、近づきやすい桃色の余熱。",
    description:
      "あなたの纏う空気感は、誰にでも打ち解けやすいムード。場の緊張をそっと溶かします。",
    gradient:
      "radial-gradient(circle at 30% 25%, #fda4af, transparent 45%), radial-gradient(circle at 70% 70%, #fecdd3, transparent 50%), linear-gradient(135deg, #2a1018 0%, #1a0a12 100%)",
    palette: { a: "#fda4af", b: "#fecdd3", c: "#fb7185" },
    keywords: ["癒やし枠", "実は寂しがり", "平成レトロ", "ツンデレ", "クールに見えてドジ", "天然", "温厚"],
    attributes: ["heal", "imp", "warm"],
    rarity: "uncommon",
  },
  {
    id: "menhera-pulse",
    name: "メンヘラパルスオーラ",
    archetypeName: "メンヘラかまってちゃん",
    catchCopy: "既読の速度で心拍数が変わる。かまってくれないと世界が終わる。",
    description:
      "あなたの纏う空気感は、愛情確認と寂しさが混ざったパルス光。反応が遅いと情緒が天候速報になるタイプです。",
    gradient:
      "radial-gradient(circle at 28% 24%, #fda4af, transparent 42%), radial-gradient(circle at 72% 40%, #c084fc, transparent 48%), radial-gradient(circle at 50% 82%, #67e8f9, transparent 52%), linear-gradient(150deg, #2a0a18 0%, #1a0a2e 55%, #05030b 100%)",
    palette: { a: "#fda4af", b: "#c084fc", c: "#67e8f9" },
    keywords: [
      "温度差に敏感",
      "愛され上手",
      "反応待ちがち",
      "余白が怖い",
      "情緒お天気",
      "そばにいてほしい系",
      "実は寂しがり",
      "距離感バグ",
    ],
    attributes: ["imp", "heal", "void"],
    rarity: "rare",
  },
  {
    id: "mystic-purple",
    name: "ミステリアスパープルオーラ",
    archetypeName: "じわ惹き魔",
    catchCopy: "静かな紫の余韻が、言葉にしない魅力を漂わせる。",
    description:
      "あなたの纏う空気感は、落ち着きの中に惹力を秘めたムードメーカー。じわっと心に残ります。",
    gradient:
      "radial-gradient(circle at 20% 30%, #c084fc, transparent 45%), radial-gradient(circle at 80% 60%, #818cf8, transparent 50%), linear-gradient(135deg, #1e1033 0%, #0f172a 100%)",
    palette: { a: "#c084fc", b: "#818cf8", c: "#a78bfa" },
    keywords: ["ミステリアス", "儚げ", "沼", "概念", "実は寂しがり"],
    attributes: ["mystic", "cool"],
    rarity: "common",
  },
  {
    id: "chaos-neon",
    name: "陽気なカオスオーラ",
    archetypeName: "盛り上げ番長",
    catchCopy: "予測不能なネオンが、場の温度を一瞬で上げる。",
    description:
      "あなたの纏う空気感は、場を沸かせるトリックスター。刺激とユーモアで周囲を巻き込みます。",
    gradient:
      "radial-gradient(circle at 25% 25%, #e879f9, transparent 45%), radial-gradient(circle at 75% 35%, #22d3ee, transparent 50%), radial-gradient(circle at 50% 80%, #f43f5e, transparent 55%), linear-gradient(135deg, #1a0520 0%, #0c1222 100%)",
    palette: { a: "#e879f9", b: "#22d3ee", c: "#f43f5e" },
    keywords: ["深夜テンション", "治安悪め", "天才的バカ", "草不可避", "距離感バグ", "バグ技", "突然ボケる", "リアクション過剰", "飲み会の潤滑油"],
    attributes: ["chaos", "imp"],
    rarity: "common",
  },
  {
    id: "hentai-nebula",
    name: "禁忌ネオンオーラ",
    archetypeName: "むっつりど変態",
    catchCopy: "好奇心が常にフルスロットル。禁断の質問を笑顔で投下する。",
    description:
      "あなたの纏う空気感は、好きと沼と変態性が混ざった禁忌ネオン。場の空気を一瞬で『え？』に変える天才です。",
    gradient:
      "radial-gradient(circle at 22% 28%, #f472b6, transparent 42%), radial-gradient(circle at 78% 35%, #a855f7, transparent 48%), radial-gradient(circle at 48% 82%, #22d3ee, transparent 52%), linear-gradient(145deg, #2a0518 0%, #1a0533 55%, #05030b 100%)",
    palette: { a: "#f472b6", b: "#a855f7", c: "#22d3ee" },
    keywords: [
      "変態",
      "話が急に濃くなる",
      "趣味の解像度バグ",
      "質問がえぐい",
      "夜になると別人",
      "ノリの射程が長い",
      "狂気",
      "沼",
      "腹黒",
    ],
    attributes: ["chaos", "imp", "otaku"],
    rarity: "rare",
  },
  {
    id: "dream-chaser",
    name: "ドリームチェイサーオーラ",
    archetypeName: "夢語り野郎",
    catchCopy: "高く昇る光が、野心と可能性を語り始める。",
    description:
      "あなたの纏う空気感は、未来志向の推進力。目標に向かう姿が周囲を鼓舞します。",
    gradient:
      "radial-gradient(circle at 25% 30%, #fde047, transparent 45%), radial-gradient(circle at 80% 40%, #60a5fa, transparent 50%), linear-gradient(135deg, #1a1500 0%, #0c1a3a 100%)",
    palette: { a: "#fde047", b: "#60a5fa", c: "#38bdf8" },
    keywords: ["圧倒的主人公", "カリスマ", "異世界転生", "チート級", "知性派"],
    attributes: ["hero", "legend"],
    rarity: "uncommon",
  },
  {
    id: "electric-cyan",
    name: "エレクトリックシアンオーラ",
    archetypeName: "頭回り最速マン",
    catchCopy: "鋭い閃光が、知性とスピード感をまとって走る。",
    description:
      "あなたの纏う空気感は、頭の回転が速いスパーク。会話にキレとテンポを与えます。",
    gradient:
      "radial-gradient(circle at 25% 30%, #22d3ee, transparent 45%), radial-gradient(circle at 75% 60%, #67e8f9, transparent 50%), linear-gradient(135deg, #042f2e 0%, #083344 100%)",
    palette: { a: "#22d3ee", b: "#67e8f9", c: "#06b6d4" },
    keywords: ["知性派", "天才的バカ", "バグ技", "空気清浄機", "カリスマ"],
    attributes: ["intellect", "cool"],
    rarity: "uncommon",
  },
  {
    id: "imp-neon",
    name: "小悪魔ネオンオーラ",
    archetypeName: "小悪魔天使",
    catchCopy: "甘さと鋭さが同居する、ギャップのネオンスパーク。",
    description:
      "あなたの纏う空気感は、予想外の魅力で人を惹きつけるハイブリッドタイプです。",
    gradient:
      "radial-gradient(circle at 30% 20%, #f472b6, transparent 45%), radial-gradient(circle at 70% 70%, #a855f7, transparent 50%), linear-gradient(135deg, #2a0a1f 0%, #1a1033 100%)",
    palette: { a: "#f472b6", b: "#a855f7", c: "#ec4899" },
    keywords: ["ギャップの鬼", "ツンデレ", "クールに見えてドジ", "天然毒舌", "距離感バグ", "だるいのに有能", "口下手なのに毒舌", "人見知り", "腹黒"],
    attributes: ["imp", "chaos"],
    rarity: "rare",
  },
  {
    id: "midnight-moon",
    name: "ミッドナイトムーンオーラ",
    archetypeName: "夜更かし詩人",
    catchCopy: "夜の静寂に溶ける、眠気と余白のシルバー光。",
    description:
      "あなたの纏う空気感は、落ち着いた夜の詩人。マイペースで独自の世界観を持っています。",
    gradient:
      "radial-gradient(circle at 30% 25%, #94a3b8, transparent 45%), radial-gradient(circle at 70% 75%, #6366f1, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    palette: { a: "#94a3b8", b: "#6366f1", c: "#818cf8" },
    keywords: ["深夜テンション", "儚げ", "マイナスイオン", "透明感", "ミステリアス", "冷徹"],
    attributes: ["cool", "mystic"],
    rarity: "rare",
  },
  {
    id: "otaku-galaxy",
    name: "オタク銀河オーラ",
    archetypeName: "推し命銀河",
    catchCopy: "深宇宙のような情熱が、好きを全力で放つ。",
    description:
      "あなたの纏う空気感は、ニッチへの愛が輝く銀河。同好と出会うと一気に加速します。",
    gradient:
      "radial-gradient(circle at 20% 30%, #818cf8, transparent 45%), radial-gradient(circle at 80% 50%, #c084fc, transparent 50%), radial-gradient(circle at 50% 85%, #22d3ee, transparent 55%), linear-gradient(135deg, #0f0a2e 0%, #1a0a2e 100%)",
    palette: { a: "#818cf8", b: "#c084fc", c: "#22d3ee" },
    keywords: ["限界オタク", "沼", "異世界転生", "概念", "バグ技", "NPC", "推し活の鬼", "推ししか勝たん"],
    attributes: ["otaku", "chaos"],
    rarity: "uncommon",
  },
  {
    id: "crimson-rebel",
    name: "クリムゾンリベルオーラ",
    archetypeName: "反骨番長",
    catchCopy: "熱を帯びた赤が、既存の枠を軽やかに壊す。",
    description:
      "あなたの纏う空気感は、反骨心と魅力が同居した炎。場の空気を自分色に染めます。",
    gradient:
      "radial-gradient(circle at 30% 25%, #f43f5e, transparent 45%), radial-gradient(circle at 75% 65%, #fb7185, transparent 50%), linear-gradient(135deg, #2a0510 0%, #1a0508 100%)",
    palette: { a: "#f43f5e", b: "#fb7185", c: "#e11d48" },
    keywords: ["治安悪め", "狂気", "ラスボス", "天然毒舌", "ギャップの鬼"],
    attributes: ["chaos", "god"],
    rarity: "rare",
  },
  {
    id: "velvet-muse",
    name: "ベルベットミューズオーラ",
    archetypeName: "雰囲気芸人",
    catchCopy: "深く静かなベルベットが、創造の余韻を残す。",
    description:
      "あなたの纏う空気感は、感性の余白が美しいアーティスト気質。言葉にならない魅力があります。",
    gradient:
      "radial-gradient(circle at 25% 30%, #a78bfa, transparent 45%), radial-gradient(circle at 70% 70%, #c4b5fd, transparent 50%), linear-gradient(135deg, #1e1033 0%, #2e1065 100%)",
    palette: { a: "#a78bfa", b: "#c4b5fd", c: "#8b5cf6" },
    keywords: ["概念", "儚げ", "平成レトロ", "ミステリアス", "沼"],
    attributes: ["mystic", "intellect"],
    rarity: "rare",
  },
  {
    id: "mythic-quill",
    name: "神話のインクオーラ",
    archetypeName: "語り部の神",
    catchCopy: "物語そのものが滲み出す、金と墨の軌跡。",
    description:
      "あなたの纏う空気感は、人の人生を一章にしてしまう語り部。言葉の余韻が長く残ります。",
    gradient:
      "radial-gradient(circle at 25% 25%, #fde68a, transparent 42%), radial-gradient(circle at 75% 55%, #c4b5fd, transparent 48%), linear-gradient(135deg, #1c1917 0%, #292524 100%)",
    palette: { a: "#fde68a", b: "#c4b5fd", c: "#a8a29e" },
    keywords: ["知性派", "概念", "カリスマ", "黒幕", "平成レトロ", "ミステリアス"],
    attributes: ["legend", "mystic", "intellect"],
    rarity: "rare",
  },
  {
    id: "legendary-prism",
    name: "伝説のプリズムオーラ",
    archetypeName: "全属性持ち神",
    catchCopy: "多面の光が交差し、唯一無二のスペクトラムを放つ。",
    description:
      "あなたの纏う空気感は、ジャンルを超えたレジェンド。どんな属性とも共鳴する稀な存在です。",
    gradient:
      "radial-gradient(circle at 20% 20%, #f472b6, transparent 40%), radial-gradient(circle at 80% 25%, #67e8f9, transparent 40%), radial-gradient(circle at 50% 80%, #fde047, transparent 45%), linear-gradient(135deg, #1a0520 0%, #0c1a3a 100%)",
    palette: { a: "#f472b6", b: "#67e8f9", c: "#fde047" },
    keywords: ["ビジュ爆発", "圧倒的主人公", "カリスマ", "チート級", "異次元", "知性派"],
    attributes: ["legend", "hero"],
    rarity: "legendary",
  },
  {
    id: "golden-oracle",
    name: "ゴールデンオラクルオーラ",
    archetypeName: "説教聞かせマン",
    catchCopy: "金色の予兆が、運命のような説得力をまとう。",
    description:
      "あなたの纏う空気感は、言葉に重みがあるオラクル。周囲が自然と耳を傾けてしまいます。",
    gradient:
      "radial-gradient(circle at 30% 25%, #facc15, transparent 45%), radial-gradient(circle at 70% 70%, #fde68a, transparent 50%), linear-gradient(135deg, #1a1500 0%, #422006 100%)",
    palette: { a: "#facc15", b: "#fde68a", c: "#eab308" },
    keywords: ["カリスマ", "知性派", "黒幕", "頼れる相棒", "圧倒的主人公"],
    attributes: ["legend", "intellect"],
    rarity: "legendary",
  },
];

/** シークレット（特殊条件でのみ発現） */
export const SECRET_AURA_TYPES: AuraType[] = [
  {
    id: "void-abyss",
    name: "虚無と深淵のヴォイドオーラ",
    archetypeName: "虚無NPC",
    catchCopy: "光すら飲み込む黒が、静かに広がる。",
    description:
      "あなたの纏う空気感は、存在感と不在感が同時に立つ深淵。言葉にできない引力があります。",
    gradient:
      "radial-gradient(circle at 30% 30%, #1e1b4b, transparent 40%), radial-gradient(circle at 70% 70%, #0f172a, transparent 45%), linear-gradient(135deg, #020617 0%, #111827 100%)",
    palette: { a: "#312e81", b: "#0f172a", c: "#1e293b" },
    keywords: ["NPC", "概念", "黒幕", "異次元", "距離感バグ"],
    attributes: ["void"],
    rarity: "secret",
  },
  {
    id: "phantom-mirror",
    name: "幻影ミラーオーラ",
    archetypeName: "別人スイッチ",
    catchCopy: "見る角度で別人になる、鏡面の蜃気楼。",
    description:
      "あなたの纏う空気感は、場面ごとに人格が切り替わる幻影。友達ごとに別キャラとして記憶されます。",
    gradient:
      "radial-gradient(circle at 28% 30%, #e879f9, transparent 40%), radial-gradient(circle at 72% 65%, #67e8f9, transparent 45%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    palette: { a: "#e879f9", b: "#67e8f9", c: "#c4b5fd" },
    keywords: ["ギャップの鬼", "ツンデレ", "距離感バグ", "NPC", "異次元", "ミステリアス"],
    attributes: ["void", "imp", "mystic"],
    rarity: "secret",
  },
  {
    id: "god-calamity",
    name: "天変地異のゴッドオーラ",
    archetypeName: "ラスボス候補",
    catchCopy: "矛盾する光が衝突し、神話級の轟きを生む。",
    description:
      "あなたの纏う空気感は、相反する力が同居した天変地異。見る者の常識を揺さぶります。",
    gradient:
      "radial-gradient(circle at 20% 20%, #fbbf24, transparent 40%), radial-gradient(circle at 80% 30%, #f43f5e, transparent 40%), radial-gradient(circle at 50% 80%, #22d3ee, transparent 45%), linear-gradient(135deg, #1a0505 0%, #0c1a3a 100%)",
    palette: { a: "#fbbf24", b: "#f43f5e", c: "#22d3ee" },
    keywords: ["圧倒的主人公", "ラスボス", "狂気", "治安悪め", "チート級"],
    attributes: ["god"],
    rarity: "secret",
  },
  {
    id: "absolute-crystal",
    name: "絶対零度のクリスタルオーラ",
    archetypeName: "触れがたい美人",
    catchCopy: "氷点下の透明さが、すべてを映し切る。",
    description:
      "あなたの纏う空気感は、冷たく美しいクリスタル。触れにくい距離感が逆に惹きつけます。",
    gradient:
      "radial-gradient(circle at 30% 25%, #e0f2fe, transparent 45%), radial-gradient(circle at 70% 70%, #67e8f9, transparent 50%), linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)",
    palette: { a: "#e0f2fe", b: "#67e8f9", c: "#38bdf8" },
    keywords: ["絶対零度", "透明感", "儚げ", "マイナスイオン", "ミステリアス"],
    attributes: ["crystal"],
    rarity: "secret",
  },
];

/** 図鑑表示用（全種・シークレット含む） */
export const AURA_TYPES: AuraType[] = [...STANDARD_AURA_TYPES, ...SECRET_AURA_TYPES];

export const ALL_AURA_TYPES: AuraType[] = [DORMANT_AURA, ...AURA_TYPES];

/** 似たオーラをまとめる系統（図鑑の並び・色分け用） */
export type AuraLineage = {
  id: string;
  /** ラブタイプ風の短いコード */
  code: string;
  name: string;
  tagline: string;
  /** 系統ヘッダーのアクセント色 */
  accent: string;
  accentSoft: string;
  auraIds: readonly string[];
};

export const AURA_LINEAGES: readonly AuraLineage[] = [
  {
    id: "solar",
    code: "SL",
    name: "太陽系",
    tagline: "陽キャ・癒し・距離感の近さ。そばにいると場が温まる系統。",
    accent: "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.18)",
    auraIds: ["sunrise-hero", "healing-mint", "soft-peach", "menhera-pulse", "gourmet-sun"],
  },
  {
    id: "chaos",
    code: "CH",
    name: "カオス系",
    tagline: "盛り上げ・ギャップ・推し愛。予測不能で巻き込む系統。",
    accent: "#e879f9",
    accentSoft: "rgba(232, 121, 249, 0.18)",
    auraIds: ["chaos-neon", "hentai-nebula", "otaku-galaxy", "imp-neon", "crimson-rebel"],
  },
  {
    id: "mystic",
    code: "MY",
    name: "神秘系",
    tagline: "じわ惹き・クール・感性。静かに残る空気感の系統。",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.18)",
    auraIds: ["mystic-purple", "electric-cyan", "midnight-moon", "velvet-muse"],
  },
  {
    id: "legend",
    code: "LG",
    name: "伝説系",
    tagline: "野心・物語・説得力。頂点クラスの光をまとう系統。",
    accent: "#cbd5e1",
    accentSoft: "rgba(203, 213, 225, 0.14)",
    auraIds: ["dream-chaser", "mythic-quill", "legendary-prism", "golden-oracle"],
  },
  {
    id: "secret",
    code: "SC",
    name: "秘匿系",
    tagline: "特殊条件でのみ発現する、幻のオーラたち。",
    accent: "#7c3aed",
    accentSoft: "rgba(124, 58, 237, 0.22)",
    auraIds: ["void-abyss", "phantom-mirror", "absolute-crystal", "god-calamity"],
  },
];

export const RARITY_ORDER: Record<AuraRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3,
  secret: 4,
};

export function sortAurasByRarity<T extends { rarity: AuraRarity }>(auras: T[]): T[] {
  return [...auras].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
}

export function getAuraLineage(auraId: string): AuraLineage | undefined {
  return AURA_LINEAGES.find((lineage) => lineage.auraIds.includes(auraId));
}

export const RARITY_LABELS: Record<AuraRarity, string> = {
  common: "コモン",
  uncommon: "アンコモン",
  rare: "レア",
  legendary: "レジェンド",
  secret: "シークレット",
};

const WORD_NUANCE: Record<string, string> = {
  ビジュ爆発: "視覚情報量マシマシ",
  圧倒的主人公: "主役級の存在感",
  透明感: "クリアで澄んだ雰囲気",
  カリスマ: "引力の強さ",
  儚げ: "触れにくい余韻",
  平成レトロ: "懐かしさ全開",
  シルエット強め: "輪郭のキレ",
  沼: "抜け出せない魅力",
  マイナスイオン: "空気浄化力",
  距離感バグ: "読めない間合い",
  陽キャバイブス: "場を明るくする力",
  癒やし枠: "和ませる安心感",
  頼れる相棒: "頼れる安定感",
  空気清浄機: "ノイズ浄化スキル",
  深夜テンション: "夜更け加速",
  限界オタク: "好きへの全振り",
  NPC: "背景に溶ける静けさ",
  治安悪め: "危ない香り",
  狂気: "常識外の熱量",
  天才的バカ: "バカと天才の同居",
  草不可避: "笑い誘発力",
  ギャップの鬼: "落差の破壊力",
  ツンデレ: "冷たさと甘さの同居",
  クールに見えてドジ: "隙のかわいさ",
  ミステリアス: "語られない余白",
  知性派: "頭のキレ",
  実は寂しがり: "寂しがり属性",
  天然毒舌: "無自覚な一撃",
  概念: "言語化不能なオーラ",
  黒幕: "影から場を動かす力",
  異世界転生: "別世界設定感",
  絶対零度: "氷点下の透明さ",
  ラスボス: "最終局面の威圧",
  バグ技: "仕様外の一手",
  異次元: "ズレた次元感",
  チート級: "バランス崩壊級",
  写真写り良すぎ: "盛れすぎ問題",
  自撮りの鬼: "自撮り全振り",
  返信早すぎ: "返信速度バグ",
  既読スルー魔: "既読放置力",
  空気読みすぎ: "配慮過多",
  飲み会の潤滑油: "場の潤滑油",
  予定キャンセル多め: "ドタキャ属性",
  理論武装: "論破待ち",
  突然ボケる: "不意打ちボケ",
  リアクション過剰: "リアクション特大",
  飯テロ魔: "飯テロ力",
  遅刻常習: "時間感覚バグ",
  テンション継続不能: "テンション消耗早",
  語彙がネット: "ネット語彙100%",
  説教モード: "説教全開",
  寝落ち担当: "寝落ち率最高",
  自虐ネタ過多: "自虐ネタ過剰",
  推ししか勝たん: "推し一択",
  だるいのに有能: "だるさと有能の矛盾",
  人見知り: "人見知り全開",
  エモい: "エモさ全開",
  推し活の鬼: "推し活全振り",
  口下手なのに毒舌: "口下手×毒舌",
  一人称が強い: "一人称がキャラ",
  グルチャ未読: "既読回避",
  音痴なのに熱い: "音痴なのに情熱",
  笑いの引力: "笑いを引き寄せる",
};

type ContradictionPair = {
  groupA: readonly string[];
  groupB: readonly string[];
  opener: (wordA: string, wordB: string) => string;
};

const CONTRADICTION_PAIRS: ContradictionPair[] = [
  {
    groupA: ["圧倒的主人公", "カリスマ", "ビジュ爆発", "チート級"],
    groupB: ["NPC", "概念", "空気清浄機"],
    opener: (a, b) =>
      `「${a}」なのに「${b}」も入っている異常事態。相手によって見せる顔が違いすぎて、周囲は毎回キャラ設定を更新させられています。`,
  },
  {
    groupA: ["限界オタク", "沼", "異世界転生"],
    groupB: ["圧倒的主人公", "カリスマ", "頼れる相棒"],
    opener: (a, b) =>
      `「${a}」と「${b}」が同居するハイブリッドタイプ。推しの話になると主役級、それ以外は背景キャラ、という二面性が友達を混乱させています。`,
  },
  {
    groupA: ["癒やし枠", "マイナスイオン", "頼れる相棒"],
    groupB: ["治安悪め", "狂気", "天然毒舌"],
    opener: (a, b) =>
      `一見「${a}」なのに「${b}」要素もある矛盾体。優しさと危なさが同時に来るので、周囲は油断できません。`,
  },
  {
    groupA: ["陽キャバイブス", "草不可避", "ビジュ爆発"],
    groupB: ["ミステリアス", "絶対零度", "儚げ"],
    opener: (a, b) =>
      `「${a}」×「${b}」のギャップいじり案件。明るいのに近づきにくい、という友達目線のツッコミどころ満載です。`,
  },
  {
    groupA: ["知性派", "黒幕", "カリスマ"],
    groupB: ["天才的バカ", "クールに見えてドジ", "草不可避"],
    opener: (a, b) =>
      `「${a}」なのに「${b}」という、頭が良いのかバグってるのか判定不能な状態。会議中と飲み会後で評価が二つに割れます。`,
  },
  {
    groupA: ["クールに見えてドジ", "ミステリアス", "ツンデレ"],
    groupB: ["陽キャバイブス", "深夜テンション", "限界オタク"],
    opener: (a, b) =>
      `普段は「${a}」を装っているのに、特定条件下で「${b}」が漏れ出すタイプ。周囲はいつスイッチが入るか読めません。`,
  },
  {
    groupA: ["返信早すぎ", "癒やし枠", "頼れる相棒"],
    groupB: ["既読スルー魔", "グルチャ未読", "NPC"],
    opener: (a, b) =>
      `「${a}」なのに「${b}」も入っている通信障害タイプ。距離感の更新頻度が友達を翻弄しています。`,
  },
  {
    groupA: ["だるいのに有能", "寝落ち担当", "予定キャンセル多め"],
    groupB: ["圧倒的主人公", "カリスマ", "説教モード"],
    opener: (a, b) =>
      `「${a}」と「${b}」の矛盾。サボってるように見えて要所で仕事する、説教だけは本気、という不可解なキャラです。`,
  },
];

const WITNESS_BY_WORD: Record<string, readonly string[]> = {
  NPC: [
    "周囲からは『いるけど説明が難しい人』として認識されています",
    "一見背景キャラですが、要所で刺さるタイプです",
  ],
  限界オタク: [
    "周囲からは『推しの話になると別人』として認識されています",
    "一見普通ですが、好きなカルチャーの話で急加速します",
  ],
  圧倒的主人公: [
    "周囲からは『なんか主役感ある人』として認識されています",
    "集合写真でも視線が集まりがちなタイプです",
  ],
  癒やし枠: [
    "周囲からは『そばにいると落ち着く人』として認識されています",
    "一見穏やかですが、実は場の空気を整える要です",
  ],
  治安悪め: [
    "周囲からは『面白いけど油断ならない人』として認識されています",
    "一見普通ですが、何を言い出すか読めないタイプです",
  ],
  ギャップの鬼: [
    "周囲からは『見た目と中身が違いすぎる人』として認識されています",
    "初対面の印象と3ヶ月後の評価が一致しません",
  ],
  ミステリアス: [
    "周囲からは『何を考えてるか分からない人』として認識されています",
    "一見クールですが、実は意外と感情豊かです",
  ],
  カリスマ: [
    "周囲からは『なんか惹かれる人』として認識されています",
    "本人は普通つもりでも、自然と中心にいます",
  ],
  天才的バカ: [
    "周囲からは『天才なのかバカなのか』として認識されています",
    "一見ドジですが、要所で神プレイを見せます",
  ],
  既読スルー魔: [
    "周囲からは『既読つくのに返信来ない人』として認識されています",
    "一見クールですが、実は返信迷子タイプです",
  ],
  だるいのに有能: [
    "周囲からは『サボってるのに仕事できる人』として認識されています",
    "一見だるそうですが、要所で急に有能になります",
  ],
  推ししか勝たん: [
    "周囲からは『推しの話になると別人』として認識されています",
    "推し以外の話題だと急に省エネモードになります",
  ],
  突然ボケる: [
    "周囲からは『真面目な場で急にボケる人』として認識されています",
    "空気が白けた瞬間にツッコミどころを提供します",
  ],
  実は寂しがり: [
    "周囲からは『意外と寂しがりそうな人』として認識されています",
    "一見強そうですが、実は連絡待ちしてます",
  ],
};

const WITNESS_BY_ATTRIBUTE: Partial<Record<AuraAttribute, readonly string[]>> = {
  hero: ["周囲からは『頼れる/目立つ人』として認識されています"],
  heal: ["周囲からは『癒し系』として認識されています"],
  chaos: ["周囲からは『場を盛り上げる人』として認識されています"],
  otaku: ["周囲からは『好きが深い人』として認識されています"],
  mystic: ["周囲からは『読めないけど惹かれる人』として認識されています"],
  intellect: ["周囲からは『頭が回る人』として認識されています"],
  imp: ["周囲からは『ギャップがすごい人』として認識されています"],
  void: ["周囲からは『静かに存在感がある人』として認識されています"],
  god: ["周囲からは『規格外の人』として認識されています"],
  crystal: ["周囲からは『近づきにくい美人/美オーラ』として認識されています"],
};

const PUNCHLINE_BY_WORD: Record<string, readonly string[]> = {
  深夜テンション: [
    "ただし22時を過ぎると別人格が起動します",
    "昼間は省エネモードに入りがちです",
  ],
  限界オタク: [
    "好きな話題になると光速で早口になります",
    "推しの話以外は返答が短くなります",
  ],
  NPC: [
    "ただし充電が切れると急に置物モードに入ります",
    "名前を呼ばれるまで反応しないことがあります",
  ],
  実は寂しがり: [
    "ただし既読スルーされると急に小型化します",
    "一人の時間が長いと充電不足になります",
  ],
  クールに見えてドジ: [
    "ただしドジると周囲の好感度が上がるバグ仕様です",
    "カッコつけようとして転ぶと伝説になります",
  ],
  天才的バカ: [
    "ただし説明中に急に脱線して草を生やします",
    "正解と大外れを同時に出すことがあります",
  ],
  陽キャバイブス: [
    "ただしテンション上げすぎて周囲が疲れることがあります",
    "静かな場所だと急に音量調整に失敗します",
  ],
  距離感バグ: [
    "ただし距離感の更新が遅れて周囲が困惑します",
    "急に距離が縮まったり離れたりします",
  ],
  ツンデレ: [
    "ただし素直になろうとすると言葉が逆走します",
    "照れると会話が短くなります",
  ],
  マイナスイオン: [
    "ただし自分のエネルギーは消耗しがちです",
    "場を整えすぎて本人だけ疲れます",
  ],
  治安悪め: [
    "ただし発言のハードルが低い日は要注意です",
    "ノリに乗ると周囲が止め役になります",
  ],
  知性派: [
    "ただし説明が長くなり始めると会話が終わりません",
    "正論で場を静めてしまうことがあります",
  ],
  草不可避: [
    "ただし真面目な場でも笑い我慢が限界になります",
    "ツッコミ待ちの空気を作ってしまいます",
  ],
  既読スルー魔: [
    "ただし返信が来ると長文で返してくることがあります",
    "既読だけは秒速、返信は別人格が担当します",
  ],
  だるいのに有能: [
    "ただし本番5分前に急に覚醒します",
    "普段はだるいのに締切前だけチート級になります",
  ],
  突然ボケる: [
    "ただし空気が白けた直後に一番面白いことを言います",
    "真面目な会議中に限ってボケが入ります",
  ],
  推ししか勝たん: [
    "ただし推しの話以外は返答が短くなります",
    "推しの話題になると早口モードに入ります",
  ],
  理論武装: [
    "ただし好きな話題になると説教モード全開です",
    "議論が始まると帰宅時間が不明になります",
  ],
  飯テロ魔: [
    "ただし深夜にグルチャで飯テロを仕掛けます",
    "お腹が空いてない時でも飯の話でテンションが上がります",
  ],
};

const PUNCHLINE_BY_AURA: Partial<Record<string, readonly string[]>> = {
  "chaos-neon": ["ただし予測不能すぎて友達が毎回ドキドキしています"],
  "hentai-nebula": ["ただし質問のタイミングを外すと空気が凍ることがあります"],
  "menhera-pulse": ["ただし既読が遅いと情緒の天気が急変することがあります"],
  "otaku-galaxy": ["ただし推しの話になると周囲の会話参加権が剥奪されます"],
  "imp-neon": ["ただしギャップで毎回ツッコミどころが更新されます"],
  "midnight-moon": ["ただし夜型モードの時だけ語彙力が上がります"],
  "mystic-purple": ["ただし心を開くまでに時間がかかります"],
  "healing-mint": ["ただし自分の休息は後回しになりがちです"],
};

const ECOLOGY_BY_WORD: Partial<Record<string, AuraEcologyCore>> = {
  限界オタク: {
    trigger: "推しの話題 / 新刊・新作の話",
    sideEffect: "周囲の会話が一方向に流れる",
    weakness: "ネタバレ / 推しの炎上",
  },
  変態: {
    trigger: "好きな話題 / ひらめき",
    sideEffect: "周囲がツッコミ役に就く",
    weakness: "真面目な場 / 初対面",
  },
  話が急に濃くなる: {
    trigger: "雑談が伸びた時 / 二人きり",
    sideEffect: "話題の濃度が一気に上がる",
    weakness: "浅い雑談だけしたい日",
  },
  趣味の解像度バグ: {
    trigger: "好きな話題 / 推し語り",
    sideEffect: "周囲が『そこまで見る？』となる",
    weakness: "興味ゼロの相手",
  },
  質問がえぐい: {
    trigger: "沈黙 / 油断した瞬間",
    sideEffect: "周囲が固まる",
    weakness: "プライバシー重視の相手",
  },
  夜になると別人: {
    trigger: "22時以降 / 帰りのチャット",
    sideEffect: "昼間の印象が書き換わる",
    weakness: "翌朝の予定 / 早起き義務",
  },
  ノリの射程が長い: {
    trigger: "ノリが乗った集まり",
    sideEffect: "話題の許容レンジが広がる",
    weakness: "初対面のフォーマル",
  },
  温度差に敏感: {
    trigger: "沈黙が長い時 / 返信が遅い時",
    sideEffect: "関係の温度計が回り始める",
    weakness: "確認疲れした相手",
  },
  愛され上手: {
    trigger: "気心知れた相手 / 弱音を吐ける空気",
    sideEffect: "周囲の保護欲が起動する",
    weakness: "初対面 / 厳しい上司",
  },
  反応待ちがち: {
    trigger: "メッセージ送信直後",
    sideEffect: "相手の反応速度が気になる",
    weakness: "オフラインの相手",
  },
  余白が怖い: {
    trigger: "予定が空いた日 / 連絡が途切れた時",
    sideEffect: "周囲が気にかけてくれる",
    weakness: "忙しい相手 / 距離を取りたい相手",
  },
  情緒お天気: {
    trigger: "感情が動いた瞬間 / 夜",
    sideEffect: "場の温度が急上昇・急降下する",
    weakness: "冷静さが必要な場",
  },
  そばにいてほしい系: {
    trigger: "一人時間 / 返信待ち",
    sideEffect: "周囲がそばに居たくなる",
    weakness: "相手のキャパ不足",
  },
  深夜テンション: {
    trigger: "22時以降 / 飲み会の2軒目",
    sideEffect: "近くにいる人の睡眠時間を削る",
    weakness: "翌朝の自分 / 早朝の予定",
  },
  NPC: {
    trigger: "名前を呼ばれる / 馴染みのグループ",
    sideEffect: "気づくと会話の背景に溶けている",
    weakness: "急な自己紹介 / 注目を集める役割",
  },
  圧倒的主人公: {
    trigger: "チームが困っている / イベント本番",
    sideEffect: "周囲が自然と頼りにする",
    weakness: "サブ役指定 / 目立てない場",
  },
  癒やし枠: {
    trigger: "誰かが落ち込んでいる / 場が白けた",
    sideEffect: "周囲のテンションが安定する",
    weakness: "自分が限界の時 / 褒められすぎる",
  },
  治安悪め: {
    trigger: "ノリが乗った時 / 深夜0時を過ぎる",
    sideEffect: "近くにいる人の心拍数が上がる",
    weakness: "真面目な場 / 上司がいる",
  },
  ギャップの鬼: {
    trigger: "信頼できる相手 / 油断した瞬間",
    sideEffect: "周囲が「え、そうなの？」と混乱する",
    weakness: "初対面 / 完璧を演じ続ける日",
  },
  天才的バカ: {
    trigger: "好きな分野の話 / ひらめき",
    sideEffect: "周囲がツッコミ役に就く",
    weakness: "説明を求められる / 時間制限",
  },
  カリスマ: {
    trigger: "人前 / 本番直前",
    sideEffect: "視線が自然と集まる",
    weakness: "地味に過ごしたい日 / 過剰な期待",
  },
  実は寂しがり: {
    trigger: "既読がつかない / 長い一人時間",
    sideEffect: "近くの人が気にしてくれる",
    weakness: "連絡待ち / 突如の予定キャンセル",
  },
  知性派: {
    trigger: "議論 / 難しい話題",
    sideEffect: "会話のレベルが上がる",
    weakness: "雑談のみ / 説明時間の制限",
  },
  陽キャバイブス: {
    trigger: "友達と集まる / イベント",
    sideEffect: "場の温度が上がる",
    weakness: "静かな場 / テンション差",
  },
  距離感バグ: {
    trigger: "気心知れた相手 / テンション上昇",
    sideEffect: "周囲が距離の再計算を強いられる",
    weakness: "初対面 / フォーマルな場",
  },
  ミステリアス: {
    trigger: "深い話 / 夜の時間帯",
    sideEffect: "周囲が勝手に考察を始める",
    weakness: "雑談だけ / 急な質問攻め",
  },
  マイナスイオン: {
    trigger: "場が荒れている / 争いの後",
    sideEffect: "周囲のイライラが静まる",
    weakness: "自分のストレス / 過密スケジュール",
  },
  草不可避: {
    trigger: "ネタ枠 / 空気が白けた時",
    sideEffect: "周囲の笑いが止まらなくなる",
    weakness: "真面目モード / 厳しい上司",
  },
  既読スルー魔: {
    trigger: "返信内容を考えすぎる / 通知が多い",
    sideEffect: "相手の既読確認が止まらなくなる",
    weakness: "「返信早く」 / 電話",
  },
  だるいのに有能: {
    trigger: "締切直前 / 本番5分前",
    sideEffect: "周囲が「なんで今できる？」と混乱する",
    weakness: "余裕がある時 / 朝の時間帯",
  },
  突然ボケる: {
    trigger: "空気が白けた / 真面目な場",
    sideEffect: "周囲の笑いが止まらなくなる",
    weakness: "真剣な相談 / 初対面",
  },
  推ししか勝たん: {
    trigger: "推しの話題 / ライブ前後",
    sideEffect: "会話が推し一方向に流れる",
    weakness: "ネタバレ / 推しの不調",
  },
  理論武装: {
    trigger: "好きな話題 / 議論",
    sideEffect: "周囲がツッコミ役に就く",
    weakness: "雑談のみ / 時間制限",
  },
};

const ECOLOGY_BY_AURA: Partial<Record<string, AuraEcologyCore>> = {
  "chaos-neon": {
    trigger: "テンション上昇 / 深夜0時を過ぎる",
    sideEffect: "近くにいる人の予測能力が一時的に低下する",
    weakness: "真面目な会議 / 静かな図書館",
  },
  "hentai-nebula": {
    trigger: "好きな話題 / 禁断の質問が浮かんだ瞬間",
    sideEffect: "周囲の常識ゲージが一時的に溶ける",
    weakness: "真面目な自己紹介 / 上司がいる場",
  },
  "menhera-pulse": {
    trigger: "既読が遅い時 / かまってほしい瞬間",
    sideEffect: "周囲の返信速度と保護欲が上がる",
    weakness: "予定が詰まった日 / 反応が薄い相手",
  },
  "otaku-galaxy": {
    trigger: "好きなカルチャーの話 / 同好と出会う",
    sideEffect: "周囲の会話速度が上がる",
    weakness: "ネタバレ / 推しの不調",
  },
  "imp-neon": {
    trigger: "油断した瞬間 / 親しい相手",
    sideEffect: "周囲がギャップにツッコミたくなる",
    weakness: "完璧を演じる必要がある日",
  },
  "void-abyss": {
    trigger: "大人数 / 初対面の場",
    sideEffect: "存在と不在が同時に観測される",
    weakness: "急な自己紹介 / 注目枠",
  },
  "god-calamity": {
    trigger: "本番 / 矛盾する要素が同時発火",
    sideEffect: "周囲の常識が一時的にバグる",
    weakness: "落ち着いた日常 / 説明責任",
  },
};

type DiagnosisCtx = {
  aura: AuraType;
  a: string;
  b: string;
  c: string;
  evidence: VoteEvidence[];
  totalVotes: number;
  uniqueCount: number;
};

type AuraDiagnosisKit = {
  reading: (ctx: DiagnosisCtx) => string;
  shadow: (ctx: DiagnosisCtx) => string;
  ecology: (ctx: DiagnosisCtx) => AuraEcologyCore;
};

function pairLabel(a: string, b: string) {
  return a === b ? `「${a}」` : `「${a}」と「${b}」`;
}

/** 通り名ごとの読み解き診断（票を解釈する本編） */
const DIAGNOSIS_BY_AURA: Partial<Record<string, AuraDiagnosisKit>> = {
  "chaos-neon": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位に来る人は、私生活の集まりでも場を動かそうとするタイプ。周りからは『この人がいると楽しい』『空気が明るくなる』と思われやすい傾向があります。盛り上げは偶然ではなく、リアクションやノリで場を支える習慣として染みついています。`,
    shadow: ({ a }) =>
      `一方で「${a}」が強く出すぎると、静かな場や本気の話で周囲がついていけなくなることも。盛り上げ役を休みたい日は、意識して省エネモードに切り替えるとバランスが取りやすいです。`,
    ecology: ({ a, b }) => ({
      trigger: `友達との集まり / 会話が止まりかけた瞬間 / 「${a}」が自然に出る空気`,
      sideEffect: `周囲のノリが一段階上がり、『楽しい枠』『潤滑油枠』として期待され始める`,
      weakness: `静かで真剣な場 / 盛り上げ役を休みたい日 / 「${b}」を求められる連続出勤`,
    }),
  },
  "hentai-nebula": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が刺さっている人は、好奇心のブレーキが薄い『むっつりど変態』タイプ。周りからは『質問が深すぎる』『好きの解像度が高すぎる』『でも話してて面白い』と思われやすく、場の空気を一瞬で沼に引きずり込みます。`,
    shadow: () =>
      `好奇心は最大の武器ですが、相手の温度を見ずに禁断質問を投げると引かれることも。『この沼、一緒に入る？』の許可取りができると、ど変態も愛されるキャラになります。`,
    ecology: ({ a }) => ({
      trigger: `好きな話の深掘り / 夜のテンション / 「${a}」が出る瞬間`,
      sideEffect: `周囲の常識が一時停止し、ツッコミと笑いが同時発生する`,
      weakness: `堅い公式の場 / 興味ゼロの相手への直球質問`,
    }),
  },
  "menhera-pulse": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、愛情確認と寂しさが表裏一体の『メンヘラかまってちゃん』タイプ。周りからは『かまうと喜ぶ』『反応が遅いと不安そう』『でも愛され方は上手い』と思われやすく、関係性の温度計になりがちです。`,
    shadow: () =>
      `かまってほしい気持ちは本音ですが、確認が連続すると相手の電池が切れます。『不安になった理由』を一言添えるだけで、かまってちゃんも長続きする愛されキャラになります。`,
    ecology: ({ a }) => ({
      trigger: `既読待ち / 一人時間 / 「${a}」が疼く瞬間`,
      sideEffect: `周囲がかまう役・安心材料役に回り始める`,
      weakness: `返信が滞る繁忙期 / 反応の薄い相手との長期戦`,
    }),
  },
  "sunrise-hero": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が効いている人は、困っている場や本番で前に出やすい太陽タイプ。友達からは『頼りになる』『主人公感がある』と見られやすく、自然と中心に置かれがちです。`,
    shadow: () =>
      `ただし主役枠を背負いすぎると、休む許可を自分に出せなくなりがち。サブ役や見守る役を意識的に選ぶと、周囲との距離も長く保ちやすいです。`,
    ecology: ({ a }) => ({
      trigger: `チームが困った時 / 本番直前 / 「${a}」が求められる場面`,
      sideEffect: `周囲が自然とフォロー役に回り、期待値がじわじわ上がる`,
      weakness: `目立てない日 / 主役を休みたい時 / 過剰な期待の連続`,
    }),
  },
  "healing-mint": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が目立つ人は、そばにいるだけで場の呼吸が深くなるタイプ。周りからは『落ち着く』『話しやすい』と思われやすく、相談や愚痴の受け皿になりやすい傾向があります。`,
    shadow: () =>
      `優しさが武器になる反面、自分の不調を後回しにして消耗しやすいのが影。頼まれる前に、自分の充電時間を確保できるかが長く続くコツです。`,
    ecology: ({ a }) => ({
      trigger: `誰かが落ち込んでいる時 / 場が荒れた直後 / 「${a}」が欲しくなる空気`,
      sideEffect: `周囲のテンションが安定し、相談が集中し始める`,
      weakness: `自分が限界の日 / 休めない連続シフト / 褒められすぎて逃げ場がない時`,
    }),
  },
  "gourmet-sun": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、食や笑いなど日常の幸福で人を巻き込む太陽。『一緒にいると元気が出る』『話題が尽きない』印象を持たれやすいです。`,
    shadow: () =>
      `陽気さが強すぎると、疲れている相手には刺激が勝ちすぎることがあります。相手の空腹と心の余白を同時に見るのが、このタイプの上級プレイです。`,
    ecology: ({ a }) => ({
      trigger: `ご飯の話 / 夜のノリ / 「${a}」が伝染する集まり`,
      sideEffect: `周囲の食欲とテンションが同時に上がる`,
      weakness: `静かな食事 / ダイエット宣言中の友人 / 朝イチの冷静な会議`,
    }),
  },
  "soft-peach": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が効く人は、距離の縮め方が上手くて親しみやすいタイプ。周りからは『打ち解けやすい』『なんか安心する』と感じられやすいです。`,
    shadow: () =>
      `近さは魅力ですが、相手によっては距離感の更新が追いつかないことも。好意と遠慮のバランスを言語化できると、誤解が減ります。`,
    ecology: ({ a }) => ({
      trigger: `気心知れた相手 / 少人数の雑談 / 「${a}」が出やすいゆるい場`,
      sideEffect: `周囲の警戒が解け、会話が早く親密になる`,
      weakness: `フォーマルな初対面 / 距離を取りたい相手 / 誤解されやすい冗談`,
    }),
  },
  "mystic-purple": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、すぐに全部を見せない神秘枠。周りからは『読めないけど惹かれる』『深そう』と思われやすく、考察したくなる存在感があります。`,
    shadow: () =>
      `ミステリー感は強い武器ですが、閉じすぎると孤立や誤解の温床にもなります。信頼できる相手には意図的に一枚めくるのが長続きのコツです。`,
    ecology: ({ a }) => ({
      trigger: `夜の深い話 / 少人数 / 「${a}」が自然に滲む沈黙`,
      sideEffect: `周囲が勝手に考察を始め、印象が濃く残る`,
      weakness: `雑談だけの場 / 急な自己開示要求 / 説明しすぎるプレッシャー`,
    }),
  },
  "dream-chaser": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が効いている人は、未来の話や目標で周囲を引っ張るタイプ。『夢がある』『前を向いてる』と見られやすく、話を聞く側も元気をもらいやすいです。`,
    shadow: () =>
      `理想が強いぶん、今ここを軽く見られたり、周囲が置いていかれた感じを持つこともあります。足元の小さな達成も一緒に祝えると説得力が増します。`,
    ecology: ({ a }) => ({
      trigger: `目標の話 / 新しい挑戦の前夜 / 「${a}」が火がつく瞬間`,
      sideEffect: `周囲の野心ゲージが上がり、行動したくなる`,
      weakness: `現実の雑務だけが続く日 / 夢を茶化される空気`,
    }),
  },
  "electric-cyan": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、頭の回転と切れ味で場を動かすタイプ。周りからは『鋭い』『話が早い』と見られやすく、議論や企画で存在感が出ます。`,
    shadow: () =>
      `切れ味が強すぎると、雑談や感情の話では刺さりすぎることがあります。正しさより温度を優先するモードを持てると、人間関係の耐久度が上がります。`,
    ecology: ({ a }) => ({
      trigger: `議論 / 企画の詰まり / 「${a}」が刺さる知的な場`,
      sideEffect: `会話の解像度が上がり、周囲が思考モードに入る`,
      weakness: `感情だけの場 / 説明時間の制限 / 雑談オンリー`,
    }),
  },
  "imp-neon": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が同居する人は、見せ方と中身の落差で人を惹きつけるギャップ型。周りからは『予想外が面白い』『一筋縄ではいかない』と思われやすいです。`,
    shadow: () =>
      `ギャップは武器ですが、演じ続けすぎると本音の置き場がなくなります。安心できる相手の前では、わざとギャップを消す時間も必要です。`,
    ecology: ({ a }) => ({
      trigger: `油断した瞬間 / 親しい相手との雑談 / 「${a}」が顔を出す隙`,
      sideEffect: `周囲がツッコミと考察を同時に始め、印象が更新される`,
      weakness: `完璧を演じ続ける日 / ギャップを説明させられる場`,
    }),
  },
  "midnight-moon": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、夜や余白の時間で本領を発揮するタイプ。周りからは『マイペース』『夜に強い』『静かな引力がある』と見られやすいです。`,
    shadow: () =>
      `夜型の魅力は強い一方、昼間のテンション差で誤解されやすいのが影。朝の自分と夜の自分の取扱説明書を一言持っておくと楽です。`,
    ecology: ({ a }) => ({
      trigger: `夜更かしの会話 / 静かな余白 / 「${a}」が滲む深夜帯`,
      sideEffect: `周囲の語彙と感性が夜モードに切り替わる`,
      weakness: `早朝の予定 / 強制的なハイテンション場`,
    }),
  },
  "otaku-galaxy": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が強い人は、好きへの熱量が銀河級のタイプ。周りからは『推しが尊い』『好きなものの話が面白い』と思われやすく、同好が集まると一気に中心になります。`,
    shadow: () =>
      `熱量が強すぎると、興味のない相手には会話参加権が消えたように見えることも。入口の共有から始めると、推し活も人間関係も両立しやすいです。`,
    ecology: ({ a }) => ({
      trigger: `推し・趣味の話題 / 同好との遭遇 / 「${a}」が点火する瞬間`,
      sideEffect: `会話速度と情熱が急上昇し、周囲が巻き込まれ始める`,
      weakness: `ネタバレ / 推しの不調 / 興味ゼロの雑談だけが続く場`,
    }),
  },
  "crimson-rebel": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、枠を壊す熱と反骨で場を塗るタイプ。周りからは『カッコいい』『危ないけど魅力的』と感じられやすいです。`,
    shadow: () =>
      `反骨が強すぎると、ただの衝突に見える瞬間もあります。壊す対象を選ぶセンスがあると、魅力が長く残ります。`,
    ecology: ({ a }) => ({
      trigger: `理不尽な空気 / ノリが乗った夜 / 「${a}」が出る反骨スイッチ`,
      sideEffect: `周囲の常識ゲージが揺れ、誰かが止め役になる`,
      weakness: `堅い公式の場 / 説明責任が重い場面`,
    }),
  },
  "velvet-muse": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が効く人は、雰囲気そのものが作品になるミューズ型。周りからは『なんか綺麗』『余韻が残る』と思われやすく、言葉より空気で人を動かします。`,
    shadow: () =>
      `雰囲気任せになると、意図が伝わらず距離が空くことも。ときどき素の一言を足すと、ミューズ感が現実の関係にも着地します。`,
    ecology: ({ a }) => ({
      trigger: `良い光 / 静かな注目 / 「${a}」が映える空気`,
      sideEffect: `周囲の視線と想像力が集まり、印象が長く残る`,
      weakness: `雑な説明要求 / 雰囲気を壊す急ぎの用事`,
    }),
  },
  "mythic-quill": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、語りと解釈で世界を編むタイプ。周りからは『話がうまい』『見方が面白い』と思われやすく、場の意味づけ役になりがちです。`,
    shadow: () =>
      `語りが上手いぶん、事実より物語が先行して誤解を生むことも。聞き役モードを意識できると、信頼がさらに厚くなります。`,
    ecology: ({ a }) => ({
      trigger: `物語の話 / 解釈が分かれる話題 / 「${a}」が点火する語り場`,
      sideEffect: `周囲の想像力が走り出し、会話が長編化する`,
      weakness: `結論だけ求められる場 / 語りの余白がない締切`,
    }),
  },
  "legendary-prism": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が同時に強い人は、複数の光が重なるレア枠。周りからは『何者なんだろう』『総合力が高い』と見られやすく、印象が立体的です。`,
    shadow: () =>
      `多面性が魅力でも、全部を同時に出すと焦点がぼやけます。今日はどの面を表にするか選ぶと、伝説感がよりシャープになります。`,
    ecology: ({ a, b }) => ({
      trigger: `複数の要素が同時に求められた時 / 「${a}」と「${b}」が両方刺さる場`,
      sideEffect: `周囲の評価軸が増え、印象が更新され続ける`,
      weakness: `一つの役割に固定される日 / 説明しきれない多面性`,
    }),
  },
  "golden-oracle": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が効いている人は、助言や判断で周囲を導くタイプ。『この人に聞くと安心』『視点が一段高い』と思われやすいです。`,
    shadow: () =>
      `賢者枠は頼られますが、常に正解を出す役は重いです。わからないを言える瞬間があると、オラクルとしての信頼はむしろ増えます。`,
    ecology: ({ a }) => ({
      trigger: `相談が来た時 / 判断に迷う空気 / 「${a}」が求められる瞬間`,
      sideEffect: `周囲の不安が整理され、行動指針がクリアになる`,
      weakness: `軽口だけの場 / 常時フル相談の連続`,
    }),
  },
  "void-abyss": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、存在感と不在感が同時に立つヴォイド型。周りからは『いるのに読めない』『静かな重力がある』と感じられやすいです。`,
    shadow: () =>
      `沈黙は魅力ですが、放置されると忘れられた感覚にも繋がります。小さな合図を一つ残しておくと、関係が切れにくいです。`,
    ecology: ({ a }) => ({
      trigger: `大人数の端 / 名前を呼ばれた瞬間 / 「${a}」が滲む静けさ`,
      sideEffect: `周囲が存在確認と考察を同時に始め、印象が濃くなる`,
      weakness: `急な自己紹介 / 強制的なハイライト枠`,
    }),
  },
  "phantom-mirror": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が同居する人は、相手や場面で別人に見えるミラー型。周りからは『状況で顔が変わる』『合わせ方が上手い』と思われやすいです。`,
    shadow: () =>
      `合わせ上手は強みですが、自分の輪郭が薄くなる危険もあります。誰の前でも消えない一点を決めておくと、別人スイッチが怖くなくなります。`,
    ecology: ({ a, b }) => ({
      trigger: `相手が変わった瞬間 / 「${a}」と「${b}」の切り替えが必要な場`,
      sideEffect: `周囲が『さっきと別人？』と更新し、ギャップが話題になる`,
      weakness: `素を出す必要のある深い関係 / 役割固定の長期戦`,
    }),
  },
  "god-calamity": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}のような相反が上位に来る人は、規格外の天変地異タイプ。周りからは『予想不能』『いると何か起きる』と思われやすく、印象が強く残ります。`,
    shadow: () =>
      `破壊力は魅力ですが、日常の説明責任や落ち着きが弱点になりやすいです。発動条件を自分で把握できると、災害ではなく伝説になります。`,
    ecology: ({ a, b }) => ({
      trigger: `本番 / 「${a}」と「${b}」が同時発火する矛盾の瞬間`,
      sideEffect: `周囲の常識が一時停止し、話のネタが量産される`,
      weakness: `落ち着いた日常の継続 / 丁寧な説明が必要な場`,
    }),
  },
  "absolute-crystal": {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}が上位の人は、触れにくさと美しさが同居する結晶タイプ。周りからは『近づきにくい』『でも目が離せない』と感じられやすいです。`,
    shadow: () =>
      `冷たい印象は防壁になりますが、好意も弾きやすいです。温度を少しだけ通す許可を出せると、結晶がただの氷で終わりません。`,
    ecology: ({ a }) => ({
      trigger: `距離が必要な場 / 静かな視線 / 「${a}」が映えるクリアな空気`,
      sideEffect: `周囲が勝手に敬意と距離を取り始め、印象が研ぎ澄まされる`,
      weakness: `ベタベタした親密さの強制 / 温度を出しすぎる必要のある場`,
    }),
  },
};

function fallbackDiagnosisKit(aura: AuraType): AuraDiagnosisKit {
  return {
    reading: ({ a, b }) =>
      `${pairLabel(a, b)}の傾向から、${aura.archetypeName}としての輪郭がはっきりしています。友達目線では『${aura.catchCopy}』という印象に近く、日常のふるまいの積み重ねが診断結果に表れています。`,
    shadow: () =>
      `ただし『${aura.archetypeName}』らしさが強く出すぎると、周囲の反応が割れたり疲れが出たりします。強みを出しすぎない日を意図的に作ると、印象の寿命が伸びます。`,
    ecology: ({ a, b }) => {
      const base = ECOLOGY_BY_AURA[aura.id];
      if (base) {
        return {
          trigger: `${base.trigger}。とくに「${a}」が出やすい空気`,
          sideEffect: base.sideEffect,
          weakness: `${base.weakness} / 「${b}」を連続で求められる日`,
        };
      }
      return {
        trigger: `「${a}」が出やすい場面 / 友達と長くいる時間`,
        sideEffect: `周囲の印象が『${aura.archetypeName}』寄りのに更新される`,
        weakness: `素の自分を出せない空気 / 期待値だけが先行する日`,
      };
    },
  };
}

function getDiagnosisKit(aura: AuraType): AuraDiagnosisKit {
  return DIAGNOSIS_BY_AURA[aura.id] ?? fallbackDiagnosisKit(aura);
}

function pickStable<T>(items: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 9973;
  }
  return items[hash % items.length]!;
}

function findContradictionDetail(topWords: string[]): AuraContradiction | null {
  const wordSet = new Set(topWords);
  for (const pair of CONTRADICTION_PAIRS) {
    const wordA = topWords.find((word) => pair.groupA.includes(word));
    const wordB = topWords.find((word) => pair.groupB.includes(word));
    if (wordA && wordB && wordSet.has(wordA) && wordSet.has(wordB)) {
      return { wordA, wordB, text: pair.opener(wordA, wordB) };
    }
  }
  return null;
}

function buildWitness(aura: AuraType, topWords: string[]): string {
  for (const word of topWords) {
    const flavor = getWordResultFlavor(word);
    if (flavor?.witness) {
      return flavor.witness;
    }
    const options = WITNESS_BY_WORD[word];
    if (options) {
      return pickStable(options, `witness:${word}:${aura.id}`);
    }
  }

  for (const attr of aura.attributes) {
    const options = WITNESS_BY_ATTRIBUTE[attr];
    if (options) {
      return pickStable(options, `witness-attr:${attr}:${aura.id}`);
    }
  }

  const primary = topWords[0] ?? aura.name;
  const nuance =
    getWordResultFlavor(primary)?.nuance ?? WORD_NUANCE[primary] ?? primary;
  return `友達からは、${aura.archetypeName}らしい『${nuance}』な人として認識されやすい状態です`;
}

function buildVoteEvidence(
  counts: Map<string, number>,
  totalVotes: number,
): VoteEvidence[] {
  if (totalVotes === 0) return [];

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"));
  return ranked.slice(0, 5).map(([word, count], index) => {
    const percent = Math.round((count / totalVotes) * 100);
    let badge: string | undefined;
    if (index === 0) badge = "最多";
    else if (index === 1) badge = "有力";
    else if (index === 2) badge = "決め手";
    return { word, count, percent, rank: index + 1, badge };
  });
}

function buildEvidenceLead(
  evidence: VoteEvidence[],
  totalVotes: number,
  uniqueCount: number,
): string {
  if (evidence.length === 0) return "";
  const top = evidence
    .slice(0, 3)
    .map((item) => `「${item.word}」${item.count}票`)
    .join("、");
  return `今回の診断は全${totalVotes}票・${uniqueCount}種類から判定。軸になったのは${top}です。`;
}

function buildSupportParagraph(evidence: VoteEvidence[]): string | null {
  if (evidence.length < 4) return null;
  const extras = evidence.slice(3);
  const joined = extras.map((item) => `「${item.word}」${item.count}票`).join("、");
  return `さらに${joined}も入っており、メイン印象を補強するサブ要素になっています。`;
}

function buildDiagnosisReport(
  aura: AuraType,
  topWords: string[],
  votes: string[],
  counts: Map<string, number>,
  contradiction: AuraContradiction | null,
): {
  mainText: string;
  evidence: VoteEvidence[];
  witnessText: string;
  readingText: string;
  shadowText: string;
} {
  const totalVotes = votes.length;
  const uniqueCount = counts.size;
  const evidence = buildVoteEvidence(counts, totalVotes);
  const a = topWords[0] ?? aura.archetypeName;
  const b = topWords[1] ?? a;
  const c = topWords[2] ?? b;
  const ctx: DiagnosisCtx = {
    aura,
    a,
    b,
    c,
    evidence,
    totalVotes,
    uniqueCount,
  };
  const kit = getDiagnosisKit(aura);

  const evidenceLead = buildEvidenceLead(evidence, totalVotes, uniqueCount);
  const readingText = kit.reading(ctx);
  const witnessText = buildWitness(aura, topWords);
  const support = buildSupportParagraph(evidence);
  const contradictionLine = contradiction
    ? `なお上位に「${contradiction.wordA}」と「${contradiction.wordB}」が同居しているため、${contradiction.text}`
    : null;
  const shadowText = kit.shadow(ctx);

  const paragraphs = [
    evidenceLead,
    readingText,
    witnessText,
    support,
    contradictionLine,
    shadowText,
  ].filter((part): part is string => Boolean(part && part.trim().length > 0));

  return {
    mainText: paragraphs.join("\n\n"),
    evidence,
    witnessText,
    readingText,
    shadowText,
  };
}

const HABITAT_BY_AURA: Partial<Record<string, string>> = {
  "chaos-neon": "飲み会の中盤 / 深夜2時のタイムライン / グルチャが荒れた直後",
  "hentai-nebula": "話が急に濃くなる雑談 / 趣味の深掘り / 夜になると別人になる瞬間",
  "menhera-pulse": "反応待ちのDM / 余白が空いた夜 / 温度差を感じた瞬間",
  "sunrise-hero": "イベント本番前 / チームの危機 / 朝の集合場所",
  "healing-mint": "誰かが落ち込んだ直後 / 休憩スペース / 静かな帰り道",
  "gourmet-sun": "飯テロタイムライン / 夜のラーメン屋 / 休日のランチ会",
  "soft-peach": "少人数の雑談圏 / 帰り道の立ち話 / 既読が続くDM",
  "mystic-purple": "夜の深い話 / 少人数の考察会 / 静かなカフェの隅",
  "dream-chaser": "目標を語る夜 / 新しい挑戦の前夜 / 進路相談の席",
  "electric-cyan": "議論が白熱した場 / 企画の詰まり / 勉強会のホワイトボード前",
  "imp-neon": "油断した雑談 / 気心知れた相手との夜 / ギャップがバレる瞬間",
  "midnight-moon": "深夜帯のチャット / 静かな余白 / 終電後の余韻",
  "otaku-galaxy": "推し語り会場 / 同好との遭遇 / 新作リリース日のTL",
  "crimson-rebel": "理不尽な空気の直後 / ノリが乗った夜 / 枠を壊したくなる場",
  "velvet-muse": "良い光のあたる場所 / 写真映えする角 / 静かな注目の中心",
  "mythic-quill": "物語の語り場 / 解釈が割れる話題 / 長編トークの席",
  "legendary-prism": "役割が複数求められる場 / 多面性が刺さる集まり",
  "golden-oracle": "相談が集まる席 / 判断に迷う空気 / まとめ役が必要な瞬間",
  "void-abyss": "大人数の端 / 名前を呼ばれた瞬間 / 静かな視線の交差点",
  "phantom-mirror": "相手が変わった瞬間 / 役割の切り替え現場 / 初対面と親しい場の境界",
  "god-calamity": "矛盾が同時発火する本番 / 常識が一時停止する夜",
  "absolute-crystal": "距離が必要な場 / クリアな空気 / 静かな視線の交差",
};

function buildHabitat(aura: AuraType, topWords: string[]): string {
  const mapped = HABITAT_BY_AURA[aura.id];
  if (mapped) return mapped;
  const primary = topWords[0];
  if (primary) {
    return `「${primary}」が自然に出る場 / 気心知れた友達の輪 / 夜の余白`;
  }
  return "友達との日常の隙間 / SNSのタイムライン";
}

function buildEcology(aura: AuraType, topWords: string[]): AuraEcology {
  const a = topWords[0] ?? aura.archetypeName;
  const b = topWords[1] ?? a;
  const c = topWords[2] ?? b;
  const kit = getDiagnosisKit(aura);
  const core = kit.ecology({
    aura,
    a,
    b,
    c,
    evidence: [],
    totalVotes: 0,
    uniqueCount: topWords.length,
  });
  return {
    habitat: buildHabitat(aura, topWords),
    ...core,
  };
}

const SPECIAL_MOVE_BY_WORD: Partial<Record<string, readonly string[]>> = {
  限界オタク: ["推し語り無双", "オタク語録ラッシュ"],
  推ししか勝たん: ["推し一択爆発", "推し語り台風"],
  突然ボケる: ["不意打ちボケ", "空気白けてからの一撃"],
  既読スルー魔: ["既読スルーの極意", "返信保留フィニッシュ"],
  だるいのに有能: ["だる顔必殺仕事", "締切前覚醒"],
  理論武装: ["論破モード全開", "説教フィニッシュ"],
  草不可避: ["草を生やす笑い", "場を凍らせてからボケ"],
  飯テロ魔: ["飯テロ連打", "深夜メシ誘惑"],
  天才的バカ: ["天才とバカの同時発火", "神プレイと大失態"],
};

const DAILY_FORTUNES: readonly string[] = [
  "推しの話をすると大吉",
  "既読スルーは凶・返信早めは吉",
  "飲み会で場を盛り上げると吉",
  "深夜テンション全開に注意（吉）",
  "理論武装は午後が吉、朝は凶",
  "新しい印象ワードが集まると大吉",
  "だるいのに有能モード発動で吉",
  "飯テロは罪なき者にのみ吉",
  "突然ボケると周囲の運が上がる",
  "グルチャ未読は凶・直接連絡は吉",
];

function clampStat(value: number): number {
  return Math.min(100, Math.max(12, Math.round(value)));
}

function buildStats(votes: string[]): AuraStats {
  const totals = { social: 0, neta: 0, mystic: 0, heal: 0, gap: 0 };
  let weight = 0;

  for (const word of votes) {
    const def = getVoteWordDef(word);
    if (!def) continue;
    weight += 1;

    if (
      def.category === "vibes" ||
      def.auraCategory.includes("warm") ||
      def.auraCategory.includes("hero")
    ) {
      totals.social += 2;
    }
    if (def.category === "chaos" || def.auraCategory.includes("chaos")) {
      totals.neta += 2.5;
    }
    if (
      def.auraCategory.includes("mystic") ||
      def.auraCategory.includes("void") ||
      def.auraCategory.includes("crystal")
    ) {
      totals.mystic += 2;
    }
    if (def.auraCategory.includes("heal")) {
      totals.heal += 2;
    }
    if (def.category === "gap" || def.auraCategory.includes("imp")) {
      totals.gap += 2.5;
    }
  }

  const base = Math.max(weight, 1);
  return {
    social: clampStat(28 + (totals.social / base) * 22),
    neta: clampStat(28 + (totals.neta / base) * 22),
    mystic: clampStat(28 + (totals.mystic / base) * 22),
    heal: clampStat(28 + (totals.heal / base) * 22),
    gap: clampStat(28 + (totals.gap / base) * 22),
  };
}

function attributeConflictScore(
  aAttrs: readonly AuraAttribute[],
  bAttrs: readonly AuraAttribute[],
): number {
  let score = 0;
  if (bAttrs.includes("void") && (aAttrs.includes("warm") || aAttrs.includes("hero"))) score += 3;
  if (bAttrs.includes("chaos") && aAttrs.includes("heal")) score += 3;
  if (bAttrs.includes("crystal") && aAttrs.includes("warm")) score += 2;
  if (bAttrs.includes("god") && aAttrs.includes("heal")) score += 2;
  if (bAttrs.includes("void") && aAttrs.includes("chaos")) score += 1;
  return score;
}

function buildCompatibility(aura: AuraType): AuraCompatibility {
  const pool = AURA_TYPES.filter((item) => item.id !== aura.id);
  if (pool.length === 0) return DORMANT_COMPATIBILITY;

  let bestGood = pool[0]!;
  let bestGoodScore = -1;
  let bestBad = pool[0]!;
  let bestBadScore = -1;

  for (const other of pool) {
    let synergy = 0;
    for (const attr of aura.attributes) {
      if (other.attributes.includes(attr)) synergy += 3;
    }
    const sharedKeywords = aura.keywords.filter((keyword) => other.keywords.includes(keyword)).length;
    synergy += sharedKeywords * 2;

    if (synergy > bestGoodScore) {
      bestGoodScore = synergy;
      bestGood = other;
    }

    const conflict = attributeConflictScore(aura.attributes, other.attributes);
    if (conflict > bestBadScore) {
      bestBadScore = conflict;
      bestBad = other;
    }
  }

  if (bestGood.id === bestBad.id) {
    bestBad = pool.find((item) => item.id !== bestGood.id) ?? bestBad;
  }

  return {
    good: {
      id: bestGood.id,
      name: bestGood.rarity === "secret" ? "？？？" : bestGood.name,
    },
    bad: {
      id: bestBad.id,
      name: bestBad.rarity === "secret" ? "？？？" : bestBad.name,
    },
  };
}

/** 投票語 → 必殺技用の短いネタ部品 */
const MOVE_SNIPPET: Partial<Record<string, string>> = {
  リアクション過剰: "大音量リアクション",
  飲み会の潤滑油: "滑り芸",
  だるいのに有能: "だる顔覚醒",
  天才的バカ: "天才バカ砲",
  草不可避: "強制草植え",
  突然ボケる: "不意打ちボケ",
  限界オタク: "推し語り無双",
  推ししか勝たん: "推し一択爆発",
  既読スルー魔: "既読スルー封殺",
  熱血: "熱血フルスロットル",
  冷徹: "冷徹ジャッジ",
  温厚: "温厚バリア",
  変態: "好奇心解放",
  話が急に濃くなる: "濃度急上昇ビーム",
  趣味の解像度バグ: "解像度バグ解放",
  質問がえぐい: "えぐい質問投下",
  夜になると別人: "夜別人スイッチ",
  ノリの射程が長い: "ノリ射程フル延長",
  温度差に敏感: "温度差センサー発動",
  愛され上手: "愛されスキル全開",
  反応待ちがち: "反応待ちサバイバル",
  余白が怖い: "余白封鎖ビーム",
  情緒お天気: "情緒お天気速報",
  そばにいてほしい系: "そばにいて召喚",
  天然: "天然誤爆",
  負けず嫌い: "リベンジ点火",
  面倒見いい: "世話焼き護衛",
  腹黒: "腹黒スマイル",
  カリスマ: "引力全開",
  癒やし枠: "癒やしフィールド",
  陽キャバイブス: "陽キャ台風",
  治安悪め: "治安悪化ビーム",
  狂気: "狂気スイッチ",
  ギャップの鬼: "ギャップ炸裂",
  ツンデレ: "ツンデレ逆走",
  空気読みすぎ: "過剰空気読み",
  笑いの引力: "笑いブラックホール",
  頼れる相棒: "相棒召喚",
  NPC: "背景融合",
  ビジュ爆発: "ビジュ無双",
  圧倒的主人公: "主人公補正",
  垢抜けてる: "垢抜けアップデート",
  目力がすごい: "目力ロックオン",
  ファッション強め: "ファッション覇気",
  美形枠: "美形オーラ展開",
  逆光で消える: "逆光ステルス",
  飯テロ魔: "飯テロ連打",
  理論武装: "論破ミサイル",
  深夜テンション: "深夜覚醒",
  ミステリアス: "謎の余韻",
  マイナスイオン: "イオン浄化",
  距離感バグ: "距離感クラッシュ",
  実は寂しがり: "寂しがりビーム",
  知性派: "知性切断",
  ラスボス: "ラスボス降臨",
  チート級: "チート解放",
};

function comboMoveKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** 上位2語の定番コンボ必殺技（順序非依存） */
const COMBO_SPECIAL_MOVES: Record<string, readonly string[]> = (() => {
  const entries: Array<[string, string, readonly string[]]> = [
    [
      "リアクション過剰",
      "飲み会の潤滑油",
      ["大音量の滑り芸", "宴会オイル爆笑砲", "潤滑リアクション滑走"],
    ],
    [
      "リアクション過剰",
      "だるいのに有能",
      ["だる顔メガホン覚醒", "省エネ爆音リアクション", "締切前・過積載リアクション"],
    ],
    [
      "飲み会の潤滑油",
      "だるいのに有能",
      ["だる顔で宴会潤滑", "省エネ滑り芸", "締切前オイル注入"],
    ],
    ["天才的バカ", "草不可避", ["天才バカで強制草植え", "神プレイ即草化", "脱線草砲"]],
    ["突然ボケる", "草不可避", ["不意打ち草不可避", "白けてからの即草", "空気崩壊ボケ"]],
    ["熱血", "負けず嫌い", ["熱血リベンジ全開", "負けず嫌いフルスロットル", "熱血逆転劇"]],
    ["冷徹", "腹黒", ["冷徹腹黒ジャッジ", "笑顔で即決裁", "氷笑の裁定"]],
    ["温厚", "面倒見いい", ["温厚世話焼き結界", "怒らなそう護衛", "安心感フルカバー"]],
    ["天然", "変態", ["天然好奇心誤爆", "ほんわか変態解放", "計算なしの禁断質問"]],
    ["推ししか勝たん", "限界オタク", ["推し命銀河爆発", "語録ラッシュ無双", "推し以外遮断"]],
    [
      "陽キャバイブス",
      "飲み会の潤滑油",
      ["陽キャ滑走パーティー", "バイブス給油祭", "陽気オイル台風"],
    ],
    ["治安悪め", "狂気", ["治安悪化・狂気スイッチ", "深夜危険度MAX", "止まれないノリ砲"]],
    ["ギャップの鬼", "ツンデレ", ["ツンデレギャップ炸裂", "逆走して好意露出", "予想外の急接近"]],
    ["カリスマ", "圧倒的主人公", ["主役補正カリスマ", "視線独占フィニッシュ", "主人公引力"]],
    ["癒やし枠", "マイナスイオン", ["癒やしイオン浄化", "場温リセット結界", "深呼吸強制装置"]],
    [
      "空気読みすぎ",
      "リアクション過剰",
      ["過剰読み上げリアクション", "空気センサー爆音化", "察して大音量"],
    ],
    [
      "既読スルー魔",
      "実は寂しがり",
      ["既読スルーの寂しがり", "既読だけ秒速・本体は待つ", "返信保留の小型化"],
    ],
  ];

  const out: Record<string, readonly string[]> = {};
  for (const [a, b, moves] of entries) {
    out[comboMoveKey(a, b)] = moves;
  }
  return out;
})();

function moveSnippet(word: string): string {
  const curated = MOVE_SNIPPET[word];
  if (curated) return curated;
  const fromList = SPECIAL_MOVE_BY_WORD[word]?.[0];
  if (fromList) return fromList;
  const flavorMove = getWordResultFlavor(word)?.specialMove;
  if (flavorMove) return flavorMove.replace(/全開$/, "").replace(/解放$/, "");
  return word;
}

function buildSpecialMove(aura: AuraType, topWords: string[]): string {
  const primary = topWords[0];
  const secondary = topWords[1];
  const tertiary = topWords[2];

  if (primary && secondary) {
    const combo = COMBO_SPECIAL_MOVES[comboMoveKey(primary, secondary)];
    if (combo) {
      return pickStable(combo, `combo:${aura.id}:${primary}:${secondary}`);
    }

    const sa = moveSnippet(primary);
    const sb = moveSnippet(secondary);
    const mashups = [
      `${sa}の${sb}`,
      `${sb}式${sa}`,
      `奥義・${sa}で${sb}`,
      `最終技・${sa}${sb}`,
    ];

    if (tertiary) {
      const sc = moveSnippet(tertiary);
      mashups.push(`${sa}＋${sb}の${sc}`);
    }

    // 通り名ごとの味付け
    if (aura.id === "chaos-neon") {
      mashups.unshift(`大音量${sb}`, `${sa}滑走`, `宴会級${sa}`);
    } else if (aura.id === "hentai-nebula") {
      mashups.unshift(`禁断${sa}`, `ど変態・${sb}解放`, `${sa}沼ダイブ`);
    } else if (aura.id === "menhera-pulse") {
      mashups.unshift(`かまって${sa}`, `メンヘラ・${sb}確認`, `${sa}情緒お天気`);
    } else if (aura.id === "healing-mint") {
      mashups.unshift(`${sa}浄化解禁`, `穏やかなる${sb}`);
    } else if (aura.id === "imp-neon") {
      mashups.unshift(`表${sa}・裏${sb}`, `ギャップ起爆・${sa}`);
    } else if (aura.id === "otaku-galaxy") {
      mashups.unshift(`${sa}銀河爆発`, `推し熱・${sb}`);
    } else if (aura.id === "sunrise-hero") {
      mashups.unshift(`主人公補正・${sa}`, `${sb}で逆転劇`);
    }

    return pickStable(mashups, `mash:${aura.id}:${primary}:${secondary}:${tertiary ?? ""}`);
  }

  if (primary) {
    const solo = [
      moveSnippet(primary),
      getWordResultFlavor(primary)?.specialMove,
      ...(SPECIAL_MOVE_BY_WORD[primary] ?? []),
      `秘技「${primary}」`,
    ].filter((item): item is string => Boolean(item));
    return pickStable(solo, `solo:${aura.id}:${primary}`);
  }

  return pickStable(
    [`究極・${aura.archetypeName}フィニッシュ`, `秘技「${aura.archetypeName}」`, `${aura.archetypeName}の領域展開`],
    `move-aura:${aura.id}`,
  );
}

function buildShareLine(aura: AuraType, topWords: string[], displayName?: string): string {
  const who = displayName ?? "俺";
  const shortName = aura.name.replace(/オーラ$/, "");
  const tags =
    topWords.length > 0 ? topWords.map((word) => `#${word}`).join(" ") : "#AuraMaker";
  return `友達から見た${who}、${aura.archetypeName}やったわ 🔮\n（${shortName}）\n${tags} #AuraMaker`;
}

function buildDailyFortune(userId: string | undefined, aura: AuraType): string {
  const today = new Date().toISOString().slice(0, 10);
  const fortune = pickStable(DAILY_FORTUNES, `${userId ?? "guest"}:${today}:${aura.id}`);
  return `今日のオーラ運：${fortune}`;
}

function buildAwakening(votes: string[]): AuraAwakening {
  const total = votes.length;
  const unique = new Set(votes).size;
  let percent = Math.min(100, Math.round(12 + Math.log10(total + 1) * 28 + unique * 6));
  if (total >= 20) percent = Math.min(100, percent + 8);

  let hint: string;
  if (total === 0) {
    hint = "投票URLをシェアして覚醒させよう";
  } else if (total < 3) {
    hint = `あと${3 - total}票で暫定結果を卒業`;
  } else if (total < 10) {
    hint = `あと${10 - total}票で結果が安定しやすい`;
  } else if (unique < 8) {
    hint = "いろんな印象ワードが集まると進化の兆し";
  } else {
    hint = "シークレットオーラの条件が近づいている…？";
  }

  return { percent, hint };
}

function buildResultConfidence(votes: string[]): {
  confidence: AuraResultConfidence;
  confidenceLabel: string;
} {
  const total = votes.length;
  if (total < 3) {
    return {
      confidence: "provisional",
      confidenceLabel: `暫定結果（まだ${total}票。あと${3 - total}票で暫定を卒業しやすい）`,
    };
  }
  if (total < 10) {
    return {
      confidence: "growing",
      confidenceLabel: `結果が育ち中（${total}票。あと${10 - total}票でより納得感アップ）`,
    };
  }
  return {
    confidence: "stable",
    confidenceLabel: `結果が安定（${total}票）`,
  };
}

function buildDynamicProfile(
  aura: AuraType,
  topWords: string[],
  votes: string[],
  options?: AuraCalculationOptions,
): DynamicAuraProfile {
  const confidence = buildResultConfidence(votes);
  const counts = buildWordCounts(votes);

  if (aura.id === "dormant" || topWords.length === 0) {
    return {
      mainText: aura.description,
      evidence: [],
      witnessText: "まだ票が集まっていないため、周囲からの見え方は観測待ちです。",
      readingText: aura.description,
      shadowText: "投票が集まると、二面性や影のトリセツも立ち上がります。",
      ecology: DORMANT_ECOLOGY,
      stats: DORMANT_STATS,
      specialMove: "（覚醒待ち）",
      contradiction: null,
      compatibility: DORMANT_COMPATIBILITY,
      shareLine: buildShareLine(aura, topWords, options?.displayName),
      dailyFortune: "投票が集まると今日のオーラ占いが解放されます",
      awakening: buildAwakening(votes),
      confidence: "provisional",
      confidenceLabel: "暫定結果（投票待ち）",
    };
  }

  const contradiction = findContradictionDetail(topWords);
  const { mainText, evidence, witnessText, readingText, shadowText } = buildDiagnosisReport(
    aura,
    topWords,
    votes,
    counts,
    contradiction,
  );

  return {
    mainText,
    evidence,
    witnessText,
    readingText,
    shadowText,
    ecology: buildEcology(aura, topWords),
    stats: buildStats(votes),
    specialMove: buildSpecialMove(aura, topWords),
    contradiction,
    compatibility: buildCompatibility(aura),
    shareLine: buildShareLine(aura, topWords, options?.displayName),
    dailyFortune: buildDailyFortune(options?.userId, aura),
    awakening: buildAwakening(votes),
    ...confidence,
  };
}

/** @deprecated buildDynamicProfile を使用 */
export function generateDynamicDescription(
  aura: AuraType,
  topWords: string[],
  votes: string[] = topWords,
  options?: AuraCalculationOptions,
): DynamicAuraProfile {
  return buildDynamicProfile(aura, topWords, votes, options);
}

const SECRET_FLAVOR =
  "特定の組み合わせでのみ覚醒する幻のオーラ。条件は明かされない。";

function buildWordCounts(votes: string[]) {
  const map = new Map<string, number>();
  for (const word of votes) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }
  return map;
}

function personalizeCatchCopy(aura: AuraType, topWords: string[]) {
  if (topWords.length === 0) return aura.catchCopy;
  if (topWords.length === 1) {
    return `「${topWords[0]}」が効いている、${aura.catchCopy}`;
  }
  if (topWords.length === 2) {
    return `「${topWords[0]}」×「${topWords[1]}」が混ざる、${aura.catchCopy}`;
  }
  return `「${topWords[0]}」を軸に「${topWords[1]}」「${topWords[2]}」が乗る、${aura.catchCopy}`;
}

function hasAny(set: Set<string>, words: string[]) {
  return words.some((word) => set.has(word));
}

function resolveSecretAura(topWords: string[]): AuraType | null {
  const topSet = new Set(topWords);

  // 天変地異: ヒーロー系 × カオス系の相反
  const heroSide = hasAny(topSet, [
    "圧倒的主人公",
    "ビジュ爆発",
    "カリスマ",
    "チート級",
    "頼れる相棒",
  ]);
  const chaosSide = hasAny(topSet, ["狂気", "治安悪め", "ラスボス", "天才的バカ", "バグ技"]);
  if (heroSide && chaosSide && topWords.length >= 2) {
    return SECRET_AURA_TYPES.find((aura) => aura.id === "god-calamity") ?? null;
  }

  // ヴォイド: NPC/概念/黒幕 + 距離感や異次元
  const voidCore = hasAny(topSet, ["NPC", "概念", "黒幕", "異次元"]);
  const voidMood = hasAny(topSet, ["距離感バグ", "儚げ", "ミステリアス", "絶対零度"]);
  if (voidCore && voidMood) {
    return SECRET_AURA_TYPES.find((aura) => aura.id === "void-abyss") ?? null;
  }

  // 幻影ミラー: ギャップ系 × 別人感（NPC/異次元）
  const mirrorGap = hasAny(topSet, ["ギャップの鬼", "ツンデレ", "距離感バグ", "既読スルー魔"]);
  const mirrorOther = hasAny(topSet, ["NPC", "異次元", "ミステリアス", "概念"]);
  if (mirrorGap && mirrorOther && topWords.length >= 2) {
    return SECRET_AURA_TYPES.find((aura) => aura.id === "phantom-mirror") ?? null;
  }

  // 絶対零度: 透明感/絶対零度 × ギャップやミステリアス
  const crystalCore = hasAny(topSet, ["絶対零度", "透明感", "マイナスイオン"]);
  const softOrGap = hasAny(topSet, [
    "儚げ",
    "ミステリアス",
    "ツンデレ",
    "実は寂しがり",
    "クールに見えてドジ",
  ]);
  if (crystalCore && softOrGap && topWords.length >= 2) {
    return SECRET_AURA_TYPES.find((aura) => aura.id === "absolute-crystal") ?? null;
  }

  return null;
}

function scoreAura(aura: AuraType, counts: Map<string, number>, topWords: string[]) {
  let score = 0;

  const topAttrCounts = new Map<AuraAttribute, number>();
  for (const word of topWords) {
    const def = getVoteWordDef(word);
    if (!def) continue;
    for (const attr of def.auraCategory) {
      topAttrCounts.set(attr, (topAttrCounts.get(attr) ?? 0) + 1);
    }
  }

  for (const [word, count] of counts) {
    if (aura.keywords.includes(word)) {
      score += count * 4;
      if (topWords.includes(word)) score += 6;
    }

    const def = getVoteWordDef(word);
    if (!def) continue;
    for (const attr of def.auraCategory) {
      if (aura.attributes.includes(attr)) {
        score += count * 2.5;
        if (topWords.includes(word)) score += 3;
      }
    }
  }

  // 上位ワードの属性がオーラ属性と揃うほど納得感が増す
  for (const attr of aura.attributes) {
    const hits = topAttrCounts.get(attr) ?? 0;
    score += hits * 5;
  }

  // 同系統っぽい属性が2つ以上重なるとさらに加点
  const sharedTopAttrs = aura.attributes.filter((attr) => (topAttrCounts.get(attr) ?? 0) > 0);
  if (sharedTopAttrs.length >= 2) score += 8;

  if (aura.rarity === "legendary") {
    const matchedKeywords = aura.keywords.filter((keyword) => counts.has(keyword)).length;
    if (matchedKeywords >= 3) score += 10;
    else score -= 8;
  }

  if (aura.rarity === "secret") {
    score -= 20;
  }

  return score;
}

export function calculateAuraType(
  votes: string[],
  options?: AuraCalculationOptions,
): AuraCalculationResult {
  if (votes.length === 0) {
    return {
      aura: DORMANT_AURA,
      topWords: [],
      personalizedCatchCopy: DORMANT_AURA.catchCopy,
      dynamicProfile: buildDynamicProfile(DORMANT_AURA, [], votes, options),
    };
  }

  const counts = buildWordCounts(votes);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const topWords = sorted.slice(0, 3).map(([word]) => word);

  const secret = resolveSecretAura(topWords);
  if (secret) {
    return {
      aura: secret,
      topWords,
      personalizedCatchCopy: personalizeCatchCopy(secret, topWords),
      dynamicProfile: buildDynamicProfile(secret, topWords, votes, options),
    };
  }

  let bestAura =
    STANDARD_AURA_TYPES.find((aura) => aura.id === "healing-mint") ?? STANDARD_AURA_TYPES[0]!;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const aura of STANDARD_AURA_TYPES) {
    const score = scoreAura(aura, counts, topWords);
    if (score > bestScore) {
      bestScore = score;
      bestAura = aura;
    }
  }

  return {
    aura: bestAura,
    topWords,
    personalizedCatchCopy: personalizeCatchCopy(bestAura, topWords),
    dynamicProfile: buildDynamicProfile(bestAura, topWords, votes, options),
  };
}

export function getAuraById(id: string): AuraType | undefined {
  return ALL_AURA_TYPES.find((aura) => aura.id === id);
}

export { SECRET_FLAVOR };
