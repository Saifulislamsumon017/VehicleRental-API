import { Router } from 'express';
import { userControllers } from './user.controller';
import logger from '../../middleware/logger';
import auth from '../../middleware/auth';

const router = Router();

router.post('/signup', userControllers.createUser);

// admin only

router.get('/', logger, auth('admin'), userControllers.getAllUser);

// admin or owner (note: auth() will set req.user; controller enforces owner check if needed)

router.get('/:id', auth('admin', 'customer'), userControllers.getSingleUser);

// update (admin or own) — route uses auth to ensure authenticated; controller currently updates directly
router.put('/:id', auth('admin', 'customer'), userControllers.updateUser);

// delete - admin only
router.delete('/:id', auth('admin'), userControllers.deleteUser);

export const usersRoutes = router;
