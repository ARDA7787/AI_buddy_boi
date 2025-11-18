# AI Travel Buddy

An intelligent, multimodal AI travel companion that plans, monitors, and continuously adapts your entire journey. Built with React Native (frontend) and FastAPI (backend), powered by GPT-4 for intelligent itinerary generation and real-time travel assistance.

## Features

### Core Functionality

- **AI-Powered Itinerary Generation**: Automatically create personalized trip itineraries based on your preferences, budget, and travel style
- **Real-Time Travel Companion**: Chat with an AI assistant for travel questions, recommendations, and support
- **Safety & Emergency Information**: Get location-based safety scores, emergency contacts, and nearest services
- **Dynamic Re-Planning**: Receive alerts for disruptions (weather, closures) with alternative suggestions
- **Preference-Based Planning**: Customized experiences based on budget, interests, dietary needs, and travel style

### User Journeys

1. **Onboarding**: Set up your travel profile with budget, interests, travel style, and preferences
2. **Trip Planning**: Enter destination and dates, let AI generate a complete itinerary
3. **In-Trip Navigation**: View daily activities, get real-time alerts, and adapt plans
4. **Conversational Help**: Ask questions, get translations, safety tips, and recommendations
5. **Safety Monitoring**: Access emergency contacts, safety scores, and active alerts

## Architecture

### Frontend (React Native + Expo)
- Cross-platform mobile app (iOS & Android)
- State management with Zustand
- Navigation with React Navigation
- API client with Axios
- Real-time updates and alerts

### Backend (Python + FastAPI)
- RESTful API with FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- OpenAI GPT-4 integration
- External API integrations (Weather, Maps, Safety)
- JWT authentication

### Database (PostgreSQL)
- Users and preferences
- Trips, days, and activities
- Chat messages
- Alerts and notifications

## Tech Stack

**Frontend:**
- React Native + Expo
- TypeScript
- Zustand (state management)
- React Navigation
- Axios
- React Native Maps

**Backend:**
- Python 3.11+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (migrations)
- OpenAI API
- JWT authentication

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Python** (v3.11 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **OpenAI API Key** (required for AI features)
- (Optional) **Expo CLI**: `npm install -g expo-cli`

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI_buddy_boi
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
# Required: OPENAI_API_KEY
# Optional: OPENWEATHER_API_KEY, GOOGLE_MAPS_API_KEY
```

### 3. Start Backend with Docker

```bash
# Start PostgreSQL and FastAPI backend
docker-compose up -d

# The backend will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs
```

The backend will automatically:
- Start PostgreSQL database
- Run database migrations
- Start the FastAPI server with hot-reload

### 4. Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your phone

### 5. Configure Backend URL

Before running the frontend, update the API base URL:

Edit `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000'; // For iOS simulator
// const API_BASE_URL = 'http://10.0.2.2:8000'; // For Android emulator
// const API_BASE_URL = 'http://YOUR_IP:8000'; // For physical device
```

## Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Install and start PostgreSQL (if not using Docker)
# Create database: travel_buddy

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

```
AI_buddy_boi/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   └── main.py          # FastAPI app
│   ├── alembic/             # Database migrations
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
│
├── frontend/                 # React Native app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API client
│   │   ├── store/           # State management
│   │   └── types/           # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml        # Docker orchestration
├── .env.example             # Environment template
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `PATCH /auth/me` - Update user info
- `PATCH /auth/me/preferences` - Update preferences

### Trips
- `GET /trips` - List all trips
- `POST /trips` - Create new trip
- `GET /trips/{id}` - Get trip details
- `PATCH /trips/{id}` - Update trip
- `DELETE /trips/{id}` - Delete trip
- `POST /trips/generate` - Create trip with AI itinerary
- `POST /trips/{id}/generate-itinerary` - Generate itinerary for existing trip

### Chat
- `GET /chat/trips/{id}/messages` - Get chat messages
- `POST /chat` - Send message to AI

### Safety
- `GET /safety/location` - Get safety info for location
- `GET /safety/trips/{id}/alerts` - Get trip alerts
- `POST /safety/trips/{id}/alerts/{id}/resolve` - Resolve alert

## Usage Guide

### Creating Your First Trip

1. **Sign Up/Login**: Create an account or login
2. **Complete Onboarding**: Set your travel preferences (budget, interests, style)
3. **Create Trip**:
   - Tap "Plan New Trip"
   - Enter destination (e.g., "Paris, France")
   - Set dates (YYYY-MM-DD format)
   - Add budget (optional)
   - Add special requests (e.g., "vegetarian food, slow mornings")
   - Tap "Generate Itinerary"
4. **View Itinerary**: AI will create a personalized day-by-day plan
5. **Chat with AI**: Ask questions like "Where can I find cheap local food?"
6. **Check Safety**: View safety scores and emergency contacts

### Using the AI Chat

The AI companion can help with:
- Finding nearby restaurants, attractions, or services
- Translation assistance
- Cultural tips and etiquette
- Safety advice
- Modifying your itinerary
- General travel questions

Example questions:
- "What are the best vegetarian restaurants near the Eiffel Tower?"
- "Is this neighborhood safe at night?"
- "How do I say 'Where is the bathroom?' in French?"
- "Replace tonight's dinner with a local food market"

## Configuration

### Required API Keys

**OpenAI API Key** (Required):
- Sign up at https://platform.openai.com/
- Create an API key
- Add to `.env`: `OPENAI_API_KEY=sk-...`

**OpenWeather API Key** (Optional):
- Sign up at https://openweathermap.org/api
- Get a free API key
- Add to `.env`: `OPENWEATHER_API_KEY=...`

**Google Maps API Key** (Optional):
- Get key from https://console.cloud.google.com/
- Enable Geocoding and Places APIs
- Add to `.env`: `GOOGLE_MAPS_API_KEY=...`

### Customization

You can customize:
- Travel categories in `backend/app/models/trip.py`
- AI prompts in `backend/app/services/llm_agent.py`
- UI theme colors in frontend screen styles
- Budget options in onboarding

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### API Documentation

When the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker-compose ps`
- Check environment variables in `.env`
- Verify database migrations: `alembic upgrade head`

### Frontend can't connect to backend
- Verify backend is running at http://localhost:8000
- Update `API_BASE_URL` in `frontend/src/services/api.ts`
- For physical device, use your computer's IP address

### OpenAI API errors
- Verify API key is correct
- Check API quota/billing
- Backend will use mock data if key is not configured

### Database connection errors
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `docker-compose exec postgres psql -U travel_user -d travel_buddy`

## Production Deployment

### Security Checklist
- [ ] Change SECRET_KEY to a strong random value
- [ ] Update CORS origins to specific domains
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Set up proper database backups
- [ ] Configure rate limiting
- [ ] Review and update security headers

### Deployment Options
- **Backend**: Deploy to AWS, GCP, Azure, Heroku, or DigitalOcean
- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- **Frontend**: Build with `expo build` and deploy to App Store/Google Play

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check existing documentation
- Review API docs at `/docs` endpoint

## Acknowledgments

- OpenAI for GPT-4 API
- FastAPI framework
- React Native and Expo team
- Open source community

---

Built with ❤️ for travelers worldwide