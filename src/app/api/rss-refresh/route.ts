import { fetchAndSaveRSS } from "@/lib/rssFetcher";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300; // 5分

export async function GET() {
  try {
    const result = await fetchAndSaveRSS();
    return NextResponse.json({
      success: true,
      saved: result.savedCount,
      skipped: result.skippedCount,
    });
  } catch (error) {
    console.error("Error in rss-refresh:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

