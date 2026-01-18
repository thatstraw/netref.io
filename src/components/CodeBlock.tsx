"use client";

import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import type { Language } from "prism-react-renderer";
import { Check, Clipboard } from "lucide-react";

export function CodeBlock({
  code,
  language = "bash",
  noMargin = false,
}: {
  code: string;
  language?: Language | "text";
  noMargin?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const [theme, setTheme] = React.useState(themes.vsLight);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? themes.nightOwl : themes.vsLight);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <div className={`${noMargin ? "" : "my-6"} w-full overflow-hidden rounded-xl border bg-card shadow-sm`}>
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {language}
          </span>
        </div>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative group">
        <Highlight theme={theme} code={code.trim()} language={(language as any) || "bash"}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} m-0 p-4 text-sm overflow-auto leading-relaxed`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export default CodeBlock;