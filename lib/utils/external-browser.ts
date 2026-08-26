/** Instagram / LINE などのアプリ内ブラウザ判定と、外部ブラウザ起動のベストエフォート */

export function isInAppBrowser(ua = typeof navigator !== "undefined" ? navigator.userAgent : "") {
  return /Instagram|FBAN|FBAV|FBIOS|Line\/|Twitter|TikTok|BytedanceWebview|MicroMessenger|FB_IAB|Threads|Barcelona/i.test(
    ua,
  );
}

function isAndroid(ua: string) {
  return /Android/i.test(ua);
}

function isIOS(ua: string) {
  return /iPhone|iPad|iPod/i.test(ua);
}

/**
 * アプリ内ブラウザから外部ブラウザへ逃がすための URL を返す。
 * 使えない環境では null（通常の https リンクにフォールバック）。
 */
export function buildExternalBrowserHref(targetUrl: string): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (!isInAppBrowser(ua)) return null;

  try {
    const absolute = new URL(targetUrl, window.location.origin).toString();

    if (isAndroid(ua)) {
      const u = new URL(absolute);
      return (
        `intent://${u.host}${u.pathname}${u.search}${u.hash}` +
        `#Intent;scheme=https;S.browser_fallback_url=${encodeURIComponent(absolute)};end`
      );
    }

    if (isIOS(ua)) {
      if (/Instagram/i.test(ua) && !/Barcelona/i.test(ua)) {
        return `instagram://extbrowser/?url=${encodeURIComponent(absolute)}`;
      }
      if (/Barcelona|Threads/i.test(ua)) {
        return `barcelona://extbrowser/?url=${encodeURIComponent(absolute)}`;
      }
      if (/Line\//i.test(ua)) {
        const sep = absolute.includes("?") ? "&" : "?";
        return `${absolute}${sep}openExternalBrowser=1`;
      }
      // その他の iOS アプリ内ブラウザ向け
      return absolute.replace(/^https:/, "x-safari-https:");
    }
  } catch {
    return null;
  }

  return null;
}
