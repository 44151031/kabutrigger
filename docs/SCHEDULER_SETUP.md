# Supabase Scheduler セットアップガイド

## 📋 確認・修復手順

### ① Supabase Edge Functionの確認

#### 既存の関数
- ✅ `supabase/functions/fetch-rss/index.ts` - 新規作成済み
- ✅ `supabase/functions/fetch-feeds/index.ts` - 既存（互換性のため保持）

#### デプロイ方法

**方法1: Supabase CLIを使用**
```bash
supabase functions deploy fetch-rss
```

**方法2: Supabase Dashboardから手動デプロイ**
1. Supabase Dashboard > Edge Functions にアクセス
2. "Create a new function" をクリック
3. 関数名: `fetch-rss`
4. `supabase/functions/fetch-rss/index.ts` の内容をコピー＆ペースト
5. デプロイ

### ② Supabase Scheduler 登録状況の確認

Supabase SQL Editorで以下を実行：

```sql
-- scripts/check_scheduler.sql の内容を実行
```

**確認項目:**
- `cron.job` テーブルに `fetch-rss-hourly` または `kabutrigger-hourly` が存在するか
- `active = true` になっているか
- `schedule = '0 * * * *'` になっているか

### ③ Scheduler ジョブの登録

既存のジョブがない場合、以下を実行：

```sql
-- scripts/register_fetch_rss_scheduler.sql の内容を実行
-- <your-project-ref> を実際のプロジェクトIDに置き換えること
```

**注意:**
- SupabaseはUTC基準で実行されるため、JSTでは毎時9分のズレが生じます
- JSTで毎時0分に実行したい場合は、`schedule` を `'9 * * * *'` に変更

### ④ 手動テスト（即時動作確認）

#### 1. Edge Functionを直接呼び出す
```bash
curl -X POST \
  https://<your-project-ref>.supabase.co/functions/v1/fetch-rss \
  -H "Authorization: Bearer <your-service-role-key>"
```

#### 2. Vercel APIエンドポイントを直接呼び出す
```bash
curl https://kabutrigger.vercel.app/api/rss-refresh
```

**期待されるレスポンス:**
```json
{
  "success": true,
  "saved": 5,
  "skipped": 10
}
```

#### 3. 実行結果の確認
- `/news` ページで最新のニュースが表示されるか確認
- Supabase Dashboard > Table Editor > `news` テーブルで最新レコードを確認

### ⑤ 実行ログの確認

#### Supabase Dashboard
1. Edge Functions > `fetch-rss` > Logs を開く
2. 直近1〜2時間以内の実行履歴を確認
3. `status: 200` が表示されていれば成功

#### SQLで確認
```sql
-- scripts/check_scheduler.sql の「ジョブの実行履歴を確認」セクションを実行
```

## 🔧 トラブルシューティング

### 問題: ジョブが実行されない

**確認事項:**
1. `cron.job` テーブルで `active = true` になっているか
2. Edge Functionが正しくデプロイされているか
3. 関数URLが正しいか（プロジェクトIDを確認）

**解決方法:**
```sql
-- ジョブを再アクティブ化
UPDATE cron.job SET active = true WHERE jobname = 'fetch-rss-hourly';

-- または、ジョブを削除して再登録
SELECT cron.unschedule('fetch-rss-hourly');
-- その後、register_fetch_rss_scheduler.sql を再実行
```

### 問題: Edge Functionが404エラーを返す

**確認事項:**
1. 関数名が正しいか（`fetch-rss`）
2. プロジェクトIDが正しいか
3. Service Role Keyが正しく設定されているか

### 問題: RSS取得が失敗する

**確認事項:**
1. `/api/rss-refresh` エンドポイントが正常に動作しているか
2. Supabaseの環境変数（`NEXT_PUBLIC_SUPABASE_URL`等）が正しく設定されているか
3. RSSフィードのURLが有効か

## 📊 チェックリスト

- [ ] Edge Function `fetch-rss` がデプロイ済み
- [ ] Schedulerジョブ `fetch-rss-hourly` が登録済み
- [ ] ジョブが `active = true` になっている
- [ ] 手動テストで200 OKが返る
- [ ] `/news` ページで最新データが表示される
- [ ] 実行ログに正常な記録がある

## 🔗 関連ファイル

- `supabase/functions/fetch-rss/index.ts` - Edge Function
- `scripts/check_scheduler.sql` - 確認用SQL
- `scripts/register_fetch_rss_scheduler.sql` - 登録用SQL
- `src/app/api/rss-refresh/route.ts` - Vercel APIエンドポイント

