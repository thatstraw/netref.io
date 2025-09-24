#!/usr/bin/env node
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const REQUIRED_FIELDS = [
  "title",
  "vendor",
  "feature",
  "category",
  "tags",
  "description",
];
const ALLOWED_VENDORS = new Set([
  "cisco",
  "juniper",
  "fortinet",
  "palo-alto",
  "mikrotik",
]);

function isMarkdown(file) {
  return file.endsWith(".md") || file.endsWith(".mdx");
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function error(msg, file) {
  return `❌ ${file}: ${msg}`;
}

function warn(msg, file) {
  return `⚠️  ${file}: ${msg}`;
}

function slugify(s) {
  return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  const problems = [];
  try {
    await fs.access(CONTENT_DIR);
  } catch {
    console.error("src/content not found");
    process.exit(1);
  }

  for await (const file of walk(CONTENT_DIR)) {
    const rel = path.relative(ROOT, file);
    if (!isMarkdown(file)) continue;
    if (rel.includes(`${path.sep}_shared${path.sep}`)) continue; // skip shared assets

    const raw = await fs.readFile(file, "utf8");
    const { data } = matter(raw);

    // Required fields present
    for (const key of REQUIRED_FIELDS) {
      if (data[key] === undefined || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0) || (typeof data[key] === "string" && data[key].trim() === "")) {
        problems.push(error(`Missing required frontmatter field: '${key}'`, rel));
      }
    }

    // Validate vendor directory alignment
    const vendorDir = path.basename(path.dirname(file));
    if (!ALLOWED_VENDORS.has(vendorDir)) {
      problems.push(error(`File placed under unknown vendor directory '${vendorDir}'`, rel));
    }

    if (typeof data.vendor !== "string" || !ALLOWED_VENDORS.has(data.vendor)) {
      problems.push(error(`Frontmatter vendor must be one of ${Array.from(ALLOWED_VENDORS).join(", ")}`, rel));
    }

    if (data.vendor && data.vendor !== vendorDir) {
      problems.push(error(`Frontmatter vendor '${data.vendor}' does not match directory '${vendorDir}'`, rel));
    }

    // Feature should match filename (without extension)
    const base = path.basename(file).replace(/\.(md|mdx)$/i, "");
    if (typeof data.feature !== "string" || slugify(data.feature) !== slugify(base)) {
      problems.push(error(`Frontmatter feature '${data.feature}' must match filename '${base}'`, rel));
    }

    // Basic type validations
    if (data.tags && !Array.isArray(data.tags)) {
      problems.push(error(`'tags' must be an array of strings`, rel));
    }
    if (data.tested_on && !Array.isArray(data.tested_on)) {
      problems.push(error(`'tested_on' should be an array of strings`, rel));
    }
    if (data.related && !Array.isArray(data.related)) {
      problems.push(error(`'related' should be an array of route paths`, rel));
    }

    // Date format check (YYYY-MM-DD) when provided
    if (data.last_verified) {
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(String(data.last_verified));
      if (!ok) {
        problems.push(error(`'last_verified' must be in format YYYY-MM-DD`, rel));
      }
    }

    // Difficulty one-of
    const allowedDifficulties = new Set(["beginner", "intermediate", "advanced"]);
    if (data.difficulty && !allowedDifficulties.has(String(data.difficulty))) {
      problems.push(error(`'difficulty' must be one of beginner|intermediate|advanced`, rel));
    }

    // Optional: description length guidance
    if (typeof data.description === "string" && data.description.length < 20) {
      problems.push(warn(`'description' is quite short (<20 chars)`, rel));
    }
  }

  if (problems.length) {
    for (const p of problems) console.error(p);
    console.error(`\n✖ Validation failed with ${problems.length} issue(s).`);
    process.exit(1);
  } else {
    console.log("✔ All content frontmatter validated successfully.");
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});