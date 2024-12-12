import { Document } from 'mongoose';
import {
  UpdateQuery,
  FilterQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Products } from '../models/product.model';
import { OrderDocument, OrdersModel } from '../models/order.model';
import { UsersModel } from '../models/user.model';
import { BranchesModel } from '../models/branch.model';

export const handleGetOrders = async (
  userId?: string,
  session?: ClientSession
): Promise<OrderDocument[]> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  if (existingUser?.role === 'SUPERADMIN') {
    const orders = await OrdersModel.aggregate([
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
    return orders;
  } else if (existingUser?.role === 'SALESPERSON') {
    const orders = await OrdersModel.aggregate([
      {
        $match: { userId },
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
    return orders;
  } else {
    throw new RequestError(`Can't find the pedidos`, 500);
  }
};

export const handleOrderCreation = async (
  orderData: Partial<OrderDocument> & Document,
  userId?: string,
  session?: ClientSession
): Promise<OrderDocument> => {
  if (!userId) throw new RequestError('Creator name must not be empty', 400);

  const newOrder = new OrdersModel({
    ...orderData,
    userId,
    /* branchId: userData?.branchId, */
  });

  await newOrder.save({ session });
  return newOrder;
};

export const handleDeleteOrder = async (
  id: string,
  options?: QueryOptions<OrderDocument>
) => {
  if (!id) throw new RequestError('User Id must not be empty', 400);

  const order = await findByIdAndUpdateOrderDocument(id, {
    status: 2,
  });

  if (order) {
    return order;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export const handleConfirmOrder = async (
  id: string,
  options?: QueryOptions<OrderDocument>
) => {
  if (!id) throw new RequestError('User Id must not be empty', 400);

  const order = await findByIdAndUpdateOrderDocument(id, {
    status: 1,
  });

  if (order) {
    return order;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export const findByIdAndUpdateOrderDocument = async (
  id: string,
  update: UpdateQuery<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) => {
  return await OrdersModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
