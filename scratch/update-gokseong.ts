import { db } from "../src/lib/db";

async function main() {
  try {
    const festival = await db.festival.findFirst({
      where: { name: { contains: "곡성" } }
    });
    
    if (festival) {
      console.log("Updating Gokseong Rose Festival imageUrl in DB...");
      const updated = await db.festival.update({
        where: { id: festival.id },
        data: { imageUrl: "/images/gokseong_roses_official.png" }
      });
      console.log("Update success!", updated);
    } else {
      console.log("Gokseong Rose Festival not found in DB!");
    }
  } catch (error) {
    console.error("Update failed:", error);
  }
}

main();
