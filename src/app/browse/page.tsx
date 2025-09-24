import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import Link from "next/link";
import SheetCard from "@/components/SheetCard";
import { VENDORS, type VendorKey } from "@/lib/cheats";

async function readContentIndex() {
  const root = process.cwd();
  const contentDir = path.join(root, "src", "content");
  const items: Array<{
    slug: string;
    title: string;
    vendor: VendorKey;
    description: string;
    tags: string[];
    modified: number;
  }> = [];

  for (const v of VENDORS) {
    const vendorDir = path.join(contentDir, v.key);
    try {
      const entries = await fs.readdir(vendorDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!/\.(md|mdx)$/i.test(entry.name)) continue;
        const filePath = path.join(vendorDir, entry.name);
        try {
          const raw = await fs.readFile(filePath, "utf8");
          const { data } = matter(raw);
          const feature = String(data.feature || path.basename(entry.name, path.extname(entry.name)));
          const title = String(data.title || `${v.name} ${feature}`);
          const description = String(data.description || "");
          const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
          const vendor = v.key as VendorKey;
          const slug = `${vendor}-${feature}`;
          const stat = await fs.stat(filePath);
          items.push({ slug, title, vendor, description, tags, modified: stat.mtimeMs });
        } catch {
          // skip bad file
        }
      }
    } catch {
      // vendor directory may not exist yet
    }
  }

  return items;
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; vendor?: VendorKey };
}) {
  const params = await searchParams;
  const q = (params?.q || "").toLowerCase().trim();
  const vendorFilter = (params?.vendor as VendorKey | undefined) || undefined;

  const all = await readContentIndex();

  const results = all
    .filter((c) => {
      const matchesVendor = vendorFilter ? c.vendor === vendorFilter : true;
      const matchesQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return matchesVendor && matchesQ;
    })
    .sort((a, b) => b.modified - a.modified);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Browse Cheat Sheets</h1>

      <form method="GET" className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          name="q"
          defaultValue={searchParams?.q || ""}
          placeholder="Search by title, tags, description..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {/* All vendors */}
          <Link
            href={`/browse${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-md border px-3 py-2 text-sm ${!vendorFilter ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            All vendors
          </Link>
          {VENDORS.map((v) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("vendor", v.key);
            const href = `/browse?${params.toString()}`;
            const active = vendorFilter === v.key;
            return (
              <Link
                key={v.key}
                href={href}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted ${active ? "ring-2 ring-ring" : ""}`}
              >
                <span className={`h-2 w-2 rounded-full ${v.color}`} /> {v.name}
              </Link>
            );
          })}
        </div>
        <button type="submit" className="rounded-md border px-3 py-2 text-sm hover:bg-muted md:ml-auto">
          Apply
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((sheet) => (
          <SheetCard key={sheet.slug} sheet={sheet} />
        ))}
        {results.length === 0 && (
          <div className="col-span-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
            No results. Try adjusting your search or vendor filter.
          </div>
        )}
      </div>
    </main>
  );
}