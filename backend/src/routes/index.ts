import { Router } from 'express';
import healthRoutes from './health.routes';
import contactRoutes from './contactRoutes';

const router = Router();

// Mount sub-routes
router.use('/', healthRoutes);
router.use('/', contactRoutes);

export default router;