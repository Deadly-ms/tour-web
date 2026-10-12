import { Router } from 'express';
import {
  listPublicGallery,
  getGalleryItem,
} from '../controllers/galleryController';

const router = Router();

// Public gallery endpoints
router.get('/', listPublicGallery);
router.get('/:id', getGalleryItem);

export default router;
