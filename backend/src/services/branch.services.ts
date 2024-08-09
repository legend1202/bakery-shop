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

  const newBranch = await createNewBranch(name, location, bio, userId, session);

  return newBranch;
};

export const handleGetBranches = async (
  userId?: string,
  session?: ClientSession
): Promise<Branches[]> => {
  const branches = await BranchesModel.find({ userId });

  return branches;
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
  userId?: string,
  session?: ClientSession
): Promise<Branches> => {
  const newBranch = new BranchesModel({
    name,
    location,
    bio,
    userId,
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
