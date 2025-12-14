-- Supabaseテーブル作成SQL
-- SupabaseダッシュボードのSQL Editorで実行してください

-- newsテーブル
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  link TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('Kabutan', 'GoogleNews')),
  pubdate TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_pubdate ON news(pubdate DESC);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- keywordsテーブル
CREATE TABLE IF NOT EXISTS keywords (
  keyword TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0
);

-- 初期キーワードデータの挿入
INSERT INTO keywords (keyword, label, priority) VALUES
  ('上場来高値', '上場来高値速報', 1),
  ('TOB', 'TOB速報', 2),
  ('決算', '決算発表', 3),
  ('自社株買い', '自社株買い速報', 4),
  ('IPO', '新規上場', 5)
ON CONFLICT (keyword) DO NOTHING;

-- Row Level Security (RLS) の設定
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Allow public read access on news" ON news
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on keywords" ON keywords
  FOR SELECT USING (true);

-- Service Role Keyを使用する場合は、RLSをバイパスできるため
-- 上記のポリシーで十分です

