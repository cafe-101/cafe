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
- **Multi-Tenant**: Utilize PostgreSQL Schema-level multi-tenancy (`public` for global config, `tenant_<store_id>` for branch data) OR robust Row-Level Security (RLS) via Supabase to isolate data. Auto-inject `store_id` logic securely. Super Admins bypass local schemas.
- **Security**: Supabase Auth JWT guards for authentication and RBAC. No committed `.env`s.
- **Audit Logging**: All significant actions (e.g. sign in, sign up, purchases, cancellations, coupon usage) MUST be logged in the `AuditLog` table. This log must capture the action, `entityId`, `userId`, `ipAddress`, and `deviceInfo`.

## 4. Advanced Domains
- **Promotions**: Evaluates carts via Redis against BOGO/Tiered rules.
