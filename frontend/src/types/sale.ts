import { IProduct } from './product';

export type ISale = {
  id?: string;
  productId: string;
  productDetails?: IProduct;
  quantity: number;
  price: number;
  bio?: string;
};
