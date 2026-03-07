import express from 'express';
import { getRandomText, createText } from '../controllers/textController.js';
const router = express.Router();

router.get('/', getRandomText);
router.post('/add', createText);

export default router;