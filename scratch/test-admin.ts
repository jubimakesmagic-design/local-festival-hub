import { approveSubmissionAction } from "../src/app/admin/actions";

async function main() {
  try {
    console.log("Approving test submission with ID 5...");
    const result = await approveSubmissionAction(5);
    console.log("Approval result:", result);
  } catch (error) {
    console.error("Approval failed with error:", error);
  }
}

main();
