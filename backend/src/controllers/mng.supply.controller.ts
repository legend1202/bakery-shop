import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';

import { RequestError } from '../utils/globalErrorHandler';

import {
  handleDeleteMngSupply,
  handleMngSupplyCreation,
  handleGetMngSupplyByUser,
} from '../services/mng.supply.services';

import { DecodedToken } from '../types/req.type';

import { SuppliesModel } from '../models/supply.model';
import { BranchesModel } from '../models/branch.model';

export const mngcreateSupply = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { supply } = req.body;
    const newProduct = await handleMngSupplyCreation(
      supply,
      req.userId,
      session
    );
    const productData = await SuppliesModel.findOne({
      id: newProduct.supplyId,
    });
    const branchData = await BranchesModel.findOne({
      id: newProduct.branchId,
    });
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newProduct.id,
      supplyDetails: productData,
      branchDetails: branchData,
      quantity: newProduct.quantity,
      status: newProduct.status,
      bio: newProduct.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getMngSupplyByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleGetMngSupplyByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Supplies', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteMngSupply = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    await handleDeleteMngSupply(product.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: product.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
