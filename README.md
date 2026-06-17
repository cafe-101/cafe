# Cafe Monorepo

Welcome to the **Cafe** software suite! This is a high-performance, multi-tenant monorepo designed to scale across multiple cafe branches. It includes backend APIs, head-office web portals, and customer/branch mobile apps.

## 🚀 Tech Stack

- **Package Manager:** `pnpm` (Workspace) + `turborepo`
- **Node Environment:** Node.js >= 24
- **Database:** PostgreSQL 18.4 + Prisma ORM (Multi-tenant schema) + Supabase (Local)
- **Caching & Queues:** Redis 8.8.0 (using raw Redis Streams/Lists for background tasks)
- **Storage:** LocalStack S3 API (v4.14.0) + Supabase Storage
- **Backend API:** Fastify (Path-based routing, Zod validation)
- **Web Frontend:** Next.js 14+ (App Router, Tailwind CSS v4) for `hq-web` and `branch-tablet` (PWA)
- **Mobile Apps:** Expo / React Native (`customer-mobile`)
- **Payments:** Stripe (Web, Native Apple Pay & Google Pay)

---

## 📁 Project Structure

```text
cafe/
├── apps/
│   ├── api/                 # Fastify core API
│   ├── customer-mobile/     # Expo app for customers (iOS/Android)
│   ├── hq-web/              # Next.js app for Head Office
│   └── branch-tablet/       # Next.js PWA for Kitchen Display & POS
├── packages/
│   ├── db/                  # Prisma schema, migrations, and PostgreSQL adapters
│   ├── core/                # Shared business logic, DTOs, Zod schemas
│   └── biome-config/        # Shared formatting and linting rules
├── docker/                  # Local infrastructure configs (Postgres, Redis, LocalStack)
└── .agents/                 # Architecture and AI agent guidelines
```

---

## ⚙️ Port Allocations

To ensure zero conflicts during local development, services are mapped to a strictly assigned `404X` block. If `.env` is missing, these fallback ports are used automatically:

- `apps/api`: **4040**
- `apps/customer-mobile`: **4041**
- `apps/hq-web`: **4042**
- `apps/branch-tablet`: **4043**
- **PostgreSQL (18.4)**: `4044`
- **Redis (8.8.0)**: `4045`
- **LocalStack S3**: `4046`
- **Supabase API**: `4047`
- **Supabase DB**: `4048`
- **Supabase Studio**: `4051`
- **Supabase Mailpit**: `4052`

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: `v24` or higher
- **pnpm**: `v11.6.0`
- **Docker** & **Docker Compose**

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone git@github.com:cafe-101/cafe.git
cd cafe
pnpm install
```

### 3. Environment Setup
Configure your environment variables for local development:
```bash
# Setup Docker infrastructure environment
cp docker/.env-example docker/.env

# Setup API environment
cp apps/api/.env-example apps/api/.env
```

### 4. Start Infrastructure
Launch the local PostgreSQL, Redis, and LocalStack instances via Docker Compose, and then start the Supabase stack:
```bash
cd docker
docker compose up -d
npx supabase start
cd ..
```

### 5. Run Development Servers
Start all applications and packages in parallel utilizing Turborepo:
```bash
# Run all apps in development mode
pnpm dev

# Or build the entire monorepo
pnpm build
```

### 6. Run Mobile Apps
The mobile applications are built with Expo. You can run them individually:
```bash
# Start the Expo bundler
cd apps/customer-mobile
pnpm start
```
Once the bundler starts, you can test the app using **Expo Go**:
1. Download the "Expo Go" app on your physical iOS or Android device.
2. Ensure your phone and computer are on the same Wi-Fi network.
3. **iOS**: Open your Camera app and scan the QR code shown in the terminal.
4. **Android**: Open the Expo Go app and tap "Scan QR Code".

If you prefer to use local emulators instead of Expo Go:
```bash
# For iOS Simulator (requires macOS + Xcode)
pnpm run ios

# For Android Emulator (requires Android Studio)
pnpm run android
```
*(Note: For the tablet app in `apps/branch-tablet`, use `pnpm dev` since it is a Next.js PWA).*

---

## 🏗️ Architectural Rules & AI Guidelines

For critical team guidelines, system architecture rules, and AI assistant prompt instructions, please refer to the `.agents/rules/` directory.

All AI coding assistants (like Cursor, Windsurf, or Antigravity) are instructed to automatically read from that directory for project context.
