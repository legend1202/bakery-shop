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
import { Branches, BranchesModel } from '../models/branch.model';
import { Sales, SalesModel } from '../models/sale.model';
import { Products, ProductsModel } from '../models/product.model';

export const handleGetSaleByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Sales[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  if (existingUser?.role === 'ADMIN') {
    const sales = await SalesModel.aggregate([
      {
        $match: { branchId: existingUser.branchId },
      },
      {
        $lookup: {
          from: BranchesModel.collection.name,
          localField: 'branchId',
          foreignField: 'id',
          as: 'branchDetails',
        },
      },
      { $unwind: '$branchDetails' },
      {
        $lookup: {
          from: UsersModel.collection.name,
          localField: 'userId',
          foreignField: 'id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
    ]);

    return sales;
  } else if (existingUser?.role === 'SALESPERSON') {
    const sales = await SalesModel.aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: BranchesModel.collection.name,
          localField: 'branchId',
          foreignField: 'id',
          as: 'branchDetails',
        },
      },
      { $unwind: '$branchDetails' },
    ]);

    return sales;
  } else {
    const sales = await SalesModel.aggregate([
      {
        $lookup: {
          from: BranchesModel.collection.name,
          localField: 'branchId',
          foreignField: 'id',
          as: 'branchDetails',
        },
      },
      { $unwind: '$branchDetails' },
      {
        $lookup: {
          from: UsersModel.collection.name,
          localField: 'userId',
          foreignField: 'id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
    ]);

    return sales;
  }
};

export const handleSaleCreation = async (
  products: Partial<Sales> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Sales> => {
  if (!userId) throw new RequestError('Proudct name must not be empty', 400);
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const newSale = await createNewSale(branchId, userId, products, session);

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
  userId: string,
  products: any,
  session?: ClientSession
): Promise<Sales> => {
  const newProduct = new SalesModel({
    userId,
    branchId,
    products: products.products,
    totalItems: products.totalItems,
    total: products.total,
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
