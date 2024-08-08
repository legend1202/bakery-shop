import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface MngSupplies extends Document {
  id: string;
  supplyId: string;
  branchId: string;
  amount: number;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const MngSuppliesSchema = new Schema<MngSupplies>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    supplyId: {
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

export const MngSuppiesModel = model<MngSupplies>(
  'MngSupplies',
  MngSuppliesSchema
);
