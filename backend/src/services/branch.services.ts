import { Document } from 'mongoose';
import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Branches, BranchesModel } from '../models/branch.model';
import { UsersModel } from '../models/user.model';
import { MngProductsModel } from '../models/mng.product.model';

export const handleBranchCreation = async (
  branch: Partial<Branches> & Document,
  userId: string,
  session?: ClientSession
): Promise<Branches> => {
  const { name, location, bio } = branch;

  if (!name) throw new RequestError('Branch name must not be empty', 400);
  if (!location) throw new RequestError('Location must not be empty', 400);

  const existingBranch = await findOneBranch({ name, location });

  if (existingBranch) {
    throw new RequestError(
      `Can't register this branch. this branch has already created.`,
      500
    );
  }

  const newBranch = await createNewBranch(name, location, bio, session);

  return newBranch;
};

export const handleGetBranches = async (
  userId?: string,
  session?: ClientSession
): Promise<Branches[]> => {
  const userData = await UsersModel.findOne({ id: userId });
  if (userData?.role === 'ADMIN') {
    const branches = await BranchesModel.find({ userId });
    return branches;
  } else {
    const branches = await BranchesModel.find();
    return branches;
  }
};

export const handleGetDetail = async (branchId?: string) => {
  const users = await UsersModel.aggregate([
    {
      $match: { branchId: branchId },
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

  const products = await MngProductsModel.aggregate([
    {
      // Match only documents with status = 1 (confirmed)
      $match: { status: 1, branchId: branchId },
    },
    {
      $group: {
        _id: '$productId', // Group by productId
        mngTotalQuantity: { $sum: '$quantity' }, // Sum quantity for each productId in MngProducts
      },
    },
    {
      // Lookup sales details from SalesModel to get quantities for each productId
      $lookup: {
        from: 'sales', // The collection name for SalesModel
        localField: '_id', // _id contains the productId
        foreignField: 'products.productId', // Match with productId in sales products array
        as: 'salesDetails',
      },
    },
    {
      // Unwind the salesDetails array to process each sale record individually
      $unwind: {
        path: '$salesDetails',
        preserveNullAndEmptyArrays: true, // Retain products without sales records
      },
    },
    {
      // Calculate the total quantity in sales for each product
      $addFields: {
        salesQuantity: {
          $sum: {
            $map: {
              input: '$salesDetails.products',
              as: 'saleProduct',
              in: {
                $cond: [
                  { $eq: ['$$saleProduct.productId', '$_id'] }, // Match specific productId
                  '$$saleProduct.quantity', // Use quantity from matched sale
                  0,
                ],
              },
            },
          },
        },
      },
    },
    {
      // Calculate the combined quantity by adding MngProducts and sales quantities and reversing the sign
      $addFields: {
        totalQuantity: {
          $multiply: [{ $add: ['$mngTotalQuantity', '$salesQuantity'] }, -1],
        },
      },
    },
    {
      // Lookup product details from ProductsModel
      $lookup: {
        from: 'products', // The collection name for ProductsModel
        localField: '_id', // _id contains the productId
        foreignField: 'id', // 'id' field in ProductsModel
        as: 'productDetails',
      },
    },
    {
      // Unwind productDetails array to get individual product objects
      $unwind: '$productDetails',
    },
    {
      $project: {
        id: '$_id', // Rename _id to productId
        productId: '$_id',
        totalQuantity: 1, // Include the calculated total quantity
        'productDetails.name': 1, // Include product name
        'productDetails.price': 1, // Include product price
        'productDetails.code': 1, // Include product price
        'productDetails.size': 1, // Include product price
      },
    },
  ]);

  return { users, products };
};

export const handleUpdateBranches = async (
  branch: Partial<Branches> & Document,
  session?: ClientSession
): Promise<Branches> => {
  const { id, name, location, bio } = branch;

  if (!id) throw new RequestError('Branch Id must not be empty', 400);
  if (!name) throw new RequestError('Branch name must not be empty', 400);
  if (!location)
    throw new RequestError('Branch location must not be empty', 400);

  const updatedBranch = await findByIdAndUpdateBranchDocument(id, {
    name: name,
    location: location,
    bio: bio,
  });

  if (updatedBranch) {
    return updatedBranch;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneBranch(
  filter?: FilterQuery<Branches>,
  projection?: ProjectionType<Branches>,
  options?: QueryOptions<Branches>
): Promise<Branches | null> {
  return await BranchesModel.findOne(filter, projection, options);
}

export const createNewBranch = async (
  name: string,
  location: string,
  bio?: string,
  session?: ClientSession
): Promise<Branches> => {
  const newBranch = new BranchesModel({
    name,
    location,
    bio,
  });

  await newBranch.save({ session });
  return newBranch;
};

export const handleDeleteBranch = async (
  id: string,
  options?: QueryOptions<Branches>
) => {
  return await BranchesModel.deleteOne({ id: id });
};

export const findByIdAndUpdateBranchDocument = async (
  id: string,
  update: UpdateQuery<Branches>,
  options?: QueryOptions<Branches>
) => {
  return await BranchesModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
