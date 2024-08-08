import { IBranch } from './branch';

export type ISupply = {
  id?: string;
  branchDetails?: IBranch;
  branchId?: string;
  name: string;
  bio?: string;
};

export type IMSupply = {
  id?: string;
  supplyId: string;
  supplytDetails?: ISupply;
  amount: number;
  bio?: string;
};
