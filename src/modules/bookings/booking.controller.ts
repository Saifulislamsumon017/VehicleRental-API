import { Request, Response } from 'express';
import { bookingServices } from './booking.service';

const createBooking = async (req: Request, res: Response) => {
  try {
    const { vehicle_id, rent_start_date, rent_end_date, customer_id } =
      req.body;
    const requester = req.user;
    const cid = customer_id ? Number(customer_id) : (requester as any).id;
    if (!vehicle_id || !rent_start_date || !rent_end_date)
      return res
        .status(400)
        .json({ success: false, message: 'Missing fields' });

    const booking = await bookingServices.createBooking({
      customer_id: cid,
      vehicle_id: Number(vehicle_id),
      rent_start_date,
      rent_end_date,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const requester = req.user;
    const r = await bookingServices.getBookings({
      id: (requester as any).id,
      role: (requester as any).role,
    });
    res.status(200).json({ success: true, data: r.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const requester = req.user;
    // admin uses body.action = "mark_returned"
    if (
      (requester as any).role === 'admin' &&
      req.body.action === 'mark_returned'
    ) {
      await bookingServices.markReturned(bookingId as string);
      return res
        .status(200)
        .json({ success: true, message: 'Booking marked as returned' });
    } else {
      // customer cancels (before start)
      await bookingServices.cancelBooking(bookingId as string, {
        id: (requester as any).id,
        role: (requester as any).role,
      });
      return res
        .status(200)
        .json({ success: true, message: 'Booking cancelled' });
    }
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bookingControllers = { createBooking, getBookings, updateBooking };
