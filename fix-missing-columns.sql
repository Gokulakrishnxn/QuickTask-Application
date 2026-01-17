-- Fix Missing Columns in Projects Table
-- Run this in your Supabase SQL Editor

-- Add project_link column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_link'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_link TEXT;
        RAISE NOTICE 'Added project_link column';
    ELSE
        RAISE NOTICE 'project_link column already exists';
    END IF;
END $$;

-- Add due_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'due_date'
    ) THEN
        ALTER TABLE projects ADD COLUMN due_date DATE;
        RAISE NOTICE 'Added due_date column';
    ELSE
        RAISE NOTICE 'due_date column already exists';
    END IF;
END $$;

-- Add team_assigned column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'team_assigned'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_assigned TEXT;
        RAISE NOTICE 'Added team_assigned column';
    ELSE
        RAISE NOTICE 'team_assigned column already exists';
    END IF;
END $$;

-- Verify all columns exist
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('project_link', 'due_date', 'team_assigned')
ORDER BY column_name;
