# Contributing to netsheet.io

Thanks for contributing! This repo is a Markdown-based collection of network configuration cheat sheets for vendors like Cisco, Juniper, Fortinet, Palo Alto, and Mikrotik.

This guide explains how to add or edit a cheat sheet so everything stays consistent.

## 1) Content Location & Naming

- All content lives under `src/content/`
- Each vendor has its own folder:
  - `src/content/cisco/`
  - `src/content/juniper/`
  - `src/content/fortinet/`
  - `src/content/palo-alto/`
  - `src/content/mikrotik/`
- Each feature is its own Markdown file using the feature slug as the filename:
  - `src/content/cisco/vlan.md`
  - `src/content/juniper/lldp.md`

Naming rules:
- Use lowercase for vendor and feature slugs
- File naming pattern: `<vendor>/<feature>.md`

## 2) Frontmatter (Required)

Every file must start with YAML frontmatter using this schema:

```yaml
---
title: Cisco VLAN Configuration
vendor: cisco                # one of: cisco|juniper|fortinet|palo-alto|mikrotik
feature: vlan                # must match the filename (without extension)
category: switching          # e.g. switching|routing|security|wireless
tags: ["vlan", "switchport", "dot1q"]
tested_on: ["IOS XE 17.x", "IOS 15.x"]
last_verified: 2025-09-17    # YYYY-MM-DD
difficulty: beginner         # beginner|intermediate|advanced
description: Quick VLAN config for Cisco access/trunk ports with verification commands.
related: ["/cisco/lldp", "/cisco/stp"]
---
```

Validation:
- Required fields: `title`, `vendor`, `feature`, `category`, `tags`, `description`
- `vendor` and folder name must match
- `feature` must match filename
- `tags` must be an array of strings
- Dates must be `YYYY-MM-DD`

Run local validation:

```bash
npm run validate:content
```

## 3) Markdown Structure

- Use `##` section headings (keep it concise):
  - `## Access Port`
  - `## Trunk Port`
  - `## Verification`
  - `## Troubleshooting`
- Use fenced code blocks with language tags (prefer `bash` for CLI):

```bash
show interfaces terse
```

- Admonitions via blockquotes:
  - `> [!NOTE]`
  - `> [!TIP]`
  - `> [!WARNING]`

### Example Template

```md
---
title: Vendor Feature Title
vendor: cisco
feature: vlan
category: switching
tags: ["vlan"]
tested_on: ["IOS XE 17.x"]
last_verified: 2025-09-17
difficulty: beginner
description: Short 1–2 sentence summary.
related: ["/cisco/lldp"]
---

## Access Port

> [!TIP]
> Brief tip for users.

```bash
# Configuration here
```

## Trunk Port

```bash
# Configuration here
```

## Verification

```bash
# Commands here
```

## Troubleshooting

> [!WARNING]
> Common pitfall or warning.
```

## 4) Shared Assets & Snippets

- Use `src/content/_shared/snippets/` for reusable blocks
- Example: `src/content/_shared/snippets/save-config.md`
- You can include snippet content manually or by tooling in the future

## 5) Style Guide

- Be concise — focus on the minimal commands to achieve the task
- No sensitive or proprietary data
- Always include verification steps
- Prefer vendor-agnostic terminology where possible
- Use consistent casing and slug formats

## 6) PR Checklist

- [ ] Frontmatter complete and valid
- [ ] Follows template structure
- [ ] Includes at least one admonition and one code block
- [ ] Lints/validation pass: `npm run validate:content`

Thanks again for helping make netsheet.io useful for everyone! 🙌