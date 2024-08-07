import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Supplies extends Document {
  id: string;
  branchId: string;
  name: string;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const SuppliesSchema = new Schema<Supplies>(
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
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const SuppliesModel = model<Supplies>('Supplies', SuppliesSchema);
