import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as tripController from '../controllers/tripController';
import * as itineraryController from '../controllers/itineraryController';
import * as chatController from '../controllers/chatController';
import * as safetyController from '../controllers/safetyController';

const router = Router();

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/preferences', authController.savePreferences);

// Trip routes
router.get('/trips', tripController.getAllTrips);
router.get('/trips/:id', tripController.getTripById);
router.post('/trips', tripController.createTrip);

// Itinerary routes
router.get('/itineraries/:tripId', itineraryController.getItinerary);
router.put('/itineraries/:tripId', itineraryController.updateItinerary);

// Chat routes
router.post('/chat/message', chatController.sendMessage);
router.get('/chat/history', chatController.getChatHistory);

// Safety routes
router.get('/safety', safetyController.getSafetyInfo);
router.post('/safety/emergency', safetyController.reportEmergency);

export default router;
