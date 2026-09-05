import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BLOG_DIR = path.join(process.cwd(), "public", "blog");
const MAX_WIDTH = 1280;
const WEBP_QUALITY = 78;

async function compressFile(fileName) {
  const inputPath = path.join(BLOG_DIR, fileName);
  const base = fileName.replace(/\.(png|jpe?g|webp)$/i, "");
  const outputPath = path.join(BLOG_DIR, `${base}.webp`);

  const before = fs.statSync(inputPath).size;
  await sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);
  const after = fs.statSync(outputPath).size;
  console.log(
    `${fileName} -> ${base}.webp  ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`,
  );
  return `${base}.webp`;
}

async function updateMarkdownCovers(renames) {
  const contentDir = path.join(process.cwd(), "content", "blog");
  const files = fs.readdirSync(contentDir).filter((name) => name.endsWith(".md"));
  for (const file of files) {
    const full = path.join(contentDir, file);
    let text = fs.readFileSync(full, "utf8");
    let changed = false;
    for (const [from, to] of renames) {
      const fromPath = `/blog/${from}`;
      const toPath = `/blog/${to}`;
      if (text.includes(fromPath)) {
        text = text.split(fromPath).join(toPath);
        changed = true;
      }
    }
    // also rewrite generic .png covers under /blog/
    const next = text.replace(/(\/blog\/[a-z0-9-]+)\.png/gi, "$1.webp");
    if (next !== text) {
      text = next;
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(full, text, "utf8");
      console.log("updated", file);
    }
  }
}

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((name) => /\.(png|jpe?g)$/i.test(name));

const renames = [];
for (const file of files) {
  const webp = await compressFile(file);
  renames.push([file, webp]);
}

await updateMarkdownCovers(renames);
console.log("done");
