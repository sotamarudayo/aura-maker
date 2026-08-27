import type { CSSProperties } from "react";
import type { AuraType } from "@/lib/constants/auras";
import { RARITY_LABELS, SECRET_FLAVOR } from "@/lib/constants/auras";

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
  lineageAccentSoft,
}: AuraEncyclopediaCardProps) {
  const isSecret = aura.rarity === "secret";
  const lineageColor = lineageAccent ?? aura.palette.a;
  const accent = aura.palette.a;
  const accentSoft = lineageAccentSoft ?? "rgba(255,255,255,0.06)";
  const cardSoft = `color-mix(in srgb, ${accent} 14%, transparent)`;

  return (
    <article
      className="aura-encyclopedia-card group relative w-full min-w-0 overflow-hidden rounded-2xl border p-0 backdrop-blur transition duration-300 hover:-translate-y-1"
      style={
        {
          "--lineage-accent": accent,
          "--ency-a": aura.palette.a,
          "--ency-b": aura.palette.b,
          "--ency-c": aura.palette.c,
          borderColor: `${accent}55`,
          background: `linear-gradient(165deg, ${cardSoft} 0%, rgba(0,0,0,0.44) 38%)`,
        } as CSSProperties
      }
    >
      <div
        className="relative flex items-center justify-center px-3 py-2"
        style={{
          background: accentSoft,
          borderBottom: `1px solid ${lineageColor}55`,
        }}
      >
        <span
          className="text-xs font-black tracking-[0.22em]"
          style={{ color: lineageColor }}
        >
          {lineageCode ?? "??"}
        </span>
      </div>

      <div className="relative p-4 sm:p-5">
        <div className="aura-encyclopedia-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {isSecret ? (
          <div
            className="aura-secret-orb relative mx-auto h-20 w-20 sm:h-24 sm:w-24"
            style={{ boxShadow: `0 0 28px ${accent}66` }}
          >
            <div className="absolute inset-0 rounded-full bg-zinc-950" />
            <div
              className="absolute inset-[10%] rounded-full border"
              style={{ borderColor: `${accent}66` }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-2xl font-black"
              style={{ color: `${accent}cc` }}
            >
              ?
            </div>
          </div>
        ) : (
          <div
            className="relative mx-auto h-20 w-20 rounded-full shadow-lg sm:h-24 sm:w-24"
            style={{
              background: aura.gradient,
              border: `1px solid ${accent}55`,
              boxShadow: `0 0 24px ${accent}33`,
            }}
          />
        )}

        <div className="relative mt-4 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="min-w-0 break-words text-lg font-black leading-snug sm:text-xl">
                {isSecret ? "？？？（シークレット）" : aura.archetypeName}
              </h3>
              {!isSecret ? (
                <p className="mt-1 break-words text-xs font-medium" style={{ color: `${accent}aa` }}>
                  {aura.name}
                </p>
              ) : null}
            </div>
            <span
              className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black tracking-wide ${
                isSecret
                  ? "border-violet-300/70 bg-violet-500/30 text-violet-100 shadow-[0_0_14px_rgba(124,58,237,0.4)]"
                  : aura.rarity === "legendary"
                    ? "border-amber-200/70 bg-amber-300/20 text-amber-100"
                    : aura.rarity === "rare"
                      ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                      : "border-white/20 bg-white/10 text-white/90"
              }`}
            >
              {RARITY_LABELS[aura.rarity]}
            </span>
          </div>
          <p className="break-words text-sm font-medium" style={{ color: `${accent}ee` }}>
            {isSecret ? "条件は明かされない、幻の光。" : aura.catchCopy}
          </p>
          <p className="break-words text-xs leading-relaxed text-white/70">
            {isSecret ? SECRET_FLAVOR : aura.description}
          </p>
        </div>
      </div>
    </article>
  );
}
