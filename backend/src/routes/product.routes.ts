import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { verifyAdmin } from '../middleware/role.middleware';

import {
  create,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByUser,
} from '../controllers/product.controller';

import { errorWrap } from '../utils/error.utils';

import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create branch')
);

router.get(
  '/get-products-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getProductsByUser, 'Could not get Products'))
);

router.get(
  '/get-products',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  /* errorWrap(
    verifyAdmin,
    `Admin can create branches only. This user can't get branches`
  ), */
  withTransaction(errorWrap(getProducts, 'Could not get Products'))
);

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  /* errorWrap(
    verifyAdmin,
    `Admin can create branches only. This user can't get branches`
  ), */
  withTransaction(errorWrap(updateProduct, 'Could not update Branch'))
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteProduct, 'Could not delete Branch'))
);

export default router;
