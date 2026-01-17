# 🔧 Fix Project Creation Issue

## Problem
You're getting an error when trying to create a project. This is likely because the new database columns don't exist yet.

## ✅ Quick Fix

### Step 1: Open Supabase SQL Editor
👉 **Click here:** https://supabase.com/dashboard/project/ntneiwqcqpehehjepzcx/sql

### Step 2: Click "New Query"

### Step 3: Copy and Paste This SQL

```sql
-- Add new fields to projects table
-- This is safe to run multiple times (idempotent)

DO $$
BEGIN
    -- Add project_link column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='project_link'
    ) THEN
        ALTER TABLE projects ADD COLUMN project_link TEXT;
        RAISE NOTICE 'Added project_link column';
    END IF;

    -- Add due_date column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='due_date'
    ) THEN
        ALTER TABLE projects ADD COLUMN due_date DATE;
        RAISE NOTICE 'Added due_date column';
    END IF;

    -- Add team_assigned column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='projects' AND column_name='team_assigned'
    ) THEN
        ALTER TABLE projects ADD COLUMN team_assigned TEXT;
        RAISE NOTICE 'Added team_assigned column';
    END IF;
END $$;

-- Verify columns were added
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

You should see:
- ✅ Messages saying columns were added (or that they already exist)
- ✅ 3 rows showing the new columns with their data types

### Step 5: Refresh Your App

Go back to your app and refresh the page. Try creating a project again.

## 🎯 What This Does

1. **Checks if columns exist** - Won't duplicate columns if they already exist
2. **Adds missing columns** - Only adds what's missing
3. **Safe to run multiple times** - Idempotent (won't break if run again)

## 🐛 If You Still Get Errors

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating a project
4. Look for error messages
5. Share the error message if you need help

### Common Errors:

**Error: "column 'project_link' does not exist"**
- ✅ Solution: Run the SQL above

**Error: "permission denied"**
- ✅ Solution: Check your Supabase RLS policies

**Error: "Failed to add project"**
- ✅ Solution: Check the browser console for the actual error message

## 📝 Alternative: Use the Migration File

You can also copy the contents of `add-project-fields.sql` and paste it into the SQL Editor.

---

**Still having issues?** Check the browser console and share the error message!
