# Supabase Migration Guide

## Setup Instructions

### 1. Create Supabase Tables

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project (nfxidlqlslwfnovvambv)
3. Go to **SQL Editor** from the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase-migration.sql`
6. Click **Run**

This will create the following tables with Row Level Security enabled:
- `customers` - stores customer information
- `events` - stores event/booking data
- `settings` - stores app settings (packages, trucks, employees)

### 2. Verify Environment Variables

The app uses the following environment variables (already set in `.env`):
```
VITE_SUPABASE_URL=https://nfxidlqlslwfnovvambv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGlkbHFsc2x3Zm5vdnZhbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzk4NDcsImV4cCI6MjA5NTcxNTg0N30.HDebq2leTZmab8yDiPlIX7VJvFGDW9g10m4AvlUGVsc
```

### 3. Local Development

The app will automatically:
- Load data from Supabase when you open it
- Migrate any existing localStorage data to Supabase on first run
- Sync data across all devices in real-time

Test locally with: `npm run dev`

### 4. Deploy to Vercel

Add these environment variables to your Vercel project:

1. Go to https://vercel.com
2. Select your icecream-truck-scheduler project
3. Go to **Settings → Environment Variables**
4. Add the following variables:
   - `VITE_SUPABASE_URL`: `https://nfxidlqlslwfnovvambv.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGlkbHFsc2x3Zm5vdnZhbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzk4NDcsImV4cCI6MjA5NTcxNTg0N30.HDebq2leTZmab8yDiPlIX7VJvFGDW9g10m4AvlUGVsc`

5. Deploy the app

### 5. Migration Details

The app handles data migration automatically:
- On first load, it checks for any localStorage data
- If found, it migrates all events, customers, and settings to Supabase
- After migration, all data is fetched from Supabase
- The `.env` file is in `.gitignore` to protect your credentials

## Troubleshooting

**Q: Data not syncing?**
A: Check the browser console for errors. Ensure the Supabase tables are created and RLS policies are enabled.

**Q: Environment variables not working?**
A: Make sure the variable names start with `VITE_` for Vite to expose them to the client.

**Q: Old localStorage data still visible?**
A: Clear your browser's localStorage data after successful migration. The app will then use Supabase exclusively.
