# Editable Workout & Exercise Titles

## Overview

Added inline editing capability for both workout titles and exercise names with a clean, hover-to-reveal interface.

## Features

### 1. Editable Workout Title

- **Location**: Workout page header
- **How to Edit**:
  - Hover over workout title
  - Click the pencil icon that appears
  - Edit the name
  - Press Enter or click ✓ to save
  - Press Escape or click × to cancel

### 2. Editable Exercise Names

- **Location**: Each exercise card
- **How to Edit**:
  - Hover over exercise name
  - Click the pencil icon
  - Edit the name
  - Press Enter or click ✓ to save
  - Press Escape or click × to cancel

## Implementation Details

### New Components

#### `EditableWorkoutTitle.tsx`

- Client component for workout title editing
- Keyboard shortcuts (Enter/Escape)
- Auto-focus and select on edit
- Loading state during save
- Reverts on error or cancel

#### `EditableExerciseName.tsx`

- Client component for exercise name editing
- Same UX patterns as workout title
- Ownership verification through workout

### New Server Actions

#### `updateWorkoutName(workoutId, name)`

- Updates workout name in database
- Verifies user ownership
- Revalidates workout page
- Returns success/error

#### `updateExerciseName(exerciseId, workoutId, name)`

- Updates exercise name in database
- Verifies ownership through workout relationship
- Revalidates workout page
- Returns success/error

### Updated Files

1. **`lib/actions/workouts.ts`**

   - Added `updateWorkoutName` function
   - Added `updateExerciseName` function
   - Both with proper authentication and RLS checks

2. **`app/workout/[id]/page.tsx`**

   - Replaced static `<h1>` with `<EditableWorkoutTitle>`
   - Imports new component

3. **`components/workout/ExerciseCard.tsx`**
   - Replaced static `<h3>` with `<EditableExerciseName>`
   - Imports new component
   - Updated delete button dark mode styles

## User Experience

### Visual Feedback

- Pencil icon appears on hover (opacity transition)
- Input field replaces text during edit
- Check/X buttons for save/cancel
- Loading state disables inputs during save

### Keyboard Shortcuts

- **Enter**: Save changes
- **Escape**: Cancel and revert
- Auto-select text when editing starts

### Error Handling

- Console logs errors
- Reverts to original name on error
- No changes saved if input is empty

## Security

- Both functions verify user authentication
- `updateExerciseName` verifies ownership through workout
- RLS policies enforce database-level security
- User can only edit their own workouts/exercises

## Database Operations

Both operations:

1. Check user authentication
2. Verify ownership
3. Update single field
4. Revalidate page cache
5. Return success/error

## Benefits

- ✅ Fix typos without recreating workouts
- ✅ Customize exercise names for specificity
- ✅ Clean, modern inline editing UX
- ✅ Keyboard-friendly workflow
- ✅ Mobile-friendly (touch to edit)
- ✅ Instant visual feedback
- ✅ Safe error handling

## Usage Examples

### Workout Title

```
Before: "Quick Workout"
After:  "Morning Chest & Triceps"
```

### Exercise Names

```
Before: "Bench Press"
After:  "Flat Barbell Bench Press (Competition Grip)"

Before: "Squat"
After:  "High Bar Back Squat (Narrow Stance)"
```

## Future Enhancements

- [ ] Add edit history/undo
- [ ] Allow editing workout notes
- [ ] Allow editing exercise notes
- [ ] Add template name editing
- [ ] Bulk rename exercises
