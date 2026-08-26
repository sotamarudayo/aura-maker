import type { AuraType } from "@/lib/constants/auras";

export type ChemiParty = {
  displayName: string;
  aura: AuraType;
  topWords: string[];
};

export type ChemiResult = {
  chemName: string;
  compatibilityPercent: number;
  ecologyText: string;
  blendedPalette: AuraType["palette"];
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
  return score;
}

function sharedWordCount(wordsA: string[], wordsB: string[]): number {
  const setB = new Set(wordsB);
  return wordsA.filter((word) => setB.has(word)).length;
}

function buildChemName(auraA: AuraType, auraB: AuraType, shared: string[]): string {
  if (hasAttribute(auraA, "chaos") && hasAttribute(auraB, "chaos")) {
    return "危険な爆走コンビ";
  }
  if (
    auraA.archetypeName === "ど変態野郎" ||
    auraB.archetypeName === "ど変態野郎" ||
    auraA.id === "hentai-nebula" ||
    auraB.id === "hentai-nebula"
  ) {
    return "禁忌好奇心コンビ";
  }
  if (
    auraA.id === "menhera-pulse" ||
    auraB.id === "menhera-pulse"
  ) {
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

function buildEcologyText(auraA: AuraType, auraB: AuraType, shared: string[], conflict: number): string {
  if (hasAttribute(auraA, "chaos") && hasAttribute(auraB, "chaos")) {
    return "一緒にいると朝まで帰れなくなる。テンションだけは永久機関。";
  }
  if (conflict >= 3) {
    return "片方が暴走した時にもう片方がブレーキをかける関係性。止めるのも煽るのもうまい。";
  }
  if (shared.includes("heal")) {
    return "落ち込んだ方を自然に立て直す、静かな共依存コンビ。";
  }
  if (hasAttribute(auraA, "otaku") || hasAttribute(auraB, "otaku")) {
    return "推しの話が始まると周囲の会話速度が3倍になる。止められない。";
  }
  if (hasAttribute(auraA, "mystic") || hasAttribute(auraB, "mystic")) {
    return "一緒にいると勝手に考察モードに入る。雑談のはずが長編になる。";
  }
  if (hasAttribute(auraA, "hero") || hasAttribute(auraB, "hero")) {
    return "困った時に自然と横並びで前に出る。頼られると強くなる二人。";
  }
  return "ノリは合うのに予測不能。SNSでイジり合える距離感の持ち主。";
}

function blendPalette(a: AuraType["palette"], b: AuraType["palette"]): AuraType["palette"] {
  return {
    a: a.a,
    b: b.b,
    c: a.c,
  };
}

export function calculateChemi(partyA: ChemiParty, partyB: ChemiParty): ChemiResult {
  const shared = sharedAttributes(partyA.aura, partyB.aura);
  const conflict = conflictScore(partyA.aura, partyB.aura);
  const wordOverlap = sharedWordCount(partyA.topWords, partyB.topWords);

  let percent = 58 + shared.length * 9 + wordOverlap * 8;
  if (conflict > 0) {
    percent += Math.min(12, conflict * 3);
  }
  if (partyA.aura.id === partyB.aura.id) {
    percent += 6;
  }
  percent = Math.min(99, Math.max(55, Math.round(percent)));

  return {
    chemName: buildChemName(partyA.aura, partyB.aura, shared),
    compatibilityPercent: percent,
    ecologyText: buildEcologyText(partyA.aura, partyB.aura, shared, conflict),
    blendedPalette: blendPalette(partyA.aura.palette, partyB.aura.palette),
  };
}
