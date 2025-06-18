import express from 'express';
import { parseSolidity } from '../controllers/parseSolidity';

const router = express.Router();

router.post('/', parseSolidity); 

export default router;