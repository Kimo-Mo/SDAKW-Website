# SDAKW Corporate Projects & Products Website — Backend REST API

Production-ready Node.js / Express / TypeScript REST API for a bilingual (Arabic/English) corporate construction projects and materials catalog (marble, granite, natural stone, quartz) website and Admin Dashboard.

---

## 📋 Features

- **Admin Authentication & User Management**
  - Secure JWT authentication stored exclusively in HTTP-only, SameSite, Secure cookies.
  - Password hashing using `bcryptjs`.
  - Initial admin account seeding via an idempotent CLI script.
  - Profile retrieval (`GET /auth/me`) and password updating with automatic token rotation (`PATCH /auth/change-password`).
- **Project Management**
  - Full CRUD for corporate construction projects.
  - Bilingual titles, descriptions, and locations (`ar`, `en`).
  - Project classification via `projectType` (`government` or `private`).
  - Status-based rules:
    - `status = "ongoing"` → `completionDate = null`
    - `status = "completed"` → `completionDate` is required (`YYYY-MM-DD`).
  - Unique English-based slug generation with collision handling.
  - Published and featured flags for granular visibility control.
- **Product (Materials Catalog) Management**
  - Full CRUD for material products (marble, granite, natural stone, quartz).
  - Fixed 4-value `category` enum: `natural_granite`, `natural_stone`, `natural_marble`, `quartz_industrial`.
  - Bilingual name and material fields (`ar`, `en`).
  - Bilingual array fields for `color`, `origin`, `uses`, `surface` — with strict `ar`/`en` same-length validation.
  - Unique English-based slug generation with collision handling.
  - Published flag for visibility control.
- **Filtering, Search & Pagination**
  - Combinable admin filters: `status`, `published`, `featured`, `projectType`, `category`, and keyword `search`.
  - Public project and product lists (strictly enforce `published = true`).
  - Reusable pagination metadata output across all list endpoints.
- **Cloudinary Image Management**
  - Direct in-memory image uploads using Multer (`memoryStorage`).
  - Dedicated single cover image upload & replacement with safe atomic Cloudinary deletion.
  - Multiple gallery image upload (`up to 10 images`) and individual gallery image deletion.
  - Automatic Cloudinary cleanup of all associated images upon project/product deletion.
  - Organized Cloudinary folder structure (`{resource}/{resourceId}/cover`, `{resource}/{resourceId}/gallery`).
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
│   │   ├── image.controller.ts          # Project image handlers
│   │   ├── product.controller.ts        # Product CRUD handlers
│   │   ├── product-image.controller.ts  # Product image handlers
│   │   └── project.controller.ts        # Project CRUD handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT cookie verification middleware
│   │   ├── errorHandler.ts     # Centralized error handler
│   │   ├── notFound.ts         # 404 handler
│   │   └── upload.middleware.ts# Multer memory storage & image filters
│   ├── models/
│   │   ├── Product.ts
│   │   ├── Project.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── images.routes.ts
│   │   │   ├── product-images.routes.ts
│   │   │   ├── products.routes.ts
│   │   │   └── projects.routes.ts
│   │   ├── public/
│   │   │   ├── products.routes.ts
│   │   │   └── projects.routes.ts
│   │   ├── auth.routes.ts
│   │   └── index.ts          # Central API v1 router
│   ├── scripts/
│   │   └── seedAdmin.ts      # CLI admin seed script
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── cloudinary.service.ts
│   │   ├── product.service.ts
│   │   └── project.service.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── asyncWrap.ts      # Async controller route wrapper
│   │   ├── cookie.ts         # Environment-aware cookie options
│   │   ├── jwt.ts            # Token sign & verify
│   │   └── slug.ts           # Reusable unique slug generator
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
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

### 2. Admin Projects (`/api/v1/admin/projects`)

| Method   | Endpoint                  | Auth      | Purpose                                                       |
| -------- | ------------------------- | --------- | ------------------------------------------------------------- |
| `GET`    | `/admin/projects/summary` | Protected | Get aggregate project summary metrics (counts & last updated) |
| `GET`    | `/admin/projects`         | Protected | List projects with filters, search, and pagination            |
| `GET`    | `/admin/projects/:id`     | Protected | Get complete project details by ID                            |
| `POST`   | `/admin/projects`         | Protected | Create a new project                                          |
| `PATCH`  | `/admin/projects/:id`     | Protected | Update an existing project                                    |
| `DELETE` | `/admin/projects/:id`     | Protected | Delete a project & clean up Cloudinary images                 |

#### Admin List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `10`, max: `100`)
- `search` (searches English/Arabic title and location)
- `status` (`ongoing` \| `completed`)
- `projectType` (`government` \| `private`)
- `published` (`true` \| `false`)
- `featured` (`true` \| `false`)

#### Example Request (`POST /admin/projects`) — Ongoing Government Project

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
  "projectType": "government",
  "governmentEntity": {
    "ar": "جهة حكومية",
    "en": "Government Entity"
  },
  "contractors": [
    {
      "name": {
        "ar": "مقاول",
        "en": "Contractor"
      },
      "description": {
        "ar": "وصف المقاول",
        "en": "Contractor description"
      }
    }
  ],
  "location": {
    "ar": "مدينة الكويت",
    "en": "Kuwait City"
  },
  "status": "ongoing",
  "featured": true,
  "published": true
}
```

#### Example Request (`POST /admin/projects`) — Completed Private Project

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
  "projectType": "private",
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

### 3. Public Projects (`/api/v1/projects`)

| Method | Endpoint          | Auth   | Purpose                                             |
| ------ | ----------------- | ------ | --------------------------------------------------- |
| `GET`  | `/projects`       | Public | List published projects with pagination and filters |
| `GET`  | `/projects/:slug` | Public | Get a single published project by its unique slug   |

#### Public List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `9`, max: `50`)
- `status` (`ongoing` \| `completed`)
- `projectType` (`government` \| `private`)
- `featured` (`true` \| `false`)

---

### 4. Project Images (`/api/v1/admin/projects/:id`)

| Method   | Endpoint                                | Auth      | Body / Params                 | Purpose                              |
| -------- | --------------------------------------- | --------- | ----------------------------- | ------------------------------------ |
| `POST`   | `/admin/projects/:id/cover-image`       | Protected | Multipart (`coverImage`)      | Upload / replace project cover image |
| `DELETE` | `/admin/projects/:id/cover-image`       | Protected | None                          | Remove project cover image           |
| `POST`   | `/admin/projects/:id/gallery`           | Protected | Multipart (`gallery`, max 10) | Append new gallery images            |
| `DELETE` | `/admin/projects/:id/gallery/:publicId` | Protected | `:publicId` in URL            | Remove a specific gallery image      |

---

### 5. Admin Products (`/api/v1/admin/products`)

| Method   | Endpoint                 | Auth      | Purpose                                                       |
| -------- | ------------------------ | --------- | ------------------------------------------------------------- |
| `GET`    | `/admin/products`        | Protected | List products with filters, search, and pagination            |
| `GET`    | `/admin/products/:id`    | Protected | Get complete product details by ID                            |
| `POST`   | `/admin/products`        | Protected | Create a new product                                          |
| `PATCH`  | `/admin/products/:id`    | Protected | Update an existing product                                    |
| `DELETE` | `/admin/products/:id`    | Protected | Delete a product & clean up Cloudinary images                 |

#### Admin List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `10`, max: `100`)
- `search` (searches Arabic/English name)
- `category` (`natural_granite` \| `natural_stone` \| `natural_marble` \| `quartz_industrial`)
- `published` (`true` \| `false`)

#### Example Request (`POST /admin/products`)

```json
{
  "name": {
    "ar": "رخام كريما مارفيل",
    "en": "Crema Marfil Marble"
  },
  "category": "natural_marble",
  "material": {
    "ar": "رخام طبيعي",
    "en": "Natural Marble"
  },
  "color": {
    "ar": ["بيج", "كريمي"],
    "en": ["Beige", "Cream"]
  },
  "origin": {
    "ar": ["إسبانيا"],
    "en": ["Spain"]
  },
  "uses": {
    "ar": ["أرضيات", "جدران", "سلالم"],
    "en": ["Flooring", "Walls", "Stairs"]
  },
  "surface": {
    "ar": ["مصقول", "مطفي"],
    "en": ["Polished", "Honed"]
  },
  "published": true
}
```

---

### 6. Public Products (`/api/v1/products`)

| Method | Endpoint          | Auth   | Purpose                                              |
| ------ | ----------------- | ------ | ---------------------------------------------------- |
| `GET`  | `/products`       | Public | List published products with pagination and filters  |
| `GET`  | `/products/:slug` | Public | Get a single published product by its unique slug    |

#### Public List Query Parameters:

- `page` (default: `1`)
- `limit` (default: `9`, max: `50`)
- `category` (`natural_granite` \| `natural_stone` \| `natural_marble` \| `quartz_industrial`)

---

### 7. Product Images (`/api/v1/admin/products/:id`)

| Method   | Endpoint                                | Auth      | Body / Params                 | Purpose                              |
| -------- | --------------------------------------- | --------- | ----------------------------- | ------------------------------------ |
| `POST`   | `/admin/products/:id/cover-image`       | Protected | Multipart (`coverImage`)      | Upload / replace product cover image |
| `DELETE` | `/admin/products/:id/cover-image`       | Protected | None                          | Remove product cover image           |
| `POST`   | `/admin/products/:id/gallery`           | Protected | Multipart (`gallery`, max 10) | Append new gallery images            |
| `DELETE` | `/admin/products/:id/gallery/:publicId` | Protected | `:publicId` in URL            | Remove a specific gallery image      |

---

## 🗄 Data Models

### Project Data Model

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
  projectType: "government" | "private";
  governmentEntity: {
    ar: string;
    en: string;
  } | null;
  contractors: Array<{
    name: {
      ar: string;
      en: string;
    };
    description: {
      ar: string;
      en: string;
    };
  }>;
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

### Product Data Model

```typescript
{
  name: {
    ar: string;
    en: string;
  };
  category: "natural_granite" | "natural_stone" | "natural_marble" | "quartz_industrial";
  material: {
    ar: string;
    en: string;
  };
  color: {           // Index position matters: ar[i] and en[i] = same real-world value
    ar: string[];
    en: string[];
  };
  origin: {
    ar: string[];
    en: string[];
  };
  uses: {
    ar: string[];
    en: string[];
  };
  surface: {
    ar: string[];
    en: string[];
  };
  slug: string;      // Unique, English-derived from name.en
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  gallery: Array<{
    url: string;
    publicId: string;
  }>;                // max 10 images
  published: boolean; // default: false
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🖼 Image Management & Cloudinary Workflow

1. **In-Memory Uploads:** Multer processes incoming multipart forms using `memoryStorage()`, keeping binary buffers strictly in RAM and passing them directly to Cloudinary's `upload_stream`. No temporary files are written to local disk.
2. **Predictable Folder Structure:** Images are stored under `{resource}/{resourceId}/cover` and `{resource}/{resourceId}/gallery` (e.g. `projects/{projectId}/cover`, `products/{productId}/gallery`).
3. **Atomic Replacement:** When uploading a new cover image, the new image is uploaded first, the database is updated, and only then is the old image destroyed on Cloudinary.
4. **Cascading Cleanup:** Deleting a project or product triggers deletion of its cover image and all gallery images from Cloudinary before removing the MongoDB document.

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
