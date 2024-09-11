import { IBranch } from './branch';

export type IUploadUrlType = string[];

export type IImageType = File[];

export type IProduct = {
  id?: string;
  imageUrls?: string[];
  branchDetails?: IBranch;
  branchId?: string;
  name?: string;
  code?: string;
  size?: string;
  price?: number | 0;
  bio?: string;
};

export type IMProduct = {
  id: string;
  productId: string;
  branchId: string;
  branchDetails?: IBranch;
  productDetails?: IProduct;
  quantity: number;
  price: number | 0;
  address?: string;
  deliverDate?: string;
  bio?: string;
  status?: number;
  createdAt?: string;
};

export type IMTProduct = {
  branchId?: string;
  productId: string;
  branchDetails?: IBranch;
  productDetails?: IProduct;
  price?: number;
  quantity: number;
  bio?: string;
  createdAt?: string;
};
