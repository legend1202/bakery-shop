import {
  Document,
  FilterQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { SuppliesModel } from '../models/supply.model';
import { MngSuppiesModel, MngSupplies } from '../models/mng.supply.model';
import { BranchesModel } from '../models/branch.model';

export const handleMngSupplyCreation = async (
  product: Partial<MngSupplies> & Document,
  userId?: string,
  session?: ClientSession
): Promise<MngSupplies> => {
  const { supplyId, branchId, quantity, bio } = product;

  if (!userId) throw new RequestError('User must not be empty', 400);
  if (!branchId) throw new RequestError('Branch name must not be empty', 400);
  if (!supplyId) throw new RequestError('Proudct name must not be empty', 400);
  if (!quantity) throw new RequestError('Price must not be empty', 400);

  const newproduct = await createNewMngSupply(
    supplyId,
    branchId,
    userId,
    quantity,
    bio,
    session
  );

  return newproduct;
};

export const createNewMngSupply = async (
  supplyId: string,
  branchId: string,
  userId: string,
  quantity: number,
  bio?: string,
  session?: ClientSession
): Promise<MngSupplies> => {
  const newProduct = new MngSuppiesModel({
    supplyId,
    branchId,
    userId,
    quantity,
    status: false,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
};

export const handleGetMngSupplyByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<MngSupplies[]> => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await MngSuppiesModel.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: SuppliesModel.collection.name,
          localField: 'supplyId',
          foreignField: 'id',
          as: 'supplyDetails',
        },
      },
      { $unwind: '$supplyDetails' },
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

export const handleDeleteMngSupply = async (
  id: string,
  options?: QueryOptions<MngSupplies>
) => {
  const product = await findOneMngSupply({ id });
  if (product?.status) {
    throw new RequestError('This Order could not be deleted', 400);
  } else {
    return await MngSuppiesModel.deleteOne({ id: id });
  }
};

export async function findOneMngSupply(
  filter?: FilterQuery<MngSupplies>,
  projection?: ProjectionType<MngSupplies>,
  options?: QueryOptions<MngSupplies>
): Promise<MngSupplies | null> {
  return await MngSuppiesModel.findOne(filter, projection, options);
}
