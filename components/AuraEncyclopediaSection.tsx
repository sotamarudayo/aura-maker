import Link from "next/link";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraEncyclopediaCard from "@/components/AuraEncyclopediaCard";
import {
  AURA_LINEAGES,
  AURA_TYPES,
  getAuraById,
} from "@/lib/constants/auras";

type AuraEncyclopediaSectionProps = {
  showCta?: boolean;
  isLoggedIn?: boolean;
};

export default function AuraEncyclopediaSection({
  showCta = true,
  isLoggedIn = false,
}: AuraEncyclopediaSectionProps) {
  return (
    <section id="auras" className="space-y-10">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">AURA ENCYCLOPEDIA</p>
        <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
          全{AURA_TYPES.length}種類のオーラを発見しよう
        </h2>
        <p className="mx-auto mt-3 max-w-2xl px-1 text-sm text-white/75 sm:text-base">
          似た空気感どうしで系統分け。あなたの印象ワードの組み合わせで、どの系統に着地するかが決まる。
        </p>
      </div>

      <div className="space-y-10">
        {AURA_LINEAGES.map((lineage) => {
          const auras = lineage.auraIds
            .map((id) => getAuraById(id))
            .filter((aura): aura is NonNullable<typeof aura> => Boolean(aura));

          return (
            <div key={lineage.id} className="space-y-4">
              <div
                className="flex flex-col gap-2 rounded-2xl border px-4 py-3 sm:flex-row sm:items-end sm:justify-between sm:px-5"
                style={{
                  borderColor: `${lineage.accent}55`,
                  background: `linear-gradient(135deg, ${lineage.accentSoft}, transparent 70%)`,
                }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-md px-2 py-0.5 text-xs font-black tracking-[0.2em]"
                      style={{
                        color: lineage.accent,
                        background: "rgba(0,0,0,0.35)",
                        border: `1px solid ${lineage.accent}66`,
                      }}
                    >
                      {lineage.code}
                    </span>
                    <h3 className="text-lg font-black sm:text-xl">{lineage.name}</h3>
                    <span className="text-xs text-white/45">{auras.length}タイプ</span>
                  </div>
                  <p className="mt-1 text-sm text-white/70">{lineage.tagline}</p>
                </div>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {auras.map((aura, index) => (
                  <AuraEncyclopediaCard
                    key={aura.id}
                    aura={aura}
                    lineageCode={`${lineage.code}${String(index + 1).padStart(2, "0")}`}
                    lineageAccent={lineage.accent}
                    lineageAccentSoft={lineage.accentSoft}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showCta ? (
        <div className="flex justify-center px-1 pt-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="w-full max-w-md rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] hover:shadow-violet-300/30 sm:w-auto sm:px-8 sm:text-base"
            >
              あなたのオーラ結果を見る
            </Link>
          ) : (
            <AnonymousStartButton
              className="w-full max-w-md rounded-full bg-gradient-to-r from-violet-300 via-cyan-200 to-pink-300 px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition hover:scale-[1.02] hover:shadow-violet-300/30 disabled:opacity-60 sm:w-auto sm:px-8 sm:text-base"
              label="あなたのオーラは何色？ 友達に聞いてみる"
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
