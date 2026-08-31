import { DEFAULT_LOCALE, type Locale } from "./types";

/** Accept-Language から初回訪問時のロケールを推定（cookie 未設定時のみ使用） */
export function detectLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((item) => {
      const [tag, ...params] = item.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}

export function detectLocaleFromNavigator(language: string | undefined): Locale {
  if (!language) return DEFAULT_LOCALE;
  const tag = language.toLowerCase();
  if (tag.startsWith("ja")) return "ja";
  if (tag.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}
