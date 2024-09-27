import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleGetSupplies,
  handleUpdateSupply,
  handleDeleteSupply,
  handleSupplyCreation,
  handleGetSupplyByUser,
} from '../services/supply.services';

import { BranchesModel } from '../models/branch.model';

import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;
  try {
    const { supply } = req.body;
    const newSupply = await handleSupplyCreation(supply, req.userId, session);
    /* const branchData = await BranchesModel.findOne({ id: newSupply.branchId }); */
    return sendResponse(res, 201, 'Created Supply Successfully', {
      id: newSupply.id,
      /* branchDetails: branchData, */
      name: newSupply.name,
      bio: newSupply.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getSupply = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const supplies = await handleGetSupplies(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      supplies,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getSupplyByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const supply = await handleGetSupplyByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Suuply', {
      supply,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const updateSupply = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { branch } = req.body;
    const updatedUser = await handleUpdateSupply(branch, session);
    return sendResponse(res, 201, 'Branch updated', {
      ...updatedUser,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteSupply = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { supply } = req.body;
    await handleDeleteSupply(supply.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: supply.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
