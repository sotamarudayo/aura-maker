import type { Metadata } from "next";
import VoteNotFoundContent from "@/components/VoteNotFoundContent";
import {
  buildVoteInviteDescription,
  buildVoteInviteTitle,
} from "@/lib/constants/share";
import { buildLanguageAlternates } from "@/lib/i18n/metadata";
import { getMessages } from "@/lib/i18n/messages";
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
    return <VoteNotFoundContent />;
  }

  const locale = await getServerLocale();
  const messages = getMessages(locale);

  return (
    <VoteClient
      userId={userId}
      displayName={profile.display_name ?? messages.common.anonymousName}
    />
  );
}
