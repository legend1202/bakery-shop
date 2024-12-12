import { IBranch } from './branch';

export type IOrder = {
  id?: string;
  salesDate?: string;

  packageFirm?: boolean;

  deliverMethod?: boolean; // Pickup / Deliver

  pickupStatus?: boolean;
  pickupDate?: string;

  deliverId?: string;
  deliverDate?: string;

  branchId?: string;

  customerName?: string;
  cellPhone?: string;
  homePhone?: string;
  address?: string;

  floor?: string;
  base?: string;
  people?: string;
  place?: string;
  wafer?: string;
  figure?: string;

  // color
  bottom?: string;
  border?: string;
  details?: string;
  ribbon?: string;
  sabor1?: string;
  sabor2?: string;

  artificial?: string;
  natural?: string;
  color?: string;
  doll?: string;
  candle?: string;

  cake?: string;
  cakebundle?: string;
  basebundle?: string;
  dollOrCandle?: string;

  total?: string;
  status?: number;

  branchDetails?: IBranch;

  createdAt?: Date;
  updatedAt?: Date;
};
