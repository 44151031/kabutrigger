import { getNewsByTag } from "@/lib/supabaseClient";
import { getTagMetadata } from "@/lib/metadata";
import NewsCard from "@/components/news/NewsCard";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return getTagMetadata(decodedTag);
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const news = await getNewsByTag(decodedTag);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {decodedTag}の最新ニュース
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.length === 0 ? (
          <p className="col-span-full text-center text-zinc-600 dark:text-zinc-400">
            {decodedTag}に関するニュースがありません。
          </p>
        ) : (
          news.map((item) => <NewsCard key={item.id} news={item} />)
        )}
      </div>
    </div>
  );
}

