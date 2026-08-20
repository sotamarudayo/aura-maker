import Link from "next/link";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraEncyclopediaCard from "@/components/AuraEncyclopediaCard";
import { AURA_TYPES } from "@/lib/constants/auras";

type AuraEncyclopediaSectionProps = {
  showCta?: boolean;
  isLoggedIn?: boolean;
};

export default function AuraEncyclopediaSection({
  showCta = true,
  isLoggedIn = false,
}: AuraEncyclopediaSectionProps) {
  return (
    <section id="auras" className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-[0.25em] text-violet-200">AURA ENCYCLOPEDIA</p>
        <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
          全{AURA_TYPES.length}種類のオーラを発見しよう
        </h2>
        <p className="mx-auto mt-3 max-w-2xl px-1 text-sm text-white/75 sm:text-base">
          16Personalitiesのように、あなたの印象ワードの組み合わせで決まるオーラタイプ。
          友だちに投票してもらい、あなただけの色を見つけましょう。
        </p>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {AURA_TYPES.map((aura) => (
          <AuraEncyclopediaCard key={aura.id} aura={aura} />
        ))}
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
