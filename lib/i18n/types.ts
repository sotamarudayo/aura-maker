export type Locale = "ja" | "en";

export const LOCALE_COOKIE = "aura_locale";
export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ja" || value === "en";
}
