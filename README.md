# ⚡ Kabutrigger

**株式市場の"動き出す瞬間"をトリガーで掴め。**

KabutanなどのRSSフィードから「上場来高値」「TOB」「決算」など、株価変動を引き起こす"トリガー情報"を自動で収集・保存。Supabaseをバックエンドに、Next.jsでSEO最適化された記事ページを自動生成する株式ニュースメディア。

## 🧩 技術構成

- **フロントエンド**: Next.js 16 (App Router) + TypeScript
- **バックエンド**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS + shadcn/ui
- **RSS解析**: rss-parser
- **SEO**: 構造化データ (NewsArticle + Breadcrumb) + OGP対応
- **デプロイ**: Vercel (推奨)

## 📂 ディレクトリ構成

```
kabutrigger/
├── src/
│   ├── app/
│   │   ├── page.tsx              # トップページ
│   │   ├── news/
│   │   │   ├── [slug]/page.tsx   # 記事詳細ページ
│   │   │   └── page.tsx          # ニュース一覧
│   │   └── tags/[tag]/page.tsx   # タグ別一覧
│   ├── components/
│   │   ├── common/               # Header/Footer/Breadcrumb
│   │   ├── news/                 # NewsCard/RelatedNews
│   │   └── sections/             # Hero, Trending
│   ├── lib/
│   │   ├── rssFetcher.ts         # RSS取得・保存
│   │   ├── rssParser.ts          # RSS解析
│   │   ├── metadata.ts           # SEOメタデータ
│   │   ├── structuredData.ts     # 構造化データ
│   │   ├── keywordManager.ts    # キーワード管理
│   │   └── supabaseClient.ts    # Supabaseクライアント
│   └── types/news.ts             # 型定義
├── scripts/
│   ├── fetchRss.ts              # RSS自動収集スクリプト
│   └── register_cron_job.sql   # Supabase Cronジョブ登録SQL
└── supabase/
    ├── schema.sql                # テーブル作成SQL
    ├── migrations/
    │   └── enable_pg_cron.sql   # pg_cron拡張有効化SQL
    └── functions/
        └── fetch-feeds/
            └── index.ts          # Supabase Edge Function
```

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `supabase/schema.sql` をSQL Editorで実行してテーブルを作成
3. プロジェクト設定から以下を取得：
   - Project URL
   - Anon Key
   - Service Role Key

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://kabutrigger.jp
CRON_SECRET=your_random_secret_string  # Vercel Cron用（任意）
```

**注意**: `SUPABASE_SERVICE_ROLE_KEY` はサーバーサイドでのみ使用されます。クライアントサイドには公開されません。

### 4. RSS取得のテスト

```bash
npm run fetch-rss
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## 📊 Supabase テーブル構成

### news テーブル
| カラム名 | 型 | 説明 |
|-----------|----|------|
| id | bigint | 主キー |
| title | text | 記事タイトル |
| slug | text | 固有URL |
| link | text | 元記事リンク |
| source | text | Kabutan / GoogleNews |
| pubDate | text | 投稿日時 |
| tags | text[] | タグ配列 |
| created_at | timestamptz | 収集日時 |

### keywords テーブル
| カラム名 | 型 | 説明 |
|-----------|----|------|
| keyword | text | キーワード（主キー） |
| label | text | 表示ラベル |
| priority | integer | 優先度 |

## 🔄 定期実行の設定（Supabaseスケジューラ）

本プロジェクトはSupabaseのpg_cronを使用してRSS取得を定期実行します。

### 1. pg_cron拡張の有効化

Supabase SQL Editorで以下を実行：

```sql
-- supabase/migrations/enable_pg_cron.sql の内容を実行
create extension if not exists pg_cron;
create extension if not exists pg_net;
```

### 2. Supabase Edge Functionのデプロイ

Supabase CLIを使用してEdge Functionをデプロイ：

```bash
# Supabase CLIがインストールされている場合
supabase functions deploy fetch-feeds
```

または、Supabase Dashboard > Edge Functions から手動で作成：
- 関数名: `fetch-feeds`
- コード: `supabase/functions/fetch-feeds/index.ts` の内容をコピー

### 3. Cronジョブの登録

`scripts/register_cron_job.sql` を開き、`<your-project-ref>` を実際のSupabaseプロジェクトIDに置き換えてから、Supabase SQL Editorで実行：

```sql
select
  cron.schedule(
    'kabutrigger-hourly',
    '0 * * * *',  -- 毎時0分に実行
    $$
    select net.http_post(
      url:='https://<your-project-ref>.supabase.co/functions/v1/fetch-feeds',
      headers:='{"Authorization":"Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'
    )
    $$
  );
```

**プロジェクトIDの確認方法**: Supabase Dashboard > Settings > API > Project URL
- 例: `https://abcd1234.supabase.co` → プロジェクトIDは `abcd1234`

### 4. ジョブの確認

```sql
-- 登録されたジョブを確認
select * from cron.job;

-- ジョブの削除（必要に応じて）
-- select cron.unschedule('kabutrigger-hourly');
```

### 手動実行

開発中は以下のコマンドで手動実行も可能：

```bash
npm run fetch-rss
```

## 🎨 ブランド設計

- **ブランド名**: Kabutrigger（カブトリガー）
- **タグライン**: 株式市場の"動き出す瞬間"をトリガーで掴め。
- **カラー**: ネイビーブルー × アクティブオレンジ
- **フォント**: Noto Sans JP

## 🚀 デプロイ

### Vercel

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### ドメイン設定

Vercelの設定から `kabutrigger.jp` を接続。

## 📝 ライセンス

MIT
