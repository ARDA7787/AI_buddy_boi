import pool from './connection';

const createTables = async () => {
  try {
    await pool.query(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        preferences JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Trips table
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        destination VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'upcoming',
        image_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Itineraries table
      CREATE TABLE IF NOT EXISTS itineraries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
        days JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
        text TEXT NOT NULL,
        sender VARCHAR(10) NOT NULL,
        suggestions JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
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

const seedData = async () => {
  try {
    // Check if we already have data
    const result = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(result.rows[0].count) > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Create a demo user
    const userResult = await pool.query(`
      INSERT INTO users (email, name, preferences)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [
      'demo@example.com',
      'Demo User',
      JSON.stringify({
        budget: 'medium',
        interests: ['Culture', 'Food', 'Adventure'],
        travelStyle: 'moderate',
        accommodationType: ['Hotel', 'Airbnb'],
        dietaryRestrictions: ['None']
      })
    ]);

    const userId = userResult.rows[0].id;

    // Create a sample trip
    const tripResult = await pool.query(`
      INSERT INTO trips (user_id, destination, start_date, end_date, status, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      userId,
      'Tokyo, Japan',
      '2024-03-15',
      '2024-03-22',
      'upcoming',
      'A week exploring the vibrant culture and cuisine of Tokyo'
    ]);

    const tripId = tripResult.rows[0].id;

    // Create a sample itinerary
    await pool.query(`
      INSERT INTO itineraries (trip_id, days)
      VALUES ($1, $2)
    `, [
      tripId,
      JSON.stringify([
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
      ])
    ]);

    // Create some sample messages
    await pool.query(`
      INSERT INTO messages (user_id, trip_id, text, sender, suggestions)
      VALUES
        ($1, NULL, 'Hello! I want to plan a trip to Tokyo', 'user', NULL),
        ($2, NULL, 'That sounds exciting! I can help you plan an amazing trip to Tokyo. When are you planning to go, and for how many days?', 'ai', $3)
    `, [
      userId,
      userId,
      JSON.stringify(['7 days in March', '5 days in April', '10 days in May'])
    ]);

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    await createTables();
    await seedData();
    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

export { createTables, seedData };
