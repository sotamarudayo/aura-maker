import type { Metadata } from "next";
import Link from "next/link";
import AuraBackground from "@/components/AuraBackground";
import {
  buildVoteInviteDescription,
  buildVoteInviteTitle,
} from "@/lib/constants/share";
import { buildLanguageAlternates } from "@/lib/i18n/metadata";
import { getServerLocale } from "@/lib/i18n/server";
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
  const locale = await getServerLocale();
  const profile = await getProfile(userId);
  const displayName =
    profile?.display_name ??
    (locale === "en" ? "Anonymous aura user" : "名無しのオーラ使い");
  const siteUrl = await resolveSiteUrl();
  const ogImage = `${siteUrl}/api/og?userId=${encodeURIComponent(userId)}`;
  const title = buildVoteInviteTitle(displayName, locale);
  const description = buildVoteInviteDescription(displayName, locale);
  const pagePath = `/vote/${encodeURIComponent(userId)}`;
  const pageUrl = `${siteUrl}${pagePath}`;

  return {
    title,
    description,
    alternates: buildLanguageAlternates(pagePath),
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt:
            locale === "en"
              ? `${displayName}'s AuraMaker vote page`
              : `${displayName}さんのAuraMaker OGP画像`,
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
        <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-black/40 p-8 text-center backdrop-blur">
          <h1 className="text-2xl font-black">投票先が見つかりません</h1>
          <p className="mt-2 text-white/80">
            URLが古い・途中で切れている可能性があります。自分の診断を始めるならこちら。
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-5 py-3 text-sm font-black text-black"
          >
            自分のオーラ診断を始める
          </Link>
        </section>
      </main>
    );
  }

  return (
    <VoteClient
      userId={userId}
      displayName={profile.display_name ?? "名無しのオーラ使い"}
    />
  );
}
