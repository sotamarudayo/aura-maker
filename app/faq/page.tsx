import type { Metadata } from "next";
import Link from "next/link";
import AuraBackground from "@/components/AuraBackground";
import BlogCta from "@/components/BlogCta";
import { buildPageMetadata, getSiteUrlStatic } from "@/lib/i18n/metadata";
import { getSeoCopy } from "@/lib/i18n/seo";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";
import { SITE_FAQ_JA, buildFaqPageJsonLd } from "@/lib/seo/faq";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const seo = getSeoCopy(locale);
  return buildPageMetadata({
    locale,
    title: seo.faqTitle,
    description: seo.faqDescription,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const siteUrl = getSiteUrlStatic();
  // FAQ本文は JA 本命（EN UI でも同じ回答を表示）
  const items = SITE_FAQ_JA;
  const jsonLd = buildFaqPageJsonLd(siteUrl, items);

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuraBackground />
      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-black sm:text-4xl">{t.faq.title}</h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base">{t.faq.sub}</p>
        </header>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/15 bg-black/30 px-4 py-3 open:border-violet-300/35 open:bg-white/5"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-white marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span>{item.question}</span>
                  <span className="shrink-0 text-white/40 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/75">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/auras" className="font-semibold text-cyan-200 hover:text-cyan-100">
            {t.faq.toEncyclopedia}
          </Link>
          <span className="text-white/30">·</span>
          <Link href="/blog" className="font-semibold text-cyan-200 hover:text-cyan-100">
            {t.faq.toBlog}
          </Link>
        </div>

        <BlogCta />
      </div>
    </main>
  );
}
