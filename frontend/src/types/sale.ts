import { IBranch } from './branch';
import { IProduct } from './product';

export type ISale = {
  id?: string;
  productId: string;
  branchId?: string;
  userId?: string;
  productDetails?: IProduct;
  branchDetails?: IBranch;
  quantity: number;
  price?: number;
  status?: boolean;
  bio?: string;
  createdAt?: string;
};

export type IMSale = {
  id: string;
  productId: string;
  branchId?: string;
  userId?: string;
  productDetails?: IProduct;
  branchDetails?: IBranch;
  quantity: number;
  price?: number;
  status?: boolean;
  bio?: string;
  createdAt?: string;
};
