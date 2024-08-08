import { Document, QueryOptions } from 'mongoose';
import { ClientSession } from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';

import { Attendances, AttendancesModel } from '../models/attendance.model';

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
  const newProduct = new AttendancesModel({
    userId,
    bio,
  });

  await newProduct.save({ session });
  return newProduct;
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

export const handleDeleteAttendance = async (
  id: string,
  options?: QueryOptions<Attendances>
) => {
  return await AttendancesModel.deleteOne({ id: id });
};
