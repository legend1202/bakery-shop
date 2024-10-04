import {
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Products, ProductsModel } from '../models/product.model';
import { MngProducts, MngProductsModel } from '../models/mng.product.model';
import { BranchesModel } from '../models/branch.model';
import { UsersModel } from '../models/user.model';

export const handleMngCustomerOrderCreation = async (
  product: Partial<MngProducts> & Document,
  userId?: string,
  session?: ClientSession
): Promise<MngProducts> => {
  const { branchId, productId, quantity, bio } = product;

  if (!userId) throw new RequestError('User must be registered', 400);
  if (!productId) throw new RequestError('Proudct name must not be empty', 400);
  if (!quantity) throw new RequestError('Price must not be empty', 400);

  const newproduct = await createNewMngCustomerOrder(product, userId, session);

  return newproduct;
};

export const createNewMngCustomerOrder = async (
  product: any,
  userId: string,
  session?: ClientSession
): Promise<MngProducts> => {
  /* if (product.branchId) {
    const newProduct = new MngProductsModel({
      ...product,
      status: 0,
      customOrderFlag: true,
    });

    await newProduct.save({ session });
    return newProduct;
  } else { */
  const userData = await UsersModel.findOne({ id: userId });
  const newProduct = new MngProductsModel({
    ...product,
    userId,
    branchId: userData?.branchId,
    status: 0,
    customOrderFlag: true,
  });

  await newProduct.save({ session });
  return newProduct;
  /* } */
};

export const handleGetMngCustomerOrderByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<MngProducts[]> => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const userData = await UsersModel.findOne({ id: userId });

    if (userData?.role === 'ADMIN') {
      const products = await MngProductsModel.aggregate([
        {
          $match: { branchId: userData.branchId, customOrderFlag: true },
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
      return products;
      /* } else if (userData?.role === 'ADMIN') {
      const branches = await BranchesModel.find({ userId }, 'id');
      const branchIds = await branches.map((branch) => branch.id);

      const products = await MngProductsModel.aggregate([
        {
          $match: { branchId: { $in: branchIds }, customOrderFlag: true },
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

      return products; */
    } else {
      const products = await MngProductsModel.aggregate([
        {
          $match: { customOrderFlag: true },
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
      return products;
    }
  }
};

export async function findOneMngProduct(
  filter?: FilterQuery<MngProducts>,
  projection?: ProjectionType<MngProducts>,
  options?: QueryOptions<MngProducts>
): Promise<MngProducts | null> {
  return await MngProductsModel.findOne(filter, projection, options);
}
