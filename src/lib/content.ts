import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { CHEATS, VENDORS, type CheatSheet, type VendorKey } from "./cheats";

export type ContentIndexItem = {
    slug: string;
    title: string;
    vendor: VendorKey;
    description: string;
    tags: string[];
    modified: number;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
};

/**
 * Indexes all content from both the static CHEATS array 
 * and the src/content directory (markdown files).
 */
export async function getAllContentIndex(): Promise<ContentIndexItem[]> {
    const root = process.cwd();
    const contentDir = path.join(root, "src", "content");
    const items: ContentIndexItem[] = [];

    // 1. Add static cheats
    for (const c of CHEATS) {
        items.push({
            slug: c.slug,
            title: c.title,
            vendor: c.vendor,
            description: c.description,
            tags: c.tags,
            modified: 0, // static content priority 0
            difficulty: c.difficulty,
        });
    }

    // 2. Add markdown content
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
                    const difficulty = data.difficulty ? (String(data.difficulty) as "Beginner" | "Intermediate" | "Advanced") : undefined;
                    const stat = await fs.stat(filePath);

                    // Avoid duplicates if a static cheat has the same slug
                    if (!items.find(i => i.slug === slug)) {
                        items.push({
                            slug,
                            title,
                            vendor,
                            description,
                            tags,
                            modified: stat.mtimeMs,
                            difficulty
                        });
                    }
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

export async function getRelatedContent(currentSlug: string, vendorKey: string, limit = 3): Promise<ContentIndexItem[]> {
    const all = await getAllContentIndex();
    return all
        .filter((c) => c.vendor === vendorKey && c.slug !== currentSlug)
        .sort((a, b) => b.modified - a.modified) // Show newest first
        .slice(0, limit);
}
