import { Router } from 'express';
import healthRoutes from './health.routes';
import contactRoutes from './contactRoutes';
import tourRoutes from './tourRoutes';
import adminTourRoutes from './adminTourRoutes';

const router = Router();

// Mount sub-routes
router.use('/', healthRoutes);
router.use('/', contactRoutes);
router.use('/tours', tourRoutes);
router.use('/admin/tours', adminTourRoutes);

// Also mount admin uploads directly under /admin/upload for convenience
router.use('/admin', adminTourRoutes);

export default router;