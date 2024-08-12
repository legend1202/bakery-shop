import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { verifyAdmin } from '../middleware/role.middleware';

import {
  create,
  getSupply,
  updateSupply,
  deleteSupply,
  getSupplyByUser,
} from '../controllers/supply.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create branch')
);

router.get(
  '/get-supply',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getSupply, 'Could not get Products'))
);

router.get(
  '/get-supply-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getSupplyByUser, 'Could not get Products'))
);

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can create branches only. This user can't get branches`
  ),
  withTransaction(errorWrap(updateSupply, 'Could not update Branch'))
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteSupply, 'Could not delete Branch'))
);

export default router;
