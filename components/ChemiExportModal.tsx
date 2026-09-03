"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toPng } from "html-to-image";
import { useLocale } from "@/components/LocaleProvider";
import { calculateChemi, type ChemiParty, type ChemiResult } from "@/lib/chemi/calculate-chemi";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";
import { trackEvent } from "@/lib/analytics";
import type { Messages } from "@/lib/i18n/messages";

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
    <div style={{ paddingTop: 6, textAlign: "center" }}>
      <p
        style={{
          margin: 0,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        ✦ AuraMaker ✦
      </p>
    </div>
  );
}

function ChemiGaugeBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 3,
          gap: 6,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.72)" }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color, flexShrink: 0 }}>{percent}%</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06)`,
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}cc 0%, ${color} 100%)`,
            boxShadow: `0 0 10px ${color}88`,
          }}
        />
      </div>
    </div>
  );
}

function ChemiSourceOrb({
  palette,
  size,
  offsetX,
  zIndex,
}: {
  palette: ChemiParty["aura"]["palette"];
  size: number;
  offsetX: number;
  zIndex: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: offsetX - size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        overflow: "hidden",
        zIndex,
        background: `
          radial-gradient(circle at 30% 30%, ${palette.a} 0%, transparent 48%),
          radial-gradient(circle at 70% 65%, ${palette.b} 0%, transparent 46%),
          linear-gradient(160deg, ${palette.c}88 0%, #0a0818 100%)
        `,
        boxShadow: `
          inset 0 0 16px rgba(255,255,255,0.14),
          0 0 24px ${palette.a}77,
          0 0 18px ${palette.b}55
        `,
      }}
    />
  );
}

function FusedChemiOrb({
  paletteA,
  paletteB,
  blended,
  size = 112,
}: {
  paletteA: ChemiParty["aura"]["palette"];
  paletteB: ChemiParty["aura"]["palette"];
  blended: ChemiParty["aura"]["palette"];
  size?: number;
}) {
  const orbSize = Math.round(size * 0.58);
  const spread = Math.round(size * 0.22);
  const glow = size + 56;

  return (
    <div
      style={{
        position: "relative",
        width: size + spread * 2,
        height: size,
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
          background: `
            radial-gradient(circle at 32% 48%, ${paletteA.a}99 0%, transparent 52%),
            radial-gradient(circle at 68% 48%, ${paletteB.a}99 0%, transparent 52%),
            radial-gradient(circle at 50% 50%, ${blended.b}88 0%, transparent 58%)
          `,
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: Math.round(size * 0.34),
          height: Math.round(size * 0.34),
          marginLeft: -Math.round(size * 0.17),
          marginTop: -Math.round(size * 0.17),
          borderRadius: "50%",
          zIndex: 3,
          background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${blended.a}cc 35%, transparent 72%)`,
          boxShadow: `0 0 28px ${blended.a}cc, 0 0 48px ${blended.b}88`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          transform: "rotate(-12deg)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "2%",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          transform: "rotate(18deg)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <ChemiSourceOrb palette={paletteA} size={orbSize} offsetX={-spread} zIndex={1} />
      <ChemiSourceOrb palette={paletteB} size={orbSize} offsetX={spread} zIndex={2} />
    </div>
  );
}

function ChemiCardCanvas({
  partyA,
  partyB,
  siteUrl,
  chemi,
  t,
}: {
  partyA: ChemiParty;
  partyB: ChemiParty;
  siteUrl: string;
  chemi: ChemiResult;
  t: Messages["chemi"];
}) {
  const { blendedPalette, relationship } = chemi;

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
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px 14px 8px",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              letterSpacing: "0.24em",
              color: "rgba(233,213,255,0.85)",
              fontWeight: 700,
            }}
          >
            RELATIONSHIP CARD
          </p>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 14,
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
            marginTop: 8,
            height: 100,
            flexShrink: 0,
          }}
        >
          <FusedChemiOrb
            paletteA={partyA.aura.palette}
            paletteB={partyB.aura.palette}
            blended={blendedPalette}
            size={96}
          />
        </div>

        <div style={{ marginTop: 6, textAlign: "center", flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 900,
              lineHeight: 1.25,
              color: "#fff",
              textShadow: `0 0 20px ${blendedPalette.a}66`,
            }}
          >
            {relationship.typeName}
          </p>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {t.youLabel} → {relationship.roleYou}
            <span style={{ margin: "0 6px", color: "rgba(255,255,255,0.35)" }}>·</span>
            {t.partnerLabel} → {relationship.rolePartner}
          </p>
          <p
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {partyA.aura.archetypeName} × {partyB.aura.archetypeName}
          </p>
        </div>

        <div
          style={{
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.22)",
            padding: "8px 10px 4px",
            flexShrink: 0,
          }}
        >
          {chemi.gauges.map((gauge) => (
            <ChemiGaugeBar
              key={gauge.id}
              label={gauge.label}
              percent={gauge.percent}
              color={gauge.color}
            />
          ))}
          <p
            style={{
              margin: "2px 0 6px",
              textAlign: "right",
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {t.chemScore.replace("{percent}", String(chemi.compatibilityPercent))}
          </p>
        </div>

        <div
          style={{
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(255,255,255,0.06)",
            padding: "8px 10px",
            textAlign: "center",
            flexShrink: 1,
            minHeight: 0,
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
            {t.relationshipEcology}
          </p>
          <p
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 10,
              fontWeight: 600,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {relationship.story}
          </p>
        </div>

        <div style={{ marginTop: 6, flexShrink: 0 }}>
          <ExportBrandFooter />
          <p style={{ marginTop: 2, marginBottom: 0, fontSize: 8, color: "rgba(255,255,255,0.28)" }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </div>

      <div
        style={{
          height: 52,
          flexShrink: 0,
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
          {t.footerCta}
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
  const { locale, t } = useLocale();

  if (!open) return null;

  const chemi = calculateChemi(partyA, partyB, locale);
  const shareText = t.chemi.shareText
    .replace("{type}", chemi.relationship.typeName)
    .replace("{you}", chemi.relationship.roleYou)
    .replace("{partner}", chemi.relationship.rolePartner)
    .replace("{site}", siteUrl);

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
          title: `${partyA.displayName} × ${partyB.displayName}`,
          text: shareText,
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
            <h2 className="text-xl font-bold">{t.chemi.exportTitle}</h2>
            <p className="mt-1 text-sm text-white/70">
              {t.chemi.exportSub
                .replace("{a}", partyA.displayName)
                .replace("{b}", partyB.displayName)
                .replace("{type}", chemi.relationship.typeName)}
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
            <ChemiCardCanvas
              partyA={partyA}
              partyB={partyB}
              siteUrl={siteUrl}
              chemi={chemi}
              t={t.chemi}
            />
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
                  {t.chemi.saving}
                </>
              ) : (
                `📸 ${t.chemi.shareIg}`
              )}
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={exporting}
              className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 disabled:opacity-70"
            >
              📤 {t.chemi.shareNative}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80"
            >
              {t.common.close}
            </button>
          </div>

          {toast ? <p className="text-sm text-cyan-200">{toast}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
