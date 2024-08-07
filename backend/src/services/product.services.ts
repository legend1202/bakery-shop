import { Document } from 'mongoose';
import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import { Branches, BranchesModel } from '../models/branch.model';
import { Products, ProductsModel } from '../models/product.model';
import { UsersModel } from '../models/user.model';
import { findOneUser } from './user.services';

export const handleProductCreation = async (
  product: Partial<Products> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Products> => {
  const { name, price, bio } = product;

  if (!name) throw new RequestError('Proudct name must not be empty', 400);
  if (!price) throw new RequestError('Price must not be empty', 400);

  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const existingBranch = await findOneProduct({ name, branchId, price });

    if (existingBranch) {
      throw new RequestError(
        `Can't register this branch. this branch has already created.`,
        500
      );
    } else {
      const newBranch = await createNewProduct(
        branchId,
        name,
        price,
        bio,
        session
      );

      return newBranch;
    }
  }
};

export const handleGetProductsByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Products[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await ProductsModel.find({ branchId });

    return products;
  }
};

export const handleGetProducts = async (
  session?: ClientSession
): Promise<Products[]> => {
  const products = await ProductsModel.aggregate([
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
  branchId: string,
  name: string,
  price: number,
  bio?: string,
  session?: ClientSession
): Promise<Products> => {
  const newProduct = new ProductsModel({
    branchId,
    name,
    price,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
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
