// scratch/run-sync.ts
import { syncFestivals } from "../src/lib/collectors/sync";

async function run() {
  console.log("🚀 [ScratchRunner] Starting autonomous collector batch job...");
  try {
    const report = await syncFestivals();
    console.log("✅ [ScratchRunner] Sync complete! Report details:");
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error("❌ [ScratchRunner] Fatal error running sync:", error);
    process.exit(1);
  }
}

run();
