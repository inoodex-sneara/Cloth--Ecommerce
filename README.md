# Cloth Ecommerce (Loomora)

Next.js 16 frontend for Loomora — connected live to the Laravel backend (`/api/v1`). Pages fetch real data; demo/static product data has been removed from all API-connected pages.

## Getting Started

```bash
npm install
npm run dev   # http://localhost:3000
```

Backend (Laravel) must be running and reachable. Set the API origin in `.env`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

For production, point this at the deployed backend URL (the Vercel frontend domain itself is **not** the backend — `/api/v1` will 404 there).

---

## API Integration Map

Which page uses which API, and why.

| Page | API endpoints | Why |
| --- | --- | --- |
| **Global shell** (`Navbar`, `Footer`, `Layout`) | `GET /settings` | Store name, logo, contact info, social links, policies come from admin settings, not hardcoded. |
| **`/`** (Home) — `Hero`, `PopularCategories`, `ExclusiveCollection`, `DailyDeals`, `NewCollection` | `GET /home` | Single feed supplies hero banners, category tiles, flash-sale items, curated collections. |
| **`/men` `/women` `/kids` `/new-in` `/accessories`** | `GET /products` (category filter), `GET /categories` | Catalog grids filtered by category slug; no static arrays. |
| **`/best-deals`** | `GET /products` (discount/sort) | Live discounted products. |
| **`/search`** | `GET /products` (`search`, `sort`, `page`) | Server-side search + sort + pagination. |
| **`/category/[slug]`** | `GET /categories/{slug}`, `GET /products` (category) | Category header (name, image, count) + product grid. |
| **`/product/[id]`** — `ProductDetail`, `ProductReviews` | `GET /products/{id}`, `GET /products/{id}/reviews`, `POST /products/{id}/reviews` | Product detail + related products; reviews fetched live and users can submit a review (auto-approved). |
| **`/puja-2026` `/festival-26` `/budget-picks`** — `CampaignPage` | `GET /campaigns/{slug}`, fallback `GET /campaigns` / `GET /products` | Campaign pages render flash-sale items; fall back to active campaign or filtered products (budget = under ৳1000). |
| **`/cart`** | local (client state) | Cart is client-side; totals computed locally. |
| **`/checkout`** | `POST /coupons/validate`, `POST /orders` | Coupon validation on apply; order placement on submit. Generates jsPDF invoice. |
| **`/order-tracking`** — `OrderTracking` | `GET /orders/track/{orderNumber}?phone=` | Status timeline, courier tracking code, items. Recent orders read from localStorage. |
| **`/account`** | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` | Register/login (token saved to localStorage); profile view when logged in; sign out. |
| **`/account/orders`** | `GET /auth/orders` | Order history for the logged-in customer, with pagination. |
| **`/wishlist`** — `WishlistProvider` | `GET /wishlist`, `POST /wishlist/toggle`, `POST /wishlist/sync` | Guest wishlist in localStorage; on login it merges (`sync`) into the cloud account. Toggle syncs both. |
| **`/pages/[slug]`** | `GET /pages`, `GET /pages/{slug}` | CMS pages: `about-us`, `privacy-policy`, `terms-and-conditions`, `shipping-and-returns`. |
| **`/blogs`**, **`/blogs/[slug]`** | `GET /blogs` (`category`, `page`), `GET /blogs/{slug}` | Blog list with category filter + pagination; post body + related posts. |
| **`/contact`** | `POST /contact` | Contact form → stored inquiry; success message from API. |

### Shared API layer (`src/lib/api/`)

- `client.ts` — `apiFetch()` wrapper (JSON, auth header, `ApiError`, `apiErrorMessage()` maps Laravel 422 field errors).
- `settings.ts`, `home.ts`, `products.ts`, `categories.ts`, `campaigns.ts`, `coupons.ts`, `orders.ts`, `track.ts`, `reviews.ts`, `auth.ts`, `wishlist.ts`, `pages.ts`, `blogs.ts`, `contact.ts`, `media.ts` (`mediaUrl()` resolves `/storage/...` to the API origin).

---

## Notes & Gotchas

- **Response shapes differ from the docs** — the code follows the *actual* backend responses (e.g. register/login token is top-level; `/auth/me` is flat; wishlist toggle returns `in_wishlist`; blog detail nests `data.post`).
- **Missing media = 403.** Product images/banners that don't exist on the backend `/storage/` return 403 — upload them via the admin panel. The frontend handles this gracefully (placeholder/skip).
- **Courier (Steadfast/Pathao) & fraud APIs are admin-only.** No customer-facing endpoint exposes them; the tracking page hides the courier box when no tracking code exists.
- **Rate limits:** checkout 30/min, contact 15/min, reviews 20/min, track 60/min. 429 messages surface through `apiErrorMessage()`.
- **Static demo data** was removed from all pages in the table above; only genuinely client-side pages (cart) still use local state.

## Tech

- Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript.
- `params` / `searchParams` are Promises in route components.
- Path alias `@/*` → `src/*`.
- Lint + typecheck: `npm run lint && npx tsc --noEmit`.
