# 🚀 Setup Projects Feature

## Quick Fix - Run This SQL

You need to create the `projects` table in your Supabase database.

### Step 1: Open Supabase SQL Editor

👉 **Click here:** https://supabase.com/dashboard/project/ntneiwqcqpehehjepzcx/sql

### Step 2: Click "New Query"

### Step 3: Copy and Paste This SQL

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

-- Verify tables were created
SELECT 'Projects table created successfully!' as status;
SELECT * FROM projects;
```

### Step 4: Click "Run" (or press Cmd/Ctrl + Enter)

You should see:
- ✅ "Projects table created successfully!"
- ✅ 3 sample projects listed

### Step 5: Refresh Your App

Go back to your app and refresh the page. You should now see:
- ✅ 3 project cards (Personal, Work, Home)
- ✅ Ability to create new projects
- ✅ Ability to add tasks to projects

## ✅ What This Does

1. **Creates `projects` table** - Stores all your projects
2. **Adds `project_id` to tasks** - Links tasks to projects
3. **Sets up permissions** - Allows public access (you can restrict later)
4. **Adds sample data** - 3 starter projects
5. **Creates indexes** - For fast queries

## 🎯 After Setup

You'll be able to:
- ✅ Create unlimited projects
- ✅ Add tasks to specific projects
- ✅ View tasks grouped by project
- ✅ Edit and delete projects
- ✅ Color-code your projects
- ✅ Track project progress

## 🐛 Troubleshooting

**If you see "function update_updated_at_column() does not exist":**

Run this first:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';
```

Then run the full schema above.

## 📝 Alternative: Use the File

You can also copy the entire contents of `supabase-projects-schema.sql` file and paste it into the SQL Editor.

---

**Need help?** Check the browser console for any errors after running the SQL.
