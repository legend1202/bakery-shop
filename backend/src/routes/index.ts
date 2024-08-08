import express from 'express';

import mngRoutes from './mng.routes';
import saleRoutes from './sale.routes';
import authRoutes from './auth.routes';
import branchRoutes from './branch.routes';
import supplyRoutes from './supply.routes';
import productRoutes from './product.routes';
import attendanceRoutes from './attendance.routes';

import { sendResponse } from '../utils/response.utils';

const router = express.Router();

router.get('/', (req, res) => sendResponse(res, 200, `API is running`));
router.use('/api/mng', mngRoutes);
router.use('/api/sale', saleRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/branch', branchRoutes);
router.use('/api/supply', supplyRoutes);
router.use('/api/product', productRoutes);
router.use('/api/attendance', attendanceRoutes);

export default router;
