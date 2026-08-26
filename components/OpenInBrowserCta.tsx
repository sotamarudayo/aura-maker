"use client";

import { useEffect, useState } from "react";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";

type OpenInBrowserCtaProps = {
  href: string;
  className?: string;
  /** 通常ブラウザ向けラベル */
  label: string;
  /** Instagram 等のアプリ内ブラウザ向けラベル */
  inAppLabel?: string;
  persistenceNote?: string;
};

const DEFAULT_NOTE =
  "Xやメール登録なしでも診断データは端末に残せます。Instagram内だと消えやすいので、Safari / Chrome で開くのがおすすめです。";

const FALLBACK_HINT =
  "うまく開かないときは、画面右上の「⋯」→「外部ブラウザで開く」を押してください。";

/**
 * アプリ内ブラウザ（Instagram 等）では外部ブラウザ起動を試みる CTA。
 * 匿名セッションを端末ブラウザ側に残すのが主目的。
 */
export default function OpenInBrowserCta({
  href,
  className,
  label,
  inAppLabel = "Safari / Chromeで自分のオーラ診断を始める",
  persistenceNote = DEFAULT_NOTE,
}: OpenInBrowserCtaProps) {
  const [inApp, setInApp] = useState(false);
  const [externalHref, setExternalHref] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setInApp(isInAppBrowser());
    setExternalHref(buildExternalBrowserHref(href));
  }, [href]);

  function handleClick() {
    if (!isInAppBrowser()) return;
    window.setTimeout(() => setShowFallback(true), 900);
  }

  return (
    <div>
      {inApp ? (
        <p className="mb-3 text-left text-xs leading-relaxed text-amber-100/85">{persistenceNote}</p>
      ) : null}
      <a
        href={externalHref ?? href}
        className={className}
        onClick={handleClick}
        rel="noopener noreferrer"
      >
        {inApp ? inAppLabel : label}
      </a>
      {showFallback ? (
        <p className="mt-3 text-left text-xs leading-relaxed text-white/65">{FALLBACK_HINT}</p>
      ) : null}
    </div>
  );
}
