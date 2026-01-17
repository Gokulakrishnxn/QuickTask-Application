-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'folder',
  project_link TEXT,
  due_date DATE,
  team_assigned TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

-- Add project_id column to tasks table if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Create index on project_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Enable Row Level Security (RLS) on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public access to projects" ON projects;

-- Create policy for projects
CREATE POLICY "Allow public access to projects" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at on projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample projects
INSERT INTO projects (name, description, color, icon) VALUES
  ('Personal', 'Personal tasks and goals', '#3b82f6', 'user'),
  ('Work', 'Work-related tasks and projects', '#8b5cf6', 'briefcase'),
  ('Home', 'Home maintenance and chores', '#10b981', 'home')
ON CONFLICT DO NOTHING;

-- Verify
SELECT * FROM projects;
