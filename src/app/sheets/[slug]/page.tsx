// server component

import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { getVendorByKey, findCheatBySlug } from "@/lib/cheats";
import SheetContent from "@/components/SheetContent";

export default async function SheetViewerPage({
  params,
}: {
  params: { slug: string | string[] };
}) {
  const p = await params;
  const slug = Array.isArray(p.slug) ? p.slug[0] : (p.slug as string);
  const vendorKey = slug.split("-")[0];

  // Try to read Markdown from src/content/{vendor}/{name}.md
  const tryReadMarkdown = async () => {
    const parts = slug.split("-");
    if (parts.length < 2) return null;
    const vendorKey = parts[0];
    const nameFromSlug = parts.slice(1).join("-");
    const vendorDir = path.join(process.cwd(), "src", "content", vendorKey);

    try {
      // 1. Try direct filename match first (fast)
      const directPath = path.join(vendorDir, `${nameFromSlug}.md`);
      try {
        const raw = await fs.readFile(directPath, "utf8");
        const { data, content } = matter(raw);
        const feature = String(data.feature || nameFromSlug);
        // Ensure this file actually owns this slug
        if (feature === nameFromSlug) {
          const vendor = getVendorByKey(String(data.vendor || vendorKey) as any);
          return {
            title: String(data.title || slug.replace(/-/g, " ")),
            description: data.description ? String(data.description) : undefined,
            tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
            vendor,
            content,
          } as const;
        }
      } catch {
        // Direct match failed or didn't own the slug, proceed to scan
      }

      // 2. Scan directory for a file that specifies this feature (fallback)
      const entries = await fs.readdir(vendorDir);
      for (const entry of entries) {
        if (!/\.(md|mdx)$/i.test(entry)) continue;
        const filePath = path.join(vendorDir, entry);
        const raw = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(raw);

        const feature = String(data.feature || path.basename(entry, path.extname(entry)));
        if (feature === nameFromSlug) {
          const vendor = getVendorByKey(String(data.vendor || vendorKey) as any);
          return {
            title: String(data.title || slug.replace(/-/g, " ")),
            description: data.description ? String(data.description) : undefined,
            tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
            vendor,
            content,
          } as const;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const md = await tryReadMarkdown();
  if (md) {
    return (
      <SheetContent
        slug={slug}
        vendorKey={vendorKey}
        title={md.title}
        description={md.description}
        vendor={md.vendor ? { name: md.vendor.name, color: md.vendor.color, accent: md.vendor.accent } : null}
        tags={md.tags}
        content={md.content}
      />
    );
  }

  // Fallback to in-memory CHEATS data
  const sheet = findCheatBySlug(slug);
  if (!sheet) return notFound();
  const vendor = getVendorByKey(sheet.vendor);

  return (
    <SheetContent
      slug={slug}
      vendorKey={sheet.vendor}
      title={sheet.title}
      description={sheet.description}
      vendor={vendor ? { name: vendor.name, color: vendor.color, accent: vendor.accent } : null}
      tags={sheet.tags}
      content={sheet.content}
    />
  );
}