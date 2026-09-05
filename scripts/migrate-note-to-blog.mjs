import fs from "node:fs";

const posts = [
  {
    src: "content/note/01-mbti-kakure-aura.md",
    out: "content/blog/mbti-kakure-aura.md",
    slug: "mbti-kakure-aura",
    title: "【MBTI別】16タイプが友達から言われがちな「隠れオーラ」まとめ",
    description:
      "MBTIの自己イメージと、友達目線のオーラが一致しない理由を16タイプ別に解説。AuraMakerの他人目線診断と重ねて読めます。",
    date: "2026-09-04",
    cover: "/blog/mbti-kakure-aura-cover.png",
  },
  {
    src: "content/note/02-chaos-ecology.md",
    out: "content/blog/chaos-ecology.md",
    slug: "chaos-ecology",
    title: "【カオス系】盛り上げ番長・むっつりど変態の生態を徹底分析してみた",
    description:
      "盛り上げ番長・むっつりど変態などカオス系オーラの生息地・弱点・危険ワードを公式設定に沿って解剖。",
    date: "2026-09-04",
    cover: "/blog/chaos-ecology-cover.png",
  },
  {
    src: "content/note/03-instagram-vote-templates.md",
    out: "content/blog/instagram-vote-templates.md",
    slug: "instagram-vote-templates",
    title: "【コピペOK】インスタストーリーで自然に投票を集める投稿テンプレート5選",
    description:
      "AuraMakerの投票URLを送りづらい人向け。インスタストーリー・LINE・Xで使えるコピペテンプレ5選。",
    date: "2026-09-04",
    cover: "/blog/instagram-vote-templates-cover.png",
  },
];

for (const post of posts) {
  let body = fs.readFileSync(post.src, "utf8");
  body = body.replace(/^# .+\r?\n+/, "");
  body = body.replace(/^>[\s\S]*?\n---\r?\n+/, "");
  body = body.replace(/\n---\r?\n+### ハッシュタグ[\s\S]*$/, "\n");

  if (post.slug === "instagram-vote-templates") {
    body = body.replace(
      "この記事では、インスタストーリーにそのまま貼れる文面を5つ用意しました。",
      "この記事では、インスタストーリーにそのまま貼れる文面を5つ用意しました。\n\n![ストーリー参考ビジュアル](/blog/instagram-story-visual.png)",
    );
  }

  body = body.replace(
    /次の記事では、SNS事故率（褒め言葉）が高い「カオス系オーラ」を徹底解剖します。\r?\n盛り上げ番長・むっつりど変態の生態が気になる人は、そちらもどうぞ。/,
    "次は [カオス系オーラの生態分析](/blog/chaos-ecology) もどうぞ。\nオーラ図鑑は [こちら](/auras)。",
  );
  body = body.replace(
    /次は「インスタストーリーで自然に投票を集める投稿テンプレ5選」も公開予定。\r?\nURLは作ったのに送りづらい人は、そちらをコピペしてください。/,
    "投票リンクの送り方は [インスタストーリー用テンプレ5選](/blog/instagram-vote-templates) もどうぞ。\nオーラ図鑑は [こちら](/auras)。",
  );
  body = body.replace(
    "固定記事の「MBTI別・隠れオーラまとめ」とあわせて読むと、結果のネタ化がさらにうまくいきます。",
    "[MBTI別・隠れオーラまとめ](/blog/mbti-kakure-aura) とあわせて読むと、結果のネタ化がさらにうまくいきます。\nオーラ図鑑は [こちら](/auras)。",
  );

  const fm = [
    "---",
    `slug: ${post.slug}`,
    `title: "${post.title}"`,
    `description: "${post.description}"`,
    `date: "${post.date}"`,
    `cover: "${post.cover}"`,
    "---",
    "",
    body.trim(),
    "",
  ].join("\n");

  fs.writeFileSync(post.out, fm, "utf8");
  console.log("wrote", post.out);
}
