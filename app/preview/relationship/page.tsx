"use client";

import { useMemo, useState } from "react";
import ChemiExportModal from "@/components/ChemiExportModal";
import RelationshipFacesCard from "@/components/RelationshipFacesCard";
import { buildChemiParty } from "@/lib/chemi/build-party";
import { calculateChemi } from "@/lib/chemi/calculate-chemi";
import { CHEMI_RELATIONSHIP_IDS } from "@/lib/chemi/relationship-diagnosis";
import { useLocale } from "@/components/LocaleProvider";
import type { VoteRelationship } from "@/lib/votes/relationship";
import type { RelationshipFaceGroup } from "@/lib/votes/relationship-faces";

const YOU = {
  displayName: "かたくり",
  words: ["kyorikan-bug", "iyashi-waku", "mysterious"],
};

const PARTNERS = [
  {
    id: "taro",
    displayName: "太郎",
    words: ["youkya-vibes", "tensai-baka", "shinya-tension"],
    blurb: "陽キャ × 深夜テンション",
  },
  {
    id: "hana",
    displayName: "ハナ",
    words: ["iyashi-waku", "minus-ion", "tayoreru-aibo"],
    blurb: "癒やし × 空気清浄",
  },
  {
    id: "rei",
    displayName: "レイ",
    words: ["mysterious", "chiseiha", "gainen"],
    blurb: "ミステリアス × 知性派",
  },
  {
    id: "yuu",
    displayName: "ユウ",
    words: ["genkai-otaku", "kusa-fukahi", "gap-no-oni"],
    blurb: "オタク × ギャップ",
  },
] as const;

const SAMPLE_FACES: RelationshipFaceGroup[] = [
  {
    relationship: "close_friend" satisfies VoteRelationship,
    words: ["tensai-baka", "youkya-vibes", "kusa-fukahi", "tensai-baka"],
  },
  {
    relationship: "partner",
    words: ["jitsuwa-sabishigari", "iyashi-waku", "tsundere"],
  },
  {
    relationship: "coworker",
    words: ["tayoreru-aibo", "chiseiha", "kuuki-seijouki"],
  },
];

/**
 * 関係性診断の確認用。
 * /preview/relationship
 */
export default function RelationshipPreviewPage() {
  const { locale, t } = useLocale();
  const you = useMemo(() => buildChemiParty(YOU.displayName, [...YOU.words], "preview-you"), []);
  const partners = useMemo(
    () =>
      PARTNERS.map((partner) => ({
        ...partner,
        party: buildChemiParty(partner.displayName, [...partner.words], `preview-${partner.id}`),
      })),
    [],
  );

  const [openId, setOpenId] = useState<string | null>(null);
  const openPartner = partners.find((item) => item.id === openId) ?? null;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="text-center">
          <p className="font-display text-2xl text-violet-200 sm:text-3xl">Preview</p>
          <h1 className="mt-2 text-2xl font-black">関係性診断プレビュー</h1>
          <p className="mt-2 text-sm text-white/60">
            ログイン不要。ダミーの二人で関係タイプ・役割・ストーリーを確認できます。
          </p>
        </div>

        <section className="rounded-2xl border border-white/15 bg-black/40 p-4 sm:p-6">
          <p className="text-xs font-bold tracking-[0.22em] text-white/45">YOU</p>
          <p className="mt-1 text-xl font-black">{you.displayName}</p>
          <p className="mt-1 text-sm text-white/70">{you.aura.archetypeName}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black">融合相手を選んでカードを見る</h2>
          <ul className="space-y-3">
            {partners.map((partner) => {
              const chemi = calculateChemi(you, partner.party, locale);
              return (
                <li
                  key={partner.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{partner.displayName}</p>
                    <p className="mt-1 text-sm text-white/60">{partner.party.aura.archetypeName}</p>
                    <p className="mt-1 text-sm font-black text-fuchsia-200">
                      {chemi.relationship.typeName}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{partner.blurb}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(partner.id)}
                    className="shrink-0 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-4 py-2.5 text-sm font-black text-black"
                  >
                    {t.dashboard.makeChemiCard}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <RelationshipFacesCard displayName={you.displayName} userId="preview-you" faces={SAMPLE_FACES} />

        <p className="text-center text-xs text-white/40">
          タイプ一覧: {CHEMI_RELATIONSHIP_IDS.join(" / ")}
        </p>
      </div>

      {openPartner ? (
        <ChemiExportModal
          open
          onClose={() => setOpenId(null)}
          partyA={you}
          partyB={openPartner.party}
          siteUrl="http://localhost:3000"
        />
      ) : null}
    </main>
  );
}
