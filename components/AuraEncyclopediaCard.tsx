import type { CSSProperties } from "react";
import type { AuraType } from "@/lib/constants/auras";
import { RARITY_LABELS, SECRET_FLAVOR } from "@/lib/constants/auras";

type AuraEncyclopediaCardProps = {
  aura: AuraType;
};

export default function AuraEncyclopediaCard({ aura }: AuraEncyclopediaCardProps) {
  const isSecret = aura.rarity === "secret";

  return (
    <article
      className={`aura-encyclopedia-card group relative w-full min-w-0 overflow-hidden rounded-2xl border p-4 backdrop-blur transition duration-300 hover:-translate-y-1 sm:p-5 ${
        isSecret
          ? "border-violet-400/30 bg-black/60 hover:border-violet-300/50"
          : "border-white/15 bg-black/40 hover:border-white/35"
      }`}
      style={
        {
          "--ency-a": isSecret ? "#4c1d95" : aura.palette.a,
          "--ency-b": isSecret ? "#0f172a" : aura.palette.b,
          "--ency-c": isSecret ? "#1e1b4b" : aura.palette.c,
        } as CSSProperties
      }
    >
      <div className="aura-encyclopedia-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {isSecret ? (
        <div className="aura-secret-orb relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
          <div className="absolute inset-0 rounded-full bg-zinc-950 shadow-[0_0_28px_rgba(124,58,237,0.45)]" />
          <div className="absolute inset-[10%] rounded-full border border-violet-400/40" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-violet-200/80">
            ?
          </div>
        </div>
      ) : (
        <div
          className="relative mx-auto h-20 w-20 rounded-full border border-white/20 shadow-lg sm:h-24 sm:w-24"
          style={{ background: aura.gradient }}
        />
      )}

      <div className="relative mt-4 min-w-0 space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="min-w-0 break-words text-base font-bold leading-snug sm:text-lg">
            {isSecret ? "？？？（シークレット）" : aura.name}
          </h3>
          <span
            className={`w-fit shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
              isSecret
                ? "border-violet-300/50 bg-violet-500/20 text-violet-100"
                : "border-white/20 bg-white/10"
            }`}
          >
            {RARITY_LABELS[aura.rarity]}
          </span>
        </div>
        <p className="break-words text-sm text-cyan-100/90">
          {isSecret ? "条件は明かされない、幻の光。" : aura.catchCopy}
        </p>
        <p className="break-words text-xs leading-relaxed text-white/70">
          {isSecret ? SECRET_FLAVOR : aura.description}
        </p>
      </div>
    </article>
  );
}
