# Google OAuth Setup Guide

## Overview
The sign-in and sign-up pages now support both email/password authentication and Google OAuth. Follow these steps to enable Google authentication.

## Prerequisites
- A Supabase project
- A Google Cloud Platform (GCP) account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if your app is in testing mode
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Quick Task (or your app name)
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
     - Example: `https://ntneiwqcqpehehjepzcx.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**
   - Your Client ID: `762122768342-b45cgt68himi4mgc2dagelnk2a3urq8e.apps.googleusercontent.com`
   - Note: The Client ID includes the project number prefix (762122768342)

## Step 2: Configure Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to configure
4. Enable Google provider
5. Paste your **Client ID** and **Client Secret** from Step 1
   - Client ID: `762122768342-b45cgt68himi4mgc2dagelnk2a3urq8e.apps.googleusercontent.com`
   - Client Secret: (paste from Google Console - starts with `GOCSPX-...`)
6. Click **Save**

## Step 3: Update Redirect URLs

Make sure your Supabase project has the correct redirect URLs configured:

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/sign-in` or `/sign-up`
3. Click **Continue with Google**
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Console matches exactly: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
- Check that your Supabase project ID is correct

### "Invalid client" error
- Verify your Client ID and Client Secret are correct in Supabase
- Make sure Google OAuth is enabled in Supabase

### Not redirecting after Google sign-in
- Check that `/auth/callback` route exists (it should be at `app/auth/callback/route.ts`)
- Verify your site URL is configured in Supabase

## Features Implemented

✅ **Sign In Page**
- Email/password authentication
- Google OAuth button
- Password visibility toggle
- Forgot password link
- Loading states
- Error handling with toast notifications

✅ **Sign Up Page**
- Email/password registration
- Google OAuth button
- Password confirmation
- Password visibility toggle
- Password strength validation (min 6 characters)
- Success/error messages
- Loading states

✅ **OAuth Callback Handler**
- Handles Google OAuth redirects
- Exchanges code for session
- Redirects to dashboard on success
- Error handling

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for sensitive data
- Enable email confirmation in Supabase for additional security
- Consider enabling 2FA for production environments
