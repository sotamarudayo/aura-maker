"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { detectLocaleFromNavigator } from "@/lib/i18n/detect";

const DISMISS_KEY = "aura_locale_banner_dismissed";

export default function LocaleSuggestBanner() {
  const { locale, setLocale, t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (locale !== "ja") return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    if (detectLocaleFromNavigator(navigator.language) !== "en") return;
    setVisible(true);
  }, [locale]);

  if (!visible) return null;

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  function switchToEnglish() {
    setLocale("en");
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="border-b border-violet-300/25 bg-violet-500/15 px-3 py-2.5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 gap-y-2 text-center sm:justify-between sm:text-left">
        <p className="text-xs font-semibold text-violet-50 sm:text-sm">{t.lang.bannerTitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={switchToEnglish}
            className="rounded-full bg-violet-200 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-violet-100"
          >
            {t.lang.bannerAction}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/10"
          >
            {t.lang.bannerDismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
