import { fetchRSSFeed, generateSlug } from "./rssParser";
import { insertNews, checkNewsExists } from "./supabaseClient";
import { getKeywords, extractTagsFromTitle } from "./keywordManager";
import type { NewsItem, RSSFeedItem } from "@/types/news";

const RSS_SOURCES = [
  {
    url: "https://kabutan.jp/rss/news",
    source: "Kabutan" as const,
  },
  {
    url: "https://news.google.com/rss/search?q=株式+上場来高値+OR+TOB+OR+決算+when:1d&hl=ja&gl=JP&ceid=JP:ja",
    source: "GoogleNews" as const,
  },
];

export async function fetchAndSaveRSS() {
  const keywords = await getKeywords();
  let savedCount = 0;
  let skippedCount = 0;

  for (const source of RSS_SOURCES) {
    console.log(`Fetching RSS from ${source.source}...`);
    const items = await fetchRSSFeed(source.url);

    for (const item of items) {
      if (!item.title || !item.link) continue;

      const slug = generateSlug(item.title);
      const exists = await checkNewsExists(slug);

      if (exists) {
        skippedCount++;
        continue;
      }

      const tags = extractTagsFromTitle(item.title, keywords);
      const pubDate = item.pubDate || new Date().toISOString();

      const newsItem: NewsItem = {
        title: item.title,
        slug,
        link: item.link,
        source: source.source,
        pubDate,
        tags,
      };

      try {
        await insertNews(newsItem);
        savedCount++;
        console.log(`✅ Saved: ${item.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error saving: ${item.title}`, error);
      }
    }
  }

  console.log(`\n📊 Summary: ${savedCount} saved, ${skippedCount} skipped`);
  return { savedCount, skippedCount };
}

