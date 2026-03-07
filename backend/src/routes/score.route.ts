import express from 'express';
import { ScoreCreation, getLeaderboard } from '../controllers/scoreController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/create', authenticateToken, ScoreCreation);
router.get('/leaderboard', getLeaderboard);

export default router;