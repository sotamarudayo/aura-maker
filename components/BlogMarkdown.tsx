import ReactMarkdown from "react-markdown";

type BlogMarkdownProps = {
  content: string;
};

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-10 text-3xl font-black leading-tight text-white first:mt-0 sm:text-4xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-10 border-b border-white/10 pb-2 text-xl font-black text-white sm:text-2xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 text-lg font-bold text-white sm:text-xl">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/80 sm:text-base">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/80 sm:text-base">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-semibold text-cyan-200 underline decoration-cyan-200/40 underline-offset-2 hover:text-cyan-100"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ""}
              className="mt-4 w-full rounded-2xl border border-white/10"
            />
          ) : null,
        blockquote: ({ children }) => (
          <blockquote className="mt-4 border-l-2 border-violet-300/50 pl-4 text-sm text-white/70 sm:text-base">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-violet-100">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/85">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm text-white/80">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-white/20 px-3 py-2 font-bold text-white">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-white/10 px-3 py-2 align-top">{children}</td>
        ),
        hr: () => <hr className="my-8 border-white/10" />,
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
