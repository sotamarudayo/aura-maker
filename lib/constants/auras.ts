import {
  getVoteWordDef,
  type AuraAttribute,
} from "@/lib/constants/words";

export type AuraRarity = "common" | "uncommon" | "rare" | "legendary" | "secret";

export type AuraPalette = {
  a: string;
  b: string;
  c: string;
};

export type AuraType = {
  id: string;
  name: string;
  catchCopy: string;
  description: string;
  gradient: string;
  palette: AuraPalette;
  keywords: readonly string[];
  /** ワード側 auraCategory と照合する属性 */
  attributes: readonly AuraAttribute[];
  rarity: AuraRarity;
};

export type AuraEcology = {
  trigger: string;
  sideEffect: string;
  weakness: string;
};

export type DynamicAuraProfile = {
  mainText: string;
  ecology: AuraEcology;
};

export type AuraCalculationResult = {
  aura: AuraType;
  topWords: string[];
  personalizedCatchCopy: string;
  dynamicProfile: DynamicAuraProfile;
};

const DORMANT_ECOLOGY: AuraEcology = {
  trigger: "友達からの投票が届く / 投票URLが拡散される",
  sideEffect: "ダッシュボードのオーラ色が少しずつ立ち上がる",
  weakness: "URLをシェアしないと永久スリープモード",
};

export const DORMANT_AURA: AuraType = {
  id: "dormant",
  name: "覚醒待ちのオーラ",
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
    catchCopy: "眩しい前向きエネルギーが、周囲を自然と照らす。",
    description:
      "あなたの纏う空気感は、頼れる太陽タイプ。安心感と高揚感を同時に届けます。",
    gradient:
      "radial-gradient(circle at 25% 20%, #fbbf24, transparent 45%), radial-gradient(circle at 80% 30%, #fb7185, transparent 50%), linear-gradient(135deg, #1a0f00 0%, #3b1d05 100%)",
    palette: { a: "#fbbf24", b: "#fb7185", c: "#f97316" },
    keywords: ["ビジュ爆発", "圧倒的主人公", "カリスマ", "陽キャバイブス", "頼れる相棒", "シルエット強め"],
    attributes: ["hero", "warm"],
    rarity: "common",
  },
  {
    id: "healing-mint",
    name: "癒しのミントオーラ",
    catchCopy: "やわらかな光が、触れた人の心を静かにほどく。",
    description:
      "あなたの纏う空気感は、安心と包容力の塊。そばにいるだけで呼吸が深くなります。",
    gradient:
      "radial-gradient(circle at 30% 25%, #6ee7b7, transparent 45%), radial-gradient(circle at 75% 70%, #67e8f9, transparent 50%), linear-gradient(135deg, #042f2e 0%, #0f172a 100%)",
    palette: { a: "#6ee7b7", b: "#67e8f9", c: "#34d399" },
    keywords: ["癒やし枠", "マイナスイオン", "空気清浄機", "頼れる相棒", "実は寂しがり"],
    attributes: ["heal", "warm"],
    rarity: "common",
  },
  {
    id: "gourmet-sun",
    name: "グルメサンオーラ",
    catchCopy: "食欲と陽気さが混ざった、幸せなオレンジの光。",
    description:
      "あなたの纏う空気感は、食と笑いで場を明るくする太陽。一緒にいると自然と元気になります。",
    gradient:
      "radial-gradient(circle at 30% 25%, #fb923c, transparent 45%), radial-gradient(circle at 75% 65%, #fbbf24, transparent 50%), linear-gradient(135deg, #2a1200 0%, #1a0f00 100%)",
    palette: { a: "#fb923c", b: "#fbbf24", c: "#f97316" },
    keywords: ["陽キャバイブス", "草不可避", "深夜テンション", "平成レトロ"],
    attributes: ["warm", "chaos"],
    rarity: "common",
  },
  {
    id: "soft-peach",
    name: "ソフトピーチオーラ",
    catchCopy: "甘くて親しみやすい、近づきやすい桃色の余熱。",
    description:
      "あなたの纏う空気感は、誰にでも打ち解けやすいムード。場の緊張をそっと溶かします。",
    gradient:
      "radial-gradient(circle at 30% 25%, #fda4af, transparent 45%), radial-gradient(circle at 70% 70%, #fecdd3, transparent 50%), linear-gradient(135deg, #2a1018 0%, #1a0a12 100%)",
    palette: { a: "#fda4af", b: "#fecdd3", c: "#fb7185" },
    keywords: ["癒やし枠", "実は寂しがり", "平成レトロ", "ツンデレ", "クールに見えてドジ"],
    attributes: ["heal", "imp", "warm"],
    rarity: "common",
  },
  {
    id: "mystic-purple",
    name: "ミステリアスパープルオーラ",
    catchCopy: "静かな紫の余韻が、言葉にしない魅力を漂わせる。",
    description:
      "あなたの纏う空気感は、落ち着きの中に惹力を秘めたムードメーカー。じわっと心に残ります。",
    gradient:
      "radial-gradient(circle at 20% 30%, #c084fc, transparent 45%), radial-gradient(circle at 80% 60%, #818cf8, transparent 50%), linear-gradient(135deg, #1e1033 0%, #0f172a 100%)",
    palette: { a: "#c084fc", b: "#818cf8", c: "#a78bfa" },
    keywords: ["ミステリアス", "儚げ", "沼", "概念", "実は寂しがり"],
    attributes: ["mystic", "cool"],
    rarity: "uncommon",
  },
  {
    id: "chaos-neon",
    name: "陽気なカオスオーラ",
    catchCopy: "予測不能なネオンが、場の温度を一瞬で上げる。",
    description:
      "あなたの纏う空気感は、場を沸かせるトリックスター。刺激とユーモアで周囲を巻き込みます。",
    gradient:
      "radial-gradient(circle at 25% 25%, #e879f9, transparent 45%), radial-gradient(circle at 75% 35%, #22d3ee, transparent 50%), radial-gradient(circle at 50% 80%, #f43f5e, transparent 55%), linear-gradient(135deg, #1a0520 0%, #0c1222 100%)",
    palette: { a: "#e879f9", b: "#22d3ee", c: "#f43f5e" },
    keywords: ["深夜テンション", "治安悪め", "天才的バカ", "草不可避", "距離感バグ", "バグ技"],
    attributes: ["chaos", "imp"],
    rarity: "uncommon",
  },
  {
    id: "dream-chaser",
    name: "ドリームチェイサーオーラ",
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
    catchCopy: "甘さと鋭さが同居する、ギャップのネオンスパーク。",
    description:
      "あなたの纏う空気感は、予想外の魅力で人を惹きつけるハイブリッドタイプです。",
    gradient:
      "radial-gradient(circle at 30% 20%, #f472b6, transparent 45%), radial-gradient(circle at 70% 70%, #a855f7, transparent 50%), linear-gradient(135deg, #2a0a1f 0%, #1a1033 100%)",
    palette: { a: "#f472b6", b: "#a855f7", c: "#ec4899" },
    keywords: ["ギャップの鬼", "ツンデレ", "クールに見えてドジ", "天然毒舌", "距離感バグ"],
    attributes: ["imp", "chaos"],
    rarity: "rare",
  },
  {
    id: "midnight-moon",
    name: "ミッドナイトムーンオーラ",
    catchCopy: "夜の静寂に溶ける、眠気と余白のシルバー光。",
    description:
      "あなたの纏う空気感は、落ち着いた夜の詩人。マイペースで独自の世界観を持っています。",
    gradient:
      "radial-gradient(circle at 30% 25%, #94a3b8, transparent 45%), radial-gradient(circle at 70% 75%, #6366f1, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    palette: { a: "#94a3b8", b: "#6366f1", c: "#818cf8" },
    keywords: ["深夜テンション", "儚げ", "マイナスイオン", "透明感", "ミステリアス"],
    attributes: ["cool", "mystic"],
    rarity: "rare",
  },
  {
    id: "otaku-galaxy",
    name: "オタク銀河オーラ",
    catchCopy: "深宇宙のような情熱が、好きを全力で放つ。",
    description:
      "あなたの纏う空気感は、ニッチへの愛が輝く銀河。同好と出会うと一気に加速します。",
    gradient:
      "radial-gradient(circle at 20% 30%, #818cf8, transparent 45%), radial-gradient(circle at 80% 50%, #c084fc, transparent 50%), radial-gradient(circle at 50% 85%, #22d3ee, transparent 55%), linear-gradient(135deg, #0f0a2e 0%, #1a0a2e 100%)",
    palette: { a: "#818cf8", b: "#c084fc", c: "#22d3ee" },
    keywords: ["限界オタク", "沼", "異世界転生", "概念", "バグ技", "NPC"],
    attributes: ["otaku", "chaos"],
    rarity: "rare",
  },
  {
    id: "crimson-rebel",
    name: "クリムゾンリベルオーラ",
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
    id: "legendary-prism",
    name: "伝説のプリズムオーラ",
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
    id: "god-calamity",
    name: "天変地異のゴッドオーラ",
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
};

const PUNCHLINE_BY_AURA: Partial<Record<string, readonly string[]>> = {
  "chaos-neon": ["ただし予測不能すぎて友達が毎回ドキドキしています"],
  "otaku-galaxy": ["ただし推しの話になると周囲の会話参加権が剥奪されます"],
  "imp-neon": ["ただしギャップで毎回ツッコミどころが更新されます"],
  "midnight-moon": ["ただし夜型モードの時だけ語彙力が上がります"],
  "mystic-purple": ["ただし心を開くまでに時間がかかります"],
  "healing-mint": ["ただし自分の休息は後回しになりがちです"],
};

const ECOLOGY_BY_WORD: Partial<Record<string, AuraEcology>> = {
  限界オタク: {
    trigger: "推しの話題 / 新刊・新作の話",
    sideEffect: "周囲の会話が一方向に流れる",
    weakness: "ネタバレ / 推しの炎上",
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
};

const ECOLOGY_BY_AURA: Partial<Record<string, AuraEcology>> = {
  "chaos-neon": {
    trigger: "テンション上昇 / 深夜0時を過ぎる",
    sideEffect: "近くにいる人の予測能力が一時的に低下する",
    weakness: "真面目な会議 / 静かな図書館",
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

function pickStable<T>(items: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % 9973;
  }
  return items[hash % items.length]!;
}

function findContradiction(topWords: string[]): string | null {
  const wordSet = new Set(topWords);
  for (const pair of CONTRADICTION_PAIRS) {
    const wordA = topWords.find((word) => pair.groupA.includes(word));
    const wordB = topWords.find((word) => pair.groupB.includes(word));
    if (wordA && wordB && wordSet.has(wordA) && wordSet.has(wordB)) {
      return pair.opener(wordA, wordB);
    }
  }
  return null;
}

function buildWitness(aura: AuraType, topWords: string[]): string {
  for (const word of topWords) {
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
  const nuance = WORD_NUANCE[primary] ?? primary;
  return `周囲からは『${nuance}な人』として認識されています`;
}

function buildPraise(aura: AuraType, topWords: string[]): string {
  const primary = topWords[0];
  const nuance = primary ? (WORD_NUANCE[primary] ?? primary) : aura.name;

  if (aura.rarity === "secret") {
    return `禁断の組み合わせ「${topWords.join("・")}」が${aura.name}を覚醒させました。${nuance}な魅力は本物です。`;
  }

  if (aura.rarity === "legendary") {
    return `総合評価は${aura.name}級。${nuance}が核で、友達から見たあなたはかなりレア枠です。`;
  }

  return `総合すると${aura.name}タイプ。${nuance}が際立っていて、友達目線でも相当好意的に見られています。`;
}

function buildPunchline(aura: AuraType, topWords: string[]): string {
  for (const word of topWords) {
    const options = PUNCHLINE_BY_WORD[word];
    if (options) {
      return pickStable(options, `punch:${word}:${aura.id}`);
    }
  }

  const auraOptions = PUNCHLINE_BY_AURA[aura.id];
  if (auraOptions) {
    return pickStable(auraOptions, `punch-aura:${aura.id}`);
  }

  return pickStable(
    [
      "ただし油断すると想定外の一面が漏れ出します",
      "ただしテンション次第で周囲の予想を裏切ります",
      "ただし本番以外は省エネモードになりがちです",
    ],
    `punch-default:${topWords.join("-")}:${aura.id}`,
  );
}

function buildEcology(aura: AuraType, topWords: string[]): AuraEcology {
  for (const word of topWords) {
    const ecology = ECOLOGY_BY_WORD[word];
    if (ecology) return ecology;
  }

  const auraEcology = ECOLOGY_BY_AURA[aura.id];
  if (auraEcology) return auraEcology;

  const primary = topWords[0] ?? "投票";
  return {
    trigger: `${primary}の話題 / 友達と会った時`,
    sideEffect: "周囲の印象ワードが更新され続ける",
    weakness: "投票が来ない / 話題が尽きる",
  };
}

export function generateDynamicDescription(aura: AuraType, topWords: string[]): DynamicAuraProfile {
  if (aura.id === "dormant" || topWords.length === 0) {
    return {
      mainText: aura.description,
      ecology: DORMANT_ECOLOGY,
    };
  }

  const gapRoast = findContradiction(topWords);
  const witness = buildWitness(aura, topWords);
  const praise = buildPraise(aura, topWords);
  const punchline = buildPunchline(aura, topWords);

  const mainText = [gapRoast, witness, praise, punchline].filter(Boolean).join("");

  return {
    mainText,
    ecology: buildEcology(aura, topWords),
  };
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
  return `${topWords.join("・")} が混ざり合う、${aura.catchCopy}`;
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

  for (const [word, count] of counts) {
    if (aura.keywords.includes(word)) {
      score += count * 3;
      if (topWords.includes(word)) score += 4;
    }

    const def = getVoteWordDef(word);
    if (!def) continue;
    for (const attr of def.auraCategory) {
      if (aura.attributes.includes(attr)) {
        score += count * 2;
        if (topWords.includes(word)) score += 2;
      }
    }
  }

  if (aura.rarity === "legendary") {
    const matchedKeywords = aura.keywords.filter((keyword) => counts.has(keyword)).length;
    if (matchedKeywords >= 3) score += 10;
    else score -= 5;
  }

  return score;
}

export function calculateAuraType(votes: string[]): AuraCalculationResult {
  if (votes.length === 0) {
    return {
      aura: DORMANT_AURA,
      topWords: [],
      personalizedCatchCopy: DORMANT_AURA.catchCopy,
      dynamicProfile: {
        mainText: DORMANT_AURA.description,
        ecology: DORMANT_ECOLOGY,
      },
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
      dynamicProfile: generateDynamicDescription(secret, topWords),
    };
  }

  let bestAura =
    STANDARD_AURA_TYPES.find((aura) => aura.id === "imp-neon") ?? STANDARD_AURA_TYPES[0];
  let bestScore = -1;

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
    dynamicProfile: generateDynamicDescription(bestAura, topWords),
  };
}

export function getAuraById(id: string): AuraType | undefined {
  return ALL_AURA_TYPES.find((aura) => aura.id === id);
}

export { SECRET_FLAVOR };
