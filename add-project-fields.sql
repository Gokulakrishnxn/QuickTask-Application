-- Add new fields to projects table
-- Run this in your Supabase SQL Editor if you already have a projects table

-- Add new columns if they don't exist (idempotent migration)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='project_link') THEN
        ALTER TABLE projects ADD COLUMN project_link TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='due_date') THEN
        ALTER TABLE projects ADD COLUMN due_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='team_assigned') THEN
        ALTER TABLE projects ADD COLUMN team_assigned TEXT;
    END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('project_link', 'due_date', 'team_assigned');
