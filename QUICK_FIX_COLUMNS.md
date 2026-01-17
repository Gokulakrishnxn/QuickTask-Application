# 🚀 Quick Fix - Missing Columns Error

## Error Message
```
Could not find the 'due_date' column of 'projects' in the schema cache
```

## ✅ Solution - Run This SQL

### Step 1: Open Supabase SQL Editor
👉 **Click here:** https://supabase.com/dashboard/project/ntneiwqcqpehehjepzcx/sql

### Step 2: Click "New Query"

### Step 3: Copy and Paste This SQL

```sql
-- Fix Missing Columns in Projects Table
-- This will add all missing columns safely

-- Add project_link column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_link'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_link TEXT;
        RAISE NOTICE 'Added project_link column';
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
```

### Step 4: Click "Run" (or press Cmd/Ctrl + Enter)

**Expected Output:**
- ✅ Messages saying columns were added
- ✅ 3 rows showing:
  - `due_date` | `date` | `YES`
  - `project_link` | `text` | `YES`
  - `team_assigned` | `text` | `YES`

### Step 5: Refresh Your App

1. Go back to your app
2. Refresh the page (Cmd/Ctrl + R)
3. Try creating a project again

## ✅ What This Does

1. **Checks if columns exist** - Won't duplicate columns
2. **Adds missing columns** - Only adds what's missing
3. **Safe to run multiple times** - Idempotent (won't break if run again)
4. **Verifies success** - Shows you the columns that were added

## 🎯 After Running This

You'll be able to:
- ✅ Create projects with all fields
- ✅ Add project links
- ✅ Set due dates
- ✅ Assign team members
- ✅ Edit projects without errors

## 📝 Alternative: Use the File

You can also copy the entire contents of `fix-missing-columns.sql` file and paste it into the SQL Editor.

---

**Still having issues?** 
1. Check the browser console (F12) for any other errors
2. Make sure you're running the SQL in the correct Supabase project
3. Verify the `projects` table exists
