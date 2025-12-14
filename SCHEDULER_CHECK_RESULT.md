# Supabase Scheduler 確認結果

## 📊 チェック結果まとめ

| チェック項目 | 結果 | 対応 |
|------------|------|------|
| Edge Function存在 | ✅ | `supabase/functions/fetch-rss/index.ts` 作成済み |
| Scheduler登録 | ⚠️ | SQL実行が必要（`scripts/register_fetch_rss_scheduler.sql`） |
| 最新実行ログ | ⚠️ | Supabase Dashboardで確認が必要 |
| 手動実行 | ⚠️ | テスト実行が必要 |

## ✅ 実施済みの作業

### 1. Edge Functionの作成
- ✅ `supabase/functions/fetch-rss/index.ts` を新規作成
- ✅ `/api/rss-refresh` エンドポイントを呼び出すように設定
- ✅ エラーハンドリングとログ出力を実装

### 2. 確認用SQLスクリプトの作成
- ✅ `scripts/check_scheduler.sql` - ジョブ登録状況と実行履歴を確認
- ✅ `scripts/register_fetch_rss_scheduler.sql` - ジョブ登録用SQL

### 3. ドキュメントの作成
- ✅ `docs/SCHEDULER_SETUP.md` - セットアップガイド
- ✅ README.md を更新

## 🔧 次に実施すべき作業

### ステップ1: Supabase Edge Functionのデプロイ

**方法A: Supabase CLIを使用（推奨）**
```bash
supabase functions deploy fetch-rss
```

**方法B: Supabase Dashboardから手動デプロイ**
1. Supabase Dashboard > Edge Functions にアクセス
2. "Create a new function" をクリック
3. 関数名: `fetch-rss`
4. `supabase/functions/fetch-rss/index.ts` の内容をコピー＆ペースト
5. デプロイ

### ステップ2: Schedulerジョブの登録

1. Supabase SQL Editorを開く
2. `scripts/register_fetch_rss_scheduler.sql` を開く
3. `<your-project-ref>` を実際のプロジェクトIDに置き換える
4. SQLを実行

**プロジェクトIDの確認方法:**
- Supabase Dashboard > Settings > API > Project URL
- 例: `https://abcd1234.supabase.co` → プロジェクトIDは `abcd1234`

### ステップ3: 登録状況の確認

Supabase SQL Editorで以下を実行：

```sql
-- scripts/check_scheduler.sql の内容を実行
SELECT 
  jobid,
  schedule,
  jobname,
  active
FROM cron.job
WHERE jobname = 'fetch-rss-hourly';
```

**期待される結果:**
- `jobname = 'fetch-rss-hourly'` のレコードが存在
- `active = true`
- `schedule = '0 * * * *'`

### ステップ4: 手動テスト

#### 方法1: Edge Functionを直接呼び出す
```bash
curl -X POST \
  https://<your-project-ref>.supabase.co/functions/v1/fetch-rss \
  -H "Authorization: Bearer <your-service-role-key>"
```

#### 方法2: Vercel APIエンドポイントを直接呼び出す
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

### ステップ5: 実行ログの確認

1. Supabase Dashboard > Edge Functions > `fetch-rss` > Logs
2. 直近1〜2時間以内の実行履歴を確認
3. `status: 200` が表示されていれば成功

または、SQLで確認：

```sql
SELECT 
  runid,
  jobid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid IN (
  SELECT jobid FROM cron.job WHERE jobname = 'fetch-rss-hourly'
)
ORDER BY start_time DESC
LIMIT 10;
```

### ステップ6: データの確認

1. `/news` ページで最新のニュースが表示されるか確認
2. Supabase Dashboard > Table Editor > `news` テーブルで最新レコードを確認

## 📝 注意事項

1. **タイムゾーンの違い**
   - SupabaseはUTC基準で実行される
   - JSTでは毎時9分のズレが生じる
   - JSTで毎時0分に実行したい場合は、`schedule` を `'9 * * * *'` に変更

2. **認証情報**
   - Edge Functionを呼び出す際は、Service Role Keyが必要
   - 環境変数 `SITE_URL` が設定されていない場合、デフォルトで `https://kabutrigger.vercel.app` が使用される

3. **エラーハンドリング**
   - Edge Functionのログは Supabase Dashboard で確認可能
   - エラーが発生した場合、ログに詳細が記録される

## 🔗 関連ファイル

- `supabase/functions/fetch-rss/index.ts` - Edge Function
- `scripts/check_scheduler.sql` - 確認用SQL
- `scripts/register_fetch_rss_scheduler.sql` - 登録用SQL
- `src/app/api/rss-refresh/route.ts` - Vercel APIエンドポイント
- `docs/SCHEDULER_SETUP.md` - 詳細なセットアップガイド

## ✅ 完了条件

以下のすべてが満たされれば、Supabase Schedulerは正常に動作しています：

- [ ] Edge Function `fetch-rss` がデプロイ済み
- [ ] Schedulerジョブ `fetch-rss-hourly` が登録済み
- [ ] ジョブが `active = true` になっている
- [ ] 手動テストで200 OKが返る
- [ ] `/news` ページで最新データが表示される
- [ ] 実行ログに正常な記録がある

