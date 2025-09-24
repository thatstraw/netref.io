"use client";

import React from "react";
import { VENDORS, type VendorKey } from "@/lib/cheats";

export default function SubmitPage() {
  const [title, setTitle] = React.useState("");
  const [vendor, setVendor] = React.useState<VendorKey>("cisco");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [language, setLanguage] = React.useState("bash");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, vendor, description, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), language, content };
    console.log("Submitted cheat:", payload);
    setStatus("Thanks! Your cheat sheet has been captured in the console. Hook this up to an API to persist.");
    setTitle(""); setDescription(""); setTags(""); setLanguage("bash"); setContent("");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Submit a Cheat Sheet</h1>
      <p className="mb-6 text-sm text-muted-foreground">Contribute your favorite network configuration snippets. Required fields are marked with *.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title *</label>
          <input required value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Vendor *</label>
            <select value={vendor} onChange={(e)=>setVendor(e.target.value as VendorKey)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              {VENDORS.map(v=> (<option key={v.key} value={v.key}>{v.name}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Language *</label>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option value="bash">bash</option>
              <option value="shell">shell</option>
              <option value="text">text</option>
              <option value="ini">ini</option>
              <option value="json">json</option>
              <option value="yaml">yaml</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Short description *</label>
          <textarea required value={description} onChange={(e)=>setDescription(e.target.value)} className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
          <input value={tags} onChange={(e)=>setTags(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Content *</label>
          <textarea required value={content} onChange={(e)=>setContent(e.target.value)} className="min-h-48 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm" placeholder="# Paste your configuration here" />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">Submit</button>
          {status && <p className="text-xs text-muted-foreground">{status}</p>}
        </div>
      </form>
    </main>
  );
}