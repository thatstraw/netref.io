#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const OUTPUT_DIR = path.join(ROOT, "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "search-index.json");

function isMarkdown(file) {
  return file.endsWith(".md") || file.endsWith(".mdx");
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip shared assets directory
      if (entry.name === "_shared") continue;
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function extractHeadingsAndCode(markdown) {
  const headings = [];
  const codeBlocks = [];

  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = /^(#{2,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      headings.push(headingMatch[2].trim());
    }
  }

  const codeRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)\n```/g;
  let m;
  while ((m = codeRegex.exec(markdown)) !== null) {
    const lang = (m[1] || "").trim();
    const code = m[2] || "";
    codeBlocks.push({ lang, code });
  }

  return { headings, codeBlocks };
}

async function main() {
  try {
    await fs.access(CONTENT_DIR);
  } catch {
    console.error("src/content not found");
    process.exit(1);
  }

  const docs = [];

  for await (const file of walk(CONTENT_DIR)) {
    if (!isMarkdown(file)) continue;

    const rel = path.relative(CONTENT_DIR, file).replace(/\\/g, "/");
    const vendor = rel.split("/")[0];

    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);

    const { headings, codeBlocks } = extractHeadingsAndCode(content);

    const id = `${data.vendor || vendor}:${data.feature || path.basename(file)}`;
    const route = `/${vendor}/${(data.feature || path.basename(file).replace(/\.(md|mdx)$/i, "")).toLowerCase()}`;

    docs.push({
      id,
      route,
      title: data.title || "",
      vendor: (data.vendor || vendor || "").toLowerCase(),
      feature: (data.feature || "").toLowerCase(),
      category: data.category || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      headings,
      code: codeBlocks.map((b) => b.code).join("\n\n"),
      // lightweight body for preview/snippets (first 300 chars)
      excerpt: String(content).slice(0, 300),
    });
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(docs, null, 2), "utf8");
  console.log(`✔ Search index generated: ${path.relative(ROOT, OUTPUT_FILE)} (${docs.length} docs)`);
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});