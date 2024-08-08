import { Document, QueryOptions } from 'mongoose';
import { ClientSession } from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { ProductsModel } from '../models/product.model';
import { MngProducts, MngProductsModel } from '../models/mng.product.model';

export const handleMngProductCreation = async (
  product: Partial<MngProducts> & Document,
  userId?: string,
  session?: ClientSession
): Promise<MngProducts> => {
  const { productId, amount, bio } = product;

  if (!productId) throw new RequestError('Proudct name must not be empty', 400);
  if (!amount) throw new RequestError('Price must not be empty', 400);

  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const newproduct = await createNewMngProduct(
      productId,
      branchId,
      amount,
      bio,
      session
    );

    return newproduct;
  }
};

export const createNewMngProduct = async (
  productId: string,
  branchId: string,
  amount: number,
  bio?: string,
  session?: ClientSession
): Promise<MngProducts> => {
  const newProduct = new MngProductsModel({
    productId,
    branchId,
    amount,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
};

export const handleGetMngProductsByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<MngProducts[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await MngProductsModel.aggregate([
      {
        $match: { branchId: branchId },
      },
      {
        $lookup: {
          from: ProductsModel.collection.name,
          localField: 'productId',
          foreignField: 'id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
    ]);
    return products;
  }
};

export const handleDeleteMngProduct = async (
  id: string,
  options?: QueryOptions<MngProducts>
) => {
  return await MngProductsModel.deleteOne({ id: id });
};
