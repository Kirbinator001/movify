# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (outputs to ./dist as static SPA)
npm run start    # Serve production build
npm run lint     # Run ESLint
npm run format   # Run Prettier (auto-fix)
```

There is no test suite configured.

## Architecture

**Movify** is a movie discovery app built on **Next.js** (App Router, static export). It fetches data from the **TMDB API** using TanStack Query.

### Stack

- **Next.js** — React framework with App Router; configured as a static SPA export (`output: "export"`, `distDir: "./dist"`)
- **TanStack Query** — client-side data fetching and caching
- **Tailwind CSS v4** — styling via CSS custom properties (OKLCH color space)
- **lucide-react** — icon library
- **npm** — package manager

### App Structure (`src/app/`)

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout — wraps all pages with `QueryClientProvider` |
| `page.tsx` | Home page (`"use client"`) — header, hero search bar, movie grid |
| `movies.tsx` | Movies component (`"use client"`) — grid, pagination, detail modal |
| `QueryClient.ts` | TanStack Query client singleton |
| `globals.css` | Tailwind imports + design tokens (OKLCH custom properties) |

All pages are client components (`"use client"`). Do not create a `src/routes/` or `src/pages/` directory — this project uses App Router only.

### Environment Variables

- `NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN` — TMDB API read access token (required)

### Key Conventions

- **Prettier config**: 100-char line width, double quotes, trailing commas, semicolons
- **Styling**: Design tokens are CSS custom properties on `:root` / `.dark` in `src/app/globals.css`; Tailwind utilities consume them via `var(--...)`