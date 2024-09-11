import { IBranch } from './branch';
import { IUserItem } from './user';

export type IAttendance = {
  id?: string;
  userId?: string;
  bio?: string;
  createdAt?: string;
};

export type ITAttendance = {
  id: string;
  userId: string;
  userDetails: IUserItem;
  branchDetails: IBranch;
  createdAt: string;
  updatedAt: string;
};

export type ResultItem = {
  userId: string;
  count: number;
  userName: string;
  branchName: string;
};
