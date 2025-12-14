-- Supabase Scheduler ジョブ登録SQL（fetch-rss用）
-- Supabase SQL Editorで実行してください
-- 
-- 注意: <your-project-ref> を実際のSupabaseプロジェクトIDに置き換えてください
-- プロジェクトIDは Supabase Dashboard > Settings > API > Project URL から確認できます
-- 例: https://abcd1234.supabase.co の場合、プロジェクトIDは "abcd1234"

-- 既存のジョブを削除（存在する場合）
SELECT cron.unschedule('fetch-rss-hourly') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'fetch-rss-hourly'
);

-- 新しいジョブを登録
SELECT
  cron.schedule(
    'fetch-rss-hourly',
    '0 * * * *',  -- 毎時0分に実行（UTC基準）
    $$
    SELECT net.http_post(
      url:='https://<your-project-ref>.supabase.co/functions/v1/fetch-rss',
      headers:='{"Authorization":"Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'
    )
    $$
  );

-- 登録確認
SELECT 
  jobid,
  schedule,
  jobname,
  active
FROM cron.job
WHERE jobname = 'fetch-rss-hourly';

-- 注意: SupabaseはUTC基準で実行するため、JSTでは毎時9分のズレが生じます
-- JSTで毎時0分に実行したい場合は、schedule を '9 * * * *' に変更してください

