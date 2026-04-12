import { pool } from '../../config/db';

const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status = 'available',
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ],
  );
  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (id: string, payload: any) => {
  // simple update like sample
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5, updated_at=NOW() WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ],
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  // check active bookings
  const check = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [id],
  );
  if (check.rows.length) {
    return { rowCount: 0, error: 'Vehicle has active bookings' };
  }
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
