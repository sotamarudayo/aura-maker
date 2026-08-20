import type { Metadata } from "next";
import AuraBackground from "@/components/AuraBackground";
import { resolveSiteUrl } from "@/lib/utils/site-url";
import { createClient } from "@/utils/supabase/server";
import VoteClient from "./VoteClient";

type VotePageProps = {
  params: Promise<{ userId: string }>;
};

async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  return profile;
}

export async function generateMetadata({ params }: VotePageProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await getProfile(userId);
  const displayName = profile?.display_name ?? "Anonymous";
  const siteUrl = await resolveSiteUrl();
  const ogImage = `${siteUrl}/api/og?userId=${encodeURIComponent(userId)}`;
  const title = `${displayName}さんのオーラに投票しよう！`;
  const description = `${displayName}さんを表す単語を3つ選んで、匿名でオーラ投票に参加しよう。`;
  const pageUrl = `${siteUrl}/vote/${encodeURIComponent(userId)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${displayName}さんのAuraMaker OGP画像`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function VotePage({ params }: VotePageProps) {
  const { userId } = await params;
  const profile = await getProfile(userId);

  if (!profile) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-4 py-10 text-white">
        <AuraBackground />
        <section className="relative z-10 rounded-2xl border border-white/20 bg-black/40 p-8 text-center backdrop-blur">
          <h1 className="text-2xl font-black">ユーザーが見つかりません</h1>
          <p className="mt-2 text-white/80">URLを確認してもう一度アクセスしてください。</p>
        </section>
      </main>
    );
  }

  const siteUrl = await resolveSiteUrl();

  return (
    <VoteClient
      userId={userId}
      displayName={profile.display_name ?? "Anonymous"}
      siteUrl={siteUrl}
    />
  );
}
