import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleGetProducts,
  handleDeleteProduct,
  handleUpdateProducts,
  handleProductCreation,
  handleGetProductsByUser,
} from '../services/product.services';

import { BranchesModel } from '../models/branch.model';

import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    const newProduct = await handleProductCreation(
      product,
      req.userId,
      session
    );
    const branchData = await BranchesModel.findOne({ id: newProduct.branchId });
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newProduct.id,
      branchDetails: branchData,
      name: newProduct.name,
      price: newProduct.price,
      bio: newProduct.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleGetProducts(session);
    return sendResponse(res, 200, 'Get Products', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getProductsByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const products = await handleGetProductsByUser(req.userId, session);
    return sendResponse(res, 200, 'Get Products', {
      products,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { branch } = req.body;
    const updatedUser = await handleUpdateProducts(branch, session);
    return sendResponse(res, 201, 'Branch updated', {
      ...updatedUser,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { product } = req.body;
    await handleDeleteProduct(product.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: product.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
