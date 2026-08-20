import { ImageResponse } from "next/og";
import { calculateAuraType } from "@/lib/constants/auras";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const notoSansJpBoldPromise = fetch(
  "https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP-Bold.ttf",
).then((response) => response.arrayBuffer());

type WordCount = {
  word: string;
  count: number;
};

function getTopWords(words: string[]): WordCount[] {
  const map = new Map<string, number>();
  for (const word of words) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const supabase = await createClient();
    const [{ data: profile }, { data: votes }, fontData] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
      supabase.from("votes").select("word").eq("target_user_id", userId),
      notoSansJpBoldPromise,
    ]);

    const displayName = profile?.display_name ?? "Anonymous";
    const voteWords = (votes ?? []).map((vote) => vote.word);
    const auraResult = calculateAuraType(voteWords);
    const topWords = getTopWords(voteWords);
    const wordsLabel =
      topWords.length > 0
        ? topWords.map((item) => `${item.word} (${item.count})`).join(" / ")
        : "まだ投票がありません";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            backgroundColor: "#05030b",
            color: "#f5f3ff",
            fontFamily: "Noto Sans JP",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 15%, rgba(196, 132, 252, 0.50), transparent 42%), radial-gradient(circle at 80% 18%, rgba(103, 232, 249, 0.35), transparent 40%), radial-gradient(circle at 52% 85%, rgba(244, 114, 182, 0.35), transparent 48%), linear-gradient(135deg, #080414 0%, #120b2f 45%, #05030b 100%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 72px",
            }}
          >
            <div
              style={{
                fontSize: 38,
                letterSpacing: "0.08em",
                opacity: 0.9,
              }}
            >
              AuraMaker
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 72,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.15,
                textShadow: "0 8px 40px rgba(168, 85, 247, 0.45)",
              }}
            >
              {displayName} のオーラ
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 40,
                fontWeight: 700,
                color: "#c4b5fd",
              }}
            >
              {auraResult.aura.name}
            </div>
            <div
              style={{
                marginTop: 18,
                maxWidth: "960px",
                fontSize: 28,
                textAlign: "center",
                lineHeight: 1.35,
                color: "#ddd6fe",
                opacity: 0.95,
              }}
            >
              {auraResult.dynamicProfile.mainText.length > 120
                ? `${auraResult.dynamicProfile.mainText.slice(0, 120)}…`
                : auraResult.dynamicProfile.mainText}
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 34,
                opacity: 0.92,
              }}
            >
              みんなからの印象（上位3単語）
            </div>
            <div
              style={{
                marginTop: 14,
                maxWidth: "1000px",
                fontSize: 46,
                textAlign: "center",
                lineHeight: 1.28,
                color: "#e9d5ff",
              }}
            >
              {wordsLabel}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "cache-control": "no-store, max-age=0",
        },
        fonts: [
          {
            name: "Noto Sans JP",
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Failed to generate OGP: ${message}`, { status: 500 });
  }
}
