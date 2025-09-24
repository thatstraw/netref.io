"use client";

import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Info, Lightbulb, AlertCircle, Radiation, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export type SheetContentProps = {
  title: string;
  description?: string;
  vendor?: { name: string; color: string; accent: string } | null;
  tags?: string[];
  content: string; // markdown
};

export const SheetContent: React.FC<SheetContentProps> = ({
  title,
  description,
  vendor,
  tags = [],
  content,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  // Extract plain text from React children (handles inline code in headings)
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
      const m = /^(#{1,4})\s+(.*)/.exec(line.trim());
      if (m) {
        const level = m[1].length;
        const raw = m[2].replace(/`/g, "").trim();
        const id = slugify(raw);
        hs.push({ level, text: raw, id });
      }
    }
    return hs;
  }, [content]);

  // Scrollspy: set activeId to the nearest heading in view
  useEffect(() => {
    if (!headings.length) return;
    const offset = 96; // approx navbar + spacing

    const calculateActive = () => {
      let current: string | null = headings[0]?.id ?? null;
      let bestTop = -Infinity;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - offset;
        // choose the last heading that has crossed the offset
        if (top <= 0 && top > bestTop) {
          bestTop = top;
          current = h.id;
        }
      }
      // if none passed offset yet, pick the first upcoming
      if (bestTop === -Infinity) {
        let upcoming: string | null = headings[0]?.id ?? null;
        let minTop = Infinity;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top - offset;
          if (top < minTop) {
            minTop = top;
            upcoming = h.id;
          }
        }
        setActiveId(upcoming);
      } else {
        setActiveId(current);
      }
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

  const indentClass = (level: number) => {
    switch (level) {
      case 2:
        return "pl-3";
      case 3:
        return "pl-6";
      case 4:
        return "pl-9";
      default:
        return "pl-0";
    }
  };

  const handleTocClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        {vendor && (
          <div className="mb-2 inline-flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${vendor.color}`} />
            <span className={`${vendor.accent}`}>{vendor.name}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
        {!!tags?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-md border bg-card p-4 text-sm">
            <p className="mb-2 font-semibold">Table of Contents</p>
            {headings.length === 0 ? (
              <p className="text-muted-foreground">No sections</p>
            ) : (
              <ul className="space-y-1">
                {headings.map((h) => (
                  <li key={h.id} className={indentClass(h.level)}>
                    <a
                      href={`#${h.id}`}
                      onClick={handleTocClick(h.id)}
                      data-active={activeId === h.id || undefined}
                      className="block rounded px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-muted transition-colors data-[active=true]:bg-secondary data-[active=true]:text-foreground data-[active=true]:font-medium data-[active=true]:border-l-2 data-[active=true]:pl-[6px] data-[active=true]:border-primary"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section>
          {headings.length > 0 && (
            <details className="mb-4 rounded-md border bg-card p-4 lg:hidden">
              <summary className="cursor-pointer font-semibold">Table of Contents</summary>
              <ul className="mt-2 space-y-1">
                {headings.map((h) => (
                  <li key={h.id} className={indentClass(h.level)}>
                    <a
                      href={`#${h.id}`}
                      onClick={handleTocClick(h.id)}
                      data-active={activeId === h.id || undefined}
                      className="block rounded px-2 py-1 text-foreground/70 hover:text-foreground hover:bg-muted transition-colors data-[active=true]:bg-secondary data-[active=true]:text-foreground data-[active=true]:font-medium data-[active=true]:border-l-2 data-[active=true]:pl-[6px] data-[active=true]:border-primary"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <article className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, children, ...props }) => {
                  const text = getText(children);
                  const id = slugify(text);
                  return (
                    <h1 id={id} className="scroll-mt-24 text-2xl font-bold mt-6 mb-2" {...props}>
                      {children}
                    </h1>
                  );
                },
                h2: ({ node, children, ...props }) => {
                  const text = getText(children);
                  const id = slugify(text);
                  return (
                    <h2 id={id} className="scroll-mt-24 text-xl font-semibold mt-6 mb-2" {...props}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const text = getText(children);
                  const id = slugify(text);
                  return (
                    <h3 id={id} className="scroll-mt-24 text-lg font-semibold mt-4 mb-2" {...props}>
                      {children}
                    </h3>
                  );
                },
                h4: ({ node, children, ...props }) => {
                  const text = getText(children);
                  const id = slugify(text);
                  return (
                    <h4 id={id} className="scroll-mt-24 font-semibold mt-3 mb-2" {...props}>
                      {children}
                    </h4>
                  );
                },
                p: ({ node, children, ...props }) => (
                  <p className="leading-7 text-foreground/90 my-3" {...props}>{children}</p>
                ),
                ul: ({ node, children, ...props }) => (
                  <ul className="list-disc pl-6 my-3" {...props}>{children}</ul>
                ),
                ol: ({ node, children, ...props }) => (
                  <ol className="list-decimal pl-6 my-3" {...props}>{children}</ol>
                ),
                hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                  const txt = String(children ?? "");
                  if (inline) {
                    return (
                      <code className="rounded bg-muted px-1 py-0.5 text-sm" {...props}>{children}</code>
                    );
                  }
                  // Extract language from className like language-xxx or lang-xxx
                  let lang = "";
                  if (typeof className === "string") {
                    const m = className.match(/language-([a-z0-9_-]+)/i) || className.match(/lang-([a-z0-9_-]+)/i);
                    if (m) lang = m[1];
                  }
                  return (
                    <CodeBlock code={txt} language={(lang || "bash") as any} />
                  );
                },
                blockquote: ({ node, children, ...props }) => {
                  const types = {
                    NOTE: {
                      Icon: Info,
                      wrap: "border-[#5BC0DE] bg-[#E3F2FD] text-[#31708F]",
                      icon: "text-[#5BC0DE]",
                    },
                    TIP: {
                      Icon: Lightbulb,
                      wrap: "border-[#5CB85C] bg-[#DFF0D8] text-[#3C763D]",
                      icon: "text-[#5CB85C]",
                    },
                    IMPORTANT: {
                      Icon: AlertCircle,
                      wrap: "border-[#9C27B0] bg-[#F3E5F5] text-[#4A148C]",
                      icon: "text-[#9C27B0]",
                    },
                    WARNING: {
                      Icon: AlertTriangle,
                      wrap: "border-[#D9534F] bg-[#F2DEDE] text-[#A94442]",
                      icon: "text-[#D9534F]",
                    },
                    CAUTION: {
                      Icon: Radiation,
                      wrap: "border-[#FF9800] bg-[#FCF8E3] text-[#8A6D3B]",
                      icon: "text-[#FF9800]",
                    },
                  } as const;

                  const nodes = React.Children.toArray(children);
                  const markerOnly = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/;
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
                      <blockquote className="my-4 border-l-4 border-border pl-4 italic text-foreground/80" {...props}>
                        {children}
                      </blockquote>
                    );
                  }

                  const m = markerLead.exec(firstText);
                  if (!m) {
                    return (
                      <blockquote className="my-4 border-l-4 border-border pl-4 italic text-foreground/80" {...props}>
                        {children}
                      </blockquote>
                    );
                  }

                  const kind = m[1] as keyof typeof types;

                  const newChildren = [...nodes];
                  if (markerOnly.test(firstText.trim())) {
                    newChildren.splice(firstIdx, 1);
                  } else {
                    const original: any = nodes[firstIdx] as any;
                    const replaced = firstText.replace(markerLead, "");
                    const replacedNode = React.isValidElement(original)
                      ? React.cloneElement(original, {}, replaced)
                      : replaced;
                    newChildren[firstIdx] = replacedNode as any;
                  }

                  const { Icon, wrap, icon } = types[kind];

                  return (
                    <div
                      className={`my-4 rounded-md border p-4 ${wrap}`}
                      {...props}
                    >
                      <div className="grid grid-cols-[20px_minmax(0,1fr)] items-center gap-3">
                        <Icon aria-hidden className={`size-5 shrink-0 ${icon}`} />
                        <div className="[&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_code]:bg-black/10 dark:[&_code]:bg-white/10">
                          {newChildren}
                        </div>
                      </div>
                    </div>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </section>
      </div>
    </main>
  );
};

export default SheetContent;