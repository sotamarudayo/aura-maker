"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { toPng } from "html-to-image";
import type { AuraEcology, AuraType } from "@/lib/constants/auras";
import { RARITY_LABELS } from "@/lib/constants/auras";

type StoryExportModalProps = {
  open: boolean;
  onClose: () => void;
  displayName: string;
  aura: AuraType;
  description: string;
  ecology?: AuraEcology | null;
  topWords: string[];
  onSaved?: () => void;
};

export default function StoryExportModal({
  open,
  onClose,
  displayName,
  aura,
  description,
  ecology,
  topWords,
  onSaved,
}: StoryExportModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const words = topWords.slice(0, 3);
  const shortDescription =
    description.length > 72 ? `${description.slice(0, 72)}…` : description;
  const ecologyLine = ecology
    ? `⚡${ecology.trigger} / 🩹${ecology.weakness}`
    : null;
  const shortEcology =
    ecologyLine && ecologyLine.length > 48 ? `${ecologyLine.slice(0, 48)}…` : ecologyLine;

  async function handleDownload() {
    if (!canvasRef.current || exporting) return;

    setExporting(true);
    setError(null);

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#05030b",
      });

      const link = document.createElement("a");
      link.download = "my_aura_result.png";
      link.href = dataUrl;
      link.click();
      onSaved?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "画像の生成に失敗しました";
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
            <h2 className="text-xl font-bold">ストーリー用画像</h2>
            <p className="mt-1 text-sm text-white/70">
              Instagram / TikTok ストーリー向け（9:16）の画像を保存できます。
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
            className="relative h-[533px] w-[300px] overflow-hidden rounded-xl"
            style={
              {
                "--story-a": aura.palette.a,
                "--story-b": aura.palette.b,
                "--story-c": aura.palette.c,
                background: `
                  radial-gradient(circle at 30% 18%, ${aura.palette.a}99 0%, transparent 42%),
                  radial-gradient(circle at 78% 28%, ${aura.palette.b}88 0%, transparent 40%),
                  radial-gradient(circle at 50% 62%, ${aura.palette.c}66 0%, transparent 48%),
                  linear-gradient(165deg, #05030b 0%, #120b2f 45%, #05030b 100%)
                `,
                fontFamily:
                  '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif',
              } as CSSProperties
            }
          >
            <div className="flex h-full flex-col px-5 pt-7">
              <div className="text-center">
                <p
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    color: "rgba(233, 213, 255, 0.9)",
                    fontWeight: 700,
                  }}
                >
                  My Aura is...
                </p>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {displayName}
                </p>
              </div>

              <div className="relative mx-auto mt-5 h-36 w-36">
                <div
                  style={{
                    position: "absolute",
                    inset: "-18%",
                    borderRadius: "9999px",
                    background: `radial-gradient(circle, ${aura.palette.a}aa 0%, ${aura.palette.b}66 40%, transparent 70%)`,
                    filter: "blur(10px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "12%",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.28)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "22%",
                    borderRadius: "9999px",
                    background: `
                      radial-gradient(circle at 32% 28%, ${aura.palette.a} 0%, transparent 48%),
                      radial-gradient(circle at 74% 40%, ${aura.palette.b} 0%, transparent 50%),
                      radial-gradient(circle at 50% 78%, ${aura.palette.c} 0%, transparent 52%),
                      linear-gradient(160deg, #16112a 0%, #0a0818 100%)
                    `,
                    boxShadow: `0 0 28px ${aura.palette.a}66`,
                  }}
                />
              </div>

              <div className="mt-4 text-center">
                <span
                  style={{
                    display: "inline-block",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "rgba(255,255,255,0.08)",
                    padding: "3px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {RARITY_LABELS[aura.rarity]}
                </span>
                <h3
                  style={{
                    marginTop: 10,
                    fontSize: 22,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: "#fff",
                  }}
                >
                  {aura.name}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {shortDescription}
                </p>
                {shortEcology ? (
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 9,
                      lineHeight: 1.45,
                      color: "rgba(196,181,253,0.85)",
                    }}
                  >
                    {shortEcology}
                  </p>
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {(words.length > 0 ? words : ["覚醒待ち"]).map((word) => (
                  <span
                    key={word}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.22)",
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(8px)",
                      padding: "5px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#f5f3ff",
                    }}
                  >
                    #{word}
                  </span>
                ))}
              </div>

              {/* 下部20%はリンクスタンプ用の余白 */}
              <div
                style={{
                  marginTop: "auto",
                  height: "20%",
                  minHeight: 96,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 18,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.04em",
                  }}
                >
                  リンクはこちら👇
                </p>
                <p
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.28)",
                  }}
                >
                  AuraMaker
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleDownload}
              disabled={exporting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-6 py-3 text-sm font-bold text-black disabled:opacity-70"
            >
              {exporting ? (
                <>
                  <span className="story-export-spinner inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black" />
                  生成中...
                </>
              ) : (
                "PNGを保存する"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white"
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
