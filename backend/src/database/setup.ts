import db from './connection';

const createTables = () => {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Trips table
    db.exec(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        destination TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT DEFAULT 'upcoming',
        image_url TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Itineraries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
        days TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Messages table
    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        trip_id TEXT REFERENCES trips(id) ON DELETE SET NULL,
        text TEXT NOT NULL,
        sender TEXT NOT NULL,
        suggestions TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
      CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON itineraries(trip_id);
      CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const seedData = () => {
  try {
    // Check if we already have data
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    if (userCount.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Create a demo user
    const userId = 'demo-user-id';
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, name, preferences)
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run(
      userId,
      'demo@example.com',
      'Demo User',
      JSON.stringify({
        budget: 'medium',
        interests: ['Culture', 'Food', 'Adventure'],
        travelStyle: 'moderate',
        accommodationType: ['Hotel', 'Airbnb'],
        dietaryRestrictions: ['None']
      })
    );

    // Create a sample trip
    const tripId = 'sample-trip-tokyo';
    const insertTrip = db.prepare(`
      INSERT INTO trips (id, user_id, destination, start_date, end_date, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertTrip.run(
      tripId,
      userId,
      'Tokyo, Japan',
      '2024-03-15',
      '2024-03-22',
      'upcoming',
      'A week exploring the vibrant culture and cuisine of Tokyo'
    );

    // Create a sample itinerary
    const insertItinerary = db.prepare(`
      INSERT INTO itineraries (trip_id, days)
      VALUES (?, ?)
    `);

    const itineraryDays = [
      {
        day: 1,
        date: '2024-03-15',
        activities: [
          {
            id: '1',
            time: '09:00',
            title: 'Arrive at Narita Airport',
            description: 'Land at Narita International Airport and take the Narita Express to Tokyo',
            location: 'Narita International Airport',
            category: 'transport',
            duration: '1h 30m',
            cost: 30
          },
          {
            id: '2',
            time: '12:00',
            title: 'Check-in at Hotel',
            description: 'Check into your hotel in Shibuya district',
            location: 'Shibuya, Tokyo',
            category: 'accommodation'
          },
          {
            id: '3',
            time: '14:00',
            title: 'Explore Shibuya Crossing',
            description: 'Visit the famous Shibuya Crossing and explore the vibrant neighborhood',
            location: 'Shibuya Crossing, Tokyo',
            category: 'activity',
            duration: '2 hours',
            cost: 0
          },
          {
            id: '4',
            time: '18:00',
            title: 'Dinner at Ichiran Ramen',
            description: 'Enjoy authentic tonkotsu ramen at this famous ramen chain',
            location: 'Shibuya, Tokyo',
            category: 'meal',
            duration: '1 hour',
            cost: 15
          }
        ]
      },
      {
        day: 2,
        date: '2024-03-16',
        activities: [
          {
            id: '5',
            time: '09:00',
            title: 'Visit Senso-ji Temple',
            description: 'Explore Tokyo\'s oldest temple in Asakusa',
            location: 'Asakusa, Tokyo',
            category: 'activity',
            duration: '2 hours',
            cost: 0
          },
          {
            id: '6',
            time: '12:00',
            title: 'Lunch at Nakamise Shopping Street',
            description: 'Try traditional Japanese street food',
            location: 'Nakamise, Asakusa',
            category: 'meal',
            duration: '1 hour',
            cost: 20
          },
          {
            id: '7',
            time: '15:00',
            title: 'Tokyo Skytree',
            description: 'Visit the tallest structure in Japan for panoramic views',
            location: 'Tokyo Skytree',
            category: 'activity',
            duration: '2 hours',
            cost: 25
          }
        ]
      }
    ];

    insertItinerary.run(tripId, JSON.stringify(itineraryDays));

    // Create some sample messages
    const insertMessage = db.prepare(`
      INSERT INTO messages (user_id, trip_id, text, sender, suggestions)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertMessage.run(
      userId,
      null,
      'Hello! I want to plan a trip to Tokyo',
      'user',
      null
    );

    insertMessage.run(
      userId,
      null,
      'That sounds exciting! I can help you plan an amazing trip to Tokyo. When are you planning to go, and for how many days?',
      'ai',
      JSON.stringify(['7 days in March', '5 days in April', '10 days in May'])
    );

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

const setupDatabase = () => {
  try {
    console.log('Setting up database...');
    createTables();
    seedData();
    console.log('✅ Database setup complete!');
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    db.close();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

export { createTables, seedData };
