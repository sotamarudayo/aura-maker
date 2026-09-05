import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuraDetailView from "@/components/AuraDetailView";
import { AURA_TYPES, getAuraById } from "@/lib/constants/auras";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { getMessages } from "@/lib/i18n/messages";
import { localizeAuraType } from "@/lib/i18n/localize";
import { getServerLocale } from "@/lib/i18n/server";
import { getAuraSeoCopy } from "@/lib/seo/aura-seo";

type AuraDetailPageProps = {
  params: Promise<{ auraId: string }>;
};

export function generateStaticParams() {
  return AURA_TYPES.map((aura) => ({ auraId: aura.id }));
}

export async function generateMetadata({
  params,
}: AuraDetailPageProps): Promise<Metadata> {
  const { auraId } = await params;
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const raw = getAuraById(auraId);
  if (!raw || raw.id === "dormant") {
    return { title: "Not Found" };
  }

  const aura = localizeAuraType(raw, locale);
  const isSecret = aura.rarity === "secret";
  const archetype = isSecret ? t.aura.secretName : aura.archetypeName;
  const formal = isSecret ? t.aura.secretName : aura.name;
  const title =
    locale === "en"
      ? `${archetype} — ${formal}`
      : `${archetype}とは？｜${formal}`;
  const seoExtra =
    locale === "ja" ? getAuraSeoCopy(aura.id, archetype).whatIsExtra : "";
  const description = [
    t.encyclopedia.detailSeoLead
      .replace("{archetype}", archetype)
      .replace("{formal}", formal),
    seoExtra,
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 300);

  return buildPageMetadata({
    locale,
    title,
    description,
    path: `/auras/${aura.id}`,
  });
}

export default async function AuraDetailPage({ params }: AuraDetailPageProps) {
  const { auraId } = await params;
  const locale = await getServerLocale();
  const aura = getAuraById(auraId);

  if (!aura || aura.id === "dormant" || !AURA_TYPES.some((item) => item.id === aura.id)) {
    notFound();
  }

  return <AuraDetailView aura={aura} locale={locale} />;
}
