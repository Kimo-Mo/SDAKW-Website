# SDAKW Frontend Plan

## Plan Purpose

This is the project-level implementation roadmap for the SDAKW frontend. It covers the public website, Admin Dashboard, architecture, tools, implementation phases, quality requirements, and deployment.

The frontend must integrate with the existing backend API and must not introduce features outside the approved scope.

---

## Current State

### Backend

The backend is currently ready for the approved scope:

- Implemented and reviewed.
- Updated for government/private project requirements.
- Old Categories system removed.
- Pushed to GitHub.
- Deployed on Render.
- MongoDB Atlas for the database.
- Cloudinary for image storage.

### Frontend

The frontend has not started.

The immediate next phase is:

```text
Frontend Foundation
```

---

# Scope

The frontend has two applications:

```text
Public Website
Admin Dashboard
```

## Public Website

Planned pages:

- Home.
- About.
- Projects.
- Project Details.
- Contact.

Required behavior:

- Arabic and English.
- RTL and LTR.
- Responsive design.
- Featured projects.
- Project listing.
- Project type filtering where required.
- Pagination.
- Loading, empty, and error states.

## Admin Dashboard

Required functionality:

- Admin login.
- Cookie-based authentication with server-verified session persistence.
- Protected routes.
- Logout.
- Dashboard layout.
- Projects listing.
- Create project.
- Edit project.
- Delete project.
- Publish/unpublish.
- Featured/unfeatured.
- Cover image management.
- Gallery image management.

---

# Project Rules

## Project Classification

There is no Categories system.

The only classification is:

```ts
projectType: 'government' | 'private'
```

### Government Projects

Government projects use:

- Government entity.
- One or more contractors.
- Standard project fields.

Contractors contain:

```ts
{
  name: {
    ar: string;
    en: string;
  },
  description: {
    ar: string;
    en: string;
  };
}
```

### Private Projects

Private projects do not use:

- Government entity.
- Contractors.

The frontend must conditionally handle these fields according to the existing backend rules.

## Status Rules

```text
ongoing
completed
```

Rules:

```text
ongoing   → completionDate = null
completed → completionDate is available
```

The UI must prevent contradictory states.

---

# Technology Stack

## Core

- Next.js.
- React.
- TypeScript.

## Styling and UI

- Tailwind CSS.
- shadcn/ui.

## Animation

- Framer Motion.

## Forms

- React Hook Form.
- Zod.

## Internationalization

- next-intl.

## API and Server State

- Axios.
- TanStack Query.

## Client State

Use local React state by default.

Use Zustand only if a genuine shared client-side state requirement appears.

Do not introduce Redux unless requirements change.

---

# Architecture Principles

- TypeScript-first.
- Clean component architecture.
- Feature-oriented organization where useful.
- Reusable components without unnecessary abstraction.
- Centralized API communication.
- No raw API calls scattered through UI components.
- TanStack Query for server state.
- React Hook Form for form state.
- Zod for validation.
- Minimal global state.
- Reuse shadcn/ui where appropriate.
- Avoid duplicated create/edit logic.
- Do not over-engineer.

---

# Proposed Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   └── [locale]/
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   └── projects/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   │   ├── api/
│   │   └── utils/
│   ├── types/
│   ├── constants/
│   └── styles/
├── .env.example
├── package.json
└── README.md
```

Do not create folders or abstractions without a current need.

---

# API Integration

Use environment variables:

```env
NEXT_PUBLIC_API_URL=
```

Centralize:

- Axios configuration.
- Base URL.
- API functions.
- Request/response types.
- Authentication handling where required.
- Error handling where appropriate.

Components should not contain duplicated raw Axios logic.

---

# Implementation Phases

## Phase 0 — Frontend Foundation

### Goal

Create the stable base for all frontend work.

### Tasks

- Initialize Next.js.
- Configure TypeScript.
- Configure Tailwind CSS.
- Initialize shadcn/ui.
- Configure next-intl.
- Configure Arabic and English.
- Implement RTL/LTR behavior.
- Configure TanStack Query.
- Create Axios/API foundation.
- Configure environment variables.
- Define initial folder architecture.
- Configure global styles.
- Configure fonts.
- Add basic shared utilities.

### Done When

- Application runs successfully.
- Arabic and English work.
- RTL/LTR switches correctly.
- TanStack Query is configured.
- API foundation is configured.
- Environment variables are documented.
- Project structure is ready for features.

---

## Phase 1 — Shared UI Foundation

### Goal

Create reusable UI needed across both applications.

### Components

- Button.
- Input.
- Textarea.
- Select.
- Checkbox/switch where needed.
- Dialog.
- Alert/confirmation dialog.
- Card.
- Badge.
- Skeleton.
- Empty state.
- Error state.
- Loading state.
- Toast/notification support.
- Pagination where required.

Prefer shadcn/ui when suitable.

### Done When

- Shared components are reusable.
- UI states are consistent.
- Components work correctly in Arabic and English.

---

## Phase 2 — Admin Authentication

### Features

- Login page.
- Login form.
- Validation.
- Authentication API integration.
- HTTP-only, SameSite, Secure cookie authentication; the frontend never reads
  the JWT.
- Verify every protected route with `GET /auth/me` before rendering protected
  content, with a loading state during verification.
- Redirect every API `401` through one shared Axios response interceptor; no
  refresh-token flow.
- Protected routes.
- Redirect handling.
- Logout.
- Error handling.

### Done When

- Valid credentials allow access.
- Unauthorized users cannot access protected pages.
- Logout clears authentication state.
- Authentication errors are handled.

---

## Phase 3 — Admin Dashboard Layout

### Features

- Dashboard shell.
- Sidebar/navigation.
- Header.
- Responsive behavior.
- Mobile navigation.
- Basic dashboard overview.

Possible project metrics:

- Total projects.
- Published projects.
- Ongoing projects.
- Completed projects.

### Done When

- Navigation works.
- Layout is responsive.
- Protected pages render correctly.

---

## Phase 4 — Projects Management

### Features

- Projects listing.
- Pagination.
- Search/filter only where supported by the existing API or approved UI behavior.
- Status display.
- Published state.
- Featured state.
- Edit navigation.
- Delete action.
- Delete confirmation.
- Loading state.
- Empty state.
- Error state.

### Done When

- Projects load correctly.
- Pagination works.
- Deletion requires confirmation.
- API state updates after mutations.

---

## Phase 5 — Create and Edit Project

### Common Fields

- Title Arabic.
- Title English.
- Description Arabic.
- Description English.
- Location Arabic.
- Location English.
- Project type.
- Status.
- Completion date.
- Featured.
- Published.

### Government Project

When:

```text
projectType = government
```

show:

- Government entity Arabic.
- Government entity English.
- Contractors.

Each contractor includes:

- Name Arabic.
- Name English.
- Description Arabic.
- Description English.

The admin can:

- Add contractors.
- Remove contractors.
- Edit contractors.

### Private Project

When:

```text
projectType = private
```

hide:

- Government entity.
- Contractors.

Submit normalized values according to the backend contract.

### Status

When:

```text
status = ongoing
```

completion date is not required.

When:

```text
status = completed
```

completion date is available.

### Images

The admin MUST manage images as part of the project form experience.

The frontend MUST internally perform:

```text
Create project
    ↓
Receive project ID
    ↓
Upload cover image
    ↓
Upload gallery images
```

For editing, display and manage existing images using the available API endpoints.

Support:

- Cover preview.
- Gallery previews.
- Upload states.
- Upload errors.
- Removing existing images independently of adding new images.
- Removing selected images before submission.
- Loading, error, success, and pending/disabled states for every project-save
  and image-upload step, including clear partial-failure feedback.
- Client-side enforcement of the 10-image gallery cap before submission.

### Done When

- Government/private conditional logic works.
- Contractor management works.
- Status rules work.
- Validation works.
- Create works.
- Edit works.
- Image flows work.
- API state updates correctly.
- Government/private and ongoing/completed rules have explicit test coverage.

---

## Phase 6 — Public Website Foundation

### Features

- Public layout.
- Header.
- Navigation.
- Language switcher.
- Mobile navigation.
- Footer.
- RTL/LTR support.

Google Stitch may be used to explore the visual direction.

Generated output is design inspiration only and should not be treated as production-ready implementation.

### Done When

- Navigation works.
- Locale switching works.
- Responsive navigation works.
- RTL/LTR works.

---

## Phase 7 — Home Page

### Sections

- Hero.
- Company introduction.
- Featured projects.
- Services overview.
- CTA.
- Contact preview.

Static company content remains hardcoded according to the approved scope.

Featured projects load from the backend.

### Done When

- Responsive implementation is complete.
- Featured projects load correctly.
- Loading/error states are handled.
- Arabic and English work.

---

## Phase 8 — Projects Listing

### Features

- Projects grid/list.
- Project cards.
- Project type filtering if required by approved API/UI behavior.
- Pagination.
- Loading state.
- Empty state.
- Error state.

### Done When

- Published projects display correctly.
- Filtering works where supported.
- Pagination works.
- Project details navigation works.

---

## Phase 9 — Project Details

Display standard project information.

For government projects, display:

- Government entity.
- Contractors.

For private projects, government-only sections must not appear.

Display completion date only when relevant.

### Done When

- Correct project data loads.
- Arabic/English content works.
- Conditional government/private sections work.
- Gallery works.
- Loading/error states are handled.

---

## Phase 10 — About and Contact

### About

- Company overview.
- Vision.
- Mission.

### Contact

- Contact information.
- Social media links.
- WhatsApp CTA.
- Contact form only if included in final approved scope.

Static content remains frontend-managed.

---

## Phase 11 — Final Quality Pass

### Responsive

Verify:

- Mobile.
- Tablet.
- Desktop.
- Large desktop.

### RTL/LTR

Verify:

- Direction.
- Alignment.
- Navigation.
- Forms.
- Directional icons.
- Tables.
- Dialogs.
- Grids.
- Sidebar behavior.

### UX

Verify:

- Loading.
- Error.
- Empty.
- Pending.
- Form errors.
- Delete confirmation.
- Success feedback.

### Accessibility

Review:

- Semantic HTML.
- Labels.
- Keyboard interaction.
- Focus states.
- Accessible dialogs.
- Image alt text.

### Performance

Review:

- Next.js image optimization.
- Unnecessary client components.
- Unnecessary re-renders.
- Query caching.
- Lazy loading where useful.

### SEO

Apply to public pages:

- Metadata.
- Titles.
- Descriptions.
- Heading hierarchy.
- Semantic HTML.
- Image alt text.
- Open Graph metadata where appropriate.

---

## Phase 12 — Production Deployment

### Tasks

- Verify production build.
- Configure production environment variables.
- Deploy frontend to Vercel.
- Connect frontend to production backend.
- Verify Arabic.
- Verify English.
- Verify mobile.
- Perform production smoke testing.
- Connect `sdakw.com` when ready.

### Done When

- Production build succeeds.
- Frontend communicates with the production API.
- Core public and admin flows work in production.
- Domain connection is completed when approved.

---

# Git Commit Milestones

Suggested commits:

```text
chore: initialize frontend project
feat: add frontend foundation and providers
feat: configure internationalization and rtl support
feat: add shared ui foundation
feat: implement admin authentication
feat: implement admin dashboard layout
feat: implement projects management
feat: implement project create and edit forms
feat: add project image management
feat: implement public website layout
feat: implement home page
feat: implement projects listing
feat: implement project details page
feat: implement about and contact pages
fix: refine rtl and responsive behavior
perf: optimize frontend performance
docs: update frontend documentation
```

Commits should represent logical milestones, not every tiny change.

---

# Out of Scope

Do not add these unless requirements explicitly change:

- E-commerce.
- Product management.
- Payments.
- Customer accounts.
- Multiple admin roles.
- Complex analytics.
- Chat.
- Notifications.
- Full CMS for static company content.
- A new Categories system.
- Unnecessary backend changes.
- Unnecessary global state systems.

---

# Definition of Done

The frontend is complete when:

- Public website is implemented.
- Admin Dashboard is implemented.
- Authentication works.
- Protected routes work.
- Projects can be created, edited, and deleted.
- Publish/unpublish works.
- Featured projects work.
- Cover and gallery management work.
- Government/private logic works.
- Government entities and contractors work.
- Private projects do not expose government-only information.
- Arabic and English work correctly.
- RTL and LTR work correctly.
- Public and admin interfaces are responsive.
- Loading, empty, error, and pending states are handled.
- Accessibility basics are addressed.
- SEO basics are applied to public pages.
- Production build succeeds.
- Frontend deploys successfully.
- Production frontend communicates correctly with the backend.
- The custom domain is connected when ready.

---

# Immediate Next Action

The next phase is:

```text
Frontend Foundation
```

Recommended Spec Kit flow:

```text
Create/update constitution
        ↓
Create Frontend Foundation specification
        ↓
Clarify unresolved decisions if needed
        ↓
Create implementation plan
        ↓
Generate tasks
        ↓
Review/analyze
        ↓
Implement
```

This file is the project-level frontend roadmap. Individual Spec Kit feature specifications, plans, and tasks should be created separately as each major feature begins.
