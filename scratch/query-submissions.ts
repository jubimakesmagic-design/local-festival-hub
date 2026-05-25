import { db } from "../src/lib/db";

async function main() {
  try {
    const submissions = await db.userSubmission.findMany();
    console.log("Submissions in DB:", submissions);
  } catch (error) {
    console.error("Query failed:", error);
  }
}

main();
