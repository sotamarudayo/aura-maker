"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/types";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  function toggle() {
    const next: Locale = locale === "ja" ? "en" : "ja";
    setLocale(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/85 transition hover:bg-white/20 sm:text-xs"
      aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
    >
      {locale === "ja" ? "EN" : "日本語"}
    </button>
  );
}
