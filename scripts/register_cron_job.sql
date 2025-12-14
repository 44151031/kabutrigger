-- Supabase Cronジョブ登録SQL
-- Supabase SQL Editorで実行してください
-- 
-- 注意: <your-project-ref> を実際のSupabaseプロジェクトIDに置き換えてください
-- プロジェクトIDは Supabase Dashboard > Settings > API > Project URL から確認できます
-- 例: https://abcd1234.supabase.co の場合、プロジェクトIDは "abcd1234"

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

-- ジョブ登録の確認
-- select * from cron.job;

-- ジョブの削除（必要に応じて）
-- select cron.unschedule('kabutrigger-hourly');

