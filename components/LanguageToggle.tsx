"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/types";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  function toggle() {
    const next: Locale = locale === "ja" ? "en" : "ja";
    setLocale(next);
  }

  const targetLabel = locale === "ja" ? t.lang.switchToEn : t.lang.switchToJa;

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/90 transition hover:border-violet-200/40 hover:bg-white/15 sm:gap-1.5 sm:px-3 sm:text-xs"
      aria-label={locale === "ja" ? "Switch to English" : "日本語に切り替え"}
      title={targetLabel}
    >
      <span aria-hidden className="text-[11px] sm:text-xs">
        🌐
      </span>
      <span>{targetLabel}</span>
    </button>
  );
}
