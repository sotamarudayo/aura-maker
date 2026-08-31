import { getSeoCopy } from "@/lib/i18n/seo";
import { getSiteUrlStatic } from "@/lib/i18n/metadata";
import type { Locale } from "@/lib/i18n/types";

type SeoJsonLdProps = {
  locale: Locale;
};

export default function SeoJsonLd({ locale }: SeoJsonLdProps) {
  const seo = getSeoCopy(locale);
  const siteUrl = getSiteUrlStatic();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "AuraMaker",
        description: seo.jsonLdDescription,
        inLanguage: ["ja", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/auras`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: "AuraMaker",
        url: siteUrl,
        description: seo.jsonLdDescription,
        applicationCategory: "EntertainmentApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: locale === "ja" ? "ja" : "en",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
