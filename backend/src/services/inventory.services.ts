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
import { SalesModel } from '../models/sale.model';

export const handleGetInventoryOfBranchByUser = async (
  userId?: string,
  session?: ClientSession
) => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const userData = await UsersModel.findOne({ id: userId });
    if (userData?.role === 'SALESPERSON') {
      const orderedProuduct = await MngProductsModel.aggregate([
        {
          $match: {
            status: 1, // Match documents where status = 1
            branchId: userData.branchId, // Match documents with the specific branchId
            quantity: { $lt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const storedProuduct = await MngProductsModel.aggregate([
        {
          $match: {
            status: 1, // Match documents where status = 1
            branchId: userData.branchId, // Match documents with the specific branchId
            quantity: { $gt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const soldProuduct = await SalesModel.aggregate([
        {
          $match: {
            branchId: userData.branchId, // Match documents with the specific branchId
            quantity: { $gt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const totalInventoryOfBranch =
        (storedProuduct.length > 0 ? storedProuduct[0].totalQuantity : 0) +
        (orderedProuduct.length > 0 ? orderedProuduct[0].totalQuantity : 0) -
        (soldProuduct.length > 0 ? soldProuduct[0].totalQuantity : 0);

      return totalInventoryOfBranch; // Return the sum or 0 if no match
    } else if (userData?.role === 'ADMIN') {
      const branches = await BranchesModel.find({ userId }, 'id');
      const branchIds = await branches.map((branch) => branch.id);

      const orderedProuduct = await MngProductsModel.aggregate([
        {
          $match: {
            status: 1, // Match documents where status = 1
            branchId: { $in: branchIds },
            quantity: { $lt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const storedProuduct = await MngProductsModel.aggregate([
        {
          $match: {
            status: 1, // Match documents where status = 1
            branchId: { $in: branchIds },
            quantity: { $gt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const soldProuduct = await SalesModel.aggregate([
        {
          $match: {
            branchId: { $in: branchIds },
            quantity: { $gt: 0 }, // Only include documents where quantity is positive
          },
        },
        {
          $group: {
            _id: null, // No specific grouping, so use null
            totalQuantity: { $sum: '$quantity' }, // Sum the positive quantity field
          },
        },
      ]);

      const totalInventoryOfBranch =
        (storedProuduct.length > 0 ? storedProuduct[0].totalQuantity : 0) +
        (orderedProuduct.length > 0 ? orderedProuduct[0].totalQuantity : 0) -
        (soldProuduct.length > 0 ? soldProuduct[0].totalQuantity : 0);

      return totalInventoryOfBranch; // Return the sum or 0 if no match
    } else {
      return 0;
    }
  }
};
