"use client";

import { useEffect, useState, type ReactNode } from "react";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";

type OpenInBrowserCtaProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * アプリ内ブラウザ（Instagram 等）では外部ブラウザ起動を試みる CTA。
 * 端末・アプリ版によっては失敗するため、失敗時の案内も出す。
 */
export default function OpenInBrowserCta({ href, className, children }: OpenInBrowserCtaProps) {
  const [externalHref, setExternalHref] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setExternalHref(buildExternalBrowserHref(href));
  }, [href]);

  function handleClick() {
    if (!isInAppBrowser()) return;
    // 外部スキームへ飛んでも WebView に残る場合があるので案内を出す
    window.setTimeout(() => setShowHint(true), 900);
  }

  return (
    <div>
      <a
        href={externalHref ?? href}
        className={className}
        onClick={handleClick}
        rel="noopener noreferrer"
      >
        {children}
      </a>
      {showHint ? (
        <p className="mt-3 text-left text-xs leading-relaxed text-white/65">
          うまく開かないときは、画面右上の「⋯」→「外部ブラウザで開く」を押してください。Safari /
          Chrome でそのまま診断を始められます。
        </p>
      ) : null}
    </div>
  );
}
