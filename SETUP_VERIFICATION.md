# Setup Verification Checklist

Use this checklist to verify your AI Travel Buddy installation is working correctly.

## ✅ Pre-Installation Checks

- [ ] Node.js 18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] PostgreSQL installed: `psql --version`
- [ ] PostgreSQL running: `psql -U postgres -c "SELECT 1"`

## ✅ Backend Setup Verification

### 1. Dependencies Installed
```bash
cd backend
ls node_modules | wc -l  # Should show 160+ directories
```
- [ ] Dependencies installed (should see 160+ packages)

### 2. TypeScript Compiles
```bash
npm run build
ls dist  # Should show compiled .js files
```
- [ ] Build succeeds without errors
- [ ] `dist/` directory created with .js files

### 3. Database Setup
```bash
npm run db:setup
```

Expected output:
```
✅ Database tables created successfully
✅ Sample data seeded successfully
✅ Database setup complete!
```

- [ ] Tables created message appears
- [ ] Sample data seeded message appears
- [ ] No error messages

### 4. Backend Starts
```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║   AI Travel Buddy Backend Server      ║
║   Running on http://localhost:3000     ║
╚════════════════════════════════════════╝
```

- [ ] Server starts without errors
- [ ] Endpoints list displayed
- [ ] Accessible at http://localhost:3000

### 5. Backend Health Check
In a new terminal:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

- [ ] Returns 200 status
- [ ] Returns JSON with "status":"ok"

### 6. API Endpoints Work

Test trips endpoint:
```bash
curl http://localhost:3000/api/trips
```

Expected: JSON array with Tokyo trip

- [ ] Returns 200 status
- [ ] Returns trips array
- [ ] Contains "Tokyo, Japan" trip

## ✅ Mobile App Setup Verification

### 1. Dependencies Installed
```bash
cd mobile
ls node_modules | wc -l  # Should show 1100+ directories
```
- [ ] Dependencies installed (should see 1100+ packages)

### 2. Expo Starts
```bash
npm start
```

Expected output:
- Expo DevTools opens in browser
- QR code displayed in terminal
- Options to press 'i' (iOS) or 'a' (Android)

- [ ] Expo starts without errors
- [ ] QR code appears
- [ ] DevTools accessible

### 3. App Opens (iOS Simulator - Mac only)
Press `i` or run:
```bash
npm run ios
```

- [ ] iOS Simulator opens
- [ ] App launches
- [ ] Onboarding screen appears

### 4. App Opens (Android Emulator)
Press `a` or run:
```bash
npm run android
```

- [ ] Android Emulator opens
- [ ] App launches
- [ ] Onboarding screen appears

## ✅ End-to-End Feature Testing

With **both backend and mobile app running**, test these flows:

### 1. Onboarding Flow ⏱️ (2 minutes)

- [ ] **Step 1: Budget**
  - [ ] See budget selection screen
  - [ ] Can select low/medium/high
  - [ ] "Next" button appears

- [ ] **Step 2: Interests**
  - [ ] See interest chips
  - [ ] Can select multiple interests
  - [ ] Selected chips change color
  - [ ] "Next" button appears

- [ ] **Step 3: Travel Style & Accommodation**
  - [ ] See travel style options
  - [ ] See accommodation chips
  - [ ] Can select both
  - [ ] "Next" button appears

- [ ] **Step 4: Dietary Restrictions**
  - [ ] See dietary options
  - [ ] Can select multiple
  - [ ] "Complete" button appears

- [ ] **Completion**
  - [ ] Tapping "Complete" navigates to home screen
  - [ ] No errors in console

### 2. Home Dashboard Flow ⏱️ (1 minute)

- [ ] **Home Screen Loads**
  - [ ] See "Hello, Demo User!" greeting
  - [ ] See "Tokyo, Japan" trip card
  - [ ] Trip shows dates and description
  - [ ] Status badge shows "Upcoming"

- [ ] **Pull to Refresh**
  - [ ] Pull down to refresh
  - [ ] Loading spinner appears
  - [ ] Data reloads

- [ ] **Empty State** (if no trips)
  - [ ] See "No trips yet" message
  - [ ] See "Plan a Trip" button

### 3. Itinerary Flow ⏱️ (2 minutes)

- [ ] **Navigate to Itinerary**
  - [ ] Tap "Tokyo, Japan" trip card
  - [ ] Itinerary screen opens
  - [ ] See "Itinerary" header

- [ ] **Alert Banner**
  - [ ] See yellow weather alert banner
  - [ ] Alert text is readable

- [ ] **Day Selector**
  - [ ] See "Day 1" and "Day 2" tabs
  - [ ] Day 1 is selected by default
  - [ ] Active tab is blue

- [ ] **Day 1 Activities**
  - [ ] See multiple activity cards
  - [ ] Each card shows:
    - [ ] Time (e.g., "09:00")
    - [ ] Title (e.g., "Arrive at Narita Airport")
    - [ ] Description
    - [ ] Location with 📍 icon
    - [ ] Category color indicator (green/orange/blue/purple)

- [ ] **Day 2 Activities**
  - [ ] Tap "Day 2" tab
  - [ ] Different activities load
  - [ ] See Senso-ji Temple activity

- [ ] **Navigation**
  - [ ] Tap back button
  - [ ] Return to home screen

### 4. Chat Flow ⏱️ (2 minutes)

- [ ] **Open Chat**
  - [ ] Tap "Chat" tab at bottom
  - [ ] Chat screen opens

- [ ] **Empty State** (first time)
  - [ ] See robot icon and welcome message
  - [ ] See "Try asking:" examples
  - [ ] Example chips are tappable

- [ ] **Send Message**
  - [ ] Type "Plan a trip to Paris"
  - [ ] Tap "Send" button
  - [ ] Message appears on right (blue bubble)

- [ ] **Receive Response**
  - [ ] "AI is typing..." appears briefly
  - [ ] AI message appears on left (white bubble)
  - [ ] Response is relevant to question
  - [ ] See suggestion chips below AI message

- [ ] **Tap Suggestion**
  - [ ] Tap a suggestion chip
  - [ ] Suggestion text fills input box
  - [ ] Send the suggestion

- [ ] **Different Topics**
  - [ ] Ask about "restaurants"
  - [ ] Get relevant restaurant response
  - [ ] Ask about "weather"
  - [ ] Get weather information

### 5. Safety Flow ⏱️ (1 minute)

- [ ] **Open Safety**
  - [ ] Tap "Safety" tab at bottom
  - [ ] Safety screen opens

- [ ] **Status Card**
  - [ ] See green status card
  - [ ] Shows "You are safe" message
  - [ ] ✅ checkmark visible

- [ ] **Location**
  - [ ] See "Current Location" section
  - [ ] Shows "Shibuya, Tokyo, Japan"

- [ ] **Emergency Actions**
  - [ ] See "Report Emergency" button (red)
  - [ ] See "Share Location" button (blue)
  - [ ] Tap "Report Emergency" (don't confirm)
  - [ ] Alert dialog appears
  - [ ] Cancel alert

- [ ] **Active Alerts**
  - [ ] See "Active Alerts" section
  - [ ] See weather alert (light rain)
  - [ ] See festival alert
  - [ ] Each alert shows:
    - [ ] Icon (ℹ️ or ⚠️)
    - [ ] Title
    - [ ] Message
    - [ ] Timestamp

- [ ] **Emergency Contacts**
  - [ ] See "Emergency Contacts" section
  - [ ] See at least 4 contacts:
    - [ ] Police (110)
    - [ ] Ambulance (119)
    - [ ] US Embassy
    - [ ] Hotel Concierge
  - [ ] Each contact shows name and number
  - [ ] Tap a contact (don't confirm call)
  - [ ] Call dialog appears
  - [ ] Cancel call

- [ ] **Pull to Refresh**
  - [ ] Pull down to refresh
  - [ ] Data reloads

### 6. Profile Flow ⏱️ (1 minute)

- [ ] **Open Profile**
  - [ ] Tap "Profile" tab at bottom
  - [ ] Profile screen opens

- [ ] **Profile Header**
  - [ ] See user avatar (initials)
  - [ ] See "Demo User" name
  - [ ] See email address

- [ ] **Travel Preferences**
  - [ ] See "Travel Preferences" section
  - [ ] See preferences from onboarding:
    - [ ] Budget level
    - [ ] Interests list
    - [ ] Travel style
    - [ ] Accommodation types
    - [ ] Dietary restrictions
  - [ ] "Edit" button visible

- [ ] **Settings**
  - [ ] See "Settings" section
  - [ ] See Notifications setting
  - [ ] See Language setting
  - [ ] See Currency setting
  - [ ] See Privacy setting

- [ ] **About**
  - [ ] See "About" section
  - [ ] See Terms of Service
  - [ ] See Privacy Policy
  - [ ] See Help & Support
  - [ ] See Version (1.0.0)

- [ ] **Logout**
  - [ ] See "Logout" button at bottom
  - [ ] Tap logout (don't confirm)
  - [ ] Alert appears
  - [ ] Cancel logout

## ✅ Console & Error Checking

### Backend Console
- [ ] No error messages in backend console
- [ ] See request logs for API calls
- [ ] Successful HTTP status codes (200, 201)

### Mobile Console
In Expo DevTools or Metro console:
- [ ] No red error messages
- [ ] No unhandled promise rejections
- [ ] No network errors

### Database
```bash
psql -U postgres -d ai_travel_buddy -c "SELECT COUNT(*) FROM users;"
psql -U postgres -d ai_travel_buddy -c "SELECT COUNT(*) FROM trips;"
psql -U postgres -d ai_travel_buddy -c "SELECT COUNT(*) FROM itineraries;"
```

- [ ] Users table has data (≥1)
- [ ] Trips table has data (≥1)
- [ ] Itineraries table has data (≥1)

## 🎯 Success Criteria

**Minimum for Success:** ✅
- [ ] Backend starts without errors
- [ ] Mobile app opens
- [ ] Can complete onboarding
- [ ] Can view trip dashboard
- [ ] Can open itinerary
- [ ] Can send chat message
- [ ] Can view safety info
- [ ] Can view profile

**Excellent:** ✅
- [ ] All of the above
- [ ] Pull-to-refresh works
- [ ] Navigation smooth
- [ ] No console errors
- [ ] All data loads correctly
- [ ] UI responsive and polished

## 🐛 Common Issues & Fixes

### Issue: Backend won't start
**Check:**
```bash
lsof -i :3000  # Is port in use?
psql -U postgres -c "SELECT 1"  # Is PostgreSQL running?
```
**Fix:**
```bash
# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
# Restart PostgreSQL
brew services restart postgresql  # Mac
sudo service postgresql restart   # Linux
```

### Issue: Database connection fails
**Check:**
```bash
cat backend/.env  # Check credentials
psql -U postgres -l  # List databases
```
**Fix:**
```bash
# Recreate database
dropdb -U postgres ai_travel_buddy
createdb -U postgres ai_travel_buddy
cd backend && npm run db:setup
```

### Issue: Mobile app won't connect to backend
**Check:**
```bash
curl http://localhost:3000/health  # Is backend reachable?
cat mobile/src/api/config.ts  # Check API URL
```
**Fix:**
- Ensure backend is running
- On physical device, use computer's IP instead of localhost
- Check firewall allows connections on port 3000

### Issue: Expo won't start
**Fix:**
```bash
cd mobile
rm -rf node_modules .expo
npm install
npx expo start --clear
```

### Issue: "Module not found" errors
**Fix:**
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Mobile
cd mobile && rm -rf node_modules && npm install
```

## 📊 Performance Benchmarks

Expected timings:
- **Backend startup**: < 2 seconds
- **Database setup**: < 5 seconds
- **Mobile app startup**: < 10 seconds
- **API response time**: < 500ms
- **Screen navigation**: < 300ms
- **Chat response**: < 1 second

## ✅ Final Verification

If you can check all of these, you're ready to go! 🎉

- [ ] Backend runs on http://localhost:3000
- [ ] Database has sample data
- [ ] Mobile app opens successfully
- [ ] Onboarding completes
- [ ] Home screen shows Tokyo trip
- [ ] Itinerary loads with activities
- [ ] Chat sends and receives messages
- [ ] Safety tab shows alerts and contacts
- [ ] Profile displays user info
- [ ] No critical errors in any console

---

**Setup Time**: Should take 10-15 minutes total

**Tested On**:
- macOS 13+ (iOS Simulator)
- Ubuntu 20.04+ (Android Emulator)
- Node.js 18+, 20+
- PostgreSQL 12+, 14+

**Questions?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
