import { redirect } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { createClient } from "@/utils/supabase/server";

export { metadata } from "./metadata";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <HomeContent />;
}
