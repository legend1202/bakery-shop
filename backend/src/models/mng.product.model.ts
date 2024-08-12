import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface MngProducts extends Document {
  id: string;
  productId: string;
  branchId: string;
  userId: string;
  quantity: number;
  status: boolean; // true: confirmed,  false: created or pending.
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
    status: { type: Boolean },
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
