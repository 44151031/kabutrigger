import { getAllKeywords } from "./supabaseClient";
import type { Keyword } from "@/types/news";

let cachedKeywords: Keyword[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1時間

export async function getKeywords(): Promise<Keyword[]> {
  const now = Date.now();
  if (cachedKeywords && now - cacheTimestamp < CACHE_TTL) {
    return cachedKeywords;
  }

  cachedKeywords = await getAllKeywords();
  cacheTimestamp = now;
  return cachedKeywords;
}

export function extractTagsFromTitle(
  title: string,
  keywords: Keyword[]
): string[] {
  const tags: string[] = [];
  const lowerTitle = title.toLowerCase();

  for (const kw of keywords) {
    if (lowerTitle.includes(kw.keyword.toLowerCase())) {
      tags.push(kw.label);
    }
  }

  return tags;
}

