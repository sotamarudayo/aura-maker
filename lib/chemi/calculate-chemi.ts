import type { AuraType } from "@/lib/constants/auras";
import type { Locale } from "@/lib/i18n/types";
import {
  diagnoseChemiRelationship,
  type ChemiRelationshipDiagnosis,
} from "@/lib/chemi/relationship-diagnosis";

export type ChemiParty = {
  displayName: string;
  aura: AuraType;
  topWords: string[];
};

export type ChemiGaugeId = "talk" | "distance" | "vibe";

export type ChemiGauge = {
  id: ChemiGaugeId;
  label: string;
  percent: number;
  color: string;
};

export type ChemiResult = {
  /** 旧コンビ名（サブ表示用） */
  chemName: string;
  compatibilityPercent: number;
  /** 関係性ストーリー（ecology と同内容） */
  ecologyText: string;
  relationship: ChemiRelationshipDiagnosis;
  blendedPalette: AuraType["palette"];
  gauges: ChemiGauge[];
};

function sharedAttributes(a: AuraType, b: AuraType): string[] {
  const setB = new Set(b.attributes);
  return a.attributes.filter((attr) => setB.has(attr));
}

function hasAttribute(aura: AuraType, attr: string) {
  return aura.attributes.includes(attr as (typeof aura.attributes)[number]);
}

function conflictScore(a: AuraType, b: AuraType): number {
  let score = 0;
  const aAttrs = a.attributes;
  const bAttrs = b.attributes;
  if (bAttrs.includes("void") && (aAttrs.includes("warm") || aAttrs.includes("hero"))) score += 3;
  if (bAttrs.includes("chaos") && aAttrs.includes("heal")) score += 3;
  if (bAttrs.includes("crystal") && aAttrs.includes("warm")) score += 2;
  if (bAttrs.includes("god") && aAttrs.includes("heal")) score += 2;
  if (bAttrs.includes("void") && aAttrs.includes("chaos")) score += 1;
  // symmetric checks
  if (aAttrs.includes("void") && (bAttrs.includes("warm") || bAttrs.includes("hero"))) score += 3;
  if (aAttrs.includes("chaos") && bAttrs.includes("heal")) score += 3;
  return score;
}

function sharedWordCount(wordsA: string[], wordsB: string[]): number {
  const setB = new Set(wordsB);
  return wordsA.filter((word) => setB.has(word)).length;
}

function buildChemName(auraA: AuraType, auraB: AuraType, shared: string[], locale: Locale): string {
  if (locale === "en") {
    if (hasAttribute(auraA, "chaos") && hasAttribute(auraB, "chaos")) return "Dangerous Duo";
    if (hasAttribute(auraA, "heal") && hasAttribute(auraB, "heal")) return "Heal Unit";
    if (shared.includes("imp")) return "Gap Twin Spark";
    return `${auraA.archetypeName} × ${auraB.archetypeName}`;
  }

  if (hasAttribute(auraA, "chaos") && hasAttribute(auraB, "chaos")) {
    return "危険な爆走コンビ";
  }
  if (
    auraA.archetypeName === "むっつりど変態" ||
    auraB.archetypeName === "むっつりど変態" ||
    auraA.id === "hentai-nebula" ||
    auraB.id === "hentai-nebula"
  ) {
    return "禁忌好奇心コンビ";
  }
  if (auraA.id === "menhera-pulse" || auraB.id === "menhera-pulse") {
    return "かまって共依存コンビ";
  }
  if (
    (hasAttribute(auraA, "mystic") && hasAttribute(auraB, "void")) ||
    (hasAttribute(auraA, "void") && hasAttribute(auraB, "mystic"))
  ) {
    return "静かな共犯者";
  }
  if (hasAttribute(auraA, "warm") && hasAttribute(auraB, "otaku")) {
    return `陽気なカオス×${auraB.archetypeName}`;
  }
  if (hasAttribute(auraA, "otaku") && hasAttribute(auraB, "warm")) {
    return `${auraA.archetypeName}×陽気なカオス`;
  }
  if (hasAttribute(auraA, "heal") && hasAttribute(auraB, "heal")) {
    return "癒やし合いユニット";
  }
  if (shared.includes("chaos") && shared.includes("hero")) {
    return "止められない推進コンビ";
  }
  if (shared.includes("imp") || (hasAttribute(auraA, "imp") && hasAttribute(auraB, "imp"))) {
    return "ギャップ炸裂ツイン";
  }
  if (hasAttribute(auraA, "intellect") && hasAttribute(auraB, "chaos")) {
    return "理論と暴走の混合体";
  }

  const shortA = auraA.archetypeName.length > 6 ? auraA.archetypeName.slice(0, 6) : auraA.archetypeName;
  const shortB = auraB.archetypeName.length > 6 ? auraB.archetypeName.slice(0, 6) : auraB.archetypeName;
  return `${shortA}×${shortB}`;
}

function blendPalette(a: AuraType["palette"], b: AuraType["palette"]): AuraType["palette"] {
  return {
    a: a.a,
    b: b.b,
    c: a.c,
  };
}

function clampPercent(value: number) {
  return Math.min(99, Math.max(55, Math.round(value)));
}

function gaugeLabels(locale: Locale): Record<ChemiGaugeId, string> {
  if (locale === "en") {
    return { talk: "Talk flow", distance: "Easy distance", vibe: "Shared vibe" };
  }
  return { talk: "会話のノリ", distance: "心地よい距離", vibe: "共有バイブ" };
}

function buildGauges(
  partyA: ChemiParty,
  partyB: ChemiParty,
  shared: string[],
  conflict: number,
  wordOverlap: number,
  locale: Locale,
): ChemiGauge[] {
  const { aura: auraA } = partyA;
  const { aura: auraB } = partyB;
  const labels = gaugeLabels(locale);

  let talk = 62 + wordOverlap * 14;
  if (hasAttribute(auraA, "chaos") || hasAttribute(auraB, "chaos")) talk += 8;
  if (hasAttribute(auraA, "warm") || hasAttribute(auraB, "warm")) talk += 6;
  if (hasAttribute(auraA, "imp") || hasAttribute(auraB, "imp")) talk += 4;

  let distance = 68 + shared.length * 7 - conflict * 5;
  if (hasAttribute(auraA, "heal") && hasAttribute(auraB, "heal")) distance += 12;
  if (hasAttribute(auraA, "void") || hasAttribute(auraB, "void")) distance -= 6;

  let vibe = 60 + shared.length * 11 + wordOverlap * 7;
  if (partyA.aura.id === partyB.aura.id) vibe += 10;
  if (shared.includes("chaos") || shared.includes("otaku")) vibe += 6;

  return [
    { id: "talk", label: labels.talk, percent: clampPercent(talk), color: "#22d3ee" },
    { id: "distance", label: labels.distance, percent: clampPercent(distance), color: "#f472b6" },
    { id: "vibe", label: labels.vibe, percent: clampPercent(vibe), color: "#a855f7" },
  ];
}

export function calculateChemi(
  partyA: ChemiParty,
  partyB: ChemiParty,
  locale: Locale = "ja",
): ChemiResult {
  const shared = sharedAttributes(partyA.aura, partyB.aura);
  const conflict = conflictScore(partyA.aura, partyB.aura);
  const wordOverlap = sharedWordCount(partyA.topWords, partyB.topWords);
  const relationship = diagnoseChemiRelationship(partyA, partyB, shared, conflict, locale);

  let percent = 58 + shared.length * 9 + wordOverlap * 8;
  if (conflict > 0) {
    percent += Math.min(12, conflict * 3);
  }
  if (partyA.aura.id === partyB.aura.id) {
    percent += 6;
  }
  percent = clampPercent(percent);

  return {
    chemName: buildChemName(partyA.aura, partyB.aura, shared, locale),
    compatibilityPercent: percent,
    ecologyText: relationship.story,
    relationship,
    blendedPalette: blendPalette(partyA.aura.palette, partyB.aura.palette),
    gauges: buildGauges(partyA, partyB, shared, conflict, wordOverlap, locale),
  };
}
