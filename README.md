# jgividen.github.io

Personal blog built with [Astro](https://astro.build), deployed to GitHub Pages on every push to `main`.

## New post
Create `src/content/blog/<slug>.md`:

```md
---
title: "Post title"
description: "One-line summary"
pubDate: 2026-10-10
tags: ["tag1", "tag2"]   # optional
updatedDate: 2026-10-11  # optional
draft: false             # optional; true hides it
---
Your Markdown here.
```

Local dev: `npm install && npm run dev`.
