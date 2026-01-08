import express, { Request, Response } from 'express';
import initDB from './config/db';
import cors from 'cors';

// routers
import logger from './middleware/logger';
import { authRoutes } from './modules/auth/auth.routes';
// import usersRoutes from "./modules/users/users.routes";
// import vehiclesRoutes from "./modules/vehicles/vehicles.routes";
// import bookingsRoutes from "./modules/bookings/bookings.routes";

// parser

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// app.use(express.urlencoded());

// initializing DB
initDB();

// mount
app.use('/api/v1/auth', authRoutes);
// app.use("/api/v1/users", usersRoutes);
// app.use("/api/v1/vehicles", vehiclesRoutes);
// app.use("/api/v1/bookings", bookingsRoutes);

// "/" -> http://localhost:5000

app.get('/', logger, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Vehicle Rental API',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

export default app;
