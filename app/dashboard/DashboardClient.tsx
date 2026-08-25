"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import AuraBackground from "@/components/AuraBackground";
import AuraCard from "@/components/AuraCard";
import LinkAccountModal from "@/components/LinkAccountModal";
import StoryExportModal from "@/components/StoryExportModal";
import { calculateAuraType } from "@/lib/constants/auras";
import {
  buildServiceShareUrls,
  buildVoteInviteSharePayload,
  buildVoteInviteShareUrls,
  SERVICE_SHARE_TEXT,
} from "@/lib/constants/share";
import { trackEvent } from "@/lib/analytics";

type DashboardClientProps = {
  userId: string;
  initialDisplayName: string;
  initialWords: string[];
  initialIsAnonymous: boolean;
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
  initialWords,
  initialIsAnonymous,
  siteUrl,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isAnonymous, setIsAnonymous] = useState(initialIsAnonymous);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [words, setWords] = useState<string[]>(initialWords);
  const [pulseActive, setPulseActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [totalPopTick, setTotalPopTick] = useState(0);
  const [lastVotedWord, setLastVotedWord] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialDisplayName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);
  const pulseTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const wordTimerRef = useRef<number | null>(null);
  const voteUrl = `${siteUrl}/vote/${userId}`;
  const serviceShareUrls = useMemo(() => buildServiceShareUrls(siteUrl), [siteUrl]);

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
          if (typeof word === "string") {
            setWords((prev) => [word, ...prev]);
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

  const ranking = useMemo(() => buildCounts(words), [words]);
  const auraResult = useMemo(
    () => calculateAuraType(words, { userId, displayName }),
    [words, userId, displayName],
  );
  const palette = auraResult.aura.palette;
  const maxCount = ranking[0]?.[1] ?? 1;
  const resultShareText = auraResult.dynamicProfile.shareLine;
  const encodedResultShareText = encodeURIComponent(resultShareText);
  const encodedVoteUrl = encodeURIComponent(voteUrl);
  const resultTwitterUrl = `https://twitter.com/intent/tweet?text=${encodedResultShareText}&url=${encodedVoteUrl}`;
  const resultLineUrl = `https://line.me/R/msg/text/?${encodedResultShareText}%0A${encodedVoteUrl}`;
  const voteInviteText = buildVoteInviteSharePayload(displayName, voteUrl);
  const voteInviteShareUrls = buildVoteInviteShareUrls(displayName, voteUrl);

  async function copyVoteInvite() {
    await navigator.clipboard.writeText(voteInviteText);
    trackEvent("copy_vote_url", { with_message: true });
    setToastMessage("投票のお願い文＋URLをコピーしました");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
  }

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
    setToastMessage("サイトのURLをコピーしました！");
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
  }

  async function copyShareLine() {
    await navigator.clipboard.writeText(auraResult.dynamicProfile.shareLine);
    trackEvent("copy_share_line");
    setToastMessage("シェア文をコピーしました！");
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
        aura={auraResult.aura}
        profile={auraResult.dynamicProfile}
        topWords={auraResult.topWords}
        onSaved={() => {
          setToastMessage("画像を保存しました！");
          if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
          toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 1800);
        }}
      />

      {toastMessage ? (
        <div className="pointer-events-none fixed left-1/2 top-6 z-30 -translate-x-1/2 rounded-full border border-violet-300/50 bg-black/70 px-5 py-2 text-sm font-semibold text-violet-100 shadow-xl backdrop-blur vote-toast">
          {toastMessage}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl space-y-6">
        {isAnonymous ? (
          <section className="rounded-2xl border border-amber-300/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/10 p-5 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="font-semibold text-amber-100">
                  ⚠️ ゲスト利用中：ブラウザを閉じるとデータが消える可能性があります。結果を永久保存する
                </p>
                <p className="text-sm text-white/75">
                  🔔 誰かが投票した時の通知を受け取る（アカウント連携後に利用可能）
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  trackEvent("open_link_account");
                  setLinkModalOpen(true);
                }}
                className="shrink-0 rounded-full bg-amber-200 px-5 py-2.5 text-sm font-bold text-black"
              >
                アカウントを連携して保存
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-black">
                保護済み
              </span>
              <p className="text-sm text-emerald-100">
                アカウント連携済み。投票データは安全に保存されています。
              </p>
            </div>
          </section>
        )}

        <AuraCard
          aura={auraResult.aura}
          catchCopy={auraResult.personalizedCatchCopy}
          profile={auraResult.dynamicProfile}
          topWords={auraResult.topWords}
          hasVotes={ranking.length > 0}
          pulse={pulseActive}
        />

        <header className="min-w-0 rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 break-words text-xl font-black sm:text-2xl">
              {displayName} さんのダッシュボード
            </h1>
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
          ) : null}
        </header>

        <section className="min-w-0 rounded-2xl border border-violet-300/35 bg-black/40 p-4 backdrop-blur sm:p-6">
          <h2 className="text-xl font-bold">シェア</h2>
          <p className="mt-1 text-sm text-white/70">
            投票を集めて結果を伸ばすなら、ここだけでOK。
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-violet-100">1. 投票をお願いする</p>
              <p className="mt-1 text-xs text-white/55">
                説明文つきがおすすめ。すでに説明済みならURLだけでもOK。
              </p>
              <p className="mt-3 whitespace-pre-line break-words rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/80">
                {voteInviteText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyVoteInvite}
                  className="rounded-full bg-violet-300 px-4 py-2 text-sm font-bold text-black"
                >
                  お願い文＋URLをコピー
                </button>
                <button
                  type="button"
                  onClick={copyVoteUrlOnly}
                  className="rounded-full bg-cyan-300/90 px-4 py-2 text-sm font-bold text-black"
                >
                  URLだけコピー
                </button>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                  href={voteInviteShareUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_vote_invite", { channel: "x" })}
                >
                  Xでお願い
                </a>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                  href={voteInviteShareUrls.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_vote_invite", { channel: "line" })}
                >
                  LINEでお願い
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-100">2. 自分の結果をシェア</p>
              <p className="mt-2 whitespace-pre-line break-words rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/80">
                {resultShareText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStoryModalOpen(true)}
                  className="rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-4 py-2 text-sm font-bold text-black"
                >
                  📸 画像でシェア
                </button>
                <button
                  type="button"
                  onClick={copyShareLine}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold"
                >
                  シェア文をコピー
                </button>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm"
                  href={resultTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_result", { channel: "x" })}
                >
                  Xで共有
                </a>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm"
                  href={resultLineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_result", { channel: "line" })}
                >
                  LINEで共有
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-100">3. サイト自体を紹介する</p>
              <p className="mt-1 text-xs text-white/60">{SERVICE_SHARE_TEXT}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyServiceUrl}
                  className="rounded-full bg-cyan-200 px-4 py-2 text-sm font-bold text-black"
                >
                  サイトURLをコピー
                </button>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm"
                  href={serviceShareUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_service", { channel: "x" })}
                >
                  Xで紹介
                </a>
                <a
                  className="rounded-full bg-white/15 px-4 py-2 text-sm"
                  href={serviceShareUrls.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("share_service", { channel: "line" })}
                >
                  LINEで紹介
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Link
            href="/auras"
            className="rounded-full border border-violet-300/40 bg-violet-500/15 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25"
          >
            ✨ 全オーラ一覧（図鑑）を見る
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/20 bg-black/35 p-6 backdrop-blur">
            <h2 className="text-xl font-bold">ランキング</h2>
            <p className="mt-1 text-sm text-white/70">
              総投票数:{" "}
              <span key={totalPopTick} className="vote-pop font-semibold text-violet-200">
                {words.length}
              </span>
            </p>
            <ul className="mt-4 space-y-2">
              {ranking.slice(0, 10).map(([word, count], index) => (
                <li key={word} className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                  <span>
                    {index + 1}. {word}
                  </span>
                  <span
                    className={`font-semibold ${lastVotedWord === word ? "vote-pop text-cyan-200" : ""}`}
                  >
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-white/20 bg-black/35 p-6 backdrop-blur">
            <h2 className="text-xl font-bold">Word Cloud</h2>
            <div className="mt-4 flex min-h-52 flex-wrap items-center gap-3">
              {ranking.map(([word, count]) => {
                const size = 0.95 + (count / maxCount) * 1.4;
                return (
                  <span
                    key={word}
                    style={{ fontSize: `${size}rem` }}
                    className={`rounded-full bg-white/15 px-3 py-1 font-semibold ${
                      lastVotedWord === word ? "vote-pop border border-cyan-200/70" : ""
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
              {ranking.length === 0 ? (
                <p className="text-white/70">まだ投票がありません。上の投票URLをシェアしてみましょう。</p>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
