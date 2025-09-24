"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, LogIn, Github } from "lucide-react";
import React from "react";
import { VENDORS } from "@/lib/cheats";

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const [vendorOpen, setVendorOpen] = React.useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`px-3 py-2 text-sm rounded-md hover:bg-muted ${pathname === href ? "font-semibold" : ""}`}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden rounded-md p-2 hover:bg-muted" onClick={() => setOpen((v) => !v)}>
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="font-bold">
              NetSheets
            </Link>
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  className="ml-2 inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setVendorOpen((v) => !v)}
                >
                  Vendors <ChevronDown className={`h-4 w-4 transition ${vendorOpen ? "rotate-180" : ""}`} />
                </button>
                {vendorOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg border bg-background p-2 shadow-lg">
                    {VENDORS.map((v) => (
                      <Link
                        key={v.key}
                        href={`/browse?vendor=${v.key}`}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                        onClick={() => setVendorOpen(false)}
                      >
                        <span className={`h-2 w-2 rounded-full ${v.color}`} /> {v.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <NavLink href="/browse">Browse</NavLink>
              <NavLink href="/submit">Submit</NavLink>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-sm rounded-md hover:bg-muted inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" /> Star
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted inline-flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Sign in
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col">
            <div className="py-1">
              <button className="w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setVendorOpen((v) => !v)}>
                Vendors <ChevronDown className={`ml-1 inline h-4 w-4 ${vendorOpen ? "rotate-180" : ""}`} />
              </button>
              {vendorOpen && (
                <div className="mt-1 space-y-1">
                  {VENDORS.map((v) => (
                    <Link
                      key={v.key}
                      href={`/browse?vendor=${v.key}`}
                      className="block rounded-md px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      {v.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/browse" className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              Browse
            </Link>
            <Link href="/submit" className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              Submit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}