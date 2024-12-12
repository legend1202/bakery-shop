import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { createOrder, getOrderByUser,deleteOrder, confirmOrder } from '../controllers/order.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';
const router = express.Router();

router.get(
  '/get-order',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getOrderByUser, 'Could not get Products')
);

router.post(
  '/create',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(createOrder, 'Could not create branch')
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteOrder, 'Could not delete Branch'))
);

router.post(
  '/confirm',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(confirmOrder, 'Could not delete Branch'))
);


export default router;
