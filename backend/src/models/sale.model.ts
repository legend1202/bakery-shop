import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Sales extends Document {
  id: string;
  userId: string;
  productId: string;
  branchId: string;
  quantity: number;
  price: number;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const SalesSchema = new Schema<Sales>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      ref: 'users',
    },
    productId: {
      type: String,
      ref: 'Products',
    },
    branchId: {
      type: String,
      ref: 'Branches',
    },
    price: {
      type: Number,
    },
    quantity: { type: Number },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SalesModel = model<Sales>('Sales', SalesSchema);
