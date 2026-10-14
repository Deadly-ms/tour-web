import { Router } from 'express';
import healthRoutes from './health.routes';
import contactRoutes from './contactRoutes';
import tourRoutes from './tourRoutes';
import adminTourRoutes from './adminTourRoutes';
import galleryRoutes from './galleryRoutes';
import adminGalleryRoutes from './adminGalleryRoutes';
import destinationRoutes from './destinationRoutes';
import adminDestinationRoutes from './adminDestinationRoutes';

const router = Router();

// Mount sub-routes
router.use('/', healthRoutes);
router.use('/', contactRoutes);
router.use('/tours', tourRoutes);
router.use('/admin/tours', adminTourRoutes);

// Destinations routes
router.use('/destinations', destinationRoutes);
router.use('/admin/destinations', adminDestinationRoutes);

// Gallery routes
router.use('/gallery', galleryRoutes);
router.use('/admin/gallery', adminGalleryRoutes);

// Also mount admin uploads directly under /admin/upload for convenience
router.use('/admin', adminTourRoutes);

export default router;
