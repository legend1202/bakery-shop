import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import { errorWrap } from '../utils/error.utils';

import { withTransaction } from '../utils/transactionHelper';
import {
  getInventoryOfBranchByUser,
} from '../controllers/inventory.controller';

const router = express.Router();

router.get(
  '/branch',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getInventoryOfBranchByUser, 'Could not get inventory'))
);

export default router;
