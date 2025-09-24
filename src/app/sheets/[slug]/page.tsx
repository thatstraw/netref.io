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

  // Try to read Markdown from src/content/{vendor}/{name}.md derived from slug "vendor-name"
  const tryReadMarkdown = async () => {
    const parts = slug.split("-");
    if (parts.length < 2) return null;
    const vendorKey = parts[0];
    const name = parts.slice(1).join("-");
    const filePath = path.join(process.cwd(), "src", "content", vendorKey, `${name}.md`);
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(raw);
      const vendor = getVendorByKey(String(data.vendor || vendorKey) as any);
      return {
        title: String(data.title || slug.replace(/-/g, " ")),
        description: data.description ? String(data.description) : undefined,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        vendor,
        content,
      } as const;
    } catch {
      return null;
    }
  };

  const md = await tryReadMarkdown();
  if (md) {
    return (
      <SheetContent
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
      title={sheet.title}
      description={sheet.description}
      vendor={vendor ? { name: vendor.name, color: vendor.color, accent: vendor.accent } : null}
      tags={sheet.tags}
      content={sheet.content}
    />
  );
}