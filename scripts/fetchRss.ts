import { config } from "dotenv";
import { fetchAndSaveRSS } from "../src/lib/rssFetcher";

// .env.localから環境変数を読み込む
config({ path: ".env.local" });

async function main() {
  console.log("🚀 Starting RSS fetch process...\n");
  
  try {
    const result = await fetchAndSaveRSS();
    console.log("\n✅ RSS fetch completed successfully!");
    console.log(`📊 Total: ${result.savedCount} saved, ${result.skippedCount} skipped`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during RSS fetch:", error);
    process.exit(1);
  }
}

main();

