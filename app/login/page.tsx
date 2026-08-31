import { redirect } from "next/navigation";
import LoginPageContent from "./LoginPageContent";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginPageContent />;
}
