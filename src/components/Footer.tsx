"use client";

import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-24 border-t border-muted bg-muted/40 py-12 lg:py-20 shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)]">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand section */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-xl font-bold tracking-tight">
                            NetRef
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Modern network configuration cheat sheets for quick reference in the data center or lab.
                        </p>
                    </div>

                    {/* Popular Vendors */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Popular</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/browse?vendor=cisco" className="text-sm text-muted-foreground transition-colors hover:text-primary">Cisco</Link>
                            <Link href="/browse?vendor=juniper" className="text-sm text-muted-foreground transition-colors hover:text-primary">Juniper</Link>
                            <Link href="/browse?vendor=fortinet" className="text-sm text-muted-foreground transition-colors hover:text-primary">Fortinet</Link>
                            <Link href="/browse?vendor=linux" className="text-sm text-muted-foreground transition-colors hover:text-primary">Linux</Link>
                        </nav>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Categories</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/browse?q=routing" className="text-sm text-muted-foreground transition-colors hover:text-primary">Routing</Link>
                            <Link href="/browse?q=switching" className="text-sm text-muted-foreground transition-colors hover:text-primary">Switching</Link>
                            <Link href="/browse?q=security" className="text-sm text-muted-foreground transition-colors hover:text-primary">Security</Link>
                            <Link href="/browse?q=services" className="text-sm text-muted-foreground transition-colors hover:text-primary">Services</Link>
                        </nav>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Resources</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/browse" className="text-sm text-muted-foreground transition-colors hover:text-primary">Browse All</Link>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Github className="size-4" /> GitHub
                            </a>
                            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Home</Link>
                        </nav>
                    </div>
                </div>

                <div className="mt-12 border-t border-muted/50 pt-8 text-center lg:mt-16">
                    <p className="text-xs font-medium text-muted-foreground/60">
                        © {new Date().getFullYear()} NetRef. Built for network engineers, by network engineers.
                    </p>
                </div>
            </div>
        </footer>
    );
}
