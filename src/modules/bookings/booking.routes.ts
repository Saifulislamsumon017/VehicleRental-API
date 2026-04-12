import { Router } from 'express';
import { bookingControllers } from './booking.controller';
import auth from '../../middleware/auth';

const router = Router();

// POST /api/v1/bookings (Customer or Admin)
router.post('/', auth('admin', 'customer'), bookingControllers.createBooking);

// GET /api/v1/bookings (role-based)
router.get('/', auth('admin', 'customer'), bookingControllers.getBookings);

// PUT /api/v1/bookings/:bookingId (customer cancel OR admin mark returned)
router.put(
  '/:bookingId',
  auth('admin', 'customer'),
  bookingControllers.updateBooking,
);

export const bookingsRoutes = router;
