import { db } from "../src/lib/db";

async function main() {
  try {
    console.log("Querying database...");
    const festivals = await db.festival.findMany();
    console.log("Success! Found festivals:", festivals.length);
  } catch (error) {
    console.error("Database query failed with error:", error);
  }
}

main();
