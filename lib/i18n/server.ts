import { cookies, headers } from "next/headers";
import { detectLocaleFromAcceptLanguage } from "./detect";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./types";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(value)) return value;

  const headersList = await headers();
  return detectLocaleFromAcceptLanguage(headersList.get("accept-language"));
}
