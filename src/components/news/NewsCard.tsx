import Link from "next/link";
import type { NewsItem } from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const date = new Date(news.pubDate);
  const formattedDate = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {news.source}
        </span>
        <time dateTime={news.pubDate}>{formattedDate}</time>
      </div>
      <h2 className="mb-3 text-lg font-semibold leading-tight text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
        <Link href={`/news/${news.slug}`}>{news.title}</Link>
      </h2>
      {news.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {news.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

