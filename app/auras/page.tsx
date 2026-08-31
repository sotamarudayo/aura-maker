import type { Metadata } from "next";
import AurasPageContent from "@/components/AurasPageContent";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "オーラ図鑑",
  description: "AuraMakerの全オーラタイプ一覧。友達の印象ワードの組み合わせで決まる、あなただけのオーラを探そう。",
};

export default async function AurasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AurasPageContent isLoggedIn={!!user} />;
}
