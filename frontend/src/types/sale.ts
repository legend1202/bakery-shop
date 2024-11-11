import { IBranch } from './branch';
import { IUserItem } from './user';
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
  branchId?: string;
  branchDetails?: IBranch;
  userDetails?: IUserItem;
  products: ISubProduct[];
  total: number;
  totalItems: number;
  createdAt?: string;
};

export type ISubProduct = {
  productId: string;
  quantity: number;
  price: number;
};
