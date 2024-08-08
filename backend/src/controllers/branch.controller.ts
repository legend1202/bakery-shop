import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleGetBranches,
  handleDeleteBranch,
  handleBranchCreation,
  handleUpdateBranches,
} from '../services/branch.services';

export const create = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { branch } = req.body;
    const newBranch = await handleBranchCreation(branch, session);
    return sendResponse(res, 201, 'Created Branch Successfully', {
      id: newBranch.id,
      name: newBranch.name,
      location: newBranch.location,
      bio: newBranch.bio,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getBranches = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const branches = await handleGetBranches(session);
    return sendResponse(res, 200, 'Get Branches', {
      branches,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { branch } = req.body;
    const updatedUser = await handleUpdateBranches(branch, session);
    return sendResponse(res, 201, 'Branch updated', {
      ...updatedUser,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { branch } = req.body;
    await handleDeleteBranch(branch.id, session);
    return sendResponse(res, 201, 'user deleted', {
      id: branch.id,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
