import { IBranch } from './branch';
import { ISubProduct } from './sale';

export type ICashcut = {
  id?: string;
  branchId?: string;
  total?: number | string;
  saleDate?: string;
};

export type ICashcutData = {
  _id: string;
  branchId: string;
  branchDetails: IBranch[];
  products: ISubProduct[];
  totalItemsSold: number;
  totalSales: number;
  cashcutData: ICashcut[];
};

export type ICashcutList = {
  id: string;
  saleDate: string;
  cashcutTotal: number;
  salesTotal: number;
};
