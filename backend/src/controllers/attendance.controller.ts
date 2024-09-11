import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleAttendance,
  handleAttendanceByUser,
  handleDeleteAttendance,
  handleAttendanceCreation,
} from '../services/attendance.services';

import { DecodedToken } from '../types/req.type';

export const createAttendance = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const newProduct = await handleAttendanceCreation(req.userId, session);
    return sendResponse(res, 201, 'Created Attendance Successfully', {
      attendances: newProduct,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getAttendanceByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleAttendanceByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getAttendance = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const results = await handleAttendance(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      results,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    await handleDeleteAttendance(product.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: product.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
