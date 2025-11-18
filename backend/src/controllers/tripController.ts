import { Request, Response } from 'express';
import db from '../database/connection';
import { ApiResponse } from '../types';

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const result = db.prepare(
      'SELECT id, user_id, destination, start_date, end_date, status, image_url, description, created_at FROM trips ORDER BY start_date DESC'
    ).all();

    const trips: any[] = (result as any[]).map(row => ({
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

    const row = db.prepare(
      'SELECT id, user_id, destination, start_date, end_date, status, image_url, description FROM trips WHERE id = ?'
    ).get(id) as any;

    if (!row) {
      const response: ApiResponse = {
        success: false,
        error: 'Trip not found',
      };
      return res.status(404).json(response);
    }

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

    const stmt = db.prepare(
      'INSERT INTO trips (user_id, destination, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)'
    );
    
    const result = stmt.run(userId, destination, startDate, endDate, description);

    const row = db.prepare(
      'SELECT id, destination, start_date, end_date, status, description FROM trips WHERE rowid = ?'
    ).get(result.lastInsertRowid) as any;

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
