import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { verifyAdmin } from '../middleware/role.middleware';

import {
  create,
  getBranches,
  updateBranch,
  deleteBranch,
} from '../controllers/branch.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can create branches only. This user can't get branches`
  ),
  errorWrap(create, 'Could not create branch')
);

router.get(
  '/get-branches',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getBranches, 'Could not get branches'))
);

router.put(
  '/update',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can create branches only. This user can't get branches`
  ),
  withTransaction(errorWrap(updateBranch, 'Could not update Branch'))
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(
    verifyAdmin,
    `Admin can delete branches only. This user can't delete branches`
  ),
  withTransaction(errorWrap(deleteBranch, 'Could not delete Branch'))
);

export default router;
