import Parser from "rss-parser";
import type { RSSFeedItem } from "@/types/news";

const parser = new Parser();

export async function fetchRSSFeed(url: string): Promise<RSSFeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []) as RSSFeedItem[];
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // 特殊文字を削除
    .replace(/\s+/g, "-") // スペースをハイフンに
    .replace(/-+/g, "-") // 連続ハイフンを1つに
    .trim()
    .substring(0, 100); // 最大100文字
}

