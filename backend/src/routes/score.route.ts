import express from 'express';
import { ScoreCreation } from '../controllers/scoreController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/create', authenticateToken, ScoreCreation);

export default router;