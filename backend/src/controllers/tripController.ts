import { Request, Response } from 'express';
import pool from '../database/connection';
import { ApiResponse, Trip } from '../types';

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    // For demo, return all trips
    // In production, filter by authenticated user
    const result = await pool.query(
      'SELECT id, user_id, destination, start_date, end_date, status, image_url, description, created_at FROM trips ORDER BY start_date DESC'
    );

    const trips: any[] = result.rows.map(row => ({
      id: row.id,
      destination: row.destination,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      imageUrl: row.image_url,
      description: row.description,
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: trips,
    };

    res.json(response);
  } catch (error) {
    console.error('Get trips error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch trips',
    };
    res.status(500).json(response);
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, user_id, destination, start_date, end_date, status, image_url, description FROM trips WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Trip not found',
      };
      return res.status(404).json(response);
    }

    const row = result.rows[0];
    const trip: any = {
      id: row.id,
      destination: row.destination,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      imageUrl: row.image_url,
      description: row.description,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: trip,
    };

    res.json(response);
  } catch (error) {
    console.error('Get trip error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch trip',
    };
    res.status(500).json(response);
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { destination, startDate, endDate, description } = req.body;
    const userId = req.headers['user-id'] || 'demo-user-id';

    const result = await pool.query(
      'INSERT INTO trips (user_id, destination, start_date, end_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING id, destination, start_date, end_date, status, description',
      [userId, destination, startDate, endDate, description]
    );

    const row = result.rows[0];
    const trip: any = {
      id: row.id,
      destination: row.destination,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      description: row.description,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: trip,
    };

    res.json(response);
  } catch (error) {
    console.error('Create trip error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create trip',
    };
    res.status(500).json(response);
  }
};
