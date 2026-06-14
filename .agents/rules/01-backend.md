# Backend AI Rules (`apps/api` & `packages/db`)

## 1. Fastify Conventions
- **Routing**: Path-based routing (`fastify-autoload`). 
- **Domains**: Isolate domains via `fastify-plugin`. 
- **Validation**: Use native JSON Schema/TypeBox/Zod. 
- **Performance**: ETag headers for large caches.

## 2. Server Architecture & Resilience
- **Low-Powered Server**: NEVER block Fastify event loop. Delegate heavy computation to Redis-backed background jobs (using raw Redis Streams or Lists).
- **Caching**: Wrap static reads (menus/locations) in Redis.
- **Resilience**: Wrap Redis calls in try-catch with DB fallback. Handle Stripe timeouts gracefully. Connection Pooling uses Prisma PgBouncer/Accelerate to handle DB spikes.

## 3. Database & Security
- **Multi-Tenant**: Auto-inject `branchId` to all operational Prisma models/queries. Enforce `where: { branchId }` isolation for Branch Managers. Super Admins bypass this.
- **Security**: Row-level/app-level scoping per `branchId`. JWT guards for Auth+RBAC. No committed `.env`s.
- **Audit Logging**: All significant actions (e.g. sign in, sign up, purchases, cancellations, coupon usage) MUST be logged in the `AuditLog` table. This log must capture the action, `entityId`, `userId`, `ipAddress`, and `deviceInfo`.

## 4. Advanced Domains
- **Promotions**: Rules Engine in `promotion-engine` evaluates carts via Redis against BOGO/Tiered rules.
