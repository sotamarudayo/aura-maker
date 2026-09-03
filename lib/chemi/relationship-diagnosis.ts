import type { AuraType } from "@/lib/constants/auras";
import type { AuraAttribute } from "@/lib/constants/words";
import type { Locale } from "@/lib/i18n/types";

type PartyLike = {
  aura: AuraType;
  topWords: string[];
};

export const CHEMI_RELATIONSHIP_IDS = [
  "boke_tsukkomi",
  "accelerator_brake",
  "heal_duo",
  "otaku_chaos",
  "mystic_complicity",
  "hero_sidekick",
  "mirror_twins",
  "gap_spark",
] as const;

export type ChemiRelationshipId = (typeof CHEMI_RELATIONSHIP_IDS)[number];

type LocalizedPair = { ja: string; en: string };

type RelationshipDef = {
  id: ChemiRelationshipId;
  typeName: LocalizedPair;
  roleImpulse: LocalizedPair;
  roleAnchor: LocalizedPair;
  story: LocalizedPair;
  /** 直感・前衛側を決める属性 */
  impulseAttrs: readonly AuraAttribute[];
  /** 現実・支え側を決める属性 */
  anchorAttrs: readonly AuraAttribute[];
};

const RELATIONSHIPS: readonly RelationshipDef[] = [
  {
    id: "boke_tsukkomi",
    typeName: { ja: "ボケとツッコミ型", en: "Straight & Wild Card" },
    roleImpulse: { ja: "直感型", en: "Impulse" },
    roleAnchor: { ja: "現実型", en: "Reality" },
    story: {
      ja: "一緒にいると、あなたが火をつけて相手が着地させる関係。",
      en: "Together, you spark the moment and they land it.",
    },
    impulseAttrs: ["chaos", "imp", "warm"],
    anchorAttrs: ["cool", "intellect", "heal"],
  },
  {
    id: "accelerator_brake",
    typeName: { ja: "アクセルとブレーキ型", en: "Gas & Brake" },
    roleImpulse: { ja: "暴走型", en: "Accelerator" },
    roleAnchor: { ja: "抑止型", en: "Brake" },
    story: {
      ja: "片方が飛び出すと、もう片方がハンドルを握る関係。",
      en: "One floors it; the other keeps a hand on the wheel.",
    },
    impulseAttrs: ["chaos", "hero", "god"],
    anchorAttrs: ["heal", "void", "cool"],
  },
  {
    id: "heal_duo",
    typeName: { ja: "癒し合いユニット型", en: "Mutual Heal Duo" },
    roleImpulse: { ja: "包容型", en: "Shelter" },
    roleAnchor: { ja: "回復型", en: "Restore" },
    story: {
      ja: "落ち込んだ方を自然に立て直す、静かな相棒関係。",
      en: "Quiet partners who rebuild whoever dips first.",
    },
    impulseAttrs: ["heal", "warm"],
    anchorAttrs: ["heal", "warm", "mystic"],
  },
  {
    id: "otaku_chaos",
    typeName: { ja: "推し語り永久機関型", en: "Endless Otaku Engine" },
    roleImpulse: { ja: "語り型", en: "Lore Dump" },
    roleAnchor: { ja: "煽り型", en: "Hype" },
    story: {
      ja: "推しの話が始まると周囲の会話速度が3倍になる。",
      en: "Once fandom talk starts, the room's tempo triples.",
    },
    impulseAttrs: ["otaku", "intellect"],
    anchorAttrs: ["chaos", "warm", "imp"],
  },
  {
    id: "mystic_complicity",
    typeName: { ja: "静かな共犯者型", en: "Quiet Accomplices" },
    roleImpulse: { ja: "観測型", en: "Observer" },
    roleAnchor: { ja: "深読み型", en: "Deep Reader" },
    story: {
      ja: "雑談のはずが長編考察になる二人。",
      en: "Small talk becomes a long theory thread.",
    },
    impulseAttrs: ["mystic", "cool"],
    anchorAttrs: ["void", "intellect", "mystic"],
  },
  {
    id: "hero_sidekick",
    typeName: { ja: "主役と相棒型", en: "Lead & Sidekick" },
    roleImpulse: { ja: "前衛型", en: "Frontliner" },
    roleAnchor: { ja: "支え型", en: "Anchor" },
    story: {
      ja: "困ると横並びで前に出る。頼られると強くなる関係。",
      en: "Side by side when it counts — stronger when needed.",
    },
    impulseAttrs: ["hero", "legend", "chaos"],
    anchorAttrs: ["heal", "warm", "intellect"],
  },
  {
    id: "mirror_twins",
    typeName: { ja: "ミラーツイン型", en: "Mirror Twins" },
    roleImpulse: { ja: "共鳴型", en: "Resonance" },
    roleAnchor: { ja: "反射型", en: "Reflection" },
    story: {
      ja: "ノリが同じで、イジり合いが止まらない関係。",
      en: "Same wavelength — the teasing never ends.",
    },
    impulseAttrs: ["chaos", "warm", "imp"],
    anchorAttrs: ["chaos", "warm", "imp"],
  },
  {
    id: "gap_spark",
    typeName: { ja: "ギャップ炸裂型", en: "Gap Spark Pair" },
    roleImpulse: { ja: "ギャップ型", en: "Soft Shock" },
    roleAnchor: { ja: "クール型", en: "Cool Front" },
    story: {
      ja: "見た目のギャップが二人のネタになる関係。",
      en: "The contrast between you is the bit.",
    },
    impulseAttrs: ["imp", "warm", "heal"],
    anchorAttrs: ["cool", "crystal", "void", "intellect"],
  },
];

function hasAttr(aura: AuraType, attr: AuraAttribute) {
  return aura.attributes.includes(attr);
}

function attrScore(aura: AuraType, attrs: readonly AuraAttribute[]) {
  return attrs.reduce((sum, attr) => sum + (hasAttr(aura, attr) ? 1 : 0), 0);
}

function pickLocale(pair: LocalizedPair, locale: Locale) {
  return locale === "en" ? pair.en : pair.ja;
}

function matchRelationship(
  auraA: AuraType,
  auraB: AuraType,
  shared: string[],
  conflict: number,
): RelationshipDef {
  if (auraA.id === auraB.id || shared.length >= 3) {
    return RELATIONSHIPS.find((item) => item.id === "mirror_twins")!;
  }
  if (hasAttr(auraA, "otaku") || hasAttr(auraB, "otaku")) {
    return RELATIONSHIPS.find((item) => item.id === "otaku_chaos")!;
  }
  if (
    (hasAttr(auraA, "mystic") && hasAttr(auraB, "void")) ||
    (hasAttr(auraA, "void") && hasAttr(auraB, "mystic")) ||
    (hasAttr(auraA, "mystic") && hasAttr(auraB, "mystic"))
  ) {
    return RELATIONSHIPS.find((item) => item.id === "mystic_complicity")!;
  }
  if (hasAttr(auraA, "heal") && hasAttr(auraB, "heal")) {
    return RELATIONSHIPS.find((item) => item.id === "heal_duo")!;
  }
  if (
    (hasAttr(auraA, "imp") && (hasAttr(auraB, "cool") || hasAttr(auraB, "crystal") || hasAttr(auraB, "void"))) ||
    (hasAttr(auraB, "imp") && (hasAttr(auraA, "cool") || hasAttr(auraA, "crystal") || hasAttr(auraA, "void")))
  ) {
    return RELATIONSHIPS.find((item) => item.id === "gap_spark")!;
  }
  if (conflict >= 3 || (hasAttr(auraA, "chaos") && hasAttr(auraB, "heal")) || (hasAttr(auraB, "chaos") && hasAttr(auraA, "heal"))) {
    return RELATIONSHIPS.find((item) => item.id === "accelerator_brake")!;
  }
  if (
    hasAttr(auraA, "hero") ||
    hasAttr(auraB, "hero") ||
    hasAttr(auraA, "legend") ||
    hasAttr(auraB, "legend")
  ) {
    return RELATIONSHIPS.find((item) => item.id === "hero_sidekick")!;
  }
  if (
    (hasAttr(auraA, "chaos") || hasAttr(auraA, "imp")) &&
    (hasAttr(auraB, "cool") || hasAttr(auraB, "intellect") || hasAttr(auraB, "heal"))
  ) {
    return RELATIONSHIPS.find((item) => item.id === "boke_tsukkomi")!;
  }
  if (
    (hasAttr(auraB, "chaos") || hasAttr(auraB, "imp")) &&
    (hasAttr(auraA, "cool") || hasAttr(auraA, "intellect") || hasAttr(auraA, "heal"))
  ) {
    return RELATIONSHIPS.find((item) => item.id === "boke_tsukkomi")!;
  }
  if (hasAttr(auraA, "chaos") && hasAttr(auraB, "chaos")) {
    return RELATIONSHIPS.find((item) => item.id === "accelerator_brake")!;
  }

  return RELATIONSHIPS.find((item) => item.id === "boke_tsukkomi")!;
}

export type ChemiRelationshipDiagnosis = {
  id: ChemiRelationshipId;
  typeName: string;
  roleYou: string;
  rolePartner: string;
  story: string;
};

/** 二人の関係性タイプ＋役割を診断（partyA = あなた側） */
export function diagnoseChemiRelationship(
  partyA: PartyLike,
  partyB: PartyLike,
  shared: string[],
  conflict: number,
  locale: Locale = "ja",
): ChemiRelationshipDiagnosis {
  const def = matchRelationship(partyA.aura, partyB.aura, shared, conflict);
  const impulseA = attrScore(partyA.aura, def.impulseAttrs);
  const impulseB = attrScore(partyB.aura, def.impulseAttrs);
  const anchorA = attrScore(partyA.aura, def.anchorAttrs);
  const anchorB = attrScore(partyB.aura, def.anchorAttrs);

  // 差分が大きい方を優先。同点なら A を impulse 側に
  const aLeansImpulse = impulseA - anchorA >= impulseB - anchorB;
  const youImpulse = aLeansImpulse;

  return {
    id: def.id,
    typeName: pickLocale(def.typeName, locale),
    roleYou: pickLocale(youImpulse ? def.roleImpulse : def.roleAnchor, locale),
    rolePartner: pickLocale(youImpulse ? def.roleAnchor : def.roleImpulse, locale),
    story: pickLocale(def.story, locale),
  };
}
