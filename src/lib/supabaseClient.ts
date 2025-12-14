import { createClient } from "@supabase/supabase-js";
import type { NewsItem, Keyword } from "@/types/news";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// サーバーサイド用（Service Role Key使用）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// クライアントサイド用（Anon Key使用）
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// News関連の関数
export async function insertNews(news: NewsItem) {
  const { data, error } = await supabaseAdmin
    .from("news")
    .insert(news)
    .select()
    .single();

  if (error && error.code !== "23505") {
    // 23505は重複エラー（無視）
    console.error("Error inserting news:", error);
    throw error;
  }

  return data;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching news:", error);
    return null;
  }

  return data;
}

export async function getAllNews(limit = 50, offset = 0): Promise<NewsItem[]> {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .order("pubDate", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return data || [];
}

export async function getNewsByTag(tag: string, limit = 50): Promise<NewsItem[]> {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("*")
    .contains("tags", [tag])
    .order("pubDate", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching news by tag:", error);
    return [];
  }

  return data || [];
}

export async function getAllKeywords(): Promise<Keyword[]> {
  const { data, error } = await supabaseAdmin
    .from("keywords")
    .select("*")
    .order("priority", { ascending: true });

  if (error) {
    console.error("Error fetching keywords:", error);
    return [];
  }

  return data || [];
}

export async function checkNewsExists(slug: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("news")
    .select("id")
    .eq("slug", slug)
    .single();

  return !!data && !error;
}

