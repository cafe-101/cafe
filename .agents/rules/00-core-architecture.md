# AI Rules & Architectural Constraints (Senior Technical Architect)

## 1. Business Context & System Overview
This project is a **Multi-Store Custom Food Ordering & Franchise Management Ecosystem** with one main Central Franchise Super-Admin and multiple branches (tenants).
- The `customer-mobile` app must provide a robust, feature-rich shopping experience for ordering, applying promos, and exploring purchasing options (dynamically scoped per store).
- `hq-web` is the central admin portal for global franchise management.
- `branch-tablet` is the Next.js PWA for individual branches (merchants/kitchens) to receive and fulfill orders with real-time order updates via Supabase Realtime WebSocket.

## 2. Global Engineering Principles
1. **Reasoning**: Always explain technical trade-offs/decisions for code changes. Ask for clarification on ambiguous business/tenant rules.
2. **Code Standard**: Strict TS. No `any`. Use `unknown` + Zod. Services handle logic, Repos handle DB, Routes handle HTTP/validation.
3. **Monorepo**: Apps never import apps. Share logic via `packages/` (e.g. `@cafe/core`).
4. **Tooling**: `pnpm@11.6.0`, `turborepo`, `biome` (`pnpm biome format --write .`). NO `npm/yarn/prettier/eslint`.
5. **Dependencies**: Always install the latest stable packages. Use exact pinned versions in `package.json` (no carets `^` or tildes `~`).
6. **Environment**: Local dev uses host node for apps (hot-reload); Docker for Redis; Supabase CLI for PostgreSQL, Auth, and Storage. Prod is fully Dockerized.
7. **Ports**: Check `.env` `PORT`, fallback: API (4040), Mob (4041), Web (4042), Tab (4043), Redis (4045), Supabase API (4047), Supabase DB (4048), Supabase Studio (4051).
8. **CI/CD**: `pnpm biome ci`, Turbo remote caching, Portainer/ECS/GHCR deploys.
9. **Cross-App Sync**: When working on a feature, bug fix, or update, ensure that all affected apps (e.g., `api`, `hq-web`, `customer-mobile`, `branch-tablet`) and shared packages are updated at the same time to maintain consistency across the ecosystem.
10. **Design & Functionality Consistency**: Functionality, UI style, and design patterns must remain consistent and similar throughout all applications within the ecosystem unless explicitly specified otherwise.
