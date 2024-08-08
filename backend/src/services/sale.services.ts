import { Document } from 'mongoose';
import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { Branches } from '../models/branch.model';
import { Sales, SalesModel } from '../models/sale.model';
import { Products, ProductsModel } from '../models/product.model';

export const handleGetSaleByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Sales[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const sales = await SalesModel.aggregate([
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

    return sales;
  }
};

export const handleSaleCreation = async (
  sales: Partial<Sales> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Sales> => {
  const { productId, quantity, price, bio } = sales;

  if (!userId) throw new RequestError('Proudct name must not be empty', 400);
  if (!productId) throw new RequestError('Proudct name must not be empty', 400);
  if (!quantity) throw new RequestError('Price must not be empty', 400);

  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const newSale = await createNewSale(
      branchId,
      productId,
      userId,
      quantity,
      price,
      bio,
      session
    );

    return newSale;
  }
};

export async function findOneProduct(
  filter?: FilterQuery<Products>,
  projection?: ProjectionType<Products>,
  options?: QueryOptions<Products>
): Promise<Products | null> {
  return await ProductsModel.findOne(filter, projection, options);
}

export const createNewSale = async (
  branchId: string,
  productId: string,
  userId: string,
  quantity: number,
  price?: number,
  bio?: string,
  session?: ClientSession
): Promise<Sales> => {
  const newProduct = new SalesModel({
    userId,
    productId,
    branchId,
    quantity,
    price,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
};

export const handleDeleteSale = async (
  id: string,
  options?: QueryOptions<Sales>
) => {
  return await SalesModel.deleteOne({ id: id });
};

export const findByIdAndUpdateProductDocument = async (
  id: string,
  update: UpdateQuery<Branches>,
  options?: QueryOptions<Products>
) => {
  return await ProductsModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
