export type AuraSeoFaq = {
  question: string;
  answer: string;
};

export type AuraSeoCopy = {
  /** 「〇〇とは」用の追加リード（descriptionの後に置く） */
  whatIsExtra: string;
  /** あるある */
  aruaru: string[];
  /** 弱点・取り扱いの補足 */
  weaknessNote: string;
  /** 似て非なるオーラ id */
  similarIds: string[];
  /** ページ内FAQ */
  faq: AuraSeoFaq[];
};

/**
 * オーラ個別ページを厚くするための JA コピー。
 * 欠けている id は getAuraSeoCopy 側でフォールバックする。
 */
export const AURA_SEO_COPY: Record<string, AuraSeoCopy> = {
  "sunrise-hero": {
    whatIsExtra:
      "主人公番長は、いるだけで場が前に進む太陽タイプ。頼れる・熱い・写真映えする、という印象が重なると出やすいです。本人は「普通に手伝ってるだけ」でも、友達からはヒーロー扱いされがち。",
    aruaru: [
      "困ってる人がいると、気づいたら先頭に立っている",
      "集合写真でなぜか中央〜前目になる",
      "『あなたがいると安心』と言われて戸惑う",
      "自己診断ではクール寄りなのに、周りは陽キャ認定",
    ],
    weaknessNote:
      "盛り上げやリードが続くと消耗しやすい。休みたい日に『主人公モード』を求められるとキツいので、役割を分散するのがコツ。",
    similarIds: ["dream-chaser", "golden-oracle", "gourmet-sun"],
    faq: [
      {
        question: "主人公番長とは何ですか？",
        answer:
          "AuraMakerの通り名で、正式名はサンライズ・ヒーローオーラ。前向きで頼れる印象が集まると発現しやすいコモン枠です。",
      },
      {
        question: "どんな投票ワードで出やすい？",
        answer:
          "圧倒的主人公、カリスマ、陽キャバイブス、頼れる相棒、熱血などが重なると主人公番長寄りになりやすいです。",
      },
    ],
  },
  "healing-mint": {
    whatIsExtra:
      "空気清浄機枠は、そばにいるだけで呼吸が深くなる癒し枠。派手さより安定感。『何もしてないのに空気が整う』と言われる人に多いです。",
    aruaru: [
      "グループにいると荒れにくくなる",
      "相談されやすいのに自分の話は後回し",
      "『癒される』と言われて照れる",
      "自己では地味だと思ってるのに、周りは必需品扱い",
    ],
    weaknessNote:
      "面倒見がいいほど抱え込みがち。弱い日にまで『癒し担当』を期待されると苦しいので、境界線を言葉にするのが大事。",
    similarIds: ["soft-peach", "midnight-moon", "velvet-muse"],
    faq: [
      {
        question: "空気清浄機枠とは？",
        answer:
          "癒しのサンオーラの通り名。温厚・癒やし・空気清浄機などの印象が集まると出やすいコモンタイプです。",
      },
      {
        question: "地味な結果ですか？",
        answer:
          "地味ではなく『場のインフラ』です。いないと空気が荒れる、という意味で評価されていることが多いです。",
      },
    ],
  },
  "soft-peach": {
    whatIsExtra:
      "距離感近すぎ系は、壁が薄くて親しみやすい桃色のオーラ。仲良くしたい気持ちが強すぎて、周囲からは『距離感バグ』に見えることも。",
    aruaru: [
      "初対面でも会話がすぐ深くなる",
      "既読が続くと少し不安になる",
      "『距離近いよね』と笑われる",
      "ツンとデレが同居してると言われる",
    ],
    weaknessNote:
      "親しみやすさが裏目に出て、境界が曖昧になりやすい。相手のペースを確認する一言があると、弱点が味に変わります。",
    similarIds: ["menhera-pulse", "healing-mint", "imp-neon"],
    faq: [
      {
        question: "距離感近すぎ系とは？",
        answer:
          "ソフトピーチオーラの通り名。温厚・天然・実は寂しがりなどの票が集まると出やすいアンコモンです。",
      },
    ],
  },
  "menhera-pulse": {
    whatIsExtra:
      "メンヘラかまってちゃんは、愛情確認と寂しさが混ざったパルス光。反応速度で心拍が変わるタイプ、と友達に観測されがちです。",
    aruaru: [
      "返信が遅いと世界が終わる気がする",
      "『かまって』が冗談っぽく出る",
      "温度差に敏感と言われる",
      "本人は愛されてる感覚の確認をしてるだけ",
    ],
    weaknessNote:
      "予定が詰まった相手や反応が薄い場だと消耗しやすい。安心の取り方を言語化すると、関係が楽になります。",
    similarIds: ["soft-peach", "imp-neon", "midnight-moon"],
    faq: [
      {
        question: "メンヘラかまってちゃんは悪い意味？",
        answer:
          "AuraMakerではエンタメ寄りの通り名です。愛情の確認欲求が強く見える、という友達目線のラベルで、攻撃名ではありません。",
      },
    ],
  },
  "gourmet-sun": {
    whatIsExtra:
      "飯テロ番長は、食と笑いで場を明るくする太陽。グルメ話や飲み会の潤滑油枠として観測されやすいレア寄りタイプです。",
    aruaru: [
      "飯の話で場が必ず温まる",
      "深夜のラーメン誘いに強い",
      "写真が飯テロ認定される",
      "笑いの引力があると言われる",
    ],
    weaknessNote:
      "ノリの食事会が続くと体力と財布が溶ける。静かにしたい日は『今日は飯テロ休み』と宣言してOK。",
    similarIds: ["sunrise-hero", "chaos-neon", "soft-peach"],
    faq: [
      {
        question: "飯テロ番長とは？",
        answer:
          "グルメサンオーラの通り名。陽キャバイブスや笑いの引力、飲み会の潤滑油などの印象から出やすいタイプです。",
      },
    ],
  },
  "chaos-neon": {
    whatIsExtra:
      "盛り上げ番長はカオス系のエース。予測不能なネオンで場温を一気に上げる。本人は静かにしたくても、票が集まると宴会部長が確定しがち。",
    aruaru: [
      "『今日は静かにする』がだいたい失敗する",
      "グルチャが荒れた直後に呼ばれる",
      "突然ボケて場が助かる（壊れる）",
      "自己診断は清楚寄りなのにカオス確定",
    ],
    weaknessNote:
      "真面目な会議・図書館・盛り上げ休みたい日が弱点。オフの日は『盛り上げ役休み』を先に宣言すると守りやすい。",
    similarIds: ["gourmet-sun", "imp-neon", "crimson-rebel"],
    faq: [
      {
        question: "盛り上げ番長とは何ですか？",
        answer:
          "陽気なカオスオーラの通り名。深夜テンション、草不可避、突然ボケるなどが重なると出やすいコモンです。",
      },
      {
        question: "カオス系は悪い意味？",
        answer:
          "SNSでは事故率（褒め言葉）が高い枠です。場を動かす魅力として愛されていることが多いです。",
      },
    ],
  },
  "hentai-nebula": {
    whatIsExtra:
      "むっつりど変態は、好奇心フルスロットルの禁忌ネオン。普通に深掘りしてるつもりが、友達からは禁断の質問人に見えるレア枠。",
    aruaru: [
      "雑談が急に濃くなる",
      "質問の角度がえぐいと言われる",
      "夜になると別人認定",
      "結果画面がいちばんスクショされる",
    ],
    weaknessNote:
      "上司がいる場や真面目な自己紹介が弱点。好奇心の射程を相手に合わせて調整すると、沼が魅力になります。",
    similarIds: ["otaku-galaxy", "imp-neon", "electric-cyan"],
    faq: [
      {
        question: "むっつりど変態とは？",
        answer:
          "禁忌ネオンオーラの通り名。変態・沼・質問がえぐい・話が急に濃くなるなどの票で解禁されやすいレアです。",
      },
    ],
  },
  "otaku-galaxy": {
    whatIsExtra:
      "推し命銀河は、好きを全力放出するオタク銀河。同好と出会うと加速し、限界オタク票が揃うと覚醒しやすい。",
    aruaru: [
      "推しの話で時間が溶ける",
      "『そこまで見る？』と言われる",
      "推ししか勝たんが口癖に近い",
      "趣味の解像度がバグってる扱い",
    ],
    weaknessNote:
      "興味ゼロの相手やネタバレが弱点。相手の温度を測ってから語録を出すと、銀河が優しく輝きます。",
    similarIds: ["hentai-nebula", "mythic-quill", "dream-chaser"],
    faq: [
      {
        question: "推し命銀河とは？",
        answer:
          "オタク銀河オーラの通り名。限界オタク、推ししか勝たん、沼などが集まると出やすいアンコモンです。",
      },
    ],
  },
  "imp-neon": {
    whatIsExtra:
      "小悪魔天使は、甘さと鋭さが同居するギャップのネオンスパーク。ツンデレ・毒舌・ドジが混ざると出やすい。",
    aruaru: [
      "可愛いのに一言えぐい",
      "クールに見えてドジを踏む",
      "油断した瞬間に本性（ギャップ）が出る",
      "腹黒枠と言われて笑うしかない",
    ],
    weaknessNote:
      "完璧を演じる必要がある日が弱点。ギャップを消そうとしすぎると自分が削れるので、安心できる相手では素を許すのがコツ。",
    similarIds: ["soft-peach", "chaos-neon", "phantom-mirror"],
    faq: [
      {
        question: "小悪魔天使とは？",
        answer:
          "小悪魔ネオンオーラの通り名。ギャップの鬼、ツンデレ、天然毒舌などが重なると出やすいレアです。",
      },
    ],
  },
  "crimson-rebel": {
    whatIsExtra:
      "反骨番長は、既存の枠を軽やかに壊すクリムゾンの炎。治安悪め・狂気・ラスボス票が入るとロックに輝く。",
    aruaru: [
      "理不尽な空気の直後に目が光る",
      "『なんか危険（褒め）』と言われる",
      "枠を壊す発言をして場が動く",
      "自己では普通のつもりが反骨認定",
    ],
    weaknessNote:
      "初対面のフォーマルが弱点。壊す力は強いので、壊す対象を選ぶと伝説になります。",
    similarIds: ["chaos-neon", "god-calamity", "sunrise-hero"],
    faq: [
      {
        question: "反骨番長とは？",
        answer:
          "クリムゾンリベルオーラの通り名。治安悪め、狂気、ラスボス、天然毒舌などが集まると出やすいレアです。",
      },
    ],
  },
  "mystic-purple": {
    whatIsExtra:
      "じわ惹き魔は、静かな緑の余韻で心に残るタイプ。派手に目立たないのに、あとから『あの人』と想起されやすい。",
    aruaru: [
      "会話は少なめなのに印象が残る",
      "ミステリアスと言われて困惑する",
      "実は寂しがりを隠しがち",
      "概念的、と言われる",
    ],
    weaknessNote:
      "沈黙が長い場では誤解されやすい。一言の温度を足すだけで、じわ惹きが安心に変わります。",
    similarIds: ["velvet-muse", "midnight-moon", "absolute-crystal"],
    faq: [
      {
        question: "じわ惹き魔とは？",
        answer:
          "ミステリアスジェイドオーラの通り名。ミステリアス、儚げ、概念などの印象から出やすいコモンです。",
      },
    ],
  },
  "electric-cyan": {
    whatIsExtra:
      "頭回り最速マンは、知性とスピード感のエメラルドスパーク。議論や企画の詰まりで閃光が走るタイプ。",
    aruaru: [
      "話の整理がいつの間にか終わっている",
      "天才的バカ枠と同時に言われる",
      "ホワイトボードの前で輝く",
      "空気清浄機と知性派が同居する",
    ],
    weaknessNote:
      "スピードが速すぎると置いてけぼり感が出る。結論の前に一行の要約を挟むと、最速が優しさになります。",
    similarIds: ["golden-oracle", "mythic-quill", "dream-chaser"],
    faq: [
      {
        question: "頭回り最速マンとは？",
        answer:
          "エメラルドスパークオーラの通り名。知性派、バグ技、カリスマなどが集まると出やすいアンコモンです。",
      },
    ],
  },
  "midnight-moon": {
    whatIsExtra:
      "夜更かし詩人は、夜の静寂に溶ける月光。マイペースで独自の世界観を持ち、終電後の余韻で本領発揮。",
    aruaru: [
      "昼間より夜のチャットが本番",
      "儚げ・透明感と言われる",
      "翌朝の予定を軽く見積もりがち",
      "静かなカフェの隅が生息地",
    ],
    weaknessNote:
      "早起き義務と相性が悪い。詩人モードは夜に限定すると、生活が崩れにくいです。",
    similarIds: ["mystic-purple", "velvet-muse", "void-abyss"],
    faq: [
      {
        question: "夜更かし詩人とは？",
        answer:
          "ミッドナイトムーンオーラの通り名。深夜テンション、儚げ、ミステリアスなどが重なると出やすいレアです。",
      },
    ],
  },
  "velvet-muse": {
    whatIsExtra:
      "雰囲気芸人は、言葉にならない魅力のフォレストミューズ。感性の余白が美しく、空気で勝つタイプ。",
    aruaru: [
      "無言が多いのに雰囲気で勝つ",
      "平成レトロ、概念と言われがち",
      "写真映えする角に自然にいる",
      "説明より余韻が残る",
    ],
    weaknessNote:
      "言語化を求められすぎると苦しい。『雰囲気で伝わる日』と『言葉が必要な日』を分けると楽です。",
    similarIds: ["mystic-purple", "mythic-quill", "absolute-crystal"],
    faq: [
      {
        question: "雰囲気芸人とは？",
        answer:
          "フォレストミューズオーラの通り名。概念、儚げ、ミステリアスなどの票から出やすいレアです。",
      },
    ],
  },
  "dream-chaser": {
    whatIsExtra:
      "夢語り野郎は、野心と可能性を語るドリームチェイサー。未来の話で周囲を鼓舞するヒーロー寄り。",
    aruaru: [
      "進路・目標の話が熱い",
      "異世界転生・チート級と言われがち",
      "本人は本気、周りは物語を見てる",
      "朝の集合より夜の語りの方が本番",
    ],
    weaknessNote:
      "理想が強すぎると現実の段差で落ちやすい。小さな達成を挟むと、銀光が安定します。",
    similarIds: ["sunrise-hero", "legendary-prism", "otaku-galaxy"],
    faq: [
      {
        question: "夢語り野郎とは？",
        answer:
          "ドリームチェイサーオーラの通り名。圧倒的主人公、カリスマ、知性派などが集まると出やすいアンコモンです。",
      },
    ],
  },
  "mythic-quill": {
    whatIsExtra:
      "語り部の神は、人の人生を一章にしてしまう神話のインク。解釈が割れる話題で本領を発揮する。",
    aruaru: [
      "雑談が長編になる",
      "黒幕・概念・知性派が同時に来る",
      "話の余韻が翌週まで残る",
      "本人は話してるだけ、周りは物語を読んでる",
    ],
    weaknessNote:
      "浅い雑談だけしたい日が弱点。相手の体力ゲージを見て章を区切ると神になります。",
    similarIds: ["electric-cyan", "golden-oracle", "velvet-muse"],
    faq: [
      {
        question: "語り部の神とは？",
        answer:
          "神話のインクオーラの通り名。知性派、概念、カリスマ、ミステリアスなどが重なると出やすいレアです。",
      },
    ],
  },
  "legendary-prism": {
    whatIsExtra:
      "全属性持ち神は、ジャンルを超えて共鳴する伝説のプリズム。ビジュ・主人公・チート級が揃うと頂点クラス。",
    aruaru: [
      "役割が複数求められる",
      "『なんでもできそう』と言われる",
      "どのグループでも居場所がある",
      "レア感が強すぎて笑う",
    ],
    weaknessNote:
      "万能期待がプレッシャーになる。『今日の属性はこれ』と絞ると、プリズムが割れません。",
    similarIds: ["sunrise-hero", "dream-chaser", "god-calamity"],
    faq: [
      {
        question: "全属性持ち神とは？",
        answer:
          "伝説のプリズムオーラの通り名。ビジュ爆発、圧倒的主人公、チート級、異次元などが重なると出やすいレジェンド枠です。",
      },
    ],
  },
  "golden-oracle": {
    whatIsExtra:
      "説教聞かせマンは、言葉に重みがあるシルバーオラクル。相談が集まり、まとめ役が必要な瞬間に銀光が走る。",
    aruaru: [
      "相談窓口になりがち",
      "説明が説得力ありすぎて説教感",
      "頼れる相棒＋知性派の票が来る",
      "本人は助言しただけ",
    ],
    weaknessNote:
      "聞き役が続くと消耗する。アドバイス前に『聞くだけモード？』を確認すると、オラクルが優しくなります。",
    similarIds: ["electric-cyan", "sunrise-hero", "mythic-quill"],
    faq: [
      {
        question: "説教聞かせマンとは？",
        answer:
          "シルバーオラクルオーラの通り名。カリスマ、知性派、黒幕、頼れる相棒などが集まると出やすいレジェンド枠です。",
      },
    ],
  },
  "void-abyss": {
    whatIsExtra:
      "虚無NPCは、存在と不在が同時に立つ深淵。大人数の端で光すら飲み込むように見えるシークレット。",
    aruaru: [
      "いるのにいない、いないのにいる",
      "名前を呼ばれた瞬間に存在が立ち上がる",
      "NPC・概念・黒幕票が来る",
      "自己紹介が急だと固まる",
    ],
    weaknessNote:
      "急な自己紹介と注目枠が弱点。事前に一言あるだけで、ヴォイドが味方になります。",
    similarIds: ["phantom-mirror", "midnight-moon", "absolute-crystal"],
    faq: [
      {
        question: "虚無NPCとは？",
        answer:
          "虚無と深淵のヴォイドオーラの通り名。シークレット枠で、特殊条件が揃うと発現する幻のタイプです。",
      },
    ],
  },
  "phantom-mirror": {
    whatIsExtra:
      "別人スイッチは、見る角度で別人になる幻影ミラー。友達ごとに別キャラとして記憶されやすいシークレット。",
    aruaru: [
      "相手が変わると人格が切り替わる",
      "ギャップの鬼・ツンデレ票が来る",
      "『どっちが本物？』と聞かれる",
      "初対面と親しい場の境界で強い",
    ],
    weaknessNote:
      "スイッチしすぎると自分が迷子になる。安心できる相手の前では、一つの面を固定してOK。",
    similarIds: ["imp-neon", "void-abyss", "menhera-pulse"],
    faq: [
      {
        question: "別人スイッチとは？",
        answer:
          "幻影ミラーオーラの通り名。場面ごとに印象が切り替わるシークレットタイプです。",
      },
    ],
  },
  "god-calamity": {
    whatIsExtra:
      "ラスボス候補は、相反する力が同居した天変地異。ヒーローとカオスが同時発火すると神話級の轟きになる。",
    aruaru: [
      "矛盾が同時に来る",
      "本番で常識が一時停止する",
      "圧倒的主人公×治安悪めの票",
      "説明責任がしんどい日がある",
    ],
    weaknessNote:
      "落ち着いた日常では力余る。破壊力の出しどころを選ぶと、天変地異が伝説になります。",
    similarIds: ["crimson-rebel", "legendary-prism", "chaos-neon"],
    faq: [
      {
        question: "ラスボス候補とは？",
        answer:
          "天変地異のゴッドオーラの通り名。シークレット枠で、相反する印象が同時に立つと発現しやすいです。",
      },
    ],
  },
  "absolute-crystal": {
    whatIsExtra:
      "触れがたい美人は、氷点下の透明さで映し切るクリスタル。触れにくい距離感が逆に惹きつけるシークレット。",
    aruaru: [
      "絶対零度・透明感と言われる",
      "近づきにくいのに気になる",
      "静かな視線の交差点にいる",
      "本人は距離を保ってるだけ",
    ],
    weaknessNote:
      "冷たさが拒絶に誤解されやすい。小さな笑顔や一言で、クリスタルが招待状になります。",
    similarIds: ["mystic-purple", "velvet-muse", "void-abyss"],
    faq: [
      {
        question: "触れがたい美人とは？",
        answer:
          "絶対零度のクリスタルオーラの通り名。透明感、儚げ、ミステリアスなどが重なるシークレットです。",
      },
    ],
  },
};

function fallbackCopy(auraId: string, archetypeName: string): AuraSeoCopy {
  return {
    whatIsExtra: `${archetypeName}は、AuraMakerの友達目線診断で現れるオーラタイプのひとつです。印象ワードの集まり方によって発現します。`,
    aruaru: [
      "本人の自己イメージと周り評価がズレがち",
      "結果の通り名でまず笑ってしまう",
      "生息地を読むと『それな』となる",
    ],
    weaknessNote: "弱点は生態データを参考に。無理な役割を続けないのが取り扱いの基本です。",
    similarIds: [],
    faq: [
      {
        question: `${archetypeName}とは何ですか？`,
        answer: `AuraMakerのオーラタイプの通り名です。詳細は図鑑ページと友達からの投票結果で確認できます。（id: ${auraId}）`,
      },
    ],
  };
}

export function getAuraSeoCopy(
  auraId: string,
  archetypeName: string,
): AuraSeoCopy {
  return AURA_SEO_COPY[auraId] ?? fallbackCopy(auraId, archetypeName);
}

export function buildAuraFaqJsonLd(
  pageUrl: string,
  displayName: string,
  faq: AuraSeoFaq[],
) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question.includes(displayName)
        ? item.question
        : `${displayName}について：${item.question}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: pageUrl,
  };
}
