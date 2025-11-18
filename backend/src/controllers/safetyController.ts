import { Request, Response } from 'express';
import { ApiResponse, SafetyInfo, Alert, EmergencyContact } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock safety data generator
const getMockSafetyInfo = (): SafetyInfo => {
  const alerts: Alert[] = [
    {
      id: uuidv4(),
      type: 'weather',
      severity: 'low',
      title: 'Light Rain Expected',
      message: 'Light rain is expected tomorrow afternoon. Consider bringing an umbrella.',
      timestamp: new Date(),
    },
    {
      id: uuidv4(),
      type: 'general',
      severity: 'low',
      title: 'Local Festival',
      message: 'Cherry blossom festival this weekend. Expect larger crowds in parks.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
  ];

  const emergencyContacts: EmergencyContact[] = [
    {
      id: uuidv4(),
      name: 'Emergency Services',
      number: '110',
      type: 'police',
    },
    {
      id: uuidv4(),
      name: 'Ambulance',
      number: '119',
      type: 'medical',
    },
    {
      id: uuidv4(),
      name: 'US Embassy Tokyo',
      number: '+81-3-3224-5000',
      type: 'embassy',
    },
    {
      id: uuidv4(),
      name: 'Hotel Concierge',
      number: '+81-3-1234-5678',
      type: 'personal',
    },
  ];

  return {
    status: 'safe',
    alerts,
    emergency_contacts: emergencyContacts,
    current_location: 'Shibuya, Tokyo, Japan',
  };
};

export const getSafetyInfo = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.query;

    // For demo, return mock data
    // In production, this would fetch real-time safety data based on location
    const safetyInfo = getMockSafetyInfo();

    const response: ApiResponse<SafetyInfo> = {
      success: true,
      data: safetyInfo,
    };

    res.json(response);
  } catch (error) {
    console.error('Get safety info error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch safety information',
    };
    res.status(500).json(response);
  }
};

export const reportEmergency = async (req: Request, res: Response) => {
  try {
    const { type, details } = req.body;
    const userId = req.headers['user-id'] || 'demo-user-id';

    // In production, this would:
    // 1. Log the emergency report
    // 2. Notify emergency contacts
    // 3. Alert authorities if needed
    // 4. Update user's safety status

    console.log(`Emergency reported by user ${userId}:`, { type, details });

    const response: ApiResponse<void> = {
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error('Report emergency error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to report emergency',
    };
    res.status(500).json(response);
  }
};
