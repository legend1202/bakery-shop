import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  ProjectionType,
} from 'mongoose';

import { RequestError, AuthenticationError } from '../utils/globalErrorHandler';

import { Roles } from '../utils/constants';
import { BranchesModel } from '../models/branch.model';
import { Users, UsersModel } from '../models/user.model';
import { createNewAttendance, createNewWorkOff } from './attendance.services';

export const handleUserCreation = async (
  user: Partial<Users> & Document,
  userId?: string,
  session?: ClientSession
): Promise<Users> => {
  const {
    email,
    password,
    firstName,
    lastName,
    branchId,
    role,
    bio,
    startTime,
    endTime,
    payment,
    color,
  } = user;

  if (!firstName) throw new RequestError('First Name must not be empty', 400);
  if (!lastName) throw new RequestError('Last Name must not be empty', 400);
  if (!email) throw new RequestError('Invalid fields', 400);
  if (!password) throw new RequestError('Password must not be empty', 400);
  if (!userId) throw new RequestError('General Admin must not be empty', 400);

  const existingUser = await findOneUser({ email });

  if (existingUser) {
    throw new RequestError(
      `Can't register this user. this email used by someone.`,
      500
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createNewUser(
    email,
    password,
    hashedPassword,
    firstName,
    lastName,
    branchId,
    userId,
    role,
    bio,
    startTime,
    endTime,
    payment,
    color,
    session
  );

  return newUser;
};

export const handleUserLogin = async (
  user: Partial<Users> & Document,
  session?: ClientSession
): Promise<any> => {
  const { email, password } = user;

  if (!email) throw new RequestError('Invalid fields', 400);
  if (!password) throw new RequestError('Password must not be empty', 400);

  const existingUser = await findOneUser({ email }, { _id: 0, __v: 0 });
  if (existingUser) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new AuthenticationError(`Password didn't match.`);
    }

    if (existingUser?.role && Roles.includes(existingUser?.role)) {
      const userId = existingUser.id;
      const secretKey: string = process.env.JWT_SECRET_KEY || '';
      const token = jwt.sign(
        {
          userId,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
          email: existingUser.email,
          branchId: existingUser.branchId,
        },
        secretKey,
        {
          expiresIn: '10h',
        }
      );

      await findByIdAndUpdateUserDocument(userId, {
        loginStatus: true,
      });

      if (existingUser.role !== 'SUPERADMIN') {
        await createNewAttendance(userId, session);
      }

      return {
        token,
        userId,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
        branchId: existingUser.branchId ? existingUser.branchId : '',
      };
    } else {
      throw new AuthenticationError(`You didn't approved by admin.`);
    }
  } else {
    throw new AuthenticationError(`Authentication error.`);
  }
};

export const handleUserLogout = async (
  userId?: string,
  session?: ClientSession
) => {
  const existingUser = await findOneUser({ id: userId }, { _id: 0, __v: 0 });
  if (userId && existingUser?.role !== 'SUPERADMIN') {
    const user = await findByIdAndUpdateUserDocument(userId, {
      loginStatus: false,
    });
    await createNewWorkOff(userId, session);
    return user;
  }
  if (userId && existingUser?.role === 'SUPERADMIN') {
    return existingUser;
  } else {
    throw new AuthenticationError(`Authentication error.`);
  }
};

export const handleGetUsers = async (
  userId?: string,
  session?: ClientSession
): Promise<Users[]> => {
  const userData = await UsersModel.findOne({ id: userId });

  if (userData?.role === 'SUPERADMIN') {
    const users = await UsersModel.aggregate([
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
    return users;
  } else {
    const users = await UsersModel.aggregate([
      {
        $match: { branchId: userData?.branchId, role: 'SALESPERSON' },
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
    return users;
  }
};

export const handleAssignRole = async (
  user: Partial<Users> & Document,
  session?: ClientSession
): Promise<Users> => {
  const { id, role } = user;

  if (!id) throw new RequestError('User Id must not be empty', 400);
  if (!role) throw new RequestError('Role must not be empty', 400);
  if (!Roles.includes(role)) {
    throw new RequestError(
      `User Role must be include one of "ADMIN", "SALESPERSON".`,
      400
    );
  }

  const updatedUser = await findByIdAndUpdateUserDocument(id, {
    role: role,
  });

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneUser(
  filter?: FilterQuery<Users>,
  projection?: ProjectionType<Users>,
  options?: QueryOptions<Users>
): Promise<Users | null> {
  return await UsersModel.findOne(filter, projection, options);
}

export const createNewUser = async (
  email: string,
  passwordStr: string,
  password: string,
  firstName: string,
  lastName: string,
  branchId?: string,
  userId?: string,
  role?: string,
  bio?: string,
  startTime?: string,
  endTime?: string,
  payment?: string,
  color?: string,
  session?: ClientSession
): Promise<Users> => {
  const userData = await UsersModel.findOne({ id: userId });

  if (userData?.role === 'SUPERADMIN') {
    const newUser = new UsersModel({
      email,
      passwordStr,
      password,
      firstName,
      lastName,
      branchId,
      userId,
      role,
      bio,
      startTime,
      endTime,
      payment,
      color,
    });

    await newUser.save({ session });
    return newUser;
  } else {
    const newUser = new UsersModel({
      email,
      passwordStr,
      password,
      firstName,
      lastName,
      branchId: userData?.branchId,
      role: 'SALESPERSON',
      bio,
      startTime,
      endTime,
      payment,
      color,
    });

    await newUser.save({ session });
    return newUser;
  }
};

export const handleUserDelete = async (
  id: string,
  options?: QueryOptions<Users>
) => {
  return await UsersModel.deleteOne({ id: id });
};

export const findByIdAndUpdateUserDocument = async (
  id: string,
  update: UpdateQuery<Users>,
  options?: QueryOptions<Users>
) => {
  return await UsersModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};
