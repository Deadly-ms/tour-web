import { Router } from 'express';
import { getDestinations, getDestinationBySlug } from '../controllers/destinationController';

const router = Router();

// Public destination endpoints
router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);

export default router;
