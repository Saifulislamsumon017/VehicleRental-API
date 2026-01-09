import { Request, Response } from 'express';
import { userServices } from './user.service';

// ControllerUserCreate
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Data inserted successfully',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ControllerGetAllUsers

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ControllerGetSingleUser
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ControllerUpdateUser
const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userServices.updateUser(name, email, req.params.id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User Not Found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ControllerDeleteUser

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id!);
    if ((result as any).rowCount === 0) {
      res.status(400).json({
        success: false,
        message: (result as any).error || 'User not found or cannot delete',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }
  } catch (error: any) {
    {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const userControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
