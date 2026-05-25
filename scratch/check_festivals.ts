// scratch/check_festivals.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const adapter = new PrismaBetterSqlite3({
  url: "file:" + path.resolve(process.cwd(), "prisma/dev.db")
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const festivals = await prisma.festival.findMany({
    select: {
      id: true,
      name: true,
      region: true,
      category: true,
      imageUrl: true,
      officialUrl: true,
    }
  });

  console.log(`🔍 Total festivals in database: ${festivals.length}`);
  festivals.forEach((f, idx) => {
    console.log(`${idx + 1}. [${f.category}] ${f.name} (${f.region}) -> ${f.imageUrl}`);
  });
}

main();
