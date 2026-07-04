import express from 'express';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import commonRoutes from './commonRoutes.js';

const router = express.Router();

router.use('/', commonRoutes)
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;

