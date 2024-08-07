import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Sales extends Document {
  id: string;
  salesperson: string;
  productId: string;
  description: string;
  quantity: number;
  saleDate: string;
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
    salesperson: {
      type: String,
      ref: 'Products',
    },
    productId: {
      type: String,
      ref: 'Products',
    },
    description: {
      type: String,
    },
    quantity: { type: Number },
    saleDate: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SalesModel = model<Sales>('Sales', SalesSchema);
