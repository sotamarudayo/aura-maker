import Link from "next/link";
import type { CSSProperties } from "react";
import AuraBackground from "@/components/AuraBackground";
import AuraDetailCta from "@/components/AuraDetailCta";
import { AuraSphereCompact } from "@/components/AuraSphere";
import {
  getAuraById,
  getAuraCatalogEcology,
  getAuraLineage,
  SECRET_FLAVOR,
  type AuraType,
} from "@/lib/constants/auras";
import { getSiteUrlStatic } from "@/lib/i18n/metadata";
import { getMessages } from "@/lib/i18n/messages";
import {
  getRarityLabel,
  localizeAuraType,
  localizeLineage,
  localizeWordLabels,
} from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/types";
import { buildAuraFaqJsonLd, getAuraSeoCopy } from "@/lib/seo/aura-seo";

type AuraDetailViewProps = {
  aura: AuraType;
  locale: Locale;
};

export default function AuraDetailView({ aura: rawAura, locale }: AuraDetailViewProps) {
  const t = getMessages(locale);
  const aura = localizeAuraType(rawAura, locale);
  const isSecret = aura.rarity === "secret";
  const lineageRaw = getAuraLineage(aura.id);
  const lineage = lineageRaw ? localizeLineage(lineageRaw, locale) : undefined;
  const ecology = getAuraCatalogEcology(aura.id);
  const accent = aura.palette.a;
  const displayName = isSecret ? t.aura.secretName : aura.archetypeName;
  const displayFormal = isSecret ? t.aura.secretName : aura.name;
  const catchCopy = isSecret ? t.aura.secretFlavor : aura.catchCopy;
  const description = isSecret
    ? locale === "en"
      ? t.aura.secretFlavor
      : SECRET_FLAVOR
    : aura.description;
  const impressionExamples = isSecret
    ? []
    : localizeWordLabels([...aura.keywords].slice(0, 6), locale);

  const seo = getAuraSeoCopy(aura.id, displayName);
  const showJaSeo = locale === "ja";

  const related = (lineageRaw?.auraIds ?? [])
    .filter((id) => id !== aura.id)
    .map((id) => getAuraById(id))
    .filter((item): item is AuraType => Boolean(item))
    .map((item) => localizeAuraType(item, locale));

  const similar = seo.similarIds
    .map((id) => getAuraById(id))
    .filter((item): item is AuraType => item != null && item.id !== aura.id)
    .map((item) => localizeAuraType(item, locale));

  const siteUrl = getSiteUrlStatic();
  const pageUrl = `${siteUrl}/auras/${encodeURIComponent(aura.id)}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.encyclopedia.detailWhatIs.replace("{name}", displayName),
        description: t.encyclopedia.detailSeoLead
          .replace("{archetype}", displayName)
          .replace("{formal}", displayFormal),
        inLanguage: locale === "en" ? "en" : "ja",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "Thing",
        "@id": `${pageUrl}#aura`,
        name: displayName,
        alternateName: isSecret ? undefined : aura.name,
        description: showJaSeo ? `${description} ${seo.whatIsExtra}` : description,
        url: pageUrl,
      },
    ],
  };
  const faqLd = showJaSeo ? buildAuraFaqJsonLd(pageUrl, displayName, seo.faq) : null;

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <AuraBackground />

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-3xl space-y-8">
        <Link
          href="/auras"
          className="inline-flex text-sm font-semibold text-white/70 transition hover:text-white"
        >
          {t.encyclopedia.backEncyclopedia}
        </Link>

        <article
          className="overflow-hidden rounded-3xl border backdrop-blur"
          style={
            {
              borderColor: `${accent}66`,
              background: `linear-gradient(165deg, color-mix(in srgb, ${accent} 16%, transparent) 0%, rgba(0,0,0,0.5) 42%)`,
              "--card-a": aura.palette.a,
              "--card-b": aura.palette.b,
              "--card-c": aura.palette.c,
            } as CSSProperties
          }
        >
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
            style={{
              background: `linear-gradient(90deg, color-mix(in srgb, ${aura.palette.a} 30%, transparent), color-mix(in srgb, ${aura.palette.b} 22%, transparent), color-mix(in srgb, ${aura.palette.c} 18%, transparent))`,
              borderBottom: `1px solid ${accent}44`,
            }}
          >
            {lineage ? (
              <span className="text-xs font-black tracking-[0.2em]" style={{ color: lineage.accent }}>
                {lineage.code} · {lineage.name}
              </span>
            ) : (
              <span className="text-xs text-white/50">Aura</span>
            )}
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-black tracking-wide"
              style={{
                borderColor: `${accent}aa`,
                background: `color-mix(in srgb, ${accent} 20%, transparent)`,
              }}
            >
              {getRarityLabel(aura.rarity, locale)}
            </span>
          </div>

          <div className="space-y-6 px-5 py-8 sm:px-8">
            <div className="mx-auto h-36 w-36 sm:h-44 sm:w-44">
              <AuraSphereCompact
                auraId={aura.id}
                palette={aura.palette}
                lineage={lineageRaw}
                secret={isSecret}
                className="size-full"
              />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold tracking-wide text-white/50">{t.aura.alias}</p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">{displayName}</h1>
              {!isSecret ? (
                <p className="text-sm font-medium" style={{ color: `${accent}cc` }}>
                  {aura.name}
                </p>
              ) : null}
              <p className="pt-1 text-base font-medium sm:text-lg" style={{ color: `${accent}ee` }}>
                {catchCopy}
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-black tracking-wide text-white/90">
                {t.encyclopedia.whatIsHeading.replace("{name}", displayName)}
              </h2>
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">{description}</p>
              {showJaSeo ? (
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">{seo.whatIsExtra}</p>
              ) : null}
            </section>

            {(ecology.habitat || ecology.trigger || ecology.weakness || ecology.sideEffect) && (
              <section className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
                <h2 className="text-sm font-black tracking-wide text-white/90">{t.aura.ecology}</h2>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  {ecology.habitat ? (
                    <div>
                      <dt className="text-xs font-semibold text-white/45">{t.aura.habitat}</dt>
                      <dd className="mt-1 text-white/85">{ecology.habitat}</dd>
                    </div>
                  ) : null}
                  {ecology.trigger ? (
                    <div>
                      <dt className="text-xs font-semibold text-white/45">{t.aura.trigger}</dt>
                      <dd className="mt-1 text-white/85">{ecology.trigger}</dd>
                    </div>
                  ) : null}
                  {ecology.weakness ? (
                    <div>
                      <dt className="text-xs font-semibold text-white/45">{t.aura.weakness}</dt>
                      <dd className="mt-1 text-white/85">{ecology.weakness}</dd>
                    </div>
                  ) : null}
                  {ecology.sideEffect ? (
                    <div>
                      <dt className="text-xs font-semibold text-white/45">{t.aura.sideEffect}</dt>
                      <dd className="mt-1 text-white/85">{ecology.sideEffect}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            )}

            {showJaSeo ? (
              <section className="space-y-3">
                <h2 className="text-sm font-black tracking-wide text-white/90">
                  {t.encyclopedia.weaknessNoteTitle}
                </h2>
                <p className="text-sm leading-relaxed text-white/75">{seo.weaknessNote}</p>
              </section>
            ) : null}

            {showJaSeo && seo.aruaru.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-sm font-black tracking-wide text-white/90">
                  {t.encyclopedia.aruaruTitle}
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
                  {seo.aruaru.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {impressionExamples.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-sm font-black tracking-wide text-white/90">
                  {t.encyclopedia.impressionExamples}
                </h2>
                <p className="text-xs text-white/45">{t.encyclopedia.impressionNote}</p>
                <ul className="flex flex-wrap gap-2">
                  {impressionExamples.map((word) => (
                    <li
                      key={word}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80"
                    >
                      {word}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showJaSeo && seo.faq.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-sm font-black tracking-wide text-white/90">
                  {t.encyclopedia.detailFaqTitle}
                </h2>
                <div className="space-y-2">
                  {seo.faq.map((item) => (
                    <details
                      key={item.question}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <summary className="cursor-pointer text-sm font-semibold text-white/90">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>

        <AuraDetailCta accent={accent} />

        {similar.length > 0 ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-black">{t.encyclopedia.similarTitle}</h2>
              <p className="mt-1 text-sm text-white/55">{t.encyclopedia.similarLead}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {similar.map((item) => {
                const secret = item.rarity === "secret";
                const name = secret ? t.aura.secretName : item.archetypeName;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/auras/${item.id}`}
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                      style={{ borderColor: `${item.palette.a}55` }}
                    >
                      <p className="font-bold text-white">{name}</p>
                      {!secret ? (
                        <p className="mt-0.5 text-xs" style={{ color: `${item.palette.a}cc` }}>
                          {item.name}
                        </p>
                      ) : null}
                      <p className="mt-2 line-clamp-2 text-xs text-white/60">
                        {secret ? t.aura.secretFlavor : item.catchCopy}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-black">{t.encyclopedia.relatedTitle}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((item) => {
                const secret = item.rarity === "secret";
                const name = secret ? t.aura.secretName : item.archetypeName;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/auras/${item.id}`}
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                      style={{ borderColor: `${item.palette.a}55` }}
                    >
                      <p className="font-bold text-white">{name}</p>
                      {!secret ? (
                        <p className="mt-0.5 text-xs" style={{ color: `${item.palette.a}cc` }}>
                          {item.name}
                        </p>
                      ) : null}
                      <p className="mt-2 line-clamp-2 text-xs text-white/60">
                        {secret ? t.aura.secretFlavor : item.catchCopy}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <p className="text-center text-xs text-white/40">
          <Link href="/faq" className="hover:text-white/70">
            FAQ
          </Link>
          {" · "}
          <Link href="/blog" className="hover:text-white/70">
            Blog
          </Link>
        </p>
      </div>
    </main>
  );
}
