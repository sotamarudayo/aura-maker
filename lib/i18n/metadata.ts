import type { Metadata } from "next";
import { getSeoCopy } from "./seo";
import type { Locale } from "./types";

export function getSiteUrlStatic() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://auramaker.net";
}

/** hreflang 用に ?lang= を付けた言語別 URL を生成 */
export function buildLanguageAlternates(path = "/") {
  const base = getSiteUrlStatic();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const canonical = normalized === "/" ? base : `${base}${normalized}`;

  const withLang = (lang: "ja" | "en") => {
    const suffix = normalized === "/" ? "/" : normalized;
    return `${base}${suffix}?lang=${lang}`;
  };

  return {
    canonical,
    languages: {
      ja: withLang("ja"),
      en: withLang("en"),
      "x-default": canonical,
    },
  };
}

type BuildPageMetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "/",
}: BuildPageMetadataOptions): Metadata {
  const siteUrl = getSiteUrlStatic();
  const seo = getSeoCopy(locale);
  const ogImage = {
    url: `${siteUrl}/brand/og.png`,
    width: 1200,
    height: 630,
    alt: seo.ogImageAlt,
  };

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title,
      description,
      siteName: "AuraMaker",
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      url: path === "/" ? siteUrl : `${siteUrl}${path}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function buildRootMetadata(locale: Locale): Metadata {
  const seo = getSeoCopy(locale);
  const siteUrl = getSiteUrlStatic();
  const ogImage = {
    url: `${siteUrl}/brand/og.png`,
    width: 1200,
    height: 630,
    alt: seo.ogImageAlt,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.siteTitle,
      template: "%s | AuraMaker",
    },
    description: seo.siteDescription,
    keywords: seo.keywords,
    applicationName: "AuraMaker",
    alternates: buildLanguageAlternates("/"),
    openGraph: {
      title: seo.siteTitle,
      description: seo.siteDescription,
      siteName: "AuraMaker",
      type: "website",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: locale === "ja" ? ["en_US"] : ["ja_JP"],
      url: siteUrl,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.siteDescription,
      images: [ogImage.url],
    },
    icons: {
      icon: [
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}
