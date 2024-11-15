import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleCashcutCreation,
  handleGetCashcut,
} from '../services/cashcut.services';

import { DecodedToken } from '../types/req.type';

export const createCashcut = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;
  try {
    const { cashcut } = req.body;
    const newCashcut = await handleCashcutCreation(cashcut);
    /* const branchData = await BranchesModel.findOne({ id: newSupply.branchId }); */
    return sendResponse(res, 201, 'Created Supply Successfully', {
      id: newCashcut.id,
      /* branchDetails: branchData, */
      total: newCashcut.total,
      brahchId: newCashcut.branchId,
      saleDate: newCashcut.saleDate,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getCashcut = async (req: Request, res: Response) => {
  const { saleDate } = req.params;
  try {
    const cashcut = await handleGetCashcut(saleDate);
    return sendResponse(res, 200, 'Get handleGetCashcut', {
      cashcut,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};