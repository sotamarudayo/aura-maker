"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { getAuraById } from "@/lib/constants/auras";
import { localizeAuraType } from "@/lib/i18n/localize";
import type { PopularAuraStat } from "@/lib/stats/public";
import { trackEvent } from "@/lib/analytics";

type PopularAurasStripProps = {
  popularAuras: PopularAuraStat[];
  source: "landing" | "encyclopedia";
};

export default function PopularAurasStrip({ popularAuras, source }: PopularAurasStripProps) {
  const { locale, t } = useLocale();
  if (popularAuras.length === 0) return null;

  return (
    <section className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur sm:p-5">
      <p className="text-xs font-bold tracking-wide text-violet-200/90">{t.landing.popularEyebrow}</p>
      <h2 className="mt-1 text-lg font-black text-white sm:text-xl">{t.landing.popularTitle}</h2>
      <p className="mt-1 text-sm text-white/60">{t.landing.popularSub}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {popularAuras.map((item, index) => {
          const raw = getAuraById(item.id);
          const aura = raw ? localizeAuraType(raw, locale) : null;
          const name = aura?.archetypeName ?? item.archetypeName;
          return (
            <li key={item.id}>
              <Link
                href={`/auras/${item.id}`}
                onClick={() =>
                  trackEvent("popular_aura_click", {
                    aura_id: item.id,
                    rank: index + 1,
                    source,
                  })
                }
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/5 px-3 py-2.5 transition hover:bg-white/10"
                style={aura ? { borderColor: `${aura.palette.a}55` } : undefined}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white/80">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-white">{name}</span>
                  {aura && aura.rarity !== "secret" ? (
                    <span className="block truncate text-xs" style={{ color: `${aura.palette.a}cc` }}>
                      {aura.name}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
