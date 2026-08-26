"use client";

import { useEffect, useState } from "react";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";

type OpenInBrowserCtaProps = {
  href: string;
  className?: string;
  /** 外部ブラウザ誘導ボタンの文言 */
  label?: string;
  persistenceNote?: string;
  /** true のとき Instagram 等のアプリ内ブラウザだけで表示 */
  inAppOnly?: boolean;
};

const DEFAULT_NOTE =
  "Xやメール登録なしでも診断データは端末に残せます。Instagram内だと消えやすいので、Safari / Chrome で開くのがおすすめです。";

const FALLBACK_HINT =
  "うまく開かないときは、画面右上の「⋯」→「外部ブラウザで開く」を押してください。";

/**
 * アプリ内ブラウザから外部ブラウザ起動を試みる CTA。
 * 匿名セッションを端末ブラウザ側に残すのが主目的。
 */
export default function OpenInBrowserCta({
  href,
  className,
  label = "Safari / Chromeで開いて診断する",
  persistenceNote = DEFAULT_NOTE,
  inAppOnly = true,
}: OpenInBrowserCtaProps) {
  const [ready, setReady] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [externalHref, setExternalHref] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const detected = isInAppBrowser();
    setInApp(detected);
    setExternalHref(detected ? buildExternalBrowserHref(href) : null);
    setReady(true);
  }, [href]);

  if (!ready) return null;
  if (inAppOnly && !inApp) return null;

  function handleClick() {
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
        {label}
      </a>
      {showFallback ? (
        <p className="mt-3 text-left text-xs leading-relaxed text-white/65">{FALLBACK_HINT}</p>
      ) : null}
    </div>
  );
}
