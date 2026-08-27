# SDAKW Corporate Website & Management System

A bilingual (Arabic / English) web application and REST API for **Salem Duwaih Al Ajmi Co. (SDAKW)**, a prominent Kuwaiti civil engineering and general contracting firm. The monorepo houses both the public corporate showcase website (delivering project portfolios, corporate credentials, and client contact channels) and the authenticated administration dashboard for managing projects, metadata, and media assets.

---

## 1. Repository Structure

```text
sdakw/
├── frontend/    # Next.js 16 App Router bilingual website & admin dashboard
└── backend/     # Node.js / Express / TypeScript REST API with MongoDB & Cloudinary
```

- For detailed frontend architecture, design tokens, and components, see [frontend/README.md](frontend/README.md).
- For detailed backend API endpoints, authentication mechanisms, and data schemas, see [backend/README.md](backend/README.md).

---

## 2. Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router, React 19), TypeScript, Tailwind CSS v4, shadcn/ui & Base UI, `next-intl` (i18n), TanStack Query v5, Axios, React Hook Form + Zod, Framer Motion, `next-themes`, Embla Carousel, Lucide React |
| **Backend** | Node.js (>=18), Express.js, TypeScript, MongoDB & Mongoose ORM, JSON Web Tokens (JWT) in HTTP-only cookies, Cloudinary SDK, Multer (in-memory storage), Zod, Helmet, CORS |

---

## 3. Live Environments

| Service | Target URL | Status |
|---|---|---|
| **Public Website** | `[TBD — add after Vercel deployment]` | Pending Deployment |
| **Admin Dashboard** | `[TBD — add after Vercel deployment]/ar/admin` | Pending Deployment |
| **Backend REST API** | `[TBD — add after Render deployment]/api/v1` | Pending Deployment |

---

## 4. Local Development Quickstart

### 1. Backend Service
```bash
cd backend
npm install
cp .env.example .env     # Configure PORT, MONGO_URI, JWT_SECRET, and Cloudinary credentials
npm run dev              # Runs on http://localhost:4000
```
> See [backend/README.md](backend/README.md) for database seeding commands and detailed environment configurations.

### 2. Frontend Application
```bash
cd frontend
npm install
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm run dev                 # Runs on http://localhost:3000
```
> See [frontend/README.md](frontend/README.md) for translation management, styling tokens, and component guidelines.

---

## 5. Deployment Overview

- **Frontend:** Deployed on **Vercel**, utilizing standard Next.js edge and server routes.
- **Backend:** Deployed on **Render** (or equivalent container runtime), connecting to a **MongoDB Atlas** managed database cluster.
- **Media Storage:** Static and project assets are hosted and optimized via **Cloudinary**.
- **Configuration:** Environment variables must be provisioned independently for each service. Refer to [frontend/.env.example](frontend/.env.example) and [backend/.env.example](backend/.env.example).
- **Cross-Origin Auth:** For cookie-based sessions to function seamlessly between the frontend and backend in production, ensure the backend's `CLIENT_URL` (CORS origin) and cookie attributes (`SameSite=None`, `Secure=true`) match the production frontend domain.
