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
  const { name } = product;

  if (!userId) throw new RequestError('Creator name must not be empty', 400);
  if (!name) throw new RequestError('Proudct name must not be empty', 400);

  const newProduct = await createNewProduct(product, userId, session);

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
  /* const existingUser = await UsersModel.findOne({ id: userId }); */

  /* if (existingUser?.role === 'ADMIN') {
   */
  const products = await ProductsModel.find();

  return products;
  /* } else {
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
  } */
};

export const handleUpdateProducts = async (
  product: Partial<Products> & Document,
  session?: ClientSession
): Promise<Products> => {
  const { id, name, price, bio } = product;

  if (!id) throw new RequestError('Branch Id must not be empty', 400);
  if (!name) throw new RequestError('Branch name must not be empty', 400);
  if (!price) throw new RequestError('Branch location must not be empty', 400);

  const updatedBranch = await findByIdAndUpdateProductDocument(id, {
    ...product,
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
  product: Partial<Products> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Products> => {
  /* const { branchId } = product;

  if (branchId) {
    const newProduct = new ProductsModel({
      userId,
      ...product,
    });

    await newProduct.save({ session });
    return newProduct;
  } else { */
  /* const userData = await UsersModel.findOne({ id: userId }); */

  const newProduct = new ProductsModel({
    ...product,
    userId,
    /* branchId: userData?.branchId, */
  });

  await newProduct.save({ session });
  return newProduct;
  /* } */
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
