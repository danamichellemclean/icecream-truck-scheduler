# Event Saving Debug Guide

## What Was Fixed

The Add Event form was silently failing when users clicked "Add Event" or "Create & Select". The issues were:

### 1. **Missing async/await in handleSubmit**
   - The form was calling `onSave()` without awaiting the promise
   - If the save failed, the error was unhandled and invisible to the user
   - **Fixed:** Made handleSubmit async and properly await onSave

### 2. **No error display for users**
   - Errors weren't being shown in the UI
   - Users had no feedback that something went wrong
   - **Fixed:** Added error state and error message display in the form

### 3. **Data type mismatch for employees field**
   - The `employees` array in the form was being saved as-is to Supabase
   - The database schema expects `employees` to be TEXT (JSON string)
   - **Fixed:** Convert employees array to JSON string before saving

### 4. **Insufficient logging**
   - No console logs to debug what was happening
   - Supabase errors weren't being logged with full details
   - **Fixed:** Added comprehensive logging at every step:
     - EventForm: logs when submitting
     - App.jsx: logs save attempt and results
     - useEvents hook: logs Supabase insert/update calls
     - Supabase client: logs initialization

### 5. **Errors not propagated**
   - App.jsx was catching errors but not re-throwing them
   - EventForm couldn't see if the save failed
   - **Fixed:** Re-throw errors so EventForm can display them

---

## How to Debug Now

### Step 1: Open Browser Console
1. Press `Cmd + Option + J` (Mac) or `F12` (PC)
2. Go to the **Console** tab
3. Try adding an event

### Step 2: Look for Log Messages

You should see logs like:
```
Supabase config: {url: "https://...", keyExists: true}
Supabase client initialized successfully
useEvents.addEvent: Creating event: {...}
useEvents.addEvent: Event object to insert: {...}
useEvents.addEvent: Supabase response - data: [...], error: null
useEvents.addEvent: Successfully inserted event
Event saved successfully
```

### Step 3: If It Fails
You'll see error messages like:
```
useEvents.addEvent: Supabase error: {message: "...", code: "...", status: ...}
EventForm: Error submitting event: ...
```

The error will be displayed in a red box in the form as well.

---

## Common Issues & Solutions

### Issue: "Failed to save event. Please try again."
**Cause:** Supabase table doesn't exist or RLS policies are blocking access

**Solution:**
1. Go to Supabase dashboard: https://app.supabase.com
2. Select your project
3. Run the SQL in `supabase-migration.sql`:
   - Click SQL Editor → New Query
   - Copy and paste the SQL from the file
   - Click Run

### Issue: "Missing Supabase credentials"
**Cause:** .env file is missing or not being read by Vite

**Solution:**
1. Check that `.env` file exists in the project root
2. Contains: `VITE_SUPABASE_URL=...` and `VITE_SUPABASE_ANON_KEY=...`
3. If running locally: Stop dev server and restart
4. If on Vercel: Ensure environment variables are added to the project settings

### Issue: Console shows "keyExists: false"
**Cause:** Environment variable not being loaded

**Solution:**
1. For local development:
   ```bash
   npm run dev
   ```
   The dev server must be restarted after .env changes

2. For Vercel:
   - Go to Settings → Environment Variables
   - Verify variables are there
   - Click **Redeploy** in Deployments tab

### Issue: Event appears to save but doesn't show up
**Cause:** Possible table schema mismatch or data conversion issue

**Solution:**
1. Check browser console for errors (Step 1-2 above)
2. Go to Supabase dashboard
3. Click **Table Editor** and look at the `events` table
4. Check if the row was inserted

---

## Files Changed

| File | What Changed |
|------|--------------|
| `src/components/Events/EventForm.jsx` | Added error state, loading state, async handleSubmit, JSON serialization for employees |
| `src/App.jsx` | Better error logging, re-throw errors from handleSave |
| `src/hooks/useEvents.js` | Comprehensive logging in addEvent and updateEvent |
| `src/utils/supabase.js` | Added initialization and config logging |

---

## Testing the Fix

### Local Testing
1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open app at http://localhost:5173

3. Try adding an event:
   - Fill in customer name and date
   - Click "Add Event"
   - Should see "Saving..." button state
   - Event should appear in the list
   - No error message should show (if successful)

4. Check browser console (F12) for the detailed logs

### If It Works
- Event appears immediately after saving
- No error message in red box
- Console shows "Event saved successfully"
- Supabase table shows the new row

### If It Fails
- Red error message appears in the form
- Console shows detailed error logs
- You can see exactly what went wrong

---

## Next Steps

After confirming the fix works locally:

1. Push to GitHub (already done)
2. Deploy to Vercel (automatic or manual)
3. Test on the live site
4. Check browser console for any remaining issues

---

## Additional Resources

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Debugging Supabase Issues](https://supabase.com/docs/guides/getting-started/troubleshooting)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
