-- Supabase Scheduler 登録状況の確認SQL
-- Supabase SQL Editorで実行してください

-- 1. pg_cronジョブの確認
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
WHERE jobname LIKE '%rss%' OR jobname LIKE '%kabutrigger%'
ORDER BY jobid DESC;

-- 2. すべてのcronジョブを確認（参考）
-- SELECT * FROM cron.job;

-- 3. ジョブの実行履歴を確認（最新10件）
SELECT 
  runid,
  jobid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid IN (
  SELECT jobid FROM cron.job 
  WHERE jobname LIKE '%rss%' OR jobname LIKE '%kabutrigger%'
)
ORDER BY start_time DESC
LIMIT 10;

