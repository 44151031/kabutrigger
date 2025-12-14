export interface NewsItem {
  id?: number;
  title: string;
  slug: string;
  link: string;
  source: "Kabutan" | "GoogleNews";
  pubDate: string;
  tags: string[];
  created_at?: string;
}

export interface Keyword {
  keyword: string;
  label: string;
  priority: number;
}

export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
}

