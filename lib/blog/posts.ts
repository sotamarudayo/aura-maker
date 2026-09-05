import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function isPostMeta(data: Record<string, unknown>): data is {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
} {
  return (
    typeof data.slug === "string" &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    typeof data.date === "string"
  );
}

function readPostFile(fileName: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  if (!isPostMeta(data)) return null;
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.date,
    cover: typeof data.cover === "string" ? data.cover : undefined,
    content: content.trim(),
  };
}

export function getAllBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".md"));
  const posts = files
    .map((file) => readPostFile(file))
    .filter((post): post is BlogPost => Boolean(post))
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".md"));
  for (const file of files) {
    const post = readPostFile(file);
    if (post?.slug === slug) return post;
  }
  return null;
}

export function getBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
