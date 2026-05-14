# Supabase & Open Source Setup Guide

This guide will walk you through setting up the database and edge functions for DisasterSense AI to make it fully operational in a production or hackathon environment.

## 1. Setting up Supabase (Database & Schema)

Since DisasterSense AI relies on PostgreSQL, Supabase is the easiest way to get started.

### Step-by-step:
1. **Create an account:** Go to [Supabase](https://supabase.com) and sign in via GitHub.
2. **Create a New Project:** Click "New Project", select your organization, name it `DisasterSense AI`, generate a secure password, and select a region close to your target users.
3. **Get API Keys:** Once the project is provisioned, go to **Project Settings > API**. 
   - Copy the `Project URL` and place it in your `.env` file as `VITE_SUPABASE_URL`.
   - Copy the `anon / public` key and place it in your `.env` as `VITE_SUPABASE_ANON_KEY`.
4. **Run the SQL Migration:**
   - Go to the **SQL Editor** on the left sidebar.
   - Click **New Query**.
   - Open the `supabase/migrations/00000000000000_initial_schema.sql` file in your code editor.
   - Copy the entire SQL script.
   - Paste it into the Supabase SQL Editor and hit **RUN**.
   - *Success!* Your `raw_posts`, `analyzed_posts`, and `alerts` tables are now created along with their Realtime configurations.

## 2. Deploying Edge Functions (Optional for full backend processing)

The Edge Function (`supabase/functions/analyze-post/index.ts`) acts as your backend worker. It listens for new posts, calls the Groq AI API, verifies the data, and writes to the `alerts` table.

### Step-by-step:
1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```
2. **Login to CLI:**
   ```bash
   supabase login
   ```
3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref-id
   ```
   *(Find your project ref in Project Settings > General).*
4. **Set Environment Variables in Supabase:**
   ```bash
   supabase secrets set GROQ_API_KEY=your_actual_groq_key
   ```
5. **Deploy the Function:**
   ```bash
   supabase functions deploy analyze-post
   ```
6. **Set up a Database Webhook:**
   - In Supabase Dashboard, go to **Database > Webhooks**.
   - Create a new Webhook on the `raw_posts` table.
   - Set it to trigger on `INSERT`.
   - Point the Webhook URL to your newly deployed Edge Function URL.

## 3. Getting Free API Keys for Verification Engine

To make the cross-verification work, you need keys (some are completely open):
- **Groq AI:** Go to [console.groq.com](https://console.groq.com), create an account, and generate an API key. Free tier is very generous.
- **Open-Meteo:** No API key required! The app is already configured to use the public endpoint.
- **USGS Earthquake:** No API key required!
- **Nominatim (Geocoding):** No API key required (but respect rate limits).
- **ReliefWeb / GDELT:** No API key required!
- **NASA FIRMS (Optional):** Requires signing up for a free map key at [firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/) if you want advanced wildfire verification.

## 4. Going Open Source
- Double-check that your `.env` file is in `.gitignore` (it is by default in Vite). NEVER commit your API keys.
- Add screenshots to the `README.md`.
- Push to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit of DisasterSense AI"
  git branch -M main
  git remote add origin https://github.com/yourusername/disastersense-ai.git
  git push -u origin main
  ```
