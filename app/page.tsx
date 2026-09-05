import { redirect } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { getSeoCopy } from "@/lib/i18n/seo";
import { getServerLocale } from "@/lib/i18n/server";
import { getPublicStats } from "@/lib/stats/public";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const seo = getSeoCopy(locale);
  return buildPageMetadata({
    locale,
    title: seo.homeTitle,
    description: seo.homeDescription,
    path: "/",
  });
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const stats = await getPublicStats();
  return <HomeContent stats={stats} />;
}
