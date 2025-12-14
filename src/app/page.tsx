import { getAllNews } from "@/lib/supabaseClient";
import Hero from "@/components/sections/Hero";
import Trending from "@/components/sections/Trending";

export const revalidate = 3600; // 1時間ごとに再生成

export default async function Home() {
  const news = await getAllNews(9);

  return (
    <>
      <Hero />
      <Trending news={news} />
    </>
  );
}
