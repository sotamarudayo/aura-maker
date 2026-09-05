import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuraBackground from "@/components/AuraBackground";
import BlogCta from "@/components/BlogCta";
import BlogMarkdown from "@/components/BlogMarkdown";
import { getBlogPost, getBlogSlugs } from "@/lib/blog/posts";
import { buildPageMetadata, getSiteUrlStatic } from "@/lib/i18n/metadata";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };

  const meta = buildPageMetadata({
    locale,
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });

  if (!post.cover) return meta;

  const siteUrl = getSiteUrlStatic();
  const coverUrl = post.cover.startsWith("http")
    ? post.cover
    : `${siteUrl}${post.cover}`;

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [{ url: coverUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      ...meta.twitter,
      images: [coverUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const siteUrl = getSiteUrlStatic();
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: "AuraMaker",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AuraMaker",
      url: siteUrl,
    },
    image: post.cover
      ? post.cover.startsWith("http")
        ? post.cover
        : `${siteUrl}${post.cover}`
      : `${siteUrl}/brand/og.png`,
  };

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AuraBackground />
      <article className="relative z-10 mx-auto w-full max-w-3xl space-y-8">
        <Link
          href="/blog"
          className="inline-flex text-sm font-semibold text-white/70 transition hover:text-white"
        >
          {t.blog.backToList}
        </Link>

        <header className="space-y-4">
          <p className="text-xs font-semibold tracking-wide text-white/45">
            {t.blog.publishedAt} {post.date}
          </p>
          <h1 className="text-3xl font-black leading-tight sm:text-4xl">{post.title}</h1>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">{post.description}</p>
          {post.cover ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={post.cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : null}
        </header>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-5 sm:p-8">
          <BlogMarkdown content={post.content} />
        </div>

        <BlogCta />
      </article>
    </main>
  );
}
