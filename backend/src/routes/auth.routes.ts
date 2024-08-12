import express from 'express';
import verifyToken from '../middleware/auth.middleware';
import { verifyAdmin } from '../middleware/role.middleware';

import {
  login,
  create,
  getUsers,
  assignRole,
  userDelete,
} from '../controllers/auth.controller';

import { errorWrap } from '../utils/error.utils';
import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post('/register', errorWrap(create, 'Could not create user'));

router.post(
  '/login',
  withTransaction(errorWrap(login, 'Could not login user'))
);
router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(userDelete, 'Could not delete user'))
);

router.put(
  '/assign-role',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(assignRole, 'Could not assign user role'))
);

router.get(
  '/get-users',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  /* errorWrap(verifyAdmin, `Admin can get users only. This user can't get users`), */
  withTransaction(errorWrap(getUsers, 'Could not get users'))
);

export default router;
