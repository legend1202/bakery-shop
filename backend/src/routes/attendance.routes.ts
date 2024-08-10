import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  getAttendance,
  deleteAttendance,
  createAttendance,
  getAttendanceByUser,
} from '../controllers/attendance.controller';

import { errorWrap } from '../utils/error.utils';

import { withTransaction } from '../utils/transactionHelper';

const router = express.Router();

router.post(
  '/register',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(createAttendance, 'Could not create branch')
);

router.get(
  '/get-attendance-by-user',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getAttendanceByUser, 'Could not get Products'))
);

router.get(
  '/get-attendance',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(getAttendance, 'Could not get attendance'))
);

router.post(
  '/delete',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  withTransaction(errorWrap(deleteAttendance, 'Could not delete Branch'))
);

export default router;
