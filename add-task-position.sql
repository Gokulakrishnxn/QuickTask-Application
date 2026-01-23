-- Add position column for task ordering if it doesn't exist
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS position INTEGER;

-- Initialize position for existing tasks based on created_at (newest first)
UPDATE tasks
SET position = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM tasks
) AS sub
WHERE tasks.id = sub.id
  AND tasks.position IS NULL;

-- Index to speed up ordering by position
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);

