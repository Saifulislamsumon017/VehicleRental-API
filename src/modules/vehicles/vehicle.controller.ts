import { Request, Response } from 'express';
import { vehicleServices } from './vehicle.service';

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicles();
    res.status(200).json({ success: true, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicleById(
      req.params.vehicleId as string,
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(
      req.params.vehicleId as string,
      req.body,
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string,
    );
    if ((result as any).rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: (result as any).error || 'Cannot delete vehicle',
      });
    }
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
