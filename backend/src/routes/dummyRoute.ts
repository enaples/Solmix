import express from 'express';
import { dummyData } from '../controllers/dummyController';

const router = express.Router();


// Define a dummy route
router.get('/', dummyData);

// Export the router
export default router;