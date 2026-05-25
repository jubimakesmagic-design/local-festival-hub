// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;
const dbPath = "file:" + path.resolve(process.cwd(), "prisma/dev.db");

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({
    url: dbPath
  });
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({
      url: dbPath
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export const db = prisma;
