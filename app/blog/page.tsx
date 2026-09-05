import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AuraBackground from "@/components/AuraBackground";
import { getAllBlogPosts } from "@/lib/blog/posts";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { getSeoCopy } from "@/lib/i18n/seo";
import { getMessages } from "@/lib/i18n/messages";
import { getServerLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const seo = getSeoCopy(locale);
  return buildPageMetadata({
    locale,
    title: seo.blogTitle,
    description: seo.blogDescription,
    path: "/blog",
  });
}

export default async function BlogIndexPage() {
  const locale = await getServerLocale();
  const t = getMessages(locale);
  const posts = getAllBlogPosts();

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-8 text-white sm:py-12">
      <AuraBackground />
      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-black sm:text-4xl">{t.blog.title}</h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base">{t.blog.sub}</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-center text-white/60">{t.blog.empty}</p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-white/15 bg-black/30 transition hover:border-violet-300/40 hover:bg-white/5"
                >
                  {post.cover ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10">
                      <Image
                        src={post.cover}
                        alt=""
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 768px"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-2 p-5">
                    <p className="text-xs font-semibold tracking-wide text-white/45">
                      {t.blog.publishedAt} {post.date}
                    </p>
                    <h2 className="text-xl font-black leading-snug text-white group-hover:text-violet-100">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-white/70">{post.description}</p>
                    <p className="pt-1 text-sm font-semibold text-cyan-200">{t.blog.readMore}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
