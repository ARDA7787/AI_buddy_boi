import { Trip, ChatMessage, SafetyInfo, User, UserPreferences } from '../types';

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'traveler@example.com',
  name: 'Alex Traveler',
  avatar: 'https://i.pravatar.cc/150?img=1',
  createdAt: '2024-01-01T00:00:00Z',
};

// Mock user preferences
export const mockPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  notifications: true,
  currency: 'USD',
};

// Mock trips data
export const mockTrips: Trip[] = [
  {
    id: '1',
    userId: '1',
    destination: 'Tokyo, Japan',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    status: 'planned',
    budget: 2500,
    itinerary: [
      {
        id: '1-1',
        tripId: '1',
        day: 1,
        date: '2024-03-15',
        activities: [
          {
            id: '1-1-1',
            title: 'Arrival at Narita Airport',
            description: 'Land at Narita International Airport',
            startTime: '14:00',
            category: 'transport',
            location: {
              name: 'Narita International Airport',
              address: 'Narita, Chiba, Japan',
            },
          },
          {
            id: '1-1-2',
            title: 'Hotel Check-in',
            description: 'Check into hotel in Shibuya',
            startTime: '17:00',
            category: 'accommodation',
            location: {
              name: 'Shibuya Hotel',
              address: 'Shibuya, Tokyo, Japan',
            },
            cost: 150,
          },
        ],
      },
      {
        id: '1-2',
        tripId: '1',
        day: 2,
        date: '2024-03-16',
        activities: [
          {
            id: '1-2-1',
            title: 'Visit Senso-ji Temple',
            description: 'Explore the ancient Buddhist temple in Asakusa',
            startTime: '10:00',
            endTime: '12:00',
            category: 'sightseeing',
            location: {
              name: 'Senso-ji Temple',
              address: 'Asakusa, Tokyo, Japan',
            },
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    destination: 'Paris, France',
    startDate: '2024-05-10',
    endDate: '2024-05-17',
    status: 'planned',
    budget: 3000,
    itinerary: [
      {
        id: '2-1',
        tripId: '2',
        day: 1,
        date: '2024-05-10',
        activities: [
          {
            id: '2-1-1',
            title: 'Arrival at CDG Airport',
            description: 'Land at Charles de Gaulle Airport',
            startTime: '09:00',
            category: 'transport',
            location: {
              name: 'Charles de Gaulle Airport',
              address: 'Roissy-en-France, France',
            },
          },
        ],
      },
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    tripId: '1',
    role: 'user',
    content: 'What are some must-see places in Tokyo?',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    tripId: '1',
    role: 'assistant',
    content:
      'Tokyo has many amazing attractions! Some must-see places include: Senso-ji Temple in Asakusa, Shibuya Crossing, Tokyo Skytree, Meiji Shrine, and the Imperial Palace. For unique experiences, visit teamLab Borderless museum and explore the diverse neighborhoods like Harajuku and Akihabara.',
    timestamp: '2024-01-15T10:00:05Z',
  },
];

// Mock safety info
export const mockSafetyInfo: SafetyInfo = {
  id: '1',
  country: 'Japan',
  warnings: [
    'Japan is generally very safe, but be aware of earthquakes and typhoons.',
    'Keep your passport secure at all times.',
    'Be cautious in crowded areas to avoid pickpockets.',
  ],
  emergencyNumbers: [
    { type: 'police', number: '110', description: 'Police emergency' },
    { type: 'ambulance', number: '119', description: 'Fire and ambulance' },
    { type: 'embassy', number: '+81-3-3224-5000', description: 'US Embassy Tokyo' },
  ],
  healthInfo:
    'Japan has excellent healthcare. Tap water is safe to drink. No special vaccinations required.',
  updatedAt: '2024-01-01T00:00:00Z',
};
