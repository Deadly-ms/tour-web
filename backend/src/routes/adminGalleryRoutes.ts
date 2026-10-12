import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  listAdminGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  togglePublishGalleryItem,
  seedGalleryEndpoint,
} from '../controllers/galleryController';

const router = Router();

// Apply requireAdmin middleware to all admin gallery routes
router.use(requireAdmin);

// Admin Gallery CRUD
router.get('/', listAdminGallery);
router.post('/', createGalleryItem);
router.post('/seed', seedGalleryEndpoint);
router.get('/:id', getGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);
router.patch('/:id/publish', togglePublishGalleryItem);

export default router;
