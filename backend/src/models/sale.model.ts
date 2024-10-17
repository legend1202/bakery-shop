import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  productId: string;
  quantity: number;
  price: number;
}

export interface Sales extends Document {
  id: string;
  userId: string;
  branchId: string;
  products: Product[];
  totalItems: number;
  total: number;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const ProductSchema = new Schema<Product>({
  productId: {
    type: String,
    ref: 'Products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

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
    branchId: {
      type: String,
      ref: 'Branches',
    },
    products: {
      type: [ProductSchema],
      required: true,
    },
    totalItems: { type: Number },
    total: { type: Number },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SalesModel = model<Sales>('Sales', SalesSchema);
