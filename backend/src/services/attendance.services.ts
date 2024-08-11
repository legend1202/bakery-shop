import { Document, QueryOptions } from 'mongoose';
import { ClientSession } from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Attendances, AttendancesModel } from '../models/attendance.model';
import { BranchesModel } from '../models/branch.model';
import { UsersModel } from '../models/user.model';

export const handleAttendanceCreation = async (
  product: Partial<Attendances> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Attendances> => {
  const { bio } = product;

  if (!userId) throw new RequestError('Branch name must not be empty', 400);

  const newAttendance = await createNewAttendance(userId, bio, session);

  return newAttendance;
};

export const createNewAttendance = async (
  userId: string,
  bio?: string,
  session?: ClientSession
): Promise<Attendances> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (branchId) {
    const newProduct = new AttendancesModel({
      userId,
      branchId,
      bio,
    });

    await newProduct.save({ session });
    return newProduct;
  } else {
    throw new RequestError(`There is not ${userId} user.`, 500);
  }
};

export const handleAttendanceByUser = async (
  userId?: string,
  session?: ClientSession
): Promise<Attendances[]> => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const products = await AttendancesModel.find({ userId });
    return products;
  }
};

export const handleAttendance = async (
  userId?: string,
  session?: ClientSession
): Promise<Attendances[]> => {
  if (!userId) {
    throw new RequestError(
      `Can't register this branch. this branch is not existed.`,
      500
    );
  } else {
    const branches = await BranchesModel.find({ userId }, 'id');
    const branchIds = await branches.map((branch) => branch.id);

    const results = await AttendancesModel.aggregate([
      {
        $match: { branchId: { $in: branchIds } },
      },
      {
        $lookup: {
          from: UsersModel.collection.name,
          localField: 'userId',
          foreignField: 'id',
          as: 'userDetails',
        },
      },

      { $unwind: '$userDetails' },
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

    return results;
  }
};

export const handleDeleteAttendance = async (
  id: string,
  options?: QueryOptions<Attendances>
) => {
  return await AttendancesModel.deleteOne({ id: id });
};
