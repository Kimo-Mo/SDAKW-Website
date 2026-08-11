# SDAKW Corporate Projects Website — Backend REST API

Production-ready Node.js / Express / TypeScript REST API for a bilingual (Arabic/English) corporate construction and real-estate company projects website and Admin Dashboard.

---

## 📋 Features

- **Admin Authentication & User Management**
  - Secure JWT authentication stored exclusively in HTTP-only, SameSite, Secure cookies.
  - Password hashing using `bcryptjs`.
  - Initial admin account seeding via an idempotent CLI script.
  - Profile retrieval (`GET /auth/me`) and password updating with automatic token rotation (`PATCH /auth/change-password`).
- **Category Management**
  - Full CRUD for project categories with bilingual names (`ar`, `en`).
  - Automatic, unique English-based slug generation.
  - Protected deletion logic (returns `409 Conflict` if projects reference the category).
- **Project Management**
  - Full CRUD for corporate construction projects.
  - Bilingual titles, descriptions, and locations (`ar`, `en`).
  - Status-based rules:
    - `status = "ongoing"` → `completionDate = null`
    - `status = "completed"` → `completionDate` is required (`YYYY-MM-DD`).
  - Unique English-based slug generation with collision handling.
  - Published and featured flags for granular visibility control.
- **Filtering, Search & Pagination**
  - Combinable admin filters: `category`, `status`, `published`, `featured`, and keyword `search` (across title and location).
  - Public project list (strictly enforces `published = true`).
  - Reusable pagination metadata output across all list endpoints.
- **Cloudinary Image Management**
  - Direct in-memory image uploads using Multer (`memoryStorage`).
  - Dedicated single cover image upload & replacement with safe atomic Cloudinary deletion.
  - Multiple gallery image upload (`up to 10 images`) and individual gallery image deletion.
  - Automatic Cloudinary cleanup of all associated images upon project deletion.
  - Organized Cloudinary folder structure (`projects/{projectId}/cover`, `projects/{projectId}/gallery`).
  - Automatic image delivery optimization (`quality: auto`, `fetch_format: auto`).
- **Centralized Error & Validation Handling**
  - Strict schema validation using Zod for request bodies, parameters, and query strings.
  - Centralized error middleware handling `ApiError`, `ZodError`, `MongooseError`, duplicate keys (`11000`), and `MulterError`.
  - No stack trace exposure in production mode.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (>=18.0.0)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB via Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) + HTTP-only cookies + `bcryptjs`
- **Validation:** Zod
- **Image Processing & Storage:** Cloudinary + Multer (in-memory)
- **Security & Utility:** Helmet, CORS, Morgan, Cookie-Parser, Dotenv

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts     # Cloudinary SDK setup
│   │   ├── database.ts       # MongoDB connection & graceful shutdown
│   │   └── env.ts            # Zod environment variable validation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── image.controller.ts
│   │   └── project.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT cookie verification middleware
│   │   ├── errorHandler.ts     # Centralized error handler
│   │   ├── notFound.ts         # 404 handler
│   │   └── upload.middleware.ts# Multer memory storage & image filters
│   ├── models/
│   │   ├── Category.ts
│   │   ├── Project.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── categories.routes.ts
│   │   │   ├── images.routes.ts
│   │   │   └── projects.routes.ts
│   │   ├── public/
│   │   │   ├── categories.routes.ts
│   │   │   └── projects.routes.ts
│   │   ├── auth.routes.ts
│   │   └── index.ts          # Central API v1 router
│   ├── scripts/
│   │   └── seedAdmin.ts      # CLI admin seed script
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── cloudinary.service.ts
│   │   └── project.service.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── asyncWrap.ts      # Async controller route wrapper
│   │   ├── cookie.ts         # Environment-aware cookie options
│   │   ├── jwt.ts            # Token sign & verify
│   │   └── slug.ts           # Reusable unique slug generator
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── category.validator.ts
│   │   └── project.validator.ts
│   ├── app.ts                # Express app factory
│   └── server.ts             # Application entry point
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Variables

The application relies on `.env` for configuration. Use `.env.example` as a template:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret_min_16_chars
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin seed — only needed when running: npm run seed:admin
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Password123
```

---

## 🚀 Installation & Setup

1. **Clone the repository and enter the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your MongoDB connection string, JWT secret, Cloudinary credentials, and frontend `CLIENT_URL`.

   ```bash
   cp .env.example .env
   ```

4. **Seed the initial Admin account:**
   Ensure `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in `.env`, then run:
   ```bash
   npm run seed:admin
   ```

---

## 💻 Development

Start the development server with live reload (`ts-node-dev`):

```bash
npm run dev
```

Run linter & TypeScript type check:

```bash
npm run lint
npm run build
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

---

## 📦 Production Build

1. **Compile TypeScript to JavaScript:**

   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

---

## 📖 API Documentation

All routes are prefixed with `/api/v1`.

### 1. Authentication (`/api/v1/auth`)

| Method  | Endpoint                | Auth      | Purpose                                             |
| ------- | ----------------------- | --------- | --------------------------------------------------- |
| `POST`  | `/auth/login`           | Public    | Log in with email & password; sets HTTP-only cookie |
| `POST`  | `/auth/logout`          | Public    | Log out; clears HTTP-only cookie                    |
| `GET`   | `/auth/me`              | Protected | Get current admin user profile                      |
| `PATCH` | `/auth/change-password` | Protected | Change admin password & rotate JWT cookie           |

#### Example Request (`POST /auth/login`)

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "66b123abc456def789012345",
      "name": "Admin",
      "email": "admin@example.com"
    }
  }
}
```

---

### 2. Admin Categories (`/api/v1/admin/categories`)

| Method   | Endpoint                | Auth      | Purpose                                                     |
| -------- | ----------------------- | --------- | ----------------------------------------------------------- |
| `GET`    | `/admin/categories`     | Protected | List all categories sorted by English name                  |
| `GET`    | `/admin/categories/:id` | Protected | Get a single category by ID                                 |
| `POST`   | `/admin/categories`     | Protected | Create a new category                                       |
| `PATCH`  | `/admin/categories/:id` | Protected | Update a category's Arabic/English name                     |
| `DELETE` | `/admin/categories/:id` | Protected | Delete a category (fails with 409 if projects reference it) |

#### Example Request (`POST /admin/categories`)

```json
{
  "name": {
    "ar": "تجاري",
    "en": "Commercial"
  }
}
```

---

### 3. Public Categories (`/api/v1/categories`)

| Method | Endpoint      | Auth   | Purpose                                         |
| ------ | ------------- | ------ | ----------------------------------------------- |
| `GET`  | `/categories` | Public | List categories for public navigation/filtering |

---

### 4. Admin Projects (`/api/v1/admin/projects`)

| Method   | Endpoint              | Auth      | Purpose                                            |
| -------- | --------------------- | --------- | -------------------------------------------------- |
| `GET`    | `/admin/projects`     | Protected | List projects with filters, search, and pagination |
| `GET`    | `/admin/projects/:id` | Protected | Get complete project details by ID                 |
| `POST`   | `/admin/projects`     | Protected | Create a new project                               |
| `PATCH`  | `/admin/projects/:id` | Protected | Update an existing project                         |
| `DELETE` | `/admin/projects/:id` | Protected | Delete a project & clean up Cloudinary images      |

#### Admin List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `10`, max: `100`)
- `search` (searches English/Arabic title and location)
- `category` (Category ID)
- `status` (`ongoing` \| `completed`)
- `published` (`true` \| `false`)
- `featured` (`true` \| `false`)

#### Example Request (`POST /admin/projects`) — Ongoing Project

```json
{
  "title": {
    "ar": "برج الكويت التجارية",
    "en": "Kuwait Commercial Tower"
  },
  "description": {
    "ar": "وصف تفصيلي للمشروع السكني والتجاري",
    "en": "Detailed description of the commercial tower project"
  },
  "category": "66b123abc456def789012345",
  "location": {
    "ar": "مدينة الكويت",
    "en": "Kuwait City"
  },
  "status": "ongoing",
  "featured": true,
  "published": true
}
```

#### Example Request (`POST /admin/projects`) — Completed Project

```json
{
  "title": {
    "ar": "مجمع السكني",
    "en": "Residential Complex"
  },
  "description": {
    "ar": "وصف تفصيلي للمجمع",
    "en": "Detailed description of the complex"
  },
  "category": "66b123abc456def789012345",
  "location": {
    "ar": "حولي",
    "en": "Hawalli"
  },
  "status": "completed",
  "completionDate": "2026-12-07",
  "featured": false,
  "published": true
}
```

---

### 5. Public Projects (`/api/v1/projects`)

| Method | Endpoint          | Auth   | Purpose                                             |
| ------ | ----------------- | ------ | --------------------------------------------------- |
| `GET`  | `/projects`       | Public | List published projects with pagination and filters |
| `GET`  | `/projects/:slug` | Public | Get a single published project by its unique slug   |

#### Public List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `9`, max: `50`)
- `category` (Category ID)
- `status` (`ongoing` \| `completed`)
- `featured` (`true` \| `false`)

---

### 6. Project Images (`/api/v1/admin/projects/:id`)

| Method   | Endpoint                                | Auth      | Body / Params                 | Purpose                              |
| -------- | --------------------------------------- | --------- | ----------------------------- | ------------------------------------ |
| `POST`   | `/admin/projects/:id/cover-image`       | Protected | Multipart (`coverImage`)      | Upload / replace project cover image |
| `DELETE` | `/admin/projects/:id/cover-image`       | Protected | None                          | Remove project cover image           |
| `POST`   | `/admin/projects/:id/gallery`           | Protected | Multipart (`gallery`, max 10) | Append new gallery images            |
| `DELETE` | `/admin/projects/:id/gallery/:publicId` | Protected | `:publicId` in URL            | Remove a specific gallery image      |

---

## 🗄 Project Data Model

```typescript
{
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  slug: string; // Unique, English-derived
  category: ObjectId; // References Category model
  location: {
    ar: string;
    en: string;
  };
  status: "ongoing" | "completed";
  completionDate: Date | null; // null if ongoing; Date required if completed
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  gallery: Array<{
    url: string;
    publicId: string;
  }>;
  featured: boolean; // default: false
  published: boolean; // default: false
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🖼 Image Management & Cloudinary Workflow

1. **In-Memory Uploads:** Multer processes incoming multipart forms using `memoryStorage()`, keeping binary buffers strictly in RAM and passing them directly to Cloudinary's `upload_stream`. No temporary files are written to local disk.
2. **Predictable Folder Structure:** Images are stored under `projects/{projectId}/cover` and `projects/{projectId}/gallery`.
3. **Atomic Replacement:** When uploading a new cover image, the new image is uploaded first, the database is updated, and only then is the old image destroyed on Cloudinary.
4. **Cascading Project Cleanup:** Deleting a project triggers deletion of its cover image and all gallery images from Cloudinary before removing the MongoDB document.

---

## ⚠️ Error Handling & Response Structure

All endpoints return a predictable JSON payload.

### Success Format

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

- In **production**, internal stack traces are suppressed.
- Validation errors (`ZodError`), Mongoose errors (`ValidationError`, `CastError`, duplicate key `11000`), and file upload errors (`MulterError`) are caught and mapped to HTTP `400` or `409` status codes with clean user-friendly messages.

---

## 🔒 Security Practices

- **HTTP-Only Cookies:** JWT tokens are stored in `HTTP-only`, `SameSite`, `Secure` (in production) cookies to mitigate XSS attacks.
- **Password Hashing:** `bcryptjs` with salt factor 10.
- **Security Headers:** `helmet` for HTTP header hardening.
- **Strict CORS:** Restricted to configured `CLIENT_URL` with credentials enabled.
- **Input Sanitization & Validation:** Zod schemas sanitize and validate all input vectors.

---

## 🌐 Deployment Notes

- Designed for initial deployment on **Render** / **Vercel** or any Node.js VPS (Ubuntu / Nginx + PM2).
- Run `npm run build` and start the server with `npm start`.
- Ensure `NODE_ENV=production` and all required environment variables are set in your hosting platform environment configuration.
