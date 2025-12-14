import NewsCard from "./NewsCard";
import type { NewsItem } from "@/types/news";

interface RelatedNewsProps {
  news: NewsItem[];
  currentSlug: string;
}

export default function RelatedNews({ news, currentSlug }: RelatedNewsProps) {
  const related = news
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        関連ニュース
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
}

