import { sendResponse } from '../utils/response.utils';
import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import {
  handleMngProductCreation,
  handleGetMngProductsByUser,
  handleDeleteMngProduct,
} from '../services/mng.product.services';
import { DecodedToken } from '../types/req.type';
import { ProductsModel } from '../models/product.model';

export const mngcreateProduct = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    const newProduct = await handleMngProductCreation(
      product,
      req.userId,
      session
    );
    const productData = await ProductsModel.findOne({
      id: newProduct.productId,
    });
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newProduct.id,
      productDetails: productData,
      amount: newProduct.amount,
      bio: newProduct.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getMngProductsByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleGetMngProductsByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteMngProduct = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    await handleDeleteMngProduct(product.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: product.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
