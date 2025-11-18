# AI Travel Buddy

A comprehensive travel planning application with an AI-powered assistant, featuring a React Native mobile app and a Node.js backend.

## 🚀 Quick Start (10-15 minutes)

Get the entire application running in just a few steps!

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ (running locally or via Docker)
- **Expo CLI** (will be installed automatically)
- **iOS Simulator** (Mac only) or **Android Studio** with emulator

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies
cd ../mobile
npm install
cd ..
```

### Step 2: Set Up Database

```bash
# Option A: Using PostgreSQL installed locally
# Make sure PostgreSQL is running, then:
cd backend
npm run db:setup

# Option B: Using Docker
docker run --name ai-travel-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ai_travel_buddy -p 5432:5432 -d postgres:14
cd backend
npm run db:setup
```

This will create all necessary tables and insert sample data.

### Step 3: Start the Backend

```bash
# From the backend directory
npm run dev
```

The backend will start on `http://localhost:3000`. You should see:
```
╔════════════════════════════════════════╗
║   AI Travel Buddy Backend Server      ║
║   Running on http://localhost:3000     ║
╚════════════════════════════════════════╝
```

### Step 4: Start the Mobile App

```bash
# From the mobile directory (in a new terminal)
cd mobile
npm start
```

This will start Expo. You'll see a QR code and several options:

- Press `i` to open iOS simulator (Mac only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app (iOS/Android) for physical device testing

### Step 5: Test the App! 🎉

The app will launch and you'll see the onboarding wizard. Follow these steps:

1. **Onboarding** - Set your preferences (budget, interests, travel style, etc.)
2. **Home Screen** - View your trips (sample data is pre-loaded)
3. **Tap a Trip** - Explore the detailed itinerary
4. **Chat Tab** - Send a message to the AI assistant
5. **Safety Tab** - View safety info and emergency contacts
6. **Profile Tab** - See your preferences

## 📁 Project Structure

```
AI_buddy_boi/
├── mobile/                # React Native + Expo app
│   ├── src/
│   │   ├── api/          # API client and services
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Global state management
│   │   ├── navigation/   # Navigation configuration
│   │   ├── screens/      # App screens
│   │   └── types/        # TypeScript types
│   ├── App.tsx           # App entry point
│   └── package.json
│
├── backend/              # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── database/     # DB connection and setup
│   │   ├── routes/       # API routes
│   │   └── types/        # TypeScript types
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md
```

## 🎯 Features

### Mobile App
- ✅ **Multi-step Onboarding** - Collect user preferences with sliders, toggles, and chips
- ✅ **Trip Dashboard** - View all trips with status indicators
- ✅ **Dynamic Itinerary** - Day-by-day activities with categories and details
- ✅ **AI Chat Assistant** - Conversational interface with suggestion chips
- ✅ **Safety Tab** - Real-time alerts and emergency contacts
- ✅ **Profile Management** - View and edit preferences
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - User-friendly error messages with retry
- ✅ **Pull-to-Refresh** - Update data on demand
- ✅ **TypeScript** - Full type safety

### Backend
- ✅ **RESTful API** - Well-structured endpoints
- ✅ **PostgreSQL Database** - Relational data storage
- ✅ **Mock AI Responses** - Intelligent chat responses
- ✅ **Sample Data** - Pre-loaded trip and itinerary
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **CORS Enabled** - Ready for cross-origin requests
- ✅ **TypeScript** - Type-safe backend code
- ✅ **Easy to Extend** - Ready for LLM and external API integration

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env` to configure:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_travel_buddy
DB_USER=postgres
DB_PASSWORD=postgres
```

### Mobile App API Configuration

The mobile app automatically connects to `http://localhost:3000` in development mode.

To change the API URL, edit `mobile/src/api/config.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api';  // Production
```

## 📱 Testing Guide

### Manual Test Flow

Follow this checklist to verify all features work:

#### 1. Onboarding Flow
- [ ] Launch app and see onboarding screen
- [ ] Step 1: Select budget preference (low/medium/high)
- [ ] Step 2: Select at least 2 interests
- [ ] Step 3: Select travel style and accommodation types
- [ ] Step 4: Select dietary restrictions
- [ ] Tap "Complete" and verify you reach the home screen

#### 2. Home Dashboard
- [ ] See "Hello, Demo User!" greeting
- [ ] See sample trip "Tokyo, Japan"
- [ ] Pull down to refresh
- [ ] Tap the trip card

#### 3. Itinerary View
- [ ] See alert banner at top
- [ ] See day selector tabs (Day 1, Day 2)
- [ ] See activities for Day 1 with times, descriptions, locations
- [ ] Tap Day 2 tab and see different activities
- [ ] Navigate back to home

#### 4. Chat Screen
- [ ] Tap "Chat" tab at bottom
- [ ] See welcome message or existing chat history
- [ ] Type "Plan a trip to Paris" and send
- [ ] See AI response with suggestions
- [ ] Tap a suggestion chip to populate input
- [ ] Send another message about restaurants

#### 5. Safety Tab
- [ ] Tap "Safety" tab
- [ ] See green "You are safe" status
- [ ] See active alerts (weather, festival)
- [ ] See emergency contacts (Police, Ambulance, Embassy)
- [ ] Tap an emergency contact (don't actually call!)

#### 6. Profile Tab
- [ ] Tap "Profile" tab
- [ ] See user avatar and email
- [ ] See travel preferences you set in onboarding
- [ ] Scroll through settings options

### Testing on Different Platforms

#### iOS (Mac only)
```bash
cd mobile
npm run ios
```

#### Android
```bash
cd mobile
npm run android
```

Note: Make sure Android Studio is installed and an emulator is running.

#### Physical Device
1. Install "Expo Go" from App Store or Google Play
2. Run `npm start` in mobile directory
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

### Backend API Testing

Test endpoints with curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Get all trips
curl http://localhost:3000/api/trips

# Get itinerary
curl http://localhost:3000/api/itineraries/{tripId}

# Send chat message
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Get safety info
curl http://localhost:3000/api/safety
```

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run in development mode (auto-restart on changes)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Reset database (caution: deletes all data)
npm run db:setup
```

### Mobile Development

```bash
cd mobile

# Start Expo dev server
npm start

# Clear cache and restart
npm start --clear

# Run on specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
```

## 🚧 Known Limitations & Future Enhancements

### Current Limitations
- **Authentication**: Uses a simple demo user system (no real auth)
- **AI Responses**: Uses pre-defined mock responses (not real LLM)
- **Location Services**: Mock location data
- **Image Assets**: Placeholder images only

### Ready for Integration
The architecture is prepared for:
- **OpenAI/Anthropic Integration**: Replace mock responses in `chatController.ts`
- **Real Authentication**: Add JWT tokens and password hashing
- **Weather API**: Integrate real weather data in `safetyController.ts`
- **Maps API**: Add real location and directions
- **Image Upload**: Add trip and user photo uploads
- **Push Notifications**: Add for alerts and reminders

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
- Verify database exists: `psql -U postgres -l | grep ai_travel_buddy`
- Check port 3000 isn't in use: `lsof -i :3000`

### Mobile app can't connect to backend
- Ensure backend is running on `http://localhost:3000`
- On physical device, use your computer's IP instead of localhost
- Check firewall settings allow connections on port 3000

### Database errors
- Drop and recreate: `dropdb ai_travel_buddy && createdb ai_travel_buddy`
- Run setup again: `cd backend && npm run db:setup`

### Expo errors
- Clear cache: `cd mobile && rm -rf node_modules && npm install`
- Reset Expo: `npx expo start --clear`

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/preferences
Save user preferences
```json
{
  "budget": "medium",
  "interests": ["Culture", "Food"],
  "travelStyle": "moderate",
  "accommodationType": ["Hotel"],
  "dietaryRestrictions": ["None"]
}
```

### Trip Endpoints

#### GET /api/trips
Get all trips for user

#### GET /api/trips/:id
Get specific trip

#### POST /api/trips
Create new trip
```json
{
  "destination": "Paris, France",
  "startDate": "2024-04-01",
  "endDate": "2024-04-07",
  "description": "Spring in Paris"
}
```

### Itinerary Endpoints

#### GET /api/itineraries/:tripId
Get itinerary for a trip

#### PUT /api/itineraries/:tripId
Update itinerary

### Chat Endpoints

#### POST /api/chat/message
Send a message
```json
{
  "message": "Plan a trip to Tokyo",
  "tripId": "optional-trip-id"
}
```

#### GET /api/chat/history
Get chat history (optionally filtered by tripId)

### Safety Endpoints

#### GET /api/safety
Get safety information (optionally filtered by tripId)

#### POST /api/safety/emergency
Report emergency
```json
{
  "type": "medical",
  "details": "Emergency details here"
}
```

## 📄 License

This project is provided as-is for demonstration and development purposes.

## 🤝 Contributing

This is a demo project. Feel free to fork and extend it with:
- Real LLM integration (OpenAI, Anthropic Claude, etc.)
- Weather APIs (OpenWeatherMap, WeatherAPI)
- Maps integration (Google Maps, Mapbox)
- Booking integrations (hotels, flights)
- Real-time notifications
- Social features (share trips, collaborate)

---

Built with ❤️ using React Native, Expo, Node.js, Express, PostgreSQL, and TypeScript.
