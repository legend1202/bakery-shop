import { IBranch } from './branch';

export type IProduct = {
  id?: string;
  branchDetails?: IBranch;
  branchId?: string;
  name: string;
  price: number;
  bio?: string;
};

export type IMProduct = {
  id?: string;
  productId: string;
  productDetails?: IProduct;
  amount: number;
  bio?: string;
};
