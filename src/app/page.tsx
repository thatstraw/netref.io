"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SheetCard from "@/components/SheetCard";
import { CHEATS, VENDORS } from "@/lib/cheats";
import { Search, Network } from "lucide-react";
import type { ComponentType } from "react";

import {
  SiCisco,
  SiFortinet,
  SiMikrotik,
  SiPaloaltonetworks,
  SiLinux,
  SiJunipernetworks,
} from "react-icons/si";

const vendorIcons: Record<string, ComponentType<{ className?: string }> | null> = {
  cisco: SiCisco,
  juniper: SiJunipernetworks,
  fortinet: SiFortinet,
  mikrotik: SiMikrotik,
  paloalto: SiPaloaltonetworks,
  linux: SiLinux,
  edimax: null, // fallback icon
  sophos: null, // fallback icon
};

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const featured = CHEATS.slice(0, 4);
  const recent = CHEATS.slice(-4).reverse();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(`/browse${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-accent/40 to-transparent dark:from-accent/10 bg-[radial-gradient(60%_60%_at_50%_-10%,var(--color-accent)/0.6,transparent)] dark:bg-[radial-gradient(60%_60%_at_50%_-10%,var(--color-accent)/0.15,transparent)]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-balance text-4xl font-semibold sm:text-6xl">NetRef Network Reference Library</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Quick reference guides for modern networking. Find exactly what you need, when you need it.
          </p>

          {/* Search */}
          <form onSubmit={onSearch} className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border bg-card/70 p-2 shadow-sm backdrop-blur focus-within:ring-2 focus-within:ring-primary">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for Cisco, Juniper, OSPF, BGP..."
                className="w-full bg-transparent pl-9 pr-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90">
              Search
            </button>
          </form>

          {/* Hero badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border px-3 py-1">50+ References</span>
            <span className="rounded-full border px-3 py-1">Quick Access</span>
            <span className="rounded-full border px-3 py-1">Config Examples</span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/browse" className="rounded-md border bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Browse All References
            </Link>
            <Link href="/submit" className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted">
              Contribute a Reference
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Technology / Vendors */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Browse by Technology</h2>
          <p className="mt-2 text-sm text-muted-foreground">Quick access to vendor-focused references</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 auto-rows-fr items-stretch">
          {VENDORS.slice(0, 16).map((v) => (
            <Link
              key={v.key}
              href={`/browse?vendor=${v.key}`}
              className="group relative w-full min-h-[112px] overflow-hidden rounded-xl border bg-card p-4 transition-all hover:bg-accent/50 ring-1 ring-transparent hover:ring-primary/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComp = vendorIcons[v.key] ?? Network;
                  return (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-secondary ${v.accent}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                  );
                })()}
                <span className="text-sm font-medium group-hover:underline">{v.name}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Explore {v.name} guides</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link href="/browse" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Show More
          </Link>
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-2 text-xl font-semibold">Popular References</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch">
          {featured.map((sheet) => (
            <div key={sheet.id} className="w-full h-full">
              <SheetCard sheet={sheet} />
            </div>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recently Added</h2>
          <Link href="/browse" className="text-sm text-muted-foreground hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch">
          {recent.map((sheet) => (
            <div key={sheet.id} className="w-full h-full">
              <SheetCard sheet={sheet} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NetRef. Built for network engineers.</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Link href="/browse" className="hover:underline">Browse</Link>
            <span>•</span>
            <Link href="/submit" className="hover:underline">Submit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}