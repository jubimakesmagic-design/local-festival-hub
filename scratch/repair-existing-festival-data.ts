import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { isLikelyStockImage, normalizeOfficialUrl, normalizeSourceUrl, pickFestivalImage } from "../src/lib/collectors/quality";

const adapter = new PrismaBetterSqlite3({
  url: "file:" + path.resolve(process.cwd(), "prisma/dev.db")
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const festivals = await prisma.festival.findMany({
    include: { sources: true }
  });

  for (const festival of festivals) {
    const imageUrl = pickFestivalImage(festival.name, festival.imageUrl) || (isLikelyStockImage(festival.imageUrl) ? null : festival.imageUrl);

    await prisma.festival.update({
      where: { id: festival.id },
      data: {
        imageUrl,
        officialUrl: normalizeOfficialUrl(festival.officialUrl) || null
      }
    });

    for (const source of festival.sources) {
      await prisma.festivalSource.update({
        where: { id: source.id },
        data: {
          url: normalizeSourceUrl(source.url, festival.officialUrl)
        }
      });
    }
  }

  console.log(`Repaired ${festivals.length} festivals.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
