import express from 'express';
import { updateUser, getUserStats, getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.patch('/:id', authenticateToken, updateUser);
router.get('/:id/stats', authenticateToken, getUserStats);
router.get('/:id/profile', authenticateToken, getUserProfile);

export default router;
