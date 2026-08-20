import { redirect } from "next/navigation";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
      <AuraBackground />
      <div className="relative z-10 w-full min-w-0 max-w-3xl space-y-6 text-center">
        <h1 className="text-3xl font-black sm:text-4xl">AuraMaker</h1>
        <p className="text-white/80">
          匿名で集まる印象ワードを、あなたのオーラとして可視化しよう。
        </p>
        <div className="mx-auto flex justify-center">
          <AnonymousStartButton />
        </div>
        <div className="mx-auto">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
