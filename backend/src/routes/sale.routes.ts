import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  createSale,
  deleteSale,
  getSaleByUser,
} from '../controllers/sale.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.get(
  '/get-sale-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getSaleByUser, 'Could not get Products'))
);

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(createSale, 'Could not create branch')
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteSale, 'Could not delete Branch'))
);

export default router;
