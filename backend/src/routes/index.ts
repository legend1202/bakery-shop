import express from 'express';
import authRoutes from './auth.routes';
import branchRoutes from './branch.routes';
import productRoutes from './product.routes';
import supplyRoutes from './supply.routes';
import { sendResponse } from '../utils/response.utils';

const router = express.Router();

router.get('/', (req, res) => sendResponse(res, 200, `API is running`));
router.use('/api/auth', authRoutes);
router.use('/api/branch', branchRoutes);
router.use('/api/product', productRoutes);
router.use('/api/supply', supplyRoutes);

export default router;
