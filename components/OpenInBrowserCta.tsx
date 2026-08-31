"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { buildExternalBrowserHref, isInAppBrowser } from "@/lib/utils/external-browser";

type OpenInBrowserCtaProps = {
  href: string;
  className?: string;
  label?: string;
  persistenceNote?: string;
  inAppOnly?: boolean;
};

export default function OpenInBrowserCta({
  href,
  className,
  label,
  persistenceNote,
  inAppOnly = true,
}: OpenInBrowserCtaProps) {
  const { t } = useLocale();
  const [ready, setReady] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [externalHref, setExternalHref] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const buttonLabel = label ?? t.browser.openInSafari;
  const note = persistenceNote ?? t.browser.persistenceNote;

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
        <p className="mb-3 text-left text-xs leading-relaxed text-amber-100/85">{note}</p>
      ) : null}
      <a
        href={externalHref ?? href}
        className={className}
        onClick={handleClick}
        rel="noopener noreferrer"
      >
        {buttonLabel}
      </a>
      {showFallback ? (
        <p className="mt-3 text-left text-xs leading-relaxed text-white/65">{t.browser.fallbackHint}</p>
      ) : null}
    </div>
  );
}
