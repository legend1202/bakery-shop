import { Document } from 'mongoose';
import {
  UpdateQuery,
  FilterQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { Branches, BranchesModel } from '../models/branch.model';
import { Products, ProductsModel } from '../models/product.model';

export const handleProductCreation = async (
  product: Partial<Products> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Products> => {
  const { branchId, name, price, bio } = product;

  if (!userId) throw new RequestError('Creator name must not be empty', 400);
  if (!name) throw new RequestError('Proudct name must not be empty', 400);

  const newProduct = await createNewProduct(
    branchId,
    userId,
    name,
    price,
    bio,
    session
  );

  return newProduct;
};

export const handleGetProductsByUser = async (
  userId: string,
  session?: ClientSession
): Promise<Products[]> => {
  const products = await handleGetProducts(userId, session);

  return products;
};

export const handleGetProducts = async (
  userId?: string,
  session?: ClientSession
): Promise<Products[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  if (existingUser?.role === 'ADMIN') {
    const branches = await BranchesModel.find({ userId }, 'id');
    const branchIds = await branches.map((branch) => branch.id);

    const products = await ProductsModel.aggregate([
      /* {
        $match: { userId: userId },
      }, */
      {
        $match: { branchId: { $in: branchIds } },
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

    return products;
  } else {
    const products = await ProductsModel.aggregate([
      {
        $match: { branchId: existingUser?.branchId },
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

    return products;
  }
};

export const handleUpdateProducts = async (
  branch: Partial<Products> & Document,
  session?: ClientSession
): Promise<Products> => {
  const { id, name, price, bio } = branch;

  if (!id) throw new RequestError('Branch Id must not be empty', 400);
  if (!name) throw new RequestError('Branch name must not be empty', 400);
  if (!price) throw new RequestError('Branch location must not be empty', 400);

  const updatedBranch = await findByIdAndUpdateProductDocument(id, {
    name: name,
    price: price,
    bio: bio,
  });

  if (updatedBranch) {
    return updatedBranch;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneProduct(
  filter?: FilterQuery<Products>,
  projection?: ProjectionType<Products>,
  options?: QueryOptions<Products>
): Promise<Products | null> {
  return await ProductsModel.findOne(filter, projection, options);
}

export const createNewProduct = async (
  branchId?: string,
  userId?: string,
  name?: string,
  price?: number,
  bio?: string,
  session?: ClientSession
): Promise<Products> => {
  if (branchId) {
    const newProduct = new ProductsModel({
      branchId,
      userId,
      name,
      price,
      bio,
    });

    await newProduct.save({ session });
    return newProduct;
  } else {
    const userData = await UsersModel.findOne({ id: userId });
    const newProduct = new ProductsModel({
      branchId: userData?.branchId,
      userId,
      name,
      price,
      bio,
    });

    await newProduct.save({ session });
    return newProduct;
  }
};

export const handleDeleteProduct = async (
  id: string,
  options?: QueryOptions<Products>
) => {
  return await ProductsModel.deleteOne({ id: id });
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
