"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toPng } from "html-to-image";
import { calculateChemi, type ChemiParty } from "@/lib/chemi/calculate-chemi";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";
import { trackEvent } from "@/lib/analytics";

type ChemiExportModalProps = {
  open: boolean;
  onClose: () => void;
  partyA: ChemiParty;
  partyB: ChemiParty;
  siteUrl: string;
  onSaved?: () => void;
};

function ExportBrandFooter() {
  return (
    <div style={{ paddingTop: 4, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mark.png"
          alt=""
          width={18}
          height={18}
          style={{ borderRadius: "50%", display: "block", width: 18, height: 18 }}
        />
        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", margin: 0 }}>
          AuraMaker
        </p>
      </div>
    </div>
  );
}

function ChemiOrb({
  palette,
  size = 88,
  offsetX = 0,
}: {
  palette: ChemiParty["aura"]["palette"];
  size?: number;
  offsetX?: number;
}) {
  const glow = size + 36;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        marginLeft: offsetX,
        flexShrink: 0,
      }}
    >
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
          background: `radial-gradient(circle, ${palette.a}aa 0%, ${palette.b}55 45%, transparent 72%)`,
          filter: "blur(10px)",
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
          boxShadow: `inset 0 0 16px rgba(255,255,255,0.14), 0 0 28px ${palette.a}77`,
        }}
      />
    </div>
  );
}

function ChemiCardCanvas({
  partyA,
  partyB,
  siteUrl,
}: {
  partyA: ChemiParty;
  partyB: ChemiParty;
  siteUrl: string;
}) {
  const chemi = calculateChemi(partyA, partyB);
  const { blendedPalette } = chemi;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "85%",
          padding: "20px 16px 8px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              letterSpacing: "0.24em",
              color: "rgba(233,213,255,0.85)",
              fontWeight: 700,
            }}
          >
            CHEMI CARD
          </p>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              fontSize: 15,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {partyA.displayName} & {partyB.displayName}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
            height: 120,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 180,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${blendedPalette.a}66 0%, ${blendedPalette.b}44 50%, transparent 72%)`,
              filter: "blur(14px)",
            }}
          />
          <ChemiOrb palette={partyA.aura.palette} size={92} offsetX={-18} />
          <ChemiOrb palette={partyB.aura.palette} size={92} offsetX={-36} />
        </div>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            ケミ名
          </p>
          <h3
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 28,
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#fff",
              textShadow: `0 0 24px ${blendedPalette.a}aa`,
            }}
          >
            {chemi.chemName}
          </h3>
          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              fontSize: 22,
              fontWeight: 900,
              color: "#fde68a",
            }}
          >
            相性 {chemi.compatibilityPercent}%
          </p>
          <p
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 11,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {partyA.aura.archetypeName} × {partyB.aura.archetypeName}
          </p>
        </div>

        <div
          style={{
            marginTop: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(255,255,255,0.06)",
            padding: "10px 12px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(196,181,253,0.9)",
            }}
          >
            コンビの生態
          </p>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {chemi.ecologyText}
          </p>
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
          {[...partyA.topWords.slice(0, 2), ...partyB.topWords.slice(0, 2)].map((word) => (
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

        <div style={{ marginTop: "auto", paddingTop: 6 }}>
          <ExportBrandFooter />
          <p style={{ marginTop: 4, marginBottom: 0, fontSize: 8, color: "rgba(255,255,255,0.28)" }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </div>

      <div
        style={{
          height: "15%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px dashed rgba(255,255,255,0.12)",
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.22) 100%)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(255,255,255,0.28)",
          }}
        >
          2人のオーラを診断する 👇
        </p>
      </div>
    </div>
  );
}

export default function ChemiExportModal({
  open,
  onClose,
  partyA,
  partyB,
  siteUrl,
  onSaved,
}: ChemiExportModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!open) return null;

  const chemi = calculateChemi(partyA, partyB);

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
    link.download = "chemi_card.png";
    link.href = url;
    link.click();
    trackEvent("export_chemi_image", { method: "download" });
    onSaved?.();
  }

  async function handleInstagramShare() {
    if (exporting) return;
    setExporting(true);
    setError(null);

    try {
      const dataUrl = await exportPng();
      if (!dataUrl) throw new Error("画像の生成に失敗しました");

      await handleDownload(dataUrl);

      try {
        await navigator.clipboard.writeText(siteUrl);
        setToast("画像を保存＆URLをコピーしました。Instagramで貼り付けてね");
      } catch {
        setToast("画像を保存しました。URLは手動でコピーしてください");
      }

      trackEvent("export_chemi_image", { method: "instagram_flow" });

      if (typeof window !== "undefined") {
        const igStory = "instagram://story-camera";
        const external = buildExternalBrowserHref(siteUrl);
        if (isInAppBrowser()) {
          window.location.href = external ?? igStory;
        } else {
          window.location.href = igStory;
        }
      }

      onSaved?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "シェアに失敗しました";
      setError(message);
    } finally {
      setExporting(false);
    }
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
      const file = new File([blob], "chemi_card.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${partyA.displayName} × ${partyB.displayName} のケミカード`,
          text: `${chemi.chemName}（相性${chemi.compatibilityPercent}%）\n${siteUrl}`,
        });
        trackEvent("export_chemi_image", { method: "native_share" });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/20 bg-zinc-950 p-5 text-white shadow-2xl md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">ケミカードをシェア</h2>
            <p className="mt-1 text-sm text-white/70">
              {partyA.displayName} × {partyB.displayName} · 相性 {chemi.compatibilityPercent}%
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

        <div className="flex flex-col items-center gap-5">
          <div
            ref={canvasRef}
            className="relative overflow-hidden rounded-xl"
            style={
              {
                width: 300,
                height: 533,
                background: `
                  radial-gradient(circle at 28% 12%, ${chemi.blendedPalette.a}99 0%, transparent 40%),
                  radial-gradient(circle at 78% 22%, ${chemi.blendedPalette.b}88 0%, transparent 38%),
                  radial-gradient(circle at 50% 70%, ${chemi.blendedPalette.c}55 0%, transparent 46%),
                  linear-gradient(165deg, #05030b 0%, #120b2f 45%, #05030b 100%)
                `,
                fontFamily:
                  '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif',
              } as CSSProperties
            }
          >
            <ChemiCardCanvas partyA={partyA} partyB={partyB} siteUrl={siteUrl} />
          </div>

          <div className="flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={handleInstagramShare}
              disabled={exporting}
              className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-6 py-3 text-sm font-black text-black disabled:opacity-70 sm:text-base"
            >
              {exporting ? (
                <>
                  <span className="story-export-spinner inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black" />
                  生成中...
                </>
              ) : (
                "📸 インスタストーリーで相性を発表"
              )}
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={exporting}
              className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 disabled:opacity-70"
            >
              📤 端末でシェア
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80"
            >
              閉じる
            </button>
          </div>

          {toast ? <p className="text-sm text-cyan-200">{toast}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
