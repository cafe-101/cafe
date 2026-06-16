# AI Rules & Architectural Constraints (Senior Technical Architect)

## 1. Business Context & System Overview
This project is a **Coffee Shop Chain** with one main headquarters (HQ) and multiple branches. It is **NOT** a multi-vendor marketplace. 
- The `customer-mobile` app must provide a robust, feature-rich shopping experience (similar to Daraz/Pathao) for ordering, applying promos, and exploring purchasing options. 
- `hq-web` is the central admin portal.
- `branch-tablet` is strictly for individual branches to receive and fulfill orders. (CURRENTLY INACTIVE)

## 2. Global Engineering Principles
1. **Reasoning**: Always explain technical trade-offs/decisions for code changes. Ask for clarification on ambiguous business/tenant rules.
2. **Code Standard**: Strict TS. No `any`. Use `unknown` + Zod. Services handle logic, Repos handle DB, Routes handle HTTP/validation.
3. **Monorepo**: Apps never import apps. Share logic via `packages/` (e.g. `@cafe/core`).
4. **Tooling**: `pnpm@11.6.0`, `turborepo`, `biome` (`pnpm biome format --write .`). NO `npm/yarn/prettier/eslint`.
5. **Dependencies**: Always install the latest stable packages. Use exact pinned versions in `package.json` (no carets `^` or tildes `~`).
6. **Environment**: Local dev uses host node for apps (hot-reload); Docker for DB/Redis/LocalStack. Prod is fully Dockerized.
7. **Ports**: Check `.env` `PORT`, fallback: API (4040), Mob (4041), Web (4042), Tab (4043), Postgres (4044), Redis (4045), LocalStack S3 (4046).
8. **CI/CD**: `pnpm biome ci`, Turbo remote caching, Portainer/ECS/GHCR deploys.
9. **Cross-App Sync**: When working on a feature, bug fix, or update, ensure that all affected apps (e.g., `api`, `hq-web`, `customer-mobile`, `branch-tablet`) and shared packages are updated at the same time to maintain consistency across the ecosystem.
10. **Design & Functionality Consistency**: Functionality, UI style, and design patterns must remain consistent and similar throughout all applications within the ecosystem unless explicitly specified otherwise.
