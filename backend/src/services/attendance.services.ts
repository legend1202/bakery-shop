import { Document, QueryOptions } from 'mongoose';
import { ClientSession } from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Attendances, AttendancesModel } from '../models/attendance.model';
import { BranchesModel } from '../models/branch.model';
import { UsersModel } from '../models/user.model';

export const handleAttendanceCreation = async (
  userId?: string,
  session?: ClientSession
): Promise<Attendances> => {
  if (!userId) throw new RequestError('Branch name must not be empty', 400);

  const newAttendance = await createNewAttendance(userId, session);

  return newAttendance;
};

export const createNewAttendance = async (
  userId: string,
  session?: ClientSession
): Promise<Attendances> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (branchId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of the day

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of the day

    // Check if there is already an attendance record for the user today
    const existingAttendance = await AttendancesModel.findOne({
      userId,
      branchId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingAttendance) {
      // If a record exists, do not save a new one
      return existingAttendance;
    } else {
      const newProduct = new AttendancesModel({
        userId,
        branchId,
        status: true,
      });

      await newProduct.save();
      return newProduct;
    }
  } else {
    throw new RequestError(`There is not ${userId} user.`, 500);
  }
};

export const createNewWorkOff = async (
  userId: string,
  session?: ClientSession
): Promise<Attendances> => {
  const existingUser = await UsersModel.findOne({ id: userId });

  const branchId = existingUser?.branchId;

  if (branchId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of the day

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of the day

    // Check if there is already an attendance record for the user today
    const existingAttendance = await AttendancesModel.findOne({
      userId,
      branchId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingAttendance) {
      existingAttendance.status = false;
      await existingAttendance.save();
      return existingAttendance;
    } else {
      const newProduct = new AttendancesModel({
        userId,
        branchId,
        status: false,
      });

      await newProduct.save();
      return newProduct;
    }
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
