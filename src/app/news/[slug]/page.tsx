import { notFound } from "next/navigation";
import { getNewsBySlug, getAllNews } from "@/lib/supabaseClient";
import { getNewsMetadata } from "@/lib/metadata";
import {
  generateNewsArticleStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/structuredData";
import Breadcrumb from "@/components/common/Breadcrumb";
import RelatedNews from "@/components/news/RelatedNews";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "記事が見つかりません",
    };
  }

  return getNewsMetadata(news);
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const allNews = await getAllNews(10);
  const date = new Date(news.pubDate);
  const formattedDate = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleStructuredData = generateNewsArticleStructuredData(news);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "ホーム", url: "/" },
    { name: "ニュース一覧", url: "/news" },
    { name: news.title, url: `/news/${news.slug}` },
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ニュース一覧", href: "/news" },
          { label: news.title },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {news.source}
            </span>
            <time dateTime={news.pubDate}>{formattedDate}</time>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
            {news.title}
          </h1>
          {news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              元記事を読む →
            </a>
          </p>
        </div>

        <RelatedNews news={allNews} currentSlug={news.slug} />
      </article>
    </div>
  );
}

