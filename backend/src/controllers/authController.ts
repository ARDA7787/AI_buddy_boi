import { Request, Response } from 'express';
import db from '../database/connection';
import { ApiResponse, UserPreferences } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // For demo purposes, we'll do simple email lookup
    const user = db.prepare('SELECT id, email, name, preferences FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      // Auto-create user for demo
      const stmt = db.prepare('INSERT INTO users (email, name) VALUES (?, ?)');
      const result = stmt.run(email, email.split('@')[0]);
      
      const newUser = db.prepare('SELECT id, email, name, preferences FROM users WHERE id = ?').get(result.lastInsertRowid) as any;

      const response: ApiResponse<{ user: any; token: string }> = {
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            preferences: newUser.preferences ? JSON.parse(newUser.preferences) : null,
          },
          token: 'demo-token-' + newUser.id,
        },
      };

      return res.json(response);
    }

    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences ? JSON.parse(user.preferences) : null,
        },
        token: 'demo-token-' + user.id,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Login failed',
    };
    res.status(500).json(response);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User already exists',
      };
      return res.status(400).json(response);
    }

    // Create user
    const stmt = db.prepare('INSERT INTO users (email, name) VALUES (?, ?)');
    const result = stmt.run(email, name);

    const user = db.prepare('SELECT id, email, name, preferences FROM users WHERE id = ?').get(result.lastInsertRowid) as any;

    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences ? JSON.parse(user.preferences) : null,
        },
        token: 'demo-token-' + user.id,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Register error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Registration failed',
    };
    res.status(500).json(response);
  }
};

export const savePreferences = async (req: Request, res: Response) => {
  try {
    const preferences: UserPreferences = req.body;
    const userId = req.headers['user-id'] || 'demo-user-id';

    // Ensure user exists
    let user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);

    if (!user) {
      // Create demo user
      db.prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)').run(
        userId, 
        'demo@example.com', 
        'Demo User'
      );
    }

    // Update preferences
    db.prepare('UPDATE users SET preferences = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
      JSON.stringify(preferences),
      userId
    );

    const updatedUser = db.prepare('SELECT id, email, name, preferences FROM users WHERE id = ?').get(userId) as any;

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : null,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Save preferences error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to save preferences',
    };
    res.status(500).json(response);
  }
};
