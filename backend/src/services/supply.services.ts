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
import { updateSupply } from '../controllers/supply.controller';

export const handleSupplyCreation = async (
  supply: Partial<Supplies> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Supplies> => {
  const { id, name, price, bio } = supply;

  if (!name) throw new RequestError('Proudct name must not be empty', 400);

  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const existingBranch = await findOneSupply({ name, price });
    if (existingBranch) {
      throw new RequestError(
        `Can't register this supply. this supply has already created.`,
        500
      );
    } else {
      if (id) {
        const updatedSupply = await findByIdAndUpdateSupplyDocument(id, {
          name: name,
          price: price,
        });

        if (updatedSupply) {
          return updatedSupply;
        } else {
          throw new RequestError(`There is not ${id} user.`, 500);
        }
      } else {
        const newBranch = await createNewSupply(
          userId,
          name,
          price,
          bio,
          session
        );

        return newBranch;
      }
    }
  }
};

export const handleGetSupplies = async (
  userId?: string,
  session?: ClientSession
): Promise<Supplies[]> => {
  const products = await SuppliesModel.find();

  return products;
};

export const handleGetSupplyByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Supplies[]> => {
  const products = await SuppliesModel.find();

  return products;
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
  userId: string,
  /* branchId: string, */
  name: string,
  price?: number,
  bio?: string,
  session?: ClientSession
): Promise<Supplies> => {
  const newProduct = new SuppliesModel({
    userId,
    /* branchId, */
    name,
    price,
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
