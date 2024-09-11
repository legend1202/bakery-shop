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
      customOrderFlag: false,
      status: 0,
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
      customOrderFlag: false,
      status: 0,
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
    const userData = await UsersModel.findOne({ id: userId });
    if (userData?.role === 'SALESPERSON') {
      const products = await MngProductsModel.aggregate([
        {
          $match: { userId: userId, customOrderFlag: false },
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
    } else if (userData?.role === 'ADMIN') {
      const branches = await BranchesModel.find({ userId }, 'id');
      const branchIds = await branches.map((branch) => branch.id);

      const products = await MngProductsModel.aggregate([
        {
          $match: { branchId: { $in: branchIds }, customOrderFlag: false },
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
    } else {
      const products = await MngProductsModel.aggregate([
        {
          $match: { customOrderFlag: false },
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

export const handleGetMngProducts = async (
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
    if (userData?.role === 'SALESPERSON') {
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
    } else if (userData?.role === 'ADMIN') {
      const branches = await BranchesModel.find({ userId }, 'id');
      const branchIds = await branches.map((branch) => branch.id);

      const products = await MngProductsModel.aggregate([
        {
          $match: { branchId: { $in: branchIds } },
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
    } else {
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
    }
  }
};

export const handleDeleteMngProduct = async (
  id: string,
  options?: QueryOptions<MngProducts>
) => {
  if (!id) throw new RequestError('User Id must not be empty', 400);

  const updatedUser = await findByIdAndUpdateProductDocument(id, {
    status: 2,
  });

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneMngProduct(
  filter?: FilterQuery<MngProducts>,
  projection?: ProjectionType<MngProducts>,
  options?: QueryOptions<MngProducts>
): Promise<MngProducts | null> {
  return await MngProductsModel.findOne(filter, projection, options);
}

export const handleProductOrderConfirm = async (
  product: Partial<MngProducts> & Document,
  session?: ClientSession
): Promise<MngProducts> => {
  const { id } = product;

  if (!id) throw new RequestError('User Id must not be empty', 400);

  const updatedUser = await findByIdAndUpdateProductDocument(id, {
    status: 1,
  });

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export const findByIdAndUpdateProductDocument = async (
  id: string,
  update: UpdateQuery<MngProducts>,
  options?: QueryOptions<MngProducts>
) => {
  return await MngProductsModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
