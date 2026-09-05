# SDAKW Frontend

Bilingual (Arabic / English) web application for Salem Duwaih Al Ajmi Company (SDAKW), encompassing the public corporate showcase website, civil contracting projects portfolio, natural stone & materials catalog, and the authenticated administration dashboard. Built with Next.js 16 App Router and integrated with the SDAKW backend REST API.

---

## 1. Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `tw-animate-css`)
- **Component Primitives:** shadcn/ui with Base UI primitives (`@base-ui/react`, `rtl: true`)
- **Internationalization (i18n):** `next-intl` (Domain-scoped message catalogs, Arabic `ar` default, English `en`)
- **Server State & Data Fetching:** TanStack Query v5 (`@tanstack/react-query`)
- **HTTP Client:** Axios (Centralized instance with automated 401 redirect interceptor)
- **Form Management & Validation:** React Hook Form (`react-hook-form`, `@hookform/resolvers`) + Zod v4
- **Animation & Transitions:** Framer Motion (Scroll reveal variants, spring physics, reduced-motion compliance)
- **Theming:** `next-themes` (Class-based Light / Dark mode switching)
- **Carousel & Media:** Embla Carousel (`embla-carousel-react`, `embla-carousel-autoplay`)
- **Icons:** Lucide React (`lucide-react`)
- **Utility Styling:** `clsx`, `tailwind-merge`, `class-variance-authority`

---

## 2. Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running instance of the SDAKW backend API (local or remote)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kimo-Mo/SDAKW-Website.git
cd SDAKW-Website/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000). The root automatically handles locale negotiation and serves Arabic (`ar`) as the default language.

### Environment Variables

Configure `.env.local` based on `.env.example`:

| Variable              | Required      | Description                                                                                                                                                                 | Example                        |
| --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `BACKEND_API_URL`     | Yes (in Prod) | Target URL of the SDAKW backend REST API. Used by Next.js edge rewrites and SSR server-side calls.                                                                          | `https://api.sdakw.com/api/v1` |
| `NEXT_PUBLIC_API_URL` | Optional      | Client-side API base URL. Defaults to relative `/api/v1` to route through Next.js Same-Origin reverse proxy (guaranteeing First-Party Cookie compatibility for iOS Safari). | `/api/v1`                      |
| `NEXT_PUBLIC_APP_URL` | Optional      | Canonical URL of the frontend application used for metadata and Open Graph link generation. Defaults to `https://sdakw.com`.                                                | `https://sdakw.com`            |

---

## 3. Folder Structure

```text
frontend/
├── public/
│   ├── images/
│   │   ├── partners/               # Partner & ministry logos (.webp)
│   │   ├── about-1.webp             # Placeholder: About page section visual
│   │   ├── about-2.webp             # Placeholder: About page secondary visual
│   │   ├── about-preview.webp       # Placeholder: About preview card visual
│   │   ├── contact-1.webp           # Placeholder: Contact page visual
│   │   ├── hero-secondary.webp      # Placeholder: Home secondary hero visual
│   │   ├── og-share-card.svg       # Social media Open Graph preview card
│   │   └── sdakw-logo.webp          # Official brand logo
│   └── patt-1.svg                  # Architectural repeating background pattern
├── translations/                   # Domain-scoped translation catalogs
│   ├── ar/                         # Arabic messages (default locale)
│   │   ├── auth.json               # Login, session, password management
│   │   ├── common.json             # Shared UI, navigation, errors, empty states
│   │   ├── dashboard.json          # Admin overview metrics, sidebar, quick actions
│   │   ├── products.json           # Admin products CRUD, bilingual tag inputs, dimensions, toasts
│   │   ├── projects.json           # Admin project CRUD, table, forms, image uploads
│   │   └── public.json             # Public site (home, about, projects, products, contact)
│   └── en/                         # English messages (mirrors ar/ key hierarchy)
│       ├── auth.json
│       ├── common.json
│       ├── dashboard.json
│       ├── products.json
│       ├── projects.json
│       └── public.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/          # Authenticated admin dashboard routes
│   │   │   │       ├── products/   # Products manager, creation (/new), edit (/[id]/edit)
│   │   │   │       ├── projects/   # Projects manager, creation (/new), edit (/[id]/edit)
│   │   │   │       ├── settings/   # Admin account & password settings
│   │   │   │       ├── layout.tsx  # Admin shell wrapper with session protection
│   │   │   │       └── page.tsx    # Admin dashboard overview
│   │   │   ├── (auth)/
│   │   │   │   └── login/          # Localized admin authentication page
│   │   │   ├── (public)/
│   │   │   │   ├── about/          # About Us page (mission, values, ISO certs, operations)
│   │   │   │   ├── contact/        # Contact page (HQ info, Google Maps, WhatsApp, social)
│   │   │   │   ├── products/       # Public materials & products catalog & category filter
│   │   │   │   │   └── [slug]/     # Product detail, specifications, and full gallery lightbox
│   │   │   │   ├── projects/       # Public projects catalogue & search/filter
│   │   │   │   │   └── [slug]/     # Project details & full gallery lightbox
│   │   │   │   ├── layout.tsx      # Public shell layout (Header, Mobile Nav, Footer)
│   │   │   │   └── page.tsx        # Public landing / home page
│   │   │   ├── [...rest]/          # Catch-all route for localized 404 handling
│   │   │   ├── layout.tsx          # Root HTML layout (fonts, dir, lang, metadata)
│   │   │   ├── not-found.tsx       # Branded 404 page
│   │   │   └── providers.tsx       # React Query, Theme, Direction, next-intl providers
│   │   └── favicon.ico
│   ├── components/
│   │   ├── admin/                  # Admin-specific feature components
│   │   │   ├── products/           # Products table, card list, delete dialog, filters, pagination
│   │   │   │   └── form/           # Product basic info, bilingual attributes, dimensions, image uploads
│   │   │   ├── projects/           # Projects table, card list, delete dialog, filters
│   │   │   │   └── form/           # Project form tabs, conditional fields, image uploads
│   │   │   ├── settings/           # Password update form
│   │   │   ├── dashboard-shell.tsx # Shell with responsive sidebar & header
│   │   │   ├── header.tsx          # Admin header with language/theme switches & user menu
│   │   │   ├── mobile-nav.tsx      # Admin mobile slide-out drawer
│   │   │   ├── overview-metrics.tsx# KPI statistics cards
│   │   │   ├── quick-actions.tsx   # Dashboard action cards
│   │   │   └── sidebar.tsx         # Desktop collapsible sidebar
│   │   ├── auth/                   # Authentication forms and session boundary wrappers
│   │   │   ├── login-form.tsx      # React Hook Form + Zod admin login
│   │   │   ├── login-page.tsx      # Centered brand card container
│   │   │   ├── logout-button.tsx   # Session invalidation action
│   │   │   ├── require-session.tsx # Client-side auth guard against `/auth/me`
│   │   │   └── session.ts          # Session helper hooks
│   │   ├── public/                 # Public-facing components organized by page
│   │   │   ├── about/              # Overview, vision/mission, core values, ISO, operations
│   │   │   ├── contact/            # Info cards, interactive map embed, WhatsApp CTA
│   │   │   ├── home/               # Hero, stats, secondary visual, intro, services, partners
│   │   │   ├── layouts/            # Public shell, header, footer, mobile navigation
│   │   │   ├── product-detail/     # Hero, specifications, attributes, gallery, lightbox
│   │   │   ├── products/           # Category filter tabs, product cards, grid, pagination
│   │   │   ├── project-detail/     # Hero, metadata bar, contractor info, gallery lightbox
│   │   │   └── projects/           # Filter controls, project cards, grid, pagination
│   │   ├── shared/                 # Reusable cross-domain components
│   │   │   ├── bilingual-tag-input.tsx   # Arabic/English paired tag array manager
│   │   │   ├── custom-cursor.tsx         # Architectural trailing spring cursor with explore pill
│   │   │   ├── dimensions-input.tsx      # Dynamic dimensional variants manager (L x W x T)
│   │   │   ├── empty-state.tsx           # Standardized empty view placeholder
│   │   │   ├── error-state.tsx           # Standardized API error / retry block
│   │   │   ├── language-switcher.tsx     # Locale switcher preserving current path & query
│   │   │   ├── loading-state.tsx         # Skeleton / spinner loading placeholder
│   │   │   ├── pagination.tsx            # Shared pagination controls
│   │   │   ├── partner-logos-carousel.tsx# Continuous looping partner logos marquee
│   │   │   ├── password-input.tsx        # Eye-toggle password field
│   │   │   ├── reveal.tsx                # Scroll-driven motion reveal wrapper
│   │   │   └── theme-toggle.tsx          # Light/Dark mode toggle with variants
│   │   └── ui/                     # shadcn/ui & Base UI primitives (RTL-aware)
│   ├── constants/
│   │   └── partners.ts             # Partner and client organization list & logo paths
│   ├── i18n/
│   │   ├── navigation.ts           # Type-safe localized navigation wrappers (Link, useRouter)
│   │   ├── request.ts              # Server-side domain catalog loader and merger
│   │   └── routing.ts              # Locale configuration, directions, and alternates
│   ├── lib/
│   │   ├── api/
│   │   │   ├── auth.ts             # Admin login, logout, me, password change API
│   │   │   ├── client.ts           # Centralized Axios client with 401 interceptor
│   │   │   ├── products.ts         # Admin product CRUD, image upload, and deletion endpoints
│   │   │   ├── projects.ts         # Admin project CRUD, summary, and image upload endpoints
│   │   │   ├── public-products.ts  # Public product listing and slug query endpoints
│   │   │   └── public-projects.ts  # Public project listing and slug query endpoints
│   │   ├── auth/
│   │   │   └── navigation.ts       # Return path normalization and safe redirection
│   │   ├── utils/
│   │   │   └── utils.ts            # Class name merger `cn()`
│   │   └── validations/
│   │       ├── change-password.ts  # Zod schema for password modification
│   │       ├── product.ts          # Zod schema for product creation & edit forms
│   │       └── project.ts          # Zod schema for project creation & edit forms
│   ├── proxy.ts                    # `next-intl` middleware for path routing and negotiation
│   ├── styles/
│   │   └── globals.css             # Tailwind v4 theme variables, monochrome tokens, fonts
│   └── types/
│       ├── admin.ts                # TypeScript types for admin, project/product models, and API shapes
│       └── public.ts               # TypeScript types for public UI, filters, products, and cards
├── .env.example
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 4. Design System & Tokens

The application strictly adheres to a **monochrome, architectural modernist design language** reflecting civil engineering and contracting authority.

### Core Principles

- **Monochrome Ink & Paper Palette:** Strict black, white, and balanced neutral grays. Accent colors are intentionally reserved for semantic indicators (e.g. destructive actions, warning states, chart metrics).
  - _Light Mode:_ Canvas `#fcfcfc`, Cards `#ffffff`, Foreground `#000000`, Borders `#e4e4e4`, Muted `#f5f5f5` / `#525252`.
  - _Dark Mode:_ Canvas `#1C1C1C`, Cards `#090909`, Foreground `#ffffff`, Borders `#242424`, Muted `#1d1d1d` / `#a4a4a4`.
- **Sharp Right Angles (`radius: 0`):** `--radius: 0rem` is enforced across all cards, dialogs, inputs, buttons, tables, and sheets. **Do not introduce rounded corners (`rounded-md`, `rounded-lg`)** to maintain the brutalist architectural aesthetic. (Small circular pills are reserved exclusively for icon buttons and status tags where specifically designed).
- **Typography:**
  - **Sans (Primary):** `IBM Plex Sans Arabic` (`--font-sans`) — harmoniously handles both Arabic and Latin typographic glyphs with balanced geometric proportions.
  - **Monospace (Utility):** `IBM Plex Mono` (`--font-mono`) — used for metadata captions, project IDs, contract numbers, dates, and metric counters.
- **Subtle Background Architecture:** An architectural dot-grid pattern (`/patt-1.svg` via `.pattern`) provides texture without visual clutter.
- **Theme Switching:** Managed via `next-themes` and the `ThemeToggle` component (`outline`, `ghost`, `admin`, `mobile` variants), respecting user preferences while avoiding SSR hydration flash.

---

## 5. Internationalization (i18n) & RTL

### Routing & Navigation

- Supported locales: Arabic (`ar`, default) and English (`en`).
- Configured in `src/i18n/routing.ts` with `localePrefix: "never"`.
- Direction is automatically determined (`rtl` for Arabic, `ltr` for English) and applied at the `<html>` root alongside the `lang` attribute.
- **Rule:** Never import `next/link` or `next/navigation`'s router directly. Always use the localized wrappers from `@/i18n/navigation`:
  ```tsx
  import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';
  ```

### Domain-Scoped Message Catalogs

Translations are split into domain files under `translations/[locale]/`:

1. `common.json` — Global UI elements, nav labels, footer links, generic buttons, error states.
2. `auth.json` — Admin login form, validation errors, session prompts.
3. `dashboard.json` — Admin metrics overview, sidebar navigation, quick actions.
4. `projects.json` — Admin project management, table headers, form labels, image upload helpers.
5. `products.json` — Admin product catalog management, table headers, form labels, bilingual attribute tags, dimensions, upload feedback, and validation errors.
6. `public.json` — Public landing page, about us, public project catalog, public products & materials catalog (`productsPage`), product specifications (`productDetail`), and contact page.

These files are merged in `src/i18n/request.ts` and provided to the client.

### Adding New Translation Keys (Important Warning)

> [!WARNING]
> **Translation Parity Requirement:** Whenever adding a new translation key, you **must** add it to **both** `translations/en/<domain>.json` and `translations/ar/<domain>.json` under the exact same nested key hierarchy.
>
> _Bug Class Warning:_ Omitting a key in either language or mismatching the domain namespace results in missing key warnings, fallback rendering failures, or hydration mismatches in production.

---

## 6. Key Features Implemented

### Admin Authentication & Session Management

- **Same-Origin Reverse Proxy & First-Party Cookies:** Next.js proxies all `/api/v1/*` requests to `BACKEND_API_URL` via `next.config.ts` rewrites, ensuring all auth cookies are treated as first-party cookies (preventing iOS Safari ITP cross-site cookie blocking).
- **Dual Authentication Layer:** The backend issues HTTP-only session cookies and returns JWT tokens for client-side bearer fallback (`Authorization: Bearer <token>`), guaranteeing robust session persistence across all browsers and webviews.
- **Authoritative Session Verification:** The `RequireSession` component and admin layouts verify session validity against `GET /api/v1/auth/me` before rendering protected administrative interfaces.
- **Automatic 401 Interception:** Centralized Axios response interceptor in `src/lib/api/client.ts` automatically captures unauthorized responses, clears stale tokens, and safely redirects to `/login` with return path preservation.
- **Password Modification:** Self-service password updates with automatic session rotation (`PATCH /api/v1/auth/change-password`).

### Admin Projects CRUD & Workflow

- **Overview Metrics:** Summary KPI cards displaying total projects, published count, and category breakdown.
- **Responsive Table & Card Views:** Rich project listing with live client/server search, type filter (`government` vs `private`), status filter (`in_progress`, `completed`, `tender`, etc.), publication toggle, and server-side pagination.
- **Conditional Project Forms:** Dynamic validation and field rendering based on project type:
  - _Government Projects:_ Ministry selection, tender number, contract number, project value, etc.
  - _Private Projects:_ Client name, consultant, location, budget details.
- **Contractors Field Array:** Dynamic sub-form allowing admins to associate multiple contractors with assigned roles.

### Admin Products CRUD & Materials Management

- **Materials Catalog Management (`/admin/products`):** Full control over raw stone, granite, marble, and quartz inventory with metrics, quick actions, and status badges.
- **Search & Category Filtering:** Multi-criteria filtering engine supporting live text search across Arabic and English product names, category selection (`natural_granite`, `natural_stone`, `natural_marble`, `quartz_industrial`), and publication status filter (`published` vs `draft`).
- **Responsive Dual-View Table & Card Modes:** High-density desktop data table with cover image thumbnail, category badge, material type, publication switch, and actions; collapses into touch-friendly cards on mobile and tablet screens.
- **Bilingual Dynamic Form Orchestration (`/admin/products/new` & `/[id]/edit`):**
  - _Bilingual Core Info:_ Coordinated Arabic & English inputs for product name and material classification with strict Zod schema validation.
  - _Architectural Category Selector:_ Direct categorization into Granite, Stone, Marble, or Industrial Quartz.
  - _Bilingual Attribute Tag Engine (`BilingualTagInput`):_ Interactive tag pair manager for colors, countries of origin, applications/uses, and surface finishes allowing dynamic entry, editing, and removal of paired Arabic/English tags.
  - _Dynamic Dimensions Manager (`DimensionsInput`):_ Optional dimension variants allowing specification of multiple standard slab or tile dimensions (Length × Width × Thickness in centimeters) with dynamic row addition, validation, and removal.
  - _Publication Control:_ Instant toggle between draft status and live public catalog visibility.
- **Dedicated Deletion & Cloudinary Cleanup:** Confirmation modal with comprehensive error reporting that deletes product records while cleanly removing associated cover and gallery media from Cloudinary storage.

### Multi-Step Image Upload Orchestration

- **Cover Image Upload:** Dedicated upload and deletion flow connecting directly to Cloudinary media storage via backend multipart endpoints for both projects (`POST /api/v1/admin/projects/:id/cover-image`) and products (`POST /api/v1/admin/products/:id/cover-image`).
- **Gallery Upload:** Multi-file drag-and-drop gallery upload with real-time preview, progress feedback, upload limits (up to 10 images), and per-image deletion using Cloudinary public IDs for projects (`POST /api/v1/admin/projects/:id/gallery`) and products (`POST /api/v1/admin/products/:id/gallery`).

### Public Corporate Showcase

- **Home Page:**
  - High-impact architectural hero with animated KPI metrics.
  - Secondary architectural visual showcase.
  - Corporate introduction and craft philosophy.
  - Featured projects preview with staggered scroll entrance.
  - Services grid.
  - Infinite auto-scrolling partner logos marquee.
  - Call-to-action consultation banner.
- **About Us Page:**
  - Company background and heritage.
  - Vision & Mission interactive grid.
  - Core Values presentation.
  - ISO certifications showcase (ISO 9001, ISO 14001, ISO 45001).
  - Operations and logistics capabilities breakdown.
- **Projects Catalog:**
  - Comprehensive listing with search and multi-criteria filters (Project Type and Execution Status).
  - Clean URL synchronization preserving active filters and pagination in query params.
  - High-performance project cards with responsive image optimization and branded fallback states.
- **Project Detail Page:**
  - Hero header with project type badge and completion status.
  - Monospace metadata bar (dates, location, tender number, client).
  - Contractor and subcontractor roles showcase.
  - Interactive project photo gallery with full-screen keyboard/touch accessible lightbox dialog.
- **Products & Materials Catalog (`/products`):**
  - Editorial header with material badge, localized heading, subtitle, and dynamic total available count.
  - Responsive horizontal category filter buttons (`All`, `Natural Granite`, `Natural Stone`, `Natural Marble`, `Industrial Quartz`) enabling instant material filtering.
  - Clean URL search params synchronization (`category`, `page`) for deep-linking, bookmarking, and seamless browser history.
  - High-performance responsive grid (`ProductsGrid`) with architectural cards displaying cover image, category badge, material name, and origin chips with hover transitions and custom cursor triggers.
  - Resilient empty states with quick filter reset action, loading skeleton grids, and retryable error states.
- **Product Detail & Technical Specifications (`/products/[slug]`):**
  - High-impact architectural hero section with cover image, breadcrumb navigation, and localized title.
  - Comprehensive technical specifications panel:
    - Material classification and category badge.
    - Color swatches and shades chips (bilingual).
    - Countries of origin tags.
    - Surface finishes and texture options.
    - Applications and architectural uses (flooring, facades, countertops, etc.).
    - Dimensions specification section displaying available slab/tile sizes (Length × Width × Thickness in cm).
  - High-resolution interactive photo gallery with responsive thumbnail previews.
  - Full-screen lightbox dialog with touch/swipe gestures, keyboard navigation (Escape, Arrow keys), and image counters.
  - Direct inquiry CTA connecting visitors to WhatsApp and sales representatives with pre-populated product inquiry context.
- **Contact Page:**
  - Direct headquarters information cards.
  - Embedded interactive Google Map.
  - Direct WhatsApp click-to-chat integration.
  - Official social media channels.

### Motion & Micro-Interactions

- **Signature Custom Cursor:** Desktop fine-pointer spring cursor that expands into an interactive `"Explore" / "استكشف"` pill when hovering over interactive cards (`data-cursor="explore"`).
- **Scroll-Driven Reveal System:** Reusable `Reveal` component supporting `fade-up`, `fade-scale`, and `stagger-children` variants.
- **Accessibility:** Full compliance with `prefers-reduced-motion` across all animations and transitions.

---

## 7. Known Placeholders (Pre-Launch Checklist)

> [!IMPORTANT]
> The following static image assets and placeholder constants are temporary demo files and **must be replaced with official, high-resolution media before production launch**:

| File / Resource       | Location                             | Purpose                                      | Status                                                      |
| --------------------- | ------------------------------------ | -------------------------------------------- | ----------------------------------------------------------- |
| `hero-secondary.webp` | `/public/images/hero-secondary.webp` | Secondary visual banner on landing page      | Demo placeholder — replace with official site photo         |
| `about-1.webp`        | `/public/images/about-1.webp`        | About page leadership / operations visual    | Demo placeholder — replace with official corporate photo    |
| `about-2.webp`        | `/public/images/about-2.webp`        | About page secondary showcase visual         | Demo placeholder — replace with official project photo      |
| `about-preview.webp`  | `/public/images/about-preview.webp`  | Home page about teaser image                 | Demo placeholder — replace with official asset              |
| `contact-1.webp`      | `/public/images/contact-1.webp`      | Contact page headquarters visual             | Demo placeholder — replace with official HQ building photo  |
| `partners.ts`         | `/src/constants/partners.ts`         | Strategic partners & government client logos | Verify official vectorized SVG/PNG logos for all ministries |

---

## 8. Available Scripts

The following scripts are configured in `package.json`:

```bash
# Start the Next.js development server (default port 3000)
npm run dev

# Build the production bundle using Webpack
npm run build

# Start the production Next.js server after building
npm run start

# Run ESLint across all TypeScript and React files
npm run lint

# Run strict TypeScript type checking without emitting files
npm run typecheck
```

---

## 9. Deployment & Production

### Hosting Target

The frontend application is optimized for deployment on **Vercel** or any standard Node.js server container.

### Production Environment Variables

Set the following environment variables in your deployment dashboard (e.g. Vercel Project Settings > Environment Variables):

- `BACKEND_API_URL`: Production backend REST API base URL (e.g. `https://sdakw-website.onrender.com/api/v1` or `https://api.sdakw.com/api/v1`).
- `NEXT_PUBLIC_API_URL`: Optional (defaults to `/api/v1`).
- `NEXT_PUBLIC_APP_URL`: Production canonical domain (e.g. `https://sdakw.com`).

### Reverse Proxy & Cookie Architecture

With Next.js API rewrites in `next.config.ts`, requests sent to `/api/v1/*` are proxied to `BACKEND_API_URL` at the network edge:

1. **First-Party Cookies:** Cookies are set on the frontend domain itself, preventing cross-site cookie blocking on iOS/Safari.
2. **CORS `CLIENT_URL`:** On the backend (Render), set `CLIENT_URL` to your frontend domain (`https://sdakw-website.vercel.app` or `https://sdakw.com`).
3. **Cookie `SameSite` & `Secure`:** The backend sets `SameSite=None; Secure=true` in production with full dual cookie/bearer token support.
