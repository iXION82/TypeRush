import express from 'express';
import { updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.patch('/:id', authenticateToken, updateUser);

export default router;

