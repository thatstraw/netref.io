"use client";

import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import type { Language } from "prism-react-renderer";
import { Copy } from "lucide-react";

export function CodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: Language | "text";
}) {
  const [copied, setCopied] = React.useState(false);
  const [theme, setTheme] = React.useState(themes.duotoneLight);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? themes.nightOwl : themes.duotoneLight);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="relative group w-full overflow-hidden rounded-lg border">
      <button
        onClick={onCopy}
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-2 rounded-md border bg-background/80 px-2 py-1 text-xs hover:bg-muted"
        aria-label="Copy code"
      >
        <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
      </button>
      <Highlight theme={theme} code={code} language={(language as any) || "bash"}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} m-0 p-4 text-sm overflow-auto`} style={style}>
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
  );
}

export default CodeBlock;