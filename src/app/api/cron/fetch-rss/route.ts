import { fetchAndSaveRSS } from "@/lib/rssFetcher";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300; // 5分

export async function GET(request: Request) {
  // セキュリティ: Vercel Cronからのリクエストのみ許可
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fetchAndSaveRSS();
    return NextResponse.json({
      success: true,
      saved: result.savedCount,
      skipped: result.skippedCount,
    });
  } catch (error) {
    console.error("Error in fetch-rss cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

