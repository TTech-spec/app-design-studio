# AGRICON NG — Responsive Web + Desktop Extension

This is a large, multi-part build. Below is the scoped plan I'll execute in one pass so the whole thing ships coherently.

## 1. Preserve mobile — no regressions
- Keep the existing 50-screen mobile flow (`/app/$screen`) intact. Same colors, tokens, components, images, brand icons.
- Existing screens registry (`SCREEN_COMPONENTS`) stays as source of truth for mobile rendering.

## 2. Add 3 new onboarding screens (mobile + web)
- New slugs: `onboarding-1`, `onboarding-2`, `onboarding-3`, inserted after `verify-otp` and before `home` in `SCREENS` order.
- Each screen: hero image (using existing farm photos), headline, description, Next/Skip (screens 1–2) and Get Started/Skip (screen 3). Skip on any → Home; Get Started on 3 → Home.

## 3. Responsive web/desktop shell (new)
- New route group under `/web/*` giving every mobile screen a proper desktop layout:
  - `/web` → Landing (existing marketing page moves here, plus updated CTAs).
  - `/web/auth/welcome`, `/web/auth/signup`, `/web/auth/signin`, `/web/auth/verify`, `/web/onboarding/1..3`.
  - `/web/dashboard` (Home), `/web/categories`, `/web/search`, `/web/product/$id`, `/web/cart`, `/web/checkout`, `/web/payment`, `/web/order/confirmation`, `/web/orders`, `/web/messages`, `/web/notifications`, `/web/profile`, `/web/settings`, plus farmer/distributor dashboards.
- New `WebShell` component: top nav (logo, search, cart, notifications, avatar) + collapsible left sidebar for dashboard sections. Consistent tokens with mobile.
- Uses the SAME data (`agricon-data.ts`) and same design tokens from `styles.css`. Cards, buttons, chips reused from `ui.tsx`.
- Grid-based responsive layouts (2–4 columns) with tables for orders/messages, cards for products, forms for checkout.

## 4. Full clickable prototype
- Every CTA/button/card links to its logical next screen on both mobile (`/app/$screen`) and web (`/web/...`).
- Landing "Get started" → `/web/auth/signup` (desktop) or `/app/welcome` (mobile) depending on viewport — for simplicity: always `/web/auth/welcome`, which itself links to both experiences.

## 5. Assets
- Replace the current stylized logo with a clean flat SVG mark (leaf + wordmark) — used everywhere.
- Add official Apple App Store + Google Play SVG badges as `AppStoreBadge` / `GooglePlayBadge` components (official artwork, flat, no 3D).
- Keep existing Google/Microsoft/Apple brand SVGs (already official). Add flat Email icon.
- Reuse existing high-quality farm photos (cassava, grains, vegetables, cocoa, poultry, yam) — no 3D/cartoon replacements needed.

## 6. Landing page updates
- Swap 3D-ish hero art for flat/photographic layout.
- Replace store-badge placeholders with the new official badges.
- All "Get started" CTAs route into the new web flow.

## Technical notes
- New files:
  - `src/components/web/WebShell.tsx`, `src/components/web/Sidebar.tsx`, `src/components/web/TopNav.tsx`
  - `src/components/web/screens/*.tsx` (one per web screen, ~18 files)
  - `src/components/brand/Logo.tsx`, `src/components/brand/StoreBadges.tsx`
  - `src/routes/web.tsx` (layout with `<Outlet/>`), and `src/routes/web.<section>.tsx` leaf routes
  - 3 new mobile onboarding components added into `screens.tsx`
- No changes to tokens or existing mobile components beyond adding onboarding entries + swapping logo usage.
- Router: file-based via TanStack; each new route file uses `createFileRoute("/web/...")` — routeTree regenerates automatically.

## Out of scope
- No backend/auth wiring (prototype only).
- No new brand identity — colors/typography unchanged.

Given the size (~25 new files, ~3000 LOC), this will take one long focused build. Approving this plan means I proceed straight through without further check-ins until it's ready.
