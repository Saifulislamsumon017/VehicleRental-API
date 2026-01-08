import bcrypt from 'bcryptjs';
import { pool } from '../../config/db';

// User Create

const createUser = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role = 'customer' } = payload;

  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(
    name,email,password,phone,role)
    VALUES($1,$2,$3,$4,$5)
    RETURNING
    id,name,email,phone,role,created_at`,

    [name, email.toLowerCase(), hashed, phone, role]
  );

  return result;
};

// Get AllUsers

const getUser = async () => {
  const result = await pool.query(
    `SELECT id,name,email,phone,role,created_at 
    FROM users`
  );

  return result;
};

// Get SingleUser

const getSingleuser = async (id: string) => {
  const result = await pool.query(
    `SELECT id,name,email,phone,role,created_at 
    FROM users 
    WHERE id =$1, 
    [id]`
  );

  return result;
};

// UpdateUser

const updateUser = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE users SET 
    name=$1,email=$2, updated_at=NOW()
    WHERE id=$3
    RETURNING id,name,email,phone,role,created_at`,

    [name, email.toLocaleLowerCase(), id]
  );
  return result;
};

// DeleteUser

const deleteUser = async (id: string) => {
  // check active bookings

  const check = await pool.query(
    `SELECT id 
    FROM bookings
    WHERE customer_id=$1
    AND status="active"`,
    [id]
  );

  if (check.rows.length) {
    return {
      rowCount: 0,
      error: 'User has active bookings',
    };
  }

  const result = await pool.query(
    `DELETE 
    FROM users
    WHERE id=$1`,
    [id]
  );

  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleuser,
  updateUser,
  deleteUser,
};
