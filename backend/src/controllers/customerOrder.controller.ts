import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import { DecodedToken } from '../types/req.type';

import { ProductsModel } from '../models/product.model';
import { BranchesModel } from '../models/branch.model';
import {
  handleMngCustomerOrderCreation,
  handleGetMngCustomerOrderByUser,
} from '../services/customerOrder.services';

export const mngcreateCustomerOrder = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    const newProduct = await handleMngCustomerOrderCreation(
      product,
      req.userId,
      session
    );
    const productData = await ProductsModel.findOne({
      id: newProduct.productId,
    });
    const branchData = await BranchesModel.findOne({
      id: newProduct.branchId,
    });
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newProduct.id,
      productDetails: productData,
      branchDetails: branchData,
      quantity: newProduct.quantity,
      status: newProduct.status,
      price: newProduct.price,
      address: newProduct.address,
      deliverDate: newProduct.deliverDate,
      bio: newProduct.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getMngCustomerOrderByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleGetMngCustomerOrderByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
