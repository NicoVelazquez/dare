import express from 'express';
import usersRoutes from './users';
import policiesRoutes from './policies';
import clientsRoutes from './clients';

const router = express.Router();

router.use('/', usersRoutes);
router.use('/policies', policiesRoutes);
router.use('/clients', clientsRoutes);

export default router;
