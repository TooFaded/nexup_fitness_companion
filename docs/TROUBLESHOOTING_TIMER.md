# Troubleshooting: Timer Not Showing & Data Not Saving

## Issue Description
- Timer button doesn't appear after confirming sets
- Weight and reps data not being saved to database

## Diagnostic Steps

### 1. Check Browser Console
Open your browser's developer tools (F12 or Cmd+Option+I on Mac) and look for:

**When you enter weight/reps and click the checkmark:**
- Should see: `"Attempting to save set:"` with the data
- Should see: `"✅ Set updated successfully"` if it works
- Look for any RED error messages

**Common errors to look for:**
- "Not authenticated" - Session expired, try logging out and back in
- "Failed to update set:" - Database permission or connection issue
- Network errors - API not reachable

### 2. Verify You're Entering Data Correctly
- Enter a weight value (e.g., 135)
- Enter a reps value (e.g., 10)
- **Both cannot be 0** - you'll see an alert if this happens
- Click the green checkmark button

### 3. Check if Checkmark Button Appears
The checkmark only appears when:
- You've made changes to weight, reps, or RPE
- The component detects the input has changed

**Try this:**
1. Click in the weight field
2. Type a number
3. Click outside the field or press Tab
4. The checkmark should appear on the right

### 4. Check Database Connection

**In your browser console, run:**
```javascript
// Check if you're logged in
console.log(document.cookie);
```

Look for `sb-` cookies. If missing, you're not authenticated.

### 5. Verify Supabase Setup

**Go to Supabase Dashboard:**
1. Navigate to Authentication → Users
2. Verify your user exists
3. Go to Database → Table Editor → `sets`
4. Try to manually update a set to confirm permissions work

### 6. Check RLS Policies

**In Supabase SQL Editor, run:**
```sql
-- Check if you can see your sets
SELECT s.*, e.name, w.user_id 
FROM sets s
JOIN exercises e ON e.id = s.exercise_id
JOIN workouts w ON w.id = e.workout_id
WHERE w.user_id = auth.uid();

-- This should return your sets. If empty, there's a data issue.
```

### 7. Test Timer Manually

**In browser console:**
```javascript
// This should be true after saving a set
localStorage.getItem('setConfirmed');
```

## Expected Behavior Flow

1. **Initial State:**
   - Sets show weight=0, reps=0
   - No checkmark button visible
   - No timer button visible

2. **After Entering Data:**
   - Type weight and/or reps
   - Green checkmark button appears
   - Click checkmark

3. **After Confirming:**
   - Console shows "Set updated successfully"
   - Timer button (clock icon) appears
   - Checkmark disappears
   - Data persists in database

4. **Timer Activation:**
   - Click timer button
   - RestTimer modal appears
   - Can start countdown

## Common Issues & Fixes

### Issue: Checkmark Never Appears
**Cause:** `hasChanges` not being set
**Fix:** Make sure you're clicking inside the input and changing the value

### Issue: "Not authenticated" Error
**Cause:** Session expired
**Fix:** 
1. Log out
2. Log back in
3. Try again

### Issue: Data Saves But Timer Doesn't Show
**Cause:** `isConfirmed` state not updating
**Fix:** Already fixed in latest code - `isConfirmed` is now set properly after save

### Issue: Permission Denied
**Cause:** RLS policy issue
**Fix:** Re-run the database migration:
```sql
-- Run 001_initial_schema.sql again in Supabase SQL Editor
```

## Debug Mode

The latest code includes comprehensive logging. With browser console open:

1. Enter weight: 100
2. Enter reps: 10
3. Click checkmark
4. Look for these console messages:

```
Attempting to save set: {setId: "...", workoutId: "...", weight: 100, reps: 10, rpe: undefined}
updateSet called with: {setId: "...", workoutId: "...", data: {weight: 100, reps: 10}}
updateSet: User authenticated: user-id-here
✅ Set updated successfully: [{id: "...", weight: 100, reps: 10, ...}]
✅ Set updated successfully {success: true, data: [...]}
```

If you see all these messages, it's working correctly!

## Still Not Working?

**Copy and paste these console logs and share:**
1. Any RED errors
2. The full "Attempting to save set" message
3. Any authentication errors
4. Your Supabase project URL (from .env.local)

**Also check:**
- Are you on the correct workout page? URL should be `/workout/[some-uuid]`
- Did you create the workout while logged in?
- Can you see exercises on the page?
