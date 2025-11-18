import { Request, Response } from 'express';
import pool from '../database/connection';
import { ApiResponse, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock AI responses
const getMockAIResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('trip') || lowerMessage.includes('plan')) {
    return {
      text: "I'd be happy to help you plan a trip! Where would you like to go, and when are you planning to travel?",
      suggestions: [
        'Paris in spring',
        'Tokyo for a week',
        'Beach vacation in Bali'
      ]
    };
  }

  if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
    return {
      text: "I can recommend some great restaurants! What type of cuisine are you interested in?",
      suggestions: [
        'Italian restaurants',
        'Local specialties',
        'Vegetarian options'
      ]
    };
  }

  if (lowerMessage.includes('itinerary') || lowerMessage.includes('schedule')) {
    return {
      text: "Let me help you with your itinerary. Would you like me to show you today's activities or plan for a specific day?",
      suggestions: [
        "Show today's itinerary",
        'Plan tomorrow',
        'Full week view'
      ]
    };
  }

  if (lowerMessage.includes('weather')) {
    return {
      text: "The weather looks great for your trip! Sunny with temperatures around 72°F (22°C). Perfect for outdoor activities!",
      suggestions: [
        'Outdoor activity suggestions',
        'What to pack',
        '7-day forecast'
      ]
    };
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      text: "I'm your AI travel assistant! I can help you plan trips, find restaurants, manage your itinerary, check weather, and provide safety information. What would you like to do?",
      suggestions: [
        'Plan a new trip',
        'Find restaurants',
        'Check my itinerary',
        'Safety information'
      ]
    };
  }

  // Default response
  return {
    text: "I'm here to help with your travel plans! You can ask me about destinations, restaurants, activities, weather, or anything else related to your trip.",
    suggestions: [
      'Tell me about popular destinations',
      'What should I do today?',
      'Help me plan a trip'
    ]
  };
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, tripId } = req.body;
    const userId = req.headers['user-id'] || 'demo-user-id';

    // Ensure user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (id, email, name) VALUES ($1, $2, $3)',
        [userId, 'demo@example.com', 'Demo User']
      );
    }

    // Save user message
    await pool.query(
      'INSERT INTO messages (user_id, trip_id, text, sender) VALUES ($1, $2, $3, $4)',
      [userId, tripId || null, message, 'user']
    );

    // Generate AI response
    const aiResponse = getMockAIResponse(message);

    // Save AI message
    const result = await pool.query(
      'INSERT INTO messages (user_id, trip_id, text, sender, suggestions) VALUES ($1, $2, $3, $4, $5) RETURNING id, text, sender, suggestions, timestamp',
      [userId, tripId || null, aiResponse.text, 'ai', JSON.stringify(aiResponse.suggestions || [])]
    );

    const row = result.rows[0];
    const responseMessage: any = {
      id: row.id,
      text: row.text,
      sender: row.sender,
      timestamp: row.timestamp,
      suggestions: row.suggestions,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: responseMessage,
    };

    res.json(response);
  } catch (error) {
    console.error('Send message error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to send message',
    };
    res.status(500).json(response);
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.query;
    const userId = req.headers['user-id'] || 'demo-user-id';

    let query = 'SELECT id, text, sender, suggestions, timestamp FROM messages WHERE user_id = $1';
    const params: any[] = [userId];

    if (tripId) {
      query += ' AND trip_id = $2';
      params.push(tripId);
    } else {
      query += ' AND trip_id IS NULL';
    }

    query += ' ORDER BY timestamp ASC LIMIT 50';

    const result = await pool.query(query, params);

    const messages: any[] = result.rows.map(row => ({
      id: row.id,
      text: row.text,
      sender: row.sender,
      timestamp: row.timestamp,
      suggestions: row.suggestions,
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: messages,
    };

    res.json(response);
  } catch (error) {
    console.error('Get chat history error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch chat history',
    };
    res.status(500).json(response);
  }
};
