"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuraBackground from "@/components/AuraBackground";
import OpenInBrowserCta from "@/components/OpenInBrowserCta";
import { useLocale } from "@/components/LocaleProvider";
import { buildVoteThanksMessage } from "@/lib/constants/share";

type SuccessClientProps = {
  targetDisplayName: string;
};

export default function SuccessClient({ targetDisplayName }: SuccessClientProps) {
  const router = useRouter();
  const { locale, t } = useLocale();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-8 text-white sm:py-10">
      <AuraBackground />
      <section className="relative z-10 w-full min-w-0 max-w-xl rounded-2xl border border-white/20 bg-black/40 p-5 text-center backdrop-blur sm:p-8">
        <h1 className="text-2xl font-black leading-tight sm:text-3xl">{t.success.title}</h1>
        <p className="mt-3 text-white/80">{buildVoteThanksMessage(targetDisplayName, locale)}</p>

        <div className="mt-8 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-4 text-left">
          <p className="text-sm font-bold text-fuchsia-100">{t.success.fusionTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {t.success.fusionBody.replace("{name}", targetDisplayName)}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 px-4 py-3 text-center text-sm font-black leading-snug text-black sm:px-5"
          >
            {t.success.startOwn}
          </Link>
          <OpenInBrowserCta
            href="/"
            inAppOnly
            className="block rounded-full border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-white sm:px-5"
          />
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-white/50 underline-offset-2 hover:underline"
          >
            {t.common.back}
          </button>
        </div>
      </section>
    </main>
  );
}
