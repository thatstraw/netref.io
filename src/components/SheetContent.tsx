"use client";

import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  Lightbulb,
  AlertCircle,
  Radiation,
  AlertTriangle,
  Quote,
  ArrowLeft,
  Share2,
  Clock,
  ChevronRight,
  List
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import Footer from "@/components/Footer";
import SheetCard from "@/components/SheetCard";
import type { ContentIndexItem } from "@/lib/content";

const AdmonitionContext = React.createContext(false);

export type SheetContentProps = {
  slug: string;
  vendorKey: string;
  title: string;
  description?: string;
  vendor?: { name: string; color: string; accent: string } | null;
  tags?: string[];
  content: string; // markdown
  related?: ContentIndexItem[];
};

export const SheetContent: React.FC<SheetContentProps> = ({
  slug,
  vendorKey,
  title,
  description,
  vendor,
  tags = [],
  content,
  related = [],
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const getText = (node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getText).join("");
    if (React.isValidElement(node)) return getText((node.props as any).children);
    return "";
  };

  const headings = useMemo(() => {
    const lines = content.split("\n");
    const hs: { level: number; text: string; id: string }[] = [];
    for (const line of lines) {
      // Only include H2 and H3 in TOC
      const m = /^(#{2,3})\s+(.*)/.exec(line.trim());
      if (m) {
        const level = m[1].length;
        const raw = m[2].replace(/`/g, "").trim();
        const id = slugify(raw);
        hs.push({ level, text: raw, id });
      }
    }
    return hs;
  }, [content]);

  const relatedCheats = related;

  useEffect(() => {
    if (!headings.length) return;
    const offset = 120;

    const calculateActive = () => {
      let current: string | null = headings[0]?.id ?? null;
      let bestTop = -Infinity;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - offset;
        if (top <= 0 && top > bestTop) {
          bestTop = top;
          current = h.id;
        }
      }
      setActiveId(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          calculateActive();
          ticking = false;
        });
      }
    };

    calculateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll as any);
    };
  }, [headings]);

  const handleTocClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const onShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Premium Header Section */}
      <header className="border-b bg-card pt-6 pb-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/browse" className="hover:text-foreground">Browse</Link>
            {vendor && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/browse?vendor=${vendor.name.toLowerCase()}`} className="hover:text-foreground">
                  {vendor.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{title}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {vendor && (
                  <Badge variant="outline" className={`border-current ${vendor.accent} bg-background/50 backdrop-blur-sm`}>
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${vendor.color}`} />
                    {vendor.name}
                  </Badge>
                )}
                <Badge variant="secondary" className="font-semibold tracking-wide uppercase text-[10px]">
                  Intermediate
                </Badge>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
                {title}
              </h1>

              {description && (
                <p className="mt-4 max-w-3xl text-lg text-muted-foreground/80 leading-relaxed">
                  {description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground/70">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
                <div className="flex items-center gap-3">
                  {tags.map((t) => (
                    <span key={t} className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:mt-2">
              <button
                onClick={onShare}
                className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:bg-muted active:scale-95"
              >
                <Share2 className="h-4 w-4" />
                {copied ? "Link Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
                <List className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold uppercase tracking-wider">Table of Contents</p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-2 py-4">
                {headings.length === 0 ? (
                  <p className="px-3 text-xs text-muted-foreground">No sections found</p>
                ) : (
                  <ul className="space-y-1">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={handleTocClick(h.id)}
                          data-active={activeId === h.id || undefined}
                          className={`
                            group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all
                            ${h.level > 2 ? 'ml-4 scale-95 border-l border-muted/50' : ''}
                            ${activeId === h.id
                              ? 'bg-primary/10 text-primary font-bold shadow-sm'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                          `}
                        >
                          {h.level === 2 && (
                            <span className={`h-1 w-1 rounded-full transition-all ${activeId === h.id ? 'bg-primary scale-150' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground'}`} />
                          )}
                          <span className="truncate">{h.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          {/* Markdown Content Section */}
          <section className="min-w-0">
            {/* Mobile TOC */}
            {headings.length > 0 && (
              <details className="mb-8 rounded-2xl border bg-card lg:hidden overflow-hidden shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-sm select-none">
                  <div className="flex items-center gap-2 text-primary">
                    <List className="h-4 w-4" />
                    Table of Contents
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <ul className="border-t bg-muted/10 p-4 space-y-2">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        onClick={handleTocClick(h.id)}
                        className={`block py-1 text-sm ${h.level > 2 ? 'pl-4 text-muted-foreground' : 'font-medium text-foreground'}`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <article className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, children, ...props }) => {
                    const text = getText(children);
                    const id = slugify(text);
                    return (
                      <h1 id={id} className="scroll-mt-32 text-3xl font-bold mt-12 mb-6 pb-2 inline-block relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:bg-primary" {...props}>
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ node, children, ...props }) => {
                    const text = getText(children);
                    const id = slugify(text);
                    return (
                      <h2 id={id} className="scroll-mt-32 text-2xl font-bold mt-10 mb-5 pb-2 border-b" {...props}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ node, children, ...props }) => {
                    const text = getText(children);
                    const id = slugify(text);
                    return (
                      <h3 id={id} className="scroll-mt-32 text-xl font-bold mt-8 mb-4 text-foreground" {...props}>
                        {children}
                      </h3>
                    );
                  },
                  p: ({ node, children, ...props }) => (
                    <p className="leading-relaxed text-muted-foreground/90 my-5 text-[15px]" {...props}>{children}</p>
                  ),
                  ul: ({ node, children, ...props }) => (
                    <ul className="list-disc pl-6 my-5 space-y-2 text-muted-foreground/90" {...props}>{children}</ul>
                  ),
                  ol: ({ node, children, ...props }) => (
                    <ol className="list-decimal pl-6 my-5 space-y-2 text-muted-foreground/90" {...props}>{children}</ol>
                  ),
                  hr: ({ node, ...props }) => <hr className="my-10 border-muted/50" {...props} />,
                  table: ({ node, children, ...props }) => (
                    <div className="my-10 overflow-hidden rounded-xl border border-muted/50 bg-card/30 shadow-sm backdrop-blur-[2px]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px] leading-relaxed border-collapse" {...props}>
                          {children}
                        </table>
                      </div>
                    </div>
                  ),
                  thead: ({ node, children, ...props }) => (
                    <thead className="bg-muted/40 border-b border-muted/50 text-foreground font-bold" {...props}>
                      {children}
                    </thead>
                  ),
                  tbody: ({ node, children, ...props }) => (
                    <tbody className="divide-y divide-muted/30" {...props}>
                      {children}
                    </tbody>
                  ),
                  tr: ({ node, children, ...props }) => (
                    <tr className="transition-colors hover:bg-muted/10 group/row" {...props}>
                      {children}
                    </tr>
                  ),
                  th: ({ node, children, ...props }) => (
                    <th className="px-6 py-4 font-bold border-x first:border-l-0 last:border-r-0 border-muted/30" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ node, children, ...props }) => (
                    <td className="px-6 py-4 text-muted-foreground/90 border-x first:border-l-0 last:border-r-0 border-muted/30 group-hover/row:text-foreground transition-colors" {...props}>
                      {children}
                    </td>
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const inAdmonition = React.useContext(AdmonitionContext);
                    const txt = String(children ?? "").trim();
                    const match = /language-(\w+)/.exec(className || "");
                    const isBlock = !!match || (!!className && className.includes("language-")) || txt.includes("\n");

                    if (!isBlock) {
                      return (
                        <code className="rounded bg-muted/60 px-1.5 py-0.5 text-[13px] font-mono font-medium text-foreground border border-muted" {...props}>
                          {children}
                        </code>
                      );
                    }
                    const lang = match ? match[1] : "bash";
                    return <CodeBlock code={txt} language={lang as any} noMargin={inAdmonition} />;
                  },
                  blockquote: ({ node, children, ...props }) => {
                    const types = {
                      NOTE: {
                        Icon: Info,
                        wrap: "border-emerald-500 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-300",
                        icon: "text-emerald-500",
                      },
                      TIP: {
                        Icon: Lightbulb,
                        wrap: "border-amber-500 bg-amber-50/50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-300",
                        icon: "text-amber-500",
                      },
                      IMPORTANT: {
                        Icon: AlertCircle,
                        wrap: "border-primary bg-primary/5 text-primary-900 dark:bg-primary/10 dark:text-primary-300",
                        icon: "text-primary",
                      },
                      WARNING: {
                        Icon: AlertTriangle,
                        wrap: "border-rose-500 bg-rose-50/50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-300",
                        icon: "text-rose-500",
                      },
                      CAUTION: {
                        Icon: Radiation,
                        wrap: "border-orange-500 bg-orange-50/50 text-orange-900 dark:bg-orange-500/10 dark:text-orange-300",
                        icon: "text-orange-500",
                      },
                    } as const;

                    const nodes = React.Children.toArray(children);
                    const markerLead = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

                    let firstIdx = -1;
                    let firstText = "";
                    for (let i = 0; i < nodes.length; i++) {
                      const n: any = nodes[i] as any;
                      const t = (typeof n === "string" ? n : getText((n as any)?.props?.children ?? n)) || "";
                      if (t.trim().length > 0) {
                        firstIdx = i;
                        firstText = t;
                        break;
                      }
                    }

                    if (firstIdx === -1) {
                      return (
                        <blockquote className="my-8 relative rounded-2xl border border-primary/10 bg-muted/5 p-6 sm:p-10" {...props}>
                          <Quote className="absolute top-6 left-6 size-10 text-primary/10 fill-primary/5" />
                          <div className="relative z-10 pl-10 italic text-foreground/80 leading-relaxed">
                            {children}
                          </div>
                        </blockquote>
                      );
                    }

                    const m = markerLead.exec(firstText);
                    if (!m) {
                      return (
                        <blockquote className="my-8 relative rounded-2xl border border-primary/10 bg-muted/5 p-6 sm:p-10" {...props}>
                          <Quote className="absolute top-6 left-6 size-10 text-primary/10 fill-primary/5" />
                          <div className="relative z-10 pl-10 italic text-foreground/80 leading-relaxed">
                            {children}
                          </div>
                        </blockquote>
                      );
                    }

                    const kind = m[1] as keyof typeof types;
                    const { Icon, wrap, icon } = types[kind];

                    // Recursive function to strip the marker from the first text node without losing React elements
                    const stripMarker = (node: React.ReactNode): React.ReactNode => {
                      if (typeof node === 'string') {
                        return node.replace(markerLead, "");
                      }
                      if (React.isValidElement(node) && (node.props as any).children) {
                        const childs = (node.props as any).children;
                        if (Array.isArray(childs)) {
                          const newChilds = [...childs];
                          for (let i = 0; i < newChilds.length; i++) {
                            const result = stripMarker(newChilds[i]);
                            if (result !== newChilds[i]) {
                              newChilds[i] = result;
                              return React.cloneElement(node, (node.props as any), ...newChilds);
                            }
                          }
                        } else {
                          const result = stripMarker(childs);
                          if (result !== childs) {
                            return React.cloneElement(node, (node.props as any), result);
                          }
                        }
                      }
                      return node;
                    };

                    const newContent = [...nodes] as any[];
                    newContent[firstIdx] = stripMarker(nodes[firstIdx]);

                    return (
                      <AdmonitionContext.Provider value={true}>
                        <div className={`my-8 rounded-xl border-l-[6px] p-6 shadow-sm ${wrap}`} {...(props as any)}>
                          <div className="flex gap-4">
                            <div className={`mt-0.5 shrink-0 rounded-full bg-background p-1.5 shadow-sm ${icon}`}>
                              <Icon aria-hidden className="size-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className={`text-[11px] font-bold uppercase tracking-widest ${icon}`}>
                                {kind}
                              </p>
                              <div className="prose-sm leading-relaxed opacity-90">
                                {newContent}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AdmonitionContext.Provider>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </section>
        </div>
      </div>

      {/* Related Content */}
      {relatedCheats.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4 border-t pt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              More {vendor?.name} Cheat Sheets
            </h2>
            <Link
              href={`/browse?vendor=${vendorKey}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all {vendor?.name} guides
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCheats.map((sheet) => (
              <SheetCard key={sheet.slug} sheet={sheet} />
            ))}
          </div>
        </section>
      )}

      {/* Footer at the end of content */}
      <Footer />
    </div>
  );
};

export default SheetContent;