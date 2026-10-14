import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import { upload } from '../middleware/upload';
import {
  listAdminTours,
  getAdminTour,
  createTour,
  updateTour,
  deleteTour,
  togglePublishTour,
  toggleFeaturedTour,
  seedToursEndpoint,
  uploadImage,
} from '../controllers/adminTourController';

const router = Router();

// Apply requireAdmin middleware to all admin tour routes
router.use(requireAdmin);

// Tour CRUD & Publish / Curated Toggle
router.get('/', listAdminTours);
router.post('/', createTour);
router.get('/:id', getAdminTour);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);
router.patch('/:id/publish', togglePublishTour);
router.patch('/:id/featured', toggleFeaturedTour);

// Utility: Re-seed default tours
router.post('/seed', seedToursEndpoint);

// Cloudinary Image Upload
router.post('/upload', upload.single('image'), uploadImage);

export default router;
