# AI Rules & Architectural Constraints (Senior Technical Architect)

1. **Reasoning**: Always explain technical trade-offs/decisions for code changes. Ask for clarification on ambiguous business/tenant rules.
2. **Low-Powered Server**: NEVER block Fastify event loop. Delegate heavy computation to Redis-backed background jobs (using raw Redis Streams or Lists).
3. **Multi-Tenant**: Auto-inject `branchId` to all operational Prisma models/queries. Enforce `where: { branchId }` isolation for Branch Managers. Super Admins bypass this.
4. **Caching**: Wrap static reads (menus/locations) in Redis. Mobile uses `@tanstack/react-query` + `react-native-mmkv` (stale-while-revalidate).
5. **Resilience**: Wrap Redis calls in try-catch with DB fallback. Handle Stripe timeouts gracefully. Connection Pooling uses Prisma PgBouncer/Accelerate to handle DB spikes.
6. **Tooling**: `pnpm@11.6.0`, `turborepo`, `biome` (`pnpm biome format --write .`). NO `npm/yarn/prettier/eslint`.
7. **Monorepo**: Apps never import apps. Share logic via `packages/` (e.g. `@cafe/core`).
8. **Ports**: Check `.env` `PORT`, fallback: API (4040), Mob (4041), Web (4042), Tab (4043), Postgres (4044), Redis (4045), LocalStack S3 (4046).
9. **Environment**: Local dev uses host node for apps (hot-reload); Docker for DB/Redis/LocalStack. Prod is fully Dockerized.
10. **Code Standard**: Strict TS. No `any`. Use `unknown` + Zod. Services handle logic, Repos handle DB, Routes handle HTTP/validation.
11. **Fastify (`apps/api`)**: Path-based routing (`fastify-autoload`). Isolate domains via `fastify-plugin`. Use native JSON Schema/TypeBox/Zod. ETag headers for large caches.
12. **Mobile (`customer-mobile`/`branch-tablet`)**: Expo modules. `StyleSheet` ONLY (no Tailwind). `react-native-reanimated` & `@shopify/flash-list`. Offline mutation queuing. `@stripe/stripe-react-native` for PCI.
13. **Web (`hq-web`)**: Next.js 14+ RSC. Fetch in server components. Tailwind CSS v4 + Framer Motion.
14. **Security**: Row-level/app-level scoping per `branchId`. JWT guards for Auth+RBAC. No committed `.env`s.
15. **Advanced Domains (Promotions)**: Rules Engine in `promotion-engine` evaluates carts via Redis against BOGO/Tiered rules.
16. **CI/CD**: `pnpm biome ci`, Turbo remote caching, Portainer/ECS/GHCR deploys.
