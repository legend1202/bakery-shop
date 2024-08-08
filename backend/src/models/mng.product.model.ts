import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface MngProducts extends Document {
  id: string;
  productId: string;
  branchId: string;
  amount: number;
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
    amount: { type: Number },
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
