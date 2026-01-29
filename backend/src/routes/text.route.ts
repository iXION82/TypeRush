import express from 'express';
import { getRandomText } from '../controllers/textController.js';
const router = express.Router();

router.get('/', getRandomText);

export default router;