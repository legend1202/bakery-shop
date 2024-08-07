import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Products extends Document {
  id: string;
  branchId: string;
  name: string;
  price: number;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const ProductsSchema = new Schema<Products>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    branchId: {
      type: String,
    },
    name: { type: String },
    price: { type: Number },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ProductsModel = model<Products>('Products', ProductsSchema);
