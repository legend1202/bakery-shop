import { IBranch } from './branch';

export type ISupply = {
  id?: string;
  branchDetails?: IBranch;
  branchId?: string;
  name: string;
  bio?: string;
};
