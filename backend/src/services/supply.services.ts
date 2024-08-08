import { Document } from 'mongoose';
import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  ClientSession,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { BranchesModel } from '../models/branch.model';
import { Supplies, SuppliesModel } from '../models/supply.model';

export const handleSupplyCreation = async (
  product: Partial<Supplies> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Supplies> => {
  const { name, bio } = product;

  if (!name) throw new RequestError('Proudct name must not be empty', 400);

  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (!branchId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const existingBranch = await findOneSupply({ name, branchId });
    console.log(existingBranch);
    if (existingBranch) {
      throw new RequestError(
        `Can't register this supply. this supply has already created.`,
        500
      );
    } else {
      const newBranch = await createNewSupply(branchId, name, bio, session);

      return newBranch;
    }
  }
};

export const handleGetSupplies = async (
  session?: ClientSession
): Promise<Supplies[]> => {
  const products = await SuppliesModel.aggregate([
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

export const handleGetSupplyByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Supplies[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;
  if (!branchId) {
    throw new RequestError(
      `Can't get this supply. this branch is not existed.`,
      500
    );
  } else {
    const products = await SuppliesModel.find({ branchId });

    return products;
  }
};

export const handleUpdateSupply = async (
  branch: Partial<Supplies> & Document,
  session?: ClientSession
): Promise<Supplies> => {
  const { id, name, bio } = branch;

  if (!id) throw new RequestError('Branch Id must not be empty', 400);
  if (!name) throw new RequestError('Branch name must not be empty', 400);

  const updatedBranch = await findByIdAndUpdateSupplyDocument(id, {
    name: name,
    bio: bio,
  });

  if (updatedBranch) {
    return updatedBranch;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneSupply(
  filter?: FilterQuery<Supplies>,
  projection?: ProjectionType<Supplies>,
  options?: QueryOptions<Supplies>
): Promise<Supplies | null> {
  return await SuppliesModel.findOne(filter, projection, options);
}

export const createNewSupply = async (
  branchId: string,
  name: string,
  bio?: string,
  session?: ClientSession
): Promise<Supplies> => {
  const newProduct = new SuppliesModel({
    branchId,
    name,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
};

export const handleDeleteSupply = async (
  id: string,
  options?: QueryOptions<Supplies>
) => {
  return await SuppliesModel.deleteOne({ id: id });
};

export const findByIdAndUpdateSupplyDocument = async (
  id: string,
  update: UpdateQuery<Supplies>,
  options?: QueryOptions<Supplies>
) => {
  return await SuppliesModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
