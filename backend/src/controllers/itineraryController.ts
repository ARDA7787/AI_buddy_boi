import { Request, Response } from 'express';
import db from '../database/connection';
import { ApiResponse } from '../types';

export const getItinerary = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const row = db.prepare(
      'SELECT id, trip_id, days FROM itineraries WHERE trip_id = ?'
    ).get(tripId) as any;

    if (!row) {
      const response: ApiResponse = {
        success: false,
        error: 'Itinerary not found',
      };
      return res.status(404).json(response);
    }

    const itinerary: any = {
      id: row.id,
      tripId: row.trip_id,
      days: JSON.parse(row.days),
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
    const existing = db.prepare(
      'SELECT id FROM itineraries WHERE trip_id = ?'
    ).get(tripId);

    let row: any;
    if (!existing) {
      // Create new itinerary
      const stmt = db.prepare(
        'INSERT INTO itineraries (trip_id, days) VALUES (?, ?)'
      );
      const result = stmt.run(tripId, JSON.stringify(days));
      
      row = db.prepare(
        'SELECT id, trip_id, days FROM itineraries WHERE rowid = ?'
      ).get(result.lastInsertRowid);
    } else {
      // Update existing itinerary
      db.prepare(
        'UPDATE itineraries SET days = ?, updated_at = CURRENT_TIMESTAMP WHERE trip_id = ?'
      ).run(JSON.stringify(days), tripId);
      
      row = db.prepare(
        'SELECT id, trip_id, days FROM itineraries WHERE trip_id = ?'
      ).get(tripId);
    }

    const itinerary: any = {
      id: row.id,
      tripId: row.trip_id,
      days: JSON.parse(row.days),
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
