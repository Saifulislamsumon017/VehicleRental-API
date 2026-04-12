import { Router } from 'express';
import { vehicleControllers } from './vehicle.controller';
import auth from '../../middleware/auth';

const router = Router();

// admin only
router.post('/', auth('admin'), vehicleControllers.createVehicle);

// public
router.get('/', vehicleControllers.getVehicles);
router.get('/:vehicleId', vehicleControllers.getVehicle);

// admin only
router.put('/:vehicleId', auth('admin'), vehicleControllers.updateVehicle);
router.delete('/:vehicleId', auth('admin'), vehicleControllers.deleteVehicle);

export const vehiclesRoutes = router;
