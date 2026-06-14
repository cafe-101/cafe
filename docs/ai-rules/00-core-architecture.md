# AI Rules & Architectural Constraints (Senior Technical Architect)

## 1. Business Context & System Overview
This project is a **Coffee Shop Chain** with one main headquarters (HQ) and multiple branches. It is **NOT** a multi-vendor marketplace. 
- The `customer-mobile` app must provide a robust, feature-rich shopping experience (similar to Daraz/Pathao) for ordering, applying promos, and exploring purchasing options. 
- `hq-web` is the central admin portal.
- `branch-tablet` is strictly for individual branches to receive and fulfill orders.

## 2. Global Engineering Principles
1. **Reasoning**: Always explain technical trade-offs/decisions for code changes. Ask for clarification on ambiguous business/tenant rules.
2. **Code Standard**: Strict TS. No `any`. Use `unknown` + Zod. Services handle logic, Repos handle DB, Routes handle HTTP/validation.
3. **Monorepo**: Apps never import apps. Share logic via `packages/` (e.g. `@cafe/core`).
4. **Tooling**: `pnpm@11.6.0`, `turborepo`, `biome` (`pnpm biome format --write .`). NO `npm/yarn/prettier/eslint`.
5. **Environment**: Local dev uses host node for apps (hot-reload); Docker for DB/Redis/LocalStack. Prod is fully Dockerized.
6. **Ports**: Check `.env` `PORT`, fallback: API (4040), Mob (4041), Web (4042), Tab (4043), Postgres (4044), Redis (4045), LocalStack S3 (4046).
7. **CI/CD**: `pnpm biome ci`, Turbo remote caching, Portainer/ECS/GHCR deploys.
