# 🚀 Update Projects Table - Add New Fields

## Quick Fix - Run This SQL

You need to add three new columns to your existing `projects` table:
- `project_link` (TEXT) - For storing project URLs
- `due_date` (DATE) - For project deadlines
- `team_assigned` (TEXT) - For team member names

### Step 1: Open Supabase SQL Editor

👉 **Click here:** https://supabase.com/dashboard/project/ntneiwqcqpehehjepzcx/sql

### Step 2: Click "New Query"

### Step 3: Copy and Paste This SQL

```sql
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
```

### Step 4: Click "Run" (or press Cmd/Ctrl + Enter)

You should see:
- ✅ 3 rows showing the new columns: `project_link`, `due_date`, `team_assigned`

### Step 5: Refresh Your App

Go back to your app and refresh the page. You should now see:
- ✅ "Project Link" field in create/edit project forms
- ✅ "Due Date" calendar picker in create/edit project forms
- ✅ "Team Assigned" input field in create/edit project forms

## ✅ What This Does

1. **Adds `project_link` column** - Stores project URLs/links
2. **Adds `due_date` column** - Stores project deadlines
3. **Adds `team_assigned` column** - Stores team member names
4. **Idempotent** - Safe to run multiple times (won't duplicate columns)

## 🎯 New Features

After running the SQL, you'll be able to:
- ✅ Add project links (URLs) when creating/editing projects
- ✅ Set due dates for projects using a calendar picker
- ✅ Assign team members to projects
- ✅ View and edit all these fields in the project forms

## 📝 Alternative: Use the File

You can also copy the entire contents of `add-project-fields.sql` file and paste it into the SQL Editor.

---

**Need help?** Check the browser console for any errors after running the SQL.
