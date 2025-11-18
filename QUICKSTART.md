# Quick Start Guide - AI Travel Buddy

Get the app running in **10-15 minutes**! ⚡

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ PostgreSQL running (`psql --version`)
- ✅ For iOS: Xcode with iOS Simulator (Mac only)
- ✅ For Android: Android Studio with an emulator

## Step-by-Step Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Mobile
cd ../mobile
npm install
```

### 2️⃣ Start PostgreSQL (1 minute)

Choose one option:

**Option A: Local PostgreSQL**
```bash
# Make sure it's running
brew services start postgresql  # Mac
sudo service postgresql start   # Linux
```

**Option B: Docker PostgreSQL**
```bash
docker run --name ai-travel-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ai_travel_buddy \
  -p 5432:5432 \
  -d postgres:14
```

### 3️⃣ Set Up Database (1 minute)

```bash
cd backend
npm run db:setup
```

You should see:
```
✅ Database tables created successfully
✅ Sample data seeded successfully
✅ Database setup complete!
```

### 4️⃣ Start Backend (30 seconds)

```bash
# From backend directory
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   AI Travel Buddy Backend Server      ║
║   Running on http://localhost:3000     ║
╚════════════════════════════════════════╝
```

✅ **Backend is ready!** Keep this terminal open.

### 5️⃣ Start Mobile App (1 minute)

Open a **NEW terminal**:

```bash
cd mobile
npm start
```

Wait for the Expo QR code to appear, then:

- **iOS**: Press `i` (Mac only)
- **Android**: Press `a`
- **Physical device**: Scan QR with Expo Go app

### 6️⃣ Test the App! 🎉

The app will open. Now test these flows:

#### **Onboarding Flow** (1 minute)
1. Select budget: "Medium"
2. Select interests: Choose 2-3
3. Select travel style: "Moderate"
4. Select accommodations: Choose 1-2
5. Select dietary: "None"
6. Tap "Complete"

#### **Explore Sample Trip** (2 minutes)
1. See "Tokyo, Japan" trip on home screen
2. Tap the trip card
3. See Day 1 activities
4. Swipe to Day 2
5. Navigate back

#### **Chat with AI** (1 minute)
1. Tap "Chat" tab
2. Type: "Plan a trip to Paris"
3. Send message
4. See AI response with suggestions
5. Tap a suggestion chip

#### **Check Safety Info** (30 seconds)
1. Tap "Safety" tab
2. See green "You are safe" status
3. See weather alerts
4. See emergency contacts

#### **View Profile** (30 seconds)
1. Tap "Profile" tab
2. See your preferences from onboarding

## ✅ Success Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Mobile app opened in simulator/emulator
- [ ] Completed onboarding
- [ ] Viewed Tokyo trip itinerary
- [ ] Sent chat message and got AI response
- [ ] Checked safety tab
- [ ] Viewed profile

## 🐛 Quick Fixes

### Can't connect to database?
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# If not running, start it
brew services start postgresql  # Mac
```

### Backend port already in use?
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Mobile app can't reach backend?
- Make sure backend shows "Running on http://localhost:3000"
- Try restarting the Expo dev server: Press `r` in Expo terminal

### Database errors?
```bash
# Reset database
cd backend
npm run db:setup
```

### Expo cache issues?
```bash
cd mobile
npx expo start --clear
```

## 🎯 What's Next?

Now that everything works, explore:

1. **Code Structure**: Check `mobile/src/` and `backend/src/`
2. **API Endpoints**: Test with curl (see README.md)
3. **Customize**: Modify screens, add features
4. **Integrate**: Add real LLM, weather APIs, etc.

## 📚 Full Documentation

For complete details, see [README.md](./README.md)

## 🆘 Still Stuck?

Common issues and solutions:

1. **"Cannot find module"** → Run `npm install` again
2. **"Port 3000 in use"** → Change PORT in `backend/.env`
3. **"Database connection failed"** → Check PostgreSQL is running
4. **"Expo error"** → Try `npx expo start --clear`

---

**Total Setup Time**: ~10-15 minutes ⏱️

Enjoy building with AI Travel Buddy! 🚀
