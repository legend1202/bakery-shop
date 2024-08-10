import {
  Document,
  FilterQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { ProductsModel } from '../models/product.model';
import { MngProducts, MngProductsModel } from '../models/mng.product.model';
import { BranchesModel } from '../models/branch.model';
import { UsersModel } from '../models/user.model';

export const handleMngProductCreation = async (
  product: Partial<MngProducts> & Document,
  userId?: string,
  session?: ClientSession
): Promise<MngProducts> => {
  const { branchId, productId, quantity, bio } = product;

  if (!userId) throw new RequestError('User must be registered', 400);
  if (!productId) throw new RequestError('Proudct name must not be empty', 400);
  if (!quantity) throw new RequestError('Price must not be empty', 400);

  const newproduct = await createNewMngProduct(
    productId,
    branchId,
    userId,
    quantity,
    bio,
    session
  );

  return newproduct;
};

export const createNewMngProduct = async (
  productId: string,
  branchId?: string,
  userId?: string,
  quantity?: number,
  bio?: string,
  session?: ClientSession
): Promise<MngProducts> => {
  if (branchId) {
    const newProduct = new MngProductsModel({
      productId,
      branchId,
      userId,
      quantity,
      status: false,
      bio,
    });

    await newProduct.save({ session });
    return newProduct;
  } else {
    const userData = await UsersModel.findOne({ id: userId });
    const newProduct = new MngProductsModel({
      productId,
      branchId: userData?.branchId,
      userId,
      quantity,
      status: false,
      bio,
    });

    await newProduct.save({ session });
    return newProduct;
  }
};

export const handleGetMngProductsByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<MngProducts[]> => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await MngProductsModel.aggregate([
      {
        $match: { userId: userId },
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
};

export const handleGetMngProducts = async (
  session?: ClientSession
): Promise<MngProducts[]> => {
  const products = await MngProductsModel.aggregate([
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
};

export const handleDeleteMngProduct = async (
  id: string,
  options?: QueryOptions<MngProducts>
) => {
  const product = await findOneMngProduct({ id });
  if (product?.status) {
    throw new RequestError('This Order could not be deleted', 400);
  } else {
    return await MngProductsModel.deleteOne({ id: id });
  }
};

export async function findOneMngProduct(
  filter?: FilterQuery<MngProducts>,
  projection?: ProjectionType<MngProducts>,
  options?: QueryOptions<MngProducts>
): Promise<MngProducts | null> {
  return await MngProductsModel.findOne(filter, projection, options);
}
