import { createClient } from "@/utils/supabase/server";
import Header from "./Header";

export default async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Header isLoggedIn={!!user} isAnonymous={user?.is_anonymous ?? false} />;
}
