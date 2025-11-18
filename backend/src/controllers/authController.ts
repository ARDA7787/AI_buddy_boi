import { Request, Response } from 'express';
import pool from '../database/connection';
import { ApiResponse, User, UserPreferences } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // For demo purposes, we'll do simple email lookup
    // In production, you'd verify password hash
    const result = await pool.query(
      'SELECT id, email, name, preferences FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Auto-create user for demo
      const newUserResult = await pool.query(
        'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name, preferences',
        [email, email.split('@')[0]]
      );

      const user = newUserResult.rows[0];
      const response: ApiResponse<{ user: any; token: string }> = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: user.preferences,
          },
          token: 'demo-token-' + user.id,
        },
      };

      return res.json(response);
    }

    const user = result.rows[0];
    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences,
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
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: 'User already exists',
      };
      return res.status(400).json(response);
    }

    // Create user (in production, hash the password)
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name, preferences',
      [email, name]
    );

    const user = result.rows[0];
    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          preferences: user.preferences,
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

    // For demo, we'll use a default user
    // In production, get userId from authenticated session
    const userId = req.headers['user-id'] || 'demo-user-id';

    // First, ensure user exists
    let userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      // Create demo user
      userResult = await pool.query(
        'INSERT INTO users (id, email, name) VALUES ($1, $2, $3) RETURNING id',
        [userId, 'demo@example.com', 'Demo User']
      );
    }

    // Update preferences
    const result = await pool.query(
      'UPDATE users SET preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, name, preferences',
      [JSON.stringify(preferences), userId]
    );

    const user = result.rows[0];
    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
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
