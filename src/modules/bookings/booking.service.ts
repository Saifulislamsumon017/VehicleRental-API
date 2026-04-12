import { pool } from '../../config/db';
import { PoolClient } from 'pg';

const createBooking = async (payload: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    if (end <= start)
      throw new Error('rent_end_date must be after rent_start_date');

    // lock vehicle row
    const vRes = await client.query(
      'SELECT * FROM vehicles WHERE id=$1 FOR UPDATE',
      [vehicle_id],
    );
    if (vRes.rows.length === 0) throw new Error('Vehicle not found');
    const vehicle = vRes.rows[0];
    if (vehicle.availability_status !== 'available')
      throw new Error('Vehicle not available');

    // days calculation (inclusive of start, exclusive of end? spec: duration -> daily rate * duration)
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.ceil((end.getTime() - start.getTime()) / msPerDay);
    const totalPrice = Number(vehicle.daily_rent_price) * diff;

    const bookingRes = await client.query(
      `INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
       VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice],
    );

    await client.query(
      `UPDATE vehicles SET availability_status='booked', updated_at=NOW() WHERE id=$1`,
      [vehicle_id],
    );

    await client.query('COMMIT');
    return bookingRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getBookings = async (requester: { id?: number; role?: string }) => {
  if (requester.role === 'admin') {
    const r =
      await pool.query(`SELECT b.*, u.name as customer_name, v.vehicle_name FROM bookings b
      JOIN users u ON u.id = b.customer_id
      JOIN vehicles v ON v.id = b.vehicle_id ORDER BY b.created_at DESC`);
    return r;
  } else {
    const r = await pool.query(
      `SELECT b.*, v.vehicle_name FROM bookings b JOIN vehicles v ON v.id = b.vehicle_id WHERE b.customer_id=$1 ORDER BY b.created_at DESC`,
      [requester.id],
    );
    return r;
  }
};

const cancelBooking = async (
  bookingId: string,
  requester: { id?: number; role?: string },
) => {
  const r = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  if (r.rows.length === 0) throw new Error('Booking not found');
  const booking = r.rows[0];
  const today = new Date();
  const start = new Date(booking.rent_start_date);

  if (requester.role !== 'admin') {
    if (booking.customer_id !== requester.id)
      throw new Error('Not allowed to cancel this booking');
    if (today >= start)
      throw new Error('Cannot cancel booking on or after start date');
  }

  await pool.query(
    `UPDATE bookings SET status='cancelled', updated_at=NOW() WHERE id=$1`,
    [bookingId],
  );
  await pool.query(
    `UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`,
    [booking.vehicle_id],
  );
  return { success: true };
};

const markReturned = async (bookingId: string) => {
  const r = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  if (r.rows.length === 0) throw new Error('Booking not found');
  const booking = r.rows[0];
  await pool.query(
    `UPDATE bookings SET status='returned', updated_at=NOW() WHERE id=$1`,
    [bookingId],
  );
  await pool.query(
    `UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`,
    [booking.vehicle_id],
  );
  return { success: true };
};

const autoMarkReturned = async () => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const r = await pool.query(
    `SELECT * FROM bookings WHERE rent_end_date < $1 AND status='active'`,
    [todayStr],
  );
  for (const b of r.rows) {
    await pool.query(
      `UPDATE bookings SET status='returned', updated_at=NOW() WHERE id=$1`,
      [b.id],
    );
    await pool.query(
      `UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`,
      [b.vehicle_id],
    );
  }
  return { processed: r.rows.length };
};

export const bookingServices = {
  createBooking,
  getBookings,
  cancelBooking,
  markReturned,
  autoMarkReturned,
};
