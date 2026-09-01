import type { AuraType, AuraCalculationResult, AuraRarity, DynamicAuraProfile } from "@/lib/constants/auras";
import type { AuraLineage } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";
import { getVoteWordDef } from "@/lib/constants/words";
import type { Locale } from "./types";
import { AURA_EN } from "./en/auras";
import { LINEAGE_EN } from "./en/lineages";

/** 投票ワード id → 英語ラベル（ネットスラング寄り） */
export const WORD_EN: Record<string, string> = {
  "biju-bakuhatsu": "Face Card Maxed",
  "attoteki-shujinko": "Main Character Energy",
  tomeikan: "Glass Skin",
  charisma: "Charisma",
  hakanage: "Ethereal",
  "heisei-retro": "Retro Aesthetic",
  "silhouette-tsuyome": "Iconic Silhouette",
  numa: "Obsession Trap",
  "minus-ion": "Calm Aura",
  "kyorikan-bug": "Personal Space Glitch",
  "youkya-vibes": "Extrovert Vibes",
  "iyashi-waku": "Emotional Support",
  "tayoreru-aibo": "Ride-or-Die Friend",
  "kuuki-seijouki": "Human Air Purifier",
  "shinya-tension": "3AM Energy",
  "genkai-otaku": "Terminal Fan",
  npc: "NPC Energy",
  "chian-warume": "Chaotic Neutral",
  kyoki: "Unhinged",
  "tensai-baka": "Genius Idiot",
  "kusa-fukahi": "Comedy Gold",
  "gap-no-oni": "Plot Twist Demon",
  tsundere: "Tsundere",
  "cool-doji": "Cool Until They Trip",
  mysterious: "Mysterious",
  chiseiha: "Big Brain",
  "jitsuwa-sabishigari": "Secretly Lonely",
  "tennen-dokuzetsu": "Accidental Savage",
  gainen: "Living Concept",
  kuromaku: "Mastermind",
  "isekai-tense": "Isekai Protagonist",
  "zettai-reido": "Absolute Zero",
  "last-boss": "Final Boss",
  "bug-waza": "Broken Meta",
  ijigen: "Otherworldly",
  "cheat-kyu": "Cheat Tier",
  "shashin-ugarisug": "Too Photogenic",
  "jidori-no-oni": "Selfie Demon",
  akunuketeru: "Glow-Up Complete",
  "meiryoku-sugoi": "Magnetic",
  "fashion-tsuyome": "Fashion Forward",
  "bisei-waku": "Pretty Privilege",
  "gyakko-de-kieru": "Corner Seat Ghost",
  "henshin-hayasug": "Quick Change Artist",
  "kidoku-suru-ma": "Read Receipt Anxiety",
  "kuuki-yomisug": "Overreads the Room",
  "nomikai-junkan": "Party Lubricant",
  "yotei-cancel": "Plans? Cancelled.",
  "ronri-busou": "Logic Weaponized",
  "totsuzen-boke": "Random Left Turn",
  "reaction-kajo": "Over-Reacting",
  "meshi-tero": "Food Crimes",
  "chikoku-joshu": "Chronic Late",
  "tension-hokei": "Hype Rectangle",
  "goi-netto": "Agreeable Online",
  "sekkyo-mode": "Lecture Mode",
  "neochi-tanto": "Sleep Duty",
  "jigaku-neta": "Self-Roast King",
  "oshi-shika-katan": "Fandom or Nothing",
  "hanashi-kyuu-ni-koku": "Plot Thickens Fast",
  "shumi-kaizoudo-bug": "Hyperfixation HD",
  "shitsumon-egui": "Questions Hit Different",
  "yoru-ni-naru-to-betsu": "Night Mode Unlocked",
  "nori-shatei-nagai": "Slow Burn Social",
  "ondo-sa-binkan": "Vibe Thermometer",
  "aisare-jouzu": "Loved Easily",
  "hanno-machi-gachi": "Needs a Reaction",
  "yohaku-ga-kowai": "Silence = Panic",
  "joucho-otenki": "Mood Weather",
  "soba-ni-ite-hoshii": "Please Stay Close",
  "darui-non-yuuno": "Lazy but Lethal",
  "hito-mishiri": "Selective Social",
  emoi: "Emotional Damage (Good)",
  "oshikatsu-no-oni": "Fandom Demon",
  "kuchihazuk-non-dokuzetsu": "Sharp Tongue, Soft Heart",
  "ichininshou-tsuyoi": "Solo Main Character",
  "gruchat-midoku": "Group Chat Ghost",
  "onchi-non-atsui": "Tone Deaf but Passionate",
  "warai-no-inryoku": "Gravity of Laughter",
  nekketsu: "Hot-Blooded",
  reitetsu: "Ice Cold",
  onkou: "Gentle Soul",
  hentai: "Down Bad (Allegedly)",
  tennen: "Chaotically Innocent",
  makezugirai: "Competitive",
  "mendoumi-ii": "Looks After Everyone",
  haraguro: "Secretly Scheming",
};

export const RARITY_LABELS_EN: Record<AuraRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "Legendary",
  secret: "Secret",
};

export function getRarityLabel(rarity: AuraRarity, locale: Locale): string {
  return locale === "ja" ? RARITY_LABELS[rarity] : RARITY_LABELS_EN[rarity];
}

export function getLocalizedWordLabel(jpLabel: string, locale: Locale): string {
  if (locale === "ja") return jpLabel;
  const def = getVoteWordDef(jpLabel);
  if (!def) return jpLabel;
  return WORD_EN[def.id] ?? jpLabel;
}

export function localizeWordLabels(labels: string[], locale: Locale): string[] {
  return labels.map((label) => getLocalizedWordLabel(label, locale));
}

export function localizeAuraType(aura: AuraType, locale: Locale): AuraType {
  if (locale === "ja") return aura;
  const en = AURA_EN[aura.id];
  if (!en) return aura;
  return {
    ...aura,
    name: en.name,
    archetypeName: en.archetypeName,
    catchCopy: en.catchCopy,
    description: en.description,
  };
}

export function localizeLineage(lineage: AuraLineage, locale: Locale): AuraLineage {
  if (locale === "ja") return lineage;
  const en = LINEAGE_EN[lineage.id];
  if (!en) return lineage;
  return { ...lineage, name: en.name, tagline: en.tagline };
}

function personalizeCatchCopyEn(catchCopy: string, topWords: string[]): string {
  if (topWords.length === 0) return catchCopy;
  if (topWords.length === 1) return `Fueled by "${topWords[0]}" — ${catchCopy}`;
  if (topWords.length === 2) {
    return `"${topWords[0]}" × "${topWords[1]}" collide into: ${catchCopy}`;
  }
  return `Led by "${topWords[0]}" with "${topWords[1]}" & "${topWords[2]}" — ${catchCopy}`;
}

function confidenceLabelEn(confidence: DynamicAuraProfile["confidence"]): string {
  if (confidence === "provisional") return "Draft result";
  if (confidence === "growing") return "Still evolving";
  return "Locked in";
}

export function localizeDynamicProfile(
  profile: DynamicAuraProfile,
  auraId: string,
  topWordsJp: string[],
  locale: Locale,
): DynamicAuraProfile {
  if (locale === "ja") return profile;

  const enAura = AURA_EN[auraId];
  const topWords = localizeWordLabels(topWordsJp, locale);
  const archetype = enAura?.archetypeName ?? "Your aura";

  const reading =
    topWords.length >= 2
      ? `Friends keep voting "${topWords[0]}" and "${topWords[1]}" — the ${archetype} read tracks.`
      : topWords.length === 1
        ? `"${topWords[0]}" keeps showing up. Yeah, that fits ${archetype}.`
        : enAura?.reading ?? profile.readingText;

  return {
    ...profile,
    mainText: enAura?.mainText ?? profile.mainText,
    readingText: reading,
    witnessText: enAura?.witness ?? profile.witnessText,
    shadowText: enAura?.shadow ?? profile.shadowText,
    ecology: enAura?.ecology ?? profile.ecology,
    specialMove: enAura?.specialMove(topWords) ?? profile.specialMove,
    shareLine: `My aura is ${archetype} on AuraMaker ✨`,
    dailyFortune: enAura?.fortune ?? profile.dailyFortune,
    confidenceLabel: confidenceLabelEn(profile.confidence),
    evidence: profile.evidence.map((item) => ({
      ...item,
      word: getLocalizedWordLabel(item.word, locale),
      badge:
        item.badge === "最多"
          ? "Top pick"
          : item.badge === "有力"
            ? "Strong"
            : item.badge === "決め手"
              ? "Decider"
              : item.badge,
    })),
    compatibility: {
      good: {
        ...profile.compatibility.good,
        name: AURA_EN[profile.compatibility.good.id]?.name ?? profile.compatibility.good.name,
      },
      bad: {
        ...profile.compatibility.bad,
        name: AURA_EN[profile.compatibility.bad.id]?.name ?? profile.compatibility.bad.name,
      },
    },
    contradiction: profile.contradiction
      ? {
          ...profile.contradiction,
          text: profile.contradiction.text,
        }
      : null,
    awakening: {
      ...profile.awakening,
      hint:
        profile.awakening.hint === "投票URLをシェアして覚醒させよう"
          ? "Share your vote link to awaken your aura"
          : profile.awakening.hint,
    },
  };
}

export function localizeAuraResult(
  result: AuraCalculationResult,
  locale: Locale,
): AuraCalculationResult {
  if (locale === "ja") return result;

  const aura = localizeAuraType(result.aura, locale);
  const topWords = localizeWordLabels(result.topWords, locale);

  return {
    aura,
    topWords,
    personalizedCatchCopy: personalizeCatchCopyEn(aura.catchCopy, topWords),
    dynamicProfile: localizeDynamicProfile(
      result.dynamicProfile,
      result.aura.id,
      result.topWords,
      locale,
    ),
  };
}
