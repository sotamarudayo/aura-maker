type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-YJNGYEF2PN";

/** 自分の閲覧を GA から外す Cookie（`?ga=off` で付与） */
export const GA_OPT_OUT_COOKIE = "aura_ga_opt_out";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

/** URL の `?ga=off` / `?ga=on` を Cookie に反映（計測より先に呼ぶ） */
export function syncGaOptOutFromUrl() {
  if (typeof window === "undefined") return;
  const flag = new URLSearchParams(window.location.search).get("ga");
  if (flag === "off") {
    // 2年
    writeCookie(GA_OPT_OUT_COOKIE, "1", 60 * 60 * 24 * 730);
  } else if (flag === "on") {
    clearCookie(GA_OPT_OUT_COOKIE);
  }
}

export function isGaOptedOut() {
  return readCookie(GA_OPT_OUT_COOKIE) === "1";
}

export function isGaEnabled() {
  if (GA_MEASUREMENT_ID.length === 0) return false;
  if (typeof window !== "undefined" && isGaOptedOut()) return false;
  return true;
}

export function trackEvent(name: string, params?: GtagEventParams) {
  if (!isGaEnabled() || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

export function trackPageView(url: string) {
  if (!isGaEnabled() || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}
