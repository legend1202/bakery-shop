import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { verifyAdmin } from '../middleware/role.middleware';

import {
  getMngProducts,
  mngcreateProduct,
  deleteMngProduct,
  confirmMngProduct,
  getMngProductsByUser,
} from '../controllers/mng.product.controller';

import {
  getMngCustomerOrderByUser,
  mngcreateCustomerOrder,
} from '../controllers/customerOrder.controller';

import { errorWrap } from '../utils/error.utils';

import { withTransaction } from '../utils/transactionHelper';
import {
  deleteMngSupply,
  mngcreateSupply,
  confirmMngSupply,
  getMngSupplyByUser,
} from '../controllers/mng.supply.controller';

const router = express.Router();

router.post(
  '/product/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(mngcreateProduct, 'Could not create branch')
);

router.post(
  '/supply/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(mngcreateSupply, 'Could not create branch')
);

router.post(
  '/custom_order/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(mngcreateCustomerOrder, 'Could not create Customer Order')
);

router.get(
  '/product/get-products-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getMngProductsByUser, 'Could not get Products'))
);

router.get(
  '/custom_order/get-products-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(
    errorWrap(getMngCustomerOrderByUser, 'Could not get Products')
  )
);

router.get(
  '/product/get-products',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getMngProducts, 'Could not get Products'))
);

router.get(
  '/supply/get-supply-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getMngSupplyByUser, 'Could not get Supply'))
);

router.post(
  '/product/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteMngProduct, 'Could not delete Branch'))
);

router.post(
  '/product/confirm',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(confirmMngProduct, 'Could not update Branch'))
);

router.post(
  '/supply/confirm',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(confirmMngSupply, 'Could not update Branch'))
);

router.post(
  '/supply/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteMngSupply, 'Could not delete Branch'))
);
export default router;
