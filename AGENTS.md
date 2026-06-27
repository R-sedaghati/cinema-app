# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server (http://localhost:3000)
yarn build      # production build
yarn lint       # run ESLint
```

No test suite configured.

## Architecture

**Next.js 16 App Router** project for ArchiveHonar — a cinema artists registry. Persian/RTL UI (`lang="fa" dir="rtl"`). Capacitor configured for mobile (`com.archive.cinema`).

### Route structure

Two separate route trees with separate layouts:

- `app/(main)/` — public-facing landing site (artists, registration, profile, support, FAQ, about)
- `app/admin/` — admin panel (requests management, categories, users, content, transactions)

### Service layer (`lib/services/`)

Two Axios instances with separate auth:

| File | Instance | Auth store | Used by |
|------|----------|------------|---------|
| `landingAxiosInstance.ts` | `landingApi` | `useAuthStore` | landing/* |
| `axiosInstance.ts` | `api` (admin) | `useAdminAuthStore` | admin/* |

Each domain (`landing/`, `admin/`) has three files: `api.ts` (raw functions), `hook.ts` (TanStack Query wrappers), `type.ts` (TypeScript types).

**Pattern for new API calls:** add raw fn to `api.ts` → add `useQuery`/`useMutation` wrapper to `hook.ts` → consume hook in component. Never call axios directly from components.

### State management (`lib/stores/`)

Zustand with `persist` middleware:

- `useAuthStore` — user session (`landing-auth-storage` key in localStorage)
- `useAdminAuthStore` — admin session
- `useLoginDrawerStore` — login drawer open state
- `useUserArtist` — user's own artist request

### Auth flows

- **User:** OTP via phone number (2-step: send → verify). Token stored in `useAuthStore`. `landingAxiosInstance` injects token automatically.
- **Admin:** username/password → JWT. `axiosInstance` injects token; 401 triggers `logout()` + redirect to `/admin/login`.

### API

Base URL: `http://api.archivehonar.ir/api`

All responses wrap data in `ApiResponse<T>` envelope (`message`, `result`, optional pagination). Full endpoint reference in `api.md`.

### UI

- Component library: `@dgshahr/ui-kit` with `@dgshahr/dg-theme-tailwind-plugin`
- Styling: Tailwind v4
- Font: Meem (local, `--font-meem` variable)
- Toasts: `react-toastify` (RTL, top-center)
- Carousel/swiper: `swiper`
- Icons: `lucide-react`

### Query defaults

All `useQuery` hooks use `refetchInterval: 30_000`, `refetchOnWindowFocus: false`. Queries gated on auth use `enabled: Boolean(accessToken)`.
