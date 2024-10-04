import { IBranch } from './branch';

export type ISupply = {
  id?: string;
  branchDetails?: IBranch;
  branchId?: string;
  name: string;
  price?: number;
  bio?: string;
};

export type IMSupply = {
  id: string;
  supplyId: string;
  branchId: string;
  branchDetails?: IBranch;
  supplyDetails?: ISupply;
  quantity: number;
  bio?: string;
  status?: number;
  createdAt?: string;
};

export type IMTSupply = {
  branchId?: string;
  supplyId: string;
  branchDetails?: IBranch;
  supplyDetails?: ISupply;
  quantity: number;
  bio?: string;
  createdAt?: string;
};

export type ITSupply = {
  totalQuantity: number;
  supplyDetails: ISupply;
  supplyId: string;
};
