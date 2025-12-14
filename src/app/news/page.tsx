import { getAllNews } from "@/lib/supabaseClient";
import { getTagMetadata } from "@/lib/metadata";
import NewsCard from "@/components/news/NewsCard";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "ニュース一覧",
  description: "最新の株式ニュースを一覧でご覧いただけます。",
};

export default async function NewsListPage() {
  const news = await getAllNews(50);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        ニュース一覧
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.length === 0 ? (
          <p className="col-span-full text-center text-zinc-600 dark:text-zinc-400">
            ニュースがありません。
          </p>
        ) : (
          news.map((item) => <NewsCard key={item.id} news={item} />)
        )}
      </div>
    </div>
  );
}

