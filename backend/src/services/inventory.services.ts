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
import { MngSuppiesModel } from '../models/mng.supply.model';

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

export const handleGetInventoryOfProduct = async (
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
    if (userData?.role === 'SUPERADMIN') {
      const result = await MngProductsModel.aggregate([
        {
          // Match only documents with status = 1 (confirmed)
          $match: { status: 1 },
        },
        {
          $group: {
            _id: '$productId', // Group by productId
            totalQuantity: { $sum: '$quantity' }, // Sum quantity for each productId
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
            id: '$_id', // Exclude _id field from the output
            productId: '$_id', // Rename _id to productId
            totalQuantity: 1, // Include totalQuantity in the output
            'productDetails.name': 1, // Include product name
            'productDetails.price': 1, // Include product price
            'productDetails.code': 1, // Include product price
            'productDetails.size': 1, // Include product price
          },
        },
      ]);
      return result;
    } else {
      const result = await MngProductsModel.aggregate([
        {
          // Match only documents with status = 1 (confirmed)
          $match: { status: 1, branchId: userData?.branchId },
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
              $multiply: [
                { $add: ['$mngTotalQuantity', '$salesQuantity'] },
                -1,
              ],
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
          },
        },
      ]);
      return result;
    }
  }
};

export const handleGetInventoryOfSupply = async (
  userId?: string,
  session?: ClientSession
) => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const result = await MngSuppiesModel.aggregate([
      {
        // Match only documents with status = true
        $match: { status: true },
      },
      {
        $group: {
          _id: '$supplyId', // Group by supplyId
          totalQuantity: { $sum: '$quantity' }, // Sum quantity for each supplyId
          latestOrder: {
            $max: {
              $cond: [
                { $gt: ['$quantity', 0] }, // Check if quantity > 0
                '$$ROOT', // Return the whole document
                null,
              ],
            },
          },
          latestUsed: {
            $max: {
              $cond: [
                { $lt: ['$quantity', 0] }, // Check if quantity < 0
                '$$ROOT', // Return the whole document
                null,
              ],
            },
          },
        },
      },
      {
        // Lookup product details from SuppliesModel
        $lookup: {
          from: 'supplies', // The collection name for SuppliesModel
          localField: '_id', // _id contains the supplyId
          foreignField: 'id', // 'id' field in SuppliesModel
          as: 'supplyDetails',
        },
      },
      {
        // Unwind supplyDetails array to get individual product objects
        $unwind: '$supplyDetails',
      },
      {
        $project: {
          id: '$_id', // Exclude _id field from the output
          supplyId: '$_id', // Rename _id to supplyId
          totalQuantity: 1, // Include totalQuantity in the output
          'supplyDetails.name': 1, // Include supply name
          'supplyDetails.price': 1, // Include supply price
          'supplyDetails.code': 1, // Include supply code
          'supplyDetails.size': 1, // Include supply size
          latestOrder: 1, // Include latest order record
          latestUsed: 1, // Include latest used record
        },
      },
    ]);
    return result;
  }
};
