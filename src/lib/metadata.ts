import type { Metadata } from "next";
import type { NewsItem } from "@/types/news";

const SITE_NAME = "Kabutrigger";
const SITE_DESCRIPTION =
  "株式市場の「動き出す瞬間」をトリガーで掴め。上場来高値、TOB、決算など、株価変動を引き起こすトリガー情報を速報でお届け。";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kabutrigger.jp";

export const defaultMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/ogp/default.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/ogp/default.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export function getNewsMetadata(news: NewsItem): Metadata {
  const tagsText = news.tags.length > 0 ? news.tags.join("・") : "";
  const description = `${news.title}${tagsText ? ` | ${tagsText}` : ""}`;

  return {
    title: news.title,
    description,
    openGraph: {
      title: news.title,
      description,
      type: "article",
      publishedTime: news.pubDate,
      tags: news.tags,
      images: [
        {
          url: "/ogp/default.jpg",
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      images: ["/ogp/default.jpg"],
    },
    alternates: {
      canonical: `${SITE_URL}/news/${news.slug}`,
    },
  };
}

export function getTagMetadata(tag: string): Metadata {
  return {
    title: `${tag}の最新ニュース`,
    description: `${tag}に関する最新の株式ニュースを速報でお届け。`,
    openGraph: {
      title: `${tag}の最新ニュース | ${SITE_NAME}`,
      description: `${tag}に関する最新の株式ニュースを速報でお届け。`,
    },
  };
}

