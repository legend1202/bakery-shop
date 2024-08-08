import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleDeleteSale,
  handleSaleCreation,
  handleGetSaleByUser,
} from '../services/sale.services';

import { DecodedToken } from '../types/req.type';

import { ProductsModel } from '../models/product.model';

export const getSaleByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const sales = await handleGetSaleByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      sales,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const createSale = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { sales } = req.body;
    const newSale = await handleSaleCreation(sales, req.userId, session);
    const prductData = await ProductsModel.findOne({
      id: newSale.productId,
    });
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newSale.id,
      productDetails: prductData,
      quantity: newSale.quantity,
      price: newSale.price,
      bio: newSale.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    await handleDeleteSale(product.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: product.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
