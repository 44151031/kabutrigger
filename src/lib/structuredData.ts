import type { NewsItem } from "@/types/news";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kabutrigger.jp";

export function generateNewsArticleStructuredData(news: NewsItem) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    url: `${SITE_URL}/news/${news.slug}`,
    datePublished: news.pubDate,
    dateModified: news.pubDate,
    author: {
      "@type": "Organization",
      name: "Kabutrigger",
    },
    publisher: {
      "@type": "Organization",
      name: "Kabutrigger",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/news/${news.slug}`,
    },
  };
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kabutrigger",
    url: SITE_URL,
    description: "株式市場の「動き出す瞬間」をトリガーで掴め。",
  };
}

