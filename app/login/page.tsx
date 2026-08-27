import { Suspense } from "react";
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
    <main className="relative flex flex-1 flex-col items-center overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-black sm:text-4xl">AuraMaker</h1>
          <p className="text-sm text-white/80 sm:text-base">
            周りからどう思われてるか、知りたくない？友達の印象からオーラ診断。
          </p>
        </div>

        <AnonymousStartButton className="w-full rounded-full bg-violet-300 px-6 py-3 font-semibold text-black disabled:opacity-60" />

        <Suspense fallback={<div className="h-40 w-full" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
