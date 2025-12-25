import { pool } from '../../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

const signup = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role = 'customer'
) => {
  const normEmail = email.toLowerCase();
  const exists = await pool.query(`SELECT id FROM users WHERE email=$1`, [
    normEmail,
  ]);
  if (exists.rows.length) throw new Error('Email already exists');

  if (password.length < 6)
    throw new Error('Password must be at least 6 characters');

  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role,created_at`,
    [name, normEmail, hashed, phone, role]
  );
  return result.rows[0];
};

const signin = async (email: string, password: string) => {
  const normEmail = email.toLowerCase();
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    normEmail,
  ]);
  if (result.rows.length === 0) throw new Error('Invalid credentials');

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: '7d' }
  );

  // remove password for return
  delete user.password;
  return { token, user };
};

export const authServices = { signup, signin };
