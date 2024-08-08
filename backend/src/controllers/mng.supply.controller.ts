import { sendResponse } from '../utils/response.utils';
import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import {
  handleMngSupplyCreation,
  handleGetMngSupplyByUser,
  handleDeleteMngSupply,
} from '../services/mng.supply.services';
import { DecodedToken } from '../types/req.type';
import { SuppliesModel } from '../models/supply.model';

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
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newProduct.id,
      supplyDetails: productData,
      amount: newProduct.amount,
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
