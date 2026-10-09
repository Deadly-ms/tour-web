import { Router } from 'express';
import { getTours, getTourBySlug } from '../controllers/tourController';

const router = Router();

// Public tour package endpoints
router.get('/', getTours);
router.get('/:slug', getTourBySlug);

export default router;
