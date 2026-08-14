# SDAKW Frontend

Bilingual (Arabic / English) Next.js application for the SDAKW public website and admin dashboard.

> **Scope:** This repository contains **Phase 0 (Frontend Foundation)**, **Phase 1 (Shared UI Foundation)**, and **Phase 2 (Admin Authentication)**. Project management and public pages come in later phases. See the project constitution (`.specify/memory/constitution.md`) and `SDAKW_FRONTEND_PLAN.md`.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Base UI, `rtl: true`)
- **Animation:** Framer Motion
- **i18n:** next-intl (`app/[locale]/`, Arabic `ar` default + English `en`)
- **Server state:** TanStack Query v5
- **HTTP:** Axios (centralized instance)
- **Forms:** React Hook Form + Zod

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the root redirects to `/ar` (default locale). Visit `/en` for English.

### Environment variables

Copy `.env.example` to `.env.local` and set the backend API base URL:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the SDAKW backend API, used by the centralized Axios instance (`src/lib/api/client.ts`). Leave empty for local development without a backend — requests then go to the same origin. |

`.env.local` is git-ignored; `.env.example` is committed.

## Locales & RTL

- Locale routing runs through `src/i18n/` (`routing`, `request`, `navigation`) plus `src/proxy.ts` (locale negotiation/redirects).
- The root layout sets `lang` and `dir` from the active locale (`rtl` for `ar`, `ltr` for `en`).
- All internal links must use the i18n `Link` from `@/i18n/navigation` — never `next/link` or bare locale strings in components.
- **Fonts:** `Inter` (Latin) and `Noto Sans Arabic` (Arabic glyphs) are both applied on `<html>`; `globals.css` switches `--font-sans` on `html[lang="ar"]`, so every component flips with the locale.
- shadcn/ui was initialized with `rtl: true` — the CLI transforms components to logical properties (`start-*`/`end-*`) and flips directional icons with `rtl:rotate-180`. `DirectionProvider` (from `@/components/ui/direction`) wraps the app for portal-rendered Base UI parts.
- Arabic and English are first-class: every shared component is verified in both directions before completion (constitution §II).

## Project structure (Phase 0–2)

```text
frontend/
├── messages/              # next-intl message files (ar.json, en.json)
├── public/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── (auth)/login/   # Localized login route
│   │       └── (admin)/admin/  # Protected admin routes
│   ├── components/
│   │   ├── ui/            # shadcn/ui primitives (RTL-transformed)
│   │   └── shared/        # composed primitives: LoadingState, ErrorState, Pagination
│   ├── features/
│   │   └── auth/          # LoginForm, LoginPage, RequireSession, LogoutButton, session utils
│   ├── i18n/              # routing/request/navigation config
│   ├── lib/
│   │   ├── api/           # centralized Axios client + auth API functions
│   │   ├── auth/          # safe navigation helpers (return-path normalization, 401 redirect)
│   │   └── utils/         # cn() and shared utilities
│   └── styles/globals.css
├── tests/
│   └── auth/              # Auth API contract, component, and navigation tests
├── .env.example
└── package.json
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict type check |
| `npm run test` | Run Vitest unit/component tests |
| `npm run test:watch` | Run Vitest in watch mode |

## Admin authentication (Phase 2)

`NEXT_PUBLIC_API_URL` **must** include the `/api/v1` prefix when the frontend and backend are separate deployments (e.g. `http://localhost:4000/api/v1`).

The login flow is at `/ar/login` (Arabic, default) and `/en/login` (English). Protected admin content lives under `/ar/admin` and `/en/admin`. The backend owns the session via an HTTP-only cookie; the frontend never reads or stores a token.

## Conventions checklist

- [x] All API access goes through `@/lib/api/client` (no raw axios in components)
- [x] All server data flows through TanStack Query (no `useEffect` + axios)
- [x] All user-facing text comes from `messages/{locale}.json` via `useTranslations`/`getTranslations`
- [x] Components contain no hardcoded locale strings or domain-specific copy
- [x] Zustand/Redux: not used — client state is local React state
- [x] Auth uses cookie-based, server-verified sessions (no frontend token storage)
- [x] One shared Axios 401 interceptor handles unauthorized redirects
