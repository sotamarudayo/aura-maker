"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toPng } from "html-to-image";
import type { AuraType, DynamicAuraProfile } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";
import { trackEvent } from "@/lib/analytics";

type ExportFormat = "story" | "card";

type StoryExportModalProps = {
  open: boolean;
  onClose: () => void;
  displayName: string;
  aura: AuraType;
  profile: DynamicAuraProfile;
  catchCopy: string;
  topWords: string[];
  onSaved?: () => void;
};

const STAT_META = [
  { key: "social" as const, label: "社交", color: "#fbbf24" },
  { key: "neta" as const, label: "ネタ", color: "#e879f9" },
  { key: "mystic" as const, label: "神秘", color: "#818cf8" },
  { key: "heal" as const, label: "癒し", color: "#6ee7b7" },
  { key: "gap" as const, label: "ギャップ", color: "#22d3ee" },
];

function ExportBrandFooter({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ paddingTop: compact ? 2 : 4, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mark.png"
          alt=""
          width={compact ? 18 : 22}
          height={compact ? 18 : 22}
          style={{
            borderRadius: "50%",
            display: "block",
            width: compact ? 18 : 22,
            height: compact ? 18 : 22,
          }}
        />
        <p
          style={{
            fontSize: compact ? 9 : 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.45)",
            margin: 0,
          }}
        >
          AuraMaker
        </p>
      </div>
      <p
        style={{
          marginTop: 3,
          marginBottom: 0,
          fontSize: 8,
          color: "rgba(255,255,255,0.28)",
        }}
      >
        友達から見たオーラ診断
      </p>
    </div>
  );
}

function StoryOrb({
  palette,
  size = 145,
}: {
  palette: AuraType["palette"];
  size?: number;
}) {
  const glow = size + 52;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        margin: "10px auto 0",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: glow + 28,
          height: glow + 28,
          marginLeft: -(glow + 28) / 2,
          marginTop: -(glow + 28) / 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.a}cc 0%, ${palette.b}66 38%, ${palette.c}33 58%, transparent 74%)`,
          filter: "blur(16px)",
          opacity: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: glow,
          height: glow,
          marginLeft: -glow / 2,
          marginTop: -glow / 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.a}88 0%, ${palette.b}44 45%, transparent 70%)`,
          filter: "blur(8px)",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          background: `
            radial-gradient(circle at 32% 28%, ${palette.a} 0%, transparent 48%),
            radial-gradient(circle at 74% 40%, ${palette.b} 0%, transparent 50%),
            radial-gradient(circle at 50% 78%, ${palette.c} 0%, transparent 52%),
            linear-gradient(160deg, #16112a 0%, #0a0818 100%)
          `,
          boxShadow: `
            inset 0 0 22px rgba(255,255,255,0.16),
            0 0 36px ${palette.a}88,
            0 0 64px ${palette.b}55
          `,
        }}
      />
    </div>
  );
}

function MiniStatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 42, fontSize: 9, color: "rgba(255,255,255,0.7)", flexShrink: 0 }}>
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
      <span
        style={{
          width: 22,
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.85)",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function StoryExportModal({
  open,
  onClose,
  displayName,
  aura,
  profile,
  catchCopy,
  topWords,
  onSaved,
}: StoryExportModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<ExportFormat>("story");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const words = topWords.slice(0, 3);

  async function exportPng(): Promise<string | null> {
    if (!canvasRef.current) return null;
    return toPng(canvasRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#05030b",
      style: { isolation: "isolate" },
    });
  }

  async function handleDownload(dataUrl?: string) {
    const url = dataUrl ?? (await exportPng());
    if (!url) throw new Error("画像の生成に失敗しました");

    const link = document.createElement("a");
    link.download =
      format === "story" ? "my_aura_story.png" : "my_aura_result.png";
    link.href = url;
    link.click();
    trackEvent("export_result_image", { format, method: "download" });
    onSaved?.();
  }

  async function handleNativeShare() {
    if (exporting) return;
    setExporting(true);
    setError(null);

    try {
      const dataUrl = await exportPng();
      if (!dataUrl) throw new Error("画像の生成に失敗しました");

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "my_aura_result.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${displayName}のオーラ診断`,
          text: profile.shareLine,
        });
        trackEvent("export_result_image", { format, method: "native_share" });
        onSaved?.();
      } else {
        await handleDownload(dataUrl);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "シェアに失敗しました";
      setError(message);
    } finally {
      setExporting(false);
    }
  }

  const canvasSize =
    format === "story"
      ? { width: 300, height: 533 }
      : { width: 360, height: 640 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/20 bg-zinc-950 p-5 text-white shadow-2xl md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">結果を画像でシェア</h2>
            <p className="mt-1 text-sm text-white/70">
              診断結果カードを画像でシェア。Instagram / X / LINE にそのまま投稿できます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/25 px-2 py-1 text-sm text-white/80"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setFormat("story")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              format === "story" ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            ストーリー（9:16）
          </button>
          <button
            type="button"
            onClick={() => setFormat("card")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              format === "card" ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            結果カード（詳細）
          </button>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            ref={canvasRef}
            className="relative overflow-hidden rounded-xl"
            style={
              {
                width: canvasSize.width,
                height: canvasSize.height,
                "--story-a": aura.palette.a,
                "--story-b": aura.palette.b,
                "--story-c": aura.palette.c,
                background: `
                  radial-gradient(circle at 28% 12%, ${aura.palette.a}99 0%, transparent 40%),
                  radial-gradient(circle at 78% 22%, ${aura.palette.b}88 0%, transparent 38%),
                  radial-gradient(circle at 50% 70%, ${aura.palette.c}55 0%, transparent 46%),
                  linear-gradient(165deg, #05030b 0%, #120b2f 45%, #05030b 100%)
                `,
                fontFamily:
                  '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif',
              } as CSSProperties
            }
          >
            {format === "story" ? (
              <StoryLayout
                displayName={displayName}
                aura={aura}
                specialMove={profile.specialMove}
                stats={profile.stats}
                palette={aura.palette}
              />
            ) : (
              <CardLayout
                displayName={displayName}
                aura={aura}
                profile={profile}
                catchCopy={catchCopy}
                words={words}
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-6 py-3 text-sm font-bold text-black disabled:opacity-70"
            >
              {exporting ? (
                <>
                  <span className="story-export-spinner inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black" />
                  生成中...
                </>
              ) : (
                "📤 端末でシェア"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80"
            >
              閉じる
            </button>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}

function StoryLayout({
  displayName,
  aura,
  specialMove,
  stats,
  palette,
}: {
  displayName: string;
  aura: AuraType;
  specialMove: string;
  stats: DynamicAuraProfile["stats"];
  palette: AuraType["palette"];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* コンテンツ領域（下部15%はリンクスタンプ用に空ける） */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "85%",
          padding: "18px 16px 6px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: "rgba(233,213,255,0.9)",
              fontWeight: 700,
            }}
          >
            My Aura is...
          </p>
          <p
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {displayName}
          </p>
        </div>

        <StoryOrb palette={palette} size={140} />

        <div style={{ marginTop: 6, textAlign: "center", flexShrink: 0 }}>
          <span
            style={{
              display: "inline-block",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              padding: "2px 10px",
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            {RARITY_LABELS[aura.rarity]}
          </span>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            通り名
          </p>
          <h3
            style={{
              marginTop: 2,
              marginBottom: 0,
              fontSize: 36,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#fff",
              textShadow: `0 0 28px ${palette.a}cc, 0 0 48px ${palette.b}66`,
            }}
          >
            {aura.archetypeName}
          </h3>
          <p
            style={{
              marginTop: 3,
              marginBottom: 0,
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {aura.name}
          </p>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.35,
              color: "rgba(165,243,252,0.95)",
            }}
          >
            {aura.catchCopy}
          </p>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              fontSize: 13,
              fontWeight: 800,
              lineHeight: 1.3,
              color: "rgba(244,114,182,0.98)",
            }}
          >
            💥「{specialMove}」
          </p>
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            padding: "8px 10px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {STAT_META.map((stat) => (
              <MiniStatBar
                key={stat.key}
                label={stat.label}
                value={stats[stat.key]}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 4 }}>
          <ExportBrandFooter compact />
        </div>
      </div>

      {/* Instagramリンクスタンプ用の下部余白（約15%） */}
      <div
        style={{
          height: "15%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          borderTop: "1px dashed rgba(255,255,255,0.12)",
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.22) 100%)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          ここにリンクを配置 👇
        </p>
      </div>
    </div>
  );
}

function CardLayout({
  displayName,
  aura,
  profile,
  catchCopy,
  words,
}: {
  displayName: string;
  aura: AuraType;
  profile: DynamicAuraProfile;
  catchCopy: string;
  words: string[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "22px 18px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: "0.2em",
            fontWeight: 700,
            color: "rgba(196,181,253,0.95)",
          }}
        >
          AURA RESULT
        </p>
        <p style={{ marginTop: 4, marginBottom: 0, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
          {displayName}
        </p>
      </div>

      <StoryOrb palette={aura.palette} size={128} />

      <div style={{ marginTop: 10, textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <span
            style={{
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.1)",
              padding: "2px 8px",
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            {RARITY_LABELS[aura.rarity]}
          </span>
          {profile.confidence !== "stable" ? (
            <span
              style={{
                borderRadius: 999,
                border:
                  profile.confidence === "provisional"
                    ? "1px solid rgba(252,211,77,0.5)"
                    : "1px solid rgba(103,232,249,0.4)",
                background:
                  profile.confidence === "provisional"
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(6,182,212,0.15)",
                padding: "2px 8px",
                fontSize: 9,
                fontWeight: 700,
                color:
                  profile.confidence === "provisional"
                    ? "rgba(254,243,199,0.95)"
                    : "rgba(207,250,254,0.95)",
              }}
            >
              {profile.confidence === "provisional" ? "暫定" : "育ち中"}
            </span>
          ) : null}
        </div>

        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          通り名
        </p>
        <h3
          style={{
            marginTop: 4,
            marginBottom: 0,
            fontSize: 32,
            fontWeight: 900,
            lineHeight: 1.08,
            color: "#fff",
            textShadow: `0 0 24px ${aura.palette.a}aa`,
          }}
        >
          {aura.archetypeName}
        </h3>
        <p
          style={{
            marginTop: 4,
            marginBottom: 0,
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {aura.name}
        </p>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.4,
            color: "rgba(165,243,252,0.95)",
          }}
        >
          {catchCopy}
        </p>
      </div>

      <div
        style={{
          marginTop: 12,
          borderRadius: 10,
          border: "1px solid rgba(244,114,182,0.35)",
          background: "rgba(236,72,153,0.12)",
          padding: "10px 12px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "rgba(251,207,232,0.9)" }}>
          💥 必殺技
        </p>
        <p
          style={{
            marginTop: 4,
            marginBottom: 0,
            fontSize: 14,
            fontWeight: 800,
            color: "#fce7f3",
          }}
        >
          「{profile.specialMove}」
        </p>
      </div>

      <div
        style={{
          marginTop: 10,
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.05)",
          padding: "10px 12px",
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 9,
            fontWeight: 700,
            color: "rgba(196,181,253,0.9)",
          }}
        >
          ステータス
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STAT_META.map((stat) => (
            <MiniStatBar
              key={stat.key}
              label={stat.label}
              value={profile.stats[stat.key]}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {(words.length > 0 ? words : ["覚醒待ち"]).map((word) => (
          <span
            key={word}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 700,
              color: "#f5f3ff",
            }}
          >
            #{word}
          </span>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        <ExportBrandFooter />
      </div>
    </div>
  );
}
