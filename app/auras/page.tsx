import type { Metadata } from "next";
import AurasPageContent from "@/components/AurasPageContent";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { getSeoCopy } from "@/lib/i18n/seo";
import { getServerLocale } from "@/lib/i18n/server";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const seo = getSeoCopy(locale);
  return buildPageMetadata({
    locale,
    title: seo.aurasTitle,
    description: seo.aurasDescription,
    path: "/auras",
  });
}

export default async function AurasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AurasPageContent isLoggedIn={!!user} />;
}
