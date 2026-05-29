import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function resolveDatabaseUrl(rawUrl = process.env.DATABASE_URL) {
  const fallback = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  const url = rawUrl?.trim().replace(/^["']|["']$/g, "");

  if (!url) return fallback;
  if (!url.startsWith("file:")) return url;

  const filePath = url.slice("file:".length);
  if (!filePath) return fallback;
  if (path.isAbsolute(filePath)) return url;
  if (filePath === "./prisma/dev.db" || filePath === "prisma/dev.db") return fallback;

  return `file:${path.resolve(/*turbopackIgnore: true*/ process.cwd(), filePath)}`;
}

export const databaseUrl = resolveDatabaseUrl();

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = (() => {
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
})();

export const db = prisma;
