-- Task audit log table to track who did what and when on tasks

CREATE TABLE IF NOT EXISTS task_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'status_changed', 'deleted')),
  previous_values JSONB,
  new_values JSONB,
  actor_name TEXT,
  actor_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_task_audit_logs_task_id_created_at
  ON task_audit_logs(task_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE task_audit_logs ENABLE ROW LEVEL SECURITY;

-- Simple open policy (you can tighten this later)
DROP POLICY IF EXISTS "Allow public access to task audit logs" ON task_audit_logs;

CREATE POLICY "Allow public access to task audit logs" ON task_audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

