import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleGetInventoryOfBranchByUser,
} from '../services/inventory.services';

import { DecodedToken } from '../types/req.type';

export const getInventoryOfBranchByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const inventory = await handleGetInventoryOfBranchByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
        inventory,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
