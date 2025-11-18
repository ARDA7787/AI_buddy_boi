# AI Travel Buddy

A React Native mobile application built with Expo that helps you plan and manage your trips with AI assistance.

## Features

- 🎯 **Onboarding Flow**: Smooth introduction to the app
- ✈️ **Trip Planning**: Create and manage multiple trips
- 📅 **Itinerary Management**: Detailed day-by-day planning with activities
- 💬 **AI Chat Assistant**: Get travel recommendations and answers
- 🛡️ **Safety Information**: Access emergency contacts and travel warnings
- 👤 **User Profile**: Manage preferences and account settings

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (React Query)
- **Code Quality**: ESLint + Prettier

## Project Structure

```
ai-travel-buddy/
├── src/
│   ├── api/              # API client and mock data
│   ├── components/       # Reusable components
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── OnboardingScreen.tsx
│   │   ├── TripListScreen.tsx
│   │   ├── ItineraryScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── SafetyScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── store/            # Zustand store
│   ├── theme/            # Theme configuration (colors, typography, spacing)
│   └── types/            # TypeScript type definitions
├── App.tsx               # App entry point
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app installed on your iOS/Android device (for testing on physical devices)
- Xcode (for iOS simulator - macOS only)
- Android Studio (for Android emulator)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code in your terminal.

### 3. Run on Device or Simulator

#### Option A: Physical Device (Recommended for Quick Testing)

1. Install the **Expo Go** app on your iOS or Android device
2. Scan the QR code shown in your terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### Option B: iOS Simulator (macOS only)

```bash
npm run ios
```

#### Option C: Android Emulator

```bash
npm run android
```

Make sure you have an Android emulator running before executing this command.

#### Option D: Web Browser

```bash
npm run web
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device (macOS only)
- `npm run web` - Start in web browser
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Development

### Code Style

This project uses ESLint and Prettier for code quality and formatting. Run the following before committing:

```bash
npm run lint:fix
npm run format
npm run type-check
```

### Mock Data

The app currently uses mock data for development. Check `src/api/mockData.ts` for sample data and `src/api/apiClient.ts` for API methods.

To integrate with a real backend:

1. Update the `baseURL` in `src/api/apiClient.ts`
2. Replace mock implementations with actual API calls
3. Update the types in `src/types/index.ts` as needed

## Navigation Flow

1. **Onboarding Screen** → User's first experience
2. **Main Tab Navigator**:
   - Itinerary Tab: View trip details and activities
   - Chat Tab: AI assistant for travel questions
   - Safety Tab: Emergency contacts and safety info
   - Profile Tab: User settings and preferences
3. **Trip List Screen**: Accessible from Itinerary when no active trip
4. **Trip Detail Screen**: Shows detailed itinerary for a selected trip

## State Management

- **Zustand**: Global state for user, preferences, trips, and active trip ID
- **React Query**: Server state management, caching, and data fetching

## Troubleshooting

### Metro bundler issues

```bash
npx expo start -c
```

### iOS build issues

```bash
cd ios && pod install && cd ..
npm run ios
```

### Clear cache

```bash
rm -rf node_modules
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
