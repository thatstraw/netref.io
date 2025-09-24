"use client";

import Link from "next/link";
import { getVendorByKey, type CheatSheet } from "@/lib/cheats";

export default function SheetCard({ sheet }: { sheet: Pick<CheatSheet, "slug" | "title" | "vendor" | "description" | "tags" | "difficulty"> }) {
  const vendor = getVendorByKey(sheet.vendor);
  return (
    <div className="relative group flex h-full min-h-[128px] flex-col rounded-xl border bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ring-1 ring-transparent hover:ring-primary/30">
      <Link href={`/sheets/${sheet.slug}`} aria-label={sheet.title} className="absolute inset-0" />

      {sheet.difficulty && (
        <span
          className={
            "pointer-events-none absolute right-4 top-4 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
            (sheet.difficulty === "Beginner"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
              : sheet.difficulty === "Intermediate"
              ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30")
          }
        >
          {sheet.difficulty}
        </span>
      )}

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${vendor?.accent}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${vendor?.color}`} /> {vendor?.name}
        </span>
      </div>
      <h3 className="mt-1 mb-1 text-base font-semibold leading-snug group-hover:underline">
        {sheet.title}
      </h3>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{sheet.description}</p>
    </div>
  );
}