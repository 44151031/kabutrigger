import NewsCard from "../news/NewsCard";
import type { NewsItem } from "@/types/news";

interface TrendingProps {
  news: NewsItem[];
}

export default function Trending({ news }: TrendingProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          最新ニュース
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

