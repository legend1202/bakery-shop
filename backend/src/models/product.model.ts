import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Products extends Document {
  id: string;
  /* branchId: string; */
  imageUrls: string[];
  userId?: string;
  name: string;
  price?: number | 0;
  code?: string;
  size?: string;
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
    /* branchId: {
      type: String,
    }, */
    imageUrls: {
      type: [String],
    },
    userId: {
      type: String,
    },
    name: { type: String },
    code: { type: String },
    size: { type: String },
    price: { type: Number },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ProductsModel = model<Products>('Products', ProductsSchema);
