import { Document, QueryOptions } from 'mongoose';
import { ClientSession } from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { SuppliesModel } from '../models/supply.model';
import { MngSuppiesModel, MngSupplies } from '../models/mng.supply.model';

export const handleMngSupplyCreation = async (
  product: Partial<MngSupplies> & Document,
  userId?: string,
  session?: ClientSession
): Promise<MngSupplies> => {
  const { supplyId, amount, bio } = product;

  if (!supplyId) throw new RequestError('Proudct name must not be empty', 400);
  if (!amount) throw new RequestError('Price must not be empty', 400);

  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const newproduct = await createNewMngSupply(
      supplyId,
      branchId,
      amount,
      bio,
      session
    );

    return newproduct;
  }
};

export const createNewMngSupply = async (
  supplyId: string,
  branchId: string,
  amount: number,
  bio?: string,
  session?: ClientSession
): Promise<MngSupplies> => {
  const newProduct = new MngSuppiesModel({
    supplyId,
    branchId,
    amount,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
};

export const handleGetMngSupplyByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<MngSupplies[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await MngSuppiesModel.aggregate([
      {
        $match: { branchId: branchId },
      },
      {
        $lookup: {
          from: SuppliesModel.collection.name,
          localField: 'supplyId',
          foreignField: 'id',
          as: 'suppliesDetails',
        },
      },
      { $unwind: '$suppliesDetails' },
    ]);
    return products;
  }
};

export const handleDeleteMngSupply = async (
  id: string,
  options?: QueryOptions<MngSupplies>
) => {
  return await MngSuppiesModel.deleteOne({ id: id });
};
