import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  listAdminDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  toggleActiveDestination,
  seedDestinationsEndpoint,
} from '../controllers/adminDestinationController';

const router = Router();

// Apply requireAdmin middleware to all admin destination routes
router.use(requireAdmin);

// Destination CRUD & Toggle
router.get('/', listAdminDestinations);
router.post('/', createDestination);
router.put('/:id', updateDestination);
router.delete('/:id', deleteDestination);
router.patch('/:id/toggle', toggleActiveDestination);

// Utility: Re-seed default destinations
router.post('/seed', seedDestinationsEndpoint);

export default router;
