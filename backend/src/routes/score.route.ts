import express from 'express';
import { ScoreCreation } from '../controllers/scoreController';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/score', authenticateToken, ScoreCreation);

export default router;