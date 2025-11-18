import { Request, Response } from 'express';
import pool from '../database/connection';
import { ApiResponse, Itinerary } from '../types';

export const getItinerary = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const result = await pool.query(
      'SELECT id, trip_id, days FROM itineraries WHERE trip_id = $1',
      [tripId]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Itinerary not found',
      };
      return res.status(404).json(response);
    }

    const row = result.rows[0];
    const itinerary: any = {
      id: row.id,
      tripId: row.trip_id,
      days: row.days,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: itinerary,
    };

    res.json(response);
  } catch (error) {
    console.error('Get itinerary error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch itinerary',
    };
    res.status(500).json(response);
  }
};

export const updateItinerary = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { days } = req.body;

    // Check if itinerary exists
    const existing = await pool.query(
      'SELECT id FROM itineraries WHERE trip_id = $1',
      [tripId]
    );

    let result;
    if (existing.rows.length === 0) {
      // Create new itinerary
      result = await pool.query(
        'INSERT INTO itineraries (trip_id, days) VALUES ($1, $2) RETURNING id, trip_id, days',
        [tripId, JSON.stringify(days)]
      );
    } else {
      // Update existing itinerary
      result = await pool.query(
        'UPDATE itineraries SET days = $1, updated_at = CURRENT_TIMESTAMP WHERE trip_id = $2 RETURNING id, trip_id, days',
        [JSON.stringify(days), tripId]
      );
    }

    const row = result.rows[0];
    const itinerary: any = {
      id: row.id,
      tripId: row.trip_id,
      days: row.days,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: itinerary,
    };

    res.json(response);
  } catch (error) {
    console.error('Update itinerary error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update itinerary',
    };
    res.status(500).json(response);
  }
};
