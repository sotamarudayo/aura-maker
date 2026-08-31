"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import AuraBackground from "@/components/AuraBackground";
import AuraCard from "@/components/AuraCard";
import LinkAccountModal from "@/components/LinkAccountModal";
import { useLocale } from "@/components/LocaleProvider";
import SelfFriendGapCard from "@/components/SelfFriendGapCard";
import { calculateAuraType, type AuraCalculationResult, type AuraType } from "@/lib/constants/auras";
import { localizeAuraResult, localizeAuraType } from "@/lib/i18n/localize";
import type { ChemiParty } from "@/lib/chemi/calculate-chemi";
import type {
  DashboardFusionPartner,
  DashboardFusions,
} from "@/lib/fusion/load-dashboard-fusions";
import { trackEvent } from "@/lib/analytics";

const StoryExportModal = dynamic(() => import("@/components/StoryExportModal"), {
  ssr: false,
});

const ChemiExportModal = dynamic(() => import("@/components/ChemiExportModal"), {
  ssr: false,
});

const AuraEvolutionOverlay = dynamic(() => import("@/components/AuraEvolutionOverlay"), {
  ssr: false,
});

type VoteEntry = {
  word: string;
  isSelfVote: boolean;
};

type DashboardClientProps = {
  userId: string;
  initialDisplayName: string;
  initialVotes: VoteEntry[];
  initialIsAnonymous: boolean;
  initialFusions: DashboardFusions;
  fusionJustAccepted: boolean;
  siteUrl: string;
};

function buildCounts(words: string[]) {
  const map = new Map<string, number>();
  for (const word of words) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

export default function DashboardClient({
  userId,
  initialDisplayName,
  initialVotes,
  initialIsAnonymous,
  initialFusions,
  fusionJustAccepted,
  siteUrl,
}: DashboardClientProps) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [votes, setVotes] = useState<VoteEntry[]>(initialVotes);
  const [pulseActive, setPulseActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalPopTick, setTotalPopTick] = useState(0);
  const [lastVotedWord, setLastVotedWord] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialDisplayName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);
  const [chemiOpen, setChemiOpen] = useState(false);
  const [chemiPartyB, setChemiPartyB] = useState<ChemiParty | null>(null);
  const [fusions, setFusions] = useState(initialFusions);
  const [creatingFusion, setCreatingFusion] = useState(false);
  const [fusionError, setFusionError] = useState<string | null>(null);
  const [displayedAura, setDisplayedAura] = useState<AuraCalculationResult | null>(null);
  const [pendingAura, setPendingAura] = useState<AuraCalculationResult | null>(null);
  const pendingAuraRef = useRef<AuraCalculationResult | null>(null);
  const [evolutionMorphing, setEvolutionMorphing] = useState(false);
  const [morphFromAura, setMorphFromAura] = useState<AuraType | null>(null);
  const [morphFromCatchCopy, setMorphFromCatchCopy] = useState<string | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const wordTimerRef = useRef<number | null>(null);
  const voteUrl = `${siteUrl}/vote/${userId}`;

  useEffect(() => {
    setFusions(initialFusions);
  }, [initialFusions]);

  useEffect(() => {
    if (!fusionJustAccepted) return;
    setToastMessage("オーラ融合が完了しました！");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 2200);
  }, [fusionJustAccepted]);

  useEffect(() => {
    const channel = supabase
      .channel(`votes:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `target_user_id=eq.${userId}`,
        },
        (payload) => {
          const word = payload.new.word;
          const isSelfVote = payload.new.is_self_vote === true;
          if (typeof word === "string") {
            setVotes((prev) => [{ word, isSelfVote }, ...prev]);
            if (!isSelfVote) {
              setPulseActive(true);
              setToastMessage(`新しい投票が届きました！ (+${word})`);
              setTotalPopTick((prev) => prev + 1);
              setLastVotedWord(word);

              if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
              if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
              if (wordTimerRef.current) window.clearTimeout(wordTimerRef.current);

              pulseTimerRef.current = window.setTimeout(() => setPulseActive(false), 720);
              toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
              wordTimerRef.current = window.setTimeout(() => setLastVotedWord(null), 1200);
            }
          }
        },
      )
      .subscribe();

    return () => {
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (wordTimerRef.current) window.clearTimeout(wordTimerRef.current);
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const selfWords = useMemo(
    () => votes.filter((vote) => vote.isSelfVote).map((vote) => vote.word),
    [votes],
  );
  const friendWords = useMemo(
    () => votes.filter((vote) => !vote.isSelfVote).map((vote) => vote.word),
    [votes],
  );
  const auraWords = friendWords.length > 0 ? friendWords : selfWords;
  const rankingWords = friendWords.length > 0 ? friendWords : selfWords;

  const ranking = useMemo(() => buildCounts(rankingWords), [rankingWords]);
  const auraResult = useMemo(
    () => calculateAuraType(auraWords, { userId, displayName }),
    [auraWords, userId, displayName],
  );
  const auraSourceLabel =
    friendWords.length > 0
      ? t.aura.friendView
      : selfWords.length > 0
        ? t.aura.selfView
        : t.aura.waiting;

  useEffect(() => {
    if (!displayedAura) {
      setDisplayedAura(auraResult);
      return;
    }
    if (auraResult.aura.id === displayedAura.aura.id) {
      // 同じオーラでも票数増で文言・覚醒状態は更新
      if (!pendingAura) setDisplayedAura(auraResult);
      return;
    }
    if (pendingAura?.aura.id === auraResult.aura.id) return;
    setPendingAura(auraResult);
    pendingAuraRef.current = auraResult;
  }, [auraResult, displayedAura, pendingAura]);

  const baseAura = displayedAura ?? auraResult;
  const visibleAura = useMemo(
    () => localizeAuraResult(baseAura, locale),
    [baseAura, locale],
  );
  const localizedMorphFromAura = useMemo(
    () => (morphFromAura ? localizeAuraType(morphFromAura, locale) : null),
    [morphFromAura, locale],
  );
  const isAwakened = visibleAura.dynamicProfile.awakening.unlocked;

  const ownerParty: ChemiParty = useMemo(() => {
    return {
      displayName,
      aura: visibleAura.aura,
      topWords: visibleAura.topWords,
    };
  }, [visibleAura, displayName]);

  function openChemiWithPartner(partner: DashboardFusionPartner) {
    setChemiPartyB(partner.partnerParty);
    setChemiOpen(true);
    trackEvent("open_chemi_export", { source: "dashboard_fusion" });
  }

  function fusionInviteUrl(token: string) {
    return `${siteUrl}/fusion/${token}`;
  }

  async function createFusionLink() {
    setCreatingFusion(true);
    setFusionError(null);

    const response = await fetch("/api/fusion", {
      method: "POST",
      credentials: "include",
    });
    const payload = (await response.json().catch(() => null)) as
      | { inviteToken?: string; fusionId?: string; error?: string }
      | null;

    if (!response.ok || !payload?.inviteToken) {
      setFusionError(payload?.error ?? "融合リンクの作成に失敗しました。");
      setCreatingFusion(false);
      return;
    }

    await navigator.clipboard.writeText(fusionInviteUrl(payload.inviteToken));
    setToastMessage("融合リンクをコピーしました");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);

    trackEvent("create_fusion_link");
    setCreatingFusion(false);
    router.refresh();
  }

  const palette = visibleAura.aura.palette;
  const maxCount = ranking[0]?.[1] ?? 1;

  async function copyVoteUrlOnly() {
    await navigator.clipboard.writeText(voteUrl);
    trackEvent("copy_vote_url", { with_message: false });
    setToastMessage("投票URLだけコピーしました");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
  }

  async function copyServiceUrl() {
    await navigator.clipboard.writeText(siteUrl);
    trackEvent("copy_service_url", { source: "dashboard" });
    setToastMessage("サイト紹介URLをコピーしました");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
  }

  async function saveDisplayName() {
    const trimmed = nameInput.trim();

    if (trimmed.length < 1 || trimmed.length > 20) {
      setNameError("表示名は1〜20文字で入力してください。");
      return;
    }

    setNameError(null);
    setIsSavingName(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("id", userId);

    if (error) {
      setNameError(error.message);
      setIsSavingName(false);
      return;
    }

    setDisplayName(trimmed);
    setNameInput(trimmed);
    setIsEditingName(false);
    setIsSavingName(false);
    setToastMessage("名前を変更しました");

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
  }

  async function handleAccountLinked() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsAnonymous(user?.is_anonymous ?? false);
    setLinkModalOpen(false);
    setToastMessage("アカウントを連携しました");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-6 text-white sm:py-8 md:px-8">
      <AuraBackground palette={palette} pulse={pulseActive} />

      <LinkAccountModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onLinked={handleAccountLinked}
      />

      <StoryExportModal
        open={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
        displayName={displayName}
        aura={visibleAura.aura}
        profile={visibleAura.dynamicProfile}
        catchCopy={visibleAura.personalizedCatchCopy}
        topWords={visibleAura.topWords}
        onSaved={() => {
          setToastMessage("画像を保存しました！");
          if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
          toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
        }}
      />

      {pendingAura && displayedAura ? (
        <AuraEvolutionOverlay
          fromAura={morphFromAura ?? displayedAura.aura}
          toAura={pendingAura.aura}
          onReveal={() => {
            const next = pendingAuraRef.current;
            if (!next) return;
            setMorphFromAura(displayedAura.aura);
            setMorphFromCatchCopy(displayedAura.personalizedCatchCopy);
            setEvolutionMorphing(true);
            setDisplayedAura(next);
          }}
          onComplete={() => {
            const next = pendingAuraRef.current;
            setToastMessage(
              next?.aura.rarity === "secret"
                ? "シークレットオーラが覚醒した！"
                : "オーラが進化した！",
            );
            pendingAuraRef.current = null;
            setPendingAura(null);
            setEvolutionMorphing(false);
            setMorphFromAura(null);
            setMorphFromCatchCopy(null);
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
            toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 2200);
          }}
        />
      ) : null}

      {chemiPartyB ? (
        <ChemiExportModal
          open={chemiOpen}
          onClose={() => {
            setChemiOpen(false);
            setChemiPartyB(null);
          }}
          partyA={ownerParty}
          partyB={chemiPartyB}
          siteUrl={siteUrl}
          onSaved={() => {
            setToastMessage("ケミカードを保存しました！");
            if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
            toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
          }}
        />
      ) : null}

      {toastMessage ? (
        <div className="pointer-events-none fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full border border-violet-300/50 bg-black/70 px-5 py-2 text-sm font-semibold text-violet-100 shadow-xl backdrop-blur vote-toast">
          {toastMessage}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-6">
        {isAnonymous ? (
          <section className="rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/10 p-3 backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-amber-100">
                ゲスト利用中：結果を残すならアカウント連携を
              </p>
              <button
                type="button"
                onClick={() => {
                  trackEvent("open_link_account");
                  setLinkModalOpen(true);
                }}
                className="shrink-0 rounded-full bg-amber-200 px-4 py-2 text-sm font-bold text-black"
              >
                アカウントを連携
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 backdrop-blur">
            <p className="text-xs text-emerald-100 sm:text-sm">
              <span className="mr-2 rounded-full bg-emerald-300 px-2 py-0.5 text-[10px] font-bold text-black">
                保護済み
              </span>
              アカウント連携済み。投票データは保存されています。
            </p>
          </section>
        )}

        <div className="flex justify-center">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white/75">
            表示中: {auraSourceLabel}
          </span>
        </div>

        <AuraCard
          aura={visibleAura.aura}
          catchCopy={visibleAura.personalizedCatchCopy}
          profile={visibleAura.dynamicProfile}
          topWords={visibleAura.topWords}
          hasVotes={auraWords.length > 0}
          pulse={pulseActive}
          displayName={displayName}
          awakened={isAwakened}
          evolutionPending={Boolean(pendingAura)}
          evolutionMorphing={evolutionMorphing}
          morphFromAura={localizedMorphFromAura}
          morphFromCatchCopy={morphFromCatchCopy}
        />

        {selfWords.length > 0 && friendWords.length > 0 ? (
          <SelfFriendGapCard
            displayName={displayName}
            userId={userId}
            selfWords={selfWords}
            friendWords={friendWords}
          />
        ) : null}

        <section className="min-w-0 rounded-2xl border border-violet-300/35 bg-black/40 p-4 backdrop-blur sm:p-6">
          <h2 className="text-xl font-bold">シェアして投票を集めよう</h2>
          <p className="mt-1 text-sm text-white/70">
            結果は画像、投票募集はURL。友達に見せるなら画像シェアが確実です。
          </p>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => {
                trackEvent("open_story_export", { source: "dashboard_main" });
                setStoryModalOpen(true);
              }}
              className="min-h-[3.5rem] rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-5 text-lg font-black leading-snug text-black shadow-lg sm:min-h-[4rem] sm:text-xl"
            >
              📸 結果を画像でシェア
            </button>
            <button
              type="button"
              onClick={copyVoteUrlOnly}
              className="min-h-[3.5rem] rounded-2xl border-2 border-cyan-200/80 bg-cyan-400 px-5 py-5 text-lg font-black leading-snug text-black shadow-lg sm:min-h-[4rem] sm:text-xl"
            >
              投票URLをコピー
            </button>
            <button
              type="button"
              onClick={copyServiceUrl}
              className="min-h-[3.5rem] rounded-2xl border border-emerald-200/70 bg-emerald-300 px-5 py-5 text-lg font-black leading-snug text-black shadow-lg sm:min-h-[4rem] sm:text-xl"
            >
              サイト紹介URLをコピー
            </button>
          </div>
        </section>

        <header className="min-w-0 rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 break-words text-lg font-black sm:text-xl">表示名の編集</h1>
            {!isEditingName ? (
              <button
                type="button"
                onClick={() => {
                  setNameInput(displayName);
                  setNameError(null);
                  setIsEditingName(true);
                }}
                className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-sm"
              >
                ✏️ 編集
              </button>
            ) : null}
          </div>

          {isEditingName ? (
            <div className="mt-3 rounded-xl border border-white/20 bg-white/10 p-3">
              <label className="mb-2 block text-sm text-white/80">表示名（1〜20文字）</label>
              <div className="flex flex-col gap-2 md:flex-row">
                <input
                  value={nameInput}
                  maxLength={20}
                  onChange={(event) => setNameInput(event.target.value)}
                  className="w-full rounded-lg border border-white/25 bg-black/40 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveDisplayName}
                    disabled={isSavingName}
                    className="rounded-lg bg-violet-300 px-4 py-2 text-sm font-semibold text-black disabled:opacity-70"
                  >
                    {isSavingName ? "保存中..." : "保存"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(displayName);
                      setNameError(null);
                      setIsEditingName(false);
                    }}
                    className="rounded-lg border border-white/35 px-4 py-2 text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
              {nameError ? <p className="mt-2 text-sm text-rose-300">{nameError}</p> : null}
            </div>
          ) : (
            <p className="mt-2 text-sm text-white/65">{displayName}</p>
          )}
        </header>

        <div className="flex justify-center">
          <Link
            href="/auras"
            className="rounded-full border border-violet-300/40 bg-violet-500/15 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25"
          >
            ✨ 全オーラ一覧（図鑑）を見る
          </Link>
        </div>

        <section className="rounded-2xl border border-fuchsia-300/30 bg-black/35 p-4 backdrop-blur sm:p-6">
          <p className="font-display text-2xl text-fuchsia-200 sm:text-3xl">Aura Fusion</p>
          <h2 className="mt-2 text-xl font-bold">友達とオーラ融合</h2>
          <p className="mt-1 text-sm text-white/65">
            お互いの本物のオーラ診断が揃うと、融合ケミカードが作れます。リンクを友達に送ってね。
          </p>

          <button
            type="button"
            onClick={createFusionLink}
            disabled={creatingFusion}
            className="mt-4 inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black disabled:opacity-70 sm:text-base"
          >
            {creatingFusion ? "リンク作成中..." : "✨ 融合リンクを作成してコピー"}
          </button>
          {fusionError ? <p className="mt-2 text-sm text-rose-300">{fusionError}</p> : null}

          {fusions.partners.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-white/85">融合済みの友達</h3>
              <ul className="mt-3 space-y-3">
                {fusions.partners.map((partner) => (
                  <li
                    key={partner.fusionId}
                    className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{partner.partnerDisplayName}</p>
                      <p className="mt-1 text-sm text-white/60">{partner.partnerArchetypeName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openChemiWithPartner(partner)}
                      className="shrink-0 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-4 py-2.5 text-sm font-black text-black"
                    >
                      ✨ ケミカードを作る
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/20 bg-black/35 p-6 backdrop-blur">
            <h2 className="text-xl font-bold">ランキング</h2>
            <p className="mt-1 text-sm text-white/70">
              {friendWords.length > 0 ? "友達からの投票" : "自己診断"}の集計 · 総投票数:{" "}
              <span key={totalPopTick} className="vote-pop font-semibold text-violet-200">
                {rankingWords.length}
              </span>
              {friendWords.length > 0 && selfWords.length > 0 ? (
                <span className="text-white/50">（うち友達 {friendWords.length} / 自己 {selfWords.length}）</span>
              ) : null}
            </p>
            <ul className="mt-4 space-y-2">
              {ranking.slice(0, 10).map(([word, count], index) => (
                <li
                  key={word}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-white/10 px-3 py-2"
                >
                  <span className="min-w-0 truncate">
                    {index + 1}. {word}
                  </span>
                  <span
                    className={`shrink-0 font-semibold tabular-nums ${lastVotedWord === word ? "vote-pop text-cyan-200" : ""}`}
                  >
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="min-w-0 rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur sm:p-6">
            <h2 className="text-xl font-bold">Word Cloud</h2>
            <div className="mt-4 flex min-h-52 min-w-0 flex-wrap items-center justify-center gap-2 overflow-x-clip sm:gap-3">
              {ranking.map(([word, count]) => {
                const ratio = count / maxCount;
                const lengthPenalty = Math.min(0.4, Math.max(0, (word.length - 4) * 0.045));
                const idealRem = Math.max(0.82, 0.9 + ratio * 1.05 - lengthPenalty);
                const maxRem = word.length >= 7 ? 1.15 : word.length >= 5 ? 1.28 : 1.45;
                return (
                  <span
                    key={word}
                    style={{
                      fontSize: `clamp(0.75rem, ${idealRem}rem, ${maxRem}rem)`,
                    }}
                    className={`inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-full bg-white/15 px-2.5 py-1.5 text-center font-semibold leading-none tracking-tight sm:px-3 ${
                      lastVotedWord === word ? "vote-pop border border-cyan-200/70" : ""
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
              {ranking.length === 0 ? (
                <p className="text-white/70">まだ集計できる投票がありません。</p>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
