"use client";

import { Suspense } from "react";
import AnonymousStartButton from "@/components/AnonymousStartButton";
import AuraBackground from "@/components/AuraBackground";
import RedirectIfLoggedIn from "@/components/RedirectIfLoggedIn";
import { useLocale } from "@/components/LocaleProvider";
import LoginForm from "./LoginForm";

export default function LoginPageContent() {
  const { t } = useLocale();

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-x-clip px-4 py-8 text-white sm:py-12">
      <RedirectIfLoggedIn />
      <AuraBackground />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="font-display text-4xl text-white sm:text-5xl">AuraMaker</h1>
          <p className="text-sm text-white/80 sm:text-base">{t.login.sub}</p>
        </div>

        <AnonymousStartButton className="w-full rounded-full bg-violet-300 px-6 py-3 font-semibold text-black disabled:opacity-60" />

        <Suspense fallback={<div className="h-40 w-full" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
