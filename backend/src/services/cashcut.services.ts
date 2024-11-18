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

export const handleGetCashcut = async (saleDate: string): Promise<any> => {
  const results = await SalesModel.aggregate([
    {
      // Match sales records by saleDate only
      $match: {
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            saleDate,
          ],
        },
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
      // Lookup to join with cashcut data based on branchId and saleDate
      $lookup: {
        from: CashcutModel.collection.name,
        localField: 'branchId',
        foreignField: 'branchId',
        pipeline: [
          {
            $match: {
              saleDate: saleDate,
            },
          },
        ],
        as: 'cashcutData',
      },
    },
    {
      // Unwind the cashcutData array to handle cases with or without cashcut data
      $unwind: {
        path: '$cashcutData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      // Group sales by branchId to calculate total items and total price for each branch
      $group: {
        _id: '$branchId',
        totalSales: { $sum: '$total' },
        totalItemsSold: { $sum: '$totalItems' },
        products: { $push: '$products' },
        branchDetails: { $push: '$branchDetails' },
        cashcutData: { $push: '$cashcutData' },
      },
    },
  ]);

  return results;
};

export const handleGetTotalCashcut = async (): Promise<any> => {
  const result = await CashcutModel.aggregate([
    // Group cashcuts by date
    {
      $group: {
        _id: '$saleDate',
        totalCashcut: { $sum: '$total' },
      },
    },
    // Perform a lookup on Sales
    {
      $lookup: {
        from: 'sales', // Sales collection name
        let: { date: '$_id' },
        pipeline: [
          {
            $addFields: {
              formattedDate: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
            },
          },
          {
            $match: {
              $expr: { $eq: ['$formattedDate', '$$date'] },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: '$total' },
            },
          },
        ],
        as: 'salesData',
      },
    },
    // Unwind salesData to merge it properly
    {
      $unwind: {
        path: '$salesData',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Add totalSales to the result
    {
      $project: {
        saleDate: '$_id',
        totalCashcut: 1,
        totalSales: { $ifNull: ['$salesData.totalSales', 0] },
      },
    },
  ]);
  return result;
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
