import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const logConfig: any = process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"];

/**
 * Initializes and returns a new instance of PrismaClient configured for Postgres.
 * Enables query logging in development mode.
 * @returns {PrismaClient} A configured PrismaClient instance.
 */
const getPrismaClient = () => {
  if (connectionString) {
    const pool = new Pool({ connectionString });
    globalForPrisma.pool = pool;
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter, log: logConfig });
  }
  return new PrismaClient({ log: logConfig });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

export const closePrisma = async () => {
  await prisma.$disconnect();
  if (globalForPrisma.pool) {
    await globalForPrisma.pool.end();
  }
};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
