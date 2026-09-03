"use client";

import type { CSSProperties } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { AuraSphereCompact } from "@/components/AuraSphere";
import type { AuraType } from "@/lib/constants/auras";
import { getAuraLineage, SECRET_FLAVOR } from "@/lib/constants/auras";
import { getRarityLabel } from "@/lib/i18n/localize";

type AuraEncyclopediaCardProps = {
  aura: AuraType;
  lineageCode?: string;
  lineageAccent?: string;
  lineageAccentSoft?: string;
};

export default function AuraEncyclopediaCard({
  aura,
  lineageCode,
  lineageAccent,
}: AuraEncyclopediaCardProps) {
  const { locale, t } = useLocale();
  const isSecret = aura.rarity === "secret";
  const lineageColor = lineageAccent ?? aura.palette.a;
  const accent = aura.palette.a;
  const cardSoft = `color-mix(in srgb, ${accent} 14%, transparent)`;
  const secretFlavor = locale === "en" ? t.aura.secretFlavor : SECRET_FLAVOR;
  const lineage = getAuraLineage(aura.id);

  return (
    <article
      className={`aura-encyclopedia-card group relative w-full min-w-0 overflow-hidden rounded-2xl border p-0 backdrop-blur transition duration-300 hover:-translate-y-1 ${lineage?.id === "legend" ? "aura-encyclopedia-legend" : ""}`}
      style={
        {
          "--lineage-accent": accent,
          "--ency-a": aura.palette.a,
          "--ency-b": aura.palette.b,
          "--ency-c": aura.palette.c,
          borderColor: `${accent}66`,
          background: `linear-gradient(165deg, ${cardSoft} 0%, rgba(0,0,0,0.44) 38%)`,
        } as CSSProperties
      }
    >
      <div
        className="relative flex items-center justify-between gap-2 px-3 py-2"
        style={{
          background: `linear-gradient(90deg, color-mix(in srgb, ${aura.palette.a} 28%, transparent), color-mix(in srgb, ${aura.palette.b} 22%, transparent), color-mix(in srgb, ${aura.palette.c} 18%, transparent))`,
          borderBottom: `1px solid ${accent}44`,
        }}
      >
        <span
          className="text-xs font-black tracking-[0.22em]"
          style={{ color: lineageColor }}
        >
          {lineageCode ?? "??"}
        </span>
      </div>

      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${aura.palette.a}, ${aura.palette.b}, ${aura.palette.c})`,
        }}
        aria-hidden
      />

      <div className="relative p-4 sm:p-5">
        <div className="aura-encyclopedia-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
          <AuraSphereCompact
            auraId={aura.id}
            palette={aura.palette}
            lineage={lineage}
            secret={isSecret}
            className="size-full"
          />
        </div>

        <div className="relative mt-4 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="min-w-0 break-words text-lg font-black leading-snug sm:text-xl">
                {isSecret ? t.aura.secretName : aura.archetypeName}
              </h3>
              {!isSecret ? (
                <p className="mt-1 break-words text-xs font-medium" style={{ color: `${accent}cc` }}>
                  {aura.name}
                </p>
              ) : null}
            </div>
            <span
              className="w-fit shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black tracking-wide"
              style={{
                borderColor: `${accent}aa`,
                background: `color-mix(in srgb, ${accent} 20%, transparent)`,
                boxShadow: `0 0 12px ${accent}44`,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {getRarityLabel(aura.rarity, locale)}
            </span>
          </div>
          <p className="break-words text-sm font-medium" style={{ color: `${accent}ee` }}>
            {isSecret ? t.aura.secretFlavor : aura.catchCopy}
          </p>
          <p className="break-words text-xs leading-relaxed text-white/70">
            {isSecret ? secretFlavor : aura.description}
          </p>
        </div>
      </div>
    </article>
  );
}
