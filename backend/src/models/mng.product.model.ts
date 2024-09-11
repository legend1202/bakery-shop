import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface MngProducts extends Document {
  id: string;
  productId: string;
  branchId: string;
  userId: string;
  quantity: number;
  price?: number;
  address?: string;
  deliverDate?: string;
  customOrderFlag: false;
  status: 0; //0: pending 1: confirmed,  2: cancelled.
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const MngProductsSchema = new Schema<MngProducts>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    productId: {
      type: String,
    },
    branchId: {
      type: String,
    },
    userId: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    address: { type: String },
    deliverDate: { type: String },
    customOrderFlag: { type: Boolean },
    status: { type: Number },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const MngProductsModel = model<MngProducts>(
  'MngProducts',
  MngProductsSchema
);
