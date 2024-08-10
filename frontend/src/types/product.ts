import { IBranch } from './branch';

export type IProduct = {
  id?: string;
  branchDetails?: IBranch;
  branchId?: string;
  name: string;
  price?: number;
  bio?: string;
};

export type IMProduct = {
  id: string;
  productId: string;
  branchId: string;
  branchDetails?: IBranch;
  productDetails?: IProduct;
  quantity: number;
  bio?: string;
  status?: string;
  createdAt?: string;
};

export type IMTProduct = {
  branchId?: string;
  productId: string;
  branchDetails?: IBranch;
  productDetails?: IProduct;
  quantity: number;
  bio?: string;
  createdAt?: string;
};
