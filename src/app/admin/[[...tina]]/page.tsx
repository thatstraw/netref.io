"use client";

import { useEffect, useState } from "react";
import { TinaAdmin } from "tinacms/dist/admin";

export default function AdminPage() {
  const [config, setConfig] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Prefer generated config (available when running `tina:dev` or after `tina build`)
        const mod = await import("../../../../../.tina/config");
        if (mounted) setConfig((mod as any).default ?? (mod as any));
      } catch {
        // Fallback to source config for local filesystem mode
        const mod = await import("../../../../../tina/config");
        if (mounted) setConfig((mod as any).default ?? (mod as any));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!config) return null;
  return <TinaAdmin config={config} />;
}