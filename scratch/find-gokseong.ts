import { db } from "../src/lib/db";

async function main() {
  try {
    const festival = await db.festival.findFirst({
      where: { name: { contains: "곡성" } }
    });
    console.log("Found Gokseong festival in DB:", festival);
  } catch (error) {
    console.error("Query failed:", error);
  }
}

main();
