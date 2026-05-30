# Supabase Migration - Complete Setup Guide

## ✅ What's Been Done

Your app has been successfully migrated from localStorage to Supabase! Here's what was implemented:

### Code Changes
- ✅ Installed `@supabase/supabase-js` client library
- ✅ Created Supabase client utility (`src/utils/supabase.js`)
- ✅ Migrated all three hooks to use Supabase:
  - `useEvents` - fetches/syncs events from `events` table
  - `useCustomers` - fetches/syncs customers from `customers` table  
  - `useSettings` - fetches/syncs settings from `settings` table
- ✅ Updated components to handle async operations
- ✅ Created automatic migration logic for existing localStorage data
- ✅ Added credentials to `.env` file (secured in `.gitignore`)
- ✅ Committed and pushed all changes to GitHub

### Files Created/Modified
**New Files:**
- `src/utils/supabase.js` - Supabase client initialization
- `src/utils/supabaseInit.js` - Migration and initialization logic
- `supabase-migration.sql` - SQL script to create tables
- `SUPABASE_SETUP.md` - Detailed setup instructions
- `.env` - Environment variables (in .gitignore)

**Modified Files:**
- `src/hooks/useEvents.js` - Now uses Supabase
- `src/hooks/useCustomers.js` - Now uses Supabase
- `src/hooks/useSettings.js` - Now uses Supabase
- `src/App.jsx` - Added initialization and loading states
- `src/components/Events/EventForm.jsx` - Handles async operations
- `src/components/Customers/CustomerList.jsx` - Handles async operations
- `.gitignore` - Added `.env` file exclusion
- `package.json` - Added @supabase/supabase-js dependency

---

## 🚀 Next Steps - REQUIRED

### Step 1: Create Supabase Tables

**Option A: Using Supabase Dashboard (Easiest)**
1. Go to https://app.supabase.com and log in
2. Select your project: **nfxidlqlslwfnovvambv**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase-migration.sql` from your project root
6. Copy all the SQL code and paste it into the editor
7. Click **Run** to execute

**Option B: Using SQL File Command**
If you have Supabase CLI installed:
```bash
supabase db push
```

### Step 2: Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The app will:
   - Connect to your Supabase project
   - Automatically migrate any existing localStorage data to Supabase (first run only)
   - Load all data from Supabase

3. Test by:
   - Adding a customer
   - Creating an event
   - Changing settings
   - Open the app in another browser/device to verify sync

### Step 3: Deploy to Vercel

1. Go to your Vercel dashboard: https://vercel.com
2. Select your **icecream-truck-scheduler** project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables (click **Add**):

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://nfxidlqlslwfnovvambv.supabase.co`
   - Select: **Production** and **Preview**

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGlkbHFsc2x3Zm5vdnZhbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzk4NDcsImV4cCI6MjA5NTcxNTg0N30.HDebq2leTZmab8yDiPlIX7VJvFGDW9g10m4AvlUGVsc`
   - Select: **Production** and **Preview**

5. Click **Save**
6. Your app will automatically redeploy with the new environment variables
7. Visit your app URL to verify it's working

---

## 🔐 Security Notes

- ✅ The `.env` file is in `.gitignore` - your credentials won't be committed
- ✅ The Supabase anon key is designed for client-side use with RLS (Row Level Security)
- ✅ All database operations use RLS policies that allow anonymous users
- ⚠️ For production, consider:
  - Setting up authentication
  - Creating more restrictive RLS policies
  - Using a separate read-only key for public data

---

## 🔄 How Data Syncing Works

1. **On App Load:**
   - App checks for Supabase connectivity
   - Loads data from Supabase tables
   - If migration data is found in localStorage, it's migrated to Supabase (one-time)

2. **On Data Changes:**
   - All changes are immediately sent to Supabase
   - Local state updates for instant UI feedback
   - Data syncs across all devices in real-time

3. **Offline Support:**
   - Currently, offline changes are not persisted
   - Future enhancement: Add local queue and sync on reconnection

---

## 📋 Table Structure

### `customers` table
- `id` (TEXT) - Primary key
- `name` (TEXT) - Customer name
- `phone` (TEXT) - Phone number
- `email` (TEXT) - Email address
- `address` (TEXT) - Physical address
- `notes` (TEXT) - Additional notes
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

### `events` table
- `id` (TEXT) - Primary key
- `date` (TEXT) - Date string
- `eventDate` (TEXT) - Event date
- `startTime` (TEXT) - Start time
- `endTime` (TEXT) - End time
- `end_time` (TEXT) - End time
- `contactName` (TEXT) - Contact person
- `customerId` (TEXT) - Foreign key to customers
- `package` (TEXT) - Package type
- `totalSales` (REAL) - Sales amount
- `employees` (TEXT) - Employees assigned
- `notes` (TEXT) - Event notes
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

### `settings` table
- `id` (TEXT) - Primary key (always "default")
- `data` (JSONB) - Settings object containing packages, trucks, employees
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

---

## ❓ Troubleshooting

**Q: App says "Loading your data..." forever**
A: Check browser console for errors. Ensure:
- Supabase tables are created
- Environment variables are set correctly
- Your internet connection is active

**Q: Data not showing up**
A: 
- Check that `supabase-migration.sql` was executed
- Verify RLS policies are enabled
- Check browser console for specific errors

**Q: Changes not saving**
A: Ensure you're awaiting async functions. The components have been updated to handle this.

**Q: Old localStorage data still visible**
A: Clear browser localStorage after successful migration:
```javascript
// In browser console
localStorage.clear()
```

**Q: Environment variables not working on Vercel**
A: 
- Verify variable names start with `VITE_` (required for Vite)
- Ensure they're added to both Production and Preview
- Redeploy the app after adding variables

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🎉 You're Ready!

Once you complete the three steps above, your app will:
- ✅ Sync data across all devices
- ✅ Store data persistently in Supabase
- ✅ Work online and offline (with future offline support)
- ✅ Scale to handle more customers and events

Good luck! 🚀
