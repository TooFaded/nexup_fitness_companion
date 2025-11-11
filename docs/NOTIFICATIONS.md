# Browser Notifications for Rest Timer

## Overview
The Rest Timer now supports browser notifications to alert users when their rest period is complete, even if they're in a different tab or window.

## Features

### 🔔 What Happens When Timer Completes
1. **Audio Alert**: Plays a sound (if not muted)
2. **Browser Notification**: Sends a desktop/mobile notification
3. **Visual Indicator**: Shows "Rest Complete!" in the timer UI

### 📱 Notification Details
- **Title**: "Rest Timer Complete! 💪"
- **Message**: "Time to get back to your workout!"
- **Duration**: Auto-closes after 10 seconds
- **Click Action**: Clicking the notification brings the app back into focus

## How It Works

### First Time Usage
1. When the user opens the Rest Timer for the first time, the browser will request notification permission
2. User can choose to:
   - **Allow** - Notifications will be sent
   - **Block** - No notifications (but sound and visual alerts still work)
   - **Dismiss** - Can enable later in browser settings

### Notification Status Indicator
The Rest Timer displays the current notification status:
- 🔔 **"Notifications enabled"** - Green checkmark, notifications will be sent
- **"Notifications blocked"** - Notifications are disabled
- **"Notifications not enabled"** - User hasn't chosen yet

### Permission States
- **granted** ✅ - Notifications will be sent
- **denied** ❌ - User blocked notifications (can re-enable in browser settings)
- **default** ⏸️ - User hasn't decided yet (will be asked on next timer start)

## User Benefits

### 💪 Better Workout Flow
- **Multitask During Rest**: Users can browse other tabs/apps during rest periods
- **Stay on Track**: Get notified when it's time to start the next set
- **No Need to Watch Timer**: Focus on hydrating, stretching, or recording notes

### 📊 Use Cases
1. **Different Tab**: User is logging food in another tab
2. **Different App**: User is checking their music app
3. **Phone Lock Screen**: Notification appears even when screen is locked (mobile)
4. **Minimized Window**: Desktop notification pops up

## Browser Support
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile - iOS 16.4+)
- ✅ Opera
- ✅ Brave

## Privacy & Permissions

### What We Request
- **Notification Permission Only**: We only request permission to send notifications
- **No Data Collection**: Notifications are sent locally by your browser
- **User Control**: Users can revoke permission anytime in browser settings

### How to Enable/Disable

#### Chrome/Edge
1. Click the lock icon in the address bar
2. Find "Notifications"
3. Choose "Allow" or "Block"

#### Firefox
1. Click the shield/lock icon
2. Go to Permissions
3. Toggle Notifications

#### Safari
1. Safari > Settings > Websites > Notifications
2. Find your app URL
3. Choose "Allow" or "Deny"

## Technical Implementation

### Code Location
`/components/workout/RestTimer.tsx`

### Key Functions
```typescript
// Request permission on component mount
useEffect(() => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}, []);

// Send notification when timer completes
const sendNotification = () => {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification("Rest Timer Complete! 💪", {
      body: "Time to get back to your workout!",
      icon: "/icon-192x192.png",
      tag: "rest-timer",
    });
  }
};
```

### Graceful Degradation
If notifications are blocked or unsupported:
- ✅ Audio alert still plays
- ✅ Visual "Rest Complete!" message shows
- ✅ Green checkmark animation appears
- ✅ No errors or broken functionality

## Future Enhancements
- [ ] Custom notification sound
- [ ] Notification for 10 seconds remaining
- [ ] Vibration on mobile devices
- [ ] Customizable notification message
- [ ] Notification for specific exercise milestones
