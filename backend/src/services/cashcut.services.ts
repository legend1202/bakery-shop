import { Document } from 'mongoose';
import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { UsersModel } from '../models/user.model';
import { Branches, BranchesModel } from '../models/branch.model';
import { Sales, SalesModel } from '../models/sale.model';
import { Products, ProductsModel } from '../models/product.model';
import { CashcutDocument, CashcutModel } from '../models/cashcut.model';
import { MngProductsModel } from '../models/mng.product.model';
import { OrdersModel } from '../models/order.model';

export const handleGetCashcut = async (saleDate: string): Promise<any> => {
  const resultOrder = await OrdersModel.aggregate([
    {
      $match: {
        status: 1,
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            saleDate,
          ],
        },
      },
    },
    {
      $project: {
        // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
        branchId: 1,
        total: 1, // Keep the price field
      },
    },
    {
      $lookup: {
        from: BranchesModel.collection.name,
        localField: 'branchId',
        foreignField: 'id',
        as: 'branchDetails',
      },
    },
    {
      $addFields: {
        branchDetails: {
          $ifNull: ['$branchDetails', []], // If branchDetails is null, set it to an empty array
        },
      },
    },
    {
      $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        // Group by the formatted date
        _id: '$branchId',
        totalOrder: { $sum: '$total' }, // Calculate the total price for each group
        branchDetails: { $push: '$branchDetails' },
      },
    },
    {
      $sort: {
        _id: 1, // Sort by date in ascending order
      },
    },
  ]);

  const resultSales = await SalesModel.aggregate([
    {
      $match: {
        status: true,
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            saleDate,
          ],
        },
      },
    },
    {
      $project: {
        // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
        branchId: 1,
        total: 1, // Keep the price field
      },
    },
    {
      $lookup: {
        from: BranchesModel.collection.name,
        localField: 'branchId',
        foreignField: 'id',
        as: 'branchDetails',
      },
    },
    {
      $addFields: {
        branchDetails: {
          $ifNull: ['$branchDetails', []], // If branchDetails is null, set it to an empty array
        },
      },
    },
    {
      $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        // Group by the formatted date
        _id: '$branchId',
        totalSale: { $sum: '$total' }, // Calculate the total price for each group
        branchDetails: { $push: '$branchDetails' },
      },
    },
    {
      $sort: {
        _id: 1, // Sort by date in ascending order
      },
    },
  ]);

  const mergedArray = resultOrder.map((item1) => {
    // Find matching item in array2
    const matchingItem = resultSales.find((item2) => item2._id === item1._id);

    if (matchingItem) {
      // Merge properties
      return {
        ...item1,
        totalSale: matchingItem.totalSale,
        branchDetails: matchingItem.branchDetails,
      };
    }

    return item1;
  });

  // Add remaining items from array2 that don't match in array1
  const finalArray = [
    ...mergedArray,
    ...resultSales.filter(
      (item2) => !resultOrder.some((item1) => item1._id === item2._id)
    ),
  ];
  return finalArray;
};

export const handleGetCashcutOfToday = async (
  saleDate: string
): Promise<any> => {
  const resultOrder = await OrdersModel.aggregate([
    {
      $match: {
        status: 1,
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            saleDate,
          ],
        },
      },
    },
    {
      $project: {
        // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
        branchId: 1,
        total: 1, // Keep the price field
      },
    },
    {
      $lookup: {
        from: BranchesModel.collection.name,
        localField: 'branchId',
        foreignField: 'id',
        as: 'branchDetails',
      },
    },
    {
      $addFields: {
        branchDetails: {
          $ifNull: ['$branchDetails', []], // If branchDetails is null, set it to an empty array
        },
      },
    },
    {
      $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        // Group by the formatted date
        _id: '$branchId',
        totalOrder: { $sum: '$total' }, // Calculate the total price for each group
        branchDetails: { $push: '$branchDetails' },
      },
    },
    {
      $sort: {
        _id: 1, // Sort by date in ascending order
      },
    },
  ]);

  const resultSales = await SalesModel.aggregate([
    {
      $match: {
        status: false,
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            saleDate,
          ],
        },
      },
    },
    {
      $project: {
        // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
        branchId: 1,
        total: 1, // Keep the price field
      },
    },
    {
      $lookup: {
        from: BranchesModel.collection.name,
        localField: 'branchId',
        foreignField: 'id',
        as: 'branchDetails',
      },
    },
    {
      $addFields: {
        branchDetails: {
          $ifNull: ['$branchDetails', []], // If branchDetails is null, set it to an empty array
        },
      },
    },
    {
      $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        // Group by the formatted date
        _id: '$branchId',
        totalSale: { $sum: '$total' }, // Calculate the total price for each group
        branchDetails: { $push: '$branchDetails' },
      },
    },
    {
      $sort: {
        _id: 1, // Sort by date in ascending order
      },
    },
  ]);

  const mergedArray = resultOrder.map((item1) => {
    // Find matching item in array2
    const matchingItem = resultSales.find((item2) => item2._id === item1._id);

    if (matchingItem) {
      // Merge properties
      return {
        ...item1,
        totalSale: matchingItem.totalSale,
        branchDetails: matchingItem.branchDetails,
      };
    }

    return item1;
  });

  // Add remaining items from array2 that don't match in array1
  const finalArray = [
    ...mergedArray,
    ...resultSales.filter(
      (item2) => !resultOrder.some((item1) => item1._id === item2._id)
    ),
  ];
  return finalArray;
};

export const handleGetTotalCashcut = async (): Promise<any> => {
  try {
    const resultOrder = await OrdersModel.aggregate([
      { $match: { status: 1 } },
      {
        $project: {
          // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: 1, // Keep the price field
        },
      },
      {
        $group: {
          // Group by the formatted date
          _id: '$date',
          totalOrder: { $sum: '$total' }, // Calculate the total price for each group
        },
      },
      {
        $sort: {
          _id: 1, // Sort by date in ascending order
        },
      },
    ]);

    const resultSales = await SalesModel.aggregate([
      { $match: { status: true } },
      {
        $project: {
          // Convert the 'createdAt' field to a date string with format 'YYYY-MM-DD'
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: 1, // Keep the price field
        },
      },
      {
        $group: {
          // Group by the formatted date
          _id: '$date',
          totalSale: { $sum: '$total' }, // Calculate the total price for each group
        },
      },
      {
        $sort: {
          _id: 1, // Sort by date in ascending order
        },
      },
    ]);

    const mergedArray = resultOrder.map((item1) => {
      // Find matching item in array2
      const matchingItem = resultSales.find((item2) => item2._id === item1._id);

      if (matchingItem) {
        // Merge properties
        return {
          ...item1,
          totalSale: matchingItem.totalSale,
        };
      }

      return item1;
    });

    // Add remaining items from array2 that don't match in array1
    const finalArray = [
      ...mergedArray,
      ...resultSales.filter(
        (item2) => !resultOrder.some((item1) => item1._id === item2._id)
      ),
    ];

    return finalArray;
  } catch (error) {
    console.error('Error fetching sales and product totals:', error);
    throw error;
  }
};
export const handleCashcutCreation = async (
  cashcut: Partial<CashcutDocument> & Document
): Promise<CashcutDocument> => {
  if (cashcut?.id) {
    const updatedCashcut = await findByIdAndUpdateCashcutDocument(cashcut.id, {
      branchId: cashcut.branchId,
      total: cashcut.total,
      saleDate: cashcut.saleDate,
    });

    if (updatedCashcut) {
      return updatedCashcut;
    } else {
      throw new RequestError(`There is not data.`, 500);
    }
  } else {
    const newCashcut = new CashcutModel({
      branchId: cashcut.branchId,
      total: cashcut.total,
      saleDate: cashcut.saleDate,
    });

    await newCashcut.save();
    return newCashcut;
  }
};

export async function findOneProduct(
  filter?: FilterQuery<Products>,
  projection?: ProjectionType<Products>,
  options?: QueryOptions<Products>
): Promise<Products | null> {
  return await ProductsModel.findOne(filter, projection, options);
}

export const findByIdAndUpdateCashcutDocument = async (
  id: string,
  update: UpdateQuery<CashcutDocument>,
  options?: QueryOptions<CashcutDocument>
) => {
  return await CashcutModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const handleGenerateCashcut = async (saleDate: string): Promise<any> => {
  try {
    // Update status to true where createdAt matches the target date

    const result = await SalesModel.updateMany(
      {
        $match: {
          status: false,
          $expr: {
            $eq: [
              { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              saleDate,
            ],
          },
        },
      },
      {
        $set: {
          status: true,
        },
      }
    );

    if (result?.acknowledged) {
      return result;
    } else {
      throw new RequestError(`There is no data.`, 500);
    }
  } catch (err) {
    console.error(err);
    throw new RequestError(`There is no data.`, 500);
  }
};
