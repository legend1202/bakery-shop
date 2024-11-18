import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  getCashcut,
  createCashcut,
  getTotalCashcut,
} from '../controllers/cashcut.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.get(
  '/get/:saleDate',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getCashcut, 'Could not get Products'))
);

router.get(
  '/getTotal',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getTotalCashcut, 'Could not get Products'))
);

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(createCashcut, 'Could not create branch')
);

export default router;
